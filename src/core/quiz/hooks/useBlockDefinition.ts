/**
 * 🎣 REACT HOOKS - Wave 2
 * 
 * Hooks para integração do BlockRegistry com React.
 * Facilita acesso às definições de blocos no Editor.
 * 
 * @version 1.0.0
 * @wave 2
 */

import { useMemo } from 'react';
import { BlockRegistry } from '../blocks/registry';
import type { BlockDefinition } from '../blocks/types';

/**
 * Hook para obter definição de um bloco
 */
export function useBlockDefinition(blockType: string): BlockDefinition | undefined {
  return useMemo(() => {
    return BlockRegistry.getDefinition(blockType);
  }, [blockType]);
}

/**
 * Hook para obter todas as definições de uma categoria
 */
export function useBlocksByCategory(category: string): BlockDefinition[] {
  return useMemo(() => {
    return BlockRegistry.getByCategory(category);
  }, [category]);
}

/**
 * Hook para obter todos os tipos registrados
 */
export function useAllBlockTypes(): string[] {
  return useMemo(() => {
    return BlockRegistry.getAllTypes();
  }, []);
}

/**
 * Hook para resolver tipo oficial a partir de alias
 */
export function useResolveBlockType(type: string): string {
  return useMemo(() => {
    return BlockRegistry.resolveType(type);
  }, [type]);
}

/**
 * Hook para verificar se um tipo está registrado
 */
export function useHasBlockType(type: string): boolean {
  return useMemo(() => {
    return BlockRegistry.hasType(type);
  }, [type]);
}
