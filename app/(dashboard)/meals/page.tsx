"use client"

import { useState } from "react"
import { useMeals, type Meal } from "@/lib/meal-context"
import { formatDateForDisplay } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react"

export default function MealsPage() {
  const { meals, deleteMeal } = useMeals()
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("")

  // Group meals by date
  const mealsByDate = meals
    .filter(
      (meal) =>
        meal.name.toLowerCase().includes(searchTerm.toLowerCase()) && (dateFilter ? meal.date === dateFilter : true),
    )
    .reduce(
      (acc, meal) => {
        if (!acc[meal.date]) {
          acc[meal.date] = []
        }
        acc[meal.date].push(meal)
        return acc
      },
      {} as Record<string, Meal[]>,
    )

  // Sort dates in descending order
  const sortedDates = Object.keys(mealsByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Meal History</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <Input
            id="search"
            placeholder="Search meals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="date-filter" className="sr-only">
            Filter by date
          </Label>
          <Input id="date-filter" type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
        </div>
        {dateFilter && (
          <Button variant="ghost" onClick={() => setDateFilter("")}>
            Clear Filter
          </Button>
        )}
      </div>

      {sortedDates.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No meals found</h2>
          <p className="text-muted-foreground">
            {searchTerm || dateFilter
              ? "Try adjusting your search or filter"
              : "Start logging your meals to see them here"}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date}>
              <h2 className="text-xl font-semibold mb-4">{formatDateForDisplay(date)}</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mealsByDate[date].map((meal) => (
                  <Card key={meal.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle>{meal.name}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMeal(meal.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                      <CardDescription>{meal.calories} calories</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside text-sm">
                        {meal.foods.map((food, index) => (
                          <li key={index}>{food}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

