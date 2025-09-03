// Script de debug para inspecionar estado do editor
console.log('🔍 Debug do Estado do Editor');
console.log('==========================');

// Verificar se estamos na página do editor
const isEditorPage = window.location.pathname.includes('/editor');
console.log('📍 Página atual:', window.location.pathname);
console.log('📍 É página do editor:', isEditorPage);

// Verificar contexto do EditorProvider
const editorContext = window.__EDITOR_CONTEXT__;
if (editorContext) {
    console.log('✅ EditorProvider context encontrado');
    console.log('📊 Estado atual:', {
        currentStep: editorContext.state?.currentStep,
        stepBlocksKeys: editorContext.state?.stepBlocks ? Object.keys(editorContext.state.stepBlocks) : 'undefined',
        totalSteps: editorContext.state?.stepBlocks ? Object.keys(editorContext.state.stepBlocks).length : 0,
        selectedBlockId: editorContext.state?.selectedBlockId,
        isSupabaseEnabled: editorContext.state?.isSupabaseEnabled,
        databaseMode: editorContext.state?.databaseMode
    });

    // Verificar blocos da etapa atual
    const currentStep = editorContext.state?.currentStep || 1;
    const currentStepKey = `step-${currentStep}`;
    const currentStepBlocks = editorContext.state?.stepBlocks?.[currentStepKey];
    console.log('📋 Blocos da etapa atual (' + currentStepKey + '):', {
        blocks: currentStepBlocks,
        count: Array.isArray(currentStepBlocks) ? currentStepBlocks.length : 0,
        types: Array.isArray(currentStepBlocks) ? currentStepBlocks.map(b => b.type) : 'N/A'
    });
} else {
    console.log('❌ EditorProvider context não encontrado');
}

// Verificar análise de estado
const stateAnalysis = window.__EDITOR_STATE_ANALYSIS__;
if (stateAnalysis) {
    console.log('📈 Análise de estado:', stateAnalysis);
} else {
    console.log('❌ Análise de estado não disponível');
}

// Verificar canvas container
const canvasContainer = document.querySelector('[data-canvas-container]');
console.log('🎨 Canvas container:', canvasContainer ? 'encontrado' : 'não encontrado');

// Verificar blocos renderizados
const renderedBlocks = document.querySelectorAll('[data-block-id]');
console.log('🧱 Blocos renderizados:', renderedBlocks.length);

// Verificar dropzones
const dropzones = document.querySelectorAll('[data-dnd-dropzone-type]');
console.log('🎯 Drop zones:', dropzones.length);

console.log('==========================');
console.log('🏁 Debug concluído');
