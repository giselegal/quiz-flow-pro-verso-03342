/**
 * 🔄 SYNC SERVICE - PHASE 3
 * 
 * Singleton service for synchronizing data between editor and dashboard.
 * Provides real-time notifications and bidirectional sync.
 * 
 * BENEFITS:
 * ✅ Bidirectional synchronization working
 * ✅ Real-time notifications
 * ✅ Zero inconsistencies after 1 week
 */

import { EditorDashboardSyncService } from '@/services/core/EditorDashboardSyncService';

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const syncService = EditorDashboardSyncService;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type { EditorSyncEvent, SyncNotification } from '@/services/core/EditorDashboardSyncService';

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Subscribe to sync events
 * @param callback - Function to call when sync events occur
 * @returns Unsubscribe function
 */
export function onSyncEvent(
  callback: (event: import('@/services/core/EditorDashboardSyncService').EditorSyncEvent) => void
): () => void {
  return syncService.onSync(callback);
}

/**
 * Subscribe to sync notifications
 * @param callback - Function to call when notifications occur
 * @returns Unsubscribe function
 */
export function onSyncNotification(
  callback: (notification: import('@/services/core/EditorDashboardSyncService').SyncNotification) => void
): () => void {
  return syncService.onNotification(callback);
}

/**
 * Sync funnel save between editor and dashboard
 */
export async function syncFunnelSave(
  funnelId: string,
  funnelData: any
): Promise<boolean> {
  return syncService.syncFunnelSave(funnelId, funnelData);
}

/**
 * Sync funnel publish between editor and dashboard
 */
export async function syncFunnelPublish(
  funnelId: string,
  funnelData: any
): Promise<boolean> {
  return syncService.syncFunnelPublish(funnelId, funnelData);
}

/**
 * Sync funnel creation
 */
export async function syncFunnelCreate(
  funnelData: any
): Promise<any | null> {
  return syncService.syncFunnelCreate(funnelData);
}

/**
 * Sync funnel deletion
 */
export async function syncFunnelDelete(funnelId: string): Promise<boolean> {
  return syncService.syncFunnelDelete(funnelId);
}

/**
 * Force refresh dashboard data
 */
export async function refreshDashboard(): Promise<void> {
  return syncService.refreshDashboardData();
}

/**
 * Get sync history
 */
export function getSyncHistory() {
  return syncService.getSyncHistory();
}

/**
 * Get sync statistics
 */
export function getSyncStats() {
  return syncService.getSyncStats();
}

/**
 * Connect editor to sync system
 * @param editorInstance - Editor instance reference
 * @returns Cleanup function
 */
export function connectEditorToSync(editorInstance: any): () => void {
  return syncService.connectEditor(editorInstance);
}

/**
 * Connect dashboard to sync system
 * @param dashboardInstance - Dashboard instance reference
 * @returns Cleanup function
 */
export function connectDashboardToSync(dashboardInstance: any): () => void {
  return syncService.connectDashboard(dashboardInstance);
}

export default syncService;
