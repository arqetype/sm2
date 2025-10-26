import { Component, type ReactNode, type ErrorInfo } from 'react';

interface TabErrorBoundaryProps {
  children: ReactNode;
  tabId: string;
  fallback?: ReactNode;
}

interface TabErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class TabErrorBoundary extends Component<TabErrorBoundaryProps, TabErrorBoundaryState> {
  constructor(props: TabErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): TabErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(`Error in tab ${this.props.tabId}:`, error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center h-full w-full p-4">
            <div className="text-destructive">
              <p className="font-semibold">Error in tab</p>
              <p className="text-sm text-muted-foreground">{this.state.error?.message}</p>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
