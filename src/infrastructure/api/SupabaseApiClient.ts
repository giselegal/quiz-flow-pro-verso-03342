/**
 * SupabaseApiClient Stub - Legacy compatibility
 */

export interface ApiResponse<T = any> {
    data: T | null;
    error: Error | null;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T> {
    pagination?: {
        page: number;
        limit: number;
        total: number;
    };
}

export interface QueryOptions {
    page?: number;
    limit?: number;
    orderBy?: string;
}

export class SupabaseApiClient {
    // Empty stub
}

export const supabaseApi = new SupabaseApiClient();
