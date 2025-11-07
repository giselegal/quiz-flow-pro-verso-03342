/**
 * 🔍 ANÁLISE CORRETA DA ESTRUTURA DE BLOCOS
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 ANÁLISE CORRETA DA ESTRUTURA DE BLOCOS');
console.log('='.repeat(70));

// Blocos encontrados nos templates JSON
const templatesDir = 'public/templates';
const blockUsage = new Map();

if (fs.existsSync(templatesDir)) {
    const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.json') && f.startsWith('step-'));
    
    files.forEach(file => {
        try {
            const content = JSON.parse(fs.readFileSync(path.join(templatesDir, file), 'utf8'));
            const stepId = file.replace('.json', '');
            
            if (content.blocks && Array.isArray(content.blocks)) {
                content.blocks.forEach(block => {
                    if (!blockUsage.has(block.type)) {
                        blockUsage.set(block.type, {
                            type: block.type,
                            steps: new Set(),
                            examples: []
                        });
                    }
                    
                    const info = blockUsage.get(block.type);
                    info.steps.add(stepId);
                    
                    if (info.examples.length < 2) {
                        info.examples.push({
                            step: stepId,
                            id: block.id,
                            hasProps: !!block.properties,
                            hasContent: !!block.content,
                            hasParentId: !!block.parentId
                        });
                    }
                });
            }
        } catch (e) {
            console.warn('Erro ao ler ' + file + ':', e.message);
        }
    });
}

// Classificar blocos por criticidade
const blocks = Array.from(blockUsage.values()).map(info => ({
    ...info,
    stepCount: info.steps.size,
    steps: Array.from(info.steps)
})).sort((a, b) => b.stepCount - a.stepCount);

console.log('📊 BLOCOS POR CRITICIDADE:');
console.log('-'.repeat(70));

blocks.forEach(block => {
    const priority = block.stepCount >= 10 ? 'CRÍTICO' : 
                    block.stepCount >= 5 ? 'ALTO' : 
                    block.stepCount >= 2 ? 'MÉDIO' : 'BAIXO';
    
    console.log(block.type.padEnd(25) + ' | ' + 
               (block.stepCount + ' steps').padEnd(10) + ' | ' + 
               priority.padEnd(10) + ' | ' +
               block.steps.join(', '));
});

console.log('');
console.log('🔥 BLOCOS CRÍTICOS (10+ steps):');
console.log('-'.repeat(50));

const criticalBlocks = blocks.filter(b => b.stepCount >= 10);
criticalBlocks.forEach((block, i) => {
    console.log((i+1) + '. ' + block.type + ' (' + block.stepCount + ' steps)');
});

console.log('');
console.log('⚠️ BLOCOS DE ALTA PRIORIDADE (5-9 steps):');
console.log('-'.repeat(50));

const highPriorityBlocks = blocks.filter(b => b.stepCount >= 5 && b.stepCount < 10);
highPriorityBlocks.forEach((block, i) => {
    console.log((i+1) + '. ' + block.type + ' (' + block.stepCount + ' steps)');
});

console.log('');
console.log('📋 ESTRUTURA CORRETA IDENTIFICADA:');
console.log('='.repeat(50));

console.log('');
console.log('CATEGORIA: INTRODUÇÃO (step-01-v3)');
const introBlocks = blocks.filter(b => b.type.startsWith('intro-') || b.type.includes('intro'));
introBlocks.forEach(block => {
    console.log('• ' + block.type);
});

console.log('');
console.log('CATEGORIA: PERGUNTAS (steps 2-18)');
const questionBlocks = blocks.filter(b => b.type.startsWith('question-') || b.type.includes('options'));
questionBlocks.forEach(block => {
    console.log('• ' + block.type + ' (' + block.stepCount + ' steps)');
});

console.log('');
console.log('CATEGORIA: TRANSIÇÕES (steps 12, 19)');
const transitionBlocks = blocks.filter(b => b.type.startsWith('transition-') || b.type === 'CTAButton');
transitionBlocks.forEach(block => {
    console.log('• ' + block.type);
});

console.log('');
console.log('CATEGORIA: RESULTADO (step-20-v3)');
const resultBlocks = blocks.filter(b => b.type.startsWith('result-') || b.type.startsWith('quiz-score'));
resultBlocks.forEach(block => {
    console.log('• ' + block.type);
});

console.log('');
console.log('CATEGORIA: OFERTA (step-21-v3)');
const offerBlocks = blocks.filter(b => b.type.startsWith('offer-') || b.type === 'pricing');
offerBlocks.forEach(block => {
    console.log('• ' + block.type);
});

console.log('');
console.log('🚀 PLANO DE CORREÇÃO:');
console.log('='.repeat(50));

console.log('');
console.log('FASE 1 - CRÍTICA (Implementar primeiro):');
criticalBlocks.slice(0, 4).forEach((block, i) => {
    console.log((i+1) + '. Implementar ' + block.type);
});

console.log('');
console.log('FASE 2 - ALTA (Próximas semanas):');
highPriorityBlocks.slice(0, 5).forEach((block, i) => {
    console.log((i+1) + '. Implementar ' + block.type);
});

console.log('');
console.log('📊 ESTATÍSTICAS:');
console.log('-'.repeat(30));
console.log('Total de tipos únicos: ' + blocks.length);
console.log('Blocos críticos: ' + criticalBlocks.length);
console.log('Blocos alta prioridade: ' + highPriorityBlocks.length);

// Salvar dados
const analysisData = {
    blocks: blocks,
    critical: criticalBlocks.map(b => b.type),
    highPriority: highPriorityBlocks.map(b => b.type),
    categories: {
        intro: introBlocks.map(b => b.type),
        questions: questionBlocks.map(b => b.type),
        transitions: transitionBlocks.map(b => b.type),
        results: resultBlocks.map(b => b.type),
        offers: offerBlocks.map(b => b.type)
    }
};

fs.writeFileSync('block-analysis-results.json', JSON.stringify(analysisData, null, 2));
console.log('');
console.log('✅ Análise salva em: block-analysis-results.json');