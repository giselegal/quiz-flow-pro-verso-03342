/**
 * Validador para prevenir futuras duplicações de componentes
 * Detecta conflitos e inconsistências no sistema de mapeamento
 */

import { getAllBlockTypes, getBlockComponent } from '@/config/editorBlocksMapping';

export interface ComponentHealth {
  totalComponents: number;
  validComponents: number;
  invalidComponents: string[];
  duplicatedTypes: string[];
  orphanedFiles: string[];
  healthScore: number;
}

/**
 * Analisa a saúde do sistema de componentes
 */
export const analyzeComponentHealth = (): ComponentHealth => {
  const allTypes = getAllBlockTypes();
  const validComponents: string[] = [];
  const invalidComponents: string[] = [];

  // Verifica cada tipo de componente
  allTypes.forEach(type => {
    const component = getBlockComponent(type);
    if (component) {
      validComponents.push(type);
    } else {
      invalidComponents.push(type);
    }
  });

  const healthScore = (validComponents.length / allTypes.length) * 100;

  return {
    totalComponents: allTypes.length,
    validComponents: validComponents.length,
    invalidComponents,
    duplicatedTypes: [], // TODO: Implementar detecção de duplicatas
    orphanedFiles: [], // TODO: Implementar detecção de arquivos órfãos
    healthScore: Math.round(healthScore),
  };
};

/**
 * Detecta possíveis conflitos de nomenclatura
 */
export const detectNamingConflicts = (componentName: string): boolean => {
  const commonConflicts = ['HeaderBlock', 'TextBlock', 'ImageBlock', 'ButtonBlock'];

  return commonConflicts.includes(componentName);
};

/**
 * Valida se um novo componente pode ser adicionado sem conflitos
 */
export const validateNewComponent = (
  componentType: string,
  componentPath: string
): { valid: boolean; warnings: string[] } => {
  const warnings: string[] = [];

  // Verifica se o tipo já existe
  const existingComponent = getBlockComponent(componentType);
  if (existingComponent) {
    warnings.push(`Tipo '${componentType}' já existe no sistema`);
  }

  // Verifica conflitos de nomenclatura
  if (detectNamingConflicts(componentType)) {
    warnings.push(`Nome '${componentType}' é propenso a conflitos`);
  }

  // Verifica padrão de path
  const validPaths = ['src/components/editor/blocks/', 'src/components/blocks/'];

  const hasValidPath = validPaths.some(path => componentPath.includes(path));
  if (!hasValidPath) {
    warnings.push(`Path '${componentPath}' não segue convenções estabelecidas`);
  }

  return {
    valid: warnings.length === 0,
    warnings,
  };
};

/**
 * Gera relatório de limpeza
 */
export const generateCleanupReport = (): string => {
  const health = analyzeComponentHealth();

  return `
🔍 RELATÓRIO DE SAÚDE DOS COMPONENTES
====================================

📊 Estatísticas:
- Total de componentes: ${health.totalComponents}
- Componentes válidos: ${health.validComponents}
- Componentes inválidos: ${health.invalidComponents.length}
- Score de saúde: ${health.healthScore}%

${
  health.invalidComponents.length > 0
    ? `
❌ Componentes Inválidos:
${health.invalidComponents.map(c => `- ${c}`).join('\n')}
`
    : '✅ Todos os componentes estão funcionais!'
}

${
  health.healthScore >= 90
    ? '🎉 Sistema em excelente estado!'
    : health.healthScore >= 70
      ? '⚠️ Sistema precisa de atenção.'
      : '🚨 Sistema precisa de limpeza urgente!'
}
  `;
};

/**
 * Hook para monitoramento contínuo (desenvolvimento)
 */
export const useComponentHealthMonitor = () => {
  if (process.env.NODE_ENV === 'development') {
    const health = analyzeComponentHealth();
    console.log('🔍 Component Health:', health);

    if (health.healthScore < 90) {
      console.warn('⚠️ Alguns componentes podem precisar de atenção');
    }
  }
};
