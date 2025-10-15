/**
 * FunnelUnifiedService Stub - Legacy compatibility
 */

export interface UnifiedFunnelData {
    id: string;
    name: string;
    type: string;
    [key: string]: any;
}

export class FunnelUnifiedService {
    private static instance: FunnelUnifiedService;

    static getInstance(): FunnelUnifiedService {
        if (!this.instance) {
            this.instance = new FunnelUnifiedService();
        }
        return this.instance;
    }

    async getFunnel(id: string, options?: any): Promise<UnifiedFunnelData | null> {
        return null;
    }

    async saveFunnel(data: UnifiedFunnelData): Promise<void> {
        return;
    }

    async listFunnels(): Promise<UnifiedFunnelData[]> {
        return [];
    }

    async createFunnel(data: Partial<UnifiedFunnelData>): Promise<UnifiedFunnelData | null> {
        return null;
    }

    async updateFunnel(id: string, data: Partial<UnifiedFunnelData>): Promise<void> {
        return;
    }

    async duplicateFunnel(id: string): Promise<UnifiedFunnelData | null> {
        return null;
    }

    async deleteFunnel(id: string): Promise<void> {
        return;
    }

    async checkPermissions(id: string): Promise<boolean> {
        return true;
    }

    clearCache(): void {
        return;
    }

    on(event: string, callback: Function): void {
        return;
    }

    off(event: string, callback: Function): void {
        return;
    }
}

export const funnelUnifiedService = new FunnelUnifiedService();
