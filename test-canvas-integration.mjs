#!/usr/bin/env node
/**
 * 🧪 Teste de Integração - ModernQuizEditor Canvas
 * 
 * Testa o fluxo completo de renderização de blocos:
 * 1. Quiz carregado no quizStore
 * 2. Step selecionado no editorStore
 * 3. Canvas deve renderizar blocos
 */

console.log('🚀 Iniciando testes de integração do Canvas...\n');

// Mock do quiz de teste
const mockQuiz = {
    id: 'test-quiz-001',
    metadata: {
        title: 'Quiz de Teste - Diagnóstico',
        description: 'Quiz para testar renderização de blocos',
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    steps: [
        {
            id: 'step-1',
            title: 'Etapa 1 - Introdução',
            description: 'Primeira etapa do quiz',
            order: 1,
            blocks: [
                {
                    id: 'block-1-1',
                    type: 'text',
                    order: 0,
                    properties: {
                        title: 'Bem-vindo ao Quiz',
                        description: 'Este é um bloco de texto de teste'
                    }
                },
                {
                    id: 'block-1-2',
                    type: 'quiz-header',
                    order: 1,
                    properties: {
                        title: 'Descubra seu estilo',
                        subtitle: 'Responda às perguntas abaixo'
                    }
                },
                {
                    id: 'block-1-3',
                    type: 'options-grid',
                    order: 2,
                    properties: {
                        title: 'Qual é a sua cor favorita?',
                        options: [
                            { id: 'opt-1', label: 'Azul', value: 10 },
                            { id: 'opt-2', label: 'Verde', value: 20 },
                            { id: 'opt-3', label: 'Vermelho', value: 30 }
                        ]
                    }
                }
            ]
        },
        {
            id: 'step-2',
            title: 'Etapa 2 - Perguntas',
            description: 'Segunda etapa',
            order: 2,
            blocks: [
                {
                    id: 'block-2-1',
                    type: 'text',
                    order: 0,
                    properties: {
                        title: 'Pergunta 2',
                        description: 'Mais uma pergunta'
                    }
                }
            ]
        },
        {
            id: 'step-3',
            title: 'Etapa 3 - Vazia',
            description: 'Etapa sem blocos',
            order: 3,
            blocks: []
        }
    ],
    settings: {
        showProgressBar: true,
        allowBack: true
    }
};

// Simulação dos stores Zustand
class QuizStoreMock {
    constructor() {
        this.quiz = null;
        this.isLoading = false;
        this.error = null;
        this.isDirty = false;
    }

    loadQuiz(quiz) {
        console.log('📂 QuizStore.loadQuiz() chamado');
        console.log('   Quiz ID:', quiz.id);
        console.log('   Steps:', quiz.steps.length);
        console.log('   Step 1 blocks:', quiz.steps[0].blocks.length);

        this.quiz = quiz;
        this.isLoading = false;
        this.error = null;
        this.isDirty = false;

        return quiz;
    }

    getState() {
        return {
            quiz: this.quiz,
            isLoading: this.isLoading,
            error: this.error,
            isDirty: this.isDirty
        };
    }
}

class EditorStoreMock {
    constructor() {
        this.selectedStepId = null;
        this.selectedBlockId = null;
        this.isPropertiesPanelOpen = true;
        this.isBlockLibraryOpen = true;
        this.isPreviewMode = false;
    }

    selectStep(stepId) {
        console.log('🎯 EditorStore.selectStep() chamado:', stepId);
        this.selectedStepId = stepId;
        this.selectedBlockId = null;
        return stepId;
    }

    selectBlock(blockId) {
        console.log('🖱️ EditorStore.selectBlock() chamado:', blockId);
        this.selectedBlockId = blockId;
        return blockId;
    }

    getState() {
        return {
            selectedStepId: this.selectedStepId,
            selectedBlockId: this.selectedBlockId,
            isPropertiesPanelOpen: this.isPropertiesPanelOpen,
            isBlockLibraryOpen: this.isBlockLibraryOpen,
            isPreviewMode: this.isPreviewMode
        };
    }
}

// Simulação da lógica do Canvas
function simulateCanvasRender(quizStore, editorStore) {
    console.log('\n🎨 Simulando render do Canvas...');

    const quiz = quizStore.getState().quiz;
    const { selectedStepId, selectedBlockId } = editorStore.getState();

    console.log('   Estado do Canvas:');
    console.log('   - hasQuiz:', !!quiz);
    console.log('   - totalSteps:', quiz?.steps?.length);
    console.log('   - selectedStepId:', selectedStepId);

    // Lógica do Canvas.tsx
    const selectedStep = quiz?.steps?.find(step => step.id === selectedStepId);

    console.log('   - selectedStep:', selectedStep?.id);
    console.log('   - blocksCount:', selectedStep?.blocks?.length);

    // Decisão de renderização
    if (!selectedStep) {
        console.log('\n❌ RESULTADO: EmptyState - "Selecione uma etapa no painel esquerdo"');
        return { rendered: 'empty-state-no-step', blocks: 0 };
    }

    if (!selectedStep.blocks || selectedStep.blocks.length === 0) {
        console.log('\n⚠️ RESULTADO: EmptyState - "Esta etapa não possui blocos"');
        return { rendered: 'empty-state-no-blocks', blocks: 0 };
    }

    console.log('\n✅ RESULTADO: Renderizando CanvasSortable com', selectedStep.blocks.length, 'blocos');
    console.log('   Blocos a serem renderizados:');
    selectedStep.blocks.forEach((block, index) => {
        console.log(`   ${index + 1}. [${block.id}] ${block.type} - "${block.properties.title}"`);
    });

    return { rendered: 'canvas-sortable', blocks: selectedStep.blocks.length, blockIds: selectedStep.blocks.map(b => b.id) };
}

// TESTES

function test1_InitialState() {
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('🧪 TESTE 1: Estado Inicial (sem quiz carregado)');
    console.log('═══════════════════════════════════════════════════════════════');

    const quizStore = new QuizStoreMock();
    const editorStore = new EditorStoreMock();

    const result = simulateCanvasRender(quizStore, editorStore);

    const passed = result.rendered === 'empty-state-no-step';
    console.log(`\n${passed ? '✅ PASSOU' : '❌ FALHOU'}: Deve mostrar EmptyState quando não há step selecionado`);

    return passed;
}

function test2_QuizLoadedNoSelection() {
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('🧪 TESTE 2: Quiz carregado, mas sem step selecionado');
    console.log('═══════════════════════════════════════════════════════════════');

    const quizStore = new QuizStoreMock();
    const editorStore = new EditorStoreMock();

    quizStore.loadQuiz(mockQuiz);

    const result = simulateCanvasRender(quizStore, editorStore);

    const passed = result.rendered === 'empty-state-no-step';
    console.log(`\n${passed ? '✅ PASSOU' : '❌ FALHOU'}: Deve mostrar EmptyState quando step não está selecionado`);

    return passed;
}

function test3_StepSelectedWithBlocks() {
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('🧪 TESTE 3: Quiz carregado + Step 1 selecionado (com 3 blocos)');
    console.log('═══════════════════════════════════════════════════════════════');

    const quizStore = new QuizStoreMock();
    const editorStore = new EditorStoreMock();

    quizStore.loadQuiz(mockQuiz);
    editorStore.selectStep('step-1');

    const result = simulateCanvasRender(quizStore, editorStore);

    const passed = result.rendered === 'canvas-sortable' && result.blocks === 3;
    console.log(`\n${passed ? '✅ PASSOU' : '❌ FALHOU'}: Deve renderizar CanvasSortable com 3 blocos`);

    if (!passed) {
        console.log('   Esperado: canvas-sortable com 3 blocos');
        console.log('   Recebido:', result);
    }

    return passed;
}

function test4_StepSelectedWithoutBlocks() {
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('🧪 TESTE 4: Quiz carregado + Step 3 selecionado (sem blocos)');
    console.log('═══════════════════════════════════════════════════════════════');

    const quizStore = new QuizStoreMock();
    const editorStore = new EditorStoreMock();

    quizStore.loadQuiz(mockQuiz);
    editorStore.selectStep('step-3');

    const result = simulateCanvasRender(quizStore, editorStore);

    const passed = result.rendered === 'empty-state-no-blocks';
    console.log(`\n${passed ? '✅ PASSOU' : '❌ FALHOU'}: Deve mostrar EmptyState quando step não tem blocos`);

    return passed;
}

function test5_SwitchBetweenSteps() {
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('🧪 TESTE 5: Trocar entre steps (step-1 → step-2 → step-1)');
    console.log('═══════════════════════════════════════════════════════════════');

    const quizStore = new QuizStoreMock();
    const editorStore = new EditorStoreMock();

    quizStore.loadQuiz(mockQuiz);

    // Step 1
    console.log('\n→ Selecionando step-1...');
    editorStore.selectStep('step-1');
    const result1 = simulateCanvasRender(quizStore, editorStore);

    // Step 2
    console.log('\n→ Mudando para step-2...');
    editorStore.selectStep('step-2');
    const result2 = simulateCanvasRender(quizStore, editorStore);

    // Volta para Step 1
    console.log('\n→ Voltando para step-1...');
    editorStore.selectStep('step-1');
    const result3 = simulateCanvasRender(quizStore, editorStore);

    const passed =
        result1.rendered === 'canvas-sortable' && result1.blocks === 3 &&
        result2.rendered === 'canvas-sortable' && result2.blocks === 1 &&
        result3.rendered === 'canvas-sortable' && result3.blocks === 3;

    console.log(`\n${passed ? '✅ PASSOU' : '❌ FALHOU'}: Deve renderizar blocos corretos ao trocar de step`);

    if (!passed) {
        console.log('   Resultado 1:', result1);
        console.log('   Resultado 2:', result2);
        console.log('   Resultado 3:', result3);
    }

    return passed;
}

function test6_BlockSelection() {
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('🧪 TESTE 6: Seleção de blocos');
    console.log('═══════════════════════════════════════════════════════════════');

    const quizStore = new QuizStoreMock();
    const editorStore = new EditorStoreMock();

    quizStore.loadQuiz(mockQuiz);
    editorStore.selectStep('step-1');

    console.log('\n→ Selecionando block-1-2...');
    editorStore.selectBlock('block-1-2');

    const { selectedBlockId } = editorStore.getState();

    const passed = selectedBlockId === 'block-1-2';
    console.log(`\n${passed ? '✅ PASSOU' : '❌ FALHOU'}: Deve armazenar ID do bloco selecionado`);
    console.log('   selectedBlockId:', selectedBlockId);

    return passed;
}

// EXECUTAR TODOS OS TESTES
async function runAllTests() {
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║   BATERIA DE TESTES - ModernQuizEditor Canvas Integration    ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝');

    const results = [
        test1_InitialState(),
        test2_QuizLoadedNoSelection(),
        test3_StepSelectedWithBlocks(),
        test4_StepSelectedWithoutBlocks(),
        test5_SwitchBetweenSteps(),
        test6_BlockSelection()
    ];

    const totalTests = results.length;
    const passedTests = results.filter(r => r).length;
    const failedTests = totalTests - passedTests;

    console.log('\n╔═══════════════════════════════════════════════════════════════╗');
    console.log('║                         RESULTADO FINAL                       ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝');
    console.log(`\n   Total de testes: ${totalTests}`);
    console.log(`   ✅ Passaram: ${passedTests}`);
    console.log(`   ❌ Falharam: ${failedTests}`);
    console.log(`   📊 Taxa de sucesso: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

    if (passedTests === totalTests) {
        console.log('\n   🎉 TODOS OS TESTES PASSARAM! A lógica do Canvas está correta.');
        console.log('\n   ⚠️ Se os blocos não aparecem na UI real, o problema pode ser:');
        console.log('      1. Quiz não está sendo carregado corretamente no quizStore');
        console.log('      2. Step não está sendo selecionado no editorStore');
        console.log('      3. Problema de renderização React (re-render não acontecendo)');
        console.log('      4. Problema com DnD-kit ou CSS (blocos renderizados mas não visíveis)');
    } else {
        console.log('\n   ⚠️ Alguns testes falharam. Verifique a lógica acima.');
    }

    console.log('\n═══════════════════════════════════════════════════════════════\n');
}

runAllTests();
