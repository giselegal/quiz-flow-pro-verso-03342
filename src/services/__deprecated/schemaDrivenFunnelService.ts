// STUB: schemaDrivenFunnelService - to be migrated to FASE 1 architecture
export interface SchemaDrivenFunnelData {
  id: string;
  name: string;
  [key: string]: any;
}

export interface FunnelVersion {
  id: string;
  version: number;
  [key: string]: any;
}

export interface AutoSaveState {
  saving: boolean;
  lastSaved?: Date;
  pendingChanges?: number;
  errorCount?: number;
  enabled?: boolean;
  interval?: number;
}

export const schemaDrivenFunnelService = {
  getFunnel: async (id?: string) => null as SchemaDrivenFunnelData | null,
  saveFunnel: async () => null,
};
