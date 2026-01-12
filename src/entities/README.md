# Entities Layer

Business entities that represent domain models in the application.

## Purpose

Entities are the core building blocks of the application's business domain. Each entity represents a real-world concept (Prompt, User, Folder, Tag) with:
- Data models and validation
- Display components
- Entity-specific utilities

**Key principle:** Entities are business concepts, not technical concepts.

## Structure

```
entities/
├── prompt/
│   ├── model/         # Validation schemas, types
│   ├── lib/           # Prompt utilities (templates, visibility)
│   ├── ui/            # Prompt display components
│   └── index.ts       # Public API
├── user/
│   ├── model/         # Auth context, hooks
│   └── index.ts
├── folder/
│   ├── ui/            # Folder UI components
│   └── index.ts
└── tag/
    ├── ui/            # Tag UI components
    └── index.ts
```

## Current Entities

### Prompt Entity (`entities/prompt/`)

Represents an AI prompt in the system.

**Model (`model/`):**
- `validation.ts` - Zod schemas for create/update
  - `createPromptSchema`
  - `updatePromptSchema`
  - `promptVisibilitySchema`

**Lib (`lib/`):**
- `templates.ts` - Template rendering utilities
  - `extractVariables()` - Extract {{variables}} from text
  - `renderTemplate()` - Fill variables in template
  - `areAllVariablesFilled()` - Check if template is complete
- `visibility.ts` - Visibility configuration
  - `VISIBILITY_OPTIONS` - Available visibility levels
  - `getVisibilityConfig()` - Get config for visibility type

**UI (`ui/`):**
- `PromptCard` - Card view of prompt
- `PromptRow` - Row view of prompt
- `PromptCardSkeleton` - Loading skeleton for card
- `PromptRowSkeleton` - Loading skeleton for row
- `HighlightedContent` - Syntax-highlighted prompt content
- `VariablesList` - Display template variables

**Usage:**
```typescript
import {
  PromptCard,
  PromptRow,
  extractVariables,
  createPromptSchema,
} from '@entities/prompt';

// Render a prompt card
<PromptCard prompt={prompt} />

// Extract variables from template
const vars = extractVariables(prompt.template);

// Validate prompt data
const result = createPromptSchema.parse(formData);
```

### User Entity (`entities/user/`)

Represents an authenticated user.

**Model (`model/`):**
- `auth-context.tsx` - Authentication React context
- `use-auth.ts` - Authentication hook

**Usage:**
```typescript
import { useAuth } from '@entities/user';

export function MyComponent() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return <div>Welcome {user?.name}</div>;
}
```

### Folder Entity (`entities/folder/`)

Represents a folder for organizing prompts.

**UI (`ui/`):**
- `FolderItem` - Single folder display
- `FolderLinkBadge` - Folder badge/link component

**Usage:**
```typescript
import { FolderItem, FolderLinkBadge } from '@entities/folder';

<FolderItem folder={folder} onSelect={handleSelect} />
<FolderLinkBadge folder={prompt.folder} />
```

### Tag Entity (`entities/tag/`)

Represents a tag for categorizing prompts.

**UI (`ui/`):**
- `TagItem` - Single tag display
- `TagLinkBadges` - Multiple tag badges

**Usage:**
```typescript
import { TagItem, TagLinkBadges } from '@entities/tag';

<TagItem tag={tag} />
<TagLinkBadges tags={prompt.tags} />
```

## Segments

### Model (`entity/*/model/`)

Contains:
- Zod validation schemas
- TypeScript types/interfaces
- React contexts
- State management hooks
- Data transformations

**Example:**
```typescript
// entities/prompt/model/validation.ts
import { z } from 'zod';

export const createPromptSchema = z.object({
  title: z.string().min(1).max(200),
  template: z.string().min(1),
  visibility: z.enum(['private', 'public', 'unlisted']),
});

export type CreatePromptFormData = z.infer<typeof createPromptSchema>;
```

### Lib (`entity/*/lib/`)

Entity-specific utilities and helpers.

**Example:**
```typescript
// entities/prompt/lib/templates.ts
export function extractVariables(template: string): string[] {
  const regex = /{{(.*?)}}/g;
  const matches = template.matchAll(regex);
  return Array.from(matches, m => m[1].trim());
}
```

### UI (`entity/*/ui/`)

Display components for the entity (read-only or minimal interaction).

**Characteristics:**
- Focus on displaying entity data
- Minimal interaction (clicking, basic hover)
- No complex business logic
- Can accept event handlers as props

**Example:**
```typescript
// entities/prompt/ui/prompt-card.tsx
export function PromptCard({ prompt, onClick }: Props) {
  return (
    <Card onClick={onClick}>
      <CardHeader>{prompt.title}</CardHeader>
      <CardContent>{prompt.template}</CardContent>
    </Card>
  );
}
```

## Import Rules

**Can import from:**
- @shared/* (all segments)

**Cannot import from:**
- @entities/* (other entities - entities are isolated)
- @features/*
- @widgets/*
- @app/*

**Cross-entity imports:**
Entities should NOT import from each other. If you need shared entity logic, consider:
1. Moving it to @shared/lib/
2. Passing data through props from a higher layer
3. Creating a feature that combines both entities

## When to Create a New Entity

Create a new entity when:

✅ **YES - Create entity:**
- Represents a core business concept (User, Product, Order)
- Has its own database table/API endpoints
- Needs reusable display components
- Has entity-specific validation rules
- Used across multiple features

❌ **NO - Don't create entity:**
- It's a UI concept (Modal, Dropdown) → use @shared/ui/
- It's a temporary form state → keep in feature
- It's feature-specific logic → use @features/*/model/

## Public API Pattern

Each entity exports through index.ts:

```typescript
// entities/prompt/index.ts
export {
  // Model exports
  createPromptSchema,
  updatePromptSchema,
  type CreatePromptFormData,
} from './model';

export {
  // Lib exports
  extractVariables,
  renderTemplate,
  VISIBILITY_OPTIONS,
} from './lib';

export {
  // UI exports
  PromptCard,
  PromptRow,
  HighlightedContent,
} from './ui';
```

**Import from public API:**
```typescript
// ✅ Good
import { PromptCard, extractVariables } from '@entities/prompt';

// ❌ Bad
import { PromptCard } from '@entities/prompt/ui/prompt-card';
```

## Adding a New Entity

### Step 1: Create structure
```bash
mkdir -p src/entities/product/{model,lib,ui}
touch src/entities/product/index.ts
touch src/entities/product/model/index.ts
touch src/entities/product/lib/index.ts
touch src/entities/product/ui/index.ts
```

### Step 2: Add model (validation & types)
```typescript
// entities/product/model/validation.ts
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
});

export type Product = z.infer<typeof productSchema>;
```

### Step 3: Add UI components
```typescript
// entities/product/ui/product-card.tsx
import { Card } from '@shared/ui';
import type { Product } from '../model';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
    </Card>
  );
}
```

### Step 4: Export public API
```typescript
// entities/product/index.ts
export { productSchema, type Product } from './model';
export { ProductCard } from './ui';
```

## Testing

Test entities in isolation:

```typescript
// entities/prompt/lib/__tests__/templates.test.ts
import { extractVariables } from '../templates';

describe('extractVariables', () => {
  it('should extract variables from template', () => {
    const template = 'Hello {{name}}, you are {{age}} years old';
    expect(extractVariables(template)).toEqual(['name', 'age']);
  });
});
```

## Common Patterns

### Pattern 1: Entity with validation
```typescript
// model/validation.ts
export const schema = z.object({...});

// ui/entity-form.tsx
import { schema } from '../model';
// Use schema in form
```

### Pattern 2: Entity with utilities
```typescript
// lib/utils.ts
export function calculateScore(entity: Entity): number {
  // Entity-specific calculation
}

// ui/entity-card.tsx
import { calculateScore } from '../lib';
<div>Score: {calculateScore(entity)}</div>
```

### Pattern 3: Entity with context
```typescript
// model/context.tsx
export const EntityContext = createContext();
export const useEntity = () => useContext(EntityContext);
```

## Resources

- [FSD Entities Documentation](https://feature-sliced.design/docs/reference/layers#entities)
- [Zod Documentation](https://zod.dev/)
