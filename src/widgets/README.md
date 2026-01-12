# Widgets Layer

Complex, self-contained page sections that compose features and entities.

## Purpose

Widgets are large UI blocks that:
- Compose multiple features and entities
- Represent complete page sections
- Have complex internal logic and state
- Are reusable across multiple pages

**Key principle:** Widgets are page sections, not pages themselves.

## Structure

```
widgets/
├── header/
│   ├── model/         # Keyboard shortcuts, header state
│   ├── ui/            # Header components
│   └── index.ts
├── prompt-list/
│   ├── ui/            # List display, states
│   └── index.ts
├── prompt-detail/
│   ├── ui/            # Detail view components
│   └── index.ts
├── folder-sidebar/
│   ├── ui/            # Sidebar components
│   └── index.ts
├── gallery/
│   ├── model/         # Public gallery data hooks
│   ├── ui/            # Gallery components
│   └── index.ts
└── error/
    ├── ui/            # Error displays
    └── index.ts
```

## Current Widgets

### Header (`widgets/header/`)

Application header with navigation and user menu.

**Model:**
- `use-keyboard-shortcuts.ts` - Global keyboard shortcuts
- `use-shortcuts-help-dialog.ts` - Help dialog state

**UI:**
- `Header` - Main header component
- `UserMenu` - User dropdown menu
- `ThemeToggle` - Dark/light theme switcher
- `AuthenticatedLayout` - Layout with header
- `KeyboardShortcutsDialog` - Shortcuts help modal

**Usage:**
```typescript
import { AuthenticatedLayout, Header } from '@widgets/header';

export default function Layout({ children }) {
  return (
    <AuthenticatedLayout>
      {children}
    </AuthenticatedLayout>
  );
}
```

**Composes:**
- `@features/auth` - Logout functionality
- `@entities/user` - User data display

### Prompt List (`widgets/prompt-list/`)

Complete prompt list with filters, search, and infinite scroll.

**UI:**
- `PromptList` - Main list component
- `PromptListSkeleton` - Loading skeleton
- `EmptyState` - No prompts message
- `ErrorState` - Error display

**Usage:**
```typescript
import { PromptList } from '@widgets/prompt-list';

export default function PromptsPage() {
  return (
    <div>
      <h1>My Prompts</h1>
      <PromptList />
    </div>
  );
}
```

**Composes:**
- `@features/prompt-filters` - Search, sort, filter
- `@features/prompt-crud` - Create, update, delete
- `@entities/prompt` - Prompt cards/rows
- `@entities/folder` - Folder badges
- `@entities/tag` - Tag badges

### Prompt Detail (`widgets/prompt-detail/`)

Detailed prompt view with all actions.

**UI:**
- `PromptDetailContent` - Full prompt detail
- `PromptDetailSkeleton` - Loading skeleton

**Usage:**
```typescript
import { PromptDetailContent } from '@widgets/prompt-detail';

export default function PromptDetailPage({ params }) {
  return <PromptDetailContent promptId={params.id} />;
}
```

**Composes:**
- `@features/prompt-crud` - Edit, delete, copy
- `@features/prompt-sharing` - Share prompt
- `@features/ai-tools` - Improve, generate
- `@entities/prompt` - Prompt display
- `@entities/tag` - Tag display

### Folder Sidebar (`widgets/folder-sidebar/`)

Folder navigation sidebar with management.

**UI:**
- `FoldersSidebar` - Desktop sidebar
- `FoldersMobileSheet` - Mobile drawer

**Usage:**
```typescript
import { FoldersSidebar, FoldersMobileSheet } from '@widgets/folder-sidebar';

export default function PromptsLayout({ children }) {
  return (
    <div>
      <FoldersSidebar />
      <FoldersMobileSheet />
      <main>{children}</main>
    </div>
  );
}
```

**Composes:**
- `@features/folder-management` - CRUD operations
- `@entities/folder` - Folder items

### Gallery (`widgets/gallery/`)

Public gallery of shared prompts.

**Model:**
- `use-infinite-public-prompts.ts` - Public prompts data

**UI:**
- `PublicPromptCard` - Gallery card view
- `PublicPromptDetailContent` - Gallery detail view
- `PublicPromptDetailSkeleton` - Loading skeleton
- `SharedPromptDetailContent` - Shared link view
- `SharedPromptDetailSkeleton` - Loading skeleton

**Usage:**
```typescript
import {
  PublicPromptCard,
  PublicPromptDetailContent,
  useInfinitePublicPrompts,
} from '@widgets/gallery';

export default function GalleryPage() {
  const { data } = useInfinitePublicPrompts();

  return (
    <div>
      {data.pages.map(page =>
        page.data.map(prompt => (
          <PublicPromptCard key={prompt.id} prompt={prompt} />
        ))
      )}
    </div>
  );
}
```

**Composes:**
- `@entities/prompt` - Prompt display components
- `@entities/tag` - Tag display
- `@shared/ui` - UI components

### Error (`widgets/error/`)

Error boundary fallback displays.

**UI:**
- `ErrorFallback` - Error boundary fallback component

**Usage:**
```typescript
import { ErrorFallback } from '@widgets/error';

export default function ErrorPage({ error, reset }) {
  return <ErrorFallback error={error} reset={reset} />;
}
```

## Segments

### Model (`widgets/*/model/`)

Widget-specific business logic:
- Data fetching hooks
- Complex state management
- Widget-level orchestration

**Example:**
```typescript
// widgets/gallery/model/use-infinite-public-prompts.ts
import { useInfiniteQuery } from '@tanstack/react-query';

export function useInfinitePublicPrompts() {
  return useInfiniteQuery({
    queryKey: ['public-prompts'],
    queryFn: ({ pageParam = 1 }) => fetchPublicPrompts(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}
```

### UI (`widgets/*/ui/`)

Widget components and sub-components:
- Main widget component
- Internal sub-components
- Loading states
- Error states
- Empty states

**Example:**
```typescript
// widgets/prompt-list/ui/prompt-list.tsx
import { useInfinitePrompts } from '@features/prompt-filters';
import { PromptCard } from '@entities/prompt';
import { EmptyState } from './empty-state';

export function PromptList() {
  const { data, isLoading } = useInfinitePrompts();

  if (isLoading) return <PromptListSkeleton />;
  if (!data?.pages[0]?.data.length) return <EmptyState />;

  return (
    <div>
      {data.pages.map(page =>
        page.data.map(prompt => (
          <PromptCard key={prompt.id} prompt={prompt} />
        ))
      )}
    </div>
  );
}
```

## Import Rules

**Can import from:**
- @features/* (all features)
- @entities/* (all entities)
- @shared/* (all shared code)

**Cannot import from:**
- @widgets/* (other widgets - widgets are isolated)
- @app/* (pages should import widgets, not reverse)

**Cross-widget communication:**
Widgets should NOT import from each other. If widgets need to interact:
1. Compose both at page level
2. Use URL state/query params
3. Use global state (React Query cache)

## When to Create a New Widget

Create a new widget when:

✅ **YES - Create widget:**
- Represents a complete page section
- Composes multiple features/entities
- Used across multiple pages
- Has complex internal state
- Contains significant business logic

❌ **NO - Don't create widget:**
- It's a simple feature → use @features/
- It's an entity display → use @entities/*/ui/
- It's a whole page → use @app/
- It's a generic component → use @shared/ui/

## Widget vs Feature vs Entity

| Aspect | Entity | Feature | Widget |
|--------|--------|---------|--------|
| **Purpose** | Business model | User action | Page section |
| **Complexity** | Low | Medium | High |
| **Composition** | Atoms | Molecules | Organisms |
| **Examples** | PromptCard, UserAvatar | LoginForm, CreatePrompt | PromptList, Header |
| **State** | Props only | Feature state | Complex state |
| **Imports** | Shared only | Entities + Shared | Features + Entities + Shared |

## Public API Pattern

Each widget exports through index.ts:

```typescript
// widgets/header/index.ts
export {
  // Model exports (hooks)
  useKeyboardShortcuts,
  useShortcutsHelpDialog,
} from './model';

export {
  // UI exports (components)
  Header,
  UserMenu,
  ThemeToggle,
  AuthenticatedLayout,
  KeyboardShortcutsDialog,
} from './ui';
```

**Import from public API:**
```typescript
// ✅ Good
import { Header, AuthenticatedLayout } from '@widgets/header';

// ❌ Bad
import { Header } from '@widgets/header/ui/header';
```

## Adding a New Widget

### Step 1: Create structure
```bash
mkdir -p src/widgets/dashboard/{model,ui}
touch src/widgets/dashboard/index.ts
touch src/widgets/dashboard/model/index.ts
touch src/widgets/dashboard/ui/index.ts
```

### Step 2: Add model (if needed)
```typescript
// widgets/dashboard/model/use-dashboard-data.ts
import { useQuery } from '@tanstack/react-query';

export function useDashboardData() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
  });
}
```

### Step 3: Add UI components
```typescript
// widgets/dashboard/ui/dashboard.tsx
import { StatsDisplay } from '@features/statistics';
import { RecentPrompts } from '@features/recent-items';
import { useDashboardData } from '../model';

export function Dashboard() {
  const { data, isLoading } = useDashboardData();

  return (
    <div>
      <StatsDisplay stats={data.stats} />
      <RecentPrompts prompts={data.recent} />
    </div>
  );
}
```

### Step 4: Add supporting UI
```typescript
// widgets/dashboard/ui/dashboard-skeleton.tsx
export function DashboardSkeleton() {
  return <Skeleton />; // Loading state
}

// widgets/dashboard/ui/dashboard-error.tsx
export function DashboardError({ error }: Props) {
  return <ErrorDisplay error={error} />;
}
```

### Step 5: Export public API
```typescript
// widgets/dashboard/index.ts
export { useDashboardData } from './model';
export { Dashboard, DashboardSkeleton } from './ui';
```

### Step 6: Use in page
```typescript
// app/dashboard/page.tsx
import { Dashboard } from '@widgets/dashboard';

export default function DashboardPage() {
  return <Dashboard />;
}
```

## Common Patterns

### Pattern 1: List Widget
```typescript
// widgets/list-name/ui/list-name.tsx
export function ListWidget() {
  const { data, isLoading, error } = useData();

  if (isLoading) return <ListSkeleton />;
  if (error) return <ErrorState error={error} />;
  if (!data?.length) return <EmptyState />;

  return (
    <div>
      {data.map(item => <ItemCard key={item.id} item={item} />)}
    </div>
  );
}
```

### Pattern 2: Detail Widget
```typescript
// widgets/detail-name/ui/detail-name.tsx
export function DetailWidget({ id }: Props) {
  const { data, isLoading } = useItem(id);

  if (isLoading) return <DetailSkeleton />;

  return (
    <div>
      <DetailHeader item={data} />
      <DetailContent item={data} />
      <DetailActions item={data} />
    </div>
  );
}
```

### Pattern 3: Layout Widget
```typescript
// widgets/layout-name/ui/layout-name.tsx
export function LayoutWidget({ children }: Props) {
  return (
    <div>
      <LayoutHeader />
      <LayoutSidebar />
      <main>{children}</main>
      <LayoutFooter />
    </div>
  );
}
```

## State Management

Widgets often need complex state. Common approaches:

### 1. Local State (useState)
```typescript
const [isOpen, setIsOpen] = useState(false);
```

### 2. URL State (useSearchParams)
```typescript
const [searchParams, setSearchParams] = useSearchParams();
const page = searchParams.get('page') || '1';
```

### 3. React Query (useQuery/useMutation)
```typescript
const { data } = useQuery({ queryKey: ['items'], queryFn: fetchItems });
```

### 4. Context (for deep trees)
```typescript
const WidgetContext = createContext();
export const useWidgetContext = () => useContext(WidgetContext);
```

## Testing

Test widgets with integration tests:

```typescript
// widgets/prompt-list/ui/__tests__/prompt-list.test.tsx
import { render, screen } from '@testing-library/react';
import { PromptList } from '../prompt-list';

describe('PromptList', () => {
  it('should display prompts', async () => {
    render(<PromptList />);

    expect(await screen.findByText('My First Prompt')).toBeInTheDocument();
  });

  it('should show empty state when no prompts', async () => {
    render(<PromptList />);

    expect(await screen.findByText('No prompts yet')).toBeInTheDocument();
  });
});
```

## Best Practices

1. **Compose from lower layers** - Use features and entities
2. **Handle all states** - Loading, error, empty, success
3. **Keep isolated** - No cross-widget imports
4. **Responsive design** - Mobile and desktop views
5. **Performance** - Memoize expensive computations
6. **Accessibility** - Keyboard navigation, ARIA labels
7. **Error boundaries** - Wrap in error boundaries at page level

## Resources

- [FSD Widgets Documentation](https://feature-sliced.design/docs/reference/layers#widgets)
- [React Patterns](https://reactpatterns.com/)
