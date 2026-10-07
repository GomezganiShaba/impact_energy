import NextAuth from "next-auth";
import { authConfig } from "../auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth(async function middleware(req) {
  const host = req.headers.get("host") || "";
  const { pathname } = req.nextUrl;

  // Handle subdomain mail.ies.engineer (or mail.localhost in dev)
  const isMailSubdomain =
    host.startsWith("mail.") ||
    host.includes("mail.ies.engineer") ||
    host.includes("mail.localhost");

  if (isMailSubdomain) {
    // Rewrite requests on the mail subdomain to /mail
    if (pathname === "/" || pathname === "") {
      const url = req.nextUrl.clone();
      url.pathname = "/mail";
      return NextResponse.rewrite(url);
    }

    if (
      !pathname.startsWith("/mail") &&
      !pathname.startsWith("/api") &&
      !pathname.startsWith("/_next") &&
      !pathname.includes(".")
    ) {
      const url = req.nextUrl.clone();
      url.pathname = `/mail${pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - brand (brand images)
     * - images (project images)
     */
    "/((?!_next/static|_next/image|favicon.ico|brand/|images/).*)",
  ],
};
