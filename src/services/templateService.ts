import { supabase } from '@/integrations/supabase/client';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '../templates/quiz21StepsComplete';
import type { Block, BlockType } from '../types/editor';

export interface TemplateData {
  blocks: Block[];
  templateVersion: string;
}

// Interface para Template da UI
export interface UITemplate {
  id: string;
  name: string;
  description: string;
  category: 'quiz' | 'funnel' | 'landing' | 'survey';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isPremium: boolean;
  rating: number;
  downloads: number;
  thumbnail: string;
  components: number;
  author: string;
  tags: string[];
  templateData?: any;
  createdAt?: string;
  updatedAt?: string;
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

// Cache leve para templates por etapa (evita recomputar em navegações rápidas)
const stepTemplateCache = new Map<number, TemplateData>();

// Utilitário de clone raso dos blocos (evita refs compartilhadas entre etapas)
function cloneBlocks(blocks: Block[]): Block[] {
  return (blocks || []).map(b => ({ ...b, content: { ...(b.content || {}) }, properties: { ...(b.properties || {}) } }));
}

function getFallbackBlocksForStep(step: number): Block[] {
  // 🎯 PRIMEIRA TENTATIVA: Usar blocos do template completo
  const stepId = `step-${step}`;
  const templateBlocks = QUIZ_STYLE_21_STEPS_TEMPLATE[stepId];

  if (templateBlocks && templateBlocks.length > 0) {
    console.log(`✅ Usando template oficial para etapa ${step} (${templateBlocks.length} blocos)`);
    return templateBlocks.map((block, index) => ({
      ...block,
      order: index,
    }));
  }

  // 🔄 FALLBACK: Gerar blocos básicos se o template não existir
  console.log(`⚠️ Template não encontrado para etapa ${step}, usando fallback`);

  const baseId = `step-${step}-fallback`;

  // Etapa 1: Coleta de nome (como no QuizFlowPage)
  if (step === 1) {
    return [
      {
        id: `${baseId}-title`,
        type: 'heading' as BlockType,
        content: { text: 'Bem-vindo ao Quiz!', level: 1 },
        order: 0,
        properties: { text: 'Bem-vindo ao Quiz!', level: 1, textAlign: 'center', color: '#432818' },
      },
      {
        id: `${baseId}-subtitle`,
        type: 'text' as BlockType,
        content: { text: 'Qual é o seu primeiro nome?' },
        order: 1,
        properties: {
          text: 'Qual é o seu primeiro nome?',
          textAlign: 'center',
          fontSize: '18px',
          color: '#666666',
        },
      },
      {
        id: `${baseId}-input`,
        type: 'input' as BlockType,
        content: { placeholder: 'Digite seu nome', type: 'text' },
        order: 2,
        properties: { placeholder: 'Digite seu nome', type: 'text', required: true },
      },
      {
        id: `${baseId}-button`,
        type: 'button' as BlockType,
        content: { text: 'Começar Quiz' },
        order: 3,
        properties: {
          text: 'Começar Quiz',
          backgroundColor: '#B89B7A',
          textColor: '#FFFFFF',
          fullWidth: true,
        },
      },
    ];
  }

  // Etapas 2-11: Questões que pontuam (como no QuizFlowPage)
  if (step >= 2 && step <= 11) {
    const questionNumber = step - 1;
    return [
      {
        id: `${baseId}-progress`,
        type: 'progress' as BlockType,
        content: { value: (questionNumber / 10) * 100, max: 100 },
        order: 0,
        properties: { value: (questionNumber / 10) * 100, max: 100, color: '#B89B7A' },
      },
      {
        id: `${baseId}-counter`,
        type: 'text' as BlockType,
        content: { text: `Pergunta ${questionNumber} de 10` },
        order: 1,
        properties: {
          text: `Pergunta ${questionNumber} de 10`,
          textAlign: 'center',
          fontSize: '14px',
          color: '#666666',
        },
      },
      {
        id: `${baseId}-question`,
        type: 'heading' as BlockType,
        content: {
          text: `Pergunta ${questionNumber}: Configure no painel de propriedades`,
          level: 2,
        },
        order: 2,
        properties: {
          text: `Pergunta ${questionNumber}: Configure no painel de propriedades`,
          level: 2,
          textAlign: 'center',
          color: '#432818',
        },
      },
      {
        id: `${baseId}-options`,
        type: 'options-grid' as BlockType,
        content: { options: [] },
        order: 3,
        properties: {
          options: [
            { id: 'opt1', text: 'Opção 1', value: 'option1' },
            { id: 'opt2', text: 'Opção 2', value: 'option2' },
            { id: 'opt3', text: 'Opção 3', value: 'option3' },
            { id: 'opt4', text: 'Opção 4', value: 'option4' },
          ],
          layout: 'grid',
          columns: 2,
        },
      },
    ];
  }

  // Etapa 12: Transição (como no QuizFlowPage)
  if (step === 12) {
    return [
      {
        id: `${baseId}-title`,
        type: 'heading' as BlockType,
        content: { text: 'Primeira Fase Concluída!', level: 2 },
        order: 0,
        properties: {
          text: 'Primeira Fase Concluída!',
          level: 2,
          textAlign: 'center',
          color: '#432818',
        },
      },
      {
        id: `${baseId}-message`,
        type: 'text' as BlockType,
        content: { text: 'Agora vamos entender melhor seus objetivos!' },
        order: 1,
        properties: {
          text: 'Agora vamos entender melhor seus objetivos!',
          textAlign: 'center',
          fontSize: '18px',
          color: '#666666',
        },
      },
      {
        id: `${baseId}-button`,
        type: 'button' as BlockType,
        content: { text: 'Continuar' },
        order: 2,
        properties: { text: 'Continuar', backgroundColor: '#B89B7A', textColor: '#FFFFFF' },
      },
    ];
  }

  // Etapas 13-18: Questões estratégicas (como no QuizFlowPage)
  if (step >= 13 && step <= 18) {
    const strategicNumber = step - 12;
    return [
      {
        id: `${baseId}-counter`,
        type: 'text' as BlockType,
        content: { text: `Pergunta Estratégica ${strategicNumber} de 6` },
        order: 0,
        properties: {
          text: `Pergunta Estratégica ${strategicNumber} de 6`,
          textAlign: 'center',
          fontSize: '14px',
          color: '#666666',
        },
      },
      {
        id: `${baseId}-question`,
        type: 'heading' as BlockType,
        content: { text: `Questão Estratégica ${strategicNumber}: Configure no painel`, level: 2 },
        order: 1,
        properties: {
          text: `Questão Estratégica ${strategicNumber}: Configure no painel`,
          level: 2,
          textAlign: 'center',
          color: '#432818',
        },
      },
      {
        id: `${baseId}-options`,
        type: 'options-grid' as BlockType,
        content: { options: [] },
        order: 2,
        properties: {
          options: [
            { id: 'opt1', text: 'Opção A', value: 'optionA' },
            { id: 'opt2', text: 'Opção B', value: 'optionB' },
          ],
          layout: 'grid',
          columns: 2,
        },
      },
    ];
  }

  // Etapa 19: Calculando resultados (como no QuizFlowPage)
  if (step === 19) {
    return [
      {
        id: `${baseId}-title`,
        type: 'heading' as BlockType,
        content: { text: 'Calculando seus resultados...', level: 2 },
        order: 0,
        properties: {
          text: 'Calculando seus resultados...',
          level: 2,
          textAlign: 'center',
          color: '#432818',
        },
      },
      {
        id: `${baseId}-spinner`,
        type: 'loading' as BlockType,
        content: { type: 'spinner' },
        order: 1,
        properties: { type: 'spinner', text: 'Analisando suas respostas...' },
      },
    ];
  }

  // Etapa 20: Resultado personalizado com blocos robustos
  if (step === 20) {
    return [
      {
        id: `${baseId}-header`,
        type: 'quiz-intro-header' as BlockType,
        content: { 
          logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
          logoAlt: 'Logo Gisele Galvão',
          logoWidth: '96',
          logoHeight: '96',
          progressValue: 100,
          progressTotal: 100,
          showProgress: true
        },
        order: 0,
        properties: { 
          logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
          logoAlt: 'Logo Gisele Galvão',
          logoWidth: '96',
          logoHeight: '96',
          progressValue: 100,
          progressTotal: 100,
          showProgress: true,
          containerWidth: 'full',
          spacing: 'small'
        }
      },
      {
        id: `${baseId}-result-header`,
        type: 'result-header-inline' as BlockType,
        content: {
          title: 'Seu Estilo Predominante',
          subtitle: 'Descubra mais sobre seu estilo único'
        },
        order: 1,
        properties: {
          title: 'Seu Estilo Predominante',
          subtitle: 'Descubra mais sobre seu estilo único',
          showIcon: true,
          showPercentage: true,
          showSecondaryStyles: true,
          containerWidth: 'full',
          spacing: 'small'
        }
      },
      {
        id: `${baseId}-result-content`,
        type: 'quiz-result' as BlockType,
        content: { 
          showSecondaryStyles: true, 
          showOffer: true,
          showDescription: true
        },
        order: 2,
        properties: { 
          showSecondaryStyles: true, 
          showOffer: true,
          showDescription: true,
          containerWidth: 'full',
          spacing: 'small'
        },
      },
      {
        id: `${baseId}-cta-button`,
        type: 'button' as BlockType,
        content: { text: 'Receber Guia Gratuito' },
        order: 3,
        properties: {
          text: 'Receber Guia Gratuito',
          backgroundColor: '#B89B7A',
          textColor: '#FFFFFF',
          fullWidth: true,
          size: 'lg',
          containerWidth: 'full',
          spacing: 'small'
        },
      },
    ];
  }

  // Etapa 21: Oferta especial (como no QuizFlowPage)
  if (step === 21) {
    return [
      {
        id: `${baseId}-title`,
        type: 'heading' as BlockType,
        content: { text: 'Oferta Especial!', level: 1 },
        order: 0,
        properties: { text: 'Oferta Especial!', level: 1, textAlign: 'center', color: '#432818' },
      },
      {
        id: `${baseId}-offer`,
        type: 'offer-card' as BlockType,
        content: {
          title: 'Baseado no seu resultado, temos algo perfeito para você!',
          description: 'Aproveite 50% de desconto no nosso curso personalizado',
          oldPrice: 'R$ 497',
          newPrice: 'R$ 247',
        },
        order: 1,
        properties: {
          title: 'Baseado no seu resultado, temos algo perfeito para você!',
          description: 'Aproveite 50% de desconto no nosso curso personalizado',
          oldPrice: 'R$ 497',
          newPrice: 'R$ 247',
          backgroundColor: '#22C55E',
        },
      },
      {
        id: `${baseId}-cta`,
        type: 'button' as BlockType,
        content: { text: 'Garantir Desconto Agora' },
        order: 2,
        properties: {
          text: 'Garantir Desconto Agora',
          backgroundColor: '#FFFFFF',
          textColor: '#22C55E',
          fullWidth: true,
        },
      },
    ];
  }

  // Fallback para outras etapas
  return [
    {
      id: `${baseId}-header`,
      type: 'heading' as BlockType,
      content: { text: `Etapa ${step}`, level: 1 },
      order: 0,
      properties: { text: `Etapa ${step}`, level: 1, textAlign: 'center', color: '#432818' },
    },
    {
      id: `${baseId}-text`,
      type: 'text' as BlockType,
      content: { text: `Conteúdo da etapa ${step} - Configure no painel de propriedades` },
      order: 1,
      properties: {
        text: `Conteúdo da etapa ${step} - Configure no painel de propriedades`,
        textAlign: 'center',
        fontSize: '16px',
        color: '#666666',
      },
    },
  ];
}

const templateService = {
  async getTemplates(): Promise<TemplateData[]> {
    return [];
  },
  async getTemplate(_id: string): Promise<TemplateData | null> {
    return null;
  },
  async searchTemplates(_query: string): Promise<TemplateData[]> {
    return [];
  },
  async getTemplateByStep(step: number): Promise<TemplateData | null> {
    if (step < 1 || step > 21) {
      console.warn(`⚠️ getTemplateByStep(${step}): Etapa inválida`);
      return null;
    }

    console.log(`🔄 getTemplateByStep(${step}): Carregando template...`);

    try {
      // Cache imediato
      const cached = stepTemplateCache.get(step);
      if (cached) return cached;

      const fallbackBlocks = getFallbackBlocksForStep(step);

      const templateData: TemplateData = {
        templateVersion: '1.0.0',
        blocks: cloneBlocks(fallbackBlocks),
      };

      console.log(
        `✅ getTemplateByStep(${step}): Template gerado com ${fallbackBlocks.length} blocos`
      );
      stepTemplateCache.set(step, templateData);
      return templateData;
    } catch (error) {
      console.error(`❌ Erro ao gerar template da etapa ${step}:`, error);
      return null;
    }
  },
  convertTemplateBlocksToEditorBlocks(templateBlocks: Block[] = [], stepHint?: number): Block[] {
    return (templateBlocks || []).map((block, index) => ({
      id: block.id || `block-${stepHint ?? 'step'}-${index}`,
      type: block.type as BlockType,
      content: block.content || {},
      order: index,
      properties: block.properties || {},
    }));
  },
  /**
   * Converte blocos de template para blocos do editor aplicando funnelId, stageId e order.
   * Gera IDs estáveis quando ausentes e permite informar stepHint para estabilidade.
   */
  convertToEditorBlocksWithStage(
    templateBlocks: Block[] = [],
    funnelId: string,
    stageId: string,
    stepHint?: number
  ): Block[] {
    const converted = this.convertTemplateBlocksToEditorBlocks(templateBlocks, stepHint);
    return converted.map((b, i) => ({
      ...b,
      order: i,
      properties: { ...(b.properties || {}), funnelId, stageId },
    }));
  },
  // Utilitários
  clearCache(): void {
    stepTemplateCache.clear();
  },
  isCached(step: number): boolean {
    return stepTemplateCache.has(step);
  },
  getAllSteps(): Record<string, Block[]> {
    const result: Record<string, Block[]> = {};
    for (let i = 1; i <= 21; i++) {
      const stepId = `step-${i}`;
      const src = (QUIZ_STYLE_21_STEPS_TEMPLATE as any)[stepId] || [];
      result[stepId] = cloneBlocks(src);
    }
    return result;
  },
};

export async function loadStepTemplate(step: number): Promise<StepLoadResult | null> {
  if (step < 1 || step > 21) return null;

  console.log(`🔄 loadStepTemplate(${step}): Iniciando carregamento...`);

  // Tentar carregar do template oficial primeiro
  const stepId = `step-${step}`;
  const templateBlocks = QUIZ_STYLE_21_STEPS_TEMPLATE[stepId];

  let blocks: Block[];
  let source: string;

  if (templateBlocks && templateBlocks.length > 0) {
    blocks = templateBlocks.map((block, index) => ({
      ...block,
      order: index,
    }));
    source = 'template oficial';
    console.log(`✅ Template oficial carregado para etapa ${step} (${blocks.length} blocos)`);
  } else {
    blocks = getFallbackBlocksForStep(step);
    source = 'fallback';
    console.log(`⚠️ Usando fallback para etapa ${step} (${blocks.length} blocos)`);
  }

  // Obter nome da questão do template
  const questionName = Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE).includes(stepId)
    ? Object.entries(QUIZ_STYLE_21_STEPS_TEMPLATE).find(([key]) => key === stepId)?.[1]?.[0]
        ?.content?.title || `Etapa ${step}`
    : `Etapa ${step}`;

  return {
    blocks,
    step,
    metadata: {
      name: questionName,
      description: `Template da etapa ${step} (${source})`,
      step,
      category:
        step === 1
          ? 'introduction'
          : step >= 2 && step <= 11
            ? 'quiz-questions'
            : step === 12
              ? 'transition'
              : step >= 13 && step <= 18
                ? 'strategic-questions'
                : step === 19
                  ? 'processing'
                  : step === 20
                    ? 'result'
                    : step === 21
                      ? 'offer'
                      : 'default',
      tags: [source, 'quiz', 'style'],
      version: '2.0.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
}

export default templateService;
// Também exporta como nomeado para compatibilidade com imports existentes
export { templateService };

/**
 * Serviço para gerenciamento de templates com Supabase
 * Por enquanto usando fallbacks até configurar as RPCs no banco
 */
export class SupabaseTemplateService {
  /**
   * Busca todos os templates disponíveis
   */
  async getTemplates(): Promise<UITemplate[]> {
    try {
      console.log('🔄 Buscando templates do Supabase...');

      // Primeiro tenta carregar via query direta
      const { data, error } = await (supabase as any)
        .from('quiz_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('⚠️ Erro ao carregar templates do Supabase:', error);
        console.log('🔄 Usando templates fallback e reais...');
        const fallbacks = this.getFallbackTemplates();
        const realTemplates = this.getRealTemplates();
        return [...realTemplates, ...fallbacks];
      }

      if (!data || data.length === 0) {
        console.log('📝 Nenhum template encontrado no Supabase.');
        const fallbacks = this.getFallbackTemplates();
        const realTemplates = this.getRealTemplates();
        return [...realTemplates, ...fallbacks];
      }

      console.log(`✅ ${data.length} templates carregados do Supabase`);
      const supabaseTemplates = this.transformSupabaseToUI(data);
      const realTemplates = this.getRealTemplates();

      return [...supabaseTemplates, ...realTemplates];
    } catch (error) {
      console.error('💥 Erro na conexão com Supabase:', error);
      console.log('🔄 Usando templates fallback...');
      const fallbacks = this.getFallbackTemplates();
      const realTemplates = this.getRealTemplates();
      return [...realTemplates, ...fallbacks];
    }
  }

  /**
   * Busca template por ID
   */
  async getTemplateById(id: string): Promise<UITemplate | null> {
    try {
      const allTemplates = await this.getTemplates();
      return allTemplates.find(template => template.id === id) || null;
    } catch (error) {
      console.error('Erro na conexão com Supabase:', error);
      return null;
    }
  }

  /**
   * Cria um novo template
   */
  async createTemplate(template: Partial<UITemplate>): Promise<UITemplate | null> {
    try {
      // TODO: Implementar quando tabela estiver configurada
      console.log('🔄 Criando template:', template.name);

      // Por enquanto, simula criação local
      const newTemplate: UITemplate = {
        id: `template-${Date.now()}`,
        name: template.name || 'Novo Template',
        description: template.description || '',
        category: template.category || 'quiz',
        difficulty: template.difficulty || 'beginner',
        isPremium: template.isPremium || false,
        rating: 0,
        downloads: 0,
        thumbnail: template.thumbnail || 'https://via.placeholder.com/300x200',
        components: template.components || 0,
        author: template.author || 'Usuário',
        tags: template.tags || [],
        templateData: template.templateData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return newTemplate;
    } catch (error) {
      console.error('Erro na criação do template:', error);
      return null;
    }
  }

  /**
   * Atualiza contador de uso
   */
  async incrementUsage(templateId: string): Promise<boolean> {
    try {
      console.log('🔄 Incrementando uso do template:', templateId);

      const { error } = await (supabase as any)
        .from('quiz_templates')
        .update({ usage_count: (supabase as any).raw('usage_count + 1') })
        .eq('id', templateId);

      if (error) {
        console.warn('⚠️ Erro ao incrementar uso:', error);
        return false;
      }

      console.log('✅ Uso incrementado com sucesso');
      return true;
    } catch (error) {
      console.error('💥 Erro na atualização de uso:', error);
      return false;
    }
  }

  /**
   * Incrementa uso de template (nome alternativo)
   */
  async incrementTemplateUsage(templateId: string): Promise<boolean> {
    return this.incrementUsage(templateId);
  }

  /**
   * Busca templates por categoria
   */
  async getTemplatesByCategory(category: string): Promise<UITemplate[]> {
    try {
      const allTemplates = await this.getTemplates();

      if (category === 'all') {
        return allTemplates;
      }

      return allTemplates.filter(template => template.category === category);
    } catch (error) {
      console.error('Erro na busca por categoria:', error);
      return [];
    }
  }

  /**
   * Busca templates por termo
   */
  async searchTemplates(searchTerm: string): Promise<UITemplate[]> {
    try {
      const allTemplates = await this.getTemplates();
      const term = searchTerm.toLowerCase();

      return allTemplates.filter(
        template =>
          template.name.toLowerCase().includes(term) ||
          template.description.toLowerCase().includes(term) ||
          template.tags.some(tag => tag.toLowerCase().includes(term))
      );
    } catch (error) {
      console.error('Erro na busca:', error);
      return [];
    }
  }

  /**
   * Transforma dados do Supabase para formato da UI
   */
  private transformSupabaseToUI(templates: any[]): UITemplate[] {
    return templates.map(template => ({
      id: template.id,
      name: template.name,
      description: template.description || '',
      category: this.mapCategory(template.category),
      difficulty: 'intermediate' as const,
      isPremium: !template.is_public,
      rating: template.is_public ? 4.8 : 4.2,
      downloads: template.usage_count || 0,
      usageCount: template.usage_count || 0,
      componentCount: this.countComponents(template.template_data),
      thumbnail: 'https://via.placeholder.com/300x200',
      components: this.countComponents(template.template_data),
      author: template.is_public ? 'Gisele Galvão' : 'Comunidade',
      tags: template.tags || [template.category],
      templateData: template.template_data,
      createdAt: template.created_at,
      updatedAt: template.updated_at,
    }));
  }

  /**
   * Mapeia categoria do DB para categoria da UI
   */
  private mapCategory(category: string): UITemplate['category'] {
    switch (category) {
      case 'quiz':
      case 'funnel':
      case 'landing':
      case 'survey':
        return category;
      default:
        return 'quiz';
    }
  }

  /**
   * Conta componentes no template data
   */
  private countComponents(templateData: any): number {
    if (!templateData) return 0;
    if (Array.isArray(templateData.blocks)) {
      return templateData.blocks.length;
    }
    if (typeof templateData === 'object' && templateData.type === '21-steps-quiz') {
      return 21;
    }
    return Object.keys(templateData).length || 1;
  }

  /**
   * Templates baseados nos dados reais do projeto
   */
  private getRealTemplates(): UITemplate[] {
    return [
      {
        id: 'real-21-steps',
        name: 'Quiz Profissional 21 Etapas',
        description: 'Sistema completo de descoberta de estilo pessoal com 21 etapas estruturadas',
        category: 'quiz',
        difficulty: 'advanced',
        isPremium: false,
        rating: 4.9,
        downloads: 2500,
        thumbnail:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911666/C%C3%B3pia_de_Template_Dossi%C3%AA_Completo_2024_15_-_Copia_ssrhu3.webp',
        components: 21,
        author: 'Gisele Galvão',
        tags: ['personalidade', 'estilo', '21-etapas', 'profissional'],
        templateData: QUIZ_STYLE_21_STEPS_TEMPLATE,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      },
    ];
  }

  /**
   * Templates de fallback quando Supabase não está disponível
   */
  private getFallbackTemplates(): UITemplate[] {
    return [
      {
        id: 'fallback-1',
        name: 'Quiz de Personalidade Básico',
        description: 'Template simples para descoberta de perfil pessoal',
        category: 'quiz',
        difficulty: 'beginner',
        isPremium: false,
        rating: 4.5,
        downloads: 850,
        thumbnail: 'https://via.placeholder.com/300x200',
        components: 8,
        author: 'Sistema',
        tags: ['personalidade', 'básico', 'iniciante'],
      },
      {
        id: 'fallback-2',
        name: 'Funil de Captação',
        description: 'Template para captação de leads qualificados',
        category: 'funnel',
        difficulty: 'intermediate',
        isPremium: true,
        rating: 4.7,
        downloads: 1200,
        thumbnail: 'https://via.placeholder.com/300x200',
        components: 12,
        author: 'Sistema',
        tags: ['funil', 'captação', 'leads'],
      },
      {
        id: 'fallback-3',
        name: 'Landing Page Simples',
        description: 'Template clean para apresentação de produtos',
        category: 'landing',
        difficulty: 'beginner',
        isPremium: false,
        rating: 4.3,
        downloads: 950,
        thumbnail: 'https://via.placeholder.com/300x200',
        components: 6,
        author: 'Sistema',
        tags: ['landing', 'simples', 'produto'],
      },
    ];
  }
}

// Instância global do serviço
export const supabaseTemplateService = new SupabaseTemplateService();
