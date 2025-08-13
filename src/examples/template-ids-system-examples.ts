/**
 * 🚀 EXEMPLOS PRÁTICOS - Sistema de IDs dos Templates
 *
 * Este arquivo demonstra como usar o sistema de identificação
 * dos templates e funis na prática.
 */

import { templateService } from '@/services/templateService';
import { getFunnelIdFromEnvOrStorage, parseStepNumberFromStageId } from '@/utils/funnelIdentity';

// =============================================================================
// 🎯 EXEMPLO 1: Carregar Template por Etapa
// =============================================================================

/**
 * Carrega um template específico baseado no número da etapa
 */
async function exemploCarregarTemplatePorEtapa() {
  console.log('📝 EXEMPLO 1: Carregando template da etapa 5');

  // Método 1: Diretamente por número
  const template5 = await templateService.getTemplateByStep(5);
  console.log('✅ Template carregado:', template5?.metadata.name);

  // Método 2: Via stageId
  const stageId = 'step-5';
  const stepNumber = parseStepNumberFromStageId(stageId); // → 5
  const template = await templateService.getTemplateByStep(stepNumber);

  console.log(`🎯 Etapa: ${stageId} → Número: ${stepNumber}`);
  console.log(`📋 Template ID: ${template?.metadata.id}`);
  console.log(`🎨 Nome: ${template?.metadata.name}`);
  console.log(`🏷️ Tags:`, template?.metadata.tags);
}

// =============================================================================
// 🎯 EXEMPLO 2: Criar Instância de Funil
// =============================================================================

/**
 * Demonstra como criar um funil baseado em um template
 */
async function exemploCriarFunil() {
  console.log('🏗️ EXEMPLO 2: Criando novo funil');

  const funnelData = {
    name: 'Quiz Personalizado - Estilo de Vida',
    description: 'Funil para descobrir preferências pessoais',
    template_id: 'quiz-step-01', // Template base
    author_id: 'user-uuid-here',
    is_published: false,
    settings: {
      maxSteps: 21,
      theme: 'gisele-galvao',
      customization: {
        colors: {
          primary: '#B89B7A',
          secondary: '#432818',
          accent: '#aa6b5d',
          background: '#FAF9F7',
        },
        fonts: {
          heading: 'Playfair Display',
          body: 'Inter',
        },
      },
      features: {
        progressBar: true,
        skipEnabled: false,
        backEnabled: true,
      },
    },
  };

  console.log('📊 Dados do funil:', funnelData);

  // Simular salvamento (substituir por chamada real ao Supabase)
  const funnelId = `funnel-${Date.now()}`;
  console.log(`✅ Funil criado com ID: ${funnelId}`);

  return funnelId;
}

// =============================================================================
// 🎯 EXEMPLO 3: Sistema de Navegação entre Etapas
// =============================================================================

/**
 * Simula navegação entre etapas de um funil
 */
class FunnelNavigator {
  private currentStep: number = 1;
  private maxSteps: number = 21;
  private funnelId: string;

  constructor(funnelId?: string) {
    this.funnelId = funnelId || getFunnelIdFromEnvOrStorage() || 'default';
    console.log(`🧭 Navigator inicializado para funil: ${this.funnelId}`);
  }

  /**
   * Navega para uma etapa específica
   */
  async goToStep(stepNumber: number): Promise<void> {
    if (stepNumber < 1 || stepNumber > this.maxSteps) {
      throw new Error(`Etapa ${stepNumber} fora do range válido (1-${this.maxSteps})`);
    }

    console.log(`🚀 Navegando da etapa ${this.currentStep} para ${stepNumber}`);

    // Carregar template da nova etapa
    const template = await templateService.getTemplateByStep(stepNumber);

    if (!template) {
      throw new Error(`Template não encontrado para etapa ${stepNumber}`);
    }

    this.currentStep = stepNumber;
    console.log(`✅ Carregado: ${template.metadata.name}`);
    console.log(`🎨 Blocos disponíveis: ${template.blocks?.length || 0}`);
  }

  /**
   * Vai para próxima etapa
   */
  async next(): Promise<void> {
    if (this.currentStep >= this.maxSteps) {
      console.log('🏁 Já na última etapa!');
      return;
    }

    await this.goToStep(this.currentStep + 1);
  }

  /**
   * Volta para etapa anterior
   */
  async previous(): Promise<void> {
    if (this.currentStep <= 1) {
      console.log('⏪ Já na primeira etapa!');
      return;
    }

    await this.goToStep(this.currentStep - 1);
  }

  /**
   * Pula para etapa específica por ID
   */
  async goToStage(stageId: string): Promise<void> {
    const stepNumber = parseStepNumberFromStageId(stageId);
    await this.goToStep(stepNumber);
  }

  /**
   * Obtém informações da etapa atual
   */
  getCurrentInfo() {
    const stageId = `step-${this.currentStep}`;

    return {
      stepNumber: this.currentStep,
      stageId: stageId,
      templateId: `quiz-step-${this.currentStep.toString().padStart(2, '0')}`,
      funnelId: this.funnelId,
      progress: (this.currentStep / this.maxSteps) * 100,
    };
  }
}

// =============================================================================
// 🎯 EXEMPLO 4: Busca e Filtros de Templates
// =============================================================================

/**
 * Demonstra como buscar e filtrar templates
 */
async function exemploBuscarTemplates() {
  console.log('🔍 EXEMPLO 4: Buscando templates');

  // Buscar todos os templates
  const allTemplates = await templateService.getTemplates();
  console.log(`📚 Total de templates: ${allTemplates.length}`);

  // Buscar por palavra-chave
  const quizTemplates = await templateService.searchTemplates('quiz');
  console.log(`🎯 Templates de quiz: ${quizTemplates.length}`);

  // Filtrar por categoria
  const introTemplates = allTemplates.filter(t => t.metadata.category === 'quiz-intro');
  console.log(`🚀 Templates de introdução: ${introTemplates.length}`);

  // Filtrar por tags
  const styleTemplates = allTemplates.filter(t => t.metadata.tags.includes('style'));
  console.log(`💄 Templates de estilo: ${styleTemplates.length}`);

  // Mostrar detalhes dos templates encontrados
  quizTemplates.forEach((template, index) => {
    console.log(`\n📋 Template ${index + 1}:`);
    console.log(`   ID: ${template.metadata.id}`);
    console.log(`   Nome: ${template.metadata.name}`);
    console.log(`   Categoria: ${template.metadata.category}`);
    console.log(`   Tags: ${template.metadata.tags.join(', ')}`);
  });
}

// =============================================================================
// 🎯 EXEMPLO 5: Personalização de Template
// =============================================================================

/**
 * Mostra como personalizar um template para um funil específico
 */
async function exemploPersonalizarTemplate() {
  console.log('🎨 EXEMPLO 5: Personalizando template');

  // Carregar template base
  const baseTemplate = await templateService.getTemplateByStep(1);

  if (!baseTemplate) {
    console.error('❌ Template base não encontrado');
    return;
  }

  console.log(`🎯 Template base: ${baseTemplate.metadata.name}`);

  // Criar versão personalizada
  const customTemplate = {
    ...baseTemplate,
    metadata: {
      ...baseTemplate.metadata,
      id: `custom-${baseTemplate.metadata.id}`,
      name: `${baseTemplate.metadata.name} - Personalizado`,
      author: 'usuario-atual',
    },
    design: {
      ...baseTemplate.design,
      primaryColor: '#ff6b6b', // Nova cor primária
      secondaryColor: '#4ecdc4', // Nova cor secundária
      fontFamily: 'Roboto, sans-serif', // Nova fonte
    },
  };

  console.log('✅ Template personalizado criado:');
  console.log(`   ID: ${customTemplate.metadata.id}`);
  console.log(`   Nome: ${customTemplate.metadata.name}`);
  console.log(`   Cor primária: ${customTemplate.design.primaryColor}`);

  return customTemplate;
}

// =============================================================================
// 🚀 EXECUTAR EXEMPLOS
// =============================================================================

/**
 * Função principal que executa todos os exemplos
 */
export async function executarExemplos() {
  console.log('🎉 INICIANDO EXEMPLOS DO SISTEMA DE IDs');
  console.log('='.repeat(50));

  try {
    // Exemplo 1
    await exemploCarregarTemplatePorEtapa();
    console.log('');

    // Exemplo 2
    const funnelId = await exemploCriarFunil();
    console.log('');

    // Exemplo 3
    const navigator = new FunnelNavigator(funnelId);
    await navigator.goToStep(5);
    await navigator.next();
    await navigator.previous();
    console.log('📊 Info atual:', navigator.getCurrentInfo());
    console.log('');

    // Exemplo 4
    await exemploBuscarTemplates();
    console.log('');

    // Exemplo 5
    await exemploPersonalizarTemplate();

    console.log('');
    console.log('✅ TODOS OS EXEMPLOS EXECUTADOS COM SUCESSO!');
  } catch (error) {
    console.error('❌ Erro ao executar exemplos:', error);
  }
}

// =============================================================================
// 🔧 UTILITÁRIOS AUXILIARES
// =============================================================================

/**
 * Utilitários para debug e desenvolvimento
 */
export const debugUtils = {
  /**
   * Mostra informações detalhadas de um template
   */
  async inspectTemplate(stepNumber: number) {
    const template = await templateService.getTemplateByStep(stepNumber);

    if (!template) {
      console.log(`❌ Template ${stepNumber} não encontrado`);
      return;
    }

    console.log(`🔍 INSPEÇÃO DO TEMPLATE ${stepNumber}`);
    console.log('='.repeat(30));
    console.log(`📋 ID: ${template.metadata.id}`);
    console.log(`🏷️ Nome: ${template.metadata.name}`);
    console.log(`📝 Descrição: ${template.metadata.description}`);
    console.log(`🎨 Categoria: ${template.metadata.category}`);
    console.log(`🏷️ Tags: ${template.metadata.tags.join(', ')}`);
    console.log(`👤 Autor: ${template.metadata.author}`);
    console.log(`📅 Criado: ${template.metadata.createdAt}`);
    console.log(`🔧 Versão: ${template.templateVersion}`);
    console.log(`🎨 Cor primária: ${template.design.primaryColor}`);
    console.log(`🧱 Blocos: ${template.blocks?.length || 0}`);
  },

  /**
   * Lista todos os templates disponíveis
   */
  async listAllTemplates() {
    const templates = await templateService.getTemplates();

    console.log('📚 TODOS OS TEMPLATES DISPONÍVEIS');
    console.log('='.repeat(40));

    templates.forEach((template, index) => {
      console.log(`${index + 1}. ${template.metadata.name} (${template.metadata.id})`);
    });
  },
};

// Para usar no console do navegador:
// import { executarExemplos, debugUtils } from './path/to/this/file';
// executarExemplos();
// debugUtils.inspectTemplate(5);
