"use client"

import { useMemo } from "react"
import { useMeals } from "@/lib/meal-context"
import { formatDateForDisplay } from "@/lib/utils"

export function RecentMeals() {
  const { meals } = useMeals()

  // Use useMemo to prevent recalculations on every render
  const recentMeals = useMemo(() => {
    return [...meals].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)
  }, [meals])

  return (
    <div className="space-y-4">
      {recentMeals.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">No meals logged yet</div>
      ) : (
        <ul className="space-y-4">
          {recentMeals.map((meal) => (
            <li key={meal.id} className="border-b pb-4 last:border-b-0 last:pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{meal.name}</h3>
                  <p className="text-sm text-muted-foreground">{formatDateForDisplay(meal.date)}</p>
                </div>
                <span className="font-medium">{meal.calories} cal</span>
              </div>
              <p className="text-sm mt-1 line-clamp-1">{meal.foods.join(", ")}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

