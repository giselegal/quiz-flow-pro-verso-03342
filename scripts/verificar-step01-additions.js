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
