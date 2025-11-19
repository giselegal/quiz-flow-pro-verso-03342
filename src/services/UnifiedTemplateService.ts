// Minimal stub for UnifiedTemplateService used during incremental type-check fixes.
// This file implements a tiny surface compatible with calls made by the editor.

export const UnifiedTemplateService = {
  async getStep(stepId: string, templateId?: string, opts?: any) {
    return { success: true, data: [] as any[], error: null };
  },
  steps: {
    async list(opts?: any) {
      return { success: true, data: [] as any[] };
    }
  },
  async prepareTemplate(tid?: string) {
    return { success: true } as any;
  },
  setActiveFunnel: (f?: string | null) => undefined,
  setActiveTemplate: (t?: string, total?: number) => undefined,
  invalidateTemplate: (stepKey?: string) => undefined,
  getTemplateMetadata: async (tid?: string) => ({ success: true, data: null }),
};

export const templateService = UnifiedTemplateService;
export default UnifiedTemplateService;
