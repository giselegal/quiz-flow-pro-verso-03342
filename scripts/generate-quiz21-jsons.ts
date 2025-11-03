/**
 * 🔧 SCRIPT DE GERAÇÃO DE TEMPLATES JSON
 * 
 * Gera os 21 arquivos JSON de template a partir do fashionStyle21PtBR.ts
 * 
 * USO: node --loader ts-node/esm scripts/generate-quiz21-jsons.ts
 */

import { buildFashionStyle21Steps } from '../src/templates/fashionStyle21PtBR.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração
const TEMPLATE_ID = 'quiz21StepsComplete';
const OUTPUT_DIR = path.join(__dirname, '../templates/funnels', TEMPLATE_ID, 'steps');

console.log('🎯 Gerando templates JSON para:', TEMPLATE_ID);
console.log('📂 Diretório de saída:', OUTPUT_DIR);

// Criar diretório se não existir
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log('✅ Diretório criado:', OUTPUT_DIR);
}

// Gerar steps do template
const steps = buildFashionStyle21Steps(TEMPLATE_ID);
console.log(`📝 ${steps.length} etapas encontradas`);

// Gerar JSON para cada step
let successCount = 0;
let errorCount = 0;

steps.forEach((step, index) => {
    try {
        const filename = `${step.id}.json`;
        const filepath = path.join(OUTPUT_DIR, filename);

        // Estrutura do JSON conforme esperado pelo sistema
        const json = {
            stepId: step.id,
            stepNumber: step.order,
            type: step.type,
            nextStep: step.nextStep || null,
            blocks: step.blocks.map(block => ({
                id: block.id,
                type: block.type,
                order: block.order,
                parentId: block.parentId || null,
                properties: block.properties || {},
                content: block.content || {},
            })),
            metadata: {
                ...step.metadata,
                generated: new Date().toISOString(),
                source: 'fashionStyle21PtBR.ts',
            },
        };

        // Escrever arquivo
        fs.writeFileSync(filepath, JSON.stringify(json, null, 2), 'utf-8');
        console.log(`  ✅ ${filename} (${step.blocks.length} blocos)`);
        successCount++;
    } catch (error) {
        console.error(`  ❌ Erro ao gerar ${step.id}:`, error);
        errorCount++;
    }
});

// Atualizar master.json com lista de steps
try {
    const masterPath = path.join(__dirname, '../templates/funnels', TEMPLATE_ID, 'master.json');
    const masterData = {
        templateId: TEMPLATE_ID,
        name: 'Quiz 21 Etapas - Estilo de Moda',
        description: 'Template completo de quiz de estilo pessoal com 21 etapas',
        version: '3.0',
        steps: steps.map(s => s.id),
        generated: new Date().toISOString(),
        metadata: {
            totalSteps: steps.length,
            source: 'fashionStyle21PtBR.ts',
        },
    };
    fs.writeFileSync(masterPath, JSON.stringify(masterData, null, 2), 'utf-8');
    console.log(`\n✅ master.json atualizado`);
} catch (error) {
    console.error('❌ Erro ao atualizar master.json:', error);
}

// Resumo
console.log('\n📊 RESUMO:');
console.log(`  ✅ Sucesso: ${successCount} arquivos`);
console.log(`  ❌ Erros: ${errorCount} arquivos`);
console.log(`  📂 Local: ${OUTPUT_DIR}`);

if (successCount === steps.length) {
    console.log('\n🎉 Todos os templates foram gerados com sucesso!');
} else {
    console.log('\n⚠️ Alguns templates falharam. Verifique os erros acima.');
    process.exit(1);
}
