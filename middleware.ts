import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  console.log("[Middleware] Processing request for:", request.nextUrl.pathname)
  
  // Create a response to modify
  const response = NextResponse.next()

  try {
    // Create a Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return request.cookies.get(name)?.value
          },
          set(name, value, options) {
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name, options) {
            response.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    // Get the session
    const { data: { session } } = await supabase.auth.getSession()

    const path = request.nextUrl.pathname

    // Protected routes
    if (!session && path.startsWith('/(dashboard)')) {
      console.log("[Middleware] No session, redirecting to login")
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Auth routes when logged in
    if (session && path.startsWith('/auth')) {
      console.log("[Middleware] Session exists, redirecting to dashboard")
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
  } catch (error) {
    console.error("[Middleware] Error:", error)
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

