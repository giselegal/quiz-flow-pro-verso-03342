/**
 * FunnelService Stub
 */
export class FunnelService {
  async getFunnel(id: string) {
    return { id, name: 'Stub Funnel' };
  }

  async saveFunnel(data: any) {
    return data;
  }

  async updateFunnel(id: string, data: any) {
    return { ...data, id };
  }

  async listFunnels() {
    return [] as any[];
  }

  async deleteFunnel(id: string) {
    return true;
  }
}

export const funnelService = new FunnelService();

// Compatibility API used by AdvancedFunnelStorage
export const funnelApiService = {
  getFunnel: (id: string) => funnelService.getFunnel(id),
  updateFunnel: (id: string, data: any) => funnelService.updateFunnel(id, data),
  listFunnels: () => funnelService.listFunnels(),
  deleteFunnel: (id: string) => funnelService.deleteFunnel(id),
};
