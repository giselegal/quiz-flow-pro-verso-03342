#!/usr/bin/env node
/**
 * 🔍 Validador de Steps no Master JSON
 * 
 * Verifica se quiz21-complete.json contém todos os steps esperados (step-01 até step-21)
 * e reporta quais estão presentes/ausentes.
 * 
 * Uso: node scripts/validate-master-json-steps.mjs
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Cores para output no terminal
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};

function log(msg, color = 'reset') {
    console.log(`${colors[color]}${msg}${colors.reset}`);
}

function main() {
    log('\n📦 Validador de Steps no Master JSON', 'bright');
    log('═'.repeat(60), 'blue');

    const masterJsonPath = join(rootDir, 'public/templates/quiz21-complete.json');

    try {
        log(`\n📂 Carregando: ${masterJsonPath}`, 'cyan');
        const content = readFileSync(masterJsonPath, 'utf-8');
        const masterJson = JSON.parse(content);

        log(`✅ JSON parseado com sucesso`, 'green');
        log(`   Template ID: ${masterJson.templateId || 'N/A'}`);
        log(`   Template Version: ${masterJson.templateVersion || 'N/A'}`);
        log(`   Name: ${masterJson.name || 'N/A'}`);

        // Validar steps
        const steps = masterJson.steps || {};
        const expectedSteps = Array.from({ length: 21 }, (_, i) => `step-${String(i + 1).padStart(2, '0')}`);
        const presentSteps = Object.keys(steps).sort();
        const missingSteps = expectedSteps.filter(s => !presentSteps.includes(s));

        log(`\n📊 Análise de Steps:`, 'bright');
        log(`   Esperados: ${expectedSteps.length} (step-01 até step-21)`);
        log(`   Presentes: ${presentSteps.length}`, presentSteps.length === 21 ? 'green' : 'yellow');
        log(`   Ausentes: ${missingSteps.length}`, missingSteps.length === 0 ? 'green' : 'red');

        if (presentSteps.length > 0) {
            log(`\n✅ Steps Presentes (${presentSteps.length}):`, 'green');
            presentSteps.forEach(step => {
                const stepData = steps[step];
                const sectionCount = stepData?.sections?.length || 0;
                const type = stepData?.type || stepData?.metadata?.category || 'unknown';
                console.log(`   • ${step} → ${type} (${sectionCount} sections)`);
            });
        }

        if (missingSteps.length > 0) {
            log(`\n❌ Steps Ausentes (${missingSteps.length}):`, 'red');
            missingSteps.forEach(step => {
                console.log(`   • ${step}`);
            });
        }

        // Validação detalhada: verificar se steps têm sections
        log(`\n🔬 Validação Detalhada de Sections:`, 'bright');
        let stepsWithoutSections = [];
        let stepsWithEmptySections = [];

        presentSteps.forEach(step => {
            const stepData = steps[step];
            if (!stepData.sections) {
                stepsWithoutSections.push(step);
            } else if (Array.isArray(stepData.sections) && stepData.sections.length === 0) {
                stepsWithEmptySections.push(step);
            }
        });

        if (stepsWithoutSections.length > 0) {
            log(`   ⚠️  Steps sem propriedade 'sections': ${stepsWithoutSections.length}`, 'yellow');
            stepsWithoutSections.forEach(s => console.log(`      • ${s}`));
        }

        if (stepsWithEmptySections.length > 0) {
            log(`   ⚠️  Steps com 'sections' vazio: ${stepsWithEmptySections.length}`, 'yellow');
            stepsWithEmptySections.forEach(s => console.log(`      • ${s}`));
        }

        const healthySteps = presentSteps.filter(s => {
            const stepData = steps[s];
            return stepData.sections && Array.isArray(stepData.sections) && stepData.sections.length > 0;
        });

        log(`   ✅ Steps com sections válidas: ${healthySteps.length}`, 'green');

        // Resumo final
        log(`\n${'═'.repeat(60)}`, 'blue');
        log('📋 Resumo:', 'bright');

        const allPresent = missingSteps.length === 0;
        const allHealthy = healthySteps.length === 21;

        if (allPresent && allHealthy) {
            log('   ✅ COMPLETO: Todos os 21 steps estão presentes e com sections válidas!', 'green');
            process.exit(0);
        } else {
            log('   ⚠️  INCOMPLETO: Algumas correções são necessárias:', 'yellow');
            if (!allPresent) {
                log(`      • ${missingSteps.length} steps ausentes no JSON`, 'red');
            }
            if (!allHealthy) {
                log(`      • ${21 - healthySteps.length} steps sem sections válidas`, 'yellow');
            }
            process.exit(1);
        }

    } catch (error) {
        log(`\n❌ ERRO ao validar master JSON:`, 'red');
        console.error(error);
        process.exit(2);
    }
}

main();
