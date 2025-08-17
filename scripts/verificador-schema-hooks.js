import chalk from 'chalk';
import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Função para verificar schema de dados
function verificarSchemaDados() {
  console.log(chalk.blue('🔍 Verificando Schema de Dados...'));

  const requiredInterfaces = ['User', 'Quiz', 'Template', 'Block'];

  const requiredTypes = [
    'interface User {',
    'interface Quiz {',
    'interface Template {',
    'interface Block {',
  ];

  try {
    // Procurar por arquivos de tipos
    const typesPath = join(__dirname, '../src/types');
    const files = fs.readdirSync(typesPath);

    let interfacesEncontradas = new Set();

    files.forEach(file => {
      const conteudo = fs.readFileSync(join(typesPath, file), 'utf8');
      requiredTypes.forEach(type => {
        if (conteudo.includes(type)) {
          interfacesEncontradas.add(type.split(' ')[1]);
        }
      });
    });

    const interfacesFaltando = requiredInterfaces.filter(i => !interfacesEncontradas.has(i));

    if (interfacesFaltando.length > 0) {
      console.log(chalk.red(`❌ Interfaces faltando: ${interfacesFaltando.join(', ')}`));
      return false;
    }

    console.log(chalk.green('✅ Todas as interfaces necessárias estão definidas'));
    return true;
  } catch (error) {
    console.error(chalk.red('❌ Erro ao verificar schema:'), error);
    return false;
  }
}

// Função para verificar hooks
function verificarHooks() {
  console.log(chalk.blue('\n🔍 Verificando Hooks...'));

  const requiredHooks = ['useQuizLogic', 'useSupabaseQuiz', 'useUserProgress'];

  try {
    // Procurar por arquivos de hooks
    const hooksPath = join(__dirname, '../src/hooks');
    const files = fs.readdirSync(hooksPath);

    let hooksEncontrados = new Set();

    files.forEach(file => {
      const conteudo = fs.readFileSync(join(hooksPath, file), 'utf8');
      requiredHooks.forEach(hook => {
        if (conteudo.includes(`export function ${hook}`)) {
          hooksEncontrados.add(hook);
        }
      });
    });

    const hooksFaltando = requiredHooks.filter(h => !hooksEncontrados.has(h));

    if (hooksFaltando.length > 0) {
      console.log(chalk.red(`❌ Hooks faltando: ${hooksFaltando.join(', ')}`));
      return false;
    }

    console.log(chalk.green('✅ Todos os hooks necessários estão implementados'));
    return true;
  } catch (error) {
    console.error(chalk.red('❌ Erro ao verificar hooks:'), error);
    return false;
  }
}

// Verificar uso de hooks no template
function verificarUsoHooksTemplate() {
  console.log(chalk.blue('\n🔍 Verificando uso de hooks no template...'));

  try {
    const templatePath = join(__dirname, '../src/templates/Step01Template.tsx');
    if (!fs.existsSync(templatePath)) {
      console.log(chalk.red('❌ Arquivo Step01Template.tsx não encontrado'));
      return false;
    }

    const conteudo = fs.readFileSync(templatePath, 'utf8');

    const hooksNecessarios = ['useQuizLogic', 'useSupabaseQuiz', 'useUserProgress'];

    const hooksFaltando = hooksNecessarios.filter(hook => !conteudo.includes(hook));

    if (hooksFaltando.length > 0) {
      console.log(chalk.red(`❌ Hooks não utilizados no template: ${hooksFaltando.join(', ')}`));
      return false;
    }

    console.log(chalk.green('✅ Todos os hooks estão sendo utilizados corretamente no template'));
    return true;
  } catch (error) {
    console.error(chalk.red('❌ Erro ao verificar uso de hooks:'), error);
    return false;
  }
}

// Execução principal
async function verificarSchemaEHooks() {
  console.log(chalk.blue('🚀 Iniciando verificação de Schema e Hooks...\n'));

  const schemaOK = verificarSchemaDados();
  const hooksOK = verificarHooks();
  const usoHooksOK = verificarUsoHooksTemplate();

  const sucesso = schemaOK && hooksOK && usoHooksOK;

  if (sucesso) {
    console.log(chalk.green('\n✨ Verificação de Schema e Hooks concluída com sucesso!'));
  } else {
    console.log(chalk.red('\n❌ Verificação de Schema e Hooks concluída com erros.'));
    process.exit(1);
  }
}

// Iniciar verificação
verificarSchemaEHooks();
