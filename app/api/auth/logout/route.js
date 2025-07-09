import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out' });

  // Clear the cookie
  response.cookies.set('token', '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0), // Expire immediately
  });

  return response;
}