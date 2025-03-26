"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      console.log("[Home] User is logged in, redirecting to dashboard")
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">NutriTrack</h1>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">NutriTrack</h1>
          <p className="mb-4">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold">NutriTrack</h1>
          <p className="mt-2 text-lg text-muted-foreground">Track your meals and calories with AI assistance</p>
        </div>

        <div className="space-y-4">
          <Button size="lg" className="w-full" onClick={() => router.push("/auth/login")}>
            Login
          </Button>

          <Button size="lg" variant="outline" className="w-full" onClick={() => router.push("/auth/register")}>
            Register
          </Button>

          <Button size="lg" variant="secondary" className="w-full" onClick={() => router.push("/direct-login")}>
            Direct Login (Skip Form)
          </Button>

          <Button size="lg" variant="link" className="w-full" onClick={() => router.push("/debug")}>
            Debug Page
          </Button>
        </div>
      </div>
    </div>
  )
}

