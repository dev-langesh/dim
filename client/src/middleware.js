import { NextResponse } from "next/server";

export async function middleware(req) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  function redirectToLoginPage() {
    return NextResponse.redirect(
      new URL("/auth/login/?redirectUrl=" + req.url, req.url)
    );
  }

  const isPrivateRoute = req.nextUrl.pathname.startsWith("/project");

  if (isPrivateRoute && !accessToken) return redirectToLoginPage();

  return NextResponse.next();
}

export const config = {
  matcher: ["/project/:path*"],
};
