// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token");
  // Redirect to login if no token is present and user tries to access protected routes
  if (!token && !req.nextUrl.pathname.startsWith("/api/auth")) {
    const loginUrl = new URL("/auth/login", req.url);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!auth|_next/static|favicon.ico).*)"], // Match all routes except /auth and static files
};
