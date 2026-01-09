---
name: api-work
description: Work with API client - generate types, use hooks, add endpoints
allowed-tools:
  - Bash
  - Read
  - Edit
---

# API Work Skill

Work with the auto-generated API client.

## Key Commands

```bash
npm run api:generate        # Generate API client from swagger.yaml
npm run api:generate:watch  # Watch mode for API generation
```

## Critical Rules

**DO NOT manually edit these directories:**
- `src/lib/api/generated/` - Orval-generated hooks
- `src/types/api/` - Orval-generated types

These files are auto-generated from `swagger.yaml`. Any manual changes will be overwritten.

## Adding New API Calls

1. Check if endpoint exists in `swagger.yaml`
2. If not, coordinate with backend team to add it
3. Run `npm run api:generate` after swagger.yaml changes
4. Import hooks from generated files

## Using Generated Hooks

```tsx
// Queries
import { useGetPrompts } from '@/lib/api/generated/prompts/prompts';
const { data, isLoading, error } = useGetPrompts({ page: 1, per_page: 20 });

// Mutations
import { usePostPrompts } from '@/lib/api/generated/prompts/prompts';
const mutation = usePostPrompts();
mutation.mutate({ title: 'My Prompt', content: '...' });
```

## Axios Instance

Custom axios instance at `src/lib/api/axios-instance.ts` handles:
- JWT token injection via Authorization header
- Automatic token refresh on 401 responses
- Token storage in localStorage

## File Structure

```
src/lib/api/
├── axios-instance.ts     # Custom axios with JWT refresh (EDITABLE)
└── generated/            # Orval output (DO NOT EDIT)
    ├── prompts/
    ├── folders/
    ├── tags/
    └── ...

src/types/api/            # Generated types (DO NOT EDIT)
```

## API Spec Reference

Full API specification is in `swagger.yaml` at project root.
