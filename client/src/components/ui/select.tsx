
import React, { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, onValueChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onValueChange) {
        onValueChange(e.target.value);
      }
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <select
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

Select.displayName = "Select";

export { Select };

// Additional helper components for better API
export const SelectTrigger = Select;
export const SelectContent = ({ children, ...props }: { children: React.ReactNode }) => (
  <>{children}</>
);
export const SelectItem = ({ value, children, ...props }: { value: string; children: React.ReactNode }) => (
  <option value={value} {...props}>{children}</option>
);
export const SelectValue = ({ placeholder }: { placeholder?: string }) => null;
