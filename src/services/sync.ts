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
import type { UnifiedFunnelData } from '@/services/canonical';

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const syncService = EditorDashboardSyncService;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type { EditorSyncEvent, SyncNotification } from '@/services/core/EditorDashboardSyncService';

// ============================================================================
// INSTANCE INTERFACES
// ============================================================================

/** Interface for editor instance that can be connected to sync */
export interface SyncableEditor {
  refresh?: () => void;
  [key: string]: unknown;
}

/** Interface for dashboard instance that can be connected to sync */
export interface SyncableDashboard {
  refresh?: () => void;
  [key: string]: unknown;
}

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
  funnelData: Partial<UnifiedFunnelData>
): Promise<boolean> {
  return syncService.syncFunnelSave(funnelId, funnelData);
}

/**
 * Sync funnel publish between editor and dashboard
 */
export async function syncFunnelPublish(
  funnelId: string,
  funnelData: Partial<UnifiedFunnelData>
): Promise<boolean> {
  return syncService.syncFunnelPublish(funnelId, funnelData);
}

/**
 * Sync funnel creation
 */
export async function syncFunnelCreate(
  funnelData: Partial<UnifiedFunnelData>
): Promise<UnifiedFunnelData | null> {
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
export function connectEditorToSync(editorInstance: SyncableEditor): () => void {
  return syncService.connectEditor(editorInstance);
}

/**
 * Connect dashboard to sync system
 * @param dashboardInstance - Dashboard instance reference
 * @returns Cleanup function
 */
export function connectDashboardToSync(dashboardInstance: SyncableDashboard): () => void {
  return syncService.connectDashboard(dashboardInstance);
}

export default syncService;
