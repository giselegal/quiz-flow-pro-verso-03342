/**
 * 📊 AUTO METRICS HOOK
 * 
 * Hook para tracking automático de re-renders e props changes
 * Integrado com editorMetrics
 */

import { useEffect, useRef } from 'react';
import { editorMetrics } from '@/utils/editorMetrics';
import { shallowEqual } from '@/utils/performanceOptimizations';

interface UseAutoMetricsOptions {
  enabled?: boolean;
  trackProps?: boolean;
  logThreshold?: number; // Log apenas se re-renders > threshold
}

/**
 * Hook para tracking automático de re-renders
 * 
 * @example
 * ```tsx
 * function MyComponent({ data, isSelected }) {
 *   useAutoMetrics('MyComponent', { data, isSelected });
 *   
 *   return <div>...</div>;
 * }
 * ```
 */
export function useAutoMetrics(
  componentName: string,
  props?: Record<string, any>,
  options: UseAutoMetricsOptions = {}
) {
  const {
    enabled = import.meta.env.DEV,
    trackProps = true,
    logThreshold = 10,
  } = options;

  const renderCountRef = useRef(0);
  const prevPropsRef = useRef(props);
  const mountTimeRef = useRef(performance.now());

  if (!enabled) {
    return;
  }

  // Incrementar contador de renders
  renderCountRef.current += 1;

  useEffect(() => {
    const renderCount = renderCountRef.current;
    const renderDuration = performance.now() - mountTimeRef.current;

    // Track render no editorMetrics
    editorMetrics.trackRender(componentName, renderDuration, {
      renderCount,
      isMount: renderCount === 1,
    });

    // Log se exceder threshold
    if (renderCount > logThreshold && renderCount % 5 === 0) {
      console.warn(
        `⚠️ [useAutoMetrics] High re-render count for "${componentName}": ${renderCount}`,
        { renderDuration: `${renderDuration.toFixed(2)}ms` }
      );
    }

    // Track props changes se habilitado
    if (trackProps && props && prevPropsRef.current) {
      const propsChanged = !shallowEqual(props, prevPropsRef.current);
      
      if (propsChanged && renderCount > 1) {
        const changedKeys = Object.keys(props).filter(
          key => props[key] !== prevPropsRef.current![key]
        );

        if (import.meta.env.DEV && changedKeys.length > 0) {
          console.debug(
            `🔄 [useAutoMetrics] "${componentName}" re-rendered due to props:`,
            changedKeys
          );
        }

        editorMetrics.trackPropsChange(componentName, changedKeys);
      }
    }

    prevPropsRef.current = props;
    mountTimeRef.current = performance.now();
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const totalRenders = renderCountRef.current;
      const totalDuration = performance.now() - mountTimeRef.current;

      editorMetrics.trackComponentUnmount(componentName, {
        totalRenders,
        totalDuration,
        avgRenderTime: totalDuration / totalRenders,
      });

      if (import.meta.env.DEV && totalRenders > logThreshold) {
        console.info(
          `📊 [useAutoMetrics] "${componentName}" unmounted after ${totalRenders} renders`
        );
      }
    };
  }, []);
}

/**
 * Hook simplificado apenas para re-render tracking
 */
export function useRenderCount(componentName: string) {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  useEffect(() => {
    if (import.meta.env.DEV && renderCountRef.current % 10 === 0) {
      console.debug(`🔄 [RenderCount] "${componentName}": ${renderCountRef.current}`);
    }
  });

  return renderCountRef.current;
}

export default useAutoMetrics;
