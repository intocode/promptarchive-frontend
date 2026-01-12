# Shared Layer

Reusable infrastructure code with no business logic dependencies.

## Purpose

The shared layer contains:
- UI component library (design system)
- Generic utilities and helpers
- API client and generated endpoints
- Common React hooks
- Static configuration
- Shared TypeScript types

**Key principle:** Code here should be reusable across ANY project, not just PromptArchive.

## Structure

```
shared/
├── ui/              # UI component library (shadcn/ui)
├── lib/             # Utility functions
├── api/             # API client
│   ├── axios.ts     # Axios instance with auth
│   └── generated/   # Orval-generated API hooks
├── hooks/           # Generic React hooks
├── config/          # Static configuration
└── types/           # Shared TypeScript types
```

## Segments

### UI (`shared/ui/`)

shadcn/ui components styled with Tailwind CSS.

**Components:**
- Form controls: Button, Input, Textarea, Checkbox, Select
- Data display: Card, Badge, Avatar, Skeleton
- Overlays: Dialog, Sheet, Popover, Tooltip, AlertDialog
- Loading: LoadingButton, LoadingSpinner
- Custom: AutoExpandTextarea, PasswordInput

**Usage:**
```typescript
import { Button, Card, Dialog, Input } from '@shared/ui';

export function MyComponent() {
  return (
    <Card>
      <Input placeholder="Enter text..." />
      <Button>Submit</Button>
    </Card>
  );
}
```

**Adding new components:**
Use the `/shadcn` skill:
```bash
/shadcn add table
```

### Lib (`shared/lib/`)

Utility functions and helpers.

**Files:**
- `utils.ts` - General utilities (cn, formatters)
- `api-error.ts` - API error handling utilities
- `auth-cookie.ts` - Cookie management for auth tokens
- `diff.ts` - Text diffing utilities

**Usage:**
```typescript
import { cn, handleApiError } from '@shared/lib';

// Combine Tailwind classes
const className = cn('base-class', isActive && 'active-class');

// Handle API errors
try {
  await apiCall();
} catch (error) {
  handleApiError(error, 'Failed to save');
}
```

### API (`shared/api/`)

API client configuration and generated endpoints.

**Files:**
- `axios.ts` - Axios instance with JWT refresh logic
- `generated/endpoints/` - Orval-generated React Query hooks

**Usage:**
```typescript
import { useGetPrompts, useCreatePrompt } from '@shared/api/generated/endpoints/prompts/prompts';

export function PromptsPage() {
  const { data, isLoading } = useGetPrompts({});
  const createMutation = useCreatePrompt();

  // Use hooks...
}
```

**Regenerating API client:**
```bash
npm run generate-api
```

### Hooks (`shared/hooks/`)

Generic React hooks with no business logic.

**Available hooks:**
- `useDebounce` - Debounce values
- `useCopyToClipboard` - Copy text to clipboard
- `useMediaQuery` - Responsive breakpoint detection

**Usage:**
```typescript
import { useDebounce, useCopyToClipboard, useMediaQuery } from '@shared/hooks';

const debouncedSearch = useDebounce(searchTerm, 300);
const { copy, isCopied } = useCopyToClipboard();
const isMobile = useMediaQuery('(max-width: 768px)');
```

### Config (`shared/config/`)

Static configuration constants.

**Files:**
- `templates.ts` - Prompt template definitions

**Usage:**
```typescript
import { TEMPLATES } from '@shared/config';
```

### Types (`shared/types/`)

Shared TypeScript types and interfaces.

**Usage:**
```typescript
import type { SomeSharedType } from '@shared/types';
```

## Import Rules

**Can import from:**
- External npm packages only

**Cannot import from:**
- entities/
- features/
- widgets/
- app/

**Within shared:**
- Segments CAN import from each other
- Example: `shared/ui/button.tsx` can import from `shared/lib/utils.ts`

## Adding New Code

### When to add to shared:

✅ **YES - Add to shared:**
- Generic UI components used everywhere
- Utility functions with no business logic
- Reusable React hooks
- API client infrastructure
- Constants used across multiple features

❌ **NO - Don't add to shared:**
- Business logic (→ use features/)
- Entity-specific code (→ use entities/)
- Page compositions (→ use widgets/)
- Feature-specific utilities

### Example: Adding a new utility

**Good (belongs in shared):**
```typescript
// shared/lib/date-utils.ts
export function formatDate(date: Date): string {
  return date.toLocaleDateString();
}
```

**Bad (too specific, belongs in feature/entity):**
```typescript
// This is prompt-specific, belongs in entities/prompt/lib/
export function calculatePromptQualityScore(prompt: Prompt): number {
  // Business logic specific to prompts
}
```

## Public API

Each segment exports through `index.ts`:

```typescript
// shared/ui/index.ts
export { Button } from './button';
export { Card } from './card';
// ... all UI components

// shared/hooks/index.ts
export { useDebounce } from './use-debounce';
// ... all hooks
```

**Import from public API:**
```typescript
// ✅ Good
import { Button } from '@shared/ui';

// ❌ Bad - don't import from internal files
import { Button } from '@shared/ui/button';
```

## Testing

Shared layer code should have high test coverage since it's used everywhere.

```bash
npm run test shared/
```

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [React Query Documentation](https://tanstack.com/query/latest)
