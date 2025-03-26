"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"
import { usePathname } from "next/navigation"

export function Header() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  // Don't show header on auth pages
  if (pathname.startsWith("/auth")) {
    return null
  }

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold text-lg flex items-center">
            <span className="text-primary mr-2">Nutri</span>Track
          </Link>

          {user && (
            <nav className="hidden md:flex gap-6">
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/meals"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/meals" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Meal History
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          <ModeToggle />

          {user ? (
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          ) : (
            <Button asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

