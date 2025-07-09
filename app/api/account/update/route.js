import { db } from "@/utils";
import { USERS } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Look up user by sessionToken
    const user = await db
      .select()
      .from(USERS)
      .where(eq(USERS.sessionToken, token))
      .then(rows => rows[0]);

    if (!user) {
      return NextResponse.json({ error: "Invalid session" }, { status: 403 });
    }

    const body = await req.json();

    // Update user email (you can extend this)
    await db
      .update(USERS)
      .set({ email: body.email })
      .where(eq(USERS.id, user.id));

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err) {
    console.error("❌ Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}