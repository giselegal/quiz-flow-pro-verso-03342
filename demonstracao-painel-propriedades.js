/**
 * 🎯 DEMONSTRAÇÃO PRÁTICA: FLUXO REAL DO PAINEL DE PROPRIEDADES
 * Código executável mostrando como funciona na prática
 */

console.log('🎯 DEMONSTRAÇÃO: FLUXO REAL DO PAINEL DE PROPRIEDADES');
console.log('================================================================');

// ============================================================================
// SIMULAÇÃO DO SISTEMA REAL
// ============================================================================

// 1. ESTADO GLOBAL SIMULADO (EditorContext)
let globalEditorState = {
    blocks: [
        {
            id: 'step-1-text-1',
            type: 'text',
            order: 1,
            content: {
                text: 'Bem-vindo ao Quiz!'
            },
            properties: {
                fontSize: 'text-2xl',
                color: '#333333',
                backgroundColor: '#ffffff',
                textAlign: 'center',
                fontWeight: 'bold'
            }
        },
        {
            id: 'step-1-heading-2',
            type: 'heading',
            order: 2,
            content: {
                text: 'Descubra seu estilo'
            },
            properties: {
                level: 2,
                color: '#007acc',
                marginBottom: 16
            }
        },
        {
            id: 'step-1-button-3',
            type: 'button',
            order: 3,
            content: {
                text: 'Começar Quiz',
                href: '#next'
            },
            properties: {
                variant: 'primary',
                size: 'large',
                backgroundColor: '#007acc',
                textColor: '#ffffff'
            }
        }
    ],
    selectedBlockId: null // ← Inicialmente nenhum bloco selecionado
};

console.log('\n📦 ESTADO INICIAL:');
console.log('Blocos disponíveis:', globalEditorState.blocks.length);
console.log('Bloco selecionado:', globalEditorState.selectedBlockId || 'Nenhum');

// ============================================================================
// FUNÇÃO DE BUSCA DO BLOCO SELECIONADO (useMemo simulado)
// ============================================================================

function getSelectedBlock() {
    const { blocks, selectedBlockId } = globalEditorState;

    if (!selectedBlockId) {
        console.log('🔍 BUSCA: Nenhum bloco selecionado');
        return null;
    }

    console.log(`🔍 BUSCA: Procurando bloco com ID "${selectedBlockId}"`);

    const foundBlock = blocks.find(block => block.id === selectedBlockId);

    if (foundBlock) {
        console.log(`✅ ENCONTRADO: Bloco tipo "${foundBlock.type}"`);
        console.log('📊 Dados:', JSON.stringify(foundBlock, null, 2));
    } else {
        console.log('❌ NÃO ENCONTRADO: Bloco não existe');
    }

    return foundBlock || null;
}

// ============================================================================
// SIMULAÇÃO DE SELEÇÃO DE BLOCO
// ============================================================================

function simulateBlockSelection(blockId) {
    console.log('\n' + '='.repeat(50));
    console.log(`🖱️ SIMULANDO CLIQUE: Usuário clicou no bloco "${blockId}"`);

    // 1. Atualizar selectedBlockId (equivale ao setSelectedBlockId)
    globalEditorState.selectedBlockId = blockId;
    console.log(`📍 SELEÇÃO ATUALIZADA: selectedBlockId = "${blockId}"`);

    // 2. Buscar dados do bloco (equivale ao useMemo)
    const selectedBlock = getSelectedBlock();

    // 3. Verificar se painel deve mostrar dados
    if (selectedBlock) {
        console.log('🎛️ PAINEL: Exibindo propriedades do bloco');
        simulatePropertyPanel(selectedBlock);
    } else {
        console.log('🎛️ PAINEL: Mostrando estado vazio');
    }

    return selectedBlock;
}

// ============================================================================
// SIMULAÇÃO DO PAINEL DE PROPRIEDADES
// ============================================================================

function simulatePropertyPanel(block) {
    console.log('\n🎨 RENDERIZANDO PAINEL DE PROPRIEDADES:');
    console.log('---------------------------------------');

    const { type, content, properties } = block;

    console.log(`📋 Título: Editando bloco "${type}"`);
    console.log(`🆔 ID: ${block.id}`);

    // Configuração de campos por tipo
    const fieldConfigs = {
        text: [
            { key: 'content.text', label: 'Texto', type: 'textarea' },
            { key: 'properties.fontSize', label: 'Tamanho da Fonte', type: 'select' },
            { key: 'properties.color', label: 'Cor do Texto', type: 'color' },
            { key: 'properties.backgroundColor', label: 'Cor de Fundo', type: 'color' },
            { key: 'properties.textAlign', label: 'Alinhamento', type: 'select' }
        ],
        heading: [
            { key: 'content.text', label: 'Título', type: 'input' },
            { key: 'properties.level', label: 'Nível (H1-H6)', type: 'select' },
            { key: 'properties.color', label: 'Cor', type: 'color' },
            { key: 'properties.marginBottom', label: 'Margem Inferior', type: 'number' }
        ],
        button: [
            { key: 'content.text', label: 'Texto do Botão', type: 'input' },
            { key: 'content.href', label: 'Link/URL', type: 'input' },
            { key: 'properties.variant', label: 'Variante', type: 'select' },
            { key: 'properties.size', label: 'Tamanho', type: 'select' },
            { key: 'properties.backgroundColor', label: 'Cor de Fundo', type: 'color' }
        ]
    };

    const fields = fieldConfigs[type] || [];

    console.log('\n📝 CAMPOS DISPONÍVEIS:');
    fields.forEach((field, index) => {
        // Buscar valor atual do campo
        const currentValue = getNestedValue(block, field.key);
        console.log(`  ${index + 1}. ${field.label} (${field.type}): "${currentValue}"`);
    });
}

// ============================================================================
// HELPER: BUSCAR VALORES ANINHADOS
// ============================================================================

function getNestedValue(obj, path) {
    const keys = path.split('.');
    let value = obj;

    for (const key of keys) {
        value = value?.[key];
    }

    return value;
}

// ============================================================================
// SIMULAÇÃO DE ATUALIZAÇÃO DE PROPRIEDADE
// ============================================================================

function simulatePropertyUpdate(blockId, propertyPath, newValue) {
    console.log('\n' + '='.repeat(50));
    console.log(`✏️ SIMULANDO EDIÇÃO: ${propertyPath} = "${newValue}"`);

    // 1. Encontrar bloco
    const blockIndex = globalEditorState.blocks.findIndex(b => b.id === blockId);
    if (blockIndex === -1) {
        console.log('❌ ERRO: Bloco não encontrado');
        return;
    }

    // 2. Criar cópia do bloco
    const updatedBlock = { ...globalEditorState.blocks[blockIndex] };

    // 3. Atualizar valor aninhado
    const keys = propertyPath.split('.');
    if (keys[0] === 'content') {
        updatedBlock.content = { ...updatedBlock.content, [keys[1]]: newValue };
    } else if (keys[0] === 'properties') {
        updatedBlock.properties = { ...updatedBlock.properties, [keys[1]]: newValue };
    }

    // 4. Atualizar no estado global
    globalEditorState.blocks[blockIndex] = updatedBlock;

    console.log('✅ ATUALIZAÇÃO REALIZADA');
    console.log(`📊 Novo valor: ${getNestedValue(updatedBlock, propertyPath)}`);

    // 5. Simular re-render do canvas
    console.log('🖼️ CANVAS: Re-renderizando com novos dados...');

    return updatedBlock;
}

// ============================================================================
// EXECUÇÃO DA DEMONSTRAÇÃO
// ============================================================================

console.log('\n' + '█'.repeat(60));
console.log('🚀 INICIANDO DEMONSTRAÇÃO PRÁTICA');
console.log('█'.repeat(60));

// Cenário 1: Selecionar bloco de texto
console.log('\n🎬 CENÁRIO 1: Selecionando bloco de texto');
const textBlock = simulateBlockSelection('step-1-text-1');

// Cenário 2: Editar propriedade
console.log('\n🎬 CENÁRIO 2: Alterando cor do texto');
simulatePropertyUpdate('step-1-text-1', 'properties.color', '#ff0000');

// Cenário 3: Selecionar bloco diferente
console.log('\n🎬 CENÁRIO 3: Selecionando bloco de heading');
const headingBlock = simulateBlockSelection('step-1-heading-2');

// Cenário 4: Editar conteúdo
console.log('\n🎬 CENÁRIO 4: Alterando texto do heading');
simulatePropertyUpdate('step-1-heading-2', 'content.text', 'Seu novo estilo te espera!');

// Cenário 5: Selecionar botão
console.log('\n🎬 CENÁRIO 5: Selecionando botão');
const buttonBlock = simulateBlockSelection('step-1-button-3');

// Cenário 6: Desselecionar (voltar ao estado vazio)
console.log('\n🎬 CENÁRIO 6: Desselecionando bloco');
globalEditorState.selectedBlockId = null;
getSelectedBlock();

// ============================================================================
// RESUMO FINAL
// ============================================================================

console.log('\n' + '█'.repeat(60));
console.log('📋 RESUMO DA DEMONSTRAÇÃO');
console.log('█'.repeat(60));

console.log('\n✨ COMO O PAINEL FUNCIONA NA PRÁTICA:');
console.log('1. 🖱️ Clique no bloco → atualiza selectedBlockId');
console.log('2. 🔍 useMemo busca bloco no array blocks');
console.log('3. 🎨 Painel renderiza campos baseado no tipo');
console.log('4. ✏️ Usuário edita → dispara onUpdateBlock');
console.log('5. 🔄 Estado global é atualizado');
console.log('6. 🖼️ Canvas re-renderiza automaticamente');

console.log('\n🎯 PONTOS-CHAVE:');
console.log('• Estado reativo com selectedBlockId como fonte da verdade');
console.log('• Busca eficiente com find() memoizada');
console.log('• Campos dinâmicos baseados no tipo do bloco');
console.log('• Valores aninhados (content.*, properties.*)');
console.log('• Updates imediatos com feedback visual');

console.log('\n' + '█'.repeat(60));
console.log('🎉 SISTEMA FUNCIONA PERFEITAMENTE!');
console.log('█'.repeat(60));