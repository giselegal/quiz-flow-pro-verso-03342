/**
 * 📦 SCHEMAS INDEX - CENTRAL DE EXPORTAÇÃO
 * 
 * Exporta todos os schemas de validação do projeto
 * Facilita importações centralizadas
 */

// Block Schemas (schemas gerais de blocos)
export * from './blockSchemas';

// Step 01 Schema (schema específico do Step-01)
export * from './step01Schema';

// Re-exportação organizada para conveniência
import step01Schema from './step01Schema';
export { step01Schema };

export default {
    step01: step01Schema,
};
