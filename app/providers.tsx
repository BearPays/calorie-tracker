"use client"

import type { ReactNode } from "react"
import { AuthProvider } from "@/lib/auth-context"
import { MealProvider } from "@/lib/meal-context"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <MealProvider>{children}</MealProvider>
    </AuthProvider>
  )
}

