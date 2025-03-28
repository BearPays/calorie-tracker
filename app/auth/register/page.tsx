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

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [registerStatus, setRegisterStatus] = useState<"idle" | "pending" | "success" | "error">("idle")
  const { register, isLoading, user, authError } = useAuth()
  const router = useRouter()
  const redirectAttempted = useRef(false)

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user && !redirectAttempted.current) {
      console.log("[Register] User is logged in, redirecting to dashboard")
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
    console.log("[Register] Form submitted")
    setError("")
    setRegisterStatus("pending")

    try {
      const success = await register(name, email, password)

      if (success) {
        setRegisterStatus("success")
        console.log("[Register] Registration successful")

        // Reset the redirect flag to allow a new redirect attempt
        redirectAttempted.current = false
      } else {
        setRegisterStatus("error")
        setError(authError || "Registration failed")
      }
    } catch (error) {
      console.error("[Register] Error during registration:", error)
      setRegisterStatus("error")
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
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Enter your details to create your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {(error || authError) && (
              <Alert variant="destructive">
                <AlertDescription>{error || authError}</AlertDescription>
              </Alert>
            )}

            {registerStatus === "success" && (
              <Alert>
                <AlertDescription>Registration successful! Redirecting...</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading || registerStatus === "pending"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || registerStatus === "pending"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || registerStatus === "pending"}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading || registerStatus === "pending"}>
              {registerStatus === "pending" ? "Creating account..." : "Create account"}
            </Button>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

