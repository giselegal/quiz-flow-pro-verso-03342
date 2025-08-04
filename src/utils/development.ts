// Console warnings cleanup and development utilities
export const cleanupConsoleWarnings = () => {
  // Suppress known non-critical warnings in development
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    // Store original console methods
    const originalWarn = console.warn;
    const originalError = console.error;
    const originalLog = console.log;

    // Override console.warn to filter out known harmless warnings
    console.warn = (...args) => {
      const message = args.join(" ");

      // Filter out known non-critical warnings
      const ignoredWarnings = [
        "Unrecognized feature:",
        "was preloaded using link preload but not used",
        "iframe which has both allow-scripts and allow-same-origin",
        "[Violation] 'setTimeout' handler took",
        "[Violation] 'requestAnimationFrame' callback took",
        "Strategy 4: No clear indicators found",
        "Max reconnect attempts",
        "The resource https://www.facebook.com",
        // LinkedIn tracking
        "px.ads.linkedin.com/collect",
        "Failed to load resource: net::ERR_CONNECTION_CLOSED",
        // Lovable platform specific
        "lovableproject.com",
        "Failed to load resource: the server responded with a status of 412",
        // WebSocket connection issues (external services)
        "WebSocket connection to 'wss://",
        "failed:",
        "createOrJoinSocket",
        // Service Worker cache issues
        "Failed to execute 'addAll' on 'Cache'",
        "Request failed",
        "service-worker.js",
      ];

      const shouldIgnore = ignoredWarnings.some(warning => message.includes(warning));

      if (!shouldIgnore) {
        originalWarn.apply(console, args);
      }
    };

    // Override console.log to filter out specific logs
    console.log = (...args) => {
      const message = args.join(" ");

      // Filter out specific log patterns that are noise
      const ignoredLogs = ["Strategy 4: No clear indicators found", "assuming All tab"];

      const shouldIgnore = ignoredLogs.some(log => message.includes(log));

      if (!shouldIgnore) {
        originalLog.apply(console, args);
      }
    };

    // Override console.error to highlight our app errors
    console.error = (...args) => {
      const message = args.join(" ");

      // Filter out known non-critical errors from external services
      const ignoredErrors = [
        "Cannot access 'E' before initialization",
        "forms-B8WT14Rn.js",
        "forms-Ba1JuZFL.js",
        "px.ads.linkedin.com",
        "lovableproject.com",
        "WebSocket connection to 'wss://",
        "Failed to execute 'addAll' on 'Cache'",
        "service-worker.js",
        "net::ERR_CONNECTION_CLOSED",
      ];

      const shouldIgnore = ignoredErrors.some(error => message.includes(error));

      if (shouldIgnore) {
        // Silently ignore these external errors
        return;
      }

      // Highlight drag and drop related errors
      if (message.includes("DragStart") || message.includes("DndProvider")) {
        console.log("🚨 DRAG & DROP ERROR:");
        originalError.apply(console, args);
        console.log("📍 Check the drag and drop implementation");
      } else {
        originalError.apply(console, args);
      }
    };

    console.log("🧹 Console warnings cleanup active");
  }
};

// Enhanced drag and drop debugging
export const dragDropDebugger = {
  logDragStart: (data: any) => {
    console.group("🟢 Drag Start Event");
    console.log("Active ID:", data.id);
    console.log("Active Type:", data.type);
    console.log("Block Type:", data.blockType);
    console.log("Full Data:", data);
    console.groupEnd();
  },

  logDragEnd: (data: any) => {
    console.group("🔄 Drag End Event");
    console.log("Active ID:", data.activeId);
    console.log("Over ID:", data.overId);
    console.log("Active Type:", data.activeType);
    console.log("Over Type:", data.overType);
    console.log("Success:", data.success);
    console.groupEnd();
  },

  logError: (error: string, context?: any) => {
    console.group("❌ Drag & Drop Error");
    console.error(error);
    if (context) {
      console.log("Context:", context);
    }
    console.groupEnd();
  },

  logSuccess: (action: string, details?: any) => {
    console.group("✅ Drag & Drop Success");
    console.log("Action:", action);
    if (details) {
      console.log("Details:", details);
    }
    console.groupEnd();
  },
};

// WebSocket reconnection manager
export const websocketManager = {
  maxRetries: 5,
  retryCount: 0,
  retryDelay: 1000,

  connect: (url: string, onMessage?: (data: any) => void) => {
    if (typeof window === "undefined") return;

    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("🔌 WebSocket connected");
      websocketManager.retryCount = 0;
    };

    ws.onmessage = event => {
      if (onMessage) {
        onMessage(JSON.parse(event.data));
      }
    };

    ws.onclose = () => {
      if (websocketManager.retryCount < websocketManager.maxRetries) {
        websocketManager.retryCount++;
        console.log(
          `🔄 WebSocket reconnecting... (${websocketManager.retryCount}/${websocketManager.maxRetries})`
        );

        setTimeout(() => {
          websocketManager.connect(url, onMessage);
        }, websocketManager.retryDelay * websocketManager.retryCount);
      } else {
        console.log("❌ WebSocket max retries exceeded");
      }
    };

    ws.onerror = error => {
      console.log("⚠️ WebSocket error:", error);
    };

    return ws;
  },
};

// Performance monitoring for drag and drop
export const performanceMonitor = {
  startTiming: (label: string) => {
    if (typeof performance !== "undefined") {
      performance.mark(`${label}-start`);
    }
  },

  endTiming: (label: string) => {
    if (typeof performance !== "undefined") {
      performance.mark(`${label}-end`);
      performance.measure(label, `${label}-start`, `${label}-end`);

      const measure = performance.getEntriesByName(label)[0];
      if (measure.duration > 16) {
        // More than 1 frame (60fps)
        console.warn(`⚡ Performance: ${label} took ${measure.duration.toFixed(2)}ms`);
      }
    }
  },
};

// Optimized timeout and animation frame utilities
export const optimizedUtils = {
  // Throttled setTimeout that won't cause violations
  throttledTimeout: (callback: () => void, delay: number) => {
    const start = performance.now();

    const optimizedCallback = () => {
      const elapsed = performance.now() - start;
      if (elapsed > 50) {
        // If it's taking too long, defer to next frame
        requestAnimationFrame(callback);
      } else {
        callback();
      }
    };

    return setTimeout(optimizedCallback, Math.max(delay, 16)); // Minimum 16ms for 60fps
  },

  // Debounced function to prevent excessive calls
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // RAF-based smooth animation
  smoothAnimation: (
    duration: number,
    callback: (progress: number) => void,
    onComplete?: () => void
  ) => {
    const start = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);

      callback(progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else if (onComplete) {
        onComplete();
      }
    };

    requestAnimationFrame(animate);
  },

  // Batch DOM operations to prevent layout thrashing
  batchDOMOperations: (operations: (() => void)[]) => {
    requestAnimationFrame(() => {
      operations.forEach(op => op());
  },
};

// Initialize cleanup on app start
if (typeof window !== "undefined") {
  cleanupConsoleWarnings();

  // Optimize global setTimeout and setInterval to prevent violations
  const originalSetTimeout = window.setTimeout;
  const originalSetInterval = window.setInterval;

  window.setTimeout = ((callback: any, delay?: number, ...args: any[]) => {
    // Ensure minimum delay to prevent violations
    const optimizedDelay = Math.max(delay || 0, 4); // Minimum 4ms per HTML spec

    // Wrap callback to measure execution time
    const wrappedCallback = () => {
      const start = performance.now();
      callback();
      const duration = performance.now() - start;

      // Only warn for our code, not third-party
      if (duration > 50 && callback.toString().includes("src/")) {
        console.warn(`⚡ Slow timeout detected: ${duration.toFixed(2)}ms`);
      }
    };

    return originalSetTimeout(wrappedCallback, optimizedDelay, ...args);
  }) as typeof setTimeout;

  window.setInterval = ((callback: any, delay?: number, ...args: any[]) => {
    const optimizedDelay = Math.max(delay || 0, 16); // Minimum 16ms for intervals
    return originalSetInterval(callback, optimizedDelay, ...args);
  }) as typeof setInterval;

  console.log("⚡ Performance optimizations active");
}
