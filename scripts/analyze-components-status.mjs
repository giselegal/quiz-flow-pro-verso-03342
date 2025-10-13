#!/usr/bin/env node

/**
 * 📊 ANÁLISE DE COMPONENTES DO QUIZ - 21 STEPS
 * 
 * Verifica se todos os componentes necessários para renderizar
 * as 21 etapas do quiz estão criados e registrados.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// ============================================================================
// COMPONENTES NECESSÁRIOS POR STEP
// ============================================================================

const REQUIRED_COMPONENTS = {
    'step-01': {
        name: 'Introdução',
        sections: ['intro-hero', 'welcome-form'],
        components: [
            { type: 'quiz-intro-header', file: 'QuizIntroHeaderBlock.tsx', status: null },
            { type: 'form-input', file: 'FormInputBlock.tsx', status: null },
            { type: 'button', file: 'ButtonInlineBlock.tsx', status: null },
            { type: 'image', file: 'ImageInlineBlock.tsx', status: null },
        ]
    },
    'step-02-11': {
        name: 'Perguntas do Quiz (10 steps)',
        sections: ['question-hero', 'options-grid'],
        components: [
            { type: 'question-hero', file: 'QuestionHeroSection.tsx', status: null },
            { type: 'options-grid', file: 'OptionsGridSection.tsx', status: null },
            { type: 'options-grid', file: 'OptionsGridBlock.tsx', status: null },
        ]
    },
    'step-12': {
        name: 'Transição para Perguntas Estratégicas',
        sections: ['transition-hero'],
        components: [
            { type: 'transition-hero', file: 'TransitionHeroSection.tsx', status: null },
            { type: 'quiz-transition', file: 'QuizTransitionBlock.tsx', status: null },
        ]
    },
    'step-13-18': {
        name: 'Perguntas Estratégicas (6 steps)',
        sections: ['question-hero', 'options-grid'],
        components: [
            { type: 'strategic-question', file: 'StrategicQuestionBlock.tsx', status: null },
            { type: 'options-grid', file: 'OptionsGridBlock.tsx', status: null },
        ]
    },
    'step-19': {
        name: 'Transição para Resultado',
        sections: ['transition-hero'],
        components: [
            { type: 'transition-hero', file: 'TransitionHeroSection.tsx', status: null },
            { type: 'loading-animation', file: 'LoaderInlineBlock.tsx', status: null },
        ]
    },
    'step-20': {
        name: 'Resultado Personalizado',
        sections: ['result-hero', 'style-reveal', 'secondary-styles'],
        components: [
            { type: 'step20-result-header', file: 'Step20ModularBlocks.tsx', status: null },
            { type: 'step20-style-reveal', file: 'Step20ModularBlocks.tsx', status: null },
            { type: 'step20-secondary-styles', file: 'Step20ModularBlocks.tsx', status: null },
            { type: 'step20-personalized-offer', file: 'Step20ModularBlocks.tsx', status: null },
        ]
    },
    'step-21': {
        name: 'Oferta Personalizada',
        sections: ['offer-hero', 'pricing', 'testimonials'],
        components: [
            { type: 'offer-hero', file: 'OfferHeroSection.tsx', status: null },
            { type: 'sales-hero', file: 'SalesHeroBlock.tsx', status: null },
        ]
    }
};

// ============================================================================
// VERIFICAÇÃO DE ARQUIVOS
// ============================================================================

function checkFileExists(relativePath) {
    const possiblePaths = [
        path.join(rootDir, 'src/components/editor/blocks', relativePath),
        path.join(rootDir, 'src/components/sections/questions', relativePath),
        path.join(rootDir, 'src/components/sections/intro', relativePath),
        path.join(rootDir, 'src/components/sections/transitions', relativePath),
        path.join(rootDir, 'src/components/sections/offer', relativePath),
        path.join(rootDir, 'src/components/blocks/quiz', relativePath),
    ];

    for (const fullPath of possiblePaths) {
        if (fs.existsSync(fullPath)) {
            return { exists: true, path: fullPath };
        }
    }

    return { exists: false, path: null };
}

function checkRegistryEntry(componentType) {
    const registryPath = path.join(rootDir, 'src/components/editor/blocks/EnhancedBlockRegistry.tsx');

    if (!fs.existsSync(registryPath)) {
        return { registered: false, reason: 'Registry file not found' };
    }

    const content = fs.readFileSync(registryPath, 'utf-8');

    // Verifica se o tipo está registrado
    const patterns = [
        new RegExp(`'${componentType}':\\s*\\w+`, 'g'),
        new RegExp(`"${componentType}":\\s*\\w+`, 'g'),
    ];

    for (const pattern of patterns) {
        if (pattern.test(content)) {
            return { registered: true, reason: 'Found in registry' };
        }
    }

    return { registered: false, reason: 'Not found in registry' };
}

// ============================================================================
// ANÁLISE
// ============================================================================

async function analyzeComponents() {
    console.log('🔍 ANÁLISE DE COMPONENTES DO QUIZ (21 STEPS)\n');
    console.log('='.repeat(80));

    let totalComponents = 0;
    let existingComponents = 0;
    let registeredComponents = 0;
    const missingComponents = [];
    const unregisteredComponents = [];

    for (const [stepKey, stepInfo] of Object.entries(REQUIRED_COMPONENTS)) {
        console.log(`\n📋 ${stepInfo.name} (${stepKey})`);
        console.log('-'.repeat(80));
        console.log(`Sections: ${stepInfo.sections.join(', ')}\n`);

        for (const component of stepInfo.components) {
            totalComponents++;

            // Verificar se arquivo existe
            const fileCheck = checkFileExists(component.file);
            component.fileExists = fileCheck.exists;
            component.filePath = fileCheck.path;

            // Verificar se está registrado
            const registryCheck = checkRegistryEntry(component.type);
            component.isRegistered = registryCheck.registered;
            component.registryReason = registryCheck.reason;

            // Contadores
            if (component.fileExists) existingComponents++;
            if (component.isRegistered) registeredComponents++;

            // Status final
            if (!component.fileExists) {
                component.status = '❌ AUSENTE';
                missingComponents.push({ step: stepKey, ...component });
            } else if (!component.isRegistered) {
                component.status = '⚠️ NÃO REGISTRADO';
                unregisteredComponents.push({ step: stepKey, ...component });
            } else {
                component.status = '✅ OK';
            }

            // Exibir resultado
            console.log(`  ${component.status} ${component.type}`);
            console.log(`     Arquivo: ${component.file}`);
            if (component.fileExists) {
                console.log(`     ✅ Encontrado em: ${path.relative(rootDir, component.filePath)}`);
            } else {
                console.log(`     ❌ Arquivo não encontrado`);
            }
            if (component.isRegistered) {
                console.log(`     ✅ Registrado no EnhancedBlockRegistry`);
            } else {
                console.log(`     ⚠️ ${component.registryReason}`);
            }
            console.log('');
        }
    }

    // Relatório Final
    console.log('\n' + '='.repeat(80));
    console.log('📊 RELATÓRIO FINAL\n');
    console.log(`Total de componentes necessários: ${totalComponents}`);
    console.log(`Componentes existentes: ${existingComponents}/${totalComponents} (${Math.round(existingComponents / totalComponents * 100)}%)`);
    console.log(`Componentes registrados: ${registeredComponents}/${totalComponents} (${Math.round(registeredComponents / totalComponents * 100)}%)`);

    if (missingComponents.length > 0) {
        console.log(`\n❌ COMPONENTES FALTANDO (${missingComponents.length}):`);
        missingComponents.forEach(comp => {
            console.log(`   - ${comp.type} (${comp.file}) para ${comp.step}`);
        });
    }

    if (unregisteredComponents.length > 0) {
        console.log(`\n⚠️ COMPONENTES NÃO REGISTRADOS (${unregisteredComponents.length}):`);
        unregisteredComponents.forEach(comp => {
            console.log(`   - ${comp.type} (arquivo existe mas não está no registry)`);
        });
    }

    if (missingComponents.length === 0 && unregisteredComponents.length === 0) {
        console.log('\n✅ TODOS OS COMPONENTES ESTÃO CRIADOS E REGISTRADOS!');
    }

    console.log('\n' + '='.repeat(80));
}

// Executar
analyzeComponents().catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
});
