#!/usr/bin/env node
/**
 * 🧪 TESTE AUTOMÁTICO: Validar Templates v3.0
 * 
 * Script Node.js para validar estrutura dos 21 templates v3.0
 */

const fs = require('fs');
const path = require('path');

const TEMPLATES_DIR = path.join(__dirname, 'public', 'templates');

// Cores para terminal
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m'
};

const log = {
    success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
    error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
    warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
    info: (msg) => console.log(`${colors.cyan}ℹ️  ${msg}${colors.reset}`),
    title: (msg) => console.log(`${colors.bold}${colors.cyan}${msg}${colors.reset}`)
};

function validateTemplate(template, stepId) {
    const errors = [];
    const warnings = [];

    // Validações obrigatórias
    if (template.templateVersion !== '3.0') {
        errors.push('templateVersion deve ser "3.0"');
    }

    if (!template.metadata || typeof template.metadata !== 'object') {
        errors.push('metadata é obrigatório');
    } else {
        if (!template.metadata.id) warnings.push('metadata.id não definido');
        if (!template.metadata.name) warnings.push('metadata.name não definido');
        if (!template.metadata.category) warnings.push('metadata.category não definido');
    }

    if (!template.theme || typeof template.theme !== 'object') {
        errors.push('theme é obrigatório');
    } else {
        if (!template.theme.colors) errors.push('theme.colors é obrigatório');
        if (!template.theme.fonts) errors.push('theme.fonts é obrigatório');
    }

    if (!Array.isArray(template.sections)) {
        errors.push('sections deve ser um array');
    } else if (template.sections.length === 0) {
        errors.push('sections não pode estar vazio');
    } else {
        // Validar cada seção
        template.sections.forEach((section, index) => {
            if (!section.type) {
                errors.push(`sections[${index}]: type é obrigatório`);
            }
            if (!section.id) {
                warnings.push(`sections[${index}]: id não definido`);
            }
            // content é opcional para seções antigas (step-20 usa component-based)
            // Novos templates (step-01 a step-19, step-21) devem ter content
            if (!section.content && !section.component) {
                warnings.push(`sections[${index}]: nem content nem component definido`);
            }
        });
    }

    if (!template.navigation || typeof template.navigation !== 'object') {
        warnings.push('navigation não definido');
    }

    if (!template.analytics || typeof template.analytics !== 'object') {
        warnings.push('analytics não definido');
    }

    return { errors, warnings };
}

async function testTemplates() {
    log.title('\n🧪 TESTE DE VALIDAÇÃO: Templates v3.0');
    console.log('═'.repeat(70));

    const results = [];
    let totalSections = 0;
    const sectionTypes = new Set();

    for (let step = 1; step <= 21; step++) {
        const stepId = `step-${step.toString().padStart(2, '0')}`;
        const filename = `${stepId}-v3.json`;
        const filepath = path.join(TEMPLATES_DIR, filename);

        try {
            // Verificar se arquivo existe
            if (!fs.existsSync(filepath)) {
                results.push({
                    step: stepId,
                    status: 'error',
                    message: 'Arquivo não encontrado'
                });
                continue;
            }

            // Ler e parsear JSON
            const content = fs.readFileSync(filepath, 'utf-8');
            const template = JSON.parse(content);

            // Validar estrutura
            const validation = validateTemplate(template, stepId);

            if (validation.errors.length > 0) {
                results.push({
                    step: stepId,
                    status: 'error',
                    errors: validation.errors,
                    warnings: validation.warnings
                });
            } else if (validation.warnings.length > 0) {
                results.push({
                    step: stepId,
                    status: 'warning',
                    warnings: validation.warnings,
                    sections: template.sections.length,
                    types: template.sections.map(s => s.type)
                });
            } else {
                results.push({
                    step: stepId,
                    status: 'success',
                    sections: template.sections.length,
                    types: template.sections.map(s => s.type),
                    size: (content.length / 1024).toFixed(2) + ' KB'
                });
            }

            // Coletar estatísticas
            if (template.sections) {
                totalSections += template.sections.length;
                template.sections.forEach(s => sectionTypes.add(s.type));
            }

        } catch (error) {
            results.push({
                step: stepId,
                status: 'error',
                message: error.message
            });
        }
    }

    // Calcular estatísticas
    const successful = results.filter(r => r.status === 'success');
    const warnings = results.filter(r => r.status === 'warning');
    const errors = results.filter(r => r.status === 'error');

    // Exibir resultados
    console.log('\n📊 RESUMO GERAL:');
    console.log('─'.repeat(70));
    console.log(`Total de templates:     ${results.length}`);
    log.success(`Válidos:                ${successful.length}`);
    if (warnings.length > 0) log.warning(`Com avisos:             ${warnings.length}`);
    if (errors.length > 0) log.error(`Com erros:              ${errors.length}`);
    console.log(`Total de seções:        ${totalSections}`);
    console.log(`Tipos de seções únicos: ${sectionTypes.size}`);

    // Mostrar templates válidos
    if (successful.length > 0) {
        console.log('\n✅ TEMPLATES VÁLIDOS:');
        console.log('─'.repeat(70));
        successful.forEach(r => {
            console.log(`  ${r.step}: ${r.sections} seções (${r.size}) - [${r.types.join(', ')}]`);
        });
    }

    // Mostrar warnings
    if (warnings.length > 0) {
        console.log('\n⚠️  TEMPLATES COM AVISOS:');
        console.log('─'.repeat(70));
        warnings.forEach(r => {
            console.log(`  ${r.step}: ${r.sections} seções - [${r.types.join(', ')}]`);
            r.warnings.forEach(w => log.warning(`    ${w}`));
        });
    }

    // Mostrar erros
    if (errors.length > 0) {
        console.log('\n❌ TEMPLATES COM ERROS:');
        console.log('─'.repeat(70));
        errors.forEach(r => {
            console.log(`  ${r.step}:`);
            if (r.message) {
                log.error(`    ${r.message}`);
            }
            if (r.errors) {
                r.errors.forEach(e => log.error(`    ${e}`));
            }
            if (r.warnings) {
                r.warnings.forEach(w => log.warning(`    ${w}`));
            }
        });
    }

    // Tipos de seções encontrados
    console.log('\n📦 TIPOS DE SEÇÕES ENCONTRADOS:');
    console.log('─'.repeat(70));
    Array.from(sectionTypes).sort().forEach(type => {
        console.log(`  • ${type}`);
    });

    // Resultado final
    console.log('\n' + '═'.repeat(70));
    if (errors.length === 0 && warnings.length === 0) {
        log.success('🎉 TODOS OS TEMPLATES VÁLIDOS E SEM AVISOS!');
    } else if (errors.length === 0) {
        log.warning(`✅ Todos os templates válidos (${warnings.length} com avisos menores)`);
    } else {
        log.error(`⚠️  ${errors.length} templates com erros!`);
        process.exit(1);
    }

    return {
        total: results.length,
        successful: successful.length,
        warnings: warnings.length,
        errors: errors.length,
        totalSections,
        sectionTypes: Array.from(sectionTypes)
    };
}

// Executar teste
testTemplates()
    .then(stats => {
        console.log('\n✅ Teste concluído com sucesso!');
        console.log(JSON.stringify(stats, null, 2));
    })
    .catch(error => {
        log.error(`Erro durante teste: ${error.message}`);
        process.exit(1);
    });
