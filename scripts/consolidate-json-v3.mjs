#!/usr/bin/env node

/**
 * 🎯 CONSOLIDADOR JSON v3.0
 * 
 * Consolida os 21 arquivos step-XX-v3.json individuais
 * em um único quiz21-complete.json master completo
 * 
 * Uso: node scripts/consolidate-json-v3.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TEMPLATES_DIR = join(__dirname, '..', 'public', 'templates');
const MASTER_OUTPUT = join(TEMPLATES_DIR, 'quiz21-complete.json');

console.log('🚀 Iniciando consolidação JSON v3.0...\n');

// Ler master template atual (só metadados)
const masterPath = join(TEMPLATES_DIR, 'quiz21-complete.json');
let masterTemplate;
try {
    masterTemplate = JSON.parse(readFileSync(masterPath, 'utf-8'));
    console.log('✅ Master template atual carregado');
} catch (error) {
    console.error('❌ Erro ao ler master template:', error.message);
    process.exit(1);
}

// Consolidar os 21 steps individuais
const consolidatedSteps = {};
let successCount = 0;
let errorCount = 0;

for (let i = 1; i <= 21; i++) {
    const stepNumber = String(i).padStart(2, '0');
    const stepId = `step-${stepNumber}`;
    const stepFile = join(TEMPLATES_DIR, `${stepId}-v3.json`);

    try {
        const stepData = JSON.parse(readFileSync(stepFile, 'utf-8'));

        // Validar que é v3.0
        if (stepData.templateVersion !== '3.0') {
            console.warn(`⚠️  ${stepId}: Versão incorreta (${stepData.templateVersion})`);
        }

        // Adicionar ao consolidado
        consolidatedSteps[stepId] = {
            templateVersion: stepData.templateVersion,
            metadata: stepData.metadata,
            theme: stepData.theme,
            sections: stepData.sections,
            validation: stepData.validation || {},
            behavior: stepData.behavior || {},
            // Manter info do master template para compatibilidade
            type: masterTemplate.steps[stepId]?.type || stepData.metadata?.category || 'unknown',
            title: stepData.metadata?.name || masterTemplate.steps[stepId]?.title || `Step ${i}`,
            redirectPath: masterTemplate.steps[stepId]?.redirectPath || `/quiz-estilo/${stepId}`
        };

        successCount++;
        console.log(`✅ ${stepId}: Consolidado (${stepData.sections?.length || 0} seções)`);

    } catch (error) {
        errorCount++;
        console.error(`❌ ${stepId}: Erro ao ler - ${error.message}`);
    }
}

// Criar novo master template completo
const completeMaster = {
    templateVersion: "3.0",
    templateId: "quiz-estilo-21-steps",
    name: "Quiz de Estilo Pessoal - 21 Etapas",
    description: "Template completo v3.0 com todos os blocos e seções dos 21 steps",
    metadata: {
        createdAt: masterTemplate.metadata?.createdAt || new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        author: "Sistema - Consolidador Automático",
        version: "3.0.0",
        consolidated: true,
        sourceFiles: 21,
        successfulConsolidation: successCount,
        failedConsolidation: errorCount
    },
    steps: consolidatedSteps,
    settings: masterTemplate.settings || {
        autoAdvance: true,
        showProgress: true,
        progressType: "bar",
        allowBack: false
    },
    globalConfig: {
        navigation: {
            autoAdvanceSteps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18],
            manualAdvanceSteps: [12, 19, 20, 21],
            autoAdvanceDelay: 1000
        },
        validation: {
            rules: {
                "step-01": { type: "input", required: true, minLength: 2 },
                "step-02-11": { type: "selection", required: true, requiredSelections: 3 },
                "step-13-18": { type: "selection", required: true, requiredSelections: 1 }
            }
        },
        theme: {
            colors: {
                primary: "#B89B7A",
                primaryHover: "#A68B6A",
                primaryLight: "#F3E8D3",
                secondary: "#432818",
                background: "#FAF9F7",
                text: "#1F2937",
                border: "#E5E7EB"
            },
            fonts: {
                heading: "Playfair Display, serif",
                body: "Inter, sans-serif"
            }
        }
    }
};

// Salvar arquivo consolidado
try {
    writeFileSync(MASTER_OUTPUT, JSON.stringify(completeMaster, null, 2), 'utf-8');
    console.log('\n✨ CONSOLIDAÇÃO CONCLUÍDA!\n');
    console.log('📊 Estatísticas:');
    console.log(`   ✅ Steps consolidados: ${successCount}/21`);
    console.log(`   ❌ Erros: ${errorCount}`);
    console.log(`\n📁 Arquivo gerado: ${MASTER_OUTPUT}`);

    // Mostrar tamanho do arquivo
    const stats = readFileSync(MASTER_OUTPUT, 'utf-8');
    const lines = stats.split('\n').length;
    const size = (Buffer.byteLength(stats, 'utf8') / 1024).toFixed(2);
    console.log(`   📏 Tamanho: ${size} KB`);
    console.log(`   📄 Linhas: ${lines}`);

} catch (error) {
    console.error('\n❌ ERRO ao salvar arquivo consolidado:', error.message);
    process.exit(1);
}

console.log('\n🎉 Processo concluído com sucesso!');
console.log('\n💡 Próximos passos:');
console.log('   1. Verificar o arquivo gerado');
console.log('   2. Testar carregamento no HybridTemplateService');
console.log('   3. Atualizar useQuizState para usar o master JSON');
