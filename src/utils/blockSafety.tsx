import React from 'react';
import type { BlockData } from '@/types/blocks';

/**
 * Componente de erro para blocos com propriedades indefinidas
 */
export const BlockErrorFallback: React.FC<{ 
  message?: string;
  blockType?: string;
}> = ({ 
  message = "Erro: Bloco não encontrado ou propriedades indefinidas",
  blockType 
}) => (
  <div className="p-4 border-2 border-red-300 bg-red-50 rounded-lg">
    <p className="text-red-600 font-medium">{message}</p>
    {blockType && (
      <p className="text-red-500 text-sm mt-1">Tipo do bloco: {blockType}</p>
    )}
  </div>
);

/**
 * Hook para verificação de segurança de blocos
 * Retorna true se o bloco é válido, false caso contrário
 */
export const useBlockSafety = (block: BlockData | null | undefined): boolean => {
  return !!(block && block.properties);
};

/**
 * HOC (Higher Order Component) para adicionar verificação de segurança automaticamente
 */
export function withBlockSafety<T extends { block: BlockData }>(
  Component: React.ComponentType<T>
): React.ComponentType<T> {
  return function SafeBlockComponent(props: T) {
    const { block } = props;
    
    if (!block || !block.properties) {
      return (
        <BlockErrorFallback 
          blockType={block?.type}
          message="Erro: Bloco não encontrado ou propriedades indefinidas"
        />
      );
    }
    
    return <Component {...props} />;
  };
}

/**
 * Função utilitária para verificar se um bloco é válido
 */
export const isBlockValid = (block: any): block is BlockData => {
  return !!(block && typeof block === 'object' && block.properties);
};

/**
 * Função para obter propriedades de bloco com fallback seguro
 */
export const getBlockProperties = <T extends Record<string, any>>(
  block: BlockData | null | undefined,
  defaultProperties: T
): T => {
  if (!isBlockValid(block)) {
    return defaultProperties;
  }
  
  return { ...defaultProperties, ...block.properties };
};

/**
 * Hook personalizado para gerenciar propriedades de bloco com segurança
 */
export const useBlockProperties = <T extends Record<string, any>>(
  block: BlockData | null | undefined,
  defaultProperties: T
): [T, boolean] => {
  const isValid = useBlockSafety(block);
  const properties = getBlockProperties(block, defaultProperties);
  
  return [properties, isValid];
};