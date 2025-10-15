/**
 * FunnelService Stub
 */
export class FunnelService {
  async getFunnel(id: string) {
    return null;
  }

  async saveFunnel(data: any) {
    return data;
  }
}

export const funnelService = new FunnelService();
