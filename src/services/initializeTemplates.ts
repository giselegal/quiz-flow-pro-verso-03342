import { supabase } from '../integrations/supabase/client';
import { quizEstiloLoaderGateway } from '@/domain/quiz/gateway';

/**
 * Script para popular templates iniciais no Supabase
 * Versão simplificada que usa insert direto com any para contornar limitações de tipos
 */
export async function populateInitialTemplates() {
  console.log('🚀 Iniciando população de templates...');

  try {
    // Template principal - Quiz 21 Etapas
    // Gera estrutura canônica atual para persistência inicial
    const canonical = await quizEstiloLoaderGateway.load();
    const quiz21Template = {
      name: 'Quiz Estilo (Canônico)',
      description: 'Definição derivada do gateway canônico (substitui quiz21StepsComplete).',
      category: 'quiz',
      template_data: {
        version: canonical.version,
        type: 'quiz-estilo-canonical',
        description: 'Template canônico unificado',
        stepsData: canonical.steps,
        source: canonical.source,
      },
      tags: ['quiz', 'canonical', 'estilo'],
      is_public: true,
      usage_count: 0,
    } as any;

    console.log('📋 Inserindo Quiz 21 Etapas...');
    const { error: error1 } = await (supabase as any)
      .from('quiz_templates')
      .insert([quiz21Template]);

    if (error1) {
      console.error('❌ Erro ao inserir Quiz 21 Etapas:', error1);
    } else {
      console.log('✅ Quiz 21 Etapas inserido com sucesso!');
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

    console.log('📋 Inserindo Quiz Básico...');
    const { error: error2 } = await (supabase as any)
      .from('quiz_templates')
      .insert([basicQuizTemplate]);

    if (error2) {
      console.error('❌ Erro ao inserir Quiz Básico:', error2);
    } else {
      console.log('✅ Quiz Básico inserido com sucesso!');
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

    console.log('📋 Inserindo Funil de Leads...');
    const { error: error3 } = await (supabase as any)
      .from('quiz_templates')
      .insert([funnelTemplate]);

    if (error3) {
      console.error('❌ Erro ao inserir Funil de Leads:', error3);
    } else {
      console.log('✅ Funil de Leads inserido com sucesso!');
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

    console.log('📋 Inserindo Landing Page...');
    const { error: error4 } = await (supabase as any)
      .from('quiz_templates')
      .insert([landingTemplate]);

    if (error4) {
      console.error('❌ Erro ao inserir Landing Page:', error4);
    } else {
      console.log('✅ Landing Page inserida com sucesso!');
    }

    console.log('🎉 Processo de população de templates concluído!');
    return true;
  } catch (error) {
    console.error('💥 Erro geral no processo:', error);
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
      console.error('Erro ao verificar templates:', error);
      return false;
    }

    const count = data?.length || 0;
    console.log(`📊 Templates existentes: ${count}`);
    return count > 0;
  } catch (error) {
    console.error('Erro na verificação:', error);
    return false;
  }
}

/**
 * Função principal para inicializar templates
 */
export async function initializeTemplates() {
  console.log('🔧 Verificando estado dos templates...');

  const hasTemplates = await checkExistingTemplates();

  if (hasTemplates) {
    console.log('✅ Templates já existem no banco de dados.');
    return true;
  }

  console.log('⚠️ Nenhum template encontrado. Iniciando população...');
  return await populateInitialTemplates();
}
