---
name: git-workflow
description: Git workflow rules - branch naming, CHANGELOG updates. Auto-invoked for git tasks
user-invocable: false
---

# Git Workflow

Project Git conventions and workflow rules.

## Before Starting Work

1. Check current branch: `git branch --show-current`
2. If on **main** - create new branch:
   ```bash
   git pull origin main
   git checkout -b <type>/<short-description>
   ```
3. If NOT on main - continue in current branch

## Branch Naming

Format: `<type>/<short-description>`

| Type | Use for |
|------|---------|
| `feat/` | New feature |
| `fix/` | Bug fix |
| `refactor/` | Refactoring |
| `docs/` | Documentation |
| `test/` | Tests |
| `chore/` | Technical tasks |

Examples:
- `feat/prompt-editor`
- `fix/login-validation`
- `refactor/api-hooks`

## CHANGELOG Workflow

**MANDATORY**: Before committing, update `CHANGELOG.md`:

1. Open `CHANGELOG.md` in project root
2. Add entry under `## [Unreleased]` section:
   ```markdown
   ### Added/Changed/Fixed/Removed
   - Description of what was done
   ```

## Committing

Use `/commit-pr` skill to:
- Create properly formatted commit
- Create or update Pull Request
- Follow all project conventions

## Important Rules

- Never commit directly to main
- Never commit secrets (.env, credentials)
- Always update CHANGELOG before commit
- Use conventional commit messages
