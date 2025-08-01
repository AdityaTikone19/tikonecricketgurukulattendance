import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token");

  // If token not present and accessing a protected route
  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
