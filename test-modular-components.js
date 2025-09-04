console.log('🔧 Teste do sistema MODULAR_COMPONENTS');

// Testar se os componentes modulares estão carregando
import { MODULAR_COMPONENTS } from './src/config/modularComponents.js';

console.log('📦 MODULAR_COMPONENTS carregado:', {
    total: MODULAR_COMPONENTS.length,
    primeiros5: MODULAR_COMPONENTS.slice(0, 5).map(c => ({
        id: c.id,
        type: c.type,
        name: c.name,
        temPropriedades: !!c.properties
    }))
});

// Testar tipos específicos que devem existir
const tiposEssenciais = ['quiz-intro', 'quiz-header', 'quiz-question', 'quiz-results'];
tiposEssenciais.forEach(tipo => {
    const componente = MODULAR_COMPONENTS.find(c => c.type === tipo);
    console.log(`🎯 Tipo ${tipo}:`, componente ? 'ENCONTRADO' : 'NÃO ENCONTRADO');
    if (componente) {
        console.log(`  - Propriedades: ${Object.keys(componente.properties).length}`);
        console.log(`  - Categoria: ${componente.category}`);
    }
});

export { MODULAR_COMPONENTS };
