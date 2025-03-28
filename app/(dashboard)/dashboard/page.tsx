"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useMeals } from "@/lib/meal-context"
import { getCurrentDate, formatDateForDisplay } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Calendar } from "lucide-react"
import { MealAIAssistant } from "../components/meal-ai-assistant"
import { DailyCalorieChart } from "../components/daily-calorie-chart"
import { RecentMeals } from "../components/recent-meals"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const { addMeal, getTotalCaloriesForDay } = useMeals()
  const [date, setDate] = useState(getCurrentDate())
  const [mealName, setMealName] = useState("")
  const [foods, setFoods] = useState("")
  const [calories, setCalories] = useState("")
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const router = useRouter()
  const redirectAttempted = useRef(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user && !redirectAttempted.current) {
      console.log("[Dashboard] User not logged in, redirecting to login")
      redirectAttempted.current = true
      router.replace("/auth/login")
    }
  }, [user, isLoading, router])

  const totalCalories = getTotalCaloriesForDay(date)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!mealName || !foods || !calories || !user) {
      return
    }

    addMeal({
      name: mealName,
      foods: foods.split(",").map((food) => food.trim()),
      calories: Number.parseInt(calories),
      date,
      userId: user.id,
    })

    // Reset form
    setMealName("")
    setFoods("")
    setCalories("")
  }

  // Show loading state if auth is still loading
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Loading</h1>
          <p>Please wait...</p>
        </div>
      </div>
    )
  }

  // Show message if not logged in (this should redirect quickly)
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Not Logged In</h1>
          <p className="mb-4">Redirecting to login...</p>
          <Button onClick={() => router.replace("/auth/login")}>Go to Login</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Welcome back, {user.email}</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Add New Meal</CardTitle>
            <CardDescription>Track your calories for today</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mealName">Meal Name</Label>
                <Input
                  id="mealName"
                  placeholder="e.g., Breakfast"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="foods">Foods (comma-separated)</Label>
                <Input
                  id="foods"
                  placeholder="e.g., eggs, toast, coffee"
                  value={foods}
                  onChange={(e) => setFoods(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="calories">Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="e.g., 500"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Meal
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Summary</CardTitle>
            <CardDescription>Your calorie intake for {formatDateForDisplay(date)}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCalories}</div>
            <p className="text-sm text-muted-foreground">calories consumed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Assistant</CardTitle>
            <CardDescription>Get help with meal planning</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowAIAssistant(!showAIAssistant)}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {showAIAssistant ? "Hide Assistant" : "Show Assistant"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {showAIAssistant && (
        <MealAIAssistant 
          onClose={() => setShowAIAssistant(false)}
          onAddFoods={(foods, calories) => {
            setFoods(foods)
            setCalories(calories)
            setShowAIAssistant(false)
          }}
        />
      )}

      <div className="mt-8">
        <DailyCalorieChart date={date} />
      </div>

      <div className="mt-8">
        <RecentMeals />
      </div>
    </div>
  )
}

