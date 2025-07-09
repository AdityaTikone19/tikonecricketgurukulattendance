import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { v4 as uuid } from "uuid";
import { db } from "@/utils";
import { eq } from "drizzle-orm";
import { USERS, PASSWORD_RESET_TOKENS } from "@/utils/schema.js";

export async function POST(req) {
  const { email } = await req.json();

  // ✅ 1. Check if user exists
  const users = await db.select().from(USERS).where(eq(USERS.email, email));
  const user = users[0];
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // ✅ 2. Generate token and expiration
  const token = uuid();
  const expires = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

  // ✅ 3. Remove old tokens
  await db.delete(PASSWORD_RESET_TOKENS).where(eq(PASSWORD_RESET_TOKENS.email, email));

  // ✅ 4. Save new token
  await db.insert(PASSWORD_RESET_TOKENS).values({ email, token, expires });

  // ✅ 5. Prepare reset link
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/login/reset-password?token=${token}`;

  // ✅ 6. Send email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      to: email,
      subject: "Reset Your Password",
      html: `
        <p>You requested a password reset.</p>
        <p>Click <a href="${resetLink}">here</a> to reset your password.</p>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to send email:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
