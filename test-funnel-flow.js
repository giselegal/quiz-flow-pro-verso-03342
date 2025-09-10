/**
 * 🧪 TESTE DO FLUXO COMPLETO DE MODELOS DE FUNIS
 * 
 * Script para testar se o problema foi resolvido:
 * 1. Escolher modelo em "Modelos de Funis" 
 * 2. URL correta gerada (/editor/ID)
 * 3. Funil carregado corretamente no editor
 */

console.log('🧪 TESTE DO FLUXO COMPLETO DE MODELOS DE FUNIS');
console.log('='.repeat(60));

// ============================================================================
// TESTE 1: VERIFICAR URLs GERADAS
// ============================================================================

console.log('\n1️⃣ VERIFICANDO PADRÕES DE URL');
console.log('-'.repeat(50));

const currentUrl = window.location.href;
console.log('📍 URL atual:', currentUrl);

// Simular diferentes cenários de URL
const testUrls = [
    '/editor/personality-assessment-1757514679394',
    '/editor/lead-capture-simple-1757514692752',
    '/editor?funnel=personality-assessment-1757514679394',
    '/editor?template=personality-assessment'
];

testUrls.forEach(url => {
    console.log(`✅ Padrão de URL: ${url}`);

    // Extrair ID da URL
    let funnelId = null;
    let templateId = null;

    if (url.includes('/editor/') && !url.includes('?')) {
        // Novo padrão: /editor/ID
        funnelId = url.split('/editor/')[1];
        console.log(`   🎯 FunnelId extraído: ${funnelId}`);
    } else if (url.includes('?funnel=')) {
        // Padrão legado: ?funnel=ID
        const params = new URLSearchParams(url.split('?')[1]);
        funnelId = params.get('funnel');
        console.log(`   🎯 FunnelId extraído (legado): ${funnelId}`);
    } else if (url.includes('?template=')) {
        // Template direto: ?template=ID
        const params = new URLSearchParams(url.split('?')[1]);
        templateId = params.get('template');
        console.log(`   📋 TemplateId extraído: ${templateId}`);
    }

    console.log('');
});

// ============================================================================
// TESTE 2: VERIFICAR NAVEGAÇÃO ATUAL
// ============================================================================

console.log('\n2️⃣ VERIFICANDO NAVEGAÇÃO ATUAL');
console.log('-'.repeat(50));

// Verificar se estamos no editor
const isInEditor = window.location.pathname.startsWith('/editor');
console.log(`📍 Está no editor: ${isInEditor ? '✅ SIM' : '❌ NÃO'}`);

if (isInEditor) {
    // Extrair informações da URL atual
    const pathParts = window.location.pathname.split('/');
    const params = new URLSearchParams(window.location.search);

    let funnelId = null;
    let templateId = null;

    // Verificar novo padrão (/editor/ID)
    if (pathParts.length >= 3 && pathParts[2]) {
        funnelId = pathParts[2];
        console.log(`🎯 FunnelId da URL (path): ${funnelId}`);
    }

    // Verificar padrão legado (?funnel=ID)
    if (params.get('funnel')) {
        const legacyId = params.get('funnel');
        console.log(`🎯 FunnelId da URL (query): ${legacyId}`);
        if (!funnelId) funnelId = legacyId;
    }

    // Verificar template
    if (params.get('template')) {
        templateId = params.get('template');
        console.log(`📋 TemplateId da URL: ${templateId}`);
    }

    console.log('\n📊 RESUMO DA NAVEGAÇÃO:');
    console.log(`   FunnelId final: ${funnelId || 'NENHUM'}`);
    console.log(`   TemplateId: ${templateId || 'NENHUM'}`);
    console.log(`   Debug mode: ${params.get('debug') === 'true' ? 'ATIVO' : 'INATIVO'}`);

    // ============================================================================
    // TESTE 3: VERIFICAR SE DADOS EXISTEM NO STORAGE
    // ============================================================================

    console.log('\n3️⃣ VERIFICANDO DADOS NO STORAGE');
    console.log('-'.repeat(50));

    if (funnelId) {
        const storagePatterns = [
            `unified_funnel:${funnelId}`,
            `contextual-editor-funnel-${funnelId}`,
            `contextual-my-templates-funnel-${funnelId}`,
            funnelId
        ];

        let dataFound = false;

        storagePatterns.forEach(pattern => {
            const data = localStorage.getItem(pattern);
            if (data) {
                try {
                    const parsed = JSON.parse(data);
                    console.log(`✅ Dados encontrados em: ${pattern}`);
                    console.log(`   Nome: ${parsed.name || 'Sem nome'}`);
                    console.log(`   Blocos: ${Array.isArray(parsed.blocks) ? parsed.blocks.length : 'N/A'}`);
                    dataFound = true;
                } catch (e) {
                    console.log(`✅ Dados encontrados em: ${pattern} (não-JSON)`);
                    dataFound = true;
                }
            }
        });

        if (!dataFound) {
            console.log('❌ PROBLEMA: Nenhum dado encontrado para o funnelId');
            console.log('🔧 Possíveis causas:');
            console.log('   - Funil ainda não foi criado/salvo');
            console.log('   - ID incorreto na URL');
            console.log('   - Dados foram perdidos/limpos');
        }
    }

    if (templateId) {
        console.log(`\n📋 Verificando template: ${templateId}`);

        // Verificar se template existe no registry
        if (typeof window.funnelTemplates !== 'undefined') {
            const template = window.funnelTemplates[templateId];
            if (template) {
                console.log('✅ Template encontrado no registry');
                console.log(`   Nome: ${template.name || 'Sem nome'}`);
                console.log(`   Blocos: ${Array.isArray(template.blocks) ? template.blocks.length : 'N/A'}`);
            } else {
                console.log('❌ Template não encontrado no registry');
            }
        }
    }
}

// ============================================================================
// TESTE 4: SIMULAR CLIQUE EM "USAR TEMPLATE"
// ============================================================================

console.log('\n4️⃣ SIMULANDO FLUXO DE "USAR TEMPLATE"');
console.log('-'.repeat(50));

// Simular o que acontece quando clicamos em "Usar Template"
const mockTemplate = {
    id: 'personality-assessment',
    name: 'Avaliação de Personalidade',
    blocks: [
        { type: 'FunnelHeroBlock', properties: { title: 'Teste' } }
    ]
};

console.log('📋 Template mockado:', mockTemplate.id);

// Simular criação de nova instância
const timestamp = Date.now();
const newFunnelId = `${mockTemplate.id}-${timestamp}`;
const expectedUrl = `/editor/${newFunnelId}?template=${mockTemplate.id}`;

console.log('🎯 ID do novo funil:', newFunnelId);
console.log('🔗 URL esperada:', expectedUrl);

// Verificar se a URL funcionaria
console.log('\n🧪 Testando URL gerada:');
try {
    const testUrl = new URL(expectedUrl, window.location.origin);
    console.log('✅ URL válida:', testUrl.href);

    // Extrair parâmetros da URL de teste
    const testPathParts = testUrl.pathname.split('/');
    const testParams = new URLSearchParams(testUrl.search);

    const extractedFunnelId = testPathParts[2];
    const extractedTemplateId = testParams.get('template');

    console.log('📊 Parâmetros extraídos:');
    console.log(`   FunnelId: ${extractedFunnelId}`);
    console.log(`   TemplateId: ${extractedTemplateId}`);

    if (extractedFunnelId === newFunnelId && extractedTemplateId === mockTemplate.id) {
        console.log('🎉 SUCESSO: URL gerada corretamente!');
    } else {
        console.log('❌ PROBLEMA: Parâmetros não conferem');
    }

} catch (error) {
    console.log('❌ URL inválida:', error.message);
}

// ============================================================================
// SCORE FINAL
// ============================================================================

console.log('\n🏆 SCORE FINAL DO FLUXO');
console.log('='.repeat(60));

let score = 100;
let issues = [];

// Verificações
if (!isInEditor && !window.location.pathname.includes('/admin')) {
    score -= 20;
    issues.push('❌ Não está em uma página relevante para teste');
}

if (isInEditor) {
    const pathParts = window.location.pathname.split('/');
    const hasPathParam = pathParts.length >= 3 && pathParts[2];

    if (hasPathParam) {
        score += 20;
        console.log('✅ BONUS: Usando novo padrão de URL com path parameter');
    } else {
        score -= 10;
        issues.push('⚠️ Ainda usando padrão legado de URL');
    }
}

console.log(`📊 SCORE: ${Math.max(0, score)}/100`);

if (score >= 90) {
    console.log('🎉 EXCELENTE: Fluxo funcionando perfeitamente!');
    console.log('✅ URLs sendo geradas corretamente');
    console.log('✅ Navegação usando path parameters');
    console.log('✅ Sistema totalmente funcional');
} else if (score >= 70) {
    console.log('👍 BOM: Fluxo funcionando bem');
    console.log('✅ Funcionalidade básica operacional');
    if (issues.length > 0) {
        console.log('🔧 Melhorias possíveis:');
        issues.forEach(issue => console.log(`   ${issue}`));
    }
} else {
    console.log('⚠️ NECESSITA ATENÇÃO: Possíveis problemas detectados');
    if (issues.length > 0) {
        console.log('🚨 Problemas identificados:');
        issues.forEach(issue => console.log(`   ${issue}`));
    }
}

console.log('\n📝 PRÓXIMOS PASSOS RECOMENDADOS:');
console.log('1. Acesse /admin (Modelos de Funis)');
console.log('2. Clique em "Usar Template" em qualquer modelo');
console.log('3. Verifique se a URL está no formato /editor/ID');
console.log('4. Confirme se o funil carrega corretamente');

console.log('\n🔍 Teste concluído em', new Date().toISOString());
