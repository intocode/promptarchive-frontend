interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

export function LoadingSpinner({
  fullScreen = false,
}: LoadingSpinnerProps): React.ReactElement {
  const spinner = (
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}
