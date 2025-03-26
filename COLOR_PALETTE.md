# UI Colors and Tailwind Configuration

## Primary Colors

### Brand Colors
- Primary: `emerald-500` (#10B981)
  - Hover: `emerald-600` (#059669)
  - Light: `emerald-100` (#D1FAE5)
  - Dark: `emerald-800` (#065F46)

### Neutral Colors
- Background: `neutral-50` (#FAFAFA)
- Text: `neutral-900` (#171717)
- Muted: `neutral-500` (#737373)

## Semantic Colors

### Success
- Base: `green-500` (#22C55E)
- Light: `green-100` (#DCFCE7)
- Dark: `green-700` (#15803D)

### Warning
- Base: `amber-500` (#F59E0B)
- Light: `amber-100` (#FEF3C7)
- Dark: `amber-700` (#B45309)

### Error
- Base: `red-500` (#EF4444)
- Light: `red-100` (#FEE2E2)
- Dark: `red-700` (#B91C1C)

### Info
- Base: `blue-500` (#3B82F6)
- Light: `blue-100` (#DBEAFE)
- Dark: `blue-700` (#1D4ED8)

## Component-Specific Colors

### Cards
- Background: `white`
- Border: `neutral-200` (#E5E5E5)
- Hover: `neutral-50` (#FAFAFA)

### Buttons
```typescript
// tailwind.config.ts button variants
{
    primary: 'bg-emerald-500 hover:bg-emerald-600 text-white',
    secondary: 'bg-neutral-200 hover:bg-neutral-300 text-neutral-900',
    outline: 'border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-50',
    ghost: 'text-neutral-600 hover:bg-neutral-100',
}
```

### Forms
- Input Border: `neutral-300`
- Input Focus: `emerald-500`
- Label: `neutral-700`
- Placeholder: `neutral-400`

## Dark Mode Colors

### Base Colors
- Background: `neutral-900`
- Text: `neutral-50`
- Muted: `neutral-400`

### Component Dark Mode
```typescript
// tailwind.config.ts dark mode variants
{
    'dark:bg-neutral-800': true,
    'dark:text-neutral-50': true,
    'dark:border-neutral-700': true,
}
```

## Tailwind Configuration

### Extended Theme
```typescript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: colors.emerald,
        neutral: colors.neutral,
      },
      borderRadius: {
        DEFAULT: '0.5rem',
      },
      boxShadow: {
        card: '0 2px 4px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
```

### Custom Utilities
```css
@layer utilities {
  .text-shadow {
    text-shadow: 0 1px 2px rgba(0,0,0,0.1);
  }
}
``` 