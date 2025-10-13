/**
 * @deprecated Use FunnelService instead
 * 
 * Advanced Funnel Storage - Compatibility Layer
 */

import { funnelApiService } from './funnelService';

export interface FunnelItem {
  id: string;
  name: string;
  [key: string]: any;
}

export interface FunnelSettings {
  [key: string]: any;
}

export class AdvancedFunnelStorage {
  private static instance: AdvancedFunnelStorage;
  private funnelService = funnelApiService;

  private constructor() {}

  static getInstance(): AdvancedFunnelStorage {
    if (!this.instance) {
      this.instance = new AdvancedFunnelStorage();
    }
    return this.instance;
  }

  async saveFunnel(funnel: any): Promise<void> {
    await this.funnelService.updateFunnel(funnel.id, funnel);
  }

  async loadFunnel(id: string): Promise<any> {
    return await this.funnelService.getFunnel(id);
  }

  async listFunnels(): Promise<any[]> {
    return await this.funnelService.listFunnels();
  }

  async deleteFunnel(id: string): Promise<void> {
    await this.funnelService.deleteFunnel(id);
  }

  async upsertFunnel(funnel: FunnelItem): Promise<void> {
    await this.saveFunnel(funnel);
  }

  async getFunnel(id: string): Promise<FunnelItem | null> {
    return await this.loadFunnel(id);
  }

  async saveFunnelSettings(settings: FunnelSettings): Promise<void> {
    console.log('Saving funnel settings:', settings);
  }

  async getFunnelSettings(): Promise<FunnelSettings | null> {
    return null;
  }

  async getStorageInfo(): Promise<any> {
    return { used: 0, available: 0 };
  }

  async clearAllData(): Promise<void> {
    console.log('Clearing all data');
  }
}

export const advancedFunnelStorage = AdvancedFunnelStorage.getInstance();
