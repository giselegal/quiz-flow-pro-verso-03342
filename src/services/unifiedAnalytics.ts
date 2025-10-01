/**
 * 🚀 UNIFIED ANALYTICS SERVICE - Simplified Version
 */

export interface DashboardMetrics {
  totalParticipants: number;
  completionRate: number;
  averageScore: number;
  conversionRate: number;
  // Add missing properties
  completedSessions: number;
  averageCompletionTime: number;
  popularStyles: any[];
  hourlyActivity: any[];
  deviceBreakdown: any[];
  activeSessions: number;
}

export interface ParticipantDetails {
  id: string;
  name: string;
  email: string;
  completionDate: string;
  score: number;
  status: string;
}

export interface AnalyticsFilters {
  dateRange?: { from: Date; to: Date; };
  status?: string;
}

export class UnifiedAnalyticsService {
  static async getDashboardMetrics(): Promise<DashboardMetrics> {
    return {
      totalParticipants: 150,
      completionRate: 75,
      averageScore: 85,
      conversionRate: 12.5,
      completedSessions: 113,
      averageCompletionTime: 320,
      popularStyles: [{ name: 'Modern', count: 45 }],
      hourlyActivity: [{ hour: 14, count: 25 }],
      deviceBreakdown: [{ device: 'Desktop', count: 80 }],
      activeSessions: 25
    };
  }

  static async getParticipantsDetails(): Promise<{ participants: ParticipantDetails[]; total: number; totalPages: number; currentPage: number }> {
    return {
      participants: [],
      total: 0,
      totalPages: 1,
      currentPage: 1
    };
  }

  static async getRealTimeMetrics() {
    return { activeUsers: 25, currentSessions: 15 };
  }

  static async getRealTimeData() {
    return {
      activeUsers: 25,
      recentActivity: [
        { id: '1', timestamp: new Date().toISOString(), activity: 'Quiz completado', location: 'São Paulo' }
      ],
      currentSessions: 15
    };
  }

  static async getAnalyticsSummary() {
    return {
      totalParticipants: 150,
      completionRate: 75,
      averageScore: 85,
      topPerformingQuizzes: []
    };
  }
}

export const unifiedAnalytics = {
  getRealTimeData: UnifiedAnalyticsService.getRealTimeData,
  getDashboardMetrics: UnifiedAnalyticsService.getDashboardMetrics,
  getParticipantsDetails: UnifiedAnalyticsService.getParticipantsDetails,
  getRealTimeMetrics: UnifiedAnalyticsService.getRealTimeMetrics
};