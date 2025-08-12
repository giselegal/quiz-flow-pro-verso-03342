/**
 * Utility for ongoing project maintenance and cleanup
 */

export const detectAuthConflicts = () => {
  const authKeys = Object.keys(localStorage).filter(
    key => key.startsWith('supabase.auth.') || key.includes('sb-')
  );

  if (authKeys.length > 2) {
    console.warn('🚨 Multiple auth tokens detected:', authKeys);
    return true;
  }
  return false;
};

export const cleanupAuthState = () => {
  try {
    let cleanedCount = 0;
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
        cleanedCount++;
      }
    });

    Object.keys(sessionStorage || {}).forEach(key => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
        cleanedCount++;
      }
    });

    if (cleanedCount > 0) {
      console.log(`✅ Cleaned ${cleanedCount} auth keys`);
    }

    return cleanedCount;
  } catch (error) {
    console.error('❌ Error during auth cleanup:', error);
    return 0;
  }
};

export const validateProjectHealth = () => {
  const checks = {
    authConflicts: detectAuthConflicts(),
    storageHealth: localStorage.length < 50, // Reasonable limit
    memoryUsage: (performance as any).memory
      ? (performance as any).memory.usedJSHeapSize < 50000000
      : true,
  };

  console.log('🔍 Project Health Check:', checks);
  return checks;
};
