

# 📄 Project Requirements Document (`PRD.md`)

## 🔖 Project Overview

**Project Name:** AI-Powered Calorie & Macro Tracker  
**Type:** Web-based Progressive Web App (PWA)  
**Framework:** Next.js (App Router)  
**Database:** Neon PostgreSQL  
**AI Framework:** LangChain with GPT-4 Turbo (OpenAI)  
**Hosting:** Vercel  

---

## 🎯 Objectives

- Provide users with an intuitive, conversational method of calorie counting using AI.
- Significantly reduce friction found in traditional calorie tracking apps.
- Accurately estimate and log calories and macronutrients (protein, carbohydrates, fats).
- Simplify manual data entry through structured conversational clarification.

---

## 🚩 Target Audience

- Health-conscious individuals looking for a simpler calorie-counting experience.
- Users frustrated with complexity or slowness of existing calorie-counting apps.

---

## ⚙️ Key Features & Functionalities

### 1. Meal Logging

- **Conversational Input:** Users log meals via simple conversational text input.
- **AI Clarification:** Intelligent follow-up questions (max two) for ambiguous inputs.
- **Structured Logging:** Meals logged clearly into Neon PostgreSQL with accurate macros.

### 2. AI Conversational Assistant

- GPT-4 Turbo-powered via LangChain.
- Clearly structured JSON outputs for backend consistency.

### 3. Macro Calculation and Database Integration

- Accurate macros/calories estimation based on structured user input.
- Data sourced via USDA FoodData Central API.
- Neon PostgreSQL integration for reliable, scalable meal tracking.

### 4. Responsive, Mobile-First UI

- Minimalistic, clean, and intuitive UI built with Tailwind CSS.
- Progressive Web App (PWA) support for excellent mobile experience.

### 5. Manual Correction

- Easy editing of logged entries to correct estimation inaccuracies.

---

## 🛠 Technical Stack

| Technology              | Usage                                     |
|-------------------------|-------------------------------------------|
| **Frontend**            | Next.js 14+, React, Tailwind CSS, Zustand |
| **Backend/API**         | Next.js API Routes, TypeScript            |
| **Database**            | Neon PostgreSQL (Serverless via Vercel)   |
| **AI Integration**      | LangChain (OpenAI GPT-4 Turbo)            |
| **Deployment**          | Vercel                                    |

---

## 🗂️ Initial Project Structure

```plaintext
my-calorie-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Meal input and UI components
│   └── api/
│       └── log-meal/
│           └── route.ts            # Meal logging API endpoint
├── components/
│   ├── MealInput.tsx               # Text input for meals
│   └── ClarificationPrompt.tsx     # AI-generated follow-up prompts
├── lib/
│   ├── db.ts                       # Neon PostgreSQL integration
│   └── openai-agent.ts             # GPT-4 Turbo integration via LangChain
├── public/
│   └── favicon.ico
├── .env.local                      # API keys for OpenAI and Neon
├── package.json
└── tsconfig.json
```

---

## 📌 AI Agent Workflow

- User inputs casual meal description.
- AI assistant identifies ambiguities and clarifies via structured conversational questions.
- Clarified data structured as JSON for backend usage.
- Backend calculates macros/calories using the USDA FoodData API.
- Results clearly logged into PostgreSQL database.

---

## 📦 Database Schema (Neon PostgreSQL)

### `meals` Table

| Column           | Type       | Description                       |
|------------------|------------|-----------------------------------|
| id               | UUID       | Primary key                       |
| meal_description | TEXT       | User’s original meal description  |
| calories         | INTEGER    | Total calories                    |
| protein          | FLOAT      | Total protein (grams)             |
| carbs            | FLOAT      | Total carbohydrates (grams)       |
| fats             | FLOAT      | Total fats (grams)                |
| created_at       | TIMESTAMP  | Timestamp of logging              |

### `meal_items` Table

| Column     | Type       | Description                         |
|------------|------------|-------------------------------------|
| id         | UUID       | Primary key                         |
| meal_id    | UUID       | Foreign key linking to meals table  |
| name       | TEXT       | Food name                           |
| quantity   | FLOAT      | Quantity consumed                   |
| unit       | TEXT       | Measurement unit                    |
| method     | TEXT       | Cooking method                      |
| calories   | INTEGER    | Calories per food item              |
| protein    | FLOAT      | Protein per food item               |
| carbs      | FLOAT      | Carbohydrates per food item         |
| fats       | FLOAT      | Fats per food item                  |

---

## 🎨 UI/UX Requirements

- Clean, minimalistic design emphasizing simplicity and usability.
- Mobile-first responsiveness via Tailwind CSS.
- Clear visual feedback during AI interactions (loading states, prompts).
- Easy-to-use manual corrections to logged entries.

---

## 🔑 Environment Variables Configuration

Ensure the following keys are securely stored in `.env.local`:

```env
OPENAI_API_KEY="your-openai-api-key"
NEON_DATABASE_URL="your-neon-database-connection-string"
```

---

## 📈 Success Metrics (MVP Goals)

- Meal logging time: < 1 minute per meal (average)
- User satisfaction rating: ≥ 7/10
- Conversational clarification interactions: ≤ 2 per meal on average

---

## 🚧 Future Enhancements (Post-MVP)

- Integration of RAG (Retrieval-Augmented Generation) for nutritional information.
- OCR/photo-based logging from receipts/fridge images.
- Enhanced analytics and nutritional insights.

---

## 📅 Project Timeline (Tentative)

| Milestone                            | Duration        | Target Date |
|--------------------------------------|-----------------|-------------|
| Project Initialization (V0 & Cursor) | 1-2 days        | TBD         |
| MVP Development                      | 1-2 weeks       | TBD         |
| Initial User Testing & Iteration     | 1 week          | TBD         |
| MVP Release & Feedback               | TBD             | TBD         |

---

**End of Project Requirements Document (`PRD.md`)**