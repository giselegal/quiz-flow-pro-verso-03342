/**
 * funnelComponentsService Stub
 */
export class FunnelComponentsService {
  async getComponents() {
    return [];
  }

  async saveComponent(data: any) {
    return data;
  }
}

export const funnelComponentsService = new FunnelComponentsService();
