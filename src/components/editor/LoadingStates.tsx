import React from 'react';
import { Loader2, FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

/**
 * 🔄 LOADING STATES: Estados de carregamento otimizados
 *
 * Componentes especializados para diferentes contextos:
 * ✅ Loading de blocos individuais
 * ✅ Loading de templates completos
 * ✅ Skeletons específicos por tipo de bloco
 * ✅ Estados de erro amigáveis
 */

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text = 'Carregando...',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  );
};

export const BlockSkeleton: React.FC<{ type?: string }> = ({ type = 'default' }) => {
  const getSkeletonByType = () => {
    switch (type) {
      case 'text':
      case 'text-inline':
        return (
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        );

      case 'quiz-header':
        return (
          <div className="flex items-center justify-between p-4">
            <Skeleton className="h-12 w-12 rounded" />
            <Skeleton className="h-2 flex-1 mx-4" />
            <Skeleton className="h-4 w-16" />
          </div>
        );

      case 'image':
      case 'image-inline':
        return <Skeleton className="h-48 w-full rounded-lg" />;

      case 'button':
        return <Skeleton className="h-10 w-32 rounded-md" />;

      case 'lead-form':
        return (
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        );

      case 'options-grid':
        return (
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <div className="grid grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-3">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-12 w-full" />
          </div>
        );
    }
  };

  return (
    <Card className="animate-pulse">
      <CardContent className="p-4">{getSkeletonByType()}</CardContent>
    </Card>
  );
};

export const TemplateSkeleton: React.FC = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 mb-4">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="text-sm text-muted-foreground">Carregando template...</span>
    </div>

    {/* Header skeleton */}
    <BlockSkeleton type="quiz-header" />

    {/* Content skeletons */}
    <BlockSkeleton type="text" />
    <BlockSkeleton type="options-grid" />
    <BlockSkeleton type="button" />
  </div>
);

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <FileText className="h-12 w-12 text-muted-foreground/50" />,
  title,
  description,
  action,
}) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    {icon}
    <h3 className="mt-4 text-lg font-medium">{title}</h3>
    {description && <p className="mt-2 text-sm text-muted-foreground max-w-sm">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  onReset?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry, onReset }) => (
  <Card className="border-destructive bg-destructive/5">
    <CardContent className="p-6">
      <div className="flex flex-col items-center text-center">
        <div className="rounded-full bg-destructive/10 p-3 mb-4">
          <FileText className="h-6 w-6 text-destructive" />
        </div>

        <h3 className="text-lg font-medium text-destructive mb-2">Erro ao Carregar</h3>

        <p className="text-sm text-muted-foreground mb-4 max-w-sm">{error}</p>

        <div className="flex gap-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Tentar Novamente
            </button>
          )}
          {onReset && (
            <button
              onClick={onReset}
              className="px-4 py-2 text-sm border border-input rounded-md hover:bg-accent"
            >
              Resetar
            </button>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

// Loading states específicos para diferentes operações
export const BlockLoadingStates = {
  Spinner: LoadingSpinner,
  Skeleton: BlockSkeleton,
  Template: TemplateSkeleton,
  Empty: EmptyState,
  Error: ErrorState,
};
