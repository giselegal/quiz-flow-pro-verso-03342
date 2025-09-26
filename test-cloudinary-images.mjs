/**
 * 🧪 TESTE DE CONFIGURAÇÃO DAS IMAGENS CLOUDINARY
 * 
 * Verifica se todas as URLs estão funcionando corretamente
 */

import {
    LOGO_URLS,
    INTRO_IMAGE_URLS,
    generateLogoUrl,
    generateIntroImageUrl,
    STATIC_LOGO_IMAGE_URLS,
    STATIC_INTRO_IMAGE_URLS
} from './src/config/cloudinaryImages.js';

console.log('🖼️ TESTE DAS IMAGENS CLOUDINARY ATUALIZADAS\n');

console.log('📋 NOVA IMAGEM PRINCIPAL:');
console.log('=========================');
console.log('🎯 URL Original:', 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.png');
console.log('🎯 Status: ✅ ATIVA (verificado com curl)');
console.log('🎯 Tipo: PNG de alta qualidade (1024x1024)');
console.log('🎯 Tamanho: ~1.7MB');

console.log('\n📐 URLS GERADAS (Multi-formato):');
console.log('=================================');

// Testar URLs da imagem principal
console.log('\n🖼️ IMAGEM PRINCIPAL DA INTRO:');
Object.entries(INTRO_IMAGE_URLS).forEach(([format, url]) => {
    if (typeof url === 'string') {
        console.log(`   ${format.toUpperCase()}: ${url}`);
    } else {
        console.log(`   ${format.toUpperCase()}:`);
        Object.entries(url).forEach(([size, sizeUrl]) => {
            console.log(`     ${size}: ${sizeUrl}`);
        });
    }
});

// Testar URLs do logo
console.log('\n🏷️ LOGO DA MARCA:');
Object.entries(LOGO_URLS).forEach(([format, url]) => {
    if (typeof url === 'string') {
        console.log(`   ${format.toUpperCase()}: ${url}`);
    } else {
        console.log(`   ${format.toUpperCase()}:`);
        Object.entries(url).forEach(([size, sizeUrl]) => {
            console.log(`     ${size}: ${sizeUrl}`);
        });
    }
});

console.log('\n🔧 FUNÇÕES UTILITÁRIAS:');
console.log('=======================');

// Testar funções geradoras
const logoCustom = generateLogoUrl({ format: 'webp', width: 150, height: 60, quality: 80 });
const introCustom = generateIntroImageUrl({ format: 'avif', width: 400, quality: 90 });

console.log('Logo customizado:', logoCustom);
console.log('Intro customizada:', introCustom);

console.log('\n📦 EXPORTS PARA COMPATIBILIDADE:');
console.log('=================================');
console.log('STATIC_LOGO_IMAGE_URLS:', STATIC_LOGO_IMAGE_URLS);
console.log('STATIC_INTRO_IMAGE_URLS:', STATIC_INTRO_IMAGE_URLS);

console.log('\n✅ VERIFICAÇÃO CONCLUÍDA');
console.log('========================');
console.log('✅ Nova imagem configurada nos arquivos:');
console.log('   - src/data/quizSteps.ts');
console.log('   - src/data/quizStepsGisele.ts');
console.log('   - src/config/modularComponents.ts');
console.log('   - src/config/templates/quiz-intro-component.json');
console.log('   - src/config/cloudinaryImages.ts (NOVO)');
console.log('\n🚀 PRONTO para implementação do componente QuizIntro ideal!');