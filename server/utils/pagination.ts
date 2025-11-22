/**
 * Pagination Utilities
 * Helpers for paginated responses
 */

export interface PaginationParams {
  page?: number;
  limit?: number;
  include?: string[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export function parsePaginationParams(query: any): PaginationParams {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  const include = query.include ? query.include.split(',').map((s: string) => s.trim()) : [];

  return { page, limit, include };
}

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> {
  const pages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages,
      hasNext: page < pages,
      hasPrev: page > 1,
    },
  };
}

export function getPaginationFromQuery(query: any): { offset: number; limit: number; page: number } {
  const { page, limit } = parsePaginationParams(query);
  const offset = (page - 1) * limit;

  return { offset, limit, page };
}
