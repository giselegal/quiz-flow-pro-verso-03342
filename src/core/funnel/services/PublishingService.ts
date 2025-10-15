/**
 * Publishing Service Stub - Legacy compatibility
 */

export interface PublishOptions {
    version?: string;
    notes?: string;
}

export interface PublishResult {
    success: boolean;
    url?: string;
}

export interface DeploymentInfo {
    id: string;
    status: string;
}

export interface PublishingStats {
    published: number;
    failed: number;
}

export class PublishingService {
    publishFunnel(): Promise<PublishResult> { 
        return Promise.resolve({ success: true }); 
    }
}

export const publishingService = new PublishingService();
