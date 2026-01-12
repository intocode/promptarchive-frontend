# Features Layer

User-facing features that implement business logic and interactions.

## Purpose

Features represent complete user interactions or business capabilities. Each feature:
- Implements a specific user action or workflow
- Combines entities from the entities layer
- Contains business logic and state management
- Provides interactive UI components

**Key principle:** Features are user actions, not technical abstractions.

## Structure

```
features/
├── auth/
│   ├── model/         # Auth hooks and logic
│   ├── ui/            # Login/register forms
│   └── index.ts
├── prompt-crud/
│   ├── model/         # CRUD hooks
│   ├── ui/            # Modals, forms, actions
│   └── index.ts
├── prompt-filters/
│   ├── model/         # Filter state and hooks
│   ├── ui/            # Filter controls
│   └── index.ts
├── prompt-sharing/
│   ├── model/         # Sharing logic
│   ├── ui/            # Share modal
│   └── index.ts
├── tag-management/
│   ├── model/         # Tag CRUD hooks
│   ├── ui/            # Tag editors, dialogs
│   └── index.ts
├── folder-management/
│   ├── model/         # Folder CRUD hooks
│   ├── ui/            # Folder modals, editors
│   └── index.ts
└── ai-tools/
    ├── model/         # AI feature hooks
    ├── ui/            # AI tool modals
    └── index.ts
```

## Current Features

### Auth (`features/auth/`)

User authentication and session management.

**Model:**
- `use-logout.ts` - Logout current session
- `use-logout-all.ts` - Logout all sessions
- `use-rate-limit-countdown.ts` - Rate limit countdown
- `validation.ts` - Login/register validation schemas

**UI:**
- `LoginForm` - User login form
- `RegisterForm` - User registration form
- `RouteGuard` - Protected route wrapper

**Usage:**
```typescript
import { LoginForm, RegisterForm, RouteGuard } from '@features/auth';

// Login page
<LoginForm onSuccess={() => router.push('/prompts')} />

// Protected route
<RouteGuard>
  <PrivateContent />
</RouteGuard>
```

### Prompt CRUD (`features/prompt-crud/`)

Create, read, update, delete prompts.

**Model:**
- `use-delete-prompt.ts` - Delete prompt mutation
- `use-update-prompt.ts` - Update prompt mutation

**UI:**
- `CreatePromptModal` - Modal to create new prompt
- `CreatePromptForm` - Prompt creation form
- `DeletePromptDialog` - Confirm delete dialog
- `PromptActionsDropdown` - Actions menu
- `CopyPromptDropdown` - Copy prompt menu
- `VariableInputForm` - Template variable inputs

**Usage:**
```typescript
import {
  CreatePromptModal,
  DeletePromptDialog,
  PromptActionsDropdown,
} from '@features/prompt-crud';

<CreatePromptModal onSuccess={refetch} />
<PromptActionsDropdown prompt={prompt} />
<DeletePromptDialog prompt={prompt} onSuccess={refetch} />
```

### Prompt Filters (`features/prompt-filters/`)

Search, sort, and filter prompts.

**Model:**
- `use-prompts-filters.ts` - Filter state management
- `use-infinite-prompts.ts` - Infinite scroll for prompts
- `use-view-mode.ts` - Card/row view toggle

**UI:**
- `PromptsSearch` - Search input
- `PromptsSort` - Sort dropdown
- `PromptsFilters` - Desktop filter panel
- `PromptsFiltersMobile` - Mobile filter sheet
- `FolderFilter` - Filter by folder
- `TagFilter` - Filter by tag
- `VisibilityFilter` - Filter by visibility
- `ActiveFilters` - Active filter badges
- `ViewModeToggle` - Card/row view toggle

**Usage:**
```typescript
import {
  PromptsSearch,
  PromptsFilters,
  ActiveFilters,
  usePromptsFilters,
} from '@features/prompt-filters';

const filters = usePromptsFilters();

<PromptsSearch value={filters.search} onChange={filters.setSearch} />
<PromptsFilters {...filters} />
<ActiveFilters filters={filters} />
```

### Prompt Sharing (`features/prompt-sharing/`)

Share prompts via unique links.

**Model:**
- `use-share-prompt.ts` - Generate share link

**UI:**
- `ShareModal` - Share link modal

**Usage:**
```typescript
import { ShareModal } from '@features/prompt-sharing';

<ShareModal prompt={prompt} open={isOpen} onClose={handleClose} />
```

### Tag Management (`features/tag-management/`)

Create, update, delete, and autocomplete tags.

**Model:**
- `use-update-tag.ts` - Update tag mutation
- `use-delete-tag.ts` - Delete tag mutation

**UI:**
- `TagsManagement` - Full tag management UI
- `CreateTagInput` - Create new tag input
- `InlineTagEditor` - Edit tag inline
- `DeleteTagDialog` - Confirm delete tag
- `TagAutocomplete` - Tag autocomplete input
- `TagSuggestion` - Tag suggestion UI

**Usage:**
```typescript
import {
  TagsManagement,
  TagAutocomplete,
  DeleteTagDialog,
} from '@features/tag-management';

<TagsManagement />
<TagAutocomplete value={tags} onChange={setTags} />
<DeleteTagDialog tag={tag} onSuccess={refetch} />
```

### Folder Management (`features/folder-management/`)

Create, update, delete, and reorder folders.

**Model:**
- `use-create-folder.ts` - Create folder mutation
- `use-update-folder.ts` - Update folder mutation
- `use-delete-folder.ts` - Delete folder mutation
- `use-reorder-folders.ts` - Reorder folders mutation

**UI:**
- `CreateFolderModal` - Create folder modal
- `InlineFolderEditor` - Edit folder inline
- `DeleteFolderDialog` - Confirm delete folder
- `FolderSelector` - Select folder dropdown
- `DraggableFolderList` - Drag-and-drop folder list

**Usage:**
```typescript
import {
  CreateFolderModal,
  DraggableFolderList,
  DeleteFolderDialog,
} from '@features/folder-management';

<CreateFolderModal onSuccess={refetch} />
<DraggableFolderList folders={folders} onReorder={handleReorder} />
<DeleteFolderDialog folder={folder} onSuccess={refetch} />
```

### AI Tools (`features/ai-tools/`)

AI-powered features for prompts.

**Model:**
- `use-improve-prompt.ts` - Improve prompt with AI
- `use-generate-description.ts` - Generate description
- `use-generate-tags.ts` - Generate tags
- `use-restore-version.ts` - Restore previous version

**UI:**
- `ImprovePromptModal` - Improve prompt UI
- `GenerateDescriptionModal` - Generate description UI
- `DiffView` - Show changes between versions
- `VersionHistorySheet` - Version history UI
- `ImproveLoadingState` - Loading state for AI

**Usage:**
```typescript
import {
  ImprovePromptModal,
  VersionHistorySheet,
  GenerateDescriptionModal,
} from '@features/ai-tools';

<ImprovePromptModal prompt={prompt} onSuccess={handleSuccess} />
<VersionHistorySheet promptId={prompt.id} />
<GenerateDescriptionModal prompt={prompt} />
```

## Segments

### Model (`features/*/model/`)

Contains business logic and state management:
- React Query mutations and queries
- Custom hooks for feature logic
- State management
- API integration
- Validation schemas

**Example:**
```typescript
// features/prompt-crud/model/use-delete-prompt.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePrompt } from '@shared/api/generated/endpoints/prompts/prompts';

export function useDeletePrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePrompt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
    },
  });
}
```

### UI (`features/*/ui/`)

Interactive components that implement feature UI:
- Forms with validation
- Modals and dialogs
- Interactive controls
- Feature-specific layouts

**Example:**
```typescript
// features/prompt-crud/ui/create-prompt-modal.tsx
import { Dialog } from '@shared/ui';
import { CreatePromptForm } from './create-prompt-form';

export function CreatePromptModal({ onSuccess }: Props) {
  return (
    <Dialog>
      <DialogContent>
        <CreatePromptForm onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
}
```

## Import Rules

**Can import from:**
- @entities/* (all entities)
- @shared/* (all shared code)

**Cannot import from:**
- @features/* (other features - features are isolated)
- @widgets/*
- @app/*

**Cross-feature communication:**
Features should NOT import from each other. If you need shared functionality:
1. Move common logic to @shared/lib/
2. Create a common entity in @entities/
3. Compose features at widget/page level

## When to Create a New Feature

Create a new feature when:

✅ **YES - Create feature:**
- User can perform a specific action (login, create prompt, share)
- Has dedicated UI (modal, form, dialog)
- Contains business logic
- Needs state management
- Used across multiple pages

❌ **NO - Don't create feature:**
- It's just a display component → use @entities/*/ui/
- It's a page composition → use @widgets/
- It's a generic utility → use @shared/lib/

## Feature Naming

Features should be named by **user action**, not technical concept:

✅ **Good names (user actions):**
- `auth` - User authentication
- `prompt-crud` - Create/update/delete prompts
- `prompt-sharing` - Share prompts
- `tag-management` - Manage tags

❌ **Bad names (technical concepts):**
- `api` - Too technical
- `utils` - Not an action
- `components` - Too generic
- `prompt-stuff` - Unclear

## Public API Pattern

Each feature exports through index.ts:

```typescript
// features/auth/index.ts
export {
  // Model exports (hooks)
  useLogout,
  useLogoutAll,
  loginSchema,
  registerSchema,
} from './model';

export {
  // UI exports (components)
  LoginForm,
  RegisterForm,
  RouteGuard,
} from './ui';
```

**Import from public API:**
```typescript
// ✅ Good
import { LoginForm, useLogout } from '@features/auth';

// ❌ Bad
import { LoginForm } from '@features/auth/ui/login-form';
```

## Adding a New Feature

### Step 1: Create structure
```bash
mkdir -p src/features/comment-system/{model,ui}
touch src/features/comment-system/index.ts
touch src/features/comment-system/model/index.ts
touch src/features/comment-system/ui/index.ts
```

### Step 2: Add model (hooks)
```typescript
// features/comment-system/model/use-create-comment.ts
import { useMutation } from '@tanstack/react-query';

export function useCreateComment() {
  return useMutation({
    mutationFn: async (data) => {
      // API call
    },
  });
}
```

### Step 3: Add UI (components)
```typescript
// features/comment-system/ui/comment-form.tsx
import { Button, Textarea } from '@shared/ui';
import { useCreateComment } from '../model';

export function CommentForm({ promptId }: Props) {
  const createMutation = useCreateComment();

  return (
    <form onSubmit={handleSubmit}>
      <Textarea placeholder="Write a comment..." />
      <Button type="submit">Post Comment</Button>
    </form>
  );
}
```

### Step 4: Export public API
```typescript
// features/comment-system/index.ts
export { useCreateComment } from './model';
export { CommentForm, CommentList } from './ui';
```

## Common Patterns

### Pattern 1: CRUD Feature
```
feature-name/
├── model/
│   ├── use-create-item.ts
│   ├── use-update-item.ts
│   ├── use-delete-item.ts
│   └── index.ts
├── ui/
│   ├── create-item-modal.tsx
│   ├── update-item-form.tsx
│   ├── delete-item-dialog.tsx
│   └── index.ts
└── index.ts
```

### Pattern 2: State Management Feature
```
feature-name/
├── model/
│   ├── use-feature-state.ts  # Main state hook
│   ├── types.ts              # State types
│   └── index.ts
├── ui/
│   ├── feature-controls.tsx  # UI controls
│   ├── feature-display.tsx   # Display state
│   └── index.ts
└── index.ts
```

### Pattern 3: Modal/Dialog Feature
```
feature-name/
├── model/
│   ├── use-feature-action.ts  # Business logic
│   └── index.ts
├── ui/
│   ├── feature-modal.tsx       # Modal wrapper
│   ├── feature-form.tsx        # Form inside modal
│   └── index.ts
└── index.ts
```

## Testing

Test features with integration tests:

```typescript
// features/auth/model/__tests__/use-logout.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useLogout } from '../use-logout';

describe('useLogout', () => {
  it('should logout user', async () => {
    const { result } = renderHook(() => useLogout());

    result.current.mutate();

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});
```

## Best Practices

1. **Keep features isolated** - No cross-feature imports
2. **Single responsibility** - One feature = one user action
3. **Compose entities** - Build features from entities layer
4. **Validate inputs** - Use Zod schemas for all forms
5. **Handle errors** - Show user-friendly error messages
6. **Loading states** - Show loading indicators during actions
7. **Optimistic updates** - Update UI before API response
8. **Invalidate queries** - Refresh data after mutations

## Resources

- [FSD Features Documentation](https://feature-sliced.design/docs/reference/layers#features)
- [React Query Documentation](https://tanstack.com/query/latest)
- [React Hook Form Documentation](https://react-hook-form.com/)
