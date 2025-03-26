import { NextResponse } from 'next/server'
import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { userInput } = await request.json()

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful nutrition assistant that provides information about meals, calories, and nutritional content."
        },
        {
          role: "user",
          content: `
            Please analyze this meal and provide information about:
            - Estimated calories
            - Portion sizes
            - Nutritional information
            - Suggestions for healthier alternatives if applicable
            
            Meal description: ${userInput}
            
            Please respond in a friendly, helpful tone. Keep your response concise and focused on the nutritional aspects.
          `
        }
      ],
    })

    return NextResponse.json({ 
      response: completion.choices[0]?.message?.content || "Sorry, I was unable to analyze your meal. Please try again." 
    })
  } catch (error) {
    console.error("Error getting meal clarification:", error)
    return NextResponse.json({ 
      response: "Sorry, I was unable to analyze your meal. Please try again." 
    }, { status: 500 })
  }
} 