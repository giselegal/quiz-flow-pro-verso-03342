import { supabase } from '@/services/integrations/supabase/client';
import { templateService } from '@/services/canonical/TemplateService';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * Script para popular templates iniciais no Supabase
 * Versão simplificada que usa insert direto com any para contornar limitações de tipos
 */
export async function populateInitialTemplates() {
  appLogger.info('🚀 Iniciando população de templates...');

  try {
    // Template principal - Quiz 21 Etapas
    const quiz21Template = {
      name: 'Quiz Profissional 21 Etapas',
      description:
        'Sistema completo de descoberta de estilo pessoal com 21 etapas estruturadas, incluindo questões de personalidade, análise de estilo e ofertas estratégicas.',
      category: 'quiz',
      template_data: {
        version: '2.0.0',
        type: '21-steps-quiz',
        description: 'Template completo com 21 etapas',
        hasIntro: true,
        hasQuestions: true,
        hasResult: true,
        hasOffer: true,
  stepsData: templateService.getAllStepsSync(),
      },
      tags: ['quiz', 'personalidade', 'estilo', '21-etapas'],
      is_public: true,
      usage_count: 0,
    };

    appLogger.info('📋 Inserindo Quiz 21 Etapas...');
    const { error: error1 } = await (supabase as any)
      .from('quiz_templates')
      .insert([quiz21Template]);

    if (error1) {
      appLogger.error('❌ Erro ao inserir Quiz 21 Etapas:', { data: [error1] });
    } else {
      appLogger.info('✅ Quiz 21 Etapas inserido com sucesso!');
    }

    // Template básico
    const basicQuizTemplate = {
      name: 'Quiz de Personalidade Básico',
      description:
        'Template simples para descoberta de perfil pessoal com questões essenciais e resultado direto.',
      category: 'quiz',
      template_data: {
        version: '1.0.0',
        type: 'basic-quiz',
        description: 'Template básico com 5-8 etapas',
        hasIntro: true,
        hasQuestions: true,
        hasResult: true,
        hasOffer: false,
      },
      tags: ['quiz', 'básico', 'personalidade'],
      is_public: true,
      usage_count: 0,
    };

    appLogger.info('📋 Inserindo Quiz Básico...');
    const { error: error2 } = await (supabase as any)
      .from('quiz_templates')
      .insert([basicQuizTemplate]);

    if (error2) {
      appLogger.error('❌ Erro ao inserir Quiz Básico:', { data: [error2] });
    } else {
      appLogger.info('✅ Quiz Básico inserido com sucesso!');
    }

    // Template de funil
    const funnelTemplate = {
      name: 'Funil de Captação de Leads',
      description:
        'Template otimizado para captação de leads qualificados com estratégias de conversão comprovadas.',
      category: 'funnel',
      template_data: {
        version: '1.0.0',
        type: 'lead-funnel',
        description: 'Funil com captação e nurturing',
        hasLanding: true,
        hasForm: true,
        hasEmail: true,
        hasOffer: true,
      },
      tags: ['funil', 'leads', 'captação'],
      is_public: true,
      usage_count: 0,
    };

    appLogger.info('📋 Inserindo Funil de Leads...');
    const { error: error3 } = await (supabase as any)
      .from('quiz_templates')
      .insert([funnelTemplate]);

    if (error3) {
      appLogger.error('❌ Erro ao inserir Funil de Leads:', { data: [error3] });
    } else {
      appLogger.info('✅ Funil de Leads inserido com sucesso!');
    }

    // Template de landing page
    const landingTemplate = {
      name: 'Landing Page Conversão',
      description:
        'Template clean e otimizado para apresentação de produtos com foco em conversão.',
      category: 'landing',
      template_data: {
        version: '1.0.0',
        type: 'conversion-landing',
        description: 'Landing page otimizada',
        hasHero: true,
        hasBenefits: true,
        hasTestimonials: true,
        hasCTA: true,
      },
      tags: ['landing', 'conversão', 'vendas'],
      is_public: true,
      usage_count: 0,
    };

    appLogger.info('📋 Inserindo Landing Page...');
    const { error: error4 } = await (supabase as any)
      .from('quiz_templates')
      .insert([landingTemplate]);

    if (error4) {
      appLogger.error('❌ Erro ao inserir Landing Page:', { data: [error4] });
    } else {
      appLogger.info('✅ Landing Page inserida com sucesso!');
    }

    appLogger.info('🎉 Processo de população de templates concluído!');
    return true;
  } catch (error) {
    appLogger.error('💥 Erro geral no processo:', { data: [error] });
    return false;
  }
}

/**
 * Verificar se templates já existem
 */
export async function checkExistingTemplates() {
  try {
    const { data, error } = await (supabase as any)
      .from('quiz_templates')
      .select('id', { count: 'exact' });

    if (error) {
      appLogger.error('Erro ao verificar templates:', { data: [error] });
      return false;
    }

    const count = data?.length || 0;
    appLogger.info(`📊 Templates existentes: ${count}`);
    return count > 0;
  } catch (error) {
    appLogger.error('Erro na verificação:', { data: [error] });
    return false;
  }
}

/**
 * Função principal para inicializar templates
 */
export async function initializeTemplates() {
  appLogger.info('🔧 Verificando estado dos templates...');

  const hasTemplates = await checkExistingTemplates();

  if (hasTemplates) {
    appLogger.info('✅ Templates já existem no banco de dados.');
    return true;
  }

  appLogger.info('⚠️ Nenhum template encontrado. Iniciando população...');
  return await populateInitialTemplates();
}
