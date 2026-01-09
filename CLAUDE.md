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

```
src/
├── app/           # Pages (App Router)
├── components/    # UI and layout components
├── lib/api/       # Axios instance + generated hooks
├── lib/validations/  # Zod schemas
└── types/         # TypeScript types
```

## Routes

| Route                       | Auth | Description    |
| --------------------------- | ---- | -------------- |
| `/login`, `/register`       | No   | Auth pages     |
| `/prompts`, `/settings`     | Yes  | User pages     |
| `/gallery`, `/gallery/[id]` | No   | Public gallery |
| `/shared/[token]`           | No   | Shared prompt  |

## Key Rules

1. **Generated files**: DO NOT edit `src/lib/api/generated/` or `src/types/api/`
2. **UI changes**: use `/ui-design` skill
3. **API work**: Use `/api-work` skill for guidance
4. **Components**: Use `/shadcn` skill to add shadcn/ui components
5. **Git**: Always update `CHANGELOG.md` before commit, use `/commit-pr`
6. **Code cleanup**: After completing any coding task, invoke the `code-simplifier` agent to refine modified code for clarity and consistency
7. **PRD tasks**: After completing a task from `PRD.json`, update its `passed` field to `true`

## Skills Available

| Skill        | Description              |
| ------------ | ------------------------ |
| `/commit-pr` | Commit and create PR     |
| `/ui-design` | UI component guidelines  |
| `/api-work`  | API client usage         |
| `/shadcn`    | Add shadcn/ui components |
| `/testing`   | Write and run tests      |
