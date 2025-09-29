// Stub type for FunnelStep to fix import errors
export interface FunnelStep {
  id: string;
  name: string;
  order: number;
  blocks: any[];
  metadata?: Record<string, any>;
}