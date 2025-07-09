import { NextResponse } from "next/server";
import { db } from "@/utils";
import { USERS } from "@/utils/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

// POST /api/change-password
export async function POST(req) {
  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Missing password fields" },
        { status: 400 }
      );
    }

    const cookieStore = cookies();
    const sessionToken = cookieStore.get("token")?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const user = await db
      .select()
      .from(USERS)
      .where(eq(USERS.sessionToken, sessionToken))
      .then((rows) => rows[0]);

    if (!user) {
      return NextResponse.json({ error: "Invalid session" }, { status: 403 });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Incorrect current password" }, { status: 401 });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await db
      .update(USERS)
      .set({ password: hashedNewPassword })
      .where(eq(USERS.id, user.id));

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Change Password Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}