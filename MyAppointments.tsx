import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-primary text-primary-foreground p-6 text-center">
          <div className="space-y-4 max-w-md">
            <h1 className="text-3xl font-serif text-secondary">Algo salió mal</h1>
            <p className="text-sm text-gray-300 font-light">
              Lamentamos el inconveniente. Por favor, recargue la página o póngase en contacto con soporte si el problema persiste.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-secondary text-primary font-bold tracking-widest uppercase text-xs hover:bg-white transition-colors"
            >
              Recargar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
