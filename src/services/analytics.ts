/**
 * 📊 ANALYTICS SERVICE - PHASE 2
 * 
 * Singleton service for real-time analytics powered by Supabase.
 * Provides real metrics from quiz_sessions, quiz_responses, and quiz_analytics tables.
 * 
 * BENEFITS:
 * ✅ Real data from Supabase (not mocked)
 * ✅ Auto-refresh every 30 seconds
 * ✅ Dashboard visible in editor
 */

import { RealDataAnalyticsService, realDataAnalyticsService } from '@/services/core/RealDataAnalyticsService';
import type { RealMetrics, ParticipantData } from '@/services/core/RealDataAnalyticsService';

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const analyticsService = realDataAnalyticsService;

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Get real-time metrics from Supabase
 */
export async function getRealTimeMetrics(): Promise<RealMetrics> {
  return analyticsService.getRealMetrics();
}

/**
 * Get participants data with pagination
 */
export async function getParticipants(
  limit = 50,
  offset = 0
): Promise<{ participants: ParticipantData[]; total: number }> {
  return analyticsService.getParticipantsData(limit, offset);
}

/**
 * Check if analytics service is healthy
 */
export async function checkAnalyticsHealth(): Promise<boolean> {
  return analyticsService.healthCheck();
}

/**
 * Get business intelligence metrics
 */
export async function getBusinessIntelligence() {
  return analyticsService.getBusinessIntelligence();
}

// ============================================================================
// AUTO-START IN PRODUCTION
// ============================================================================

// Auto-check health on startup
if (typeof window !== 'undefined') {
  analyticsService.healthCheck().then((healthy) => {
    if (healthy) {
      console.log('✅ Analytics service online');
    } else {
      console.warn('⚠️ Analytics service health check failed');
    }
  }).catch(() => {
    console.warn('⚠️ Analytics service not available');
  });
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type { RealMetrics, ParticipantData };

export default analyticsService;
