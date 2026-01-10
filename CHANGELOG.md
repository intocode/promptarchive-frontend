# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Prompt deletion functionality (prompts-crud-007)
  - Delete button on prompt detail page with destructive styling
  - DeletePromptDialog component with AlertDialog for confirmation
  - useDeletePrompt hook with cache invalidation and toast notifications
  - Redirects to /prompts after successful deletion
  - Added shadcn AlertDialog component for confirmation dialogs
- Comprehensive E2E test coverage for all uncovered pages
  - Prompts List Page tests (12 tests): initial load, empty state, error state, navigation, copy
  - Create Prompt Modal tests (14 tests): form validation, success/error flows, cancel behavior
  - Prompt Detail Page tests (22 tests): view mode, edit mode, error state, copy, API errors
  - Settings Page tests (4 tests): page access, protected route redirect
  - Home Page Redirect tests (2 tests): auth-based routing
  - Page Object Models: PromptsListPage, PromptDetailPage, CreatePromptModal, SettingsPage, HomePage
  - API mock helpers: mockPromptsListError, mockCreatePromptError, mockUpdatePromptError
  - Consolidated route handling with route.fallback() for proper handler chaining
  - Added clipboard permissions to Playwright config for copy tests

### Changed

- Extracted AuthenticatedLayout component to reduce layout duplication
- Consolidated visibility configuration into shared utility module
- Added explicit React.ReactElement return types to page components
- Removed redundant section comments from prompt-row components

### Added

- Prompt update API integration (prompts-crud-006)
  - Edit button on prompt detail page opens inline edit form
  - EditPromptForm component with title, content, description, visibility fields
  - useUpdatePrompt hook with optimistic updates and error rollback
  - PATCH /prompts/{id} called with only changed fields
  - Query invalidation for prompt detail and list after successful update
  - Toast notifications for success/error feedback
  - Escape key cancels edit mode
  - Update validation schema added to prompt validations
- Prompt detail page (prompts-detail-001)
  - Dynamic route at `/prompts/[id]` for viewing individual prompts
  - Fetches prompt data using `useGetPromptsId` hook on page load
  - Displays title, content (with serif font), and full metadata
  - Metadata includes: visibility icon/label, folder badge, relative date, use count, view count
  - Tags displayed as badges
  - Description shown when present
  - Content block with copy button and clipboard feedback
  - Breadcrumb navigation back to prompts list
  - Loading skeleton during data fetch
  - Error state with retry button for not found/permission errors
  - Components: PromptDetailContent, PromptDetailSkeleton, PromptDetailError
- Prompt creation flow (prompts-list-012, prompts-crud-001, prompts-crud-002)
  - "New Prompt" button in prompts page header with Plus icon
  - CreatePromptModal component using Dialog with size="md" (550px)
  - CreatePromptForm with Zod validation and react-hook-form
  - Form fields: title (max 200 chars), content (auto-expanding, max 50KB), description (optional, max 1000 chars), visibility select (private/public/unlisted)
  - Validation errors shown on submit only (mode: "onSubmit")
  - API integration with usePostPrompts mutation hook
  - Query invalidation to refresh prompts list after creation
  - Toast notifications for success/error feedback
  - AutoExpandTextarea component for dynamic content field height
  - Added shadcn/ui Textarea and Select components

### Changed

- Converted PromptCard to PromptRow with row-based layout (prompts-list-001-bugfix)
  - Renamed `prompt-card.tsx` to `prompt-row.tsx` for semantic clarity
  - Replaced card grid layout with flex row list layout
  - Row contains: title, folder badge, tags (max 3), visibility icon, date, use_count, copy button
  - Hover state changed from shadow to subtle background color (`bg-accent/50`)
  - Responsive layout: stacks vertically on mobile, horizontal row on desktop
  - Container uses `divide-y` border styling for clean list appearance
  - Updated skeleton component to match row layout

### Added

- PromptCard compact view updates (prompts-list-001)
  - Visibility icon (Lock for private, Globe for public/unlisted) replacing text badge
  - Usage counter displaying use_count field
  - Quick copy button with clipboard feedback (Check icon)
  - Removed content preview for compact mode per design spec
  - Updated PromptCardSkeleton to match new compact layout
- useCopyToClipboard hook (`src/hooks/use-copy-to-clipboard.ts`)
  - Reusable clipboard functionality with toast notifications
  - Returns copy function and copied state for UI feedback
- Base modal/dialog component (design-005)
  - Added shadcn/ui Dialog component with size variants (sm: 400px, md: 550px, lg: 800px)
  - Mobile full-screen behavior (< 768px viewport)
  - Close on backdrop click and Escape key (built into Radix primitives)
  - Size prop on DialogContent with `data-size` attribute for styling
  - Exports: Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose

### Changed

- Updated PRD.json with refined task specifications
  - PromptCard (compact): Updated DoD to include usage counter, copy button, visibility icon, no content preview
  - PromptCard (expanded): Added description field, content preview (100-200 chars), full statistics
  - Sort dropdown: Added sort options (Recently Modified, Date Created, Most Used, Most Forked)
  - View mode toggle: New task for compact/expanded view switching
  - Prompt form: Simplified to exclude folder/tag selectors (moved to detail page)
  - Version history: Changed to slide-in panel from right side
  - Inline tag/folder selection: New tasks for prompt detail page
  - AI features: Updated UI specs for improve modal, diff view, tag suggestions
  - Rate limit: Simplified to toast-only feedback (no cooldown timer)
  - Gallery: Updated card layout specs, sorting options
  - Mobile: Clarified limited functionality (view/browse/copy only)

### Added

- Home page redirect based on auth state (design-003)
  - Authenticated users redirected to /prompts
  - Unauthenticated users redirected to /gallery
  - Removed default Next.js template content
  - Uses existing AuthContext pattern with LoadingSpinner
- Header with full navigation (design-002)
  - Navigation links: My Prompts, Gallery, Settings
  - Active route highlighting using usePathname
  - Conditional logo navigation (/prompts for auth, /login for unauth)
  - Mobile burger menu using shadcn/ui Sheet component
  - Auth-based navigation filtering (My Prompts and Settings require auth)
  - Added shadcn/ui Sheet component for mobile navigation
- Typography system configuration (design-001)
  - Inter font from Google Fonts for UI elements (default font)
  - Spectral font from Google Fonts for prompt content
  - CSS variables `--font-inter` and `--font-spectral` via next/font
  - `--font-sans` updated to use Inter with system font fallbacks
  - `--font-serif` added for Spectral with serif fallbacks
  - Utility classes `.font-ui` and `.font-content` in `@layer utilities`
- Design system tasks in PRD.json
  - Added `design-system` category as first category
  - design-001: Configure typography system (Inter + Spectral fonts)
  - design-002: Update header with full navigation
  - design-003: Configure home page redirect
  - design-004: Apply typography to PromptCard
  - design-005: Create base modal/dialog component
  - Corresponding test tasks for each design task
- UI-UX-DESIGN.md specification document with complete design guidelines
  - Branding and visual identity (warm neutrals, terracotta accent)
  - Information architecture (navigation, routes, filters)
  - Card and list system patterns
  - Interaction patterns (modals, forms, feedback)
  - AI features specifications
  - Mobile responsiveness rules
- Test user credentials in CLAUDE.md for staging environment
- Prompts list page with data fetching (prompts-list-003)
  - GET /prompts called with useGetPrompts hook (TanStack Query)
  - List renders PromptCard components in responsive grid (1/2/3 columns)
  - Loading skeleton shown during fetch (6 skeleton cards)
  - Error state with retry button
  - Empty state for when no prompts exist
  - Added shadcn/ui Skeleton component
  - Added PromptCardSkeleton component (`src/components/prompts/prompt-card-skeleton.tsx`)
- PromptCard component for compact prompt display (prompts-list-001)
  - Card displays title (truncated), content preview, folder, and tags
  - Visibility badge with appropriate styling (Public/Private/Unlisted)
  - Relative date formatting for updated timestamp
  - Hover effect with shadow elevation
  - Click navigation to prompt detail page
  - Added shadcn/ui Card and Badge components
  - Added formatRelativeDate utility function (`src/lib/utils.ts`)
- Auth error handling with toast notifications (auth-006)
  - New auth-error utility for centralized error handling (`src/lib/utils/auth-error.ts`)
  - Network errors show "Unable to connect" message
  - Rate limit (429) errors show countdown and disable submit button
  - Server errors (5xx) show "Something went wrong" message
  - Duplicate email errors shown inline on email field
  - Invalid credentials shown via toast notification
  - Rate limit countdown timer in login and register forms
- Logout functionality (auth-007)
  - Header component with brand logo and user menu (`src/components/layout/header.tsx`)
  - UserMenu component with user avatar dropdown (`src/components/layout/user-menu.tsx`)
  - useLogout hook that calls POST /auth/logout API (`src/hooks/use-logout.ts`)
  - Logout clears tokens from localStorage and redirects to /login
  - Graceful error handling - clears local state even if API call fails
  - Added shadcn/ui Avatar and DropdownMenu components
- Protected route middleware (auth-004)
  - Next.js proxy for server-side route protection (`src/proxy.ts`)
  - Auth cookie utilities for syncing auth state (`src/lib/utils/auth-cookie.ts`)
  - AuthGuard component for protected pages (`src/components/auth/auth-guard.tsx`)
  - GuestGuard component for guest-only pages (`src/components/auth/guest-guard.tsx`)
  - LoadingSpinner shared component (`src/components/ui/loading-spinner.tsx`)
  - Protected /prompts and /settings routes with placeholder pages
  - Redirect to original URL after login via query param
  - Authenticated users redirected from login/register to /prompts
- E2E tests for protected route middleware (auth-004-tests)
  - Test: Unauthenticated user redirected from /prompts to /login
  - Test: Redirect includes original URL as query parameter
  - Test: Authenticated user redirected from /login to /prompts
  - Test: Redirect preserves original destination after login
- Auth context/state management (auth-003)
  - AuthContext with user, isAuthenticated, isLoading states (`src/lib/contexts/auth-context.tsx`)
  - useAuth hook for consuming auth context (`src/hooks/use-auth.ts`)
  - Session restoration on app mount via GET /auth/me
  - Login form now updates auth context on successful login
- E2E tests for auth context (auth-003-tests)
  - Test: AuthProvider initializes with null user when no token exists
  - Test: Valid token restores user session
  - Test: Invalid token clears localStorage
- E2E tests for registration form (auth-002-tests)
  - RegisterPage Page Object Model (`e2e/pages/register.page.ts`)
  - Registration test suite with 13 test cases covering success, failure, validation, and initial state
  - Register endpoint mock in API fixtures (201 success, 409 duplicate email)
  - REGISTER_CREDENTIALS test data for various validation scenarios
- Pre-commit hook with Husky that runs linting, build, and E2E tests before each commit
- Registration page with form validation (`/register`)
- Registration form component with Zod validation (name, email, password with confirmation)
- Register schema with password match validation (`src/lib/validations/auth.ts`)
- E2E testing infrastructure with Playwright
  - `playwright.config.ts` with Chromium project, auth setup, and web server config
  - Page Object Model pattern (`e2e/pages/login.page.ts`)
  - API mock fixtures with Playwright route interception (`e2e/fixtures/`)
  - Auth fixtures for authenticated/unauthenticated test scenarios
  - Login flow test suite with 13 test cases covering success, failure, and validation
  - GitHub Actions workflow for CI (`e2e-tests.yml`)
  - npm scripts: `test:e2e`, `test:e2e:ui`, `test:e2e:debug`, `test:e2e:headed`, `test:e2e:report`, `test:e2e:codegen`
- Test task entries in PRD.json for all existing features (auth, prompts, templates, AI, folders, sharing, gallery, settings)
- Login page with form validation (`/login`)
- Login form component with Zod validation (email, password min 8 chars)
- Sonner toast notifications for error/success messages
- shadcn/ui form components (form, input, button, label)
- Auth validation schemas (`src/lib/validations/auth.ts`)
- TanStack Query (`@tanstack/react-query`) with QueryClientProvider
- Orval for API client generation from swagger.yaml
- shadcn/ui component library (New York style)
- Zod, react-hook-form, @hookform/resolvers for form handling
- Axios instance with JWT refresh interceptors
- Custom theme: warm beige/sand background with terracotta accent
- Project folder structure: components/, hooks/, lib/api/, lib/validations/, types/

### Changed

- Prompts and Settings layouts now include Header component for authenticated pages
- Updated PRD.json API endpoints to match backend implementation (PUT → PATCH for updates)
- Aligned API paths in PRD.json with actual backend routes

### Fixed

- Axios interceptor now skips token refresh for auth endpoints (prevents redirect loop on login failure)

### Removed

- Removed swagger.yaml (API specs managed in backend repo)
- Removed deprecated PRD items: auth-008 (logout all devices duplicate), sharing-003 (active share links display), settings-001 (profile section), settings-002 (password change)
