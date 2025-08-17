/**
 * PERFORMANCE MANAGER
 *
 * Centralized performance monitoring and optimization system.
 * Replaces scattered performance utilities and provides:
 * - Hook usage tracking
 * - Memory leak detection
 * - Render optimization
 * - Automatic cleanup
 */

export interface PerformanceMetrics {
  hookUsage: Map<string, Set<string>>;
  renderCounts: Map<string, number>;
  memorySnapshots: Array<{ timestamp: number; usage: number }>;
  leakedTimeouts: Set<NodeJS.Timeout>;
  lastCleanup: number;
}

export interface OptimizationSuggestion {
  component: string;
  issue: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  suggestion: string;
  impact: string;
}

export class PerformanceManager {
  private static metrics: PerformanceMetrics = {
    hookUsage: new Map(),
    renderCounts: new Map(),
    memorySnapshots: [],
    leakedTimeouts: new Set(),
    lastCleanup: Date.now(),
  };

  private static cleanupInterval: NodeJS.Timeout | null = null;
  private static isMonitoring = false;

  // =============================================================================
  // HOOK TRACKING
  // =============================================================================

  static trackHookUsage(hookName: string, componentId: string): void {
    if (!this.metrics.hookUsage.has(hookName)) {
      this.metrics.hookUsage.set(hookName, new Set());
    }

    this.metrics.hookUsage.get(hookName)!.add(componentId);

    // Track render count
    const renderKey = `${hookName}:${componentId}`;
    const currentCount = this.metrics.renderCounts.get(renderKey) || 0;
    this.metrics.renderCounts.set(renderKey, currentCount + 1);

    // Start monitoring if not already started
    if (!this.isMonitoring) {
      this.startMonitoring();
    }
  }

  static getHookUsageStats(): Record<string, number> {
    const stats: Record<string, number> = {};

    for (const [hookName, components] of this.metrics.hookUsage.entries()) {
      stats[hookName] = components.size;
    }

    return stats;
  }

  static getRenderStats(): Array<{ component: string; renders: number }> {
    const stats = [];

    for (const [key, count] of this.metrics.renderCounts.entries()) {
      stats.push({
        component: key,
        renders: count,
      });
    }

    return stats.sort((a, b) => b.renders - a.renders);
  }

  // =============================================================================
  // RENDER OPTIMIZATION
  // =============================================================================

  static optimizeRenders(component: string): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];
    const renderStats = this.getRenderStats();
    const componentStats = renderStats.filter(s => s.component.includes(component));

    for (const stat of componentStats) {
      if (stat.renders > 100) {
        suggestions.push({
          component: stat.component,
          issue: 'Excessive re-renders',
          severity: stat.renders > 500 ? 'critical' : stat.renders > 200 ? 'high' : 'medium',
          suggestion: 'Consider using React.memo, useMemo, or useCallback to reduce re-renders',
          impact: `Component has rendered ${stat.renders} times`,
        });
      }
    }

    // Check for hook overuse
    const hookStats = this.getHookUsageStats();
    const componentHooks = Object.entries(hookStats).filter(([hook]) =>
      this.metrics.hookUsage.get(hook)?.has(component)
    );

    if (componentHooks.length > 10) {
      suggestions.push({
        component,
        issue: 'Too many hooks',
        severity: componentHooks.length > 20 ? 'high' : 'medium',
        suggestion: 'Consider consolidating related hooks or splitting component',
        impact: `Component uses ${componentHooks.length} different hooks`,
      });
    }

    return suggestions;
  }

  // =============================================================================
  // MEMORY MONITORING
  // =============================================================================

  static takeMemorySnapshot(): void {
    if (typeof window !== 'undefined' && (performance as any).memory) {
      const memoryInfo = (performance as any).memory;

      this.metrics.memorySnapshots.push({
        timestamp: Date.now(),
        usage: memoryInfo.usedJSHeapSize,
      });

      // Keep only last 100 snapshots
      if (this.metrics.memorySnapshots.length > 100) {
        this.metrics.memorySnapshots.shift();
      }
    }
  }

  static getMemoryTrend(): 'increasing' | 'stable' | 'decreasing' | 'unknown' {
    const snapshots = this.metrics.memorySnapshots;

    if (snapshots.length < 10) return 'unknown';

    const recent = snapshots.slice(-10);
    const older = snapshots.slice(-20, -10);

    if (older.length === 0) return 'unknown';

    const recentAvg = recent.reduce((sum, s) => sum + s.usage, 0) / recent.length;
    const olderAvg = older.reduce((sum, s) => sum + s.usage, 0) / older.length;

    const change = (recentAvg - olderAvg) / olderAvg;

    if (change > 0.1) return 'increasing';
    if (change < -0.1) return 'decreasing';
    return 'stable';
  }

  static detectMemoryLeaks(): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];
    const trend = this.getMemoryTrend();

    if (trend === 'increasing') {
      suggestions.push({
        component: 'Application',
        issue: 'Potential memory leak',
        severity: 'high',
        suggestion: 'Check for uncleaned timeouts, intervals, and event listeners',
        impact: 'Memory usage is consistently increasing',
      });
    }

    // Check for leaked timeouts
    if (this.metrics.leakedTimeouts.size > 0) {
      suggestions.push({
        component: 'Application',
        issue: 'Timeout leaks detected',
        severity: 'medium',
        suggestion: 'Ensure all setTimeout/setInterval calls are properly cleared',
        impact: `${this.metrics.leakedTimeouts.size} potential leaked timeouts`,
      });
    }

    return suggestions;
  }

  // =============================================================================
  // TIMEOUT MANAGEMENT
  // =============================================================================

  static safeTimeout(callback: () => void, delay: number): NodeJS.Timeout {
    const timeout = setTimeout(() => {
      this.metrics.leakedTimeouts.delete(timeout);
      callback();
    }, delay);

    this.metrics.leakedTimeouts.add(timeout);
    return timeout;
  }

  static safeClearTimeout(timeout: NodeJS.Timeout): void {
    clearTimeout(timeout);
    this.metrics.leakedTimeouts.delete(timeout);
  }

  static safeInterval(callback: () => void, delay: number): NodeJS.Timeout {
    const interval = setInterval(callback, delay);
    this.metrics.leakedTimeouts.add(interval);
    return interval;
  }

  static safeClearInterval(interval: NodeJS.Timeout): void {
    clearInterval(interval);
    this.metrics.leakedTimeouts.delete(interval);
  }

  // =============================================================================
  // CLEANUP OPERATIONS
  // =============================================================================

  static async cleanupTimers(): Promise<number> {
    let cleaned = 0;

    // Clear all tracked timeouts/intervals
    for (const timeout of this.metrics.leakedTimeouts) {
      try {
        clearTimeout(timeout);
        clearInterval(timeout);
        cleaned++;
      } catch (error) {
        // Timeout might already be cleared
      }
    }

    this.metrics.leakedTimeouts.clear();
    return cleaned;
  }

  static cleanupMetrics(): void {
    // Clear old data
    const cutoff = Date.now() - 24 * 60 * 60 * 1000; // 24 hours ago

    this.metrics.memorySnapshots = this.metrics.memorySnapshots.filter(
      snapshot => snapshot.timestamp > cutoff
    );

    // Reset render counts for components that haven't rendered recently
    const activeComponents = new Set<string>();
    for (const components of this.metrics.hookUsage.values()) {
      for (const component of components) {
        activeComponents.add(component);
      }
    }

    const toDelete = [];
    for (const [key] of this.metrics.renderCounts.entries()) {
      const component = key.split(':')[1];
      if (!activeComponents.has(component)) {
        toDelete.push(key);
      }
    }

    for (const key of toDelete) {
      this.metrics.renderCounts.delete(key);
    }

    this.metrics.lastCleanup = Date.now();
  }

  // =============================================================================
  // MONITORING LIFECYCLE
  // =============================================================================

  static startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;

    // Take memory snapshots every 30 seconds
    this.cleanupInterval = this.safeInterval(() => {
      this.takeMemorySnapshot();

      // Run cleanup every 5 minutes
      if (Date.now() - this.metrics.lastCleanup > 300000) {
        this.cleanupMetrics();
      }
    }, 30000);

    console.log('🚀 Performance monitoring started');
  }

  static stopMonitoring(): void {
    if (!this.isMonitoring) return;

    if (this.cleanupInterval) {
      this.safeClearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }

    this.isMonitoring = false;
    console.log('⏹️ Performance monitoring stopped');
  }

  // =============================================================================
  // REPORTING
  // =============================================================================

  static generateReport(): {
    summary: {
      totalHooks: number;
      activeComponents: number;
      totalRenders: number;
      memoryTrend: string;
      leakedTimeouts: number;
    };
    suggestions: OptimizationSuggestion[];
    details: {
      hookUsage: Record<string, number>;
      topRenders: Array<{ component: string; renders: number }>;
      memorySnapshots: number;
    };
  } {
    const hookStats = this.getHookUsageStats();
    const renderStats = this.getRenderStats();
    const memoryLeaks = this.detectMemoryLeaks();

    // Get suggestions for top rendering components
    const suggestions: OptimizationSuggestion[] = [...memoryLeaks];
    const topComponents = renderStats.slice(0, 5);

    for (const component of topComponents) {
      const componentName = component.component.split(':')[1] || component.component;
      suggestions.push(...this.optimizeRenders(componentName));
    }

    return {
      summary: {
        totalHooks: Object.keys(hookStats).length,
        activeComponents: new Set(renderStats.map(s => s.component.split(':')[1])).size,
        totalRenders: renderStats.reduce((sum, s) => sum + s.renders, 0),
        memoryTrend: this.getMemoryTrend(),
        leakedTimeouts: this.metrics.leakedTimeouts.size,
      },
      suggestions: suggestions.filter(
        (s, i, arr) =>
          arr.findIndex(other => other.component === s.component && other.issue === s.issue) === i
      ),
      details: {
        hookUsage: hookStats,
        topRenders: renderStats.slice(0, 10),
        memorySnapshots: this.metrics.memorySnapshots.length,
      },
    };
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  static reset(): void {
    this.stopMonitoring();
    this.cleanupTimers();

    this.metrics = {
      hookUsage: new Map(),
      renderCounts: new Map(),
      memorySnapshots: [],
      leakedTimeouts: new Set(),
      lastCleanup: Date.now(),
    };
  }

  static getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }
}

// Auto-start monitoring in browser environment
if (typeof window !== 'undefined') {
  // Start monitoring after a delay to avoid impacting initial load
  setTimeout(() => {
    PerformanceManager.startMonitoring();
  }, 5000);
}
