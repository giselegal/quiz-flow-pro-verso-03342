// Util para clonar profundamente um template de funil garantindo novas referências
import { FunnelTemplate } from '@/config/funnelTemplates';

export interface ClonedFunnelInstance {
  id: string;
  templateSourceId: string;
  name: string;
  description?: string;
  blocks: Array<{
    id: string;
    type: string;
    properties: Record<string, any>;
  }>;
  createdAt: string;
}

const genId = () => `${Date.now()}_${Math.random().toString(36).slice(2,8)}`;

export function cloneFunnelTemplate(template: FunnelTemplate, customName?: string): ClonedFunnelInstance {
  return {
    id: `${template.id}-${genId()}`,
    templateSourceId: template.id,
    name: customName || template.name,
    description: template.description,
    blocks: template.blocks.map(b => ({
      id: genId(),
      type: b.type,
      // deep clone das propriedades
      properties: JSON.parse(JSON.stringify(b.properties || {}))
    })),
    createdAt: new Date().toISOString()
  };
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
