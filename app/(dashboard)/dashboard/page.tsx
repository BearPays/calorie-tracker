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
    // Only redirect if we're sure the user is not logged in
    if (!isLoading && !user && !redirectAttempted.current) {
      console.log("[Dashboard] User not logged in, redirecting to login")
      redirectAttempted.current = true

      // Use a timeout to avoid immediate redirect which can cause issues
      const redirectTimer = setTimeout(() => {
        router.push("/auth/login")
      }, 100)

      return () => clearTimeout(redirectTimer)
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
          <Button onClick={() => router.push("/auth/login")}>Go to Login</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Welcome back, {user.name}</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Log a Meal</CardTitle>
            <CardDescription>Record what you ate and track your calories</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <div className="flex">
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setDate(getCurrentDate())}
                    className="ml-2"
                  >
                    <Calendar className="h-4 w-4" />
                    <span className="sr-only">Today</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meal-name">Meal Name</Label>
                <Input
                  id="meal-name"
                  placeholder="Breakfast, Lunch, Dinner, etc."
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="foods">Foods</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => setShowAIAssistant(true)}
                  >
                    <PlusCircle className="mr-1 h-3 w-3" />
                    AI Assistant
                  </Button>
                </div>
                <Textarea
                  id="foods"
                  placeholder="Enter foods, separated by commas"
                  value={foods}
                  onChange={(e) => setFoods(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="calories">Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="Total calories"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full">
                Log Meal
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Summary</CardTitle>
            <CardDescription>{formatDateForDisplay(date)}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Calories</span>
                <span className="text-2xl font-bold">{totalCalories}</span>
              </div>
              <DailyCalorieChart date={date} />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Meals</CardTitle>
            <CardDescription>Your last few logged meals</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentMeals />
          </CardContent>
        </Card>
      </div>

      {showAIAssistant && (
        <MealAIAssistant
          onClose={() => setShowAIAssistant(false)}
          onAddFoods={(foodsText, caloriesValue) => {
            setFoods(foodsText)
            setCalories(caloriesValue)
            setShowAIAssistant(false)
          }}
        />
      )}
    </div>
  )
}

