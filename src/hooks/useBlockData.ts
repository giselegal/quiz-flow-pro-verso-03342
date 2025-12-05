/**
 * 🪝 USE BLOCK DATA HOOK - Fase 2
 * 
 * Hook para acesso unificado a dados de blocos em componentes React
 * Normaliza automaticamente content/properties
 */

import { useMemo } from 'react';
import {
  adaptBlockData,
  getBlockText,
  getBlockImage,
  getBlockOptions,
  getBlockColor,
  getBlockNumber,
  getBlockBoolean,
  type BlockDataSource,
  type NormalizedBlockData,
} from '@/lib/utils/blockDataAdapter';

/**
 * Hook principal para acesso a dados de blocos
 * 
 * @example
 * ```tsx
 * function MyBlock({ block }: { block: BlockDataSource }) {
 *   const { get, has, data } = useBlockData(block);
 *   
 *   const title = get('title', 'Default Title');
 *   const showImage = has('imageUrl');
 *   
 *   return <div>{title}</div>;
 * }
 * ```
 */
export function useBlockData(block: BlockDataSource | null | undefined): NormalizedBlockData {
  return useMemo(() => adaptBlockData(block), [block]);
}

/**
 * Hook para extrair texto de blocos
 */
export function useBlockText(
  block: BlockDataSource | null | undefined,
  keys?: string[],
  fallback?: string
): string {
  return useMemo(
    () => block ? getBlockText(block, keys, fallback) : (fallback || ''),
    [block, keys, fallback]
  );
}

/**
 * Hook para extrair imagem de blocos
 */
export function useBlockImage(
  block: BlockDataSource | null | undefined,
  keys?: string[],
  fallback?: string
): string | undefined {
  return useMemo(
    () => block ? getBlockImage(block, keys, fallback) : fallback,
    [block, keys, fallback]
  );
}

/**
 * Hook para extrair opções de blocos
 */
export function useBlockOptions(
  block: BlockDataSource | null | undefined,
  keys?: string[]
) {
  return useMemo(
    () => block ? getBlockOptions(block, keys) : [],
    [block, keys]
  );
}

/**
 * Hook para extrair cor de blocos
 */
export function useBlockColor(
  block: BlockDataSource | null | undefined,
  key: string,
  fallback?: string
): string {
  return useMemo(
    () => block ? getBlockColor(block, key, fallback) : (fallback || '#000000'),
    [block, key, fallback]
  );
}

/**
 * Hook para extrair número de blocos
 */
export function useBlockNumber(
  block: BlockDataSource | null | undefined,
  key: string,
  fallback?: number,
  min?: number,
  max?: number
): number {
  return useMemo(
    () => block ? getBlockNumber(block, key, fallback, min, max) : (fallback || 0),
    [block, key, fallback, min, max]
  );
}

/**
 * Hook para extrair booleano de blocos
 */
export function useBlockBoolean(
  block: BlockDataSource | null | undefined,
  key: string,
  fallback?: boolean
): boolean {
  return useMemo(
    () => block ? getBlockBoolean(block, key, fallback) : (fallback || false),
    [block, key, fallback]
  );
}

// Re-export types
export type { BlockDataSource, NormalizedBlockData } from '@/lib/utils/blockDataAdapter';
