#!/usr/bin/env node
/**
 * Script para corrigir problemas nos templates JSON
 * 
 * Correções:
 * 1. Renomear IDs duplicados (undefined-* → step{N}-{type}-{index})
 * 2. Adicionar scores nos steps 2-11
 * 3. Configurar {resultPercentage} no step-20
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATES_DIR = path.join(__dirname, '../templates');
const BACKUP_DIR = path.join(__dirname, '../templates-backup');

// Configuração de scores baseada no template TypeScript
const SCORES_CONFIG = {
    'step-02': {
        'opt1': { Natural: 3, Contemporâneo: 1 },
        'opt2': { Clássico: 3, Elegante: 2 },
        'opt3': { Romântico: 3, Sexy: 1 },
        'opt4': { Dramático: 2, Criativo: 2 },
        'opt5': { Natural: 2, Criativo: 1 },
        'opt6': { Elegante: 2, Clássico: 1 }
    },
    'step-03': {
        'opt1': { Natural: 3, Contemporâneo: 1 },
        'opt2': { Clássico: 3, Elegante: 2 },
        'opt3': { Romântico: 3, Sexy: 1 },
        'opt4': { Dramático: 2, Criativo: 2 },
        'opt5': { Natural: 2, Criativo: 1 },
        'opt6': { Elegante: 2, Clássico: 1 }
    },
    'step-04': {
        'opt1': { Natural: 3 },
        'opt2': { Clássico: 3 },
        'opt3': { Contemporâneo: 3 },
        'opt4': { Elegante: 3 },
        'opt5': { Romântico: 3 },
        'opt6': { Sexy: 3 }
    },
    'step-05': {
        'opt1': { Natural: 2, Criativo: 1 },
        'opt2': { Clássico: 2, Elegante: 1 },
        'opt3': { Contemporâneo: 2, Criativo: 1 },
        'opt4': { Romântico: 2, Sexy: 1 },
        'opt5': { Dramático: 2, Criativo: 1 },
        'opt6': { Elegante: 2, Clássico: 1 }
    },
    'step-06': {
        'opt1': { Natural: 3 },
        'opt2': { Clássico: 3 },
        'opt3': { Contemporâneo: 3 },
        'opt4': { Elegante: 3 },
        'opt5': { Romântico: 3 },
        'opt6': { Sexy: 3 }
    },
    'step-07': {
        'opt1': { Natural: 2, Contemporâneo: 1 },
        'opt2': { Clássico: 2, Elegante: 1 },
        'opt3': { Romântico: 2, Sexy: 1 },
        'opt4': { Dramático: 2, Criativo: 1 },
        'opt5': { Natural: 2, Criativo: 1 },
        'opt6': { Elegante: 2, Contemporâneo: 1 }
    },
    'step-08': {
        'opt1': { Natural: 3 },
        'opt2': { Clássico: 3 },
        'opt3': { Contemporâneo: 3 },
        'opt4': { Elegante: 3 },
        'opt5': { Romântico: 3 },
        'opt6': { Sexy: 3 }
    },
    'step-09': {
        'opt1': { Natural: 2, Criativo: 1 },
        'opt2': { Clássico: 2, Elegante: 1 },
        'opt3': { Contemporâneo: 2, Criativo: 1 },
        'opt4': { Romântico: 2, Sexy: 1 },
        'opt5': { Dramático: 2, Criativo: 1 },
        'opt6': { Elegante: 2, Clássico: 1 }
    },
    'step-10': {
        'opt1': { Natural: 3 },
        'opt2': { Clássico: 3 },
        'opt3': { Contemporâneo: 3 },
        'opt4': { Elegante: 3 },
        'opt5': { Romântico: 3 },
        'opt6': { Sexy: 3 }
    },
    'step-11': {
        'opt1': { Natural: 2, Contemporâneo: 1 },
        'opt2': { Clássico: 2, Elegante: 1 },
        'opt3': { Romântico: 2, Sexy: 1 },
        'opt4': { Dramático: 2, Criativo: 1 },
        'opt5': { Natural: 2, Criativo: 1 },
        'opt6': { Elegante: 2, Contemporâneo: 1 }
    }
};

console.log('🔧 Iniciando correção dos templates JSON...\n');

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

// 2. Corrigir IDs duplicados
function fixDuplicateIds(template, stepNumber) {
    console.log(`  🔧 Corrigindo IDs no step-${stepNumber}...`);

    let fixCount = 0;
    const blockTypeCount = {};

    template.blocks.forEach((block, index) => {
        // Contar ocorrências de cada tipo
        blockTypeCount[block.type] = (blockTypeCount[block.type] || 0) + 1;
        const typeIndex = blockTypeCount[block.type];

        // Se ID está como "undefined-*", corrigir
        if (block.id.startsWith('undefined-')) {
            const oldId = block.id;
            block.id = `step${stepNumber}-${block.type}-${typeIndex}`;
            console.log(`    ✓ ${oldId} → ${block.id}`);
            fixCount++;
        }
    });

    if (fixCount > 0) {
        console.log(`  ✅ ${fixCount} IDs corrigidos\n`);
    } else {
        console.log(`  ℹ️  Nenhum ID duplicado encontrado\n`);
    }

    return template;
}

// 3. Adicionar scores
function addScores(template, stepId) {
    console.log(`  🎯 Adicionando scores no ${stepId}...`);

    const scores = SCORES_CONFIG[stepId];
    if (!scores) {
        console.log(`  ℹ️  Sem configuração de scores para ${stepId}\n`);
        return template;
    }

    let addedCount = 0;

    template.blocks.forEach(block => {
        if (block.type === 'quiz-question' || block.type === 'options-grid') {
            // Buscar opções em properties ou content
            const options = (block.properties && block.properties.options) ||
                (block.content && block.content.options);

            if (options) {
                options.forEach((option, idx) => {
                    // Mapear styleId → optX para encontrar score correto
                    const styleIdMap = {
                        'natural': 'opt1',
                        'classico': 'opt2',
                        'contemporaneo': 'opt3',
                        'elegante': 'opt4',
                        'romantico': 'opt5',
                        'sexy': 'opt6',
                        'dramatico': 'opt7',
                        'criativo': 'opt8'
                    };

                    const optionId = styleIdMap[option.styleId] || option.id || `opt${idx + 1}`;

                    if (scores[optionId]) {
                        option.scores = scores[optionId];
                        console.log(`    ✓ Adicionado score para ${option.styleId || optionId}:`, JSON.stringify(scores[optionId]));
                        addedCount++;
                    }
                });
            }
        }
    }); if (addedCount > 0) {
        console.log(`  ✅ ${addedCount} scores adicionados\n`);
    } else {
        console.log(`  ℹ️  Nenhum score adicionado (sem options-grid?)\n`);
    }

    return template;
}

// 4. Configurar {resultPercentage}
function configureResultPercentage(template) {
    console.log(`  🏆 Configurando {resultPercentage}...`);

    let configured = false;

    template.blocks.forEach(block => {
        if (block.type === 'result-display' || block.type === 'result-header-inline') {
            // Adicionar properties se não existir
            if (!block.properties) {
                block.properties = {};
            }

            // Adicionar configuração de exibição
            block.properties.showPercentage = true;
            block.properties.percentageFormat = '{resultPercentage}%';

            // Adicionar no content se tiver
            if (!block.content) {
                block.content = {};
            }

            block.content.resultTemplate = {
                greeting: 'Parabéns, {userName}!',
                title: 'Seu estilo predominante é:',
                styleName: '{resultStyle}',
                percentage: '{resultPercentage}%',
                description: 'Você tem {resultPercentage}% de afinidade com o estilo {resultStyle}'
            };

            console.log(`    ✓ Configurado em block: ${block.id}`);
            configured = true;
        }
    });

    if (configured) {
        console.log(`  ✅ {resultPercentage} configurado\n`);
    } else {
        console.log(`  ⚠️  Nenhum bloco result-display encontrado\n`);
    }

    return template;
}

// 5. Processar todos os templates
function processTemplates() {
    const files = fs.readdirSync(TEMPLATES_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json') && f.startsWith('step-'));

    console.log(`📄 Encontrados ${jsonFiles.length} templates para processar\n`);

    jsonFiles.forEach(file => {
        const filePath = path.join(TEMPLATES_DIR, file);
        const stepNumber = file.match(/step-(\d+)/)[1];
        const stepId = `step-${stepNumber}`;

        console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`📝 Processando: ${file}`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

        try {
            // Ler template
            const content = fs.readFileSync(filePath, 'utf-8');
            let template = JSON.parse(content);

            // Aplicar correções
            template = fixDuplicateIds(template, stepNumber);

            // Adicionar scores (apenas steps 2-11)
            const stepNum = parseInt(stepNumber);
            if (stepNum >= 2 && stepNum <= 11) {
                template = addScores(template, stepId);
            }

            // Configurar resultPercentage (apenas step-20)
            if (stepNum === 20) {
                template = configureResultPercentage(template);
            }

            // Atualizar updatedAt
            if (template.metadata) {
                template.metadata.updatedAt = new Date().toISOString();
            }

            // Salvar
            fs.writeFileSync(filePath, JSON.stringify(template, null, 2), 'utf-8');
            console.log(`✅ Template salvo com sucesso!`);

        } catch (error) {
            console.error(`❌ Erro ao processar ${file}:`, error.message);
        }
    });
}

// 6. Validar templates
function validateTemplates() {
    console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔍 VALIDANDO TEMPLATES...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const files = fs.readdirSync(TEMPLATES_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json') && f.startsWith('step-'));

    let totalErrors = 0;
    let totalWarnings = 0;

    jsonFiles.forEach(file => {
        const filePath = path.join(TEMPLATES_DIR, file);
        const stepNumber = file.match(/step-(\d+)/)[1];
        const stepNum = parseInt(stepNumber);

        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const template = JSON.parse(content);

            // Verificar IDs duplicados
            const ids = template.blocks.map(b => b.id);
            const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);

            if (duplicates.length > 0) {
                console.log(`❌ ${file}: IDs duplicados encontrados:`, [...new Set(duplicates)]);
                totalErrors++;
            }

            // Verificar IDs "undefined-*"
            const undefinedIds = ids.filter(id => id.startsWith('undefined-'));
            if (undefinedIds.length > 0) {
                console.log(`⚠️  ${file}: IDs "undefined-*" ainda presentes:`, undefinedIds);
                totalWarnings++;
            }

            // Verificar scores (steps 2-11)
            if (stepNum >= 2 && stepNum <= 11) {
                let hasScores = false;
                template.blocks.forEach(block => {
                    const options = (block.properties && block.properties.options) ||
                        (block.content && block.content.options);
                    if (options) {
                        options.forEach(opt => {
                            if (opt.scores) {
                                hasScores = true;
                            }
                        });
                    }
                });

                if (!hasScores) {
                    console.log(`⚠️  ${file}: Sem scores configurados`);
                    totalWarnings++;
                }
            }            // Verificar resultPercentage (step-20)
            if (stepNum === 20) {
                let hasResultPercentage = false;
                template.blocks.forEach(block => {
                    if (block.content && block.content.resultTemplate) {
                        if (block.content.resultTemplate.percentage) {
                            hasResultPercentage = true;
                        }
                    }
                });

                if (!hasResultPercentage) {
                    console.log(`⚠️  ${file}: {resultPercentage} não configurado`);
                    totalWarnings++;
                }
            }

        } catch (error) {
            console.error(`❌ ${file}: Erro ao validar:`, error.message);
            totalErrors++;
        }
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 RESULTADO DA VALIDAÇÃO');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`Templates processados: ${jsonFiles.length}`);
    console.log(`Erros: ${totalErrors}`);
    console.log(`Avisos: ${totalWarnings}\n`);

    if (totalErrors === 0 && totalWarnings === 0) {
        console.log('✅ Todos os templates estão válidos!\n');
    } else if (totalErrors === 0) {
        console.log('⚠️  Templates válidos, mas com avisos.\n');
    } else {
        console.log('❌ Erros encontrados! Revise os templates.\n');
    }
}

// Executar
try {
    createBackup();
    processTemplates();
    validateTemplates();

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ CORREÇÃO CONCLUÍDA COM SUCESSO!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📝 Próximos passos:');
    console.log('1. Revisar os templates corrigidos');
    console.log('2. Testar no editor: npm run dev → /editor');
    console.log('3. Se houver problemas, restaurar backup de templates-backup/\n');

} catch (error) {
    console.error('\n❌ ERRO CRÍTICO:', error.message);
    console.error('\n💡 Restaurar backup:');
    console.error('   cp templates-backup/* templates/\n');
    process.exit(1);
}
