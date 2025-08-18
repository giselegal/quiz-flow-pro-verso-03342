import { execSync } from 'child_process';

// Padrões de arquivos para formatar e analisar
const PATTERNS = [
  // Componentes do editor-fixed
  'src/**/editor-fixed*/**/*.{ts,tsx}',
  'src/**/editor-fixed*.{ts,tsx}',
  // Painéis de propriedades relacionados
  'src/components/editor/properties/**/*.{ts,tsx}',
  // Blocos editáveis
  'src/components/editor/blocks/**/*.{ts,tsx}',
];

console.log('🔍 Analisando e formatando componentes do editor-fixed...');

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
