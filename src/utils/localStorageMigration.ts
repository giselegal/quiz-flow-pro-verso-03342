/**
 * LocalStorage Migration Utility
 * 
 * Helps migrate from localStorage to Supabase for critical data,
 * while keeping localStorage for temporary/cache data only.
 */

export class LocalStorageMigration {
  // Critical keys that should be migrated to Supabase
  private static readonly CRITICAL_KEYS = [
    'userName',
    'userEmail', 
    'quiz_start_time',
    'quiz_start_tracked',
    'current_quiz_session',
    'completed_quiz_sessions',
    'quiz_utm_parameters',
  ];

  // Temporary keys that can stay in localStorage
  private static readonly TEMPORARY_KEYS = [
    'recent_clicks',
    'ga_id',
    'fb_pixel_event_log',
    'abtest_alert_config',
    'editor_preferences',
    'theme_preferences',
  ];

  /**
   * Get critical data from localStorage for migration
   */
  static getCriticalData(): Record<string, any> {
    const data: Record<string, any> = {};
    
    this.CRITICAL_KEYS.forEach(key => {
      const value = localStorage.getItem(key);
      if (value !== null) {
        try {
          data[key] = JSON.parse(value);
        } catch {
          data[key] = value; // Store as string if not JSON
        }
      }
    });
    
    return data;
  }

  /**
   * Clean up critical data from localStorage after migration
   */
  static cleanupCriticalData(): void {
    this.CRITICAL_KEYS.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('Critical localStorage data cleaned up');
  }

  /**
   * Safe localStorage setter with size limit
   */
  static setTempData(key: string, value: any, maxSize: number = 1024 * 1024): boolean {
    if (!this.TEMPORARY_KEYS.includes(key)) {
      console.warn(`Key "${key}" not in allowed temporary keys list`);
      return false;
    }

    try {
      const serialized = JSON.stringify(value);
      
      // Check size limit (1MB default)
      if (serialized.length > maxSize) {
        console.warn(`Data too large for localStorage key "${key}": ${serialized.length} bytes`);
        return false;
      }
      
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
      return false;
    }
  }

  /**
   * Safe localStorage getter
   */
  static getTempData<T>(key: string, defaultValue?: T): T | null {
    if (!this.TEMPORARY_KEYS.includes(key)) {
      console.warn(`Key "${key}" not in allowed temporary keys list`);
      return defaultValue || null;
    }

    try {
      const value = localStorage.getItem(key);
      if (value === null) return defaultValue || null;
      
      return JSON.parse(value);
    } catch (error) {
      console.error(`Error parsing localStorage key "${key}":`, error);
      return defaultValue || null;
    }
  }

  /**
   * Clean up old/expired temporary data
   */
  static cleanupTempData(): void {
    // Remove any localStorage keys not in our allowed list
    const allKeys = Object.keys(localStorage);
    const allowedKeys = [...this.CRITICAL_KEYS, ...this.TEMPORARY_KEYS];
    
    allKeys.forEach(key => {
      if (!allowedKeys.includes(key)) {
        console.log(`Removing unknown localStorage key: ${key}`);
        localStorage.removeItem(key);
      }
    });
  }

  /**
   * Get current localStorage usage stats
   */
  static getUsageStats(): { totalSize: number; keyCount: number; largestKey: string } {
    let totalSize = 0;
    let keyCount = 0;
    let largestKey = '';
    let largestSize = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          const size = value.length;
          totalSize += size;
          keyCount++;
          
          if (size > largestSize) {
            largestSize = size;
            largestKey = key;
          }
        }
      }
    }

    return {
      totalSize,
      keyCount,
      largestKey,
    };
  }

  /**
   * Check if localStorage is near its limit
   */
  static isNearLimit(): boolean {
    const stats = this.getUsageStats();
    // Most browsers have 5-10MB limit, warn at 4MB
    return stats.totalSize > 4 * 1024 * 1024;
  }
}