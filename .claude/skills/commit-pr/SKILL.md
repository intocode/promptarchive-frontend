---
name: commit-pr
description: Commit changes and create/update Pull Request following project conventions
allowed-tools:
  - Bash
  - Read
---

# Commit and Pull Request

Commit current changes and create/update a Pull Request.

## Workflow

### 1. Analyze Changes

Run in parallel:
- `git status` - view all changes
- `git diff --staged` - staged changes
- `git diff` - unstaged changes
- `git branch --show-current` - current branch
- `git log -3 --oneline` - recent commits for style reference

### 2. Prepare Commit

1. Analyze ALL changes (staged + unstaged)
2. Create informative commit message:
   - First line: brief description (up to 72 characters)
   - Empty line
   - Detailed description (bullet points)
   - List affected files/components
   - Add iteration context if applicable

3. Message format:
```
<type>: <brief description>

- Detailed change 1
- Detailed change 2
- ...

Co-Authored-By: Claude <noreply@anthropic.com>
```

Types: feat, fix, refactor, docs, test, chore, style

### 3. Update CHANGELOG

Before committing, update `CHANGELOG.md`:
1. Add entry under `## [Unreleased]` section
2. Use format: `### Added/Changed/Fixed/Removed`

### 4. Commit

```bash
git add -A
git commit -m "$(cat <<'EOF'
<message>
EOF
)"
```

### 5. Check Existing PR

Check if PR already exists for current branch:
```bash
gh pr list --head $(git branch --show-current) --state open
```

### 6. Push and PR

If PR does NOT exist:
1. Push changes: `git push -u origin <branch>`
2. Create PR:
```bash
gh pr create --title "<title>" --body "$(cat <<'EOF'
## Summary
<brief description of changes>

## Changes
- Change 1
- Change 2

## Test plan
- [ ] Tests pass
- [ ] Code checked by linter

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

If PR already exists:
1. Push changes: `git push`
2. Inform user that PR is already open and changes were added

### 7. Output Result

Display:
- Commit message
- PR status (created new / updated existing)
- PR URL

## Important Rules

- NEVER commit files with secrets (.env, credentials)
- Check that branch is not main/master before creating PR
- If no changes - report this and do not create empty commit
- Use `--no-verify` only if user explicitly requests it
