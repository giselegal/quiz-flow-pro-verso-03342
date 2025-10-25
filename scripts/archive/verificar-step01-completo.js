/**
 * Script para verific// Paths para os arquivos relevantes
const PATHS = {
  jsonTemplate: path.join(__dirname, '../src/config/templates/step-01.json'),
  tsxTemplate: path.join(__dirname, '../src/components/steps/Step01Template.tsx'),
  stepsComplete: path.join(__dirname, '../src/templates/quiz21StepsComplete.ts'),
  editorProps: path.join(__dirname, '../src/components/editor/properties/PropertiesPanel.tsx'),
  componentRegistry: path.join(__dirname, '../src/components/registry.ts'),
  validationsFile: path.join(__dirname, '../src/lib/validations.ts'),
  // Novas paths para hooks, schema e camadas adicionais
  hooksDir: path.join(__dirname, '../src/hooks'),
  schemaDir: path.join(__dirname, '../src/schemas'),
  supabaseDir: path.join(__dirname, '../src/lib/supabase'),
  indexFile: path.join(__dirname, '../src/pages/index.tsx'),
  layoutFile: path.join(__dirname, '../src/components/layout/Layout.tsx')
};tapa 01 está configurada corretamente
 * 
 * Este script analisa:
 * - Componentes da Etapa 01
 * - Configuração no Supabase e validade dos IDs
 * - Funcionalidade de coleta de nome do usuário
 * - Correção do arquivo JSON e TSX
 * - Painel de Propriedades e suas propriedades específicas
 * - Validações ativas
 * - Hooks configurados
 * - Schema de dados
 * - Configurações de index e todas as camadas necessárias
 */

import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import prettier from 'prettier';
import { fileURLToPath } from 'url';

// Obter o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Configurações para o relatório
const REPORT_FILE = path.join(__dirname, '../step01-verification-report.md');

// Paths para os arquivos relevantes
const PATHS = {
  jsonTemplate: path.join(__dirname, '../src/config/templates/step-01.json'),
  tsxTemplate: path.join(__dirname, '../src/components/steps/Step01Template.tsx'),
  stepsComplete: path.join(__dirname, '../src/templates/quiz21StepsComplete.ts'),
  editorProps: path.join(__dirname, '../src/components/editor/properties/PropertiesPanel.tsx'),
  componentRegistry: path.join(__dirname, '../src/components/registry.ts'),
  validationsFile: path.join(__dirname, '../src/lib/validations.ts'),
};

// Relatório de saída
const report = [];
let hasErrors = false;

// Função para adicionar seção ao relatório
function addSection(title, content, isError = false) {
  if (isError) hasErrors = true;
  report.push(`\n## ${isError ? '❌' : '✅'} ${title}\n`);
  report.push(content);
}

// Função para formatar JSON bonito
async function formatJSON(obj) {
  try {
    return await prettier.format(JSON.stringify(obj, null, 2), { parser: 'json' });
  } catch (error) {
    return JSON.stringify(obj, null, 2);
  }
}

// Função principal de verificação
async function verificarStep01() {
  console.log(chalk.blue('🔍 Iniciando verificação da Etapa 01...'));
  report.push('# Relatório de Verificação da Etapa 01\n');
  report.push(`Data da verificação: ${new Date().toLocaleString()}\n`);

  try {
    // 1. Verificar se os arquivos existem
    verificarArquivos();

    // 2. Analisar o template JSON
    await analisarTemplateJSON();

    // 3. Analisar o template TSX
    analisarTemplateTSX();

    // 4. Verificar componentes no registry
    verificarComponentesRegistry();

    // 5. Verificar propriedades no painel
    verificarPropriedadesPainel();

    // 6. Verificar validações
    verificarValidacoes();

    // 7. Verificar hooks configurados
    verificarHooks();

    // 8. Verificar schema de dados
    verificarSchema();

    // 9. Verificar integração com Supabase
    verificarSupabase();

    // 10. Verificar index e layout
    verificarIndexELayout();

    // 11. Comparar com quiz21StepsComplete
    await compararComStepsComplete();

    // Finalizar relatório
    const statusFinal = hasErrors
      ? '⚠️ Foram encontrados problemas que precisam ser corrigidos.'
      : '✅ Todas as verificações passaram com sucesso!';

    report.push(`\n# Conclusão\n\n${statusFinal}`);

    // Salvar relatório
    fs.writeFileSync(REPORT_FILE, report.join('\n'));
    console.log(chalk.green(`✅ Relatório salvo em ${REPORT_FILE}`));

    if (hasErrors) {
      console.log(chalk.yellow('⚠️ Foram encontrados problemas que precisam ser corrigidos.'));
    } else {
      console.log(chalk.green('✅ Todas as verificações passaram com sucesso!'));
    }
  } catch (error) {
    console.error(chalk.red(`❌ Erro durante a verificação: ${error.message}`));
    addSection('Erro Fatal', `\`\`\`\n${error.stack}\n\`\`\``, true);
    fs.writeFileSync(REPORT_FILE, report.join('\n'));
  }
}

// Função para verificar se os arquivos existem
function verificarArquivos() {
  console.log(chalk.blue('🔍 Verificando arquivos...'));
  const arquivosStatus = [];

  for (const [key, filePath] of Object.entries(PATHS)) {
    const exists = fs.existsSync(filePath);
    arquivosStatus.push(
      `- ${exists ? '✅' : '❌'} ${key}: ${filePath} ${exists ? 'existe' : 'NÃO EXISTE'}`
    );

    if (!exists) {
      hasErrors = true;
    }
  }

  addSection('Verificação de Arquivos', arquivosStatus.join('\n'), hasErrors);
}

// Função para analisar o template JSON
async function analisarTemplateJSON() {
  console.log(chalk.blue('🔍 Analisando template JSON...'));

  try {
    const jsonContent = fs.readFileSync(PATHS.jsonTemplate, 'utf8');
    const template = JSON.parse(jsonContent);

    // Verificar metadata
    const metadata = template.metadata || {};
    const metadataCheck = [
      `- ID: ${metadata.id || 'Não definido'}`,
      `- Nome: ${metadata.name || 'Não definido'}`,
      `- Categoria: ${metadata.category || 'Não definida'}`,
      `- Tipo: ${metadata.type || 'Não definido'}`,
      `- Tags: ${(metadata.tags || []).join(', ')}`,
    ].join('\n');

    // Verificar blocos
    const blocks = template.blocks || [];
    const blocksInfo = blocks
      .map(block => {
        return `- ID: ${block.id}, Tipo: ${block.type}`;
      })
      .join('\n');

    // Verificar validação do formulário
    const validationInfo = template.validation?.nameField
      ? `- Nome: Requerido=${template.validation.nameField.required}, MinLength=${template.validation.nameField.minLength}, MaxLength=${template.validation.nameField.maxLength}`
      : '- Não há validação para campo de nome';

    // Verificar navegação
    const navigationInfo = template.logic?.navigation
      ? `- Próxima etapa: ${template.logic.navigation.nextStep || 'Não definida'}\n- Etapa anterior: ${template.logic.navigation.prevStep || 'Não definida'}\n- Auto-avanço: ${template.logic.navigation.autoAdvance ? 'Sim' : 'Não'}`
      : '- Informações de navegação não definidas';

    const jsonReport = [
      `### Metadata\n${metadataCheck}\n`,
      `### Blocos (${blocks.length} total)\n${blocksInfo}\n`,
      `### Validação\n${validationInfo}\n`,
      `### Navegação\n${navigationInfo}\n`,
    ].join('\n');

    // Verificar se há erros
    const temErros = !metadata.id || blocks.length === 0;

    addSection('Análise do Template JSON', jsonReport, temErros);

    // Formato de JSON
    try {
      await prettier.format(jsonContent, { parser: 'json' });
      addSection('Formatação do JSON', '- ✅ JSON está formatado corretamente');
    } catch (error) {
      addSection('Formatação do JSON', `- ❌ Erro na formatação do JSON: ${error.message}`, true);
    }
  } catch (error) {
    addSection(
      'Análise do Template JSON',
      `❌ Erro ao analisar o arquivo JSON: ${error.message}`,
      true
    );
  }
}

// Função para analisar o template TSX
function analisarTemplateTSX() {
  console.log(chalk.blue('🔍 Analisando template TSX...'));

  try {
    const tsxContent = fs.readFileSync(PATHS.tsxTemplate, 'utf8');

    // Verificar imports
    const imports = tsxContent.match(/import\s+.*\s+from\s+['"].*['"]/g) || [];
    const importsReport = imports.map(imp => `- ${imp}`).join('\n');

    // Verificar se tem ConnectedTemplateWrapper
    const temConnectedWrapper = tsxContent.includes('ConnectedTemplateWrapper');

    // Verificar se coleta nome do usuário
    const coletaNome =
      tsxContent.includes('ConnectedLeadForm') ||
      tsxContent.includes('name=') ||
      tsxContent.includes('userName') ||
      tsxContent.includes('lead-form');

    // Verificar props da função
    const propsMatch = tsxContent.match(
      /export\s+default\s+function\s+Step01Template\s*\(\s*\{\s*([^}]*)\}\s*:/
    );
    const props = propsMatch ? propsMatch[1].split(',').map(p => p.trim()) : [];

    const tsxReport = [
      `### Imports (${imports.length} total)\n${importsReport}\n`,
      `### Componente Principal\n- ConnectedTemplateWrapper: ${temConnectedWrapper ? '✅ Presente' : '❌ Ausente'}\n- Coleta nome do usuário: ${coletaNome ? '✅ Presente' : '❌ Ausente'}\n`,
      `### Props\n- ${props.join('\n- ')}`,
    ].join('\n');

    // Verificar se há erros
    const temErros = !temConnectedWrapper || !coletaNome;

    addSection('Análise do Template TSX', tsxReport, temErros);
  } catch (error) {
    addSection(
      'Análise do Template TSX',
      `❌ Erro ao analisar o arquivo TSX: ${error.message}`,
      true
    );
  }
}

// Função para verificar componentes no registry
function verificarComponentesRegistry() {
  console.log(chalk.blue('🔍 Verificando componentes no registry...'));

  try {
    const registryContent = fs.readFileSync(PATHS.componentRegistry, 'utf8');

    // Componentes importantes para Step01
    const componentesNecessarios = [
      'quiz-intro-header',
      'text-inline',
      'image-inline',
      'lead-form',
      'accessibility-skip-link',
    ];

    const componentesEncontrados = componentesNecessarios.filter(
      comp => registryContent.includes(`'${comp}'`) || registryContent.includes(`"${comp}"`)
    );

    const componentesReport = componentesNecessarios
      .map(comp => `- ${componentesEncontrados.includes(comp) ? '✅' : '❌'} ${comp}`)
      .join('\n');

    // Verificar se há erros
    const temErros = componentesEncontrados.length !== componentesNecessarios.length;

    addSection(
      'Verificação de Componentes no Registry',
      `### Componentes necessários para Step01\n${componentesReport}`,
      temErros
    );
  } catch (error) {
    addSection(
      'Verificação de Componentes no Registry',
      `❌ Erro ao verificar componentes no registry: ${error.message}`,
      true
    );
  }
}

// Função para verificar propriedades no painel
function verificarPropriedadesPainel() {
  console.log(chalk.blue('🔍 Verificando propriedades no painel...'));

  try {
    const painelContent = fs.readFileSync(PATHS.editorProps, 'utf8');

    // Componentes importantes e suas propriedades
    const propsComponentes = {
      'quiz-intro-header': ['logoUrl', 'logoAlt', 'logoWidth', 'logoHeight', 'showProgress'],
      'text-inline': ['content', 'fontSize', 'fontWeight', 'textAlign', 'color'],
      'image-inline': ['src', 'alt', 'width', 'height', 'aspectRatio'],
      'lead-form': ['showNameField', 'nameLabel', 'namePlaceholder', 'submitText'],
    };

    const propsReport = [];
    let temErros = false;

    for (const [comp, props] of Object.entries(propsComponentes)) {
      const propsEncontradas = props.filter(
        prop =>
          painelContent.includes(`name="${prop}"`) ||
          painelContent.includes(`name='${prop}'`) ||
          painelContent.includes(`name: "${prop}"`) ||
          painelContent.includes(`name: '${prop}'`)
      );

      const compTemErros = propsEncontradas.length !== props.length;
      if (compTemErros) temErros = true;

      propsReport.push(`### ${comp} ${compTemErros ? '⚠️' : '✅'}`);
      propsReport.push(
        props.map(prop => `- ${propsEncontradas.includes(prop) ? '✅' : '❌'} ${prop}`).join('\n')
      );
      propsReport.push('');
    }

    addSection('Verificação de Propriedades no Painel', propsReport.join('\n'), temErros);
  } catch (error) {
    addSection(
      'Verificação de Propriedades no Painel',
      `❌ Erro ao verificar propriedades no painel: ${error.message}`,
      true
    );
  }
}

// Função para verificar validações
function verificarValidacoes() {
  console.log(chalk.blue('🔍 Verificando validações...'));

  try {
    const validacoesContent = fs.readFileSync(PATHS.validationsFile, 'utf8');

    // Validações importantes para Step01
    const validacoesNecessarias = [
      'validateName',
      'validateRequired',
      'validateMinLength',
      'validateMaxLength',
    ];

    const validacoesEncontradas = validacoesNecessarias.filter(
      val =>
        validacoesContent.includes(`function ${val}`) ||
        validacoesContent.includes(`const ${val}`) ||
        validacoesContent.includes(`export const ${val}`) ||
        validacoesContent.includes(`export function ${val}`)
    );

    const validacoesReport = validacoesNecessarias
      .map(val => `- ${validacoesEncontradas.includes(val) ? '✅' : '❌'} ${val}`)
      .join('\n');

    // Verificar se há erros
    const temErros = validacoesEncontradas.length !== validacoesNecessarias.length;

    addSection(
      'Verificação de Validações',
      `### Validações necessárias para Step01\n${validacoesReport}`,
      temErros
    );
  } catch (error) {
    addSection(
      'Verificação de Validações',
      `❌ Erro ao verificar validações: ${error.message}`,
      true
    );
  }
}

// Função para comparar com quiz21StepsComplete
// Função para verificar hooks configurados
function verificarHooks() {
  console.log(chalk.blue('🔍 Verificando hooks configurados...'));

  try {
    // Verificar se o diretório de hooks existe
    if (!fs.existsSync(PATHS.hooksDir)) {
      addSection('Verificação de Hooks', '❌ Diretório de hooks não encontrado', true);
      return;
    }

    // Listar arquivos de hooks
    const hooksFiles = fs
      .readdirSync(PATHS.hooksDir)
      .filter(file => file.endsWith('.ts') || file.endsWith('.tsx'));

    // Hooks importantes para o Step01
    const hooksNecessarios = ['useQuizLogic', 'useSupabaseQuiz', 'useUserProgress'];

    const hooksEncontrados = [];

    // Verificar cada arquivo de hook
    for (const hookFile of hooksFiles) {
      const hookContent = fs.readFileSync(path.join(PATHS.hooksDir, hookFile), 'utf8');

      for (const hook of hooksNecessarios) {
        if (
          hookContent.includes(`function ${hook}`) ||
          hookContent.includes(`const ${hook}`) ||
          hookContent.includes(`export const ${hook}`) ||
          hookContent.includes(`export function ${hook}`)
        ) {
          hooksEncontrados.push(hook);
        }
      }
    }

    // Remover duplicatas
    const hooksUnicos = [...new Set(hooksEncontrados)];

    const hooksReport = hooksNecessarios
      .map(hook => `- ${hooksUnicos.includes(hook) ? '✅' : '❌'} ${hook}`)
      .join('\n');

    // Verificar se o template TSX usa esses hooks
    const tsxContent = fs.readFileSync(PATHS.tsxTemplate, 'utf8');
    const usaHooks = hooksUnicos.filter(
      hook =>
        tsxContent.includes(hook) ||
        tsxContent.includes(`${hook}(`) ||
        tsxContent.includes(`use${hook.replace('use', '')}`)
    );

    const hookUsageReport = `\n### Uso de Hooks no Step01Template.tsx\n${
      usaHooks.length > 0
        ? usaHooks.map(hook => `- ✅ ${hook}`).join('\n')
        : '- ❌ Nenhum hook encontrado no arquivo'
    }`;

    // Verificar se há erros
    const temErros = hooksUnicos.length < hooksNecessarios.length || usaHooks.length === 0;

    addSection(
      'Verificação de Hooks',
      `### Hooks Necessários\n${hooksReport}\n${hookUsageReport}`,
      temErros
    );
  } catch (error) {
    addSection('Verificação de Hooks', `❌ Erro ao verificar hooks: ${error.message}`, true);
  }
}

// Função para verificar schema de dados
function verificarSchema() {
  console.log(chalk.blue('🔍 Verificando schema de dados...'));

  try {
    // Verificar schema no diretório de schemas
    const schemaFiles = fs.existsSync(PATHS.schemaDir)
      ? fs
          .readdirSync(PATHS.schemaDir)
          .filter(file => file.endsWith('.ts') || file.endsWith('.tsx'))
      : [];

    // Verificar schema em outros locais possíveis
    const typesFiles = fs.existsSync(path.join(__dirname, '../src/types'))
      ? fs.readdirSync(path.join(__dirname, '../src/types')).filter(file => file.endsWith('.ts'))
      : [];

    // Schemas importantes para Step01
    const schemasNecessarios = ['User', 'Quiz', 'Template', 'Block'];

    const schemasEncontrados = [];

    // Verificar em arquivos de schema
    for (const schemaFile of [...schemaFiles, ...typesFiles]) {
      const filePath = schemaFiles.includes(schemaFile)
        ? path.join(PATHS.schemaDir, schemaFile)
        : path.join(__dirname, '../src/types', schemaFile);

      const schemaContent = fs.readFileSync(filePath, 'utf8');

      for (const schema of schemasNecessarios) {
        if (
          schemaContent.includes(`interface ${schema}`) ||
          schemaContent.includes(`type ${schema}`) ||
          schemaContent.includes(`class ${schema}`)
        ) {
          schemasEncontrados.push(schema);
        }
      }
    }

    // Remover duplicatas
    const schemasUnicos = [...new Set(schemasEncontrados)];

    const schemaReport = schemasNecessarios
      .map(schema => `- ${schemasUnicos.includes(schema) ? '✅' : '❌'} ${schema}`)
      .join('\n');

    // Verificar se há erros
    const temErros = schemasUnicos.length < schemasNecessarios.length;

    addSection(
      'Verificação de Schema de Dados',
      `### Schemas Necessários\n${schemaReport}\n\n### Arquivos de Schema\n- ${[...schemaFiles, ...typesFiles].join('\n- ')}`,
      temErros
    );
  } catch (error) {
    addSection(
      'Verificação de Schema de Dados',
      `❌ Erro ao verificar schema de dados: ${error.message}`,
      true
    );
  }
}

// Função para verificar integração com Supabase
function verificarSupabase() {
  console.log(chalk.blue('🔍 Verificando integração com Supabase...'));

  try {
    // Verificar se o diretório Supabase existe
    if (!fs.existsSync(PATHS.supabaseDir)) {
      addSection(
        'Verificação de Integração com Supabase',
        '❌ Diretório de Supabase não encontrado',
        true
      );
      return;
    }

    // Listar arquivos do Supabase
    const supabaseFiles = fs
      .readdirSync(PATHS.supabaseDir)
      .filter(file => file.endsWith('.ts') || file.endsWith('.tsx'));

    // Verificar funções de integração importantes
    const supabaseIntegracoes = ['saveUserData', 'saveQuizProgress', 'getUserData'];

    const integracoesEncontradas = [];

    // Verificar cada arquivo do Supabase
    for (const supabaseFile of supabaseFiles) {
      const supabaseContent = fs.readFileSync(path.join(PATHS.supabaseDir, supabaseFile), 'utf8');

      for (const integracao of supabaseIntegracoes) {
        if (
          supabaseContent.includes(`function ${integracao}`) ||
          supabaseContent.includes(`const ${integracao}`) ||
          supabaseContent.includes(`export const ${integracao}`) ||
          supabaseContent.includes(`export function ${integracao}`)
        ) {
          integracoesEncontradas.push(integracao);
        }
      }
    }

    // Remover duplicatas
    const integracoesUnicas = [...new Set(integracoesEncontradas)];

    const supabaseReport = supabaseIntegracoes
      .map(integracao => `- ${integracoesUnicas.includes(integracao) ? '✅' : '❌'} ${integracao}`)
      .join('\n');

    // Verificar se o template usa essas integrações
    const tsxContent = fs.readFileSync(PATHS.tsxTemplate, 'utf8');
    const usaIntegracoes = integracoesUnicas.filter(
      integracao => tsxContent.includes(integracao) || tsxContent.includes(`${integracao}(`)
    );

    const integracaoUsageReport = `\n### Uso de Integrações no Step01Template.tsx\n${
      usaIntegracoes.length > 0
        ? usaIntegracoes.map(integracao => `- ✅ ${integracao}`).join('\n')
        : '- ⚠️ Nenhuma integração direta encontrada no arquivo (pode estar encapsulada em hooks)'
    }`;

    // Verificar tabelas no Supabase através de referências no código
    const tabelasSupabase = [];
    for (const supabaseFile of supabaseFiles) {
      const supabaseContent = fs.readFileSync(path.join(PATHS.supabaseDir, supabaseFile), 'utf8');

      const tabelasMatch = supabaseContent.match(/from\s+['"]([^'"]+)['"]/g) || [];
      tabelasMatch.forEach(match => {
        const tabela = match.match(/from\s+['"]([^'"]+)['"]/)[1];
        if (!tabela.includes('/') && !tabela.includes('.')) {
          tabelasSupabase.push(tabela);
        }
      });
    }

    const tabelasUnicas = [...new Set(tabelasSupabase)];
    const tabelasReport =
      tabelasUnicas.length > 0
        ? `\n### Tabelas Supabase Identificadas\n- ${tabelasUnicas.join('\n- ')}`
        : '\n### Tabelas Supabase\n- ⚠️ Nenhuma tabela identificada diretamente no código';

    // Verificar se há erros
    const temErros = integracoesUnicas.length < 1; // Pelo menos uma integração é necessária

    addSection(
      'Verificação de Integração com Supabase',
      `### Integrações Necessárias\n${supabaseReport}\n${integracaoUsageReport}\n${tabelasReport}`,
      temErros
    );
  } catch (error) {
    addSection(
      'Verificação de Integração com Supabase',
      `❌ Erro ao verificar integração com Supabase: ${error.message}`,
      true
    );
  }
}

// Função para verificar index e layout
function verificarIndexELayout() {
  console.log(chalk.blue('🔍 Verificando index e layout...'));

  try {
    // Verificar arquivo index.tsx
    if (!fs.existsSync(PATHS.indexFile)) {
      addSection('Verificação de Index e Layout', '❌ Arquivo index.tsx não encontrado', true);
      return;
    }

    const indexContent = fs.readFileSync(PATHS.indexFile, 'utf8');

    // Verificar se há referência ao Step01 ou à primeira etapa do quiz
    const referenciaStep01 =
      indexContent.includes('Step01') ||
      indexContent.includes('step-01') ||
      indexContent.includes('step-1') ||
      indexContent.includes('StepTemplate') ||
      indexContent.includes('Quiz');

    // Verificar se usa o layout
    const usaLayout = indexContent.includes('Layout') || indexContent.includes('<Layout');

    // Verificar o arquivo de layout
    let layoutReport = '### Layout\n';
    if (fs.existsSync(PATHS.layoutFile)) {
      const layoutContent = fs.readFileSync(PATHS.layoutFile, 'utf8');

      // Verificar componentes do layout
      const temHeader = layoutContent.includes('Header') || layoutContent.includes('<header');
      const temFooter = layoutContent.includes('Footer') || layoutContent.includes('<footer');
      const temMain = layoutContent.includes('<main') || layoutContent.includes('children');

      layoutReport += [
        `- ✅ Layout.tsx encontrado`,
        `- ${temHeader ? '✅' : '❌'} Header presente`,
        `- ${temFooter ? '✅' : '❌'} Footer presente`,
        `- ${temMain ? '✅' : '❌'} Main content presente`,
      ].join('\n');
    } else {
      layoutReport += '- ❌ Layout.tsx não encontrado';
    }

    // Verificar rotas
    const rotasReport = `\n### Rotas\n`;
    const temRotasStep01 =
      indexContent.includes('/step/1') ||
      indexContent.includes('/step/01') ||
      indexContent.includes('/quiz');

    const indexReport = [
      `### Index.tsx\n- ${referenciaStep01 ? '✅' : '❌'} Referência ao Step01 ou Quiz\n- ${usaLayout ? '✅' : '❌'} Uso de Layout`,
      `${rotasReport}- ${temRotasStep01 ? '✅' : '❌'} Rotas para Step01 ou Quiz`,
      layoutReport,
    ].join('\n');

    // Verificar se há erros
    const temErros =
      !referenciaStep01 || !usaLayout || !temRotasStep01 || !fs.existsSync(PATHS.layoutFile);

    addSection('Verificação de Index e Layout', indexReport, temErros);
  } catch (error) {
    addSection(
      'Verificação de Index e Layout',
      `❌ Erro ao verificar index e layout: ${error.message}`,
      true
    );
  }
}
async function compararComStepsComplete() {
  console.log(chalk.blue('🔍 Comparando com quiz21StepsComplete.ts...'));

  try {
    const stepsContent = fs.readFileSync(PATHS.stepsComplete, 'utf8');

    // Extrair configuração da etapa 1
    const step1Match = stepsContent.match(/'step-1':\s*\[([\s\S]*?)\],\s*\/\/\s*🎯\s*ETAPA\s*2/i);

    if (!step1Match) {
      addSection(
        'Comparação com quiz21StepsComplete',
        '❌ Não foi possível encontrar a configuração da Etapa 1 no arquivo quiz21StepsComplete.ts',
        true
      );
      return;
    }

    const step1Config = step1Match[1];

    // Verificar IDs e tipos de blocos
    const idsMatch = step1Config.match(/id:\s*['"]([^'"]+)['"]/g) || [];
    const ids = idsMatch.map(match => match.match(/id:\s*['"]([^'"]+)['"]/)[1]);

    const typesMatch = step1Config.match(/type:\s*['"]([^'"]+)['"]/g) || [];
    const types = typesMatch.map(match => match.match(/type:\s*['"]([^'"]+)['"]/)[1]);

    // Verificar se coleta nome do usuário
    const coletaNome =
      step1Config.includes('lead-form') ||
      step1Config.includes('nameField') ||
      step1Config.includes('userName');

    // Verificar propriedades importantes
    const temPropsImportantes =
      step1Config.includes('logoUrl') &&
      step1Config.includes('title') &&
      step1Config.includes('submitText');

    const comparisonReport = [
      `### IDs dos blocos na Etapa 1 (${ids.length} total)\n- ${ids.join('\n- ')}\n`,
      `### Tipos de componentes (${types.length} total)\n- ${types.join('\n- ')}\n`,
      `### Funcionalidades\n- Coleta nome do usuário: ${coletaNome ? '✅ Presente' : '❌ Ausente'}\n- Propriedades importantes: ${temPropsImportantes ? '✅ Presentes' : '❌ Ausentes'}`,
    ].join('\n');

    // Verificar se há erros
    const temErros = !coletaNome || !temPropsImportantes || ids.length === 0 || types.length === 0;

    addSection('Comparação com quiz21StepsComplete', comparisonReport, temErros);
  } catch (error) {
    addSection(
      'Comparação com quiz21StepsComplete',
      `❌ Erro ao comparar com quiz21StepsComplete: ${error.message}`,
      true
    );
  }
}

// Executar a verificação
verificarStep01();
