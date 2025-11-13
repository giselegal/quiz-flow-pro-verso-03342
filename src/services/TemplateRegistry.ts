/**
 * ⚠️ COMPATIBILITY SHIM - DO NOT USE IN NEW CODE
 * 
 * @deprecated ARCHIVED - Original implementation moved to .archive/deprecated/services-legacy/
 * @see .archive/deprecated/services-legacy/TemplateRegistry.ts
 * 
 * Migration path: Use @/services/canonical/TemplateService or templateService instead
 */

/**
 * Stub class for backward compatibility
 * @deprecated Use templateService from @/services/canonical/TemplateService
 */
export class TemplateRegistry {
  private static instance: TemplateRegistry;

  constructor() {
    console.warn('⚠️ TemplateRegistry is deprecated and has been archived. Use @/services/canonical/TemplateService instead.');
  }

  static getInstance(): TemplateRegistry {
    if (!TemplateRegistry.instance) {
      TemplateRegistry.instance = new TemplateRegistry();
    }
    return TemplateRegistry.instance;
  }

  // Add any methods that might be called to prevent runtime errors
  getTemplate() {
    throw new Error('TemplateRegistry has been archived. Use @/services/canonical/TemplateService instead.');
  }
  
  registerTemplate() {
    throw new Error('TemplateRegistry has been archived. Use @/services/canonical/TemplateService instead.');
  }

  register() {
    throw new Error('TemplateRegistry has been archived. Use @/services/canonical/TemplateService instead.');
  }

  get() {
    throw new Error('TemplateRegistry has been archived. Use @/services/canonical/TemplateService instead.');
  }

  has() {
    throw new Error('TemplateRegistry has been archived. Use @/services/canonical/TemplateService instead.');
  }

  registerOverride(...args: any[]) {
    throw new Error('TemplateRegistry has been archived. Use @/services/canonical/TemplateService instead.');
  }
}

export default TemplateRegistry;
