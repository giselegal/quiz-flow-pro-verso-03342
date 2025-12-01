/**
 * 🔧 SCRIPT DE GERAÇÃO DE TEMPLATES JSON v3.2 (por etapa)
 *
 * Fonte: public/templates/quiz21-complete.json (master com blocks)
 * Saída: public/templates/funnels/quiz21StepsComplete/steps/step-XX.json
 *
 * USO: npx tsx scripts/generate-quiz21-jsons.ts
 */

import { mapBlockType, isValidBlockType } from '../src/lib/utils/blockTypeMapper';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração
const TEMPLATE_ID = 'quiz21StepsComplete';
const MASTER_PATH = path.join(__dirname, '../public/templates/quiz21-complete.json');
const OUTPUT_DIR = path.join(__dirname, '../public/templates/funnels', TEMPLATE_ID, 'steps');

console.log('🎯 Gerando templates JSON para:', TEMPLATE_ID);
console.log('📂 Diretório de saída:', OUTPUT_DIR);

// Criar diretório se não existir
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log('✅ Diretório criado:', OUTPUT_DIR);
}

// Carregar master JSON
if (!fs.existsSync(MASTER_PATH)) {
    console.error(`❌ Master não encontrado: ${MASTER_PATH}`);
    process.exit(1);
}

const master = JSON.parse(fs.readFileSync(MASTER_PATH, 'utf-8'));
const stepEntries: Array<[string, any]> = Object.entries(master.steps || {});
console.log(`📝 ${stepEntries.length} etapas no master`);

// Gerar JSON para cada step
let successCount = 0;
let errorCount = 0;

stepEntries.forEach(([stepId, stepData], index) => {
    try {
        const filename = `${stepId}.json`;
        const filepath = path.join(OUTPUT_DIR, filename);

        // Estrutura do JSON conforme esperado pelo sistema
        const blocks = Array.isArray(stepData.blocks) ? stepData.blocks : [];
        const json = {
            stepId,
            stepNumber: stepData.order || (index + 1),
            type: stepData.type || 'step',
            nextStep: stepData.nextStep || null,
            templateVersion: '3.2',
            blocks: blocks.map((block: any) => {
                const originalType = block.type;
                const mappedType = mapBlockType(originalType);
                if (!isValidBlockType(mappedType)) {
                    console.warn(`⚠️ Tipo de bloco inválido no editor: ${mappedType} (original: ${originalType}) em ${stepId}`);
                }
                const properties = { ...(block.properties || {}) } as Record<string, any>;
                if (mappedType !== originalType) {
                    properties._originalType = originalType;
                }
                return {
                    id: block.id || `${stepId}-block-${Math.random().toString(36).slice(2, 8)}`,
                    type: mappedType,
                    order: (block.order != null ? block.order : index),
                    parentId: block.parentId || null,
                    properties,
                    content: block.content || {},
                };
            }),
            metadata: {
                ...(stepData.metadata || {}),
                generated: new Date().toISOString(),
                source: 'quiz21-complete.json',
            },
        };

        // Escrever arquivo
        fs.writeFileSync(filepath, JSON.stringify(json, null, 2), 'utf-8');
        console.log(`  ✅ ${filename} (${blocks.length} blocos)`);
        successCount++;
    } catch (error) {
        console.error(`  ❌ Erro ao gerar ${stepId}:`, error);
        errorCount++;
    }
});

// Atualizar master.json com lista de steps
try {
    const masterPath = path.join(__dirname, '../public/templates/funnels', TEMPLATE_ID, 'master.json');
    const masterData = {
        templateId: TEMPLATE_ID,
        name: 'Quiz 21 Etapas - Estilo de Moda',
        description: 'Template completo de quiz de estilo pessoal com 21 etapas',
        version: '3.2',
        steps: stepEntries.map(([sid]) => sid),
        generated: new Date().toISOString(),
        metadata: {
            totalSteps: stepEntries.length,
            source: 'quiz21-complete.json',
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

if (successCount === stepEntries.length) {
    console.log('\n🎉 Todos os templates foram gerados com sucesso!');
} else {
    console.log('\n⚠️ Alguns templates falharam. Verifique os erros acima.');
    process.exit(1);
}
