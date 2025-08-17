// Função para verificar navegação e botões CTA
function verificarNavegacao() {
  console.log(chalk.blue('🔍 Verificando navegação e botões CTA...'));

  try {
    // Verificar no arquivo JSON
    const jsonContent = fs.readFileSync(PATHS.jsonTemplate, 'utf8');
    const template = JSON.parse(jsonContent);

    // Verificar configuração de navegação no JSON
    const navegacaoJson = template.logic?.navigation || {};
    const nextStep = navegacaoJson.nextStep;
    const prevStep = navegacaoJson.prevStep;
    const allowBack = navegacaoJson.allowBack;
    const autoAdvance = navegacaoJson.autoAdvance;

    const navegacaoJsonReport = [
      `- ${nextStep ? '✅' : '❌'} Próximo passo configurado: ${nextStep || 'Não definido'}`,
      `- ${prevStep !== undefined ? '✅' : '❌'} Passo anterior configurado: ${prevStep || 'Não definido'}`,
      `- Permite voltar: ${allowBack ? 'Sim' : 'Não'}`,
      `- Avanço automático: ${autoAdvance ? 'Sim' : 'Não'}`,
    ].join('\n');

    // Verificar no arquivo TSX
    const tsxContent = fs.readFileSync(PATHS.tsxTemplate, 'utf8');

    // Verificar botões de navegação
    const temBotaoNext =
      tsxContent.includes('onNext') ||
      tsxContent.includes('nextStep') ||
      tsxContent.includes('handleNext');

    const temQuizNavigation =
      tsxContent.includes('QuizNavigation') || tsxContent.includes('<QuizNavigation');

    const temBotaoCTA =
      tsxContent.includes('CTA') ||
      tsxContent.includes('cta') ||
      tsxContent.includes('Call to Action') ||
      tsxContent.includes('Continuar') ||
      tsxContent.includes('Próximo') ||
      tsxContent.includes('Avançar');

    // Verificar URLs e configurações de rota
    const temURL =
      tsxContent.includes('href=') ||
      tsxContent.includes('router.push') ||
      tsxContent.includes('navigate');

    const navegacaoTsxReport = [
      `- ${temBotaoNext ? '✅' : '❌'} Função de navegação para próximo passo`,
      `- ${temQuizNavigation ? '✅' : '❌'} Componente QuizNavigation`,
      `- ${temBotaoCTA ? '✅' : '❌'} Botão CTA (Call to Action)`,
      `- ${temURL ? '✅' : '❌'} URLs ou configurações de rota`,
    ].join('\n');

    // Verificar no quiz21StepsComplete.ts
    const stepsContent = fs.readFileSync(PATHS.stepsComplete, 'utf8');

    // Extrair configuração da etapa 1
    const step1Match = stepsContent.match(/'step-1':\s*\[([\s\S]*?)\],\s*\/\/\s*🎯\s*ETAPA\s*2/i);

    let navegacaoStepsReport = '- ❌ Não foi possível encontrar a configuração da Etapa 1';

    if (step1Match) {
      const step1Config = step1Match[1];

      // Verificar botões e navegação
      const temOnNext = step1Config.includes('onNext') || step1Config.includes('handleNext');
      const temBotao = step1Config.includes('button') || step1Config.includes('Button');

      navegacaoStepsReport = [
        `- ${temOnNext ? '✅' : '❌'} Função onNext ou handleNext`,
        `- ${temBotao ? '✅' : '❌'} Configuração de botão`,
      ].join('\n');
    }

    const navegacaoReport = [
      `### Configuração de Navegação no JSON\n${navegacaoJsonReport}\n`,
      `### Navegação no Template TSX\n${navegacaoTsxReport}\n`,
      `### Navegação no quiz21StepsComplete.ts\n${navegacaoStepsReport}`,
    ].join('\n');

    // Verificar se há erros
    const temErros = !nextStep || !temBotaoNext || !temBotaoCTA;

    addSection('Verificação de Navegação e Botões CTA', navegacaoReport, temErros);
  } catch (error) {
    addSection(
      'Verificação de Navegação e Botões CTA',
      `❌ Erro ao verificar navegação: ${error.message}`,
      true
    );
  }
}

// Função para verificar validações visuais e funcionais
function verificarValidacoesVisuaisFuncionais() {
  console.log(chalk.blue('🔍 Verificando validações visuais e funcionais...'));

  try {
    // Verificar no arquivo JSON
    const jsonContent = fs.readFileSync(PATHS.jsonTemplate, 'utf8');
    const template = JSON.parse(jsonContent);

    // Verificar validações no JSON
    const validacoesJson = template.validation || {};
    const nameField = validacoesJson.nameField || {};

    const validacoesJsonReport = [
      `- Campo de Nome:`,
      `  - Requerido: ${nameField.required ? '✅ Sim' : '❌ Não'}`,
      `  - Comprimento Mínimo: ${nameField.minLength || 'Não definido'}`,
      `  - Comprimento Máximo: ${nameField.maxLength || 'Não definido'}`,
      `  - Mensagem de Erro: ${nameField.errorMessage ? `"${nameField.errorMessage}"` : 'Não definida'}`,
      `  - Validação em Tempo Real: ${nameField.realTimeValidation ? '✅ Sim' : '❌ Não'}`,
    ].join('\n');

    // Verificar feedback visual no TSX
    const tsxContent = fs.readFileSync(PATHS.tsxTemplate, 'utf8');

    // Verificar elementos visuais de validação
    const temFeedbackVisual =
      tsxContent.includes('error') ||
      tsxContent.includes('Error') ||
      tsxContent.includes('invalid') ||
      tsxContent.includes('validation');

    const temCorDeErro =
      tsxContent.includes('text-red') ||
      tsxContent.includes('border-red') ||
      tsxContent.includes('red-500');

    const temIconeDeErro =
      tsxContent.includes('ErrorIcon') ||
      tsxContent.includes('AlertIcon') ||
      tsxContent.includes('WarningIcon') ||
      tsxContent.includes('ExclamationIcon');

    // Verificar estados de validação
    const temEstadoDeErro =
      tsxContent.includes('isError') ||
      tsxContent.includes('hasError') ||
      tsxContent.includes('invalid') ||
      tsxContent.includes('errors');

    const validacoesTsxReport = [
      `- ${temFeedbackVisual ? '✅' : '❌'} Feedback visual de validação`,
      `- ${temCorDeErro ? '✅' : '❌'} Cor de erro para feedback visual`,
      `- ${temIconeDeErro ? '✅' : '❌'} Ícone de erro`,
      `- ${temEstadoDeErro ? '✅' : '❌'} Estado de erro no componente`,
    ].join('\n');

    // Verificar função de validação
    const validationFile = fs.existsSync(PATHS.validationsFile)
      ? fs.readFileSync(PATHS.validationsFile, 'utf8')
      : '';

    const temFuncaoValidacaoNome =
      validationFile.includes('validateName') || validationFile.includes('nameValidator');

    const temValidacaoTamanho =
      validationFile.includes('minLength') || validationFile.includes('maxLength');

    const temValidacaoRequerido =
      validationFile.includes('required') || validationFile.includes('isRequired');

    const validacoesFuncionaisReport = [
      `- ${temFuncaoValidacaoNome ? '✅' : '❌'} Função de validação de nome`,
      `- ${temValidacaoTamanho ? '✅' : '❌'} Validação de tamanho mínimo/máximo`,
      `- ${temValidacaoRequerido ? '✅' : '❌'} Validação de campo obrigatório`,
    ].join('\n');

    const validacoesReport = [
      `### Validações no JSON\n${validacoesJsonReport}\n`,
      `### Validações Visuais no TSX\n${validacoesTsxReport}\n`,
      `### Validações Funcionais\n${validacoesFuncionaisReport}`,
    ].join('\n');

    // Verificar se há erros
    const temErros = !nameField.required || !temFeedbackVisual || !temFuncaoValidacaoNome;

    addSection('Verificação de Validações Visuais e Funcionais', validacoesReport, temErros);
  } catch (error) {
    addSection(
      'Verificação de Validações Visuais e Funcionais',
      `❌ Erro ao verificar validações visuais e funcionais: ${error.message}`,
      true
    );
  }
}
