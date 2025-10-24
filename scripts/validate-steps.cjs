#!/usr/bin/env node
/**
 * Script de validação dos arquivos JSON de steps
 * Verifica formato padronizado content/properties
 */

const fs = require('fs');
const path = require('path');

const TEMPLATES_DIR = './public/templates';
const STEP_FILES = Array.from({ length: 20 }, (_, i) => `step-${String(i + 1).padStart(2, '0')}.json`);

console.log('🔍 Validando arquivos de steps...\n');

let totalFiles = 0;
let validFiles = 0;
let issues = [];

function validateBlock(block, stepId, blockIndex) {
    const blockIssues = [];

    // Verificar campos obrigatórios
    if (!block.id) blockIssues.push(`Bloco ${blockIndex}: falta 'id'`);
    if (!block.type) blockIssues.push(`Bloco ${blockIndex}: falta 'type'`);
    if (block.position === undefined) blockIssues.push(`Bloco ${blockIndex}: falta 'position'`);

    // Verificar separação content/properties
    if (!block.content && !block.properties) {
        blockIssues.push(`Bloco ${blockIndex}: deve ter 'content' ou 'properties'`);
    }

    return blockIssues;
}

function validateStep(stepData, fileName) {
    const stepIssues = [];

    // Campos obrigatórios
    if (!stepData.id) stepIssues.push('Falta campo "id"');
    if (!stepData.type) stepIssues.push('Falta campo "type"');
    if (!stepData.title) stepIssues.push('Falta campo "title"');
    if (!stepData.metadata) stepIssues.push('Falta campo "metadata"');
    if (!stepData.blocks || !Array.isArray(stepData.blocks)) {
        stepIssues.push('Falta array "blocks"');
    } else {
        // Validar cada bloco
        stepData.blocks.forEach((block, index) => {
            const blockIssues = validateBlock(block, stepData.id, index);
            stepIssues.push(...blockIssues);
        });
    }

    return stepIssues;
}

// Validar cada arquivo
for (const fileName of STEP_FILES) {
    const filePath = path.join(TEMPLATES_DIR, fileName);

    totalFiles++;

    if (!fs.existsSync(filePath)) {
        issues.push({
            file: fileName,
            error: 'Arquivo não encontrado',
            issues: []
        });
        continue;
    }

    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);

        const stepIssues = validateStep(data, fileName);

        if (stepIssues.length === 0) {
            validFiles++;
            console.log(`✅ ${fileName} - ${data.blocks.length} blocos - ${data.title}`);
        } else {
            issues.push({
                file: fileName,
                error: null,
                issues: stepIssues
            });
            console.log(`⚠️  ${fileName} - ${stepIssues.length} problemas encontrados`);
        }

    } catch (error) {
        issues.push({
            file: fileName,
            error: error.message,
            issues: []
        });
        console.log(`❌ ${fileName} - Erro: ${error.message}`);
    }
}

// Resumo
console.log('\n' + '='.repeat(60));
console.log('📊 RESUMO DA VALIDAÇÃO');
console.log('='.repeat(60));
console.log(`Total de arquivos: ${totalFiles}`);
console.log(`Arquivos válidos: ${validFiles} (${Math.round(validFiles / totalFiles * 100)}%)`);
console.log(`Arquivos com problemas: ${issues.length}`);

if (issues.length > 0) {
    console.log('\n⚠️  PROBLEMAS ENCONTRADOS:\n');
    issues.forEach(issue => {
        console.log(`📄 ${issue.file}`);
        if (issue.error) {
            console.log(`   ❌ ${issue.error}`);
        }
        issue.issues.forEach(i => {
            console.log(`   • ${i}`);
        });
        console.log('');
    });
}

// Estatísticas adicionais
console.log('\n📈 ESTATÍSTICAS:');

const stats = {
    totalBlocks: 0,
    blocksByType: {},
    stepsByCategory: {}
};

for (const fileName of STEP_FILES) {
    const filePath = path.join(TEMPLATES_DIR, fileName);
    if (fs.existsSync(filePath)) {
        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

            stats.totalBlocks += data.blocks?.length || 0;

            // Contar por categoria
            const category = data.metadata?.category || 'unknown';
            stats.stepsByCategory[category] = (stats.stepsByCategory[category] || 0) + 1;

            // Contar blocos por tipo
            if (data.blocks) {
                data.blocks.forEach(block => {
                    const type = block.type || 'unknown';
                    stats.blocksByType[type] = (stats.blocksByType[type] || 0) + 1;
                });
            }
        } catch (e) {
            // Ignorar erros na estatística
        }
    }
}

console.log(`Total de blocos: ${stats.totalBlocks}`);
console.log(`Média de blocos por step: ${Math.round(stats.totalBlocks / validFiles * 10) / 10}`);

console.log('\nSteps por categoria:');
Object.entries(stats.stepsByCategory).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`);
});

console.log('\nTop 10 tipos de blocos mais usados:');
Object.entries(stats.blocksByType)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([type, count]) => {
        console.log(`  ${type}: ${count}`);
    });

console.log('\n' + '='.repeat(60));

if (validFiles === totalFiles) {
    console.log('✨ Todos os arquivos estão válidos!');
    process.exit(0);
} else {
    console.log('⚠️  Alguns arquivos precisam de correção.');
    process.exit(1);
}
