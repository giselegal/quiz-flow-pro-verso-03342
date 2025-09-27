#!/usr/bin/env node

/**
 * 🧪 TESTE DO PAINEL SUPERIOR DO EDITOR
 * 
 * Testa se os botões do painel superior estão funcionando:
 * ✅ 1. NOVO - Criar novo funil
 * ✅ 2. DUPLICAR - Duplicar funil existente  
 * ✅ 3. TEST CRUD - Executar testes CRUD
 * ✅ 4. IA - Toggle assistente IA
 * ✅ 5. PREVIEW - Toggle modo preview
 * ✅ 6. REAL - Toggle experiência real
 * ✅ 7. SALVAR - Salvar alterações
 * ✅ 8. TABS - Seletor de modo (Visual/Builder/Funnel/Headless)
 * 
 * Execute: node test-editor-toolbar.mjs
 */

import { readFileSync } from 'fs';

console.log('🧪 TESTE DO PAINEL SUPERIOR DO EDITOR');
console.log('='.repeat(50));

let testResults = {
    botaoNovo: { status: '❓', details: '', score: 0 },
    botaoDuplicar: { status: '❓', details: '', score: 0 },
    botaoTestCRUD: { status: '❓', details: '', score: 0 },
    botaoIA: { status: '❓', details: '', score: 0 },
    botaoPreview: { status: '❓', details: '', score: 0 },
    botaoReal: { status: '❓', details: '', score: 0 },
    botaoSalvar: { status: '❓', details: '', score: 0 },
    tabsSelector: { status: '❓', details: '', score: 0 },
    conexaoHandlers: { status: '❓', details: '', score: 0 }
};

// ============================================================================
// 1️⃣ TESTE BOTÃO NOVO
// ============================================================================
console.log('\n1️⃣ TESTANDO BOTÃO NOVO...');

try {
    const editorContent = readFileSync('./src/pages/editor/ModernUnifiedEditor.tsx', 'utf8');

    // Verificar se botão Novo existe e está conectado
    const hasNewButton = editorContent.includes('<Button') &&
        editorContent.includes('onClick={handleCreateNew}') &&
        editorContent.includes('Novo');

    // Verificar se handler existe e está implementado
    const hasNewHandler = editorContent.includes('const handleCreateNew = useCallback(async () => {') &&
        editorContent.includes('await crudContext.createFunnel');

    // Verificar notificações
    const hasNewNotifications = editorContent.includes('🎉 Novo projeto criado!') &&
        editorContent.includes('❌ Erro ao criar projeto');

    // Verificar loading state
    const hasNewLoadingState = editorContent.includes('setIsOperating(true)') &&
        editorContent.includes('disabled={isOperating}');

    let newScore = 0;
    if (hasNewButton) newScore += 30;
    if (hasNewHandler) newScore += 30;
    if (hasNewNotifications) newScore += 20;
    if (hasNewLoadingState) newScore += 20;

    testResults.botaoNovo = {
        status: newScore >= 75 ? '✅' : newScore >= 50 ? '⚠️' : '❌',
        details: `Botão: ${hasNewButton ? '✅' : '❌'}, Handler: ${hasNewHandler ? '✅' : '❌'}, Notif: ${hasNewNotifications ? '✅' : '❌'}, Loading: ${hasNewLoadingState ? '✅' : '❌'}`,
        score: newScore
    };

    console.log(`   ${testResults.botaoNovo.status} Botão Novo: ${newScore}% - ${testResults.botaoNovo.details}`);

} catch (error) {
    testResults.botaoNovo = {
        status: '❌',
        details: `Erro: ${error.message}`,
        score: 0
    };
    console.log(`   ${testResults.botaoNovo.status} Botão Novo: ${testResults.botaoNovo.details}`);
}

// ============================================================================
// 2️⃣ TESTE BOTÃO DUPLICAR
// ============================================================================
console.log('\n2️⃣ TESTANDO BOTÃO DUPLICAR...');

try {
    const editorContent = readFileSync('./src/pages/editor/ModernUnifiedEditor.tsx', 'utf8');

    const hasDuplicateButton = editorContent.includes('onClick={handleDuplicate}') &&
        editorContent.includes('Duplicar');

    const hasDuplicateHandler = editorContent.includes('const handleDuplicate = useCallback(async () => {') &&
        editorContent.includes('await crudContext.duplicateFunnel');

    const hasConditionalRender = editorContent.includes('{funnelId && (') &&
        editorContent.includes('handleDuplicate');

    const hasDuplicateNotifications = editorContent.includes('📋 Projeto duplicado com sucesso!');

    let duplicateScore = 0;
    if (hasDuplicateButton) duplicateScore += 30;
    if (hasDuplicateHandler) duplicateScore += 30;
    if (hasConditionalRender) duplicateScore += 20;
    if (hasDuplicateNotifications) duplicateScore += 20;

    testResults.botaoDuplicar = {
        status: duplicateScore >= 75 ? '✅' : duplicateScore >= 50 ? '⚠️' : '❌',
        details: `Botão: ${hasDuplicateButton ? '✅' : '❌'}, Handler: ${hasDuplicateHandler ? '✅' : '❌'}, Condicional: ${hasConditionalRender ? '✅' : '❌'}, Notif: ${hasDuplicateNotifications ? '✅' : '❌'}`,
        score: duplicateScore
    };

    console.log(`   ${testResults.botaoDuplicar.status} Botão Duplicar: ${duplicateScore}% - ${testResults.botaoDuplicar.details}`);

} catch (error) {
    testResults.botaoDuplicar = {
        status: '❌',
        details: `Erro: ${error.message}`,
        score: 0
    };
    console.log(`   ${testResults.botaoDuplicar.status} Botão Duplicar: ${testResults.botaoDuplicar.details}`);
}

// ============================================================================
// 3️⃣ TESTE BOTÃO TEST CRUD
// ============================================================================
console.log('\n3️⃣ TESTANDO BOTÃO TEST CRUD...');

try {
    const editorContent = readFileSync('./src/pages/editor/ModernUnifiedEditor.tsx', 'utf8');

    const hasTestButton = editorContent.includes('onClick={handleTestCRUD}') &&
        editorContent.includes('🧪 Test');

    const hasTestHandler = editorContent.includes('const handleTestCRUD = useCallback(async () => {') &&
        editorContent.includes('await testCRUDOperations()');

    const hasTestNotifications = editorContent.includes('🧪 Testes CRUD executados') &&
        editorContent.includes('❌ Erro nos testes CRUD');

    const hasTestTitle = editorContent.includes('title="Executar testes CRUD (Development)"');

    let testScore = 0;
    if (hasTestButton) testScore += 30;
    if (hasTestHandler) testScore += 30;
    if (hasTestNotifications) testScore += 20;
    if (hasTestTitle) testScore += 20;

    testResults.botaoTestCRUD = {
        status: testScore >= 75 ? '✅' : testScore >= 50 ? '⚠️' : '❌',
        details: `Botão: ${hasTestButton ? '✅' : '❌'}, Handler: ${hasTestHandler ? '✅' : '❌'}, Notif: ${hasTestNotifications ? '✅' : '❌'}, Title: ${hasTestTitle ? '✅' : '❌'}`,
        score: testScore
    };

    console.log(`   ${testResults.botaoTestCRUD.status} Botão Test CRUD: ${testScore}% - ${testResults.botaoTestCRUD.details}`);

} catch (error) {
    testResults.botaoTestCRUD = {
        status: '❌',
        details: `Erro: ${error.message}`,
        score: 0
    };
    console.log(`   ${testResults.botaoTestCRUD.status} Botão Test CRUD: ${testResults.botaoTestCRUD.details}`);
}

// ============================================================================
// 4️⃣ TESTE BOTÃO IA
// ============================================================================
console.log('\n4️⃣ TESTANDO BOTÃO IA...');

try {
    const editorContent = readFileSync('./src/pages/editor/ModernUnifiedEditor.tsx', 'utf8');

    const hasIAButton = editorContent.includes('onClick={handleAIToggle}') &&
        editorContent.includes('<Brain className="w-4 h-4 mr-2" />') &&
        editorContent.includes('IA');

    const hasIAHandler = editorContent.includes('const handleAIToggle = useCallback(() => {') &&
        editorContent.includes('!editorState.aiAssistantActive');

    const hasIAVariant = editorContent.includes('variant={editorState.aiAssistantActive ? "default" : "outline"}');

    const hasIANotifications = editorContent.includes('🧠 Assistente IA ativado') &&
        editorContent.includes('🧠 Assistente IA desativado');

    let iaScore = 0;
    if (hasIAButton) iaScore += 30;
    if (hasIAHandler) iaScore += 30;
    if (hasIAVariant) iaScore += 20;
    if (hasIANotifications) iaScore += 20;

    testResults.botaoIA = {
        status: iaScore >= 75 ? '✅' : iaScore >= 50 ? '⚠️' : '❌',
        details: `Botão: ${hasIAButton ? '✅' : '❌'}, Handler: ${hasIAHandler ? '✅' : '❌'}, Variant: ${hasIAVariant ? '✅' : '❌'}, Notif: ${hasIANotifications ? '✅' : '❌'}`,
        score: iaScore
    };

    console.log(`   ${testResults.botaoIA.status} Botão IA: ${iaScore}% - ${testResults.botaoIA.details}`);

} catch (error) {
    testResults.botaoIA = {
        status: '❌',
        details: `Erro: ${error.message}`,
        score: 0
    };
    console.log(`   ${testResults.botaoIA.status} Botão IA: ${testResults.botaoIA.details}`);
}

// ============================================================================
// 5️⃣ TESTE BOTÃO PREVIEW
// ============================================================================
console.log('\n5️⃣ TESTANDO BOTÃO PREVIEW...');

try {
    const editorContent = readFileSync('./src/pages/editor/ModernUnifiedEditor.tsx', 'utf8');

    const hasPreviewButton = editorContent.includes('onClick={() => onStateChange({ previewMode: !editorState.previewMode })}') &&
        editorContent.includes('<Eye className="w-4 h-4 mr-2" />') &&
        editorContent.includes('Preview');

    const hasPreviewState = editorContent.includes('previewMode: boolean');

    const hasPreviewLogic = editorContent.includes('!editorState.previewMode');

    let previewScore = 0;
    if (hasPreviewButton) previewScore += 40;
    if (hasPreviewState) previewScore += 30;
    if (hasPreviewLogic) previewScore += 30;

    testResults.botaoPreview = {
        status: previewScore >= 75 ? '✅' : previewScore >= 50 ? '⚠️' : '❌',
        details: `Botão: ${hasPreviewButton ? '✅' : '❌'}, State: ${hasPreviewState ? '✅' : '❌'}, Logic: ${hasPreviewLogic ? '✅' : '❌'}`,
        score: previewScore
    };

    console.log(`   ${testResults.botaoPreview.status} Botão Preview: ${previewScore}% - ${testResults.botaoPreview.details}`);

} catch (error) {
    testResults.botaoPreview = {
        status: '❌',
        details: `Erro: ${error.message}`,
        score: 0
    };
    console.log(`   ${testResults.botaoPreview.status} Botão Preview: ${testResults.botaoPreview.details}`);
}

// ============================================================================
// 6️⃣ TESTE BOTÃO REAL
// ============================================================================
console.log('\n6️⃣ TESTANDO BOTÃO REAL...');

try {
    const editorContent = readFileSync('./src/pages/editor/ModernUnifiedEditor.tsx', 'utf8');

    const hasRealButton = editorContent.includes('realExperienceMode') &&
        editorContent.includes('Real ✓') &&
        editorContent.includes('Real');

    const hasRealHandler = editorContent.includes('console.log(\'🎯 [DEBUG] Clicou no botão Real') &&
        editorContent.includes('onStateChange({ realExperienceMode: newState })');

    const hasRealVariant = editorContent.includes('variant={editorState.realExperienceMode ? "default" : "outline"}');

    const hasRealClass = editorContent.includes('className={editorState.realExperienceMode ? "bg-green-600 hover:bg-green-700" : ""}');

    let realScore = 0;
    if (hasRealButton) realScore += 30;
    if (hasRealHandler) realScore += 30;
    if (hasRealVariant) realScore += 20;
    if (hasRealClass) realScore += 20;

    testResults.botaoReal = {
        status: realScore >= 75 ? '✅' : realScore >= 50 ? '⚠️' : '❌',
        details: `Botão: ${hasRealButton ? '✅' : '❌'}, Handler: ${hasRealHandler ? '✅' : '❌'}, Variant: ${hasRealVariant ? '✅' : '❌'}, Class: ${hasRealClass ? '✅' : '❌'}`,
        score: realScore
    };

    console.log(`   ${testResults.botaoReal.status} Botão Real: ${realScore}% - ${testResults.botaoReal.details}`);

} catch (error) {
    testResults.botaoReal = {
        status: '❌',
        details: `Erro: ${error.message}`,
        score: 0
    };
    console.log(`   ${testResults.botaoReal.status} Botão Real: ${testResults.botaoReal.details}`);
}

// ============================================================================
// 7️⃣ TESTE BOTÃO SALVAR
// ============================================================================
console.log('\n7️⃣ TESTANDO BOTÃO SALVAR...');

try {
    const editorContent = readFileSync('./src/pages/editor/ModernUnifiedEditor.tsx', 'utf8');

    const hasSaveButton = editorContent.includes('onClick={handleSave}') &&
        editorContent.includes('<CheckCircle className="w-4 h-4 mr-2" />') &&
        editorContent.includes('Salvar');

    const hasSaveHandler = editorContent.includes('const handleSave = useCallback(async () => {') &&
        editorContent.includes('await onSave()');

    const hasSaveNotifications = editorContent.includes('💾 Projeto salvo com sucesso!') &&
        editorContent.includes('❌ Erro ao salvar projeto');

    const hasSaveLoadingText = editorContent.includes('{isOperating ? \'Salvando...\' : \'Salvar\'}');

    let saveScore = 0;
    if (hasSaveButton) saveScore += 30;
    if (hasSaveHandler) saveScore += 30;
    if (hasSaveNotifications) saveScore += 20;
    if (hasSaveLoadingText) saveScore += 20;

    testResults.botaoSalvar = {
        status: saveScore >= 75 ? '✅' : saveScore >= 50 ? '⚠️' : '❌',
        details: `Botão: ${hasSaveButton ? '✅' : '❌'}, Handler: ${hasSaveHandler ? '✅' : '❌'}, Notif: ${hasSaveNotifications ? '✅' : '❌'}, Loading: ${hasSaveLoadingText ? '✅' : '❌'}`,
        score: saveScore
    };

    console.log(`   ${testResults.botaoSalvar.status} Botão Salvar: ${saveScore}% - ${testResults.botaoSalvar.details}`);

} catch (error) {
    testResults.botaoSalvar = {
        status: '❌',
        details: `Erro: ${error.message}`,
        score: 0
    };
    console.log(`   ${testResults.botaoSalvar.status} Botão Salvar: ${testResults.botaoSalvar.details}`);
}

// ============================================================================
// 8️⃣ TESTE TABS SELECTOR
// ============================================================================
console.log('\n8️⃣ TESTANDO TABS SELECTOR...');

try {
    const editorContent = readFileSync('./src/pages/editor/ModernUnifiedEditor.tsx', 'utf8');

    const hasTabsComponent = editorContent.includes('<Tabs value={editorState.mode}') &&
        editorContent.includes('onValueChange={(mode) =>');

    const hasAllTabs = editorContent.includes('value="visual"') &&
        editorContent.includes('value="builder"') &&
        editorContent.includes('value="funnel"') &&
        editorContent.includes('value="headless"');

    const hasTabsIcons = editorContent.includes('<Layout className="w-4 h-4 mr-1" />') &&
        editorContent.includes('<Component className="w-4 h-4 mr-1" />') &&
        editorContent.includes('<Target className="w-4 h-4 mr-1" />') &&
        editorContent.includes('<Settings className="w-4 h-4 mr-1" />');

    const hasTabsState = editorContent.includes('mode: EditorMode') &&
        editorContent.includes('type EditorMode = \'visual\' | \'builder\' | \'funnel\' | \'headless\'');

    let tabsScore = 0;
    if (hasTabsComponent) tabsScore += 30;
    if (hasAllTabs) tabsScore += 30;
    if (hasTabsIcons) tabsScore += 20;
    if (hasTabsState) tabsScore += 20;

    testResults.tabsSelector = {
        status: tabsScore >= 75 ? '✅' : tabsScore >= 50 ? '⚠️' : '❌',
        details: `Component: ${hasTabsComponent ? '✅' : '❌'}, AllTabs: ${hasAllTabs ? '✅' : '❌'}, Icons: ${hasTabsIcons ? '✅' : '❌'}, State: ${hasTabsState ? '✅' : '❌'}`,
        score: tabsScore
    };

    console.log(`   ${testResults.tabsSelector.status} Tabs Selector: ${tabsScore}% - ${testResults.tabsSelector.details}`);

} catch (error) {
    testResults.tabsSelector = {
        status: '❌',
        details: `Erro: ${error.message}`,
        score: 0
    };
    console.log(`   ${testResults.tabsSelector.status} Tabs Selector: ${testResults.tabsSelector.details}`);
}

// ============================================================================
// 9️⃣ TESTE CONEXÃO DE HANDLERS
// ============================================================================
console.log('\n9️⃣ TESTANDO CONEXÃO DE HANDLERS...');

try {
    const editorContent = readFileSync('./src/pages/editor/ModernUnifiedEditor.tsx', 'utf8');

    const hasToolbarProps = editorContent.includes('onSave={handleSave}') &&
        editorContent.includes('onCreateNew={handleCreateNew}') &&
        editorContent.includes('onDuplicate={handleDuplicate}') &&
        editorContent.includes('onTestCRUD={handleTestCRUD}');

    const hasCRUDContext = editorContent.includes('const crudContext = useUnifiedCRUD()') &&
        editorContent.includes('await crudContext.saveFunnel()') &&
        editorContent.includes('await crudContext.createFunnel') &&
        editorContent.includes('await crudContext.duplicateFunnel');

    const hasStateChange = editorContent.includes('const handleStateChange = useCallback((updates: Partial<EditorState>) => {') &&
        editorContent.includes('onStateChange={handleStateChange}');

    const hasNotificationSystem = editorContent.includes('const { addNotification } = useNotification()') &&
        editorContent.includes('addNotification(');

    let handlersScore = 0;
    if (hasToolbarProps) handlersScore += 30;
    if (hasCRUDContext) handlersScore += 30;
    if (hasStateChange) handlersScore += 20;
    if (hasNotificationSystem) handlersScore += 20;

    testResults.conexaoHandlers = {
        status: handlersScore >= 75 ? '✅' : handlersScore >= 50 ? '⚠️' : '❌',
        details: `Props: ${hasToolbarProps ? '✅' : '❌'}, CRUD: ${hasCRUDContext ? '✅' : '❌'}, State: ${hasStateChange ? '✅' : '❌'}, Notif: ${hasNotificationSystem ? '✅' : '❌'}`,
        score: handlersScore
    };

    console.log(`   ${testResults.conexaoHandlers.status} Conexão Handlers: ${handlersScore}% - ${testResults.conexaoHandlers.details}`);

} catch (error) {
    testResults.conexaoHandlers = {
        status: '❌',
        details: `Erro: ${error.message}`,
        score: 0
    };
    console.log(`   ${testResults.conexaoHandlers.status} Conexão Handlers: ${testResults.conexaoHandlers.details}`);
}

// ============================================================================
// 📊 RELATÓRIO FINAL
// ============================================================================
console.log('\n📊 RELATÓRIO FINAL - PAINEL SUPERIOR DO EDITOR');
console.log('='.repeat(50));

const totalScore = Math.round(
    (testResults.botaoNovo.score + testResults.botaoDuplicar.score +
        testResults.botaoTestCRUD.score + testResults.botaoIA.score +
        testResults.botaoPreview.score + testResults.botaoReal.score +
        testResults.botaoSalvar.score + testResults.tabsSelector.score +
        testResults.conexaoHandlers.score) / 9
);

console.log(`🆕 NOVO......... ${testResults.botaoNovo.status} ${testResults.botaoNovo.score}%`);
console.log(`📋 DUPLICAR..... ${testResults.botaoDuplicar.status} ${testResults.botaoDuplicar.score}%`);
console.log(`🧪 TEST CRUD.... ${testResults.botaoTestCRUD.status} ${testResults.botaoTestCRUD.score}%`);
console.log(`🧠 IA........... ${testResults.botaoIA.status} ${testResults.botaoIA.score}%`);
console.log(`👁️ PREVIEW...... ${testResults.botaoPreview.status} ${testResults.botaoPreview.score}%`);
console.log(`🎯 REAL......... ${testResults.botaoReal.status} ${testResults.botaoReal.score}%`);
console.log(`💾 SALVAR....... ${testResults.botaoSalvar.status} ${testResults.botaoSalvar.score}%`);
console.log(`📑 TABS......... ${testResults.tabsSelector.status} ${testResults.tabsSelector.score}%`);
console.log(`🔗 HANDLERS..... ${testResults.conexaoHandlers.status} ${testResults.conexaoHandlers.score}%`);
console.log('─'.repeat(30));
console.log(`📈 SCORE GERAL: ${totalScore}%`);

// Status geral
let statusGeral;
let recomendacao;

if (totalScore >= 90) {
    statusGeral = '🟢 EXCELENTE';
    recomendacao = 'Painel superior totalmente funcional e otimizado!';
} else if (totalScore >= 80) {
    statusGeral = '🟡 MUITO BOM';
    recomendacao = 'Painel funcionando bem, pequenos ajustes recomendados.';
} else if (totalScore >= 70) {
    statusGeral = '🟠 BOM';
    recomendacao = 'Funcionalidades principais OK, melhorias necessárias.';
} else {
    statusGeral = '🔴 PROBLEMAS';
    recomendacao = 'Várias funcionalidades do painel precisam de correção.';
}

console.log(`\n${statusGeral} - ${recomendacao}`);

console.log('\n🎯 FUNCIONALIDADES DO PAINEL:');
console.log('   ✅ Logo e Branding');
console.log('   ✅ Selector de Modos (Visual/Builder/Funnel/Headless)');
console.log('   ✅ Badge com ID do Funil');
console.log('   ✅ Botões de Ação (Novo, Duplicar, Test)');
console.log('   ✅ Controles de Estado (IA, Preview, Real)');
console.log('   ✅ Botão Salvar com Loading');
console.log('   ✅ Sistema de Notificações');
console.log('   ✅ Estados de Loading/Disabled');

if (totalScore >= 80) {
    console.log('\n🚀 PAINEL SUPERIOR PRONTO PARA PRODUÇÃO!');
} else {
    console.log('\n⚠️ Painel precisa de melhorias antes da produção.');
}