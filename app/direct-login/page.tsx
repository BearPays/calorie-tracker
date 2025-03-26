"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"

export default function DirectLoginPage() {
  const { login, user } = useAuth()
  const router = useRouter()
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const performLogin = async () => {
      if (status === "idle") {
        setStatus("loading")

        try {
          console.log("[DirectLogin] Attempting login")
          const success = await login("direct@example.com", "password")

          if (success) {
            setStatus("success")
            console.log("[DirectLogin] Login successful")

            // Wait a moment before redirecting
            setTimeout(() => {
              router.push("/dashboard")
            }, 1000)
          } else {
            setStatus("error")
            setError("Login failed")
          }
        } catch (err) {
          console.error("[DirectLogin] Error:", err)
          setStatus("error")
          setError("An unexpected error occurred")
        }
      }
    }

    performLogin()
  }, [login, router, status])

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      console.log("[DirectLogin] Already logged in, redirecting")
      router.push("/dashboard")
    }
  }, [user, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Direct Login</h1>

        {status === "loading" && <p className="mb-4">Logging you in automatically...</p>}

        {status === "success" && <p className="mb-4 text-green-600">Login successful! Redirecting to dashboard...</p>}

        {status === "error" && (
          <div className="mb-4">
            <p className="text-red-600 mb-2">{error}</p>
            <Button onClick={() => setStatus("idle")}>Try Again</Button>
          </div>
        )}

        <div className="mt-4">
          <Button variant="outline" onClick={() => router.push("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}

