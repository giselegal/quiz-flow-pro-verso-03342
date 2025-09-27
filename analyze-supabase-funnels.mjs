#!/usr/bin/env node

/**
 * 🔍 SCRIPT DE ANÁLISE DOS FUNIS SUPABASE
 * 
 * Este script consulta diretamente a base Supabase para analisar:
 * - Estrutura dos funis existentes
 * - Campos e dados
 * - Relacionamentos
 * - Exemplos de dados reais
 */

import { createClient } from '@supabase/supabase-js';

// Configuração Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://mqvshyxubakvsaxqtmpr.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xdnNoeXh1YmFrdnNheHF0bXByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU1ODQwMzQsImV4cCI6MjA0MTE2NDAzNH0.eBh_TR4VpiVe3jpNvQNs_vX5Zr2pTvZA0FswDlP8tGo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeFunnels() {
    console.log('🔍 ANÁLISE COMPLETA DOS FUNIS NO SUPABASE');
    console.log('=====================================\n');

    try {
        // 1. Listar todos os funis
        console.log('📊 1. CONSULTANDO FUNIS EXISTENTES...\n');

        const { data: funnels, error: funnelsError } = await supabase
            .from('funnels')
            .select(`
                id,
                name,
                description,
                user_id,
                is_published,
                settings,
                version,
                created_at,
                updated_at
            `)
            .order('created_at', { ascending: false })
            .limit(10);

        if (funnelsError) {
            console.error('❌ Erro ao consultar funis:', funnelsError);
            return;
        }

        if (!funnels || funnels.length === 0) {
            console.log('⚠️ Nenhum funil encontrado na base.');
            return;
        }

        console.log(`✅ Encontrados ${funnels.length} funis:\n`);

        funnels.forEach((funnel, index) => {
            console.log(`${index + 1}. 🎯 FUNIL: ${funnel.name}`);
            console.log(`   ID: ${funnel.id}`);
            console.log(`   Descrição: ${funnel.description || 'Sem descrição'}`);
            console.log(`   Publicado: ${funnel.is_published ? '✅' : '❌'}`);
            console.log(`   Versão: ${funnel.version || 'N/A'}`);
            console.log(`   Criado: ${new Date(funnel.created_at).toLocaleString()}`);
            console.log(`   Settings: ${JSON.stringify(funnel.settings, null, 2)}`);
            console.log('   ---');
        });

        // 2. Consultar páginas do primeiro funil
        if (funnels.length > 0) {
            console.log('\n📄 2. CONSULTANDO PÁGINAS DO PRIMEIRO FUNIL...\n');

            const firstFunnelId = funnels[0].id;

            const { data: pages, error: pagesError } = await supabase
                .from('funnel_pages')
                .select(`
                    id,
                    page_type,
                    title,
                    page_order,
                    settings,
                    blocks,
                    created_at
                `)
                .eq('funnel_id', firstFunnelId)
                .order('page_order', { ascending: true });

            if (pagesError) {
                console.error('❌ Erro ao consultar páginas:', pagesError);
            } else if (pages) {
                console.log(`✅ Encontradas ${pages.length} páginas no funil "${funnels[0].name}":\n`);

                pages.forEach((page, index) => {
                    console.log(`${index + 1}. 📝 PÁGINA: ${page.title}`);
                    console.log(`   ID: ${page.id}`);
                    console.log(`   Tipo: ${page.page_type}`);
                    console.log(`   Ordem: ${page.page_order}`);
                    console.log(`   Blocks: ${page.blocks ? JSON.stringify(page.blocks, null, 2) : 'Nenhum'}`);
                    console.log(`   Settings: ${page.settings ? JSON.stringify(page.settings, null, 2) : 'Nenhum'}`);
                    console.log('   ---');
                });
            }
        }

        // 3. Consultar componentes do primeiro funil
        if (funnels.length > 0) {
            console.log('\n🧩 3. CONSULTANDO COMPONENTES DO PRIMEIRO FUNIL...\n');

            const firstFunnelId = funnels[0].id;

            const { data: components, error: componentsError } = await supabase
                .from('component_instances')
                .select(`
                    id,
                    component_type,
                    properties,
                    page_id,
                    display_order,
                    created_at
                `)
                .eq('funnel_id', firstFunnelId)
                .order('display_order', { ascending: true });

            if (componentsError) {
                console.error('❌ Erro ao consultar componentes:', componentsError);
            } else if (components) {
                console.log(`✅ Encontrados ${components.length} componentes no funil "${funnels[0].name}":\n`);

                components.forEach((component, index) => {
                    console.log(`${index + 1}. 🔧 COMPONENTE: ${component.component_type}`);
                    console.log(`   ID: ${component.id}`);
                    console.log(`   Página: ${component.page_id}`);
                    console.log(`   Ordem: ${component.display_order}`);
                    console.log(`   Properties: ${component.properties ? JSON.stringify(component.properties, null, 2) : 'Nenhuma'}`);
                    console.log('   ---');
                });
            }
        }

        // 4. Consultar sessões de quiz relacionadas
        console.log('\n🎮 4. CONSULTANDO SESSÕES DE QUIZ...\n');

        const { data: sessions, error: sessionsError } = await supabase
            .from('quiz_sessions')
            .select(`
                id,
                funnel_id,
                quiz_user_id,
                status,
                current_step,
                total_steps,
                score,
                started_at,
                completed_at
            `)
            .order('started_at', { ascending: false })
            .limit(5);

        if (sessionsError) {
            console.error('❌ Erro ao consultar sessões:', sessionsError);
        } else if (sessions) {
            console.log(`✅ Encontradas ${sessions.length} sessões de quiz:\n`);

            sessions.forEach((session, index) => {
                console.log(`${index + 1}. 🎯 SESSÃO: ${session.id}`);
                console.log(`   Funil: ${session.funnel_id}`);
                console.log(`   Usuário: ${session.quiz_user_id}`);
                console.log(`   Status: ${session.status}`);
                console.log(`   Progresso: ${session.current_step}/${session.total_steps}`);
                console.log(`   Score: ${session.score}`);
                console.log(`   Iniciado: ${new Date(session.started_at).toLocaleString()}`);
                console.log(`   Finalizado: ${session.completed_at ? new Date(session.completed_at).toLocaleString() : 'Em andamento'}`);
                console.log('   ---');
            });
        }

        console.log('\n🎉 ANÁLISE CONCLUÍDA!');

    } catch (error) {
        console.error('❌ Erro geral na análise:', error);
    }
}

// Executar análise
analyzeFunnels().catch(console.error);