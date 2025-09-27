/**
 * 📄 DYNAMIC MASTER JSON GENERATOR
 * 
 * Sistema que gera JSON master baseado nas configurações da API,
 * substituindo arquivos estáticos por configurações dinâmicas
 */

import { ConfigurationAPI } from '@/services/ConfigurationAPI';
import { QUIZ_COMPONENTS_DEFINITIONS } from '@/types/componentConfiguration';

// ============================================================================
// INTERFACES
// ============================================================================

export interface DynamicMasterJSON {
  templateVersion: string;
  metadata: {
    id: string;
    name: string;
    description: string;
    version: string;
    generatedAt: string;
    source: 'dynamic-api';
    funnelId?: string;
  };
  
  globalConfig: {
    theme: Record<string, any>;
    behavior: Record<string, any>;
    navigation: Record<string, any>;
    validation: Record<string, any>;
    api: {
      baseUrl: string;
      endpoints: Record<string, string>;
      realTimeSync: boolean;
    };
  };
  
  steps: Record<string, DynamicStepTemplate>;
  components: Record<string, DynamicComponentConfig>;
}

export interface DynamicStepTemplate {
  metadata: {
    name: string;
    description: string;
    type: string;
    category: string;
    stepNumber: number;
  };
  
  behavior: {
    autoAdvance: boolean;
    autoAdvanceDelay: number;
    showProgress: boolean;
    allowBack: boolean;
  };
  
  validation: {
    type: string;
    required: boolean;
    requiredSelections?: number;
    maxSelections?: number;
    message: string;
  };
  
  blocks: DynamicBlockConfig[];
  apiConfig: {
    endpoint: string;
    syncRealTime: boolean;
    cacheEnabled: boolean;
  };
}

export interface DynamicBlockConfig {
  id: string;
  type: string;
  properties: Record<string, any>;
  apiEndpoint: string;
  lastModified?: string;
}

export interface DynamicComponentConfig {
  definition: any;
  defaultProperties: Record<string, any>;
  apiConfiguration: Record<string, any>;
  isActive: boolean;
}

// ============================================================================
// DYNAMIC MASTER JSON GENERATOR CLASS
// ============================================================================

export class DynamicMasterJSONGenerator {
  private static instance: DynamicMasterJSONGenerator;
  private configAPI: ConfigurationAPI;
  private cache = new Map<string, DynamicMasterJSON>();
  private cacheTimeout = 10 * 60 * 1000; // 10 minutos
  
  private constructor() {
    this.configAPI = ConfigurationAPI.getInstance();
  }
  
  static getInstance(): DynamicMasterJSONGenerator {
    if (!DynamicMasterJSONGenerator.instance) {
      DynamicMasterJSONGenerator.instance = new DynamicMasterJSONGenerator();
    }
    return DynamicMasterJSONGenerator.instance;
  }
  
  // ============================================================================
  // GENERATE MASTER JSON
  // ============================================================================
  
  async generateMasterJSON(funnelId?: string): Promise<DynamicMasterJSON> {
    try {
      console.log(`🏗️ Generating dynamic master JSON${funnelId ? ` for ${funnelId}` : ''}`);
      
      // Verificar cache
      const cacheKey = funnelId || 'default';
      if (this.cache.has(cacheKey)) {
        console.log(`💨 Using cached master JSON: ${cacheKey}`);
        return this.cache.get(cacheKey)!;
      }
      
      // Gerar configurações dinâmicas
      const [
        globalConfig,
        themeConfig,
        stepsConfig,
        componentsConfig
      ] = await Promise.all([
        this.generateGlobalConfig(funnelId),
        this.generateThemeConfig(funnelId),
        this.generateStepsConfig(funnelId),
        this.generateComponentsConfig(funnelId)
      ]);
      
      // Montar JSON master
      const masterJSON: DynamicMasterJSON = {
        templateVersion: '3.0.0-dynamic',
        metadata: {
          id: funnelId || 'default-quiz',
          name: 'Quiz de Estilo Pessoal - Dinâmico',
          description: 'Template dinâmico baseado em configurações API',
          version: '3.0.0',
          generatedAt: new Date().toISOString(),
          source: 'dynamic-api',
          funnelId
        },
        
        globalConfig: {
          theme: themeConfig,
          behavior: globalConfig.behavior,
          navigation: globalConfig.navigation,
          validation: globalConfig.validation,
          api: {
            baseUrl: process.env.API_BASE_URL || '/api',
            endpoints: this.generateAPIEndpoints(),
            realTimeSync: true
          }
        },
        
        steps: stepsConfig,
        components: componentsConfig
      };
      
      // Cachear resultado
      this.cache.set(cacheKey, masterJSON);
      setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);
      
      console.log(`✅ Master JSON generated successfully: ${Object.keys(masterJSON.steps).length} steps, ${Object.keys(masterJSON.components).length} components`);
      
      return masterJSON;
      
    } catch (error) {
      console.error('❌ Error generating master JSON:', error);
      throw error;
    }
  }
  
  // ============================================================================
  // GENERATE GLOBAL CONFIG
  // ============================================================================
  
  private async generateGlobalConfig(funnelId?: string): Promise<any> {
    try {
      const globalConfig = await this.configAPI.getConfiguration('quiz-global-config', funnelId);
      
      return {
        behavior: {
          autoAdvanceSteps: globalConfig.autoAdvanceSteps || [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          manualAdvanceSteps: globalConfig.manualAdvanceSteps || [1, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
          autoAdvanceDelay: globalConfig.autoAdvanceDelay || 1500,
          allowBackNavigation: globalConfig.allowBackNavigation !== false
        },
        
        navigation: {
          showProgress: globalConfig.showProgress !== false,
          showStepNumbers: globalConfig.showStepNumbers === true,
          progressStyle: globalConfig.progressStyle || 'bar',
          enableKeyboardNavigation: globalConfig.enableKeyboardNavigation === true
        },
        
        validation: {
          rules: {
            intro: { type: 'input', required: true, minLength: 2 },
            questions: { type: 'selection', required: true, requiredSelections: 3 },
            strategic: { type: 'selection', required: true, requiredSelections: 1 }
          },
          messages: globalConfig.validationMessages || {}
        }
      };
      
    } catch (error) {
      console.warn('⚠️ Using default global config:', error);
      return this.getDefaultGlobalConfig();
    }
  }
  
  // ============================================================================
  // GENERATE THEME CONFIG
  // ============================================================================
  
  private async generateThemeConfig(funnelId?: string): Promise<any> {
    try {
      const themeConfig = await this.configAPI.getConfiguration('quiz-theme-config', funnelId);
      
      return {
        colors: {
          primary: themeConfig.primaryColor || '#B89B7A',
          secondary: themeConfig.secondaryColor || '#432818',
          accent: themeConfig.accentColor || '#aa6b5d',
          background: themeConfig.backgroundColor || '#fefefe',
          text: themeConfig.textColor || '#5b4135',
          progress: themeConfig.progressColor || '#deac6d'
        },
        
        typography: {
          fontFamily: themeConfig.fontFamily || 'Inter, sans-serif',
          headingFont: themeConfig.headingFont || 'Playfair Display, serif',
          fontSize: themeConfig.fontSize || '16px',
          lineHeight: themeConfig.lineHeight || '1.6'
        },
        
        layout: {
          maxWidth: themeConfig.maxWidth || 'max-w-6xl',
          padding: themeConfig.padding || 'px-4 py-8',
          borderRadius: themeConfig.borderRadius || '8px',
          spacing: themeConfig.spacing || '8px'
        },
        
        animations: {
          transitionDuration: themeConfig.transitionDuration || '300ms',
          easing: themeConfig.easing || 'ease-in-out',
          enableAnimations: themeConfig.enableAnimations !== false
        }
      };
      
    } catch (error) {
      console.warn('⚠️ Using default theme config:', error);
      return this.getDefaultThemeConfig();
    }
  }
  
  // ============================================================================
  // GENERATE STEPS CONFIG
  // ============================================================================
  
  private async generateStepsConfig(funnelId?: string): Promise<Record<string, DynamicStepTemplate>> {
    const stepsConfig: Record<string, DynamicStepTemplate> = {};
    
    // Gerar configurações para todas as 21 etapas
    for (let stepNumber = 1; stepNumber <= 21; stepNumber++) {
      try {
        const stepId = `step-${stepNumber}`;
        const stepConfig = await this.configAPI.getConfiguration(`quiz-step-${stepNumber}`, funnelId);
        
        stepsConfig[stepId] = {
          metadata: {
            name: stepConfig.name || `Etapa ${stepNumber}`,
            description: stepConfig.description || `Configuração da etapa ${stepNumber}`,
            type: this.inferStepType(stepNumber),
            category: 'quiz',
            stepNumber
          },
          
          behavior: {
            autoAdvance: stepConfig.autoAdvance ?? this.getDefaultAutoAdvance(stepNumber),
            autoAdvanceDelay: stepConfig.autoAdvanceDelay || 1500,
            showProgress: stepConfig.showProgress ?? (stepNumber > 1),
            allowBack: stepConfig.allowBack ?? (stepNumber > 1 && stepNumber < 21)
          },
          
          validation: {
            type: this.getDefaultValidationType(stepNumber),
            required: stepConfig.required ?? true,
            requiredSelections: stepConfig.requiredSelections || this.getDefaultRequiredSelections(stepNumber),
            maxSelections: stepConfig.maxSelections || this.getDefaultRequiredSelections(stepNumber),
            message: stepConfig.validationMessage || this.getDefaultValidationMessage(stepNumber)
          },
          
          blocks: await this.generateStepBlocks(stepNumber, stepConfig, funnelId),
          
          apiConfig: {
            endpoint: `/api/quiz-step-${stepNumber}/configuration`,
            syncRealTime: true,
            cacheEnabled: true
          }
        };
        
      } catch (error) {
        console.warn(`⚠️ Error generating config for step ${stepNumber}:`, error);
        // Usar configuração padrão
        stepsConfig[`step-${stepNumber}`] = this.getDefaultStepConfig(stepNumber);
      }
    }
    
    return stepsConfig;
  }
  
  // ============================================================================
  // GENERATE STEP BLOCKS
  // ============================================================================
  
  private async generateStepBlocks(
    stepNumber: number, 
    stepConfig: any, 
    funnelId?: string
  ): Promise<DynamicBlockConfig[]> {
    
    const blocks: DynamicBlockConfig[] = [];
    
    // Blocos baseados no tipo de etapa
    const stepType = this.inferStepType(stepNumber);
    
    switch (stepType) {
      case 'intro':
        blocks.push({
          id: 'intro-header',
          type: 'quiz-intro-header',
          properties: await this.configAPI.getConfiguration('quiz-intro-header', funnelId),
          apiEndpoint: '/api/components/quiz-intro-header/configuration'
        });
        break;
        
      case 'question':
        blocks.push({
          id: 'options-grid',
          type: 'quiz-options-grid-connected',
          properties: await this.configAPI.getConfiguration('quiz-options-grid', funnelId),
          apiEndpoint: '/api/components/quiz-options-grid/configuration'
        });
        break;
        
      case 'strategic':
        blocks.push({
          id: 'strategic-options',
          type: 'quiz-strategic-options',
          properties: await this.configAPI.getConfiguration('quiz-strategic-options', funnelId),
          apiEndpoint: '/api/components/quiz-strategic-options/configuration'
        });
        break;
        
      default:
        // Outros tipos de etapa
        break;
    }
    
    return blocks;
  }
  
  // ============================================================================
  // GENERATE COMPONENTS CONFIG
  // ============================================================================
  
  private async generateComponentsConfig(funnelId?: string): Promise<Record<string, DynamicComponentConfig>> {
    const componentsConfig: Record<string, DynamicComponentConfig> = {};
    
    // Iterar sobre todos os componentes definidos
    for (const [componentId, definition] of Object.entries(QUIZ_COMPONENTS_DEFINITIONS)) {
      try {
        const apiConfiguration = await this.configAPI.getConfiguration(componentId, funnelId);
        
        componentsConfig[componentId] = {
          definition,
          defaultProperties: definition.defaultProperties,
          apiConfiguration,
          isActive: true
        };
        
      } catch (error) {
        console.warn(`⚠️ No API config found for ${componentId}, using defaults`);
        componentsConfig[componentId] = {
          definition,
          defaultProperties: definition.defaultProperties,
          apiConfiguration: {},
          isActive: false
        };
      }
    }
    
    return componentsConfig;
  }
  
  // ============================================================================
  // HELPER METHODS
  // ============================================================================
  
  private generateAPIEndpoints(): Record<string, string> {
    return {
      configurations: '/api/components/{componentId}/configuration',
      properties: '/api/components/{componentId}/properties/{propertyKey}',
      definitions: '/api/components/{componentId}/definition',
      stats: '/api/configurations/stats',
      export: '/api/configurations/export',
      import: '/api/configurations/import',
      reset: '/api/components/{componentId}/reset'
    };
  }
  
  private inferStepType(stepNumber: number): string {
    if (stepNumber === 1) return 'intro';
    if (stepNumber >= 2 && stepNumber <= 11) return 'question';
    if (stepNumber === 12 || stepNumber === 19) return 'transition';
    if (stepNumber >= 13 && stepNumber <= 18) return 'strategic';
    if (stepNumber === 20) return 'result';
    if (stepNumber === 21) return 'offer';
    return 'other';
  }
  
  private getDefaultAutoAdvance(stepNumber: number): boolean {
    return stepNumber >= 2 && stepNumber <= 11;
  }
  
  private getDefaultValidationType(stepNumber: number): string {
    if (stepNumber === 1) return 'input';
    if (stepNumber >= 2 && stepNumber <= 18) return 'selection';
    return 'none';
  }
  
  private getDefaultRequiredSelections(stepNumber: number): number {
    if (stepNumber >= 2 && stepNumber <= 11) return 3;
    if (stepNumber >= 13 && stepNumber <= 18) return 1;
    return 0;
  }
  
  private getDefaultValidationMessage(stepNumber: number): string {
    if (stepNumber === 1) return 'Digite seu nome para continuar';
    if (stepNumber >= 2 && stepNumber <= 11) return 'Selecione 3 opções para continuar';
    if (stepNumber >= 13 && stepNumber <= 18) return 'Selecione uma opção para continuar';
    return 'Clique em "Continuar" para prosseguir';
  }
  
  private getDefaultGlobalConfig(): any {
    return {
      behavior: {
        autoAdvanceSteps: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        manualAdvanceSteps: [1, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
        autoAdvanceDelay: 1500,
        allowBackNavigation: true
      },
      navigation: {
        showProgress: true,
        progressStyle: 'bar'
      },
      validation: {
        rules: {},
        messages: {}
      }
    };
  }
  
  private getDefaultThemeConfig(): any {
    return {
      colors: {
        primary: '#B89B7A',
        secondary: '#432818',
        background: '#fefefe',
        text: '#5b4135',
        progress: '#deac6d'
      },
      typography: {
        fontFamily: 'Inter, sans-serif'
      },
      layout: {
        maxWidth: 'max-w-6xl',
        padding: 'px-4 py-8'
      }
    };
  }
  
  private getDefaultStepConfig(stepNumber: number): DynamicStepTemplate {
    return {
      metadata: {
        name: `Etapa ${stepNumber}`,
        description: `Configuração padrão da etapa ${stepNumber}`,
        type: this.inferStepType(stepNumber),
        category: 'quiz',
        stepNumber
      },
      behavior: {
        autoAdvance: this.getDefaultAutoAdvance(stepNumber),
        autoAdvanceDelay: 1500,
        showProgress: stepNumber > 1,
        allowBack: stepNumber > 1 && stepNumber < 21
      },
      validation: {
        type: this.getDefaultValidationType(stepNumber),
        required: true,
        requiredSelections: this.getDefaultRequiredSelections(stepNumber),
        message: this.getDefaultValidationMessage(stepNumber)
      },
      blocks: [],
      apiConfig: {
        endpoint: `/api/quiz-step-${stepNumber}/configuration`,
        syncRealTime: true,
        cacheEnabled: true
      }
    };
  }
  
  // ============================================================================
  // PUBLIC METHODS
  // ============================================================================
  
  /**
   * Gerar e salvar JSON master como arquivo
   */
  async generateAndSaveJSON(funnelId?: string, outputPath?: string): Promise<string> {
    const masterJSON = await this.generateMasterJSON(funnelId);
    const jsonString = JSON.stringify(masterJSON, null, 2);
    
    if (outputPath) {
      // Salvar em arquivo (Node.js environment)
      const fs = await import('fs');
      fs.writeFileSync(outputPath, jsonString);
      console.log(`💾 Master JSON saved to: ${outputPath}`);
    }
    
    return jsonString;
  }
  
  /**
   * Atualizar cache quando configurações mudarem
   */
  invalidateCache(funnelId?: string): void {
    const cacheKey = funnelId || 'default';
    this.cache.delete(cacheKey);
    console.log(`🗑️ Cache invalidated: ${cacheKey}`);
  }
  
  /**
   * Obter estatísticas do gerador
   */
  getStats(): { cacheSize: number; lastGenerated: Date | null } {
    return {
      cacheSize: this.cache.size,
      lastGenerated: null // TODO: Implementar tracking
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default DynamicMasterJSONGenerator;

// Instância singleton
export const dynamicMasterJSON = DynamicMasterJSONGenerator.getInstance();