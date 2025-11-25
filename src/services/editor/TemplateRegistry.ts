/**
 * Minimal TemplateRegistry stub
 * Satisfies code that expects `TemplateRegistry.getInstance()` during typecheck.
 * This is intentionally small and can be replaced by the real implementation later.
 */
export class TemplateRegistry {
  private static _instance: TemplateRegistry | null = null;

  static getInstance(): TemplateRegistry {
    if (!TemplateRegistry._instance) TemplateRegistry._instance = new TemplateRegistry();
    return TemplateRegistry._instance;
  }

  // Example methods used by TemplateLoader — provide safe no-op defaults
  getTemplateById(id: string): any | null {
    return null;
  }

  registerTemplate(template: any): void {
    // no-op stub
  }

  // Methods expected by TemplateLoader
  has(id: string): boolean {
    return false;
  }

  get(id: string): any | null {
    return null;
  }
}

export default TemplateRegistry;
