"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"
import { debug } from "./debug"

export type Meal = {
  id: string
  name: string
  foods: string[]
  calories: number
  date: string
  userId: string
}

type MealContextType = {
  meals: Meal[]
  addMeal: (meal: Omit<Meal, "id">) => void
  deleteMeal: (id: string) => void
  getTotalCaloriesForDay: (date: string) => number
  getMealsForDay: (date: string) => Meal[]
}

const MealContext = createContext<MealContextType | undefined>(undefined)

export function MealProvider({ children }: { children: ReactNode }) {
  const [meals, setMeals] = useState<Meal[]>([])
  const [initialized, setInitialized] = useState(false)

  // Load meals from localStorage only once on mount
  useEffect(() => {
    if (!initialized) {
      debug("MealProvider - initializing")
      try {
        const storedMeals = localStorage.getItem("meals")
        debug("Stored meals from localStorage:", storedMeals ? "Found" : "Not found")

        if (storedMeals) {
          const parsedMeals = JSON.parse(storedMeals)
          debug("Setting meals from localStorage, count:", parsedMeals.length)
          setMeals(parsedMeals)
        }
      } catch (error) {
        debug("Error loading meals from localStorage:", error)
      } finally {
        setInitialized(true)
        debug("MealProvider initialized")
      }
    }
  }, [initialized])

  // Save meals to localStorage whenever they change
  useEffect(() => {
    if (initialized) {
      debug("Meals changed, saving to localStorage, count:", meals.length)
      try {
        localStorage.setItem("meals", JSON.stringify(meals))
      } catch (error) {
        debug("Error saving meals to localStorage:", error)
      }
    }
  }, [meals, initialized])

  const addMeal = useCallback((meal: Omit<Meal, "id">) => {
    debug("Adding meal:", meal)
    const newMeal = {
      ...meal,
      id: Date.now().toString(),
    }
    setMeals((prevMeals) => [...prevMeals, newMeal])
  }, [])

  const deleteMeal = useCallback((id: string) => {
    debug("Deleting meal with id:", id)
    setMeals((prevMeals) => prevMeals.filter((meal) => meal.id !== id))
  }, [])

  const getTotalCaloriesForDay = useCallback(
    (date: string) => {
      const total = meals.filter((meal) => meal.date === date).reduce((total, meal) => total + meal.calories, 0)

      debug("Total calories for", date, ":", total)
      return total
    },
    [meals],
  )

  const getMealsForDay = useCallback(
    (date: string) => {
      const filteredMeals = meals.filter((meal) => meal.date === date)
      debug("Meals for", date, ":", filteredMeals.length)
      return filteredMeals
    },
    [meals],
  )

  return (
    <MealContext.Provider
      value={{
        meals,
        addMeal,
        deleteMeal,
        getTotalCaloriesForDay,
        getMealsForDay,
      }}
    >
      {children}
    </MealContext.Provider>
  )
}

export function useMeals() {
  const context = useContext(MealContext)
  if (context === undefined) {
    throw new Error("useMeals must be used within a MealProvider")
  }
  return context
}

