import { Block } from '@/types/editor';

/**
 * Template Block Converter - Converte templates TSX para blocos JSON editáveis
 *
 * Este utilitário resolve a incompatibilidade entre:
 * - Templates TSX que retornam arrays de objetos
 * - Editor que espera blocos JSON editáveis
 */
export class TemplateBlockConverter {
  /**
   * Converte um template TSX para blocos editáveis
   */
  static convertTsxTemplateToBlocks(templateBlocks: any[]): Block[] {
    if (!Array.isArray(templateBlocks)) {
      console.warn('Template não é array:', templateBlocks);
      return [];
    }

    return templateBlocks.map((block, index) => {
      // Se já é um Block válido, retorna como está
      if (this.isValidBlock(block)) {
        return block as Block;
      }

      // Converte objetos TSX para formato Block
      return {
        id: String(block.id || `converted-${index}`),
        type: String(block.type || 'text-inline') as any,
        content: {
          ...block.properties,
          ...block.content,
        },
        order: block.position || block.order || index,
        properties: block.properties || {},
      } as Block;
    });
  }

  /**
   * Verifica se um objeto é um Block válido
   */
  private static isValidBlock(obj: any): boolean {
    return (
      obj &&
      typeof obj.id === 'string' &&
      typeof obj.type === 'string' &&
      typeof obj.order === 'number'
    );
  }

  /**
   * Normaliza propriedades de blocos para compatibilidade
   */
  static normalizeBlockProperties(block: any): Block {
    const normalized: Block = {
      id: String(block.id || `block-${Date.now()}`),
      type: String(block.type || 'text-inline') as any,
      content: {},
      order: block.order || block.position || 0,
      properties: {},
    };

    // Mesclar properties e content
    if (block.properties) {
      normalized.content = { ...normalized.content, ...block.properties };
      normalized.properties = { ...normalized.properties, ...block.properties };
    }

    if (block.content) {
      normalized.content = { ...normalized.content, ...block.content };
    }

    return normalized;
  }

  /**
   * Converte um único template de etapa para blocos
   */
  static async convertStepTemplate(
    stepNumber: number,
    templateFunction?: (userData?: any) => any[],
    userData?: any
  ): Promise<Block[]> {
    if (!templateFunction) {
      console.warn(`Template function não encontrada para etapa ${stepNumber}`);
      return this.generateFallbackBlocks(stepNumber);
    }

    try {
      const templateResult = templateFunction(userData);

      if (!Array.isArray(templateResult)) {
        console.warn(`Template da etapa ${stepNumber} não retornou array:`, templateResult);
        return this.generateFallbackBlocks(stepNumber);
      }

      return this.convertTsxTemplateToBlocks(templateResult);
    } catch (error) {
      console.error(`Erro ao converter template da etapa ${stepNumber}:`, error);
      return this.generateFallbackBlocks(stepNumber);
    }
  }

  /**
   * Gera blocos de fallback para uma etapa
   */
  private static generateFallbackBlocks(stepNumber: number): Block[] {
    return [
      {
        id: `step${stepNumber}-fallback-header`,
        type: 'quiz-intro-header' as any,
        content: {
          logoUrl:
            'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
          logoAlt: 'Logo Gisele Galvão',
          logoWidth: '96',
          logoHeight: '96',
          progressValue: (stepNumber / 21) * 100,
          progressTotal: 100,
          showProgress: true,
        },
        order: 0,
        properties: {
          logoUrl:
            'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
          progressValue: (stepNumber / 21) * 100,
        },
      },
      {
        id: `step${stepNumber}-fallback-title`,
        type: 'text-inline' as any,
        content: {
          content: `ETAPA ${stepNumber}`,
          fontSize: 'text-2xl',
          fontWeight: 'font-bold',
          textAlign: 'text-center',
          color: '#432818',
        },
        order: 1,
        properties: {
          content: `ETAPA ${stepNumber}`,
          fontSize: 'text-2xl',
          fontWeight: 'font-bold',
        },
      },
      {
        id: `step${stepNumber}-fallback-loading`,
        type: 'loading-animation' as any,
        content: {
          type: 'spinner',
          color: '#B89B7A',
          size: 'medium',
        },
        order: 2,
        properties: {
          type: 'spinner',
          color: '#B89B7A',
        },
      },
    ];
  }

  /**
   * Valida se os blocos estão prontos para o editor
   */
  static validateBlocks(blocks: Block[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!Array.isArray(blocks)) {
      errors.push('Blocks deve ser um array');
      return { valid: false, errors };
    }

    blocks.forEach((block, index) => {
      if (!block.id) {
        errors.push(`Block ${index} não tem ID`);
      }
      if (!block.type) {
        errors.push(`Block ${index} não tem tipo`);
      }
      if (typeof block.order !== 'number') {
        errors.push(`Block ${index} não tem ordem numérica válida`);
      }
    });

    return { valid: errors.length === 0, errors };
  }
}
