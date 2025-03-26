"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [email, setEmail] = useState("demo@example.com")
  const [password, setPassword] = useState("password")
  const [error, setError] = useState("")
  const [loginStatus, setLoginStatus] = useState<"idle" | "pending" | "success" | "error">("idle")
  const { login, isLoading, user, authError } = useAuth()
  const router = useRouter()
  const redirectAttempted = useRef(false)

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user && !redirectAttempted.current) {
      console.log("[Login] User is logged in, redirecting to dashboard")
      redirectAttempted.current = true

      // Use a timeout to avoid immediate redirect which can cause issues
      const redirectTimer = setTimeout(() => {
        router.push("/dashboard")
      }, 100)

      return () => clearTimeout(redirectTimer)
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[Login] Form submitted")
    setError("")
    setLoginStatus("pending")

    try {
      const success = await login(email, password)

      if (success) {
        setLoginStatus("success")
        console.log("[Login] Login successful")

        // Reset the redirect flag to allow a new redirect attempt
        redirectAttempted.current = false
      } else {
        setLoginStatus("error")
        setError(authError || "Login failed")
      }
    } catch (error) {
      console.error("[Login] Error during login:", error)
      setLoginStatus("error")
      setError("An unexpected error occurred")
    }
  }

  const handleSimpleLogin = async () => {
    console.log("[Login] Simple login clicked")
    setError("")
    setLoginStatus("pending")

    try {
      const success = await login("demo@example.com", "password")

      if (success) {
        setLoginStatus("success")
        console.log("[Login] Simple login successful")

        // Reset the redirect flag to allow a new redirect attempt
        redirectAttempted.current = false
      } else {
        setLoginStatus("error")
        setError(authError || "Login failed")
      }
    } catch (error) {
      console.error("[Login] Error during simple login:", error)
      setLoginStatus("error")
      setError("An unexpected error occurred")
    }
  }

  // If we're already logged in, show a loading state
  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Already logged in</h1>
          <p className="mb-4">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Enter your email and password to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {(error || authError) && (
              <Alert variant="destructive">
                <AlertDescription>{error || authError}</AlertDescription>
              </Alert>
            )}

            {loginStatus === "success" && (
              <Alert>
                <AlertDescription>Login successful! Redirecting...</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || loginStatus === "pending"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || loginStatus === "pending"}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading || loginStatus === "pending"}>
              {loginStatus === "pending" ? "Logging in..." : "Login"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={handleSimpleLogin}
              disabled={isLoading || loginStatus === "pending"}
            >
              One-Click Login (No Validation)
            </Button>

            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-primary hover:underline">
                Register
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

