---
name: shadcn
description: Add and configure shadcn/ui components with proper styling
allowed-tools:
  - Bash
  - Read
  - Edit
---

# shadcn/ui Components Skill

Add and configure shadcn/ui components.

## Adding Components

```bash
npx shadcn@latest add <component-name>
```

Examples:
```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add form
npx shadcn@latest add input
npx shadcn@latest add toast
```

## Configuration

- Config file: `components.json`
- Style: **New York**
- Components directory: `src/components/ui/`

## Import Pattern

```tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
```

## Styling

- Use Tailwind CSS classes
- Use `cn()` helper for conditional classes:
  ```tsx
  import { cn } from '@/lib/utils';

  <div className={cn('base-class', condition && 'conditional-class')} />
  ```

## Common Components

| Component | Use for |
|-----------|---------|
| `button` | Actions, submit |
| `input` | Text input fields |
| `textarea` | Multi-line text |
| `dialog` | Modal dialogs |
| `dropdown-menu` | Menus, selects |
| `toast` | Notifications |
| `skeleton` | Loading states |
| `form` | Form validation |

## Before Adding

1. Check if component already exists in `src/components/ui/`
2. Consider if base shadcn component needs customization
3. Follow project design system (see `/ui-design` skill)
