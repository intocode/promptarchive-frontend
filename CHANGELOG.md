# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

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

- Updated PRD.json API endpoints to match backend implementation (PUT → PATCH for updates)
- Aligned API paths in PRD.json with actual backend routes

### Fixed

- Axios interceptor now skips token refresh for auth endpoints (prevents redirect loop on login failure)

### Removed

- Removed swagger.yaml (API specs managed in backend repo)
- Removed deprecated PRD items: auth-008 (logout all devices duplicate), sharing-003 (active share links display), settings-001 (profile section), settings-002 (password change)
