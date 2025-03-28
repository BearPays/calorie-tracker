"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  isLoading: boolean
  authError: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)
  const router = useRouter()
  const initialized = useRef(false)

  useEffect(() => {
    const initializeAuth = async () => {
      if (initialized.current) return
      initialized.current = true
      
      try {
        // Get initial session
        const { data } = await supabase.auth.getSession()
        setUser(data.session?.user || null)
        console.log("[Auth] Initial session user:", data.session?.user?.email || "none")
        
        // Set up auth listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          console.log("[Auth] Auth state changed:", event, "User:", session?.user?.email || "none")
          setUser(session?.user || null)
          
          // Handle auth events
          if (event === 'SIGNED_IN') {
            // Stay on current page, let the component handle redirect
          } else if (event === 'SIGNED_OUT') {
            router.push('/auth/login')
          }
        })
        
        return () => subscription.unsubscribe()
      } catch (error) {
        console.error("[Auth] Initialization error:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    initializeAuth()
  }, [router])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setAuthError(null)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        console.error("[Auth] Login error:", error.message)
        setAuthError(error.message)
        return false
      }
      
      if (!data.session) {
        console.error("[Auth] No session after login")
        setAuthError("Failed to establish session")
        return false
      }
      
      // Successfully logged in
      console.log("[Auth] Login successful for:", email)
      return true
    } catch (error: any) {
      console.error("[Auth] Login exception:", error.message)
      setAuthError(error.message || "An unexpected error occurred")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    setAuthError(null)
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      })
      
      if (error) {
        console.error("[Auth] Registration error:", error.message)
        setAuthError(error.message)
        return false
      }
      
      console.log("[Auth] Registration successful for:", email)
      return true
    } catch (error: any) {
      console.error("[Auth] Registration exception:", error.message)
      setAuthError(error.message || "Registration failed")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    
    try {
      await supabase.auth.signOut()
      console.log("[Auth] Logout successful")
    } catch (error: any) {
      console.error("[Auth] Logout error:", error.message)
      setAuthError(error.message || "Logout failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, authError }}>
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

