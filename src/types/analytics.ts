/**
 * 🎯 ANALYTICS TYPES - Type Safety para Analytics
 */

export interface UserEvent {
  id: string;
  userId: string;
  eventType: string;
  timestamp: string;
  metadata?: Record<string, any>;
  sessionId?: string;
  pageUrl?: string;
}

export interface User {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
  lastActive?: string;
  totalSessions?: number;
}

export interface FunnelMetric {
  id: string;
  funnelId: string;
  metricName: string;
  value: number;
  timestamp: string;
  period: string;
}

export interface BackupRecord {
  id: string;
  filename: string;
  size: number;
  createdAt: string;
  type: 'automatic' | 'manual';
  status: 'completed' | 'pending' | 'failed';
}

// Legacy compatibility
export interface BackupJob {
  id: string;
  filename: string;
  size: number;
  createdAt: string;
  type: 'automatic' | 'manual';
  status: 'completed' | 'pending' | 'failed';
}