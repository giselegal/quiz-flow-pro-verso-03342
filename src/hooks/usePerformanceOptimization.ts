/**
 * Performance Optimization Hook - ENHANCED
 * 
 * Addresses critical performance issues:
 * - 49 setTimeout violations
 * - 0 FPS framerate  
 * - 82% memory usage
 * - High timeout consumption
 * 
 * Solutions:
 * - Aggressive debouncing
 * - Timeout cleanup
 * - Memory leak prevention
 * - Render optimization
 */

import { useCallback, useEffect, useRef, useState } from 'react';

interface PerformanceState {
  fps: number;
  memoryUsage: number;
  timeoutCount: number;
  renderCount: number;
}

interface PerformanceHookReturn {
  performanceState: PerformanceState;
  debouncedCallback: (callback: () => void, delay?: number) => void;
  throttledCallback: (callback: () => void, delay?: number) => void;
  cleanupTimeouts: () => void;
  optimizeRenders: (dependencies: any[]) => boolean;
  measurePerformance: () => void;
}

export const usePerformanceOptimization = (): PerformanceHookReturn => {
  const [performanceState, setPerformanceState] = useState<PerformanceState>({
    fps: 0,
    memoryUsage: 0,
    timeoutCount: 0,
    renderCount: 0,
  });

  // Track active timeouts for cleanup
  const activeTimeouts = useRef<Set<NodeJS.Timeout>>(new Set());
  const activeIntervals = useRef<Set<NodeJS.Timer>>(new Set());
  const debounceTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const throttleTimers = useRef<Map<string, boolean>>(new Map());
  
  // Performance monitoring
  const fpsCounter = useRef<{ frames: number; startTime: number }>({
    frames: 0,
    startTime: performance.now()
  });

  // Render optimization tracking
  const lastDependencies = useRef<any[]>([]);
  const renderCountRef = useRef(0);

  // Aggressive debouncing with cleanup
  const debouncedCallback = useCallback((callback: () => void, delay: number = 300) => {
    const callbackKey = callback.toString().substring(0, 100); // Limit key size
    
    // Clear existing timer
    const existingTimer = debounceTimers.current.get(callbackKey);
    if (existingTimer) {
      clearTimeout(existingTimer);
      activeTimeouts.current.delete(existingTimer);
    }
    
    // Create new timer with cleanup tracking
    const timer = setTimeout(() => {
      try {
        callback();
      } catch (error) {
        console.error('Debounced callback error:', error);
      } finally {
        // Clean up
        activeTimeouts.current.delete(timer);
        debounceTimers.current.delete(callbackKey);
      }
    }, delay);
    
    // Track timer
    activeTimeouts.current.add(timer);
    debounceTimers.current.set(callbackKey, timer);
  }, []);

  // Throttling with memory optimization
  const throttledCallback = useCallback((callback: () => void, delay: number = 200) => {
    const callbackKey = callback.toString().substring(0, 100);
    
    if (throttleTimers.current.get(callbackKey)) {
      return; // Still in throttle period
    }
    
    // Execute immediately
    try {
      callback();
    } catch (error) {
      console.error('Throttled callback error:', error);
    }
    
    // Set throttle
    throttleTimers.current.set(callbackKey, true);
    
    const timer = setTimeout(() => {
      throttleTimers.current.delete(callbackKey);
      activeTimeouts.current.delete(timer);
    }, delay);
    
    activeTimeouts.current.add(timer);
  }, []);

  // Clean up all active timeouts and intervals
  const cleanupTimeouts = useCallback(() => {
    // Clear all debounce timers
    debounceTimers.current.forEach((timer) => {
      clearTimeout(timer);
    });
    debounceTimers.current.clear();
    
    // Clear all tracked timeouts
    activeTimeouts.current.forEach((timer) => {
      clearTimeout(timer);
    });
    activeTimeouts.current.clear();
    
    // Clear all intervals
    activeIntervals.current.forEach((interval) => {
      clearInterval(interval);
    });
    activeIntervals.current.clear();
    
    // Clear throttle flags
    throttleTimers.current.clear();
    
    console.log('All timers and intervals cleaned up');
  }, []);

  // Render optimization - only re-render if dependencies actually changed
  const optimizeRenders = useCallback((dependencies: any[]): boolean => {
    renderCountRef.current++;
    
    // Shallow comparison of dependencies
    const hasChanged = dependencies.length !== lastDependencies.current.length ||
      dependencies.some((dep, index) => dep !== lastDependencies.current[index]);
    
    if (hasChanged) {
      lastDependencies.current = [...dependencies];
    }
    
    // Update render count in state (throttled)
    if (renderCountRef.current % 10 === 0) {
      setPerformanceState(prev => ({
        ...prev,
        renderCount: renderCountRef.current,
        timeoutCount: activeTimeouts.current.size,
      }));
    }
    
    return hasChanged;
  }, []);

  // Performance measurement
  const measurePerformance = useCallback(() => {
    // FPS calculation
    fpsCounter.current.frames++;
    const currentTime = performance.now();
    const elapsed = currentTime - fpsCounter.current.startTime;
    
    if (elapsed >= 1000) {
      const fps = Math.round((fpsCounter.current.frames * 1000) / elapsed);
      
      // Memory usage (if available)
      let memoryUsage = 0;
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        memoryUsage = Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100);
      }
      
      setPerformanceState({
        fps,
        memoryUsage,
        timeoutCount: activeTimeouts.current.size,
        renderCount: renderCountRef.current,
      });
      
      // Reset counters
      fpsCounter.current = {
        frames: 0,
        startTime: currentTime
      };
      
      // Log performance warnings
      if (fps < 30) {
        console.warn(`Low FPS detected: ${fps}fps`);
      }
      if (memoryUsage > 80) {
        console.warn(`High memory usage: ${memoryUsage}%`);
      }
      if (activeTimeouts.current.size > 20) {
        console.warn(`High timeout count: ${activeTimeouts.current.size}`);
      }
    }
  }, []);

  // Setup performance monitoring
  useEffect(() => {
    let animationId: number;
    
    const performanceLoop = () => {
      measurePerformance();
      animationId = requestAnimationFrame(performanceLoop);
    };
    
    // Start with a delay to avoid immediate measurement
    const timer = setTimeout(() => {
      animationId = requestAnimationFrame(performanceLoop);
    }, 1000);
    
    activeTimeouts.current.add(timer as any);
    
    return () => {
      clearTimeout(timer);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [measurePerformance]);

  // Global cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupTimeouts();
    };
  }, [cleanupTimeouts]);

  // Memory leak prevention - periodic cleanup
  useEffect(() => {
    const cleanup = setInterval(() => {
      // Force cleanup of old debounce timers if we have too many
      if (debounceTimers.current.size > 50) {
        console.warn('Too many debounce timers, forcing cleanup');
        const oldestKeys = Array.from(debounceTimers.current.keys()).slice(0, 25);
        oldestKeys.forEach(key => {
          const timer = debounceTimers.current.get(key);
          if (timer) {
            clearTimeout(timer);
            activeTimeouts.current.delete(timer);
            debounceTimers.current.delete(key);
          }
        });
      }
      
      // Garbage collection hint (if available)
      if (typeof window !== 'undefined' && 'gc' in window) {
        (window as any).gc();
      }
    }, 30000); // Every 30 seconds
    
    activeIntervals.current.add(cleanup);
    
    return () => {
      clearInterval(cleanup);
      activeIntervals.current.delete(cleanup);
    };
  }, []);

  return {
    performanceState,
    debouncedCallback,
    throttledCallback,
    cleanupTimeouts,
    optimizeRenders,
    measurePerformance,
  };
};
export default usePerformanceOptimization;
