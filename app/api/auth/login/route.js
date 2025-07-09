import { NextResponse } from 'next/server';
import { db } from '@/utils';
import { USERS } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// POST /api/auth/login
export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const normalizedEmail = email.trim().toLowerCase();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    // Fetch user from DB
    const user = await db
      .select()
      .from(USERS)
      .where(eq(USERS.email, normalizedEmail))
      .then(rows => rows[0]);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Create session token (for now, random UUID; switch to JWT later if needed)
    const sessionToken = crypto.randomUUID();

    await db
      .update(USERS)
      .set({ sessionToken })
      .where(eq(USERS.email, normalizedEmail));

    // Generate Gravatar image from email hash
    const gravatarHash = crypto
      .createHash('md5')
      .update(normalizedEmail)
      .digest('hex');

    const image = `https://www.gravatar.com/avatar/${gravatarHash}?d=identicon`;

    // Respond with user info and set secure session cookie
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        name: user.name || 'User',
        email: user.email,
        image,
      },
    });

    response.cookies.set('token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return response;

  } catch (err) {
    console.error('Login Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}