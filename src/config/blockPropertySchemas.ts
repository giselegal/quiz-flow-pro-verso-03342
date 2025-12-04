/**
 * 📦 BLOCK PROPERTY SCHEMAS - Redirect to Modular Structure
 * 
 * ⚠️ DEPRECATED: Este arquivo foi dividido em módulos menores.
 * Use `@/config/blockSchemas` para novos imports.
 * 
 * Este arquivo mantém compatibilidade retroativa re-exportando
 * os schemas do novo sistema modular.
 * 
 * Nova estrutura em src/config/blockSchemas/:
 * - types.ts      → Tipos e campos comuns
 * - universal.ts  → Schemas universais
 * - intro.ts      → Intro, headers, decorativos
 * - content.ts    → Texto, imagem, mídia
 * - question.ts   → Perguntas, opções, inputs
 * - result.ts     → Resultados, scores, progresso
 * - offer.ts      → Ofertas, CTAs, preços
 * - layout.ts     → Layout, containers, navegação
 * - social.ts     → Compartilhamento social
 * 
 * @deprecated Use `import { blockPropertySchemas } from '@/config/blockSchemas'`
 */

// Re-export types
export type { FieldType, BlockFieldSchema, BlockSchema, BlockSchemaRecord } from './blockSchemas/types';

// Re-export values
export { COMMON_FIELDS } from './blockSchemas/types';
export { blockPropertySchemas } from './blockSchemas/index';

// Default export for backward compatibility
import { blockPropertySchemas } from './blockSchemas/index';
export default blockPropertySchemas;
