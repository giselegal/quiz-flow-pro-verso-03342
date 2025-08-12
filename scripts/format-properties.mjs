import { execSync } from 'child_process';

// Padrões de arquivos para formatar
const PATTERNS = [
  // Core
  'src/components/editor/properties/core/**/*.{ts,tsx}',
  // Panels
  'src/components/editor/properties/panels/**/*.{ts,tsx}',
  // Step Types
  'src/components/editor/properties/step-types/**/*.{ts,tsx}',
  // Hooks
  'src/hooks/*Properties*.ts',
  // Components
  'src/components/**/properties/**/*.{ts,tsx}',
];

console.log('🎨 Formatando arquivos em lote...');

try {
  // Executar prettier em todos os padrões
  const command = `npx prettier --write "${PATTERNS.join('" "')}"`;
  console.time('⏱️ Tempo de execução');

  execSync(command, { stdio: 'inherit' });

  console.timeEnd('⏱️ Tempo de execução');
  console.log('✅ Formatação concluída com sucesso!');
} catch (error) {
  console.error('❌ Erro durante a formatação:', error);
  process.exit(1);
}
