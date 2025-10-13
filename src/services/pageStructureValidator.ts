import { generateSemanticId } from '../utils/semanticIdGenerator';
// Simplified Page Structure Validator
// Placeholder service to avoid complex type issues

import { Block } from '@/types/editor';

interface Page {
  id: string;
  name: string;
  title: string;
  type: string;
  order: number;
  blocks: Block[];
  settings?: any;
}

interface Funnel {
  id: string;
  name: string;
  pages: Page[];
}

export interface PageValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  fixedPage?: Page;
}

export class PageStructureValidator {
  static validatePage(page: Page): PageValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!page.id) {
      errors.push('Página não possui ID válido');
    }

    if (!page.blocks || page.blocks.length === 0) {
      warnings.push('Página não possui blocos - aparecerá vazia no editor');
    }

    page.blocks?.forEach((block: any, index: number) => {
      const blockValidation = this.validateBlock(block, index);
      errors.push(...blockValidation.errors);
      warnings.push(...blockValidation.warnings);
    });

    if (!(page as any).settings) {
      warnings.push('Página sem configurações - usando padrões');
    }

    const isValid = errors.length === 0;
    let fixedPage: Page | undefined;

    if (!isValid || warnings.length > 0) {
      fixedPage = this.fixPageStructure(page);
    }

    return { isValid, errors, warnings, fixedPage };
  }

  private static validateBlock(
    block: any,
    index: number
  ): { errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!block.id) {
      errors.push(`Bloco no índice ${index} não possui ID válido`);
    }

    if (!block.type) {
      errors.push(`Bloco no índice ${index} não possui tipo válido`);
    }

    if (!block.content) {
      warnings.push(`Bloco '${block.type}' no índice ${index} não possui conteúdo`);
    }

    return { errors, warnings };
  }

  private static fixPageStructure(page: Page): Page {
    const fixedPage: Page = {
      ...page,
      id: page.id || `page-${Date.now()}`,
      settings: (page as any).settings || {
        showProgress: true,
        progressValue: 0,
        backgroundColor: '#ffffff',
        textColor: '#432818',
        maxWidth: 'max-w-4xl',
      },
    };

    if (page.blocks) {
      fixedPage.blocks = page.blocks.map((block: any, index: number) =>
        this.fixBlockStructure(block, index)
      );
    } else {
      fixedPage.blocks = [
        {
          id: `default-text-${Date.now()}`,
          type: 'text',
          content: {
            text: `Conteúdo da página: ${page.title || page.name || 'Página sem título'}`,
          },
          order: 0,
        },
      ];
    }

    return fixedPage;
  }

  private static fixBlockStructure(block: any, index: number): Block {
    return {
      id:
        block.id ||
        generateSemanticId({
          context: 'validator',
          type: 'block',
          identifier: block.type || 'unknown',
          index,
        }),
      type: block.type || 'text',
      content: block.content || { text: 'Conteúdo padrão' },
      order: block.order || index,
    };
  }

  private static mapLegacyBlockType(legacyType: string): string | null {
    const mapping: Record<string, string> = {
      'quiz-intro': 'text',
      'quiz-question': 'text',
      'quiz-result': 'text',
    };
    return mapping[legacyType] || null;
  }

  private static generateDefaultProperties(
    blockType: string,
    existingProps: Record<string, any> = {}
  ): Record<string, any> {
    return existingProps;
  }

  static validateAndFixFunnel(funnel: Funnel) {
    let totalErrors = 0;
    let totalWarnings = 0;
    let pagesFixed = 0;

    const fixedPages = funnel.pages.map((page: any) => {
      const validation = this.validatePage(page);
      totalErrors += validation.errors.length;
      totalWarnings += validation.warnings.length;

      if (!validation.isValid || validation.warnings.length > 0) {
        if (validation.fixedPage) {
          pagesFixed++;
          console.log(
            `🔧 Página corrigida: "${page.title || page.name}" (${validation.errors.length} erros, ${validation.warnings.length} avisos)`
          );
          return validation.fixedPage;
        } else {
          console.error(
            `❌ Erro crítico: Falha ao corrigir a página "${page.title || page.name}". Retornando página original.`
          );
          return page;
        }
      }

      return page;
    });

    const fixedFunnel: Funnel = {
      ...funnel,
      pages: fixedPages,
    };

    return {
      originalFunnel: funnel,
      fixedFunnel,
      totalErrors,
      totalWarnings,
      pagesFixed,
    };
  }

  static forceSchemaCompatibility(page: Page): Page {
    const validation = this.validatePage(page);

    if (validation.isValid) {
      return page;
    }

    if (validation.fixedPage) {
      console.log(`✅ Página "${page.title || page.name}" corrigida para ser schema-driven`);
      return validation.fixedPage;
    }

    console.warn(
      `⚠️ Recriando página "${page.title || page.name}" com estrutura schema-driven básica devido a falha na correção.`
    );
    return {
      id: page.id || `rebuilt-${Date.now()}`,
      name: page.name || 'Página Reconstruída',
      title: page.title || page.name || 'Página Reconstruída',
      type: 'custom',
      order: page.order || 0,
      blocks: [
        {
          id: `rebuilt-content-${Date.now()}`,
          type: 'text',
          content: {
            text: `Esta página foi reconstruída: ${page.title || page.name || 'Página sem título'}`,
          },
          order: 0,
        },
      ],
      settings: {
        showProgress: true,
        progressValue: 0,
        backgroundColor: '#ffffff',
        textColor: '#432818',
        maxWidth: 'max-w-4xl',
      },
    };
  }
}

export default PageStructureValidator;
