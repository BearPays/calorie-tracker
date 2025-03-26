"use client"

import { useMemo } from "react"
import { useMeals } from "@/lib/meal-context"

interface DailyCalorieChartProps {
  date: string
}

export function DailyCalorieChart({ date }: DailyCalorieChartProps) {
  const { getMealsForDay } = useMeals()

  // Use useMemo to prevent recalculations on every render
  const mealPercentages = useMemo(() => {
    const meals = getMealsForDay(date)

    // Calculate total calories
    const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0)

    // Calculate percentage for each meal
    const percentages = meals.map((meal) => ({
      ...meal,
      percentage: Math.round((meal.calories / (totalCalories || 1)) * 100),
    }))

    // Sort by calories (highest first)
    return percentages.sort((a, b) => b.calories - a.calories)
  }, [getMealsForDay, date])

  // Generate colors for the chart
  const colors = [
    "bg-primary",
    "bg-blue-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-teal-500",
    "bg-indigo-500",
  ]

  return (
    <div className="space-y-4">
      {mealPercentages.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">No meals logged for this day</div>
      ) : (
        <>
          <div className="h-4 w-full rounded-full overflow-hidden flex">
            {mealPercentages.map((meal, index) => (
              <div
                key={meal.id}
                className={`${colors[index % colors.length]} h-full`}
                style={{ width: `${meal.percentage}%` }}
                title={`${meal.name}: ${meal.calories} calories (${meal.percentage}%)`}
              />
            ))}
          </div>

          <div className="space-y-2">
            {mealPercentages.map((meal, index) => (
              <div key={meal.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className={`${colors[index % colors.length]} h-3 w-3 rounded-full mr-2`} />
                  <span>{meal.name}</span>
                </div>
                <div className="font-medium">{meal.calories} cal</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

