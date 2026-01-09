# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
