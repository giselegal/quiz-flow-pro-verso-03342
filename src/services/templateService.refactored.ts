/**
 * 🎯 TEMPLATE SERVICE - Integração Real com Templates
 * 
 * Service para gerenciar templates de quiz/funnel:
 * - Buscar templates disponíveis
 * - Buscar steps específicos
 * - Clonar templates para edição
 * - Validar integridade de templates
 * 
 * SPRINT 2 - Implementação com cache e validação
 */

import { v4 as uuidv4 } from 'uuid'; // 🆕 G36 FIX: Import UUID
import type { EditorStep } from '@/contexts/store/editorStore';
import type { Block } from '@/types/editor';

// ============================================================================
// TYPES
// ============================================================================

export interface Template {
  id: string;
  name: string;
  description?: string;
  category: string;
  steps: EditorStep[];
  metadata: {
    totalSteps: number;
    version: string;
    author?: string;
    tags?: string[];
  };
}

export interface TemplateStep {
  stepNumber: number;
  template: EditorStep;
}

// ============================================================================
// CACHE
// ============================================================================

class TemplateCache {
  private cache = new Map<string, Template>();
  private stepCache = new Map<string, EditorStep>();
  private ttl = 5 * 60 * 1000; // 5 minutos

  set(key: string, value: Template | EditorStep): void {
    if ('steps' in value) {
      this.cache.set(key, value as Template);
    } else {
      this.stepCache.set(key, value as EditorStep);
    }

    // Auto-cleanup após TTL
    setTimeout(() => {
      this.cache.delete(key);
      this.stepCache.delete(key);
    }, this.ttl);
  }

  get(key: string): Template | EditorStep | undefined {
    return this.cache.get(key) || this.stepCache.get(key);
  }

  clear(): void {
    this.cache.clear();
    this.stepCache.clear();
  }
}

// ============================================================================
// SERVICE
// ============================================================================

class TemplateServiceRefactored {
  private cache = new TemplateCache();

  /**
   * Buscar template completo por ID
   */
  async getTemplate(templateId: string): Promise<Template | null> {
    // Verificar cache
    const cached = this.cache.get(templateId);
    if (cached && 'steps' in cached) {
      return cached;
    }

    try {
      // Carregar template (atualmente hardcoded, pode ser migrado para Supabase)
      const template = await this.loadTemplateFromSource(templateId);
      
      if (template) {
        this.cache.set(templateId, template);
      }

      return template;
    } catch (error) {
      console.error('Error loading template:', error);
      return null;
    }
  }

  /**
   * Buscar step específico de um template
   */
  async getStep(templateId: string, stepNumber: number): Promise<EditorStep | null> {
    const cacheKey = `${templateId}-step-${stepNumber}`;
    
    // Verificar cache
    const cached = this.cache.get(cacheKey);
    if (cached && !('steps' in cached)) {
      return cached;
    }

    try {
      // Carregar template completo
      const template = await this.getTemplate(templateId);
      if (!template) return null;

      // Encontrar step
      const step = template.steps.find((s) => s.order === stepNumber - 1);
      if (!step) return null;

      this.cache.set(cacheKey, step);
      return step;
    } catch (error) {
      console.error('Error loading step:', error);
      return null;
    }
  }

  /**
   * Clonar template para edição
   */
  cloneTemplate(template: Template, newName?: string): Template {
    return {
      ...template,
      id: `clone-${uuidv4()}`, // 🆕 G36 FIX: UUID ao invés de Date.now()
      name: newName || `${template.name} (Cópia)`,
      steps: template.steps.map((step) => this.cloneStep(step)),
    };
  }

  /**
   * Clonar step individual
   */
  private cloneStep(step: EditorStep): EditorStep {
    return {
      ...step,
      id: `step-${uuidv4()}`, // 🆕 G36 FIX: UUID ao invés de Date.now()
      blocks: step.blocks.map((block) => this.cloneBlock(block)),
    };
  }

  /**
   * Clonar bloco
   */
  private cloneBlock(block: Block): Block {
    return {
      ...block,
      id: `block-${uuidv4()}`, // 🆕 G36 FIX: UUID ao invés de Date.now()
    };
  }

  /**
   * Validar integridade do template
   */
  validateTemplate(template: Template): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Validar estrutura básica
    if (!template.id) errors.push('Template ID is required');
    if (!template.name) errors.push('Template name is required');
    if (!template.steps || template.steps.length === 0) {
      errors.push('Template must have at least one step');
    }

    // Validar steps
    if (template.steps) {
      template.steps.forEach((step, index) => {
        if (!step.id) errors.push(`Step ${index + 1}: ID is required`);
        if (!step.name) errors.push(`Step ${index + 1}: Name is required`);
        if (step.order !== index) {
          errors.push(`Step ${index + 1}: Order mismatch (expected ${index}, got ${step.order})`);
        }

        // Validar blocos do step
        if (!step.blocks || step.blocks.length === 0) {
          errors.push(`Step ${index + 1}: Must have at least one block`);
        }

        step.blocks?.forEach((block, blockIndex) => {
          if (!block.id) {
            errors.push(`Step ${index + 1}, Block ${blockIndex + 1}: ID is required`);
          }
          if (!block.type) {
            errors.push(`Step ${index + 1}, Block ${blockIndex + 1}: Type is required`);
          }
        });
      });
    }

    // Validar metadata
    if (template.metadata) {
      if (template.metadata.totalSteps !== template.steps.length) {
        errors.push(
          `Metadata totalSteps (${template.metadata.totalSteps}) doesn't match actual steps (${template.steps.length})`,
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Listar todos os templates disponíveis
   */
  async listTemplates(): Promise<Template[]> {
    try {
      // Atualmente retorna templates hardcoded
      // Pode ser migrado para buscar de Supabase no futuro
      const templateIds = ['quiz-21-steps', 'quiz-basic', 'quiz-advanced'];
      
      const templates = await Promise.all(
        templateIds.map((id) => this.getTemplate(id)),
      );

      return templates.filter((t): t is Template => t !== null);
    } catch (error) {
      console.error('Error listing templates:', error);
      return [];
    }
  }

  /**
   * Criar template customizado
   */
  createCustomTemplate(data: {
    name: string;
    description?: string;
    category: string;
    steps: EditorStep[];
  }): Template {
    const template: Template = {
      id: `custom-${uuidv4()}`, // 🆕 G36 FIX: UUID ao invés de Date.now()
      name: data.name,
      description: data.description,
      category: data.category,
      steps: data.steps,
      metadata: {
        totalSteps: data.steps.length,
        version: '1.0.0',
        author: 'custom',
        tags: ['custom'],
      },
    };

    // Validar antes de retornar
    const validation = this.validateTemplate(template);
    if (!validation.isValid) {
      console.warn('Custom template has validation errors:', validation.errors);
    }

    return template;
  }

  /**
   * Limpar cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  // ============================================================================
  // PRIVATE HELPERS
  // ============================================================================

  /**
   * Carregar template de fonte de dados
   * TODO: Migrar para Supabase quando houver tabela de templates
   */
  private async loadTemplateFromSource(templateId: string): Promise<Template | null> {
    // Atualmente retorna templates hardcoded
    // No futuro, pode buscar de Supabase ou arquivos estáticos
    
    try {
      // Simular delay de rede
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Retornar template básico como exemplo
      const baseTemplate: Template = {
        id: templateId,
        name: `Template ${templateId}`,
        description: `Template de exemplo para ${templateId}`,
        category: 'quiz',
        steps: this.generateDefaultSteps(21),
        metadata: {
          totalSteps: 21,
          version: '1.0.0',
          author: 'system',
          tags: ['default', 'quiz'],
        },
      };

      return baseTemplate;
    } catch (error) {
      console.error('Error loading template from source:', error);
      return null;
    }
  }

  /**
   * Gerar steps padrão para template
   */
  private generateDefaultSteps(count: number): EditorStep[] {
    return Array.from({ length: count }, (_, i) => ({
      id: `step-${i + 1}`,
      order: i,
      name: `Step ${i + 1}`,
      description: `Descrição do step ${i + 1}`,
      blocks: [],
    }));
  }
}

// ============================================================================
// EXPORT
// ============================================================================

export const templateService = new TemplateServiceRefactored();
export default templateService;
