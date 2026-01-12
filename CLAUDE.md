# CLAUDE.md

Project instructions for Claude Code.

## Project Overview

**PromptArchive Frontend** — Next.js web app for storing, organizing, and sharing AI prompts.

Design: Professional, warm neutrals (beige/sand), terracotta accent. References: Anthropic, Claude, OpenAI.

## Tech Stack

- Next.js 16 (App Router) + React 19
- TanStack Query for server state
- Orval for API client generation
- shadcn/ui (New York) + Tailwind CSS 4
- Zod + react-hook-form for forms
- Axios with JWT refresh

## Project Structure

This project follows [Feature-Sliced Design (FSD)](./docs/FSD.md) architecture.

```
src/
├── app/           # Next.js pages and routing (App Router)
├── widgets/       # Complex page sections (header, prompt-list, gallery)
├── features/      # User interactions (auth, prompt-crud, filters)
├── entities/      # Business models (prompt, user, folder, tag)
└── shared/        # Reusable code (ui, lib, api, hooks)
```

**Layer hierarchy (strict import rules):**
- `app/` → can import from: widgets, features, entities, shared
- `widgets/` → can import from: features, entities, shared
- `features/` → can import from: entities, shared
- `entities/` → can import from: shared
- `shared/` → can import from: external libraries only

**Path aliases:**
- `@app/*` - App layer (pages)
- `@widgets/*` - Widgets layer (page sections)
- `@features/*` - Features layer (user actions)
- `@entities/*` - Entities layer (business models)
- `@shared/*` - Shared layer (ui, lib, api, hooks)

📖 See [FSD Documentation](./docs/FSD.md) for detailed architecture guide.

## Routes

| Route                       | Auth | Description    |
| --------------------------- | ---- | -------------- |
| `/login`, `/register`       | No   | Auth pages     |
| `/prompts`, `/settings`     | Yes  | User pages     |
| `/gallery`, `/gallery/[id]` | No   | Public gallery |
| `/shared/[token]`           | No   | Shared prompt  |

## Test Users (Staging)

| Email               | Password       | Description                    |
| ------------------- | -------------- | ------------------------------ |
| `test@example.com`  | `password123`  | Main test user                 |
| `liker@example.com` | `password123`  | User for testing likes         |

API: `https://api.prompt.intocode.ru` — run `GET /v1/seed` to reset test data.

## Key Rules

1. **Generated files**: DO NOT edit `src/shared/api/generated/` or `src/types/api/`
2. **UI changes**: use `/ui-design` skill
3. **API work**: Use `/api-work` skill for guidance
4. **Components**: Use `/shadcn` skill to add shadcn/ui components
5. **Git**: Always update `CHANGELOG.md` before commit, use `/commit-pr`
6. DEPRECATED: **Code cleanup**: After completing any coding task, invoke the `code-simplifier` agent to refine modified code for clarity and consistency
7. **PRD tasks**: After completing a task from `PRD.json`, update its `passed` field to `true`

## FSD Guidelines

When adding new code, follow Feature-Sliced Design principles:

### Where to put new code:

- **UI components (generic)** → `src/shared/ui/`
- **Business model** → `src/entities/{entity-name}/`
- **User action/feature** → `src/features/{feature-name}/`
- **Page section** → `src/widgets/{widget-name}/`
- **Page** → `src/app/{route}/page.tsx`

### Import rules:

✅ **ALLOWED:**
- `app/` → `@widgets/`, `@features/`, `@entities/`, `@shared/`
- `widgets/` → `@features/`, `@entities/`, `@shared/`
- `features/` → `@entities/`, `@shared/`
- `entities/` → `@shared/`

❌ **FORBIDDEN:**
- Importing from higher layers (e.g., `@features/` cannot import from `@widgets/`)
- Cross-imports within same layer (e.g., `@features/auth` cannot import from `@features/prompt-crud`)

### Layer documentation:

- 📖 [FSD Overview](./docs/FSD.md) - Main architecture guide
- 📖 [Shared Layer](./src/shared/README.md) - UI components, utilities, API
- 📖 [Entities Layer](./src/entities/README.md) - Business models
- 📖 [Features Layer](./src/features/README.md) - User interactions
- 📖 [Widgets Layer](./src/widgets/README.md) - Page sections

## Skills Available

| Skill        | Description              |
| ------------ | ------------------------ |
| `/commit-pr` | Commit and create PR     |
| `/ui-design` | UI component guidelines  |
| `/api-work`  | API client usage         |
| `/shadcn`    | Add shadcn/ui components |
| `/testing`   | Write and run tests      |
