"use client"

import type React from "react"
import { Header } from "@/components/header"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      console.log("[Dashboard] No authenticated user, redirecting to login")
      router.replace("/auth/login")
    }
  }, [user, isLoading, router])

  // Show loading state while checking auth
  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Loading Dashboard</h1>
          <p>Please wait...</p>
        </div>
      </div>
    )
  }

  // Render dashboard only when authenticated
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  )
}

