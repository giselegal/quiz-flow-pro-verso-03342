import React from 'react';
import { cn } from '../../lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#B89B7A] text-white shadow hover:bg-[#aa6b5d] focus-visible:ring-[#B89B7A]/50",
        destructive: "bg-red-500 text-white shadow hover:bg-red-600 focus-visible:ring-red-500/50",
        outline: "border border-[#B89B7A]/30 text-[#432818] hover:bg-[#B89B7A]/10 focus-visible:ring-[#B89B7A]/50",
        secondary: "bg-[#F3E8E6] text-[#432818] shadow-sm hover:bg-[#E8DDD4] focus-visible:ring-[#B89B7A]/50",
        ghost: "text-[#8F7A6A] hover:bg-[#B89B7A]/10 hover:text-[#432818] focus-visible:ring-[#B89B7A]/50",
        link: "text-[#B89B7A] underline-offset-4 hover:underline focus-visible:ring-[#B89B7A]/50",
        premium: "bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white shadow-lg hover:shadow-xl transform hover:scale-105 focus-visible:ring-[#B89B7A]/50"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-lg px-8",
        xl: "h-14 rounded-xl px-10 text-base",
        icon: "h-10 w-10"
      },
      animation: {
        none: "",
        subtle: "hover:scale-105 transition-transform",
        bounce: "hover:scale-110 active:scale-95 transition-transform",
        glow: "hover:shadow-lg hover:shadow-[#B89B7A]/25 transition-shadow"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "subtle"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    animation,
    loading, 
    icon, 
    iconPosition = 'left',
    children, 
    disabled,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <button
        className={cn(buttonVariants({ variant, size, animation, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-current" />
        )}
        {icon && iconPosition === 'left' && !loading && (
          <span className="mr-2">{icon}</span>
        )}
        {children}
        {icon && iconPosition === 'right' && !loading && (
          <span className="ml-2">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
