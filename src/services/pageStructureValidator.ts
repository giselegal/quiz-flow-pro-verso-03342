/**
 * Validador e corretor de estrutura de páginas para garantir que todas
 * as páginas na aba "Páginas" sejam schema-driven e editáveis
 */

// Importe os tipos necessários (assumindo que estão em 'src/types.ts')
import type { BlockData as Block, Page as SchemaDrivenPageData, Funnel as SchemaDrivenFunnelData } from './funnelService'; // Renomeei Page para evitar conflito local
import { blockDefinitions } from '../config/blockDefinitions.ts';
// import { QuizDataAdapter } from './quizDataAdapter'; // Não usado neste arquivo, pode ser removido se não for necessário

export interface PageValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  fixedPage?: SchemaDrivenPageData;
}

export class PageStructureValidator {
  /**
   * Valida se uma página está corretamente estruturada para edição schema-driven
   */
  static validatePage(page: SchemaDrivenPageData): PageValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Verificar se a página tem ID
    if (!page.id) {
      errors.push('Página não possui ID válido');
    }

    // 2. Verificar se tem blocos
    if (!page.blocks || page.blocks.length === 0) {
      warnings.push('Página não possui blocos - aparecerá vazia no editor');
    }

    // 3. Verificar se todos os blocos são válidos
    page.blocks?.forEach((block, index) => {
      const blockValidation = this.validateBlock(block, index);
      errors.push(...blockValidation.errors);
      warnings.push(...blockValidation.warnings);
    });

    // 4. Verificar se tem configurações mínimas (se 'settings' for uma propriedade esperada na Page)
    // Se 'settings' for uma propriedade opcional ou não universal para todas as páginas,
    // esta validação pode ser mais flexível ou removida.
    if (!(page as any).settings) { // Usando 'any' para evitar erro de tipagem se 'settings' não estiver na interface Page
      warnings.push('Página sem configurações - usando padrões');
    }

    const isValid = errors.length === 0;

    // Se há problemas, tentar corrigir
    let fixedPage: SchemaDrivenPageData | undefined;
    if (!isValid || warnings.length > 0) { // Tentar corrigir mesmo com warnings para aplicar defaults
      fixedPage = this.fixPageStructure(page);
    }

    return {
      isValid,
      errors,
      warnings,
      fixedPage
    };
  }

  /**
   * Valida um bloco individual
   */
  private static validateBlock(block: Block, index: number): { errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Verificar se o bloco tem ID
    if (!block.id) {
      errors.push(`Bloco no índice ${index} não possui ID válido`);
    }

    // 2. Verificar se o tipo do bloco existe nas definições
    const definition = blockDefinitions.find(def => def.type === block.type);
    if (!definition) {
      errors.push(`Tipo de bloco '${block.type}' no índice ${index} não encontrado nas definições schema-driven`);
    }

    // 3. Verificar se tem propriedades (e inicializar se ausente para evitar erros)
    if (!block.properties) {
      warnings.push(`Bloco '${block.type}' no índice ${index} não possui propriedades - pode não ser editável`);
    }

    // 4. Verificar se as propriedades estão compatíveis com o schema
    if (definition && block.properties) {
      const allProps = definition.propertiesSchema || [];
      allProps.forEach(prop => {
        // Verifica se uma propriedade obrigatória (sem defaultValue) está faltando
        if (prop.defaultValue === undefined && !(prop.key in block.properties)) {
          // Isso pode ser um erro ou um aviso dependendo da sua regra de negócio
          warnings.push(`Propriedade obrigatória '${prop.key}' ausente no bloco '${block.type}' no índice ${index}.`);
        }
        // Verifica se uma propriedade com defaultValue está faltando
        else if (prop.defaultValue !== undefined && !(prop.key in block.properties)) {
          warnings.push(`Propriedade '${prop.key}' ausente no bloco '${block.type}' no índice ${index} - será usada propriedade padrão.`);
        }
      });
    }

    return { errors, warnings };
  }

  /**
   * Corrige uma página com problemas estruturais
   */
  private static fixPageStructure(page: SchemaDrivenPageData): SchemaDrivenPageData {
    const fixedPage: SchemaDrivenPageData = {
      ...page,
      id: page.id || `page-${Date.now()}`,
      // Garante que 'settings' exista com valores padrão se não estiver presente
      settings: (page as any).settings || {
        showProgress: true,
        progressValue: 0,
        backgroundColor: '#ffffff',
        textColor: '#432818',
        maxWidth: 'max-w-4xl'
      }
    };

    // Corrigir blocos
    if (page.blocks) {
      fixedPage.blocks = page.blocks
        .map((block, index) => this.fixBlockStructure(block, index))
        .filter(block => block !== null) as Block[]; // Garante que a saída seja Block[]
    } else {
      // Se não tem blocos, criar um bloco padrão editável
      fixedPage.blocks = [{
        id: `default-text-${Date.now()}`,
        type: 'text', // Usar um tipo de bloco básico existente
        properties: {
          content: `Conteúdo da página: ${page.title || page.name || 'Página sem título'}`,
          fontSize: 'medium', // Usar valores do enum ou string literal se for o caso
          textAlign: 'center'
        }
      }];
    }

    return fixedPage;
  }

  /**
   * Corrige um bloco com problemas
   */
  private static fixBlockStructure(block: Block, index: number): Block | null {
    // Garante que o ID do bloco exista
    const blockId = block.id || `${block.type || 'unknown'}-${Date.now()}-${index}`;

    // Tenta encontrar a definição do bloco pelo tipo atual
    let definition = blockDefinitions.find(def => def.type === block.type);
    let fixedBlockType = block.type;

    // Se o tipo atual não tem definição, tenta mapear para um tipo legado
    if (!definition) {
      const mappedType = this.mapLegacyBlockType(block.type);
      if (mappedType) {
        fixedBlockType = mappedType;
        definition = blockDefinitions.find(def => def.type === fixedBlockType); // Tenta encontrar a definição com o tipo mapeado
      }
    }

    // Se ainda não encontrar a definição (nem a original, nem a mapeada), retorna um bloco de fallback
    if (!definition) {
      console.warn(`⚠️ Tipo de bloco desconhecido ou não mapeável: '${block.type}' no índice ${index}. Convertendo para bloco de texto fallback.`);
      return {
        id: `text-fallback-${Date.now()}-${index}`,
        type: 'text', // Tipo de fallback
        properties: {
          content: `[Bloco legado/desconhecido: ${block.type}]`,
          fontSize: 'small', // Exemplo de tamanho
          textAlign: 'left',
          textColor: 'red' // Exemplo de cor para destaque
        }
      };
    }

    // Garante que as propriedades existam e aplica os valores padrão do schema
    const newProperties = this.generateDefaultProperties(fixedBlockType, block.properties);

    return {
      ...block,
      id: blockId,
      type: fixedBlockType,
      properties: newProperties
    };
  }

  /**
   * Mapeia tipos de bloco legados para tipos schema-driven padronizados
   * ATENÇÃO: Os valores à direita (os tipos schema-driven) DEVEM EXISTIR em blockDefinitions.ts
   */
  private static mapLegacyBlockType(legacyType: string): string | null {
    const mapping: Record<string, string> = {
      // === ETAPAS DO QUIZ - PADRONIZADAS ===
      // Mapeando para os nomes CORRETOS e PADRONIZADOS de blockDefinitions.ts
      'quiz-intro-etapa-1': 'quiz-intro-page',
      'quiz-intro': 'quiz-intro-page',
      'intro-step': 'quiz-intro-page',
      'funnel-intro': 'quiz-intro-page',

      'quiz-questao-normal': 'quiz-question',
      'quiz-question': 'quiz-question',
      'question-step': 'quiz-question',
      'quiz-step': 'quiz-question', // Se 'quiz-step' era um tipo legado, agora mapeia para 'quiz-question'

      'quiz-questao-estrategica': 'quiz-question', // Usar mesmo componente quiz-question
      'strategic-question': 'quiz-question',
      'strategic-step': 'quiz-question',

      'quiz-transicao-principal': 'quiz-transition-page',
      'quiz-transicao-final': 'quiz-transition-page',
      'quiz-transition': 'quiz-transition-page',
      'transition-step': 'quiz-transition-page',

      'quiz-resultado': 'result-page',
      'result-step': 'result-page',
      'quiz-result': 'result-page',

      'quiz-oferta': 'offer-page',
      'offer-step': 'offer-page',
      'quiz-offer': 'offer-page',

      // === PÁGINAS COMPLETAS - PADRONIZADAS (já são tipos de blockDefinition) ===
      // 'quiz-start-page': 'quiz-start-page', // Já está no blockDefinitions
      // 'result-page': 'result-page',         // Já está no blockDefinitions
      // 'quiz-offer-page': 'quiz-offer-page',  // Já está no blockDefinitions

      // === COMPONENTES DE RESULTADO ===
      'header-component-real': 'main-heading', // Mapeia para o novo nome 'main-heading'
      'secondary-styles-component-real': 'secondary-styles', // Assumindo que 'secondary-styles' existe
      'before-after-component-real': 'before-after', // Assumindo que 'before-after' existe
      'motivation-component-real': 'motivation-section', // Assumindo que 'motivation-section' existe
      // 'result-header': 'result-header', // Já está no blockDefinitions
      // 'result-card': 'result-card',     // Já está no blockDefinitions

      // === COMPONENTES DE OFERTA/VENDAS ===
      'section-title-component-real': 'main-heading', // Mapeia para o novo nome 'main-heading'
      'pricing-section-component-real': 'sales-offer', // Mapeia para 'sales-offer'
      'button-component-real': 'button',
      'countdown-timer-component-real': 'urgency-timer',
      // 'faq-section-component-real': 'faq-section', // Já está no blockDefinitions
      // 'sales-offer': 'sales-offer', // Já está no blockDefinitions
      // 'value-stack': 'value-stack', // Já está no blockDefinitions
      // 'testimonials-grid': 'testimonials-grid', // Já está no blockDefinitions
      // 'guarantee-section': 'guarantee-section', // Já está no blockDefinitions
      // 'bonus-section': 'bonus-section', // Já está no blockDefinitions

      // === COMPONENTES BÁSICOS ===
      'card-component-real': 'main-heading', // Mapeia para o novo nome 'main-heading'
      'fixed-intro-image-component-real': 'image',
      'logo-component-real': 'image',
      'text-component': 'text',
      'title-component': 'main-heading', // Mapeia para o novo nome 'main-heading'
      'image-component': 'image',
      'button-component': 'button',

      // === COMPONENTES AVANÇADOS ===
      'video-player': 'video-player',
      'audio-player': 'audio',
      'carousel': 'carousel',
      'testimonial': 'testimonials-grid', // Mapeia para o componente de grid de depoimentos
      'faq': 'faq-section',
      'pricing': 'sales-offer', // Mapeia para a seção de oferta de vendas
      'countdown': 'urgency-timer',
      'guarantee': 'guarantee-section',

      // === COMPONENTES UI ===
      'alert': 'alert',
      'arguments': 'arguments',
      'loader': 'loader',
      'quote': 'quote',
      'list': 'list',
      'spacer': 'spacer',
      'chart-compare': 'chart-compare',
      'chart-area': 'chart-area',
      'chart-level': 'chart-level',
      'confetti': 'confetti',
      'marquee': 'marquee',
      'options-grid': 'options-grid',
      'script': 'script',
      'terms': 'terms',
    };

    return mapping[legacyType] || null;
  }

  /**
   * Gera propriedades padrão para um tipo de bloco, mesclando com propriedades existentes.
   * Garante que apenas as propriedades definidas no schema sejam mantidas.
   */
  private static generateDefaultProperties(blockType: string, existingProps: Record<string, any> = {}): Record<string, any> {
    const definition = blockDefinitions.find(def => def.type === blockType);
    if (!definition) {
      // Se não houver definição, retorna apenas as props existentes (ou um objeto vazio)
      return existingProps;
    }

    const defaultProps: Record<string, any> = {};

    // Aplica os valores padrão do schema ou os valores existentes
    definition.propertiesSchema?.forEach(prop => {
      if (prop.key in existingProps) {
        defaultProps[prop.key] = existingProps[prop.key];
      } else if (prop.defaultValue !== undefined) {
        defaultProps[prop.key] = prop.defaultValue;
      }
    });

    // Se houver propriedades no existingProps que NÃO estão no schema, elas são descartadas
    // Isso garante que o bloco final só tenha propriedades válidas de acordo com o schema.

    return defaultProps;
  }

  /**
   * Valida e corrige um funil inteiro
   */
  static validateAndFixFunnel(funnel: SchemaDrivenFunnelData): {
    originalFunnel: SchemaDrivenFunnelData;
    fixedFunnel: SchemaDrivenFunnelData;
    totalErrors: number;
    totalWarnings: number;
    pagesFixed: number;
  } {
    let totalErrors = 0;
    let totalWarnings = 0;
    let pagesFixed = 0;

    const fixedPages = funnel.pages.map(page => {
      const validation = this.validatePage(page);
      totalErrors += validation.errors.length;
      totalWarnings += validation.warnings.length;

      if (!validation.isValid || validation.warnings.length > 0) {
        if (validation.fixedPage) {
          pagesFixed++;
          console.log(`🔧 Página corrigida: "${page.title || page.name}" (${validation.errors.length} erros, ${validation.warnings.length} avisos)`);
          return validation.fixedPage;
        } else {
          // Caso a validação falhe e não haja fixedPage (o que não deve acontecer com o fixPageStructure)
          console.error(`❌ Erro crítico: Falha ao corrigir a página "${page.title || page.name}". Retornando página original.`);
          return page; // Retorna a página original ou um fallback mais seguro
        }
      }

      return page;
    });

    const fixedFunnel: SchemaDrivenFunnelData = {
      ...funnel,
      pages: fixedPages
    };

    return {
      originalFunnel: funnel,
      fixedFunnel,
      totalErrors,
      totalWarnings,
      pagesFixed
    };
  }

  /**
   * Força uma página a ser schema-driven e editável
   * Esta função é mais agressiva e tenta garantir a compatibilidade
   */
  static forceSchemaCompatibility(page: SchemaDrivenPageData): SchemaDrivenPageData {
    const validation = this.validatePage(page);

    if (validation.isValid) {
      return page;
    }

    if (validation.fixedPage) {
      console.log(`✅ Página "${page.title || page.name}" corrigida para ser schema-driven`);
      return validation.fixedPage;
    }

    // Se não conseguir corrigir (o que seria raro com fixPageStructure), criar uma nova página básica
    console.warn(`⚠️ Recriando página "${page.title || page.name}" com estrutura schema-driven básica devido a falha na correção.`);
    return {
      id: page.id || `rebuilt-${Date.now()}`,
      name: page.name || 'Página Reconstruída',
      title: page.title || page.name || 'Página Reconstruída',
      type: 'custom', // Tipo genérico para páginas reconstruídas
      order: page.order || 0,
      blocks: [{
        id: `rebuilt-content-${Date.now()}`,
        type: 'text', // Bloco de texto padrão
        properties: {
          content: `Esta página foi reconstruída para ser editável: ${page.title || page.name || 'Página sem título'}. Conteúdo original pode ter sido perdido.`,
          fontSize: 'medium',
          textAlign: 'center'
        }
      }],
      settings: { // Garante que as configurações padrão existam
        showProgress: true,
        progressValue: 0,
        backgroundColor: '#ffffff',
        textColor: '#432818',
        maxWidth: 'max-w-4xl'
      }
    };
  }
}

export default PageStructureValidator;