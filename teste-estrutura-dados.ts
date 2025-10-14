// Script de teste para verificar estrutura dos dados no Supabase
// Execute no console do navegador após abrir o editor

async function testarEstruturaSupabase() {
    console.clear();
    console.log('=== 🧪 TESTE DE ESTRUTURA DE DADOS ===\n');

    // 1. Verificar Supabase
    console.log('1️⃣ Verificando conexão Supabase...');
    const supabase = (window as any).supabase;
    if (!supabase) {
        console.error('❌ Supabase não disponível no window');
        return;
    }
    console.log('✅ Supabase disponível\n');

    // 2. Buscar funnel atual da URL
    const params = new URLSearchParams(window.location.search);
    const funnelId = params.get('funnel');
    console.log('2️⃣ Funnel ID da URL:', funnelId || 'Nenhum\n');

    // 3. Listar todos os drafts
    console.log('3️⃣ Buscando drafts no banco...');
    const { data: drafts, error } = await supabase
        .from('quiz_funnel_drafts')
        .select('id, name, created_at, updated_at')
        .order('updated_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error('❌ Erro ao buscar drafts:', error);
    } else {
        console.log(`✅ Encontrados ${drafts?.length || 0} drafts:\n`);
        drafts?.forEach((d: any, idx: number) => {
            console.log(`${idx + 1}. ${d.name} (${d.id})`);
            console.log(`   Atualizado: ${new Date(d.updated_at).toLocaleString()}\n`);
        });
    }

    // 4. Se tiver funnelId, buscar detalhes
    if (funnelId) {
        console.log(`4️⃣ Buscando detalhes do funnel: ${funnelId}...`);
        const { data: funnel, error: funnelError } = await supabase
            .from('quiz_funnel_drafts')
            .select('*')
            .eq('id', funnelId)
            .single();

        if (funnelError) {
            console.error('❌ Erro ao buscar funnel:', funnelError);
        } else {
            console.log('✅ Funnel encontrado:', funnel.name);
            console.log('   Steps:', funnel.steps?.length || 0);

            // 5. Procurar blocos quiz-options
            console.log('\n5️⃣ Procurando blocos quiz-options...');
            let foundCount = 0;

            funnel.steps?.forEach((step: any, stepIdx: number) => {
                step.blocks?.forEach((block: any, blockIdx: number) => {
                    if (block.type === 'quiz-options' || block.type === 'options-grid') {
                        foundCount++;
                        console.log(`\n🎯 Bloco ${foundCount} (Step ${stepIdx + 1}, Block ${blockIdx + 1}):`);
                        console.log('   Tipo:', block.type);
                        console.log('   ID:', block.id);

                        // Verificar onde estão as options
                        const optionsInContent = block.content?.options;
                        const optionsInProperties = block.properties?.options;

                        console.log('\n   📦 CONTENT:');
                        if (optionsInContent) {
                            console.log(`   ✅ options encontradas (${optionsInContent.length} itens)`);
                            if (optionsInContent[0]) {
                                const opt = optionsInContent[0];
                                console.log('   📝 Primeira opção:', {
                                    id: opt.id,
                                    text: opt.text,
                                    imageUrl: opt.imageUrl || opt.image || '❌ AUSENTE',
                                    points: opt.points ?? opt.score ?? '❌ AUSENTE',
                                    category: opt.category || '❌ AUSENTE',
                                    value: opt.value
                                });
                            }
                        } else {
                            console.log('   ❌ options NÃO encontradas em content');
                        }

                        console.log('\n   📦 PROPERTIES:');
                        if (optionsInProperties) {
                            console.log(`   ✅ options encontradas (${optionsInProperties.length} itens)`);
                            if (optionsInProperties[0]) {
                                const opt = optionsInProperties[0];
                                console.log('   📝 Primeira opção:', {
                                    id: opt.id,
                                    text: opt.text,
                                    imageUrl: opt.imageUrl || opt.image || '❌ AUSENTE',
                                    points: opt.points ?? opt.score ?? '❌ AUSENTE',
                                    category: opt.category || '❌ AUSENTE'
                                });
                            }
                        } else {
                            console.log('   ❌ options NÃO encontradas em properties');
                        }

                        // Mostrar campos completos do bloco
                        if (foundCount === 1) {
                            console.log('\n   📋 ESTRUTURA COMPLETA DO BLOCO:');
                            console.log(JSON.stringify(block, null, 2));
                        }
                    }
                });
            });

            if (foundCount === 0) {
                console.log('⚠️ Nenhum bloco quiz-options encontrado!');
            } else {
                console.log(`\n✅ Total: ${foundCount} blocos quiz-options encontrados`);
            }
        }
    } else {
        console.log('⚠️ Nenhum funnelId na URL. Adicione ?funnel=SEU_ID para testar um funnel específico');
    }

    console.log('\n=== FIM DO TESTE ===');
}

// Executar automaticamente
console.log('🧪 Iniciando teste de estrutura de dados...\n');
testarEstruturaSupabase();
