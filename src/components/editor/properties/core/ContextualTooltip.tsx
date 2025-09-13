import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface ContextualTooltipProps {
  content: string;
  children?: React.ReactNode;
  className?: string;
}

export const ContextualTooltip: React.FC<ContextualTooltipProps> = ({
  content,
  children,
  className = ''
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children || (
            <HelpCircle className={`h-4 w-4 text-muted-foreground hover:text-foreground cursor-help ${className}`} />
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};