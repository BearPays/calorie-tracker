export async function getMealClarification(userInput: string): Promise<string> {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput }),
    })

    if (!response.ok) {
      throw new Error('Failed to get AI response')
    }

    const data = await response.json()
    return data.response
  } catch (error) {
    console.error("Error getting meal clarification:", error)
    return "Sorry, I was unable to analyze your meal. Please try again."
  }
}

