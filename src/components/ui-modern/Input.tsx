import React from 'react';
import { cn } from '../../lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const inputVariants = cva(
  "flex w-full rounded-lg border bg-white/95 backdrop-blur-sm px-3 py-2 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#8F7A6A]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-[#B89B7A]/30 text-[#432818] focus-visible:ring-[#B89B7A]/50",
        error: "border-red-500/50 text-red-900 focus-visible:ring-red-500/50",
        success: "border-green-500/50 text-green-900 focus-visible:ring-green-500/50",
        ghost: "border-transparent bg-[#B89B7A]/5 focus-visible:ring-[#B89B7A]/50"
      },
      size: {
        default: "h-10",
        sm: "h-8 text-xs",
        lg: "h-12 text-base",
        xl: "h-14 text-lg"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  label?: string;
  error?: string;
  success?: string;
  helper?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type,
    variant, 
    size,
    icon, 
    iconPosition = 'left',
    label,
    error,
    success,
    helper,
    ...props 
  }, ref) => {
    const actualVariant = error ? 'error' : success ? 'success' : variant;
    
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-sm font-medium text-[#432818] block">
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8F7A6A]">
              {icon}
            </div>
          )}
          
          <input
            type={type}
            className={cn(
              inputVariants({ variant: actualVariant, size, className }),
              icon && iconPosition === 'left' && "pl-10",
              icon && iconPosition === 'right' && "pr-10"
            )}
            ref={ref}
            {...props}
          />
          
          {icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8F7A6A]">
              {icon}
            </div>
          )}
        </div>
        
        {(error || success || helper) && (
          <div className="text-xs">
            {error && (
              <p className="text-red-600 font-medium">{error}</p>
            )}
            {success && (
              <p className="text-green-600 font-medium">{success}</p>
            )}
            {helper && !error && !success && (
              <p className="text-[#8F7A6A]">{helper}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };
