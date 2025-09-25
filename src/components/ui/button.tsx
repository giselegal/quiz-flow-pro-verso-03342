import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary',
        // ✨ CYBERPUNK VARIANTS
        cyberpunk: 'bg-gradient-to-r from-brand-brightPink to-brand-brightBlue text-white hover:shadow-lg hover:shadow-brand-brightPink/25 transform-gpu transition-all',
        neon: 'bg-gradient-to-r from-brand-mediumBlue to-brand-brightBlue text-white hover:shadow-lg hover:shadow-brand-mediumBlue/25 transform-gpu transition-all',
        darkPunk: 'bg-brand-darkBlue text-white hover:bg-brand-mediumBlue hover:shadow-md transition-all',
        outlineNeon: 'border-2 border-brand-brightPink text-brand-brightPink hover:bg-brand-brightPink/10 hover:shadow-md hover:shadow-brand-brightPink/20 transition-all',
        outlineBlue: 'border-2 border-brand-brightBlue text-brand-brightBlue hover:bg-brand-brightBlue/10 hover:shadow-md hover:shadow-brand-brightBlue/20 transition-all',
        glassNeon: 'bg-white/10 backdrop-blur-sm border border-brand-brightPink/30 text-brand-brightPink hover:bg-brand-brightPink/20 hover:border-brand-brightPink/50 transition-all',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-10 w-10',
        xl: 'h-14 px-10 rounded-lg text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
