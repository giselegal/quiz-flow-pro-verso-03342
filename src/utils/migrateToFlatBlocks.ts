/**
 * 🎯 MIGRATE TO FLAT BLOCKS - FASE 4: Migração de Dados
 * 
 * Utilitário para migrar dados do formato antigo (steps monolíticos)
 * para o novo formato (blocos flat e independentes).
 * 
 * FEATURES:
 * ✅ Migração automática de steps legados
 * ✅ Preserva todas as propriedades dos blocos
 * ✅ Gera estrutura flat + índice por step
 * ✅ Validação de dados migrados
 * ✅ Relatório de migração detalhado
 */

import { Block } from '@/types/editor';
import { QuizStep } from '@/types/quiz';
import { migrateStepToBlocks } from './migrateStepToBlocks';

/**
 * Interface para estrutura flat de blocos
 */
export interface FlatBlocksStructure {
  /** Lista flat de TODOS os blocos */
  blocks: Block[];
  
  /** Índice de IDs de blocos por step */
  blocksByStep: Record<string, string[]>;
}

/**
 * Interface para relatório de migração
 */
export interface MigrationReport {
  success: boolean;
  stepsProcessed: number;
  blocksCreated: number;
  errors: string[];
  warnings: string[];
  details: {
    stepId: string;
    blockCount: number;
    blockTypes: string[];
  }[];
}

/**
 * Migrar steps legados para formato flat de blocos
 * 
 * @param legacySteps - Array de steps no formato antigo (QuizStep)
 * @returns Estrutura flat com blocos e índice por step
 */
export function migrateLegacyStepsToFlatBlocks(
  legacySteps: QuizStep[]
): FlatBlocksStructure {
  
  const blocks: Block[] = [];
  const blocksByStep: Record<string, string[]> = {};
  
  console.log('🔄 Iniciando migração de', legacySteps.length, 'steps...');
  
  legacySteps.forEach((step, stepIndex) => {
    const stepId = `step-${stepIndex + 1}`;
    blocksByStep[stepId] = [];
    
    try {
      // Usar função existente de migração
      const migrationResult = migrateStepToBlocks(step as any);
      
      // Se migração retornou null ou não tem blocos, pular
      if (!migrationResult || !migrationResult.blocks) {
        console.warn(`⚠️ Step ${stepIndex + 1} não retornou blocos válidos`);
        return;
      }
      
      // Processar blocos migrados
      migrationResult.blocks.forEach((block, blockIndex) => {
        // Adicionar stepId e garantir ID único
        const flatBlock: Block = {
          id: `${stepId}-${block.id || `block-${blockIndex}`}`,
          type: block.type as any,
          order: blockIndex,
          content: (block as any).props || {},
          properties: {
            stepId,
          }
        };
        
        // Adicionar à lista flat
        blocks.push(flatBlock);
        
        // Adicionar ao índice do step
        blocksByStep[stepId].push(flatBlock.id);
      });
      
      console.log(`✅ Step ${stepIndex + 1} migrado:`, migrationResult.blocks.length, 'blocos');
      
    } catch (error) {
      console.error(`❌ Erro ao migrar step ${stepIndex + 1}:`, error);
      
      // Criar bloco de erro placeholder
      const errorBlock: Block = {
        id: `${stepId}-error`,
        type: 'text',
        order: 0,
        content: {
          text: `Erro ao migrar step ${stepIndex + 1}. Por favor, reconfigure manualmente.`,
        },
        properties: {
          stepId,
          migrationError: true,
        },
      };
      
      blocks.push(errorBlock);
      blocksByStep[stepId].push(errorBlock.id);
    }
  });
  
  console.log('✅ Migração concluída:', blocks.length, 'blocos criados');
  
  return { blocks, blocksByStep };
}

/**
 * Migrar estrutura antiga de stepBlocks para formato flat
 * 
 * @param stepBlocks - Objeto com blocos organizados por step (formato antigo)
 * @returns Estrutura flat com blocos e índice por step
 */
export function migrateStepBlocksToFlat(
  stepBlocks: Record<string, Block[]>
): FlatBlocksStructure {
  
  const blocks: Block[] = [];
  const blocksByStep: Record<string, string[]> = {};
  
  console.log('🔄 Migrando stepBlocks para formato flat...');
  
  Object.entries(stepBlocks).forEach(([stepKey, stepBlocksArray]) => {
    blocksByStep[stepKey] = [];
    
    stepBlocksArray.forEach((block, index) => {
      // Garantir propriedades necessárias
      const flatBlock: Block = {
        ...block,
        id: block.id || `${stepKey}-block-${index}`,
        order: index,
        properties: {
          ...(block.properties || {}),
          stepId: stepKey,
        }
      };
      
      blocks.push(flatBlock);
      blocksByStep[stepKey].push(flatBlock.id);
    });
  });
  
  console.log('✅ Migração de stepBlocks concluída:', blocks.length, 'blocos');
  
  return { blocks, blocksByStep };
}

/**
 * Validar estrutura migrada
 * 
 * @param structure - Estrutura flat para validar
 * @returns true se válida, lança erro se inválida
 */
export function validateFlatStructure(structure: FlatBlocksStructure): boolean {
  const { blocks, blocksByStep } = structure;
  
  // Validar que todos os IDs no índice existem em blocks
  const blockIds = new Set(blocks.map(b => b.id));
  
  Object.entries(blocksByStep).forEach(([stepKey, blockIdArray]) => {
    blockIdArray.forEach(blockId => {
      if (!blockIds.has(blockId)) {
        throw new Error(
          `❌ Validação falhou: Block ID "${blockId}" no índice do step "${stepKey}" não existe na lista de blocos`
        );
      }
    });
  });
  
  // Validar que todos os blocos têm stepId
  blocks.forEach(block => {
    if (!block.properties?.stepId) {
      throw new Error(
        `❌ Validação falhou: Block "${block.id}" não tem stepId nas propriedades`
      );
    }
  });
  
  console.log('✅ Estrutura flat validada com sucesso');
  return true;
}

/**
 * Gerar relatório detalhado de migração
 * 
 * @param structure - Estrutura flat migrada
 * @param legacySteps - Steps originais (opcional, para comparação)
 * @returns Relatório de migração
 */
export function generateMigrationReport(
  structure: FlatBlocksStructure,
  legacySteps?: QuizStep[]
): MigrationReport {
  
  const { blocks, blocksByStep } = structure;
  
  const report: MigrationReport = {
    success: true,
    stepsProcessed: Object.keys(blocksByStep).length,
    blocksCreated: blocks.length,
    errors: [],
    warnings: [],
    details: [],
  };
  
  // Gerar detalhes por step
  Object.entries(blocksByStep).forEach(([stepKey, blockIds]) => {
    const stepBlocks = blocks.filter(b => blockIds.includes(b.id));
    const blockTypes = [...new Set(stepBlocks.map(b => b.type))];
    
    report.details.push({
      stepId: stepKey,
      blockCount: blockIds.length,
      blockTypes,
    });
    
    // Avisos
    if (blockIds.length === 0) {
      report.warnings.push(`⚠️ Step "${stepKey}" não tem blocos`);
    }
  });
  
  // Validar estrutura
  try {
    validateFlatStructure(structure);
  } catch (error) {
    report.success = false;
    report.errors.push(error instanceof Error ? error.message : String(error));
  }
  
  return report;
}

/**
 * Detectar se dados estão no formato legado
 * 
 * @param data - Dados a serem verificados
 * @returns true se formato legado, false se já está no formato flat
 */
export function isLegacyFormat(data: any): boolean {
  // Se tem stepBlocks mas não tem blocks/blocksByStep, é formato legado
  if (data.stepBlocks && !data.blocks && !data.blocksByStep) {
    return true;
  }
  
  // Se é um array de QuizStep, é formato legado
  if (Array.isArray(data) && data.length > 0 && data[0].type) {
    return true;
  }
  
  return false;
}

/**
 * Migração automática com detecção de formato
 * 
 * @param data - Dados a serem migrados (formato automático)
 * @returns Estrutura flat + relatório
 */
export function autoMigrate(data: any): {
  structure: FlatBlocksStructure;
  report: MigrationReport;
} {
  
  console.log('🔍 Detectando formato dos dados...');
  
  let structure: FlatBlocksStructure;
  
  if (isLegacyFormat(data)) {
    console.log('📦 Formato legado detectado, iniciando migração...');
    
    if (Array.isArray(data)) {
      // Array de QuizStep
      structure = migrateLegacyStepsToFlatBlocks(data);
    } else if (data.stepBlocks) {
      // Objeto com stepBlocks
      structure = migrateStepBlocksToFlat(data.stepBlocks);
    } else {
      throw new Error('❌ Formato legado não reconhecido');
    }
  } else {
    console.log('✅ Dados já estão no formato flat');
    structure = {
      blocks: data.blocks || [],
      blocksByStep: data.blocksByStep || {},
    };
  }
  
  const report = generateMigrationReport(structure);
  
  return { structure, report };
}

/**
 * Exportar para localStorage (helper)
 */
export function saveFlatStructureToLocalStorage(
  structure: FlatBlocksStructure,
  key: string = 'flat-blocks-structure'
): void {
  try {
    localStorage.setItem(key, JSON.stringify(structure));
    console.log('💾 Estrutura flat salva no localStorage:', key);
  } catch (error) {
    console.error('❌ Erro ao salvar no localStorage:', error);
  }
}

/**
 * Importar do localStorage (helper)
 */
export function loadFlatStructureFromLocalStorage(
  key: string = 'flat-blocks-structure'
): FlatBlocksStructure | null {
  try {
    const data = localStorage.getItem(key);
    if (!data) return null;
    
    const structure = JSON.parse(data) as FlatBlocksStructure;
    console.log('📂 Estrutura flat carregada do localStorage:', key);
    
    return structure;
  } catch (error) {
    console.error('❌ Erro ao carregar do localStorage:', error);
    return null;
  }
}
