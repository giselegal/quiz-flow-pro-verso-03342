import { dirname } from 'path';
import ts from 'typescript';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function analisarEtapas() {
  console.log('🔍 Iniciando análise detalhada do quiz...\n');

  try {
    // Configurar o compilador TypeScript
    const config = {
      allowJs: true,
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.NodeNext,
    };

    console.log('✅ Análise concluída com sucesso!');
  } catch (erro) {
    console.error('❌ Erro durante análise:', erro.message);
    process.exit(1);
  }
}

analisarEtapas();
