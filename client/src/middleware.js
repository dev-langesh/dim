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

  if (isPrivateRoute) {
    if (!accessToken) return redirectToLoginPage();

    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/user/profile",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`,
          },
        }
      );

      if (res.status !== 200) return redirectToLoginPage();
    } catch (e) {
      console.log(e);
      return redirectToLoginPage();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/project/:path*"],
};
