import type { Block, BlockType } from '../types/editor';

export interface TemplateData {
  blocks: Block[];
  templateVersion: string;
}

export interface StepLoadResult {
  blocks: Block[];
  step: number;
  metadata: {
    name: string;
    description: string;
    step: number;
    category: string;
    tags: string[];
    version: string;
    createdAt: string;
    updatedAt: string;
  };
}

function getFallbackBlocksForStep(step: number): Block[] {
  const baseId = `step-${step}`;
  
  return [
    {
      id: `${baseId}-header`,
      type: 'header' as BlockType,
      content: { text: `Etapa ${step}`, level: 1, alignment: 'center', color: '#432818' },
      order: 0,
      properties: { text: `Etapa ${step}`, level: 1, alignment: 'center', color: '#432818' },
    },
    {
      id: `${baseId}-text`,
      type: 'text' as BlockType,
      content: { text: `Conteúdo da etapa ${step}`, alignment: 'left', fontSize: 16, color: '#666666' },
      order: 1,
      properties: { text: `Conteúdo da etapa ${step}`, alignment: 'left', fontSize: 16, color: '#666666' },
    },
    {
      id: `${baseId}-input`,
      type: 'input' as BlockType,
      content: { placeholder: 'Digite sua resposta...', required: true, fieldType: 'text' },
      order: 2,
      properties: { placeholder: 'Digite sua resposta...', required: true, fieldType: 'text' },
    },
    {
      id: `${baseId}-button`,
      type: 'button' as BlockType,
      content: { text: 'Continuar', style: 'primary', fullWidth: true, backgroundColor: '#B89B7A', textColor: '#FFFFFF' },
      order: 3,
      properties: { text: 'Continuar', style: 'primary', fullWidth: true, backgroundColor: '#B89B7A', textColor: '#FFFFFF' },
    },
  ];
}

const templateService = {
  async getTemplates(): Promise<TemplateData[]> { return []; },
  async getTemplate(_id: string): Promise<TemplateData | null> { return null; },
  async searchTemplates(_query: string): Promise<TemplateData[]> { return []; },
  async getTemplateByStep(_step: number): Promise<TemplateData | null> { return null; },
  convertTemplateBlocksToEditorBlocks(): Block[] { return []; },
};

export async function loadStepTemplate(step: number): Promise<StepLoadResult | null> {
  if (step < 1 || step > 21) return null;

  const fallbackBlocks = getFallbackBlocksForStep(step);
  return {
    blocks: fallbackBlocks,
    step,
    metadata: {
      name: `Etapa ${step}`,
      description: `Template padrão para etapa ${step}`,
      step,
      category: 'default',
      tags: ['fallback'],
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
}

export default templateService;
