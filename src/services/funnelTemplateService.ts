import { supabase } from '@/integrations/supabase/client';

// Helper para gerar IDs quando necessário
const genId = () =>
(typeof crypto !== 'undefined' && (crypto as any).randomUUID
  ? (crypto as any).randomUUID()
  : `funnel_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);

export interface FunnelTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  theme: string;
  stepCount: number;
  isOfficial: boolean;
  usageCount: number;
  tags: string[];
  thumbnailUrl?: string;
  templateData: any;
  components: any[];
  createdAt: string;
  updatedAt: string;
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  templateCount: number;
}

class FunnelTemplateService {
  /**
   * Get all available funnel templates
   */
  async getTemplates(category?: string): Promise<FunnelTemplate[]> {
    try {
      // ✅ CORRIGIDO: Verificar se Supabase está disponível e funcional
      if (!supabase || typeof supabase.from !== 'function') {
        console.warn('⚠️ Supabase não disponível ou não funcional, retornando templates locais');
        return this.getFallbackTemplates();
      }

      let query = supabase
        .from('funnel_templates')
        .select('*');

      // ✅ CORRIGIDO: Verificar se métodos existem antes de chamar
      if (category && category !== 'all' && typeof query.eq === 'function') {
        query = query.eq('category', category);
      }

      // Tentar ordenar, mas com fallback se falhar
      if (typeof query.order === 'function') {
        query = query.order('usage_count', { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching templates:', error);
        return this.getFallbackTemplates(category);
      }

      return (
        ((data as any[]) || []).map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description || '',
          category: item.category,
          theme: item.theme || 'default',
          stepCount: item.step_count || 1,
          isOfficial: item.is_official || false,
          usageCount: item.usage_count || 0,
          tags: item.tags || [],
          thumbnailUrl: item.thumbnail_url || undefined,
          templateData: item.template_data || {},
          components: Array.isArray(item.components) ? item.components : [],
          createdAt: item.created_at || new Date().toISOString(),
          updatedAt: item.updated_at || new Date().toISOString(),
        })) || this.getFallbackTemplates(category)
      );
    } catch (error) {
      console.error('Error in getTemplates:', error);
      return this.getFallbackTemplates(category);
    }
  }

  /**
   * Get templates organized by categories
   */
  async getTemplatesByCategory(): Promise<Record<string, FunnelTemplate[]>> {
    try {
      const templates = await this.getTemplates();
      const categorized: Record<string, FunnelTemplate[]> = {};

      templates.forEach(template => {
        if (!categorized[template.category]) {
          categorized[template.category] = [];
        }
        categorized[template.category].push(template);
      });

      return categorized;
    } catch (error) {
      console.error('Error organizing templates by category:', error);
      return {};
    }
  }

  /**
   * Get template categories with counts
   */
  async getTemplateCategories(): Promise<TemplateCategory[]> {
    try {
      const { data, error } = await supabase
        .from('funnel_templates')
        .select('category')
        .not('category', 'is', null);

      if (error) {
        console.error('Error fetching categories:', error);
        return this.getFallbackCategories();
      }

      // Count templates per category
      const categoryCounts: Record<string, number> = {};
      (data as any[])?.forEach((row: any) => {
        const cat = row?.category;
        if (typeof cat === 'string') {
          categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        }
      });

      return this.getFallbackCategories().map(cat => ({
        ...cat,
        templateCount: categoryCounts[cat.id] || 0,
      }));
    } catch (error) {
      console.error('Error in getTemplateCategories:', error);
      return this.getFallbackCategories();
    }
  }

  /**
   * Get a specific template by ID
   */
  async getTemplate(id: string): Promise<FunnelTemplate | null> {
    try {
      // First try to get from database
      const { data, error } = await supabase
        .from('funnel_templates')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        return {
          id: (data as any).id,
          name: (data as any).name,
          description: (data as any).description || '',
          category: (data as any).category,
          theme: (data as any).theme || 'default',
          stepCount: (data as any).step_count || 1,
          isOfficial: (data as any).is_official || false,
          usageCount: (data as any).usage_count || 0,
          tags: (data as any).tags || [],
          thumbnailUrl: (data as any).thumbnail_url || undefined,
          templateData: (data as any).template_data || {},
          components: Array.isArray((data as any).components) ? (data as any).components : [],
          createdAt: (data as any).created_at || new Date().toISOString(),
          updatedAt: (data as any).updated_at || new Date().toISOString(),
        };
      }

      // Fallback to step templates for the 21-step system
      return await this.getStepTemplate(id);
    } catch (error) {
      console.error('Error fetching template:', error);
      return null;
    }
  }

  /**
   * Load step template (for the 21-step system)
   */
  async getStepTemplate(stepId: string): Promise<FunnelTemplate | null> {
    try {
      // Handle step templates like "step-01", "step-02", etc.
      const stepNumber = stepId.match(/step-?(\d+)/)?.[1];
      if (!stepNumber) return null;

      const paddedStep = stepNumber.padStart(2, '0');
      const templatePath = `/templates/step-${paddedStep}-template.json`;

      // Load the JSON template file
      const response = await fetch(templatePath);
      if (!response.ok) {
        console.warn(`Template not found: ${templatePath}`);
        return null;
      }

      const templateData = await response.json();

      return {
        id: stepId,
        name: templateData.metadata?.name || `Etapa ${stepNumber}`,
        description: templateData.metadata?.description || `Template da etapa ${stepNumber}`,
        category: templateData.metadata?.category || 'quiz-step',
        theme: templateData.design?.theme || 'default',
        stepCount: 1,
        isOfficial: true,
        usageCount: 0,
        tags: templateData.metadata?.tags || ['etapa', 'quiz'],
        templateData,
        components: templateData.blocks || [],
        createdAt: templateData.metadata?.createdAt || new Date().toISOString(),
        updatedAt: templateData.metadata?.updatedAt || new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error loading step template:', error);
      return null;
    }
  }

  /**
   * Create funnel from template
   */
  async createFunnelFromTemplate(templateId: string, funnelName?: string): Promise<string | null> {
    try {
      const template = await this.getTemplate(templateId);
      if (!template) {
        throw new Error('Template not found');
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create new funnel
      const { data: funnel, error: funnelError } = await supabase
        .from('funnels')
        .insert([
          {
            id: genId(),
            name: funnelName || `${template.name} - Cópia`,
            description: template.description,
            user_id: user.id,
            settings: {
              theme: template.theme,
              template_id: templateId,
              created_from_template: true,
            },
          },
        ])
        .select()
        .single();

      if (funnelError) {
        throw funnelError;
      }

      // Create components from template
      if (template.components && template.components.length > 0) {
        const components = template.components.map((comp, index) => ({
          component_type_key: comp.type || 'text-inline',
          funnel_id: funnel.id,
          instance_key: comp.id || `component-${index}`,
          step_number: comp.stepNumber || 1,
          order_index: index,
          properties: comp.properties || {},
          custom_styling: comp.styling || {},
          is_active: true,
        }));

        const { error: componentsError } = await supabase
          .from('component_instances')
          .insert(components);

        if (componentsError) {
          console.error('Error creating components:', componentsError);
        }
      }

      return funnel.id;
    } catch (error) {
      console.error('Error creating funnel from template:', error);
      return null;
    }
  }

  /**
   * Save template to database
   */
  async saveTemplate(
    template: Omit<FunnelTemplate, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('funnel_templates')
        .insert([
          {
            name: template.name,
            description: template.description,
            category: template.category,
            theme: template.theme,
            step_count: template.stepCount,
            is_official: template.isOfficial,
            usage_count: template.usageCount,
            tags: template.tags,
            thumbnail_url: template.thumbnailUrl,
            template_data: template.templateData,
            components: template.components,
            created_by: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return (data as any).id;
    } catch (error) {
      console.error('Error saving template:', error);
      return null;
    }
  }

  /**
   * Fallback templates when database is not available
   */
  private getFallbackTemplates(category?: string): FunnelTemplate[] {
    const templates: FunnelTemplate[] = [
      {
        id: 'style-quiz-21-steps',
        name: 'Quiz de Estilo Completo (21 Etapas)',
        description: 'Funil completo para descoberta de estilo pessoal com todas as 21 etapas',
        category: 'quiz-style',
        theme: 'modern-chic',
        stepCount: 21,
        isOfficial: true,
        usageCount: 1247,
        tags: ['estilo', 'moda', 'personalidade', 'completo'],
        templateData: {},
        components: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'com-que-roupa-eu-vou',
        name: 'Com que Roupa eu Vou?',
        description: 'Quiz especializado em combinações de looks perfeitos com IA para cada ocasião',
        category: 'quiz-style',
        theme: 'fashion-ai',
        stepCount: 21,
        isOfficial: true,
        usageCount: 856,
        tags: ['moda', 'ia', 'looks', 'combinações', 'ocasiões'],
        templateData: {},
        components: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'lead-capture-simple',
        name: 'Captura de Lead Simples',
        description: 'Funil básico com 5 etapas para captura eficiente de leads',
        category: 'lead-generation',
        theme: 'business-clean',
        stepCount: 5,
        isOfficial: true,
        usageCount: 892,
        tags: ['leads', 'simples', 'conversão'],
        templateData: {},
        components: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'personality-assessment',
        name: 'Avaliação de Personalidade',
        description: 'Teste psicológico com 15 etapas para análise comportamental',
        category: 'personality-test',
        theme: 'wellness-soft',
        stepCount: 15,
        isOfficial: true,
        usageCount: 634,
        tags: ['personalidade', 'psicologia', 'comportamento'],
        templateData: {},
        components: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    if (category && category !== 'all') {
      return templates.filter(t => t.category === category);
    }

    return templates;
  }

  /**
   * Fallback categories when database is not available
   */
  private getFallbackCategories(): TemplateCategory[] {
    return [
      {
        id: 'quiz-style',
        name: 'Quiz de Estilo',
        description: 'Templates para descoberta de estilo pessoal',
        icon: 'palette',
        color: '#E91E63',
        templateCount: 0,
      },
      {
        id: 'lead-generation',
        name: 'Geração de Leads',
        description: 'Funis otimizados para captura de contatos',
        icon: 'users',
        color: '#2196F3',
        templateCount: 0,
      },
      {
        id: 'personality-test',
        name: 'Teste de Personalidade',
        description: 'Avaliações psicológicas e comportamentais',
        icon: 'heart',
        color: '#9C27B0',
        templateCount: 0,
      },
      {
        id: 'product-recommendation',
        name: 'Recomendação de Produto',
        description: 'Guias para escolha de produtos',
        icon: 'trending-up',
        color: '#4CAF50',
        templateCount: 0,
      },
      {
        id: 'assessment',
        name: 'Avaliações',
        description: 'Testes de conhecimento e habilidades',
        icon: 'file-text',
        color: '#FF9800',
        templateCount: 0,
      },
      {
        id: 'offer-funnel',
        name: 'Funil de Oferta',
        description: 'Vendas e promoções direcionadas',
        icon: 'gift',
        color: '#F44336',
        templateCount: 0,
      },
    ];
  }

  /**
   * Load all 21 step templates
   */
  async load21StepTemplates(): Promise<FunnelTemplate[]> {
    const templates: FunnelTemplate[] = [];

    for (let i = 1; i <= 21; i++) {
      const stepId = `step-${i.toString().padStart(2, '0')}`;
      const template = await this.getStepTemplate(stepId);
      if (template) {
        templates.push(template);
      }
    }

    return templates;
  }

  /**
   * Create complete 21-step funnel
   */
  async create21StepFunnel(funnelName: string = 'Quiz de Estilo Completo'): Promise<string | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create new funnel
      const { data: funnel, error: funnelError } = await supabase
        .from('funnels')
        .insert([
          {
            id: genId(),
            name: funnelName,
            description: 'Funil completo de quiz de estilo com 21 etapas',
            user_id: user.id,
            settings: {
              theme: 'style-quiz',
              template_id: 'style-quiz-21-steps',
              step_count: 21,
              created_from_template: true,
            },
          },
        ])
        .select()
        .single();

      if (funnelError) {
        throw funnelError;
      }

      // Load and create components for all 21 steps
      let componentOrder = 0;

      for (let stepNumber = 1; stepNumber <= 21; stepNumber++) {
        const stepTemplate = await this.getStepTemplate(
          `step-${stepNumber.toString().padStart(2, '0')}`
        );

        if (stepTemplate?.components) {
          const stepComponents = stepTemplate.components.map((comp: any) => ({
            component_type_key: comp.type || 'text-inline',
            funnel_id: funnel.id,
            instance_key: `step${stepNumber.toString().padStart(2, '0')}-${comp.id || comp.type}`,
            step_number: stepNumber,
            order_index: componentOrder++,
            properties: comp.properties || {},
            custom_styling: comp.styling || {},
            is_active: true,
          }));

          const { error: componentsError } = await supabase
            .from('component_instances')
            .insert(stepComponents);

          if (componentsError) {
            console.error(`Error creating components for step ${stepNumber}:`, componentsError);
          }
        }
      }

      return funnel.id;
    } catch (error) {
      console.error('Error creating 21-step funnel:', error);
      return null;
    }
  }
}

export const funnelTemplateService = new FunnelTemplateService();
