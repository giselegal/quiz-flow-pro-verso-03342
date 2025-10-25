const { execSync } = require('child_process');
const path = require('path');

// Lista de arquivos para migrar
const FILES_TO_MIGRATE = [
  'src/components/editor/properties/step-types/QuestionStepProperties.tsx',
  'src/components/editor/properties/step-types/TransitionStepProperties.tsx',
  'src/components/editor/properties/step-types/ResultStepProperties.tsx',
  'src/hooks/useUnifiedProperties.ts',
  'src/components/editor/properties/IntelligentPropertiesPanel.tsx',
  'src/components/editor/properties/EnhancedPropertiesPanel.tsx',
  'src/components/editor/properties/ComponentSpecificPropertiesPanel.tsx',
];

// Diretórios a serem criados
const DIRECTORIES_TO_CREATE = [
  'src/components/editor/properties/panels',
  'src/components/editor/properties/editors',
  'src/components/editor/properties/core',
];

try {
  // 1. Criar diretórios necessários
  console.log('📁 Criando diretórios...');
  DIRECTORIES_TO_CREATE.forEach(dir => {
    execSync(`mkdir -p ${dir}`);
  });

  // 2. Formatar todos os arquivos com Prettier
  console.log('🎨 Formatando arquivos...');
  execSync(`npx prettier --write "${FILES_TO_MIGRATE.join('" "')}"`);

  // 3. Migrar arquivos para nova estrutura
  console.log('🚀 Migrando arquivos para nova estrutura...');
  FILES_TO_MIGRATE.forEach(file => {
    const basename = path.basename(file);
    const newName = basename.replace('Properties.tsx', 'Panel.tsx');
    const newPath = `src/components/editor/properties/panels/${newName}`;
    execSync(`cp ${file} ${newPath}`);
  });

  // 4. Formatar novos arquivos
  console.log('✨ Formatando novos arquivos...');
  execSync('npx prettier --write "src/components/editor/properties/panels/*.tsx"');

  // 5. Executar ESLint para verificar problemas
  console.log('🔍 Verificando problemas com ESLint...');
  execSync('npx eslint --fix "src/components/editor/properties/**/*.{ts,tsx}"');

  console.log('✅ Migração concluída com sucesso!');
} catch (error) {
  console.error('❌ Erro durante a migração:', error);
  process.exit(1);
}
