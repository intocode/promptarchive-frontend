# Feature-Sliced Design Architecture

This document describes the Feature-Sliced Design (FSD) architecture used in PromptArchive Frontend.

## What is FSD?

Feature-Sliced Design is an architectural methodology for organizing frontend applications. It provides:
- Clear boundaries between different parts of the application
- Predictable file structure
- Easy navigation and maintenance
- Scalability as the project grows

## Layer Structure

FSD organizes code into **layers** with strict import rules (lower layers cannot import from higher layers):

```
app/           # Application initialization and routing
├── widgets/   # Complex page sections composed from features
├── features/  # User interactions and business logic
├── entities/  # Business entities (models, UI components)
└── shared/    # Reusable utilities, UI kit, API client
```

## Import Rules

**Strict Hierarchy (can only import from layers below):**
1. **app** → can import from: widgets, features, entities, shared
2. **widgets** → can import from: features, entities, shared
3. **features** → can import from: entities, shared
4. **entities** → can import from: shared
5. **shared** → can import from: nothing (only external libraries)

**Within same layer:** Slices are isolated - no cross imports between slices at the same layer level.

## Layer Details

### Shared Layer
Location: `src/shared/`

Reusable code that has no business logic dependencies.

**Segments:**
- `ui/` - UI component library (shadcn/ui components)
- `lib/` - Utilities (utils.ts, api-error.ts, auth-cookie.ts, diff.ts)
- `api/` - API client and generated endpoints
- `hooks/` - Generic React hooks (useDebounce, useCopyToClipboard, useMediaQuery)
- `config/` - Static configuration (templates.ts)
- `types/` - Shared TypeScript types

**Example imports:**
```typescript
import { Button, Card } from '@shared/ui';
import { cn, handleApiError } from '@shared/lib';
import { useDebounce } from '@shared/hooks';
```

### Entities Layer
Location: `src/entities/`

Business entities that represent domain models.

**Current entities:**
- `prompt/` - Prompt model, UI components, validation, templates
- `user/` - Authentication context and hooks
- `folder/` - Folder UI components
- `tag/` - Tag UI components

**Segments per entity:**
- `model/` - State, hooks, types, validation schemas
- `lib/` - Entity-specific utilities
- `ui/` - Entity display components

**Example imports:**
```typescript
import { PromptCard, PromptRow } from '@entities/prompt';
import { useAuth } from '@entities/user';
import { FolderLinkBadge } from '@entities/folder';
```

### Features Layer
Location: `src/features/`

User interactions and business logic features.

**Current features:**
- `auth/` - Login, register, logout functionality
- `prompt-crud/` - Create, update, delete prompts
- `prompt-filters/` - Search, sort, filter prompts
- `prompt-sharing/` - Share prompts functionality
- `tag-management/` - Tag CRUD operations
- `folder-management/` - Folder CRUD operations
- `ai-tools/` - AI features (improve prompt, generate description, etc.)

**Segments per feature:**
- `model/` - Business logic hooks, state management
- `ui/` - Interactive components for the feature

**Example imports:**
```typescript
import { LoginForm, RegisterForm } from '@features/auth';
import { CreatePromptModal, DeletePromptDialog } from '@features/prompt-crud';
import { PromptsSearch, PromptsFilters } from '@features/prompt-filters';
```

### Widgets Layer
Location: `src/widgets/`

Complex page sections that compose features and entities.

**Current widgets:**
- `header/` - Application header with navigation
- `prompt-list/` - Prompts list view with filters
- `prompt-detail/` - Detailed prompt view
- `folder-sidebar/` - Folder navigation sidebar
- `gallery/` - Public gallery display
- `error/` - Error boundary fallback

**Segments per widget:**
- `model/` - Widget-specific logic and state
- `ui/` - Widget components

**Example imports:**
```typescript
import { Header, AuthenticatedLayout } from '@widgets/header';
import { PromptList } from '@widgets/prompt-list';
import { FoldersSidebar } from '@widgets/folder-sidebar';
```

### App Layer
Location: `src/app/`

Next.js App Router pages and application initialization.

**Contents:**
- Route pages (page.tsx)
- Layouts (layout.tsx)
- Error boundaries (error.tsx)
- Not found pages (not-found.tsx)
- Providers (providers.tsx)

**Example:**
```typescript
// app/prompts/page.tsx
import { PromptList } from '@widgets/prompt-list';
import { FoldersSidebar } from '@widgets/folder-sidebar';
```

## TypeScript Path Aliases

Configured in `tsconfig.json`:
```json
{
  "paths": {
    "@/*": ["./src/*"],
    "@app/*": ["./src/app/*"],
    "@widgets/*": ["./src/widgets/*"],
    "@features/*": ["./src/features/*"],
    "@entities/*": ["./src/entities/*"],
    "@shared/*": ["./src/shared/*"]
  }
}
```

## Public Interfaces

Each layer/slice exports a public API through `index.ts` files:

```typescript
// src/entities/prompt/index.ts
export {
  // Model exports
  createPromptSchema,
  updatePromptSchema,
  // UI exports
  PromptCard,
  PromptRow,
  // Lib exports
  extractVariables,
  renderTemplate,
} from './internal-files';
```

This creates clear boundaries and hides implementation details.

## Benefits in PromptArchive

1. **Clear Organization**: Easy to find where code belongs
2. **Predictable Structure**: New features follow same pattern
3. **Reduced Coupling**: Layers can only depend on lower layers
4. **Better Testing**: Isolated slices are easier to test
5. **Team Scalability**: Multiple developers can work without conflicts
6. **Code Reusability**: Shared layer prevents duplication

## Migration Notes

The codebase was migrated from a traditional structure to FSD in January 2026. Key changes:
- `src/components/` → distributed to `@entities/*/ui/`, `@features/*/ui/`, `@widgets/*/ui/`, `@shared/ui/`
- `src/hooks/` → distributed to `@features/*/model/`, `@widgets/*/model/`, `@shared/hooks/`
- `src/lib/` → moved to `@shared/lib/`, `@shared/api/`, `@shared/config/`
- `src/lib/validations/` → moved to `@entities/*/model/`, `@features/*/model/`

## Resources

- [Official FSD Documentation](https://feature-sliced.design/)
- [FSD Examples](https://github.com/feature-sliced/examples)
