import type { TemplateV3 } from '@/types/template-v3.types';

// StepTemplate genérico: aceitamos TemplateV3 ou arrays/estruturas de blocks compatíveis
export type StepTemplate = TemplateV3 | any;

/**
 * TemplateRegistry - Registro singleton de templates por stepId
 */
export class TemplateRegistry {
  private static instance: TemplateRegistry | null = null;
  private templates = new Map<string, StepTemplate>();

  private constructor() {}

  static getInstance(): TemplateRegistry {
    if (!TemplateRegistry.instance) TemplateRegistry.instance = new TemplateRegistry();
    return TemplateRegistry.instance;
  }

  register(id: string, template: StepTemplate): void {
    this.templates.set(id, Object.freeze(template));
  }

  /**
   * Registra (ou sobrescreve) um template para um step específico a partir de uma fonte externa (ex.: JSON override)
   * Alias semântico para register(), mantido para clareza e futura telemetria.
   */
  registerOverride(id: string, template: StepTemplate): void {
    // Poderíamos anexar metadados de origem aqui, se necessário: (template as any)._source = 'override-json'
    this.register(id, template);
  }

  get(id: string): StepTemplate | null {
    return this.templates.get(id) ?? null;
  }

  has(id: string): boolean {
    return this.templates.has(id);
  }

  keys(): string[] {
    return Array.from(this.templates.keys());
  }

  /**
   * Limpa todos os templates registrados.
   * Útil para testes e resets.
   */
  clear(): void {
    this.templates.clear();
  }

  /**
   * Retorna a quantidade de templates registrados.
   */
  size(): number {
    return this.templates.size;
  }
}
