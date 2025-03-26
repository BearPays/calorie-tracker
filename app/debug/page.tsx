"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useMeals } from "@/lib/meal-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function DebugPage() {
  const { user, isLoading: authLoading, login, logout } = useAuth()
  const { meals } = useMeals()
  const router = useRouter()
  const [localStorageContent, setLocalStorageContent] = useState<Record<string, any>>({})

  useEffect(() => {
    try {
      const content: Record<string, any> = {}

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) {
          try {
            content[key] = JSON.parse(localStorage.getItem(key) || "null")
          } catch {
            content[key] = localStorage.getItem(key)
          }
        }
      }

      setLocalStorageContent(content)
    } catch (error) {
      console.error("Error reading localStorage:", error)
    }
  }, [user, meals])

  const handleClearStorage = () => {
    try {
      localStorage.clear()
      window.location.reload()
    } catch (error) {
      console.error("Error clearing localStorage:", error)
    }
  }

  const handleForceLogin = async () => {
    await login("debug@example.com", "password")
    router.push("/dashboard")
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Debug Page</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Authentication State</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p>
                  <strong>Loading:</strong> {authLoading ? "Yes" : "No"}
                </p>
                <p>
                  <strong>User:</strong> {user ? "Logged In" : "Not Logged In"}
                </p>
                {user && (
                  <div className="mt-2 space-y-1">
                    <p>
                      <strong>ID:</strong> {user.id}
                    </p>
                    <p>
                      <strong>Name:</strong> {user.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button onClick={handleForceLogin}>Force Login</Button>
                <Button variant="outline" onClick={() => logout()}>
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meal State</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Total Meals:</strong> {meals.length}
            </p>
            {meals.length > 0 && (
              <div className="mt-4">
                <p>
                  <strong>Latest Meal:</strong>
                </p>
                <pre className="mt-2 p-2 bg-muted rounded-md overflow-auto text-xs">
                  {JSON.stringify(meals[meals.length - 1], null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>LocalStorage Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-4">
              <Button variant="destructive" onClick={handleClearStorage}>
                Clear All Storage
              </Button>
            </div>

            <pre className="p-4 bg-muted rounded-md overflow-auto text-xs">
              {JSON.stringify(localStorageContent, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-center">
        <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
      </div>
    </div>
  )
}

