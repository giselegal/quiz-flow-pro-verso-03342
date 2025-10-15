/**
 * RealDataAnalyticsService Stub
 */
export class RealDataAnalyticsService {
  async getParticipants() {
    return [];
  }

  async getSessionDetails(id: string) {
    return null;
  }

  async getAnalytics() {
    return { total: 0, completed: 0, inProgress: 0 };
  }
}

export const realDataAnalyticsService = new RealDataAnalyticsService();
