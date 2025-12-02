/**
 * Adapter para compatibilizar FunnelMetadata (canonical) com UnifiedFunnel (legacy)
 */

import type { FunnelMetadata } from '@/types/funnel';
import { UnifiedFunnel, UnifiedStage } from '@/services/UnifiedCRUDService';

export function adaptMetadataToUnified(metadata: FunnelMetadata): UnifiedFunnel {
  return {
    id: metadata.id,
    name: metadata.name,
    description: (metadata.metadata as any)?.description || '',
    stages: [], // Stages precisam ser carregados separadamente
    settings: {
      ...metadata.config,
      type: metadata.type,
      category: metadata.category,
    } as any,
    status: metadata.status,
    createdAt: new Date(metadata.createdAt),
    updatedAt: new Date(metadata.updatedAt),
    userId: 'system',
    version: '1',
  } as UnifiedFunnel;
}

export function adaptUnifiedToMetadata(unified: UnifiedFunnel): Partial<FunnelMetadata> {
  return {
    id: unified.id,
    name: unified.name,
    type: (unified.settings as any)?.type || 'quiz',
    category: (unified.settings as any)?.category || 'quiz',
    status: unified.status,
    config: unified.settings,
    metadata: {
      description: unified.description,
    },
    createdAt: unified.createdAt.toISOString(),
    updatedAt: unified.updatedAt.toISOString(),
    isActive: unified.status === 'published',
  };
}
