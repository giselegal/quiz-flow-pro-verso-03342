// Teste simples do registry em JavaScript
console.log('🧪 Tentando importar EnhancedBlockRegistry...');

try {
    // Como é uma importação ES6, pode não funcionar diretamente no Node
    const fs = require('fs');
    const path = require('path');

    console.log('📂 Verificando se os arquivos existem:');

    const files = [
        '/workspaces/quiz-quest-challenge-verse/src/components/editor/blocks/EnhancedBlockRegistry.tsx',
        '/workspaces/quiz-quest-challenge-verse/src/utils/optimizedRegistry.ts',
        '/workspaces/quiz-quest-challenge-verse/src/components/editor/blocks/QuizIntroHeaderBlock.tsx'
    ];

    files.forEach(file => {
        const exists = fs.existsSync(file);
        console.log(`${exists ? '✅' : '❌'} ${file}`);
    });

} catch (error) {
    console.error('❌ Erro no teste:', error);
}

console.log('\n💡 O problema pode estar na diferença entre runtime do Node e browser');
console.log('💡 Vamos verificar os logs no browser console em tempo real');