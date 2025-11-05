#!/usr/bin/env node
/**
 * 🔄 MIGRAÇÃO: intro-logo → quiz-intro-header
 * Substitui todos os blocos intro-logo por quiz-intro-header no quiz21-complete.json
 * e gera steps individuais atualizados
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const QUIZ_FILE = path.join(__dirname, 'public/templates/quiz21-complete.json');
const STEPS_DIR = path.join(__dirname, 'public/templates');

console.log('\n🔄 MIGRAÇÃO: intro-logo → quiz-intro-header\n');
console.log('═'.repeat(80));

// Ler arquivo principal
console.log('\n📖 Lendo quiz21-complete.json...');
const quizData = JSON.parse(fs.readFileSync(QUIZ_FILE, 'utf-8'));

let totalSteps = 0;
let stepsWithIntroLogo = 0;
let blocksConverted = 0;

// Função para converter intro-logo em quiz-intro-header
function convertIntroLogoToHeader(block, stepKey, stepIndex) {
    if (block.type !== 'intro-logo') return block;

    blocksConverted++;

    // Pegar dados do logo original
    const logoUrl = block.content?.src || block.content?.imageUrl || block.content?.logoUrl || 
        block.properties?.logoUrl || 
        'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_70,w_120,h_50,c_fit/v1752430327/LOGO_DA_MARCA_GISELE_l78gin.png';
    
    const logoAlt = block.content?.alt || block.content?.logoAlt || 
        block.properties?.logoAlt || 'Logo Gisele Galvão';
    
    const logoWidth = block.content?.width || block.properties?.logoWidth || 120;
    const logoHeight = block.content?.height || block.properties?.logoHeight || 50;

    // Calcular progresso (assumindo 21 steps)
    const progressValue = Math.round((stepIndex / 21) * 100);

    return {
        id: block.id.replace('intro-logo', 'quiz-intro-header'),
        type: 'quiz-intro-header',
        order: block.order || 0,
        properties: {
            // Logo
            logoUrl,
            logoAlt,
            logoWidth,
            logoHeight,
            showLogo: true,
            logoPosition: 'center',
            
            // Progresso
            showProgress: true,
            progressValue,
            progressMax: 100,
            progressHeight: 4,
            progressStyle: 'bar',
            progressColor: '#B89B7A',
            progressBackgroundColor: '#E5DDD5',
            
            // Navegação
            showBackButton: stepIndex > 1, // Mostrar voltar a partir do step 2
            backButtonStyle: 'icon',
            backButtonPosition: 'left',
            
            // Layout
            headerStyle: 'default',
            backgroundColor: '#FAF9F7',
            showBorder: false,
            isSticky: false, // Desabilitado para editor
            enableAnimation: true,
            
            // Margens
            marginTop: 0,
            marginBottom: 16,
            contentMaxWidth: 640,
            
            // Preservar propriedades originais de animação
            ...(block.properties?.animationType && {
                animationType: block.properties.animationType,
                animationDuration: block.properties.animationDuration || 300
            })
        },
        parentId: null
    };
}

// Processar cada step
console.log('\n🔍 Analisando steps...\n');

Object.entries(quizData.steps).forEach(([stepKey, stepData], index) => {
    totalSteps++;
    const stepNumber = index + 1;

    console.log(`📄 ${stepKey}: ${stepData.metadata?.name || 'Sem nome'}`);

    if (!stepData.blocks || !Array.isArray(stepData.blocks)) {
        console.log('   ⚠️  Sem blocos\n');
        return;
    }

    let hasIntroLogo = false;
    stepData.blocks = stepData.blocks.map(block => {
        if (block.type === 'intro-logo') {
            hasIntroLogo = true;
            console.log(`   ✅ Convertendo intro-logo → quiz-intro-header`);
            return convertIntroLogoToHeader(block, stepKey, stepNumber);
        }
        return block;
    });

    if (hasIntroLogo) {
        stepsWithIntroLogo++;
        console.log(`   📊 Progresso: ${Math.round((stepNumber / 21) * 100)}%`);
    }

    console.log('');
});

// Atualizar metadata
quizData.metadata.updatedAt = new Date().toISOString();
quizData.metadata.migrationApplied = 'intro-logo-to-quiz-intro-header';
quizData.metadata.migrationDate = new Date().toISOString();

// Salvar arquivo principal atualizado
console.log('\n💾 Salvando quiz21-complete.json...');
fs.writeFileSync(QUIZ_FILE, JSON.stringify(quizData, null, 2), 'utf-8');
console.log('   ✅ Arquivo principal atualizado');

// Gerar steps individuais
console.log('\n📦 Gerando steps individuais...\n');

let stepsGenerated = 0;
Object.entries(quizData.steps).forEach(([stepKey, stepData]) => {
    const stepNumber = stepKey.replace('step-', '');
    const filename = `step-${stepNumber}-v3.json`;
    const filepath = path.join(STEPS_DIR, filename);

    // Preparar dados do step individual
    const individualStep = {
        templateVersion: stepData.templateVersion || "3.0",
        metadata: {
            ...stepData.metadata,
            updatedAt: new Date().toISOString(),
            migratedFrom: 'quiz21-complete.json',
            migrationApplied: 'intro-logo-to-quiz-intro-header'
        },
        theme: stepData.theme || quizData.theme,
        validation: stepData.validation,
        behavior: stepData.behavior,
        type: stepData.type,
        redirectPath: stepData.redirectPath,
        navigation: stepData.navigation,
        blocks: stepData.blocks
    };

    fs.writeFileSync(filepath, JSON.stringify(individualStep, null, 2), 'utf-8');
    stepsGenerated++;
    console.log(`   ✅ ${filename} gerado`);
});

// Resumo final
console.log('\n');
console.log('═'.repeat(80));
console.log('\n📊 RESUMO DA MIGRAÇÃO\n');
console.log(`Total de steps processados:      ${totalSteps}`);
console.log(`Steps com intro-logo:            ${stepsWithIntroLogo}`);
console.log(`Blocos convertidos:              ${blocksConverted}`);
console.log(`Steps individuais gerados:       ${stepsGenerated}`);
console.log('');
console.log('✅ MIGRAÇÃO CONCLUÍDA COM SUCESSO!');
console.log('');
console.log('📝 Alterações aplicadas:');
console.log('   - intro-logo → quiz-intro-header');
console.log('   - Barra de progresso adicionada (0-100%)');
console.log('   - Botão voltar adicionado (step 2+)');
console.log('   - Propriedades avançadas configuradas');
console.log('   - Steps individuais atualizados');
console.log('');
console.log('📁 Arquivos atualizados:');
console.log('   - public/templates/quiz21-complete.json');
console.log('   - public/templates/step-01-v3.json');
console.log('   - public/templates/step-02-v3.json');
console.log('   - ... (todos os 21 steps)');
console.log('');
console.log('═'.repeat(80));
console.log('\n');
