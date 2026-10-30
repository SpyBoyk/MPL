import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-xl mx-auto my-12 bg-white rounded-2xl border border-rose-200 shadow-xl text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Something went wrong</h2>
          <p className="text-xs text-slate-500">
            {this.state.error?.message || 'An unexpected rendering error occurred.'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#174478] text-white text-xs font-bold rounded-lg hover:brightness-110 transition shadow-sm cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Application</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
