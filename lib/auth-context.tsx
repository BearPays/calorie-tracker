"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"

type User = {
  id: string
  name: string
  email: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  authError: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Create a simple user for demo purposes
const DEMO_USER = {
  id: "demo-user-id",
  name: "Demo User",
  email: "demo@example.com",
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)
  const initializationComplete = useRef(false)

  // Load user from localStorage on mount - only once
  useEffect(() => {
    if (!initializationComplete.current) {
      console.log("[Auth] Initializing auth provider")

      try {
        const storedUser = localStorage.getItem("user")
        console.log("[Auth] Found stored user:", !!storedUser)

        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser)
            console.log("[Auth] Setting user from storage")
            setUser(parsedUser)
          } catch (parseError) {
            console.error("[Auth] Failed to parse user from storage:", parseError)
            localStorage.removeItem("user")
          }
        }
      } catch (error) {
        console.error("[Auth] Error accessing localStorage:", error)
      } finally {
        setIsLoading(false)
        initializationComplete.current = true
        console.log("[Auth] Initialization complete")
      }
    }
  }, [])

  const login = async (email: string, password: string) => {
    console.log("[Auth] Login attempt with:", email)
    setIsLoading(true)
    setAuthError(null)

    try {
      // For demo purposes, we'll just use a hardcoded user
      console.log("[Auth] Setting demo user")

      // Important: Set cookie to help with middleware
      document.cookie = "logged-in=true; path=/; max-age=86400"

      setUser(DEMO_USER)

      try {
        localStorage.setItem("user", JSON.stringify(DEMO_USER))
      } catch (storageError) {
        console.error("[Auth] Error saving to localStorage:", storageError)
      }

      return true
    } catch (error) {
      console.error("[Auth] Login error:", error)
      setAuthError("Login failed")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    console.log("[Auth] Register attempt with:", name, email)
    setIsLoading(true)
    setAuthError(null)

    try {
      const newUser = {
        id: Date.now().toString(),
        name: name || "New User",
        email: email || "new@example.com",
      }

      // Important: Set cookie to help with middleware
      document.cookie = "logged-in=true; path=/; max-age=86400"

      setUser(newUser)

      try {
        localStorage.setItem("user", JSON.stringify(newUser))
      } catch (storageError) {
        console.error("[Auth] Error saving to localStorage:", storageError)
      }

      return true
    } catch (error) {
      console.error("[Auth] Registration error:", error)
      setAuthError("Registration failed")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    console.log("[Auth] Logging out")

    // Clear the cookie
    document.cookie = "logged-in=; path=/; max-age=0"

    setUser(null)
    setAuthError(null)

    try {
      localStorage.removeItem("user")
    } catch (error) {
      console.error("[Auth] Error removing from localStorage:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoading,
        authError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

