/**
 * 🔍 ANÁLISE DOS FUNIS SUPABASE - Versão TypeScript
 * 
 * Script para consultar e analisar a estrutura dos funis no Supabase
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './src/integrations/supabase/types';

const supabaseUrl = 'https://mqvshyxubakvsaxqtmpr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xdnNoeXh1YmFrdnNheHF0bXByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU1ODQwMzQsImV4cCI6MjA0MTE2NDAzNH0.eBh_TR4VpiVe3jpNvQNs_vX5Zr2pTvZA0FswDlP8tGo';

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

async function analyzeFunnelsStructure() {
    console.log('🔍 ANÁLISE DA ESTRUTURA DOS FUNIS NO SUPABASE');
    console.log('============================================\n');

    try {
        // 1. Consultar funis existentes
        console.log('📊 1. FUNIS EXISTENTES:\n');

        const { data: funnels, error: funnelsError } = await supabase
            .from('funnels')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);

        if (funnelsError) {
            console.error('❌ Erro ao consultar funis:', funnelsError.message);
            console.log('📋 Estrutura esperada dos funis baseada no types.ts:\n');

            // Mostrar estrutura baseada no types.ts
            console.log(`🏗️ ESTRUTURA DA TABELA FUNNELS:
            - id: string (UUID)
            - name: string
            - description: string | null
            - user_id: string | null (UUID)
            - is_published: boolean | null
            - settings: Json | null
            - version: number | null
            - created_at: string | null (timestamp)
            - updated_at: string | null (timestamp)
            `);

            return;
        }

        if (!funnels || funnels.length === 0) {
            console.log('⚠️ Nenhum funil encontrado na base de dados.');
            console.log('🆕 Isso significa que quando você acessa /editor, um novo funil será criado dinamicamente.\n');
            return;
        }

        console.log(`✅ Encontrados ${funnels.length} funis na base:\n`);

        funnels.forEach((funnel, index) => {
            console.log(`${index + 1}. 🎯 FUNIL: "${funnel.name}"`);
            console.log(`   📍 ID: ${funnel.id}`);
            console.log(`   👤 User ID: ${funnel.user_id || 'Anônimo'}`);
            console.log(`   📝 Descrição: ${funnel.description || 'Sem descrição'}`);
            console.log(`   ✅ Publicado: ${funnel.is_published ? 'Sim' : 'Não'}`);
            console.log(`   🔢 Versão: ${funnel.version || 'N/A'}`);
            console.log(`   📅 Criado: ${funnel.created_at ? new Date(funnel.created_at).toLocaleString() : 'N/A'}`);
            console.log(`   ⚙️ Settings: ${funnel.settings ? JSON.stringify(funnel.settings, null, 4) : 'Nenhuma'}`);
            console.log(`   ${'─'.repeat(60)}\n`);
        });

        // 2. Para cada funil, consultar suas sessões
        console.log('🎮 2. SESSÕES DE QUIZ RELACIONADAS:\n');

        for (const funnel of funnels.slice(0, 3)) { // Limitar a 3 funis
            const { data: sessions, error: sessionsError } = await supabase
                .from('quiz_sessions')
                .select('*')
                .eq('funnel_id', funnel.id)
                .order('started_at', { ascending: false })
                .limit(5);

            if (sessionsError) {
                console.log(`   ❌ Erro ao consultar sessões do funil "${funnel.name}": ${sessionsError.message}`);
                continue;
            }

            console.log(`   📊 Funil: "${funnel.name}" (${funnel.id})`);
            if (!sessions || sessions.length === 0) {
                console.log(`   ⚠️ Nenhuma sessão encontrada para este funil.\n`);
                continue;
            }

            console.log(`   ✅ ${sessions.length} sessões encontradas:\n`);

            sessions.forEach((session, index) => {
                console.log(`      ${index + 1}. 🎯 Sessão: ${session.id}`);
                console.log(`         👤 Usuário: ${session.quiz_user_id}`);
                console.log(`         📊 Status: ${session.status}`);
                console.log(`         📈 Progresso: ${session.current_step}/${session.total_steps} passos`);
                console.log(`         🏆 Score: ${session.score}/${session.max_score || 'N/A'}`);
                console.log(`         🕒 Iniciado: ${new Date(session.started_at).toLocaleString()}`);
                console.log(`         ✅ Concluído: ${session.completed_at ? new Date(session.completed_at).toLocaleString() : 'Em andamento'}`);
                console.log(`         🔧 Metadata: ${session.metadata ? JSON.stringify(session.metadata, null, 6) : 'Nenhuma'}`);
                console.log(`         ${'-'.repeat(40)}`);
            });
            console.log('');
        }

        // 3. Análise resumida
        console.log('📋 3. RESUMO DA ANÁLISE:\n');
        console.log(`   📊 Total de funis: ${funnels.length}`);
        console.log(`   🏷️ Funis publicados: ${funnels.filter(f => f.is_published).length}`);
        console.log(`   👥 Funis com user_id: ${funnels.filter(f => f.user_id).length}`);
        console.log(`   ⚙️ Funis com settings: ${funnels.filter(f => f.settings).length}`);

        const funnelTypes = funnels.map(f => {
            if (!f.settings) return 'sem-configuração';
            const settings = typeof f.settings === 'string' ? JSON.parse(f.settings) : f.settings;
            return settings?.type || settings?.templateId || 'genérico';
        });

        console.log(`   🎨 Tipos identificados: ${[...new Set(funnelTypes)].join(', ')}\n`);

        console.log('🎯 CONCLUSÃO:');
        if (funnels.length > 0) {
            console.log('   ✅ Há funis existentes na base Supabase.');
            console.log('   🔄 Quando você acessa /editor sem parâmetro, o sistema pode carregar um destes ou criar um novo.');
            console.log('   📝 Para carregar um funil específico, use /editor/{funnel-id}');
        } else {
            console.log('   📝 Não há funis pré-existentes na base.');
            console.log('   🆕 Ao acessar /editor, um novo funil será criado automaticamente.');
        }

    } catch (error) {
        console.error('❌ Erro geral na análise:', error);
    }
}

// Executar análise
analyzeFunnelsStructure().catch(console.error);