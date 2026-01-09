---
name: testing
description: Write and run tests for components and hooks
allowed-tools:
  - Bash
  - Read
  - Edit
  - Write
---

# Testing Skill

Write and run tests for React components and hooks.

## Commands

```bash
npm run test           # Run tests
npm run test:watch     # Watch mode
npm run test:coverage  # With coverage
```

## File Naming

- Test files: `*.test.ts` or `*.test.tsx`
- Place next to source file or in `__tests__/` directory

Examples:
```
src/components/ui/button.tsx
src/components/ui/button.test.tsx

src/lib/hooks/useAuth.ts
src/lib/hooks/__tests__/useAuth.test.ts
```

## Component Testing Pattern

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

## Hook Testing Pattern

```tsx
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('increments counter', () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
```

## Testing with React Query

Wrap components using API hooks with QueryClientProvider:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

render(<MyComponent />, { wrapper });
```

## What to Test

- [ ] Component renders correctly
- [ ] User interactions work
- [ ] Loading states display
- [ ] Error states handle gracefully
- [ ] Edge cases (empty data, long text, etc.)
