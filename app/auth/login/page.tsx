"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, isLoading, authError, user } = useAuth()
  const router = useRouter()
  const [loginInProgress, setLoginInProgress] = useState(false)

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      console.log("[LoginPage] User already logged in, redirecting to dashboard")
      router.replace("/dashboard")
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoginInProgress(true)

    try {
      const success = await login(email, password)
      console.log("[LoginPage] Login result:", success)
      
      if (success) {
        // After successful login, redirect to dashboard
        router.replace("/dashboard")
      } else {
        setError(authError || "Login failed. Please check your credentials.")
      }
    } catch (err) {
      console.error("[LoginPage] Error during login:", err)
      setError("An unexpected error occurred")
    } finally {
      setLoginInProgress(false)
    }
  }

  // Show a loading state during initial auth check
  if (isLoading && !loginInProgress) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Loading</h1>
          <p>Please wait...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Enter your email and password to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
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
                required
                disabled={isLoading || loginInProgress}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading || loginInProgress}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading || loginInProgress}>
              {loginInProgress ? "Logging in..." : "Login"}
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

