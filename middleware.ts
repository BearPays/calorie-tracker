import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Check if the user is logged in
  const isLoggedIn = request.cookies.has("logged-in")

  // Define public routes that don't require authentication
  const isPublicRoute = path === "/" || path.startsWith("/auth") || path === "/auto-login" || path === "/debug"

  console.log(`[Middleware] Path: ${path}, LoggedIn: ${isLoggedIn}, PublicRoute: ${isPublicRoute}`)

  // Redirect unauthenticated users to login
  if (!isLoggedIn && !isPublicRoute) {
    console.log("[Middleware] Redirecting to login")
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // Prevent authenticated users from accessing auth pages
  if (isLoggedIn && path.startsWith("/auth")) {
    console.log("[Middleware] Redirecting to dashboard")
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

