export class TemplateRegistry {
  private static instance: TemplateRegistry | null = null;
  private store: Map<string, any> = new Map();

  static getInstance(): TemplateRegistry {
    if (!TemplateRegistry.instance) {
      TemplateRegistry.instance = new TemplateRegistry();
    }
    return TemplateRegistry.instance;
  }

  has(id: string): boolean {
    return this.store.has(id);
  }

  get(id: string): any | null {
    return this.store.get(id) ?? null;
  }

  registerOverride(id: string, template: any): void {
    this.store.set(id, template);
  }

  clear(): void {
    this.store.clear();
  }
}