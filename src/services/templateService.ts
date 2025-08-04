// Simplified Template Service
// Placeholder service to avoid complex type issues

export interface TemplateData {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  blocks: any[];
}

export const templateService = {
  async getTemplates(): Promise<TemplateData[]> {
    console.log("Would get templates");
    return [];
  },

  async getTemplate(id: string): Promise<TemplateData | null> {
    console.log("Would get template:", id);
    return null;
  },

  async searchTemplates(query: string): Promise<TemplateData[]> {
    console.log("Would search templates:", query);
    return [];
  },
};

export default templateService;
