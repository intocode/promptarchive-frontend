# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

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

### Removed

- Removed swagger.yaml (API specs managed in backend repo)
- Removed deprecated PRD items: auth-008 (logout all devices duplicate), sharing-003 (active share links display), settings-001 (profile section), settings-002 (password change)
