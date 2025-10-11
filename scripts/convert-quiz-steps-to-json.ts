#!/usr/bin/env tsx
/**
 * Script para converter QUIZ_STEPS (TypeScript) para templates JSON
 * 
 * Uso: npm run convert:templates
 */

import { QUIZ_STEPS } from '../src/data/quizSteps';
import { QuizStepAdapter } from '../src/adapters/QuizStepAdapter';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '../templates');

// Criar diretório se não existir
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('🚀 Iniciando conversão de QUIZ_STEPS para JSON...\n');

let successCount = 0;
let errorCount = 0;

Object.entries(QUIZ_STEPS).forEach(([stepId, step]) => {
    try {
        // Gerar blocos JSON usando o adapter
        const blocks = QuizStepAdapter.toJSONBlocks(step);

        // Criar estrutura completa do template
        const jsonTemplate = {
            templateVersion: "2.0",
            metadata: {
                id: `quiz-${stepId}`,
                name: step.title?.substring(0, 50).replace(/<[^>]*>/g, '') || `Step ${stepId}`,
                description: `${step.type} step for quiz`,
                category: `quiz-${step.type}`,
                tags: ["quiz", "style", step.type],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            layout: {
                containerWidth: "full",
                spacing: "small",
                backgroundColor: "#FAF9F7",
                responsive: true,
            },
            validation: step.type === 'intro' ? {
                nameField: {
                    required: true,
                    minLength: 2,
                    maxLength: 32,
                    errorMessage: "Por favor, digite seu nome para continuar",
                    realTimeValidation: true,
                }
            } : {},
            analytics: {
                events: ["page_view", "step_completed"],
                trackingId: `${stepId}`,
                utmParams: true,
                customEvents: ["component_mounted", "user_interaction"],
            },
            blocks,
        };

        // Nome do arquivo
        const filename = `${stepId}-template.json`;
        const filepath = path.join(OUTPUT_DIR, filename);

        // Salvar JSON formatado
        fs.writeFileSync(
            filepath,
            JSON.stringify(jsonTemplate, null, 2),
            'utf-8'
        );

        console.log(`✅ ${filename} - ${blocks.length} blocos`);
        successCount++;

    } catch (error) {
        console.error(`❌ Erro ao converter ${stepId}:`, error);
        errorCount++;
    }
});

console.log(`\n📊 Conversão concluída:`);
console.log(`   ✅ Sucesso: ${successCount}/21`);
console.log(`   ❌ Erros: ${errorCount}/21`);
console.log(`\n📁 Arquivos salvos em: ${OUTPUT_DIR}`);

if (errorCount > 0) {
    process.exit(1);
}
