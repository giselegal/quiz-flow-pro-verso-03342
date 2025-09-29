import React, { Component, ReactNode } from 'react';
import EditorFallback from './EditorFallback';

interface EditorErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface EditorErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export class EditorErrorBoundary extends Component<
  EditorErrorBoundaryProps,
  EditorErrorBoundaryState
> {
  constructor(props: EditorErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): EditorErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Editor Error Boundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <EditorFallback 
            error={this.state.error}
            resetError={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
            onRetry={() => window.location.reload()}
            onGoHome={() => window.location.href = '/'}
          />
        )
      );
    }

    return this.props.children;
  }
}
