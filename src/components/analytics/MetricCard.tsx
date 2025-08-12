// @ts-nocheck
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import { dynamicIconImport } from '@/utils/dynamicIconImport';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  className?: string;
  trend?: 'up' | 'down' | 'flat';
  change?: string;
  icon?: keyof typeof LucideIcons;
  compact?: boolean;
}

export const MetricCard = ({
  title,
  value,
  description,
  className,
  trend,
  change,
  icon,
  compact = false,
}: MetricCardProps) => {
  // Use the dynamic icon import utility
  const IconComponent = icon ? dynamicIconImport(icon) : null;

  return (
    <Card className={cn('shadow-sm border-border/40', className)}>
      {compact ? (
        <CardContent className="p-4">
          <div className="flex items-center justify-between space-x-4">
            {IconComponent && (
              <div className="rounded-full p-1.5 bg-muted">
                {React.createElement(IconComponent, {
                  className: 'h-5 w-5 text-foreground/80',
                })}
              </div>
            )}
            <div className="space-y-0.5 flex-1">
              <p className="text-xs text-muted-foreground">{title}</p>
              <div className="flex items-baseline justify-between">
                <p className="text-lg font-bold">{value}</p>
                {trend && (
                  <div
                    className={cn(
                      'flex items-center text-xs font-medium',
                      trend === 'up'
                        ? 'text-emerald-500'
                        : trend === 'down'
                          ? 'text-red-500'
                          : 'text-orange-500'
                    )}
                  >
                    {trend === 'up' ? (
                      <LucideIcons.TrendingUp className="mr-1 h-3 w-3" />
                    ) : trend === 'down' ? (
                      <LucideIcons.TrendingDown className="mr-1 h-3 w-3" />
                    ) : (
                      <LucideIcons.Minus className="mr-1 h-3 w-3" />
                    )}
                    {change}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      ) : (
        <>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              {IconComponent && (
                <div className="rounded-full p-1.5 bg-muted">
                  {React.createElement(IconComponent, {
                    className: 'h-4 w-4 text-foreground/80',
                  })}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-2xl font-bold">{value}</p>
                {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
              </div>
              {trend && (
                <div
                  className={cn(
                    'flex items-center text-xs font-medium',
                    trend === 'up'
                      ? 'text-emerald-500'
                      : trend === 'down'
                        ? 'text-red-500'
                        : 'text-orange-500'
                  )}
                >
                  {trend === 'up' ? (
                    <LucideIcons.TrendingUp className="mr-1 h-3 w-3" />
                  ) : trend === 'down' ? (
                    <LucideIcons.TrendingDown className="mr-1 h-3 w-3" />
                  ) : (
                    <LucideIcons.Minus className="mr-1 h-3 w-3" />
                  )}
                  {change}
                </div>
              )}
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
};

interface MetricsGridProps {
  children: React.ReactNode;
  columns?: number;
  className?: string;
}

// Export the interface for reuse in other components
export interface MetricsGridComposition {
  Item: typeof MetricCard;
}

export const MetricsGrid: React.FC<MetricsGridProps> & MetricsGridComposition = ({
  children,
  columns = 3,
  className,
}) => {
  return (
    <div
      className={cn(
        'grid gap-4',
        {
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-3': columns === 3,
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-4': columns === 4,
          'grid-cols-1 md:grid-cols-3 lg:grid-cols-5': columns === 5,
        },
        className
      )}
    >
      {children}
    </div>
  );
};

// Attach the MetricCard component to MetricsGrid for composition
MetricsGrid.Item = MetricCard;
