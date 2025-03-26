"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function AutoLoginPage() {
  const { login, isLoading, user } = useAuth()
  const router = useRouter()
  const [loginAttempted, setLoginAttempted] = useState(false)

  useEffect(() => {
    const autoLogin = async () => {
      if (!loginAttempted && !isLoading && !user) {
        setLoginAttempted(true)
        try {
          await login("auto@example.com", "password")
        } catch (error) {
          console.error("Auto login error:", error)
        }
      }
    }

    autoLogin()
  }, [login, isLoading, user, loginAttempted])

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Auto Login</h1>
        <p className="mb-4">Attempting to log you in automatically...</p>
        <p className="text-sm text-muted-foreground">If you are not redirected, please check the console for errors.</p>
      </div>
    </div>
  )
}

