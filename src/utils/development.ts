// Console warnings cleanup and development utilities
export const cleanupConsoleWarnings = () => {
  // Suppress known non-critical warnings in development
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // Store original console methods
    const originalWarn = console.warn;
    const originalError = console.error;
    const originalLog = console.log;

    // Override console.warn to filter out known harmless warnings
    console.warn = (...args) => {
      const message = args.join(' ');
      
      // Filter out known non-critical warnings
      const ignoredWarnings = [
        'Unrecognized feature:',
        'was preloaded using link preload but not used',
        'iframe which has both allow-scripts and allow-same-origin',
        '[Violation] \'setTimeout\' handler took',
        '[Violation] \'requestAnimationFrame\' callback took',
        'Strategy 4: No clear indicators found',
        'Max reconnect attempts',
        'The resource https://www.facebook.com',
      ];

      const shouldIgnore = ignoredWarnings.some(warning => 
        message.includes(warning)
      );

      if (!shouldIgnore) {
        originalWarn.apply(console, args);
      }
    };

    // Override console.log to filter out specific logs
    console.log = (...args) => {
      const message = args.join(' ');
      
      // Filter out specific log patterns that are noise
      const ignoredLogs = [
        'Strategy 4: No clear indicators found',
        'assuming All tab',
      ];

      const shouldIgnore = ignoredLogs.some(log => 
        message.includes(log)
      );

      if (!shouldIgnore) {
        originalLog.apply(console, args);
      }
    };

    // Override console.error to highlight our app errors
    console.error = (...args) => {
      const message = args.join(' ');
      
      // Highlight drag and drop related errors
      if (message.includes('DragStart') || message.includes('DndProvider')) {
        console.log('🚨 DRAG & DROP ERROR:');
        originalError.apply(console, args);
        console.log('📍 Check the drag and drop implementation');
      } else {
        originalError.apply(console, args);
      }
    };

    console.log('🧹 Console warnings cleanup active');
  }
};

// Enhanced drag and drop debugging
export const dragDropDebugger = {
  logDragStart: (data: any) => {
    console.group('🟢 Drag Start Event');
    console.log('Active ID:', data.id);
    console.log('Active Type:', data.type);
    console.log('Block Type:', data.blockType);
    console.log('Full Data:', data);
    console.groupEnd();
  },

  logDragEnd: (data: any) => {
    console.group('🔄 Drag End Event');
    console.log('Active ID:', data.activeId);
    console.log('Over ID:', data.overId);
    console.log('Active Type:', data.activeType);
    console.log('Over Type:', data.overType);
    console.log('Success:', data.success);
    console.groupEnd();
  },

  logError: (error: string, context?: any) => {
    console.group('❌ Drag & Drop Error');
    console.error(error);
    if (context) {
      console.log('Context:', context);
    }
    console.groupEnd();
  },

  logSuccess: (action: string, details?: any) => {
    console.group('✅ Drag & Drop Success');
    console.log('Action:', action);
    if (details) {
      console.log('Details:', details);
    }
    console.groupEnd();
  }
};

// WebSocket reconnection manager
export const websocketManager = {
  maxRetries: 5,
  retryCount: 0,
  retryDelay: 1000,

  connect: (url: string, onMessage?: (data: any) => void) => {
    if (typeof window === 'undefined') return;

    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('🔌 WebSocket connected');
      websocketManager.retryCount = 0;
    };

    ws.onmessage = (event) => {
      if (onMessage) {
        onMessage(JSON.parse(event.data));
      }
    };

    ws.onclose = () => {
      if (websocketManager.retryCount < websocketManager.maxRetries) {
        websocketManager.retryCount++;
        console.log(`🔄 WebSocket reconnecting... (${websocketManager.retryCount}/${websocketManager.maxRetries})`);
        
        setTimeout(() => {
          websocketManager.connect(url, onMessage);
        }, websocketManager.retryDelay * websocketManager.retryCount);
      } else {
        console.log('❌ WebSocket max retries exceeded');
      }
    };

    ws.onerror = (error) => {
      console.log('⚠️ WebSocket error:', error);
    };

    return ws;
  }
};

// Performance monitoring for drag and drop
export const performanceMonitor = {
  startTiming: (label: string) => {
    if (typeof performance !== 'undefined') {
      performance.mark(`${label}-start`);
    }
  },

  endTiming: (label: string) => {
    if (typeof performance !== 'undefined') {
      performance.mark(`${label}-end`);
      performance.measure(label, `${label}-start`, `${label}-end`);
      
      const measure = performance.getEntriesByName(label)[0];
      if (measure.duration > 16) { // More than 1 frame (60fps)
        console.warn(`⚡ Performance: ${label} took ${measure.duration.toFixed(2)}ms`);
      }
    }
  }
};

// Initialize cleanup on app start
if (typeof window !== 'undefined') {
  cleanupConsoleWarnings();
}
