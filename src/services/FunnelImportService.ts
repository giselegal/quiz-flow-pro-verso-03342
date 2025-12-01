/**
 * FunnelImportService - Service para importar funis em diversos formatos
 * 
 * Funcionalidades:
 * - Detecta formato automaticamente (ZIP modular, JSON completo, JSON step único)
 * - Converte entre formatos automaticamente
 * - Valida estrutura antes de importar
 * - Suporta merge com funil existente ou criar novo
 * 
 * @example
 * ```typescript
 * // Import automático (detecta formato)
 * const funnel = await FunnelImportService.import(file);
 * 
 * // Import de ZIP modular
 * const funnel = await FunnelImportService.importModularZip(file);
 * 
 * // Import de JSON completo (converte para modular)
 * const funnel = await FunnelImportService.importCompleteJson(file);
 * 
 * // Merge com funil existente
 * await FunnelImportService.merge('funnel-id', file, { replaceSteps: [1, 5, 10] });
 * ```
 */

import JSZip from 'jszip';
import { supabase } from '@/lib/supabase';

export interface ImportOptions {
  /**
   * Modo de importação
   * - create: Cria novo funil
   * - merge: Mescla com funil existente
   * - replace: Substitui funil existente
   */
  mode?: 'create' | 'merge' | 'replace';
  
  /**
   * ID do funil de destino (para merge/replace)
   */
  targetFunnelId?: string;
  
  /**
   * Steps específicos para substituir (em merge)
   */
  replaceSteps?: number[];
  
  /**
   * Validar estrutura antes de importar
   */
  validate?: boolean;
  
  /**
   * Preservar IDs originais
   */
  preserveIds?: boolean;
}

export interface ImportResult {
  /**
   * ID do funil criado/atualizado
   */
  funnelId: string;
  
  /**
   * Modo usado na importação
   */
  mode: 'create' | 'merge' | 'replace';
  
  /**
   * Estatísticas da importação
   */
  stats: {
    totalSteps: number;
    importedSteps: number;
    skippedSteps: number;
    format: 'modular-zip' | 'complete-json' | 'single-step';
  };
  
  /**
   * Avisos encontrados durante importação
   */
  warnings: string[];
}

export type DetectedFormat = 'modular-zip' | 'complete-json' | 'single-step' | 'unknown';

/**
 * Service de importação de funis
 */
export class FunnelImportService {
  /**
   * Importa funil detectando formato automaticamente
   */
  static async import(
    file: File,
    options: ImportOptions = {}
  ): Promise<ImportResult> {
    const { validate = true } = options;
    
    try {
      // 1. Detectar formato
      const format = await this.detectFormat(file);
      console.log('[FunnelImportService] Formato detectado:', format);
      
      // 2. Importar conforme formato
      switch (format) {
        case 'modular-zip':
          return await this.importModularZip(file, options);
        
        case 'complete-json':
          return await this.importCompleteJson(file, options);
        
        case 'single-step':
          return await this.importSingleStep(file, options);
        
        default:
          throw new Error('Formato de arquivo não suportado');
      }
      
    } catch (err) {
      console.error('[FunnelImportService] Erro ao importar:', err);
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`Falha ao importar funil: ${message}`);
    }
  }
  
  /**
   * Detecta formato do arquivo
   */
  static async detectFormat(file: File): Promise<DetectedFormat> {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    // ZIP = formato modular
    if (extension === 'zip') {
      return 'modular-zip';
    }
    
    // JSON = verificar estrutura
    if (extension === 'json') {
      try {
        const content = await file.text();
        const data = JSON.parse(content);
        
        // Tem propriedade "steps" como objeto = JSON completo
        if (data.steps && typeof data.steps === 'object' && !Array.isArray(data.steps)) {
          return 'complete-json';
        }
        
        // Tem propriedade "blocks" como array = step único
        if (data.blocks && Array.isArray(data.blocks)) {
          return 'single-step';
        }
      } catch (err) {
        console.warn('[FunnelImportService] Erro ao parsear JSON:', err);
      }
    }
    
    return 'unknown';
  }
  
  /**
   * Importa ZIP modular
   */
  static async importModularZip(
    file: File,
    options: ImportOptions = {}
  ): Promise<ImportResult> {
    const { mode = 'create', targetFunnelId, validate = true } = options;
    const warnings: string[] = [];
    
    try {
      // 1. Extrair ZIP
      const zip = await JSZip.loadAsync(file);
      
      // 2. Ler meta.json
      const metaFile = zip.file('meta.json');
      if (!metaFile) {
        throw new Error('meta.json não encontrado no ZIP');
      }
      
      const metaContent = await metaFile.async('string');
      const meta = JSON.parse(metaContent);
      
      // 3. Ler steps/
      const stepsFolder = zip.folder('steps');
      if (!stepsFolder) {
        throw new Error('Pasta steps/ não encontrada no ZIP');
      }
      
      const steps: Record<string, any> = {};
      let importedCount = 0;
      
      // Processar cada step
      const stepFiles = Object.keys(zip.files).filter(name => 
        name.startsWith('steps/') && name.endsWith('.json')
      );
      
      for (const fileName of stepFiles) {
        const stepFile = zip.file(fileName);
        if (!stepFile) continue;
        
        const stepContent = await stepFile.async('string');
        const stepData = JSON.parse(stepContent);
        
        // Validar step se solicitado
        if (validate) {
          const validationErrors = this.validateStep(stepData);
          if (validationErrors.length > 0) {
            warnings.push(`${fileName}: ${validationErrors.join(', ')}`);
            continue;
          }
        }
        
        // Extrair número do step
        const stepNumber = fileName.match(/step-(\d+)/)?.[1];
        if (!stepNumber) {
          warnings.push(`${fileName}: Nome de arquivo inválido`);
          continue;
        }
        
        const stepKey = `step-${stepNumber}`;
        steps[stepKey] = stepData;
        importedCount++;
      }
      
      if (importedCount === 0) {
        throw new Error('Nenhum step válido encontrado no ZIP');
      }
      
      // 4. Criar ou atualizar funil
      let funnelId: string;
      
      if (mode === 'create') {
        funnelId = await this.createFunnel(meta, steps);
      } else if (mode === 'merge' && targetFunnelId) {
        funnelId = await this.mergeFunnel(targetFunnelId, steps, options.replaceSteps);
      } else if (mode === 'replace' && targetFunnelId) {
        funnelId = await this.replaceFunnel(targetFunnelId, meta, steps);
      } else {
        throw new Error('Modo de importação inválido ou funnelId não fornecido');
      }
      
      return {
        funnelId,
        mode,
        stats: {
          totalSteps: stepFiles.length,
          importedSteps: importedCount,
          skippedSteps: stepFiles.length - importedCount,
          format: 'modular-zip'
        },
        warnings
      };
      
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`Erro ao importar ZIP modular: ${message}`);
    }
  }
  
  /**
   * Importa JSON completo e converte para modular
   */
  static async importCompleteJson(
    file: File,
    options: ImportOptions = {}
  ): Promise<ImportResult> {
    const { mode = 'create', targetFunnelId, validate = true } = options;
    const warnings: string[] = [];
    
    try {
      // 1. Ler JSON
      const content = await file.text();
      const data = JSON.parse(content);
      
      // 2. Validar estrutura
      if (!data.steps || typeof data.steps !== 'object') {
        throw new Error('JSON completo inválido: propriedade "steps" não encontrada');
      }
      
      // 3. Extrair metadados
      const meta = {
        funnel: {
          name: data.name || 'Funil Importado',
          description: data.description || '',
          template_id: data.templateId || data.template_id || null,
          created_from: 'import' as const,
          totalSteps: Object.keys(data.steps).length
        },
        globalConfig: {
          theme: data.metadata?.theme || data.theme || {},
          navigation: data.navigation || {},
          scoring: data.scoring || data.metadata?.scoringRules || {}
        }
      };
      
      // 4. Converter steps
      const steps: Record<string, any> = {};
      let importedCount = 0;
      
      for (const [stepKey, stepData] of Object.entries(data.steps)) {
        if (validate) {
          const validationErrors = this.validateStep(stepData);
          if (validationErrors.length > 0) {
            warnings.push(`${stepKey}: ${validationErrors.join(', ')}`);
            continue;
          }
        }
        
        steps[stepKey] = stepData;
        importedCount++;
      }
      
      // 5. Criar ou atualizar funil
      let funnelId: string;
      
      if (mode === 'create') {
        funnelId = await this.createFunnel(meta, steps);
      } else if (mode === 'merge' && targetFunnelId) {
        funnelId = await this.mergeFunnel(targetFunnelId, steps, options.replaceSteps);
      } else if (mode === 'replace' && targetFunnelId) {
        funnelId = await this.replaceFunnel(targetFunnelId, meta, steps);
      } else {
        throw new Error('Modo de importação inválido ou funnelId não fornecido');
      }
      
      return {
        funnelId,
        mode,
        stats: {
          totalSteps: Object.keys(data.steps).length,
          importedSteps: importedCount,
          skippedSteps: Object.keys(data.steps).length - importedCount,
          format: 'complete-json'
        },
        warnings
      };
      
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`Erro ao importar JSON completo: ${message}`);
    }
  }
  
  /**
   * Importa step único
   */
  static async importSingleStep(
    file: File,
    options: ImportOptions = {}
  ): Promise<ImportResult> {
    const { targetFunnelId } = options;
    
    if (!targetFunnelId) {
      throw new Error('targetFunnelId obrigatório para importar step único');
    }
    
    try {
      const content = await file.text();
      const stepData = JSON.parse(content);
      
      // Validar
      const errors = this.validateStep(stepData);
      if (errors.length > 0) {
        throw new Error(`Step inválido: ${errors.join(', ')}`);
      }
      
      // Determinar número do step
      const stepNumber = stepData.metadata?.id?.match(/\d+/)?.[0] || '01';
      const stepKey = `step-${stepNumber}`;
      
      // Merge no funil existente
      await this.mergeFunnel(targetFunnelId, { [stepKey]: stepData });
      
      return {
        funnelId: targetFunnelId,
        mode: 'merge',
        stats: {
          totalSteps: 1,
          importedSteps: 1,
          skippedSteps: 0,
          format: 'single-step'
        },
        warnings: []
      };
      
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`Erro ao importar step único: ${message}`);
    }
  }
  
  /**
   * Valida estrutura de um step
   */
  private static validateStep(stepData: any): string[] {
    const errors: string[] = [];
    
    if (!stepData.metadata) errors.push('Missing metadata');
    if (!stepData.blocks || !Array.isArray(stepData.blocks)) errors.push('Missing or invalid blocks');
    if (!stepData.templateVersion) errors.push('Missing templateVersion');
    
    return errors;
  }
  
  /**
   * Cria novo funil no banco
   */
  private static async createFunnel(meta: any, steps: Record<string, any>): Promise<string> {
    const { data, error } = await supabase
      .from('funnels')
      .insert({
        name: meta.funnel.name,
        description: meta.funnel.description,
        template_id: meta.funnel.template_id,
        is_template: false,
        settings: {
          created_from: 'import',
          totalSteps: Object.keys(steps).length,
          steps,
          ...meta.globalConfig
        }
      })
      .select('id')
      .single();
    
    if (error) throw error;
    return data.id;
  }
  
  /**
   * Faz merge com funil existente
   */
  private static async mergeFunnel(
    funnelId: string,
    newSteps: Record<string, any>,
    replaceSteps?: number[]
  ): Promise<string> {
    // Buscar funil atual
    const { data: funnel, error: fetchError } = await supabase
      .from('funnels')
      .select('settings')
      .eq('id', funnelId)
      .single();
    
    if (fetchError) throw fetchError;
    
    const currentSettings = funnel.settings || {};
    const currentSteps = currentSettings.steps || {};
    
    // Merge steps
    const mergedSteps = { ...currentSteps };
    
    for (const [stepKey, stepData] of Object.entries(newSteps)) {
      const stepNumber = parseInt(stepKey.match(/\d+/)?.[0] || '0');
      
      // Se replaceSteps especificado, verificar se deve substituir
      if (replaceSteps && replaceSteps.length > 0) {
        if (replaceSteps.includes(stepNumber)) {
          mergedSteps[stepKey] = stepData;
        }
      } else {
        // Sem filtro, merge tudo
        mergedSteps[stepKey] = stepData;
      }
    }
    
    // Atualizar funil
    const { error: updateError } = await supabase
      .from('funnels')
      .update({
        settings: {
          ...currentSettings,
          steps: mergedSteps,
          totalSteps: Object.keys(mergedSteps).length
        }
      })
      .eq('id', funnelId);
    
    if (updateError) throw updateError;
    return funnelId;
  }
  
  /**
   * Substitui funil completamente
   */
  private static async replaceFunnel(
    funnelId: string,
    meta: any,
    steps: Record<string, any>
  ): Promise<string> {
    const { error } = await supabase
      .from('funnels')
      .update({
        name: meta.funnel.name,
        description: meta.funnel.description,
        template_id: meta.funnel.template_id,
        settings: {
          created_from: 'import',
          totalSteps: Object.keys(steps).length,
          steps,
          ...meta.globalConfig
        }
      })
      .eq('id', funnelId);
    
    if (error) throw error;
    return funnelId;
  }
}

export default FunnelImportService;
