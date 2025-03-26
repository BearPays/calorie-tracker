"use client"

import type React from "react"

import { useState } from "react"
import { getMealClarification } from "@/lib/ai-service"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Send, Loader2 } from "lucide-react"

interface MealAIAssistantProps {
  onClose: () => void
  onAddFoods: (foods: string, calories: string) => void
}

export function MealAIAssistant({ onClose, onAddFoods }: MealAIAssistantProps) {
  const [input, setInput] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [extractedFoods, setExtractedFoods] = useState("")
  const [extractedCalories, setExtractedCalories] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    setIsLoading(true)
    setResponse("")

    try {
      const aiResponse = await getMealClarification(input)
      setResponse(aiResponse)

      // Try to extract foods and calories from the response
      const calorieMatch = aiResponse.match(/(\d+)\s*calories/i)
      if (calorieMatch) {
        setExtractedCalories(calorieMatch[1])
      }

      // Extract food items - this is a simple approach
      const foodItems = input
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
        .join(", ")

      setExtractedFoods(foodItems)
    } catch (error) {
      console.error("Error getting AI response:", error)
      setResponse("Sorry, there was an error processing your request. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg max-h-[80vh] flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>AI Meal Assistant</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <CardDescription>Describe your meal and get nutritional insights</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Describe your meal (e.g., 'I had a chicken sandwich with fries and a soda')"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[100px]"
              />
              <Button type="submit" className="w-full" disabled={isLoading || !input.trim()}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Get Insights
                  </>
                )}
              </Button>
            </div>
          </form>

          {response && (
            <div className="mt-6 space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-medium mb-2">AI Analysis</h3>
                <div className="text-sm whitespace-pre-wrap">{response}</div>
              </div>

              {(extractedFoods || extractedCalories) && (
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-2">Extracted Information</h3>
                  {extractedFoods && (
                    <div className="mb-2">
                      <span className="text-sm font-medium">Foods:</span>
                      <span className="text-sm ml-2">{extractedFoods}</span>
                    </div>
                  )}
                  {extractedCalories && (
                    <div>
                      <span className="text-sm font-medium">Estimated Calories:</span>
                      <span className="text-sm ml-2">{extractedCalories}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>

        {response && (
          <CardFooter className="border-t pt-4">
            <Button
              onClick={() => onAddFoods(extractedFoods, extractedCalories)}
              className="w-full"
              disabled={!extractedFoods && !extractedCalories}
            >
              Use This Information
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

