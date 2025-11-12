import * as React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { toggleVariants } from '@/components/ui/toggle';

const ToggleGroupContext = React.createContext<any>({
  size: 'default',
  variant: 'default',
});

export const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants>
>(({ className, variant, size, children, type = 'single', ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    type={type as any}
    className={cn('flex items-center justify-center gap-1', className as any)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>{children as React.ReactNode}</ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
));

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

export const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  (React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants> & { value: string })
>((propsWithValue, ref) => {
  const { className, children, variant, size, value, ...props } = propsWithValue as any;
  const context = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      value={String(value)}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className as any,
      )}
      {...props}
    >
      {children as React.ReactNode}
    </ToggleGroupPrimitive.Item>
  );
});

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

// Exports já realizados via 'export const'
