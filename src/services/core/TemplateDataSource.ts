/**
 * 🎯 TEMPLATE DATA SOURCE - Interface Única
 * 
 * Interface canônica para acesso a templates.
 * Todos os services devem implementar ou usar esta interface.
 * 
 * @version 1.0.0
 * @phase FASE-1
 */

import type { Block } from '@/types/editor';

/**
 * Source priority enum
 */
export enum DataSourcePriority {
  USER_EDIT = 1,        // Maior prioridade (Supabase funnels.config)
  ADMIN_OVERRIDE = 2,   // Override admin (Supabase template_overrides)
  TEMPLATE_DEFAULT = 3, // Template padrão (JSON files)
  FALLBACK = 4,         // Fallback hardcoded (emergency)
}

/**
 * Metadata sobre a fonte do dado
 */
export interface SourceMetadata {
  source: DataSourcePriority;
  timestamp: number;
  cacheHit: boolean;
  loadTime: number;
  version?: string;
  // 🔗 Quick Win: Incluir referência ao tema global (não serializar grande objeto em cada bloco)
  themeVersion?: string; // ex: '4.0'
}

/**
 * Resultado com metadata
 */
export interface DataSourceResult<T> {
  data: T;
  metadata: SourceMetadata;
}

/**
 * Interface principal para data sources
 */
export interface TemplateDataSource {
  /**
   * Obter blocos com hierarquia de prioridade
   * 
   * @param stepId ID do step (ex: "step-01")
   * @param funnelId ID do funil (opcional, para user edits)
   * @returns Blocos com metadata da fonte
   */
  getPrimary(stepId: string, funnelId?: string): Promise<DataSourceResult<Block[]>>;

  /**
   * Salvar blocos (sempre vai para Supabase)
   * 
   * @param stepId ID do step
   * @param blocks Blocos a salvar
   * @param funnelId ID do funil
   */
  setPrimary(stepId: string, blocks: Block[], funnelId: string): Promise<void>;

  /**
   * Invalidar cache em todas as camadas
   * 
   * @param stepId ID do step a invalidar
   * @param funnelId ID do funil (opcional)
   */
  invalidate(stepId: string, funnelId?: string): Promise<void>;

  /**
   * Verificar qual fonte seria usada (dry-run)
   * Útil para debug e monitoring
   * 
   * @param stepId ID do step
   * @param funnelId ID do funil (opcional)
   * @returns Prioridade que seria usada
   */
  predictSource(stepId: string, funnelId?: string): Promise<DataSourcePriority>;
}

/**
 * Options para configurar o data source
 */
export interface DataSourceOptions {
  enableCache?: boolean;
  cacheTTL?: number;
  enableMetrics?: boolean;
  fallbackToStatic?: boolean;
}
