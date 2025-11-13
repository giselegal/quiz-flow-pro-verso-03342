import React, { Suspense, lazy, ComponentType } from 'react';
import { DefaultFallback, LazyErrorBoundary, LazyComponentWrapperProps } from './LazyComponentWrapper';

export const createLazyComponent = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyComponentWrapperProps = {},
) => {
  const LazyComponent = lazy(importFn);

  const LazyWrapper = (props: React.ComponentProps<T>) => (
    <LazyErrorBoundary fallback={options.error}>
      <Suspense fallback={options.fallback || <DefaultFallback />}> 
        <LazyComponent {...props} />
      </Suspense>
    </LazyErrorBoundary>
  );

  return LazyWrapper;
};
