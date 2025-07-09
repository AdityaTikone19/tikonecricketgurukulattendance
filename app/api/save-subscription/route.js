import { db } from "@/utils";
import { USERS, userSettings } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const user = await db
      .select()
      .from(USERS)
      .where(eq(USERS.sessionToken, token))
      .then((rows) => rows[0]);

    if (!user) {
      return NextResponse.json({ error: "Invalid session" }, { status: 403 });
    }

    await db
      .update(userSettings)
      .set({ pushSubscription: JSON.stringify(body) })
      .where(eq(userSettings.email, user.email));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error saving subscription:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
