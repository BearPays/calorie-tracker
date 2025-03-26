# Project Structure and Organization

## Root Directory Structure
```
nutritrack/
├── app/                  # Next.js 14 App Router
├── components/           # React Components
├── lib/                  # Utility functions and services
├── hooks/               # Custom React hooks
├── styles/              # Global styles and Tailwind
├── public/              # Static assets
└── types/               # TypeScript type definitions
```

## Detailed Breakdown

### App Directory (`/app`)
```
app/
├── (auth)/              # Authentication routes
│   ├── login/
│   └── register/
├── (dashboard)/         # Protected dashboard routes
│   ├── meals/
│   ├── profile/
│   └── settings/
├── api/                 # API routes
│   ├── auth/
│   ├── meals/
│   └── ai/
└── layout.tsx           # Root layout
```

### Components Directory (`/components`)
```
components/
├── ui/                  # Base UI components
│   ├── button.tsx
│   ├── input.tsx
│   └── card.tsx
├── forms/               # Form components
│   ├── meal-form.tsx
│   └── profile-form.tsx
├── charts/              # Data visualization
│   ├── calorie-chart.tsx
│   └── progress-chart.tsx
└── shared/             # Shared components
    ├── header.tsx
    └── footer.tsx
```

### Library Directory (`/lib`)
```
lib/
├── api/                 # API client functions
│   ├── meals.ts
│   └── user.ts
├── db/                  # Database utilities
│   ├── schema.ts
│   └── client.ts
├── ai/                  # AI integration
│   ├── chain.ts
│   └── prompts.ts
└── utils/              # Helper functions
    ├── date.ts
    └── validation.ts
```

### Hooks Directory (`/hooks`)
```
hooks/
├── use-auth.ts         # Authentication hook
├── use-meals.ts        # Meal management hook
└── use-ai.ts          # AI interaction hook
```

## Rationale

### App Router Organization
- Route groups (in parentheses) for logical separation
- Colocation of related components and routes
- API routes alongside their features

### Component Structure
- UI components follow atomic design
- Feature-specific components in dedicated folders
- Shared components for reusability

### Library Organization
- Separation of concerns between different utilities
- Clear module boundaries
- Easy to test and maintain

### State Management
- React Context for global state
- Custom hooks for feature-specific state
- Server components for data fetching

## Best Practices

### File Naming
- Kebab-case for directories and files
- PascalCase for React components
- camelCase for utilities and hooks

### Code Organization
- One component per file
- Shared types in dedicated files
- Clear import/export structure

### Performance
- Dynamic imports for code splitting
- Static generation where possible
- Optimized asset loading

### Testing
```
__tests__/
├── components/
├── hooks/
└── utils/
```

### Documentation
- JSDoc comments for functions
- README files in major directories
- Storybook for component documentation 