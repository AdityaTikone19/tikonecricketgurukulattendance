import { NextResponse } from "next/server";
import { db } from "@/utils";
import { USERS, userSettings } from "@/utils/schema";
import { eq } from "drizzle-orm";

// POST /api/update-notifications
export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const body = await req.json();

    // Validate inputs
    const notifyEmail = typeof body.email === "boolean" ? body.email : undefined;
    const push = typeof body.push === "boolean" ? body.push : undefined;
    const sms = typeof body.sms === "boolean" ? body.sms : undefined;

    if (notifyEmail === undefined && push === undefined && sms === undefined) {
      return NextResponse.json({ error: "No valid fields provided." }, { status: 400 });
    }

    const user = await db
      .select()
      .from(USERS)
      .where(eq(USERS.sessionToken, token))
      .then((rows) => rows[0]);

    if (!user) return NextResponse.json({ error: "Invalid session" }, { status: 403 });

    // Check if settings already exist
    const existing = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.email, user.email))
      .then((rows) => rows[0]);

    const updateFields = {
      ...(notifyEmail !== undefined && { emailNotifications: notifyEmail }),
      ...(push !== undefined && { pushNotifications: push }),
      ...(sms !== undefined && { smsNotifications: sms }),
    };

    if (existing) {
      if (Object.keys(updateFields).length > 0) {
        await db.update(userSettings).set(updateFields).where(eq(userSettings.email, user.email));
      } else {
        return NextResponse.json({ error: "No values to update." }, { status: 400 });
      }
    } else {
      await db.insert(userSettings).values({
        email: user.email,
        ...updateFields,
      });
    }

    return NextResponse.json({ message: "Notification preferences updated." });
  } catch (err) {
    console.error("Update notification error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}