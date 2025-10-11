#!/usr/bin/env node
/**
 * Script para corrigir pontuação dos templates JSON
 * 
 * NOVA REGRA: 1 PONTO POR OPÇÃO, 1 ESTILO POR OPÇÃO
 * - Cada opção pontua APENAS o estilo correspondente ao seu styleId
 * - Todas as opções têm peso igual: 1 ponto
 * - Sem cross-scoring (pontuação cruzada)
 * - Sem scores nulos (null)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATES_DIR = path.join(__dirname, '../templates');
const BACKUP_DIR = path.join(__dirname, '../templates-backup-v2');

// Mapeamento direto: styleId → Nome do Estilo (capitalizado)
const STYLE_MAPPING = {
    'natural': 'Natural',
    'classico': 'Clássico',
    'contemporaneo': 'Contemporâneo',
    'elegante': 'Elegante',
    'romantico': 'Romântico',
    'sexy': 'Sexy',
    'dramatico': 'Dramático',
    'criativo': 'Criativo'
};

console.log('🔧 Iniciando correção de pontuação dos templates JSON...');
console.log('📋 NOVA REGRA: 1 ponto por opção, 1 estilo por opção\n');

// 1. Criar backup
function createBackup() {
    console.log('📦 Criando backup...');
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    const files = fs.readdirSync(TEMPLATES_DIR);
    files.forEach(file => {
        if (file.endsWith('.json')) {
            const src = path.join(TEMPLATES_DIR, file);
            const dest = path.join(BACKUP_DIR, file);
            fs.copyFileSync(src, dest);
        }
    });

    console.log(`✅ Backup criado em: ${BACKUP_DIR}\n`);
}

// 2. Corrigir scores: 1 ponto para o estilo correspondente
function fixScores(template, stepId) {
    console.log(`  🎯 Corrigindo scores no ${stepId}...`);

    let fixedCount = 0;
    let errors = [];

    template.blocks.forEach(block => {
        if (block.type === 'quiz-question' || block.type === 'options-grid') {
            // Buscar opções em properties ou content
            const options = (block.properties && block.properties.options) ||
                (block.content && block.content.options);

            if (options) {
                options.forEach((option, idx) => {
                    const styleId = option.styleId || option.id;
                    const styleName = STYLE_MAPPING[styleId];

                    if (!styleName) {
                        errors.push(`    ⚠️ Opção ${idx + 1}: styleId "${styleId}" não mapeado`);
                        return;
                    }

                    // Aplicar score uniforme: 1 ponto para o estilo correspondente
                    const oldScore = JSON.stringify(option.scores);
                    option.scores = { [styleName]: 1 };
                    const newScore = JSON.stringify(option.scores);

                    if (oldScore !== newScore) {
                        console.log(`    ✓ ${styleId}: ${oldScore} → ${newScore}`);
                        fixedCount++;
                    }
                });
            }
        }
    });

    if (errors.length > 0) {
        console.log('\n    ⚠️ AVISOS:');
        errors.forEach(err => console.log(err));
    }

    if (fixedCount > 0) {
        console.log(`  ✅ ${fixedCount} scores corrigidos\n`);
    } else {
        console.log(`  ℹ️ Nenhum score alterado (já estava correto)\n`);
    }

    return template;
}

// 3. Validar configuração
function validateTemplate(template, stepId) {
    const errors = [];
    const warnings = [];

    template.blocks.forEach(block => {
        if (block.type === 'quiz-question' || block.type === 'options-grid') {
            const options = (block.properties && block.properties.options) ||
                (block.content && block.content.options);

            if (options) {
                options.forEach((option, idx) => {
                    // Verificar se tem scores
                    if (!option.scores || option.scores === null) {
                        errors.push(`Opção ${idx + 1} (${option.styleId}): scores nulo`);
                        return;
                    }

                    // Verificar se pontua apenas 1 estilo
                    const scoreKeys = Object.keys(option.scores);
                    if (scoreKeys.length !== 1) {
                        warnings.push(`Opção ${idx + 1} (${option.styleId}): pontua ${scoreKeys.length} estilos (deveria ser 1)`);
                    }

                    // Verificar se pontuação é 1
                    const scoreValues = Object.values(option.scores);
                    if (scoreValues.some(v => v !== 1)) {
                        warnings.push(`Opção ${idx + 1} (${option.styleId}): pontuação diferente de 1 (${scoreValues.join(', ')})`);
                    }

                    // Verificar se styleId corresponde ao estilo pontuado
                    const styleName = STYLE_MAPPING[option.styleId];
                    if (styleName && !option.scores[styleName]) {
                        warnings.push(`Opção ${idx + 1} (${option.styleId}): estilo pontuado não corresponde ao styleId`);
                    }
                });
            }
        }
    });

    return { errors, warnings };
}

// 4. Processar todos os templates
function processTemplates() {
    const files = fs.readdirSync(TEMPLATES_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json') && f.startsWith('step-'));

    console.log(`📄 Encontrados ${jsonFiles.length} templates para processar\n`);

    let totalFixed = 0;
    let totalErrors = 0;
    let totalWarnings = 0;

    jsonFiles.forEach(file => {
        const filePath = path.join(TEMPLATES_DIR, file);
        const stepNumber = file.match(/step-(\d+)/)[1];
        const stepId = `step-${stepNumber}`;
        const stepNum = parseInt(stepNumber);

        // Processar apenas steps 2-11 (questões pontuadas)
        if (stepNum < 2 || stepNum > 11) {
            return;
        }

        console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`📝 Processando: ${file} (Step ${stepNumber})`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

        try {
            // Ler template
            const content = fs.readFileSync(filePath, 'utf-8');
            let template = JSON.parse(content);

            // Corrigir scores
            template = fixScores(template, stepId);

            // Validar
            const validation = validateTemplate(template, stepId);
            if (validation.errors.length > 0) {
                console.log(`  ❌ ERROS ENCONTRADOS:`);
                validation.errors.forEach(err => console.log(`    - ${err}`));
                totalErrors += validation.errors.length;
            }
            if (validation.warnings.length > 0) {
                console.log(`  ⚠️ AVISOS:`);
                validation.warnings.forEach(warn => console.log(`    - ${warn}`));
                totalWarnings += validation.warnings.length;
            }

            // Atualizar updatedAt
            if (template.metadata) {
                template.metadata.updatedAt = new Date().toISOString();
            }

            // Salvar
            fs.writeFileSync(filePath, JSON.stringify(template, null, 2), 'utf-8');
            console.log(`✅ Template salvo com sucesso!`);
            totalFixed++;

        } catch (error) {
            console.error(`❌ Erro ao processar ${file}:`, error.message);
            totalErrors++;
        }
    });

    return { totalFixed, totalErrors, totalWarnings };
}

// 5. Executar
createBackup();

const results = processTemplates();

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 RESULTADO FINAL');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log(`Templates processados: ${results.totalFixed}`);
console.log(`Erros: ${results.totalErrors}`);
console.log(`Avisos: ${results.totalWarnings}\n`);

if (results.totalErrors === 0 && results.totalWarnings === 0) {
    console.log('✅ Todos os templates estão válidos!');
    console.log('✅ Pontuação corrigida: 1 ponto por opção, 1 estilo por opção');
} else if (results.totalErrors === 0) {
    console.log('⚠️ Templates processados com avisos (verificar manualmente)');
} else {
    console.log('❌ Erros encontrados! Verificar templates manualmente');
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
