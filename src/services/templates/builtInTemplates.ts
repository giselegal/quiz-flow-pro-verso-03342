import { appLogger } from '@/lib/utils/appLogger';
/**
 * 🏗️ BUILT-IN TEMPLATES LOADER
 * 
 * Carrega templates JSON estáticos em build-time usando import.meta.glob do Vite.
 * Este é o sistema primário de templates - priorizado antes de módulos .ts e backend.
 * 
 * Formato esperado: JSON compatível com v3.1 template schema
 * Localização: src/templates/*.json
 * 
 * @module builtInTemplates
 */

export type BuiltTemplate = any; // TODO: Substituir por tipo adequado quando schema v3.1 estiver definido

/**
 * Carrega todos os arquivos JSON de templates em build-time
 * usando import.meta.glob do Vite (eager mode para bundle imediato)
 */
// Vite expõe import.meta.glob; scripts Node (tsx) não. Evitamos quebrar execução em scripts
// definindo um fallback que retorna objeto vazio quando glob não está disponível.
const globFn = (import.meta as any).glob as ((pattern: string, opts?: Record<string, unknown>) => Record<string, any>) | undefined;
const modules = globFn ? globFn('../../templates/*.json', { eager: true }) : {};
if (!globFn && typeof process !== 'undefined' && process?.versions?.node) {
  appLogger.warn('[builtInTemplates] import.meta.glob indisponível; carregamento built-in ignorado (ambiente Node)');
}

/**
 * Cache de templates built-in indexados por ID
 * ID é derivado do nome do arquivo (sem extensão .json)
 */
const builtInTemplates: Record<string, BuiltTemplate> = {};

// Popular cache de templates a partir dos módulos carregados
for (const path in modules) {
  try {
    const mod = (modules[path] as any).default ?? modules[path];
    
    // Extrair nome do arquivo do path
    const filename = path.split('/').pop() ?? path;
    const id = filename.replace(/\.json$/i, '');
    
    // Armazenar template com ID normalizado
    builtInTemplates[id] = mod;
    
    appLogger.info(`✅ [builtInTemplates] Loaded: ${id}`);
  } catch (error) {
    appLogger.error(`❌ [builtInTemplates] Error loading ${path}:`, { data: [error] });
  }
}

/**
 * Retorna todos os templates built-in disponíveis
 * @returns Objeto com templates indexados por ID
 */
export function getBuiltInTemplates(): Record<string, BuiltTemplate> {
  return builtInTemplates;
}

/**
 * Retorna um template específico por ID
 * @param id - ID do template (nome do arquivo sem extensão)
 * @returns Template ou null se não encontrado
 */
export function getBuiltInTemplateById(id: string): BuiltTemplate | null {
  const template = builtInTemplates[id] ?? null;
  
  if (template) {
    appLogger.info(`✅ [builtInTemplates] Retrieved: ${id}`);
  } else {
    appLogger.warn(`⚠️ [builtInTemplates] Not found: ${id}`);
  }
  
  return template;
}

/**
 * Verifica se um template existe no sistema built-in
 * @param id - ID do template
 * @returns true se o template existe
 */
export function hasBuiltInTemplate(id: string): boolean {
  return id in builtInTemplates;
}

/**
 * Lista IDs de todos os templates built-in disponíveis
 * @returns Array com IDs dos templates
 */
export function listBuiltInTemplateIds(): string[] {
  return Object.keys(builtInTemplates);
}

// Log de inicialização
appLogger.info(`🏗️ [builtInTemplates] Initialized with ${Object.keys(builtInTemplates).length} templates:`, { data: [listBuiltInTemplateIds()] });
