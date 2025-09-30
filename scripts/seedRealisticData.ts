#!/usr/bin/env node
/**
 * 🌱 SEED REALISTIC DATA - Gerador de Dados Sintéticos Realistas
 * 
 * Gera 1000 sessões de quiz distribuídas nos últimos 30 dias
 * com comportamentos realistas para popular o dashboard.
 * 
 * Uso: npx tsx scripts/seedRealisticData.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY são obrigatórias');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Configurações
const TOTAL_SESSIONS = 1000;
const DAYS_BACK = 30;
const FUNNEL_ID = 'quiz-estilo-pessoal';

// Distribuições realistas
const COMPLETION_RATE = 0.7; // 70% completam
const DEVICE_DISTRIBUTION = { mobile: 0.6, desktop: 0.3, tablet: 0.1 };
const STYLE_RESULTS = ['Clássico', 'Moderno', 'Casual', 'Elegante', 'Esportivo', 'Romântico'];
const UTM_SOURCES = ['google', 'facebook', 'instagram', 'direct', 'email'];
const UTM_CAMPAIGNS = ['quiz-estilo', 'discovery', 'retargeting', 'influencer'];

function randomDate(daysBack: number): Date {
  const now = new Date();
  const past = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
  return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()));
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDevice(): string {
  const rand = Math.random();
  if (rand < DEVICE_DISTRIBUTION.mobile) return 'mobile';
  if (rand < DEVICE_DISTRIBUTION.mobile + DEVICE_DISTRIBUTION.desktop) return 'desktop';
  return 'tablet';
}

function generateUserAgent(device: string): string {
  const agents = {
    mobile: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
    desktop: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    tablet: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
  };
  return agents[device as keyof typeof agents];
}

function randomEmail(): string {
  const domains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com'];
  const name = `user${Math.floor(Math.random() * 10000)}`;
  return `${name}@${randomChoice(domains)}`;
}

function randomName(): string {
  const firstNames = ['Ana', 'João', 'Maria', 'Carlos', 'Julia', 'Pedro', 'Beatriz', 'Lucas'];
  const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Costa', 'Ferreira', 'Rodrigues'];
  return `${randomChoice(firstNames)} ${randomChoice(lastNames)}`;
}

async function seedData() {
  console.log('🌱 Iniciando seed de dados realistas...\n');

  const startTime = Date.now();
  let successCount = 0;

  for (let i = 0; i < TOTAL_SESSIONS; i++) {
    try {
      const isComplete = Math.random() < COMPLETION_RATE;
      const device = randomDevice();
      const startedAt = randomDate(DAYS_BACK);
      const currentStep = isComplete ? 21 : Math.floor(Math.random() * 20) + 1;
      
      // Criar quiz_user
      const { data: quizUser, error: userError } = await supabase
        .from('quiz_users')
        .insert({
          name: isComplete ? randomName() : null,
          email: isComplete ? randomEmail() : null,
          session_id: `session-${Date.now()}-${i}`,
          ip_address: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          user_agent: generateUserAgent(device),
          utm_source: randomChoice(UTM_SOURCES),
          utm_campaign: randomChoice(UTM_CAMPAIGNS),
          utm_medium: device === 'mobile' ? 'cpc' : 'organic',
        })
        .select()
        .single();

      if (userError || !quizUser) {
        console.error(`❌ Erro ao criar quiz_user ${i}:`, userError);
        continue;
      }

      // Criar quiz_session
      const completedAt = isComplete 
        ? new Date(startedAt.getTime() + Math.random() * 900000) // até 15min depois
        : null;

      const { data: session, error: sessionError } = await supabase
        .from('quiz_sessions')
        .insert({
          funnel_id: FUNNEL_ID,
          quiz_user_id: quizUser.id,
          status: isComplete ? 'completed' : 'in_progress',
          current_step: currentStep,
          total_steps: 21,
          score: isComplete ? Math.floor(Math.random() * 100) + 50 : 0,
          max_score: 150,
          started_at: startedAt.toISOString(),
          completed_at: completedAt?.toISOString(),
          last_activity: (completedAt || startedAt).toISOString(),
          metadata: {
            device,
            browser: device === 'mobile' ? 'Safari' : 'Chrome',
            language: 'pt-BR',
            referrer: randomChoice(['google', 'facebook', 'direct'])
          }
        })
        .select()
        .single();

      if (sessionError || !session) {
        console.error(`❌ Erro ao criar session ${i}:`, sessionError);
        continue;
      }

      // Criar step responses (apenas para sessões completas)
      if (isComplete) {
        const responses = [];
        for (let step = 1; step <= 21; step++) {
          responses.push({
            session_id: session.id,
            question_id: `question-${step}`,
            question_text: `Pergunta ${step}`,
            step_number: step,
            answer_value: randomChoice(['A', 'B', 'C', 'D']),
            answer_text: randomChoice(['Sim', 'Não', 'Talvez', 'Às vezes']),
            score_earned: Math.floor(Math.random() * 10),
            response_time_ms: Math.floor(Math.random() * 5000) + 1000,
            metadata: { confidence: Math.random() }
          });
        }

        const { error: responsesError } = await supabase
          .from('quiz_step_responses')
          .insert(responses);

        if (responsesError) {
          console.error(`❌ Erro ao criar responses ${i}:`, responsesError);
        }

        // Criar resultado final
        const resultType = randomChoice(STYLE_RESULTS);
        const { error: resultError } = await supabase
          .from('quiz_results')
          .insert({
            session_id: session.id,
            result_type: resultType,
            result_title: `Seu estilo é ${resultType}!`,
            result_description: `Você tem um estilo ${resultType.toLowerCase()} único e marcante.`,
            recommendation: `Recomendamos peças que valorizem seu estilo ${resultType.toLowerCase()}.`,
            result_data: {
              primary_style: resultType,
              secondary_style: randomChoice(STYLE_RESULTS.filter(s => s !== resultType)),
              confidence_score: Math.random() * 0.3 + 0.7 // 70-100%
            },
            next_steps: [
              { step: 1, title: 'Ver produtos', url: '/produtos' },
              { step: 2, title: 'Agendar consultoria', url: '/consultoria' }
            ]
          });

        if (resultError) {
          console.error(`❌ Erro ao criar result ${i}:`, resultError);
        }

        // Criar analytics events
        const events = [
          { event_type: 'quiz_started', event_data: { step: 1 } },
          { event_type: 'quiz_completed', event_data: { step: 21, result: resultType } },
        ];

        const { error: analyticsError } = await supabase
          .from('quiz_analytics')
          .insert(events.map(e => ({
            funnel_id: FUNNEL_ID,
            session_id: session.id,
            user_id: quizUser.id,
            event_type: e.event_type,
            event_data: e.event_data,
            timestamp: completedAt!.toISOString()
          })));

        if (analyticsError) {
          console.error(`❌ Erro ao criar analytics ${i}:`, analyticsError);
        }
      }

      successCount++;
      
      if ((i + 1) % 100 === 0) {
        console.log(`✅ Progresso: ${i + 1}/${TOTAL_SESSIONS} sessões criadas`);
      }

    } catch (error) {
      console.error(`❌ Erro geral na sessão ${i}:`, error);
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  
  console.log('\n' + '='.repeat(60));
  console.log('🎉 SEED CONCLUÍDO COM SUCESSO!');
  console.log('='.repeat(60));
  console.log(`✅ Total de sessões criadas: ${successCount}/${TOTAL_SESSIONS}`);
  console.log(`⏱️  Tempo de execução: ${duration}s`);
  console.log(`📊 Taxa de conclusão: ${(successCount / TOTAL_SESSIONS * 100).toFixed(1)}%`);
  console.log('\n📈 Próximos passos:');
  console.log('   1. Acesse /admin para visualizar o dashboard');
  console.log('   2. Verifique as métricas e gráficos');
  console.log('   3. Teste os filtros e análises');
  console.log('='.repeat(60) + '\n');
}

// Executar seed
seedData().catch(error => {
  console.error('💥 Erro fatal durante seed:', error);
  process.exit(1);
});
