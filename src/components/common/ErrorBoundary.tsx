import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";

interface Props {
  children: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("🚨 ErrorBoundary capturou um erro:", error);
    console.error("🔍 Informações do erro:", errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Notificar callback se fornecido
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <div style={{ color: "#432818" }}>
              <AlertTriangle size={48} className="mx-auto" />
            </div>

            <h2 style={{ color: "#432818" }}>Oops! Algo deu errado</h2>

            <p style={{ color: "#6B4F43" }}>
              O editor encontrou um erro inesperado. Não se preocupe, seus dados
              estão seguros.
            </p>

            <div className="space-y-3">
              <Button
                onClick={this.handleReset}
                className="w-full"
                variant="default"
              >
                Tentar Novamente
              </Button>

              <Button
                onClick={this.handleReload}
                className="w-full"
                variant="outline"
              >
                Recarregar Página
              </Button>
            </div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-6 text-left">
                <summary style={{ color: "#8B7355" }}>
                  Detalhes do erro (desenvolvimento)
                </summary>
                <pre style={{ backgroundColor: "#E5DDD5" }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
