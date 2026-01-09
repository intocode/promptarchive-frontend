---
name: ui-design
description: Create and edit UI components. Reads UI-UX-DESIGN.md for design specifications
allowed-tools:
  - Read
  - Edit
  - Write
  - Glob
---

# UI Design Skill

Create and edit UI components following project design specifications.

## Before Starting

**IMPORTANT**: Read `UI-UX-DESIGN.md` before any UI work to understand:
- Design system and branding
- Component patterns
- Interaction specifications
- Mobile behavior

## Design System Quick Reference

### Colors
- **Background**: Warm neutrals (beige/sand like Claude)
- **Accent**: Terracotta/orange
- **Default folder/tag color**: #6366f1

### Typography
- **Interface font**: Humanist sans-serif (Inter, Satoshi)
- **Content font**: Serif (Spectral, Georgia) - for prompt text

### Key Patterns

| Element | Pattern |
|---------|---------|
| Navigation | Topbar only, no sidebar |
| Loading | Skeleton screens |
| Success/Error | Toast notifications (top-right) |
| Empty state | Illustration + text + CTA button |
| Dangerous action | Red button color |

### Modal Sizes
- Create prompt: 500-600px (compact)
- History panel: Slide-in from right
- Share modal: Minimal
- Confirm dialogs: Standard system style

### Mobile Behavior
- **Read-only**: Gallery, view prompts, copy only
- **No create/edit** on mobile
- Navigation: Burger menu
- Cards: Compact mode only

## Checklist Before Creating Component

1. [ ] Read relevant section in UI-UX-DESIGN.md
2. [ ] Check if similar component exists in `src/components/ui/`
3. [ ] Use shadcn/ui base components when available
4. [ ] Follow existing naming conventions
5. [ ] Consider mobile breakpoints (< 768px)
6. [ ] Add skeleton loader for async content
7. [ ] Handle empty states

## File Locations

- UI components: `src/components/ui/`
- Layout components: `src/components/layout/`
- Page components: `src/app/`
- Design spec: `UI-UX-DESIGN.md`
