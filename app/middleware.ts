import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/login"];

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { pathname } = request.nextUrl;

  // If user is not authenticated and trying to access protected route
  if (!session && protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is authenticated but trying to access auth routes
  if (session && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Check if trying to access waitlist page (owner-only)
  if (pathname.startsWith("/waitlist/") && !pathname.includes("/api/")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Extract slug from pathname
    const slug = pathname.split("/waitlist/")[1];
    if (slug) {
      try {
        // Check if user owns this waitlist
        const response = await fetch(
          `${request.nextUrl.origin}/api/waitlist/${slug}/owner-check`,
          {
            headers: {
              cookie: request.headers.get("cookie") || "",
            },
          }
        );

        if (!response.ok) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        const { isOwner } = await response.json();
        if (!isOwner) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      } catch (error) {
        console.error("Error checking waitlist ownership:", error);
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
