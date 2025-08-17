import { readFileSync, readdirSync } from 'fs';
import { dirname, join } from 'path';
import ts from 'typescript';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Interfaces esperadas no sistema
const REQUIRED_INTERFACES = ['Quiz', 'Template', 'Block', 'Step', 'Option', 'Result'];

// Hooks esperados no sistema
const REQUIRED_HOOKS = [
  'useQuizState',
  'useQuizNavigation',
  'useQuizValidation',
  'useQuizAnalytics',
];

async function verificarInterfaces() {
  console.log('\n🔍 Verificando interfaces...');

  try {
    const srcPath = join(__dirname, '..', 'src');
    const typesPath = join(srcPath, 'types');
    const files = readdirSync(typesPath).filter(file => file.endsWith('.ts'));

    const interfacesEncontradas = new Set();

    for (const file of files) {
      const conteudo = readFileSync(join(typesPath, file), 'utf-8');

      // Verificar interfaces declaradas
      const interfaceRegex = /interface\s+(\w+)/g;
      let match;

      while ((match = interfaceRegex.exec(conteudo)) !== null) {
        interfacesEncontradas.add(match[1]);
      }
    }

    // Verificar interfaces requeridas
    const interfacesFaltando = REQUIRED_INTERFACES.filter(
      interface_ => !interfacesEncontradas.has(interface_)
    );

    if (interfacesFaltando.length > 0) {
      console.log('❌ Interfaces faltando:', interfacesFaltando.join(', '));
    } else {
      console.log('✅ Todas as interfaces requeridas estão presentes');
    }

    return interfacesFaltando.length === 0;
  } catch (erro) {
    console.error('❌ Erro ao verificar interfaces:', erro.message);
    return false;
  }
}

async function verificarHooks() {
  console.log('\n� Verificando hooks...');

  try {
    const hooksPath = join(__dirname, '..', 'src', 'hooks');
    const files = readdirSync(hooksPath).filter(
      file => file.endsWith('.ts') || file.endsWith('.tsx')
    );

    const hooksEncontrados = new Set();

    for (const file of files) {
      const conteudo = readFileSync(join(hooksPath, file), 'utf-8');

      // Verificar hooks declarados
      const hookRegex = /export\s+const\s+(use\w+)/g;
      let match;

      while ((match = hookRegex.exec(conteudo)) !== null) {
        hooksEncontrados.add(match[1]);
      }
    }

    // Verificar hooks requeridos
    const hooksFaltando = REQUIRED_HOOKS.filter(hook => !hooksEncontrados.has(hook));

    if (hooksFaltando.length > 0) {
      console.log('❌ Hooks faltando:', hooksFaltando.join(', '));
    } else {
      console.log('✅ Todos os hooks requeridos estão presentes');
    }

    return hooksFaltando.length === 0;
  } catch (erro) {
    console.error('❌ Erro ao verificar hooks:', erro.message);
    return false;
  }
}

async function verificarUsoHooks() {
  console.log('\n🔍 Verificando uso dos hooks...');

  try {
    const templatesPath = join(__dirname, '..', 'src', 'templates');
    const files = readdirSync(templatesPath).filter(file => file.endsWith('.tsx'));

    const hooksUsados = new Set();

    for (const file of files) {
      const conteudo = readFileSync(join(templatesPath, file), 'utf-8');

      // Verificar uso dos hooks
      for (const hook of REQUIRED_HOOKS) {
        if (conteudo.includes(hook)) {
          hooksUsados.add(hook);
        }
      }
    }

    // Verificar hooks não utilizados
    const hooksNaoUsados = REQUIRED_HOOKS.filter(hook => !hooksUsados.has(hook));

    if (hooksNaoUsados.length > 0) {
      console.log('⚠️ Hooks não utilizados:', hooksNaoUsados.join(', '));
    } else {
      console.log('✅ Todos os hooks estão sendo utilizados');
    }

    return true; // Não falha a verificação por hooks não utilizados
  } catch (erro) {
    console.error('❌ Erro ao verificar uso dos hooks:', erro.message);
    return false;
  }
}

async function verificarTiposPersonalizados() {
  console.log('\n🔍 Verificando tipos personalizados...');

  try {
    const srcPath = join(__dirname, '..', 'src');
    const files = readdirSync(srcPath, { recursive: true }).filter(
      file => file.endsWith('.ts') || file.endsWith('.tsx')
    );

    let tiposValidos = true;

    const configPath = join(__dirname, '..', 'tsconfig.json');
    const configFile = ts.sys.readFile(configPath);
    const basePath = dirname(configPath);

    if (!configFile) {
      throw new Error('Arquivo tsconfig.json não encontrado');
    }

    const { config } = ts.parseConfigFileTextToJson(configPath, configFile);
    const parseResult = ts.parseJsonConfigFileContent(config, ts.sys, basePath);

    for (const file of files) {
      const filePath = join(srcPath, file);
      const program = ts.createProgram([filePath], parseResult.options);

      const diagnostics = ts.getPreEmitDiagnostics(program);

      if (diagnostics.length > 0) {
        console.log(`❌ Erros de tipo encontrados em ${file}:`);
        diagnostics.forEach(diagnostic => {
          const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
          console.log(`   - ${message}`);
        });
        tiposValidos = false;
      }
    }

    if (tiposValidos) {
      console.log('✅ Todos os tipos estão corretos');
    }

    return tiposValidos;
  } catch (erro) {
    console.error('❌ Erro ao verificar tipos:', erro.message);
    return false;
  }
}

async function verificarSchemaEHooks() {
  console.log('🚀 Iniciando verificação de Schema e Hooks...\n');

  try {
    // Verificar interfaces
    const interfacesOk = await verificarInterfaces();

    // Verificar hooks
    const hooksOk = await verificarHooks();

    // Verificar uso dos hooks
    const usoHooksOk = await verificarUsoHooks();

    // Verificar tipos personalizados
    const tiposOk = await verificarTiposPersonalizados();

    // Resultado final
    if (interfacesOk && hooksOk && usoHooksOk && tiposOk) {
      console.log('\n✅ Verificação concluída com sucesso!');
    } else {
      console.log('\n❌ Verificação concluída com problemas.');
      process.exit(1);
    }
  } catch (erro) {
    console.error('\n❌ Erro durante verificação:', erro.message);
    process.exit(1);
  }
}

verificarSchemaEHooks();
