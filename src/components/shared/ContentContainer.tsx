import { cn } from '@/lib/utils';

interface ContentContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const ContentContainer: React.FC<ContentContainerProps> = ({
  children,
  className,
  size = 'md',
}) => {
  const maxWidthClass = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  }[size];

  return (
    <div className={cn('mx-auto px-4 sm:px-6 w-full', maxWidthClass, className)}>{children}</div>
  );
};
