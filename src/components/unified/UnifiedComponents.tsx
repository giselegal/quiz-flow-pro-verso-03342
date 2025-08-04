// Component consolidation - Merge duplicate components and create unified system
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeletons";

// Unified Loading States
interface LoadingStateProps {
  type: "spinner" | "skeleton" | "dots" | "pulse";
  size?: "sm" | "md" | "lg";
  className?: string;
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  type,
  size = "md",
  className,
  message,
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const renderLoadingType = () => {
    switch (type) {
      case "spinner":
        return (
          <div
            className={cn(
              "animate-spin rounded-full border-2 border-primary border-t-transparent",
              sizeClasses[size],
            )}
          />
        );
      case "skeleton":
        return <Skeleton className={cn("rounded", sizeClasses[size])} />;
      case "dots":
        return (
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-full bg-primary animate-pulse",
                  size === "sm"
                    ? "w-1 h-1"
                    : size === "md"
                      ? "w-2 h-2"
                      : "w-3 h-3",
                )}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        );
      case "pulse":
        return (
          <div
            className={cn(
              "rounded bg-primary animate-pulse",
              sizeClasses[size],
            )}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-2",
        className,
      )}
    >
      {renderLoadingType()}
      {message && (
        <p className="text-sm text-muted-foreground text-center">{message}</p>
      )}
    </div>
  );
};

// Unified Empty States
interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className,
}) => (
  <div className={cn("text-center py-12 px-4", className)}>
    {icon && (
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center text-muted-foreground">
        {icon}
      </div>
    )}
    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    {description && (
      <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
        {description}
      </p>
    )}
    {action && (
      <Button onClick={action.onClick} className="mt-6" variant="default">
        {action.label}
      </Button>
    )}
  </div>
);

// Unified Card Layouts
interface UnifiedCardProps {
  variant: "default" | "funnel" | "quiz" | "result" | "dashboard";
  title: string;
  description?: string;
  status?: "draft" | "published" | "archived";
  stats?: { label: string; value: string | number }[];
  actions?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const UnifiedCard: React.FC<UnifiedCardProps> = ({
  variant,
  title,
  description,
  status,
  stats,
  actions,
  onClick,
  className,
}) => {
  const statusColors = {
    draft: "bg-stone-100 text-stone-700",
    published: "bg-green-100 text-green-800",
    archived: "bg-gray-100 text-gray-800",
  };

  return (
    <Card
      className={cn(
        "p-6 cursor-pointer transition-all hover:shadow-md",
        onClick && "hover:scale-[1.02]",
        className,
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground line-clamp-2">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {description}
            </p>
          )}
        </div>
        {status && <Badge className={statusColors[status]}>{status}</Badge>}
      </div>

      {stats && stats.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {actions && (
        <div className="flex justify-end space-x-2 pt-4 border-t">
          {actions}
        </div>
      )}
    </Card>
  );
};

// Unified Page Layout
interface PageLayoutProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  description,
  actions,
  children,
  className,
}) => (
  <div className={cn("container mx-auto p-6", className)}>
    <div className="flex justify-between items-start mb-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-2">{description}</p>
        )}
      </div>
      {actions && <div className="flex space-x-2">{actions}</div>}
    </div>
    {children}
  </div>
);

// Unified Error States
interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Algo deu errado",
  message,
  onRetry,
  className,
}) => (
  <div className={cn("text-center py-12 px-4", className)}>
    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center text-destructive">
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
      {message}
    </p>
    {onRetry && (
      <Button onClick={onRetry} variant="outline" className="mt-6">
        Tentar novamente
      </Button>
    )}
  </div>
);
