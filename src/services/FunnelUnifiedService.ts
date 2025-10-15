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
        console.warn('FunnelUnifiedService.getFunnel is a stub');
        return null;
    }

    async saveFunnel(data: UnifiedFunnelData, optimistic?: boolean): Promise<void> {
        console.warn('FunnelUnifiedService.saveFunnel is a stub');
        return;
    }

    async listFunnels(): Promise<UnifiedFunnelData[]> {
        console.warn('FunnelUnifiedService.listFunnels is a stub');
        return [];
    }

    async createFunnel(data: Partial<UnifiedFunnelData>): Promise<UnifiedFunnelData> {
        console.warn('FunnelUnifiedService.createFunnel is a stub');
        return {
            id: 'stub-id',
            name: data.name || 'Stub Funnel',
            slug: data.slug || 'stub-funnel',
            steps: {},
            isPublished: false,
            version: 1
        };
    }

    async updateFunnel(id: string, data: Partial<UnifiedFunnelData>, optimistic?: boolean): Promise<void> {
        console.warn('FunnelUnifiedService.updateFunnel is a stub');
        return;
    }

    async duplicateFunnel(id: string, newName?: string): Promise<UnifiedFunnelData> {
        console.warn('FunnelUnifiedService.duplicateFunnel is a stub');
        return {
            id: 'stub-duplicated-id',
            name: newName || 'Duplicated Funnel',
            slug: 'stub-duplicated',
            steps: {},
            isPublished: false,
            version: 1
        };
    }

    async deleteFunnel(id: string): Promise<void> {
        console.warn('FunnelUnifiedService.deleteFunnel is a stub');
        return;
    }

    async checkPermissions(id: string, userId?: string): Promise<boolean> {
        console.warn('FunnelUnifiedService.checkPermissions is a stub');
        return true;
    }

    clearCache(funnelId?: string): void {
        console.warn('FunnelUnifiedService.clearCache is a stub');
        return;
    }

    on(event: string, callback: Function): void {
        console.warn('FunnelUnifiedService.on is a stub');
        return;
    }

    off(event: string, callback: Function): void {
        console.warn('FunnelUnifiedService.off is a stub');
        return;
    }
}

export const funnelUnifiedService = new FunnelUnifiedService();
