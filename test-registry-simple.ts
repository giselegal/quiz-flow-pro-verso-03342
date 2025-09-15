// Teste simples do registry para debug
import { getEnhancedBlockComponent } from '@/components/editor/blocks/EnhancedBlockRegistry';

console.log('🧪 Teste do Registry - Iniciando...');

// Tipos que estão causando erro
const typesToTest = [
    'quiz-intro-header',
    'text',
    'image',
    'button'
];

console.log('🔍 Testando tipos problemáticos:');

typesToTest.forEach(type => {
    console.log(`\n📋 Testando tipo: "${type}"`);

    try {
        const component = getEnhancedBlockComponent(type);
        console.log(`✅ Componente encontrado para "${type}":`, component ? component.name || 'Componente anônimo' : 'null/undefined');
    } catch (error) {
        console.error(`❌ Erro ao buscar "${type}":`, error);
    }
});

console.log('\n🏁 Teste do Registry - Finalizado');