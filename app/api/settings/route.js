import { db } from "@/utils";
import { userSettings } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Helper: Extract email from cookie
function getEmailFromCookie() {
  const token = cookies().get("token")?.value;
  if (!token) return null;

  // Simplified: treat token as email string
  return token;

  // If using JWT or other encoding, decode here:
  // const { email } = decodeJwt(token);
  // return email;
}

export async function GET() {
  const email = getEmailFromCookie();
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.email, email))
      .limit(1);

    const settings = result[0] || {};

    return NextResponse.json(settings, { status: 200 });
  } catch (err) {
    console.error("❌ Error fetching settings:", err);
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

export async function POST(req) {
  const email = getEmailFromCookie();
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    await db
      .insert(userSettings)
      .values({
        email,
        name: body.name,
        bio: body.bio,
        theme: body.theme,
        emailNotifications: body.emailNotifications,
        smsNotifications: body.smsNotifications,
      })
      .onDuplicateKeyUpdate({
        set: {
          name: body.name,
          bio: body.bio,
          theme: body.theme,
          emailNotifications: body.emailNotifications,
          smsNotifications: body.smsNotifications,
        },
      });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("❌ Error saving settings:", err);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
