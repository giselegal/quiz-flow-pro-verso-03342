import React, { memo, useMemo, useCallback, ReactNode } from 'react';

export const withOptimization = <P extends object>(
  Component: React.ComponentType<P>
) => memo(Component);

export const useDeepMemo = <T>(factory: () => T, deps: React.DependencyList): T => {
  return useMemo(factory, deps);
};

export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T => {
  return useCallback(callback, deps);
};

interface VirtualListProps {
  items: unknown[];
  renderItem: (item: unknown, index: number) => ReactNode;
  itemHeight: number;
  containerHeight: number;
  className?: string;
}

export const VirtualList = memo<VirtualListProps>(({
  items,
  renderItem,
  itemHeight,
  containerHeight,
  className = ''
}) => {
  const [scrollTop, setScrollTop] = React.useState(0);
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(visibleStart + Math.ceil(containerHeight / itemHeight) + 1, items.length);
  const visibleItems = useMemo(() => items.slice(visibleStart, visibleEnd), [items, visibleStart, visibleEnd]);

  return (
    <div className={`overflow-auto ${className}`} style={{ height: containerHeight }}>
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${visibleStart * itemHeight}px)` }}>
          {visibleItems.map((item, index) => renderItem(item, visibleStart + index))}
        </div>
      </div>
    </div>
  );
});

VirtualList.displayName = 'VirtualList';