import { hash } from "bcryptjs";
import { eq, and, gt, lt } from "drizzle-orm";
import { db } from "@/utils";
import { USERS, PASSWORD_RESET_TOKENS } from "@/utils/schema";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Missing token or password" }, { status: 400 });
    }

    const isStrongPassword =
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password);

    if (!isStrongPassword) {
      return NextResponse.json({
        error:
          "Password must be at least 8 characters long and include uppercase, lowercase, and a number.",
      }, { status: 400 });
    }

    // Look up the reset token
    const [tokenRecord] = await db
      .select()
      .from(PASSWORD_RESET_TOKENS)
      .where(and(
        eq(PASSWORD_RESET_TOKENS.token, token),
        gt(PASSWORD_RESET_TOKENS.expires, new Date())
      ));

    if (!tokenRecord) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    // Hash new password
    const hashed = await hash(password, 10);

    // Update password in USERS table
    await db.update(USERS)
      .set({ password: hashed })
      .where(eq(USERS.email, tokenRecord.email));

    // Delete used token
    await db.delete(PASSWORD_RESET_TOKENS)
      .where(eq(PASSWORD_RESET_TOKENS.token, token));

    // Optional: clean up old expired tokens
    await db.delete(PASSWORD_RESET_TOKENS)
      .where(lt(PASSWORD_RESET_TOKENS.expires, new Date()));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}