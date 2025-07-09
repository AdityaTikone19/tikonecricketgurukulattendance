import { NextResponse } from "next/server";
import { db } from "@/utils";
import { USERS, userSettings } from "@/utils/schema";
import { eq } from "drizzle-orm";

// GET /api/get-notifications
export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Find user by session token
    const user = await db
      .select()
      .from(USERS)
      .where(eq(USERS.sessionToken, token))
      .then((rows) => rows[0]);

    if (!user) {
      return NextResponse.json({ error: "Invalid session" }, { status: 403 });
    }

    // Get notification preferences
    const settings = await db
      .select({
        email: userSettings.emailNotifications,
        push: userSettings.pushNotifications,
        sms: userSettings.smsNotifications,
      })
      .from(userSettings)
      .where(eq(userSettings.email, user.email))
      .then((rows) => rows[0]);

    if (!settings) {
      return NextResponse.json(
        { email: false, push: false, sms: false }, // default values
        { status: 200 }
      );
    }

    return NextResponse.json(settings);
  } catch (err) {
    console.error("Get notification error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}