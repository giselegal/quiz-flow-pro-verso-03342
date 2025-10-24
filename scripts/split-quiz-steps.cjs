#!/usr/bin/env node
/**
 * Script para separar quiz21-complete.json em 20 arquivos individuais
 * Migra conteúdo da etapa 21 para a etapa 20
 */

const fs = require('fs');
const path = require('path');

const INPUT_FILE = './public/templates/quiz21-complete.json';
const OUTPUT_DIR = './public/templates';
const BACKUP_SUFFIX = `.backup-${Date.now()}.json`;

// Ler arquivo original
console.log('📖 Lendo arquivo quiz21-complete.json...');
const rawData = fs.readFileSync(INPUT_FILE, 'utf8');
const data = JSON.parse(rawData);

// Fazer backup
const backupPath = INPUT_FILE + BACKUP_SUFFIX;
fs.writeFileSync(backupPath, rawData, 'utf8');
console.log(`✅ Backup criado: ${backupPath}`);

/**
 * Converter seção para bloco no formato padronizado
 */
function sectionToBlock(section, index) {
    const block = {
        id: section.id || `block-${index}`,
        type: section.type || 'text-inline',
        position: index
    };

    // Separar content e properties
    if (section.content) {
        block.content = { ...section.content };
    } else {
        block.content = {};
    }

    // Properties
    const properties = {};

    if (section.props) {
        Object.assign(properties, section.props);
    }

    if (section.style) {
        Object.assign(properties, section.style);
    }

    if (section.enabled !== undefined) {
        properties.enabled = section.enabled;
    }

    if (section.animation) {
        properties.animation = section.animation;
    }

    if (Object.keys(properties).length > 0) {
        block.properties = properties;
    }

    return block;
}

/**
 * Converter step para formato padronizado
 */
function convertStep(stepId, stepData) {
    const stepNum = parseInt(stepId.replace('step-', ''));

    const result = {
        id: stepId,
        type: stepData.metadata?.category || (stepNum === 1 ? 'intro' : stepNum === 20 ? 'result-offer' : 'question'),
        title: stepData.metadata?.name || stepData.title || `Step ${stepNum}`,
        metadata: {
            name: stepData.metadata?.name || stepData.title || `Step ${stepNum}`,
            description: stepData.metadata?.description || '',
            category: stepData.metadata?.category || 'quiz-question',
            version: '3.0'
        },
        blocks: []
    };

    // Converter sections para blocks
    if (stepData.sections && Array.isArray(stepData.sections)) {
        stepData.sections.forEach((section, index) => {
            result.blocks.push(sectionToBlock(section, index));
        });
    }

    // Preservar offer se existir
    if (stepData.offer) {
        result.offer = stepData.offer;
    }

    // Preservar theme se existir
    if (stepData.theme) {
        result.theme = stepData.theme;
    }

    return result;
}

/**
 * Mesclar step 21 na step 20
 */
function mergeStep21IntoStep20(step20Data, step21Data) {
    console.log('\n🔀 Mesclando Step 21 na Step 20...');

    const merged = { ...step20Data };

    // Atualizar metadata
    merged.title = 'Resultado e Oferta Final';
    merged.metadata.name = 'Step 20 - Resultado e Oferta Final';
    merged.metadata.description = 'Resultado personalizado do quiz com oferta do produto';
    merged.type = 'result-offer';

    // Garantir que offer existe
    if (!merged.offer && step21Data.offer) {
        merged.offer = step21Data.offer;
    }

    // Adicionar blocos da step 21 ao final
    const step21Blocks = step21Data.sections?.map((section, index) =>
        sectionToBlock(section, merged.blocks.length + index)
    ) || [];

    // Remover blocos duplicados e adicionar novos
    const existingIds = new Set(merged.blocks.map(b => b.id));
    const newBlocks = step21Blocks.filter(b => !existingIds.has(b.id));

    console.log(`  ➕ Adicionando ${newBlocks.length} blocos da Step 21`);
    merged.blocks.push(...newBlocks);

    // Reordenar posições
    merged.blocks.forEach((block, index) => {
        block.position = index;
    });

    console.log(`  ✅ Step 20 agora tem ${merged.blocks.length} blocos`);

    return merged;
}

// Processar steps
console.log('\n📦 Processando steps...\n');

const steps = Object.keys(data.steps)
    .filter(key => key.startsWith('step-'))
    .sort();

let processedCount = 0;
let step20Final = null;

for (const stepKey of steps) {
    const stepNum = parseInt(stepKey.replace('step-', ''));

    // Pular step 21 (será mesclada na 20)
    if (stepNum === 21) {
        console.log(`⏭️  Step 21: Pulando (será mesclada na Step 20)`);
        continue;
    }

    const stepData = data.steps[stepKey];
    let converted = convertStep(stepKey, stepData);

    // Mesclar step 21 na step 20
    if (stepNum === 20) {
        const step21Data = data.steps['step-21'];
        if (step21Data) {
            converted = mergeStep21IntoStep20(converted, step21Data);
            step20Final = converted;
        }
    }

    // Salvar arquivo
    const fileName = `${stepKey}.json`;
    const filePath = path.join(OUTPUT_DIR, fileName);

    fs.writeFileSync(
        filePath,
        JSON.stringify(converted, null, 2),
        'utf8'
    );

    processedCount++;
    console.log(`✅ ${fileName} - ${converted.blocks.length} blocos - ${converted.title}`);
}

console.log(`\n✨ Processo concluído!`);
console.log(`📊 Total de arquivos criados: ${processedCount}`);
console.log(`📁 Diretório: ${OUTPUT_DIR}`);
console.log(`💾 Backup: ${backupPath}`);

if (step20Final) {
    console.log(`\n🎯 Step 20 Final:`);
    console.log(`   - Total de blocos: ${step20Final.blocks.length}`);
    console.log(`   - Tipo: ${step20Final.type}`);
    console.log(`   - Tem offer: ${!!step20Final.offer}`);
}
