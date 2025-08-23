/**
 * 🎯 TEMPLATE ADAPTER - INTEGRAÇÃO COM TEMPLATES EXISTENTES
 *
 * Este arquivo contém as funções necessárias para converter templates
 * do formato antigo para o formato do sistema unificado.
 */

import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import { Block, BlockType, EditorState, LegacyTemplateBlock, TemplateAdapter } from './types';

/**
 * Implementação padrão do adaptador de templates
 */
export class DefaultTemplateAdapter implements TemplateAdapter {
  /**
   * Converte um template do formato legacy para o formato do sistema unificado
   */
  convertToUnifiedFormat(
    legacyTemplate: Record<string, LegacyTemplateBlock[]>
  ): Record<string, Block[]> {
    const result: Record<string, Block[]> = {};

    // Processa cada etapa do template
    Object.entries(legacyTemplate).forEach(([stepKey, blocks]) => {
      // Converte a chave de etapa para o formato esperado pelo sistema unificado
      // Ex: "step-1" => "step_1"
      const unifiedStepKey = stepKey.replace('-', '_');

      // Converte cada bloco para o formato unificado
      result[unifiedStepKey] = blocks.map(legacyBlock =>
        this.convertBlockToUnifiedFormat(legacyBlock)
      );
    });

    return result;
  }

  /**
   * Converte um template do formato unificado para o formato legacy
   */
  convertFromUnifiedFormat(
    unifiedTemplate: Record<string, Block[]>
  ): Record<string, LegacyTemplateBlock[]> {
    const result: Record<string, LegacyTemplateBlock[]> = {};

    // Processa cada etapa do template
    Object.entries(unifiedTemplate).forEach(([stepKey, blocks]) => {
      // Converte a chave de etapa para o formato legacy
      // Ex: "step_1" => "step-1"
      const legacyStepKey = stepKey.replace('_', '-');

      // Converte cada bloco para o formato legacy
      result[legacyStepKey] = blocks.map(block => this.convertBlockToLegacyFormat(block));
    });

    return result;
  }

  /**
   * Converte um bloco do formato legacy para o formato unificado
   */
  private convertBlockToUnifiedFormat(legacyBlock: LegacyTemplateBlock): Block {
    return {
      id: legacyBlock.id,
      type: this.mapBlockType(legacyBlock.type),
      order: legacyBlock.order,
      properties: {
        ...legacyBlock.properties,
        ...this.extractPropertiesFromContent(legacyBlock.content),
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
      },
    };
  }

  /**
   * Converte um bloco do formato unificado para o formato legacy
   */
  private convertBlockToLegacyFormat(block: Block): LegacyTemplateBlock {
    // Separa as propriedades que vão para "content" das que ficam em "properties"
    const { content, restProperties } = this.extractContentFromProperties(block.properties);

    return {
      id: block.id,
      type: this.mapBlockTypeToLegacy(block.type),
      order: block.order,
      content,
      properties: restProperties,
    };
  }

  /**
   * Mapeia tipos de blocos legacy para tipos de blocos unificados
   */
  private mapBlockType(legacyType: string): BlockType {
    // Mapeamento de tipos de blocos
    const typeMapping: Record<string, BlockType> = {
      'quiz-intro-header': 'section',
      'form-container': 'input',
      text: 'text',
      'options-grid': 'quiz-question',
      image: 'image',
      button: 'button',
      'result-display': 'result-display',
      // Adicione mais mapeamentos conforme necessário
    };

    return typeMapping[legacyType] || 'section'; // 'section' como fallback seguro
  }

  /**
   * Mapeia tipos de blocos unificados para tipos de blocos legacy
   */
  private mapBlockTypeToLegacy(unifiedType: BlockType): string {
    // Mapeamento inverso de tipos de blocos
    const reverseTypeMapping: Record<string, string> = {
      section: 'quiz-intro-header',
      input: 'form-container',
      text: 'text',
      'quiz-question': 'options-grid',
      image: 'image',
      button: 'button',
      'result-display': 'result-display',
      // Adicione mais mapeamentos conforme necessário
    };

    return reverseTypeMapping[unifiedType] || 'quiz-intro-header';
  }

  /**
   * Extrai propriedades do objeto "content" legacy e as formata para o sistema unificado
   */
  private extractPropertiesFromContent(content: any): Record<string, any> {
    if (!content) return {};

    // Algumas propriedades comuns que precisam ser movidas de "content" para "properties"
    const propertiesToExtract = [
      'title',
      'subtitle',
      'description',
      'text',
      'question',
      'options',
      'placeholder',
      'buttonText',
      'backgroundColor',
      'textColor',
      'showLogo',
      'showProgress',
    ];

    const result: Record<string, any> = {};

    // Extrai as propriedades do objeto content
    Object.entries(content).forEach(([key, value]) => {
      if (propertiesToExtract.includes(key)) {
        result[key] = value;
      }
    });

    return result;
  }

  /**
   * Separa propriedades em "content" e "properties" para o formato legacy
   */
  private extractContentFromProperties(properties: Record<string, any>): {
    content: Record<string, any>;
    restProperties: Record<string, any>;
  } {
    // Propriedades que devem ir para "content" no formato legacy
    const contentProperties = [
      'title',
      'subtitle',
      'description',
      'text',
      'question',
      'options',
      'placeholder',
      'buttonText',
      'backgroundColor',
      'textColor',
      'showLogo',
      'showProgress',
    ];

    const content: Record<string, any> = {};
    const restProperties: Record<string, any> = {};

    // Separa as propriedades
    Object.entries(properties).forEach(([key, value]) => {
      if (contentProperties.includes(key)) {
        content[key] = value;
      } else {
        restProperties[key] = value;
      }
    });

    return { content, restProperties };
  }
}

/**
 * Função auxiliar para carregar o template de 21 etapas no formato do sistema unificado
 */
export function load21StepsTemplate(): EditorState {
  const adapter = new DefaultTemplateAdapter();
  const unifiedBlocks = adapter.convertToUnifiedFormat(QUIZ_STYLE_21_STEPS_TEMPLATE);

  return {
    currentStep: 1,
    selectedBlockId: null,
    blocks: unifiedBlocks,
    mode: 'edit',
    isLoading: false,
    hasUnsavedChanges: false,
    lastSaved: new Date(),
  };
}

export default {
  DefaultTemplateAdapter,
  load21StepsTemplate,
};
