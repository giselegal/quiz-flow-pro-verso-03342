// Função para verificar navegação
function verificarNavegacao() {
  console.log(chalk.blue('🔍 Verificando navegação e CTA...'));

  try {
    // Verificar configuração de navegação no JSON
    const jsonContent = fs.readFileSync(PATHS.jsonTemplate, 'utf8');
    const template = JSON.parse(jsonContent);

    // Verificar lógica de navegação no template JSON
    const navegacaoJson = template.logic?.navigation || {};
    const nextStep = navegacaoJson.nextStep;
    const prevStep = navegacaoJson.prevStep;
    const autoAdvance = navegacaoJson.autoAdvance;

    const navegacaoJsonReport = [
      `- Próxima etapa: ${nextStep ? `✅ ${nextStep}` : '❌ Não definida'}`,
      `- Etapa anterior: ${prevStep !== undefined ? `✅ ${prevStep || 'null (primeira etapa)'}` : '❌ Não definida'}`,
      `- Auto-avanço: ${autoAdvance !== undefined ? `✅ ${autoAdvance ? 'Ativado' : 'Desativado'}` : '❌ Não definido'}`,
    ].join('\n');

    // Verificar componentes de CTA e navegação
    let temCta = false;
    let temNavigationButtons = false;

    // Verificar nos blocos do JSON
    if (template.blocks) {
      for (const block of template.blocks) {
        if (
          block.type === 'call-to-action' ||
          (block.type === 'button' &&
            block.properties &&
            (block.properties.role === 'cta' || block.properties.variant === 'cta'))
        ) {
          temCta = true;
        }

        if (
          block.type === 'navigation-buttons' ||
          block.id?.includes('navigation') ||
          block.id?.includes('nav-buttons')
        ) {
          temNavigationButtons = true;
        }
      }
    }

    // Verificar no arquivo TSX
    const tsxContent = fs.readFileSync(PATHS.tsxTemplate, 'utf8');

    const temQuizNavigation =
      tsxContent.includes('QuizNavigation') || tsxContent.includes('<QuizNavigation');

    const temNextFunction =
      tsxContent.includes('onNext={') ||
      tsxContent.includes('onNext={onNext}') ||
      tsxContent.includes('onNext={() =>');

    const temRouterNavigation =
      tsxContent.includes('useRouter') ||
      tsxContent.includes('router.push') ||
      tsxContent.includes('navigate(');

    const navegacaoTsxReport = [
      `- QuizNavigation: ${temQuizNavigation ? '✅ Presente' : '❌ Ausente'}`,
      `- Função onNext: ${temNextFunction ? '✅ Presente' : '❌ Ausente'}`,
      `- Router Navigation: ${temRouterNavigation ? '✅ Presente' : '❌ Ausente'}`,
    ].join('\n');

    // Verificar estilização de botões de navegação
    let temEstilizacaoBotoes = false;

    if (
      template.design &&
      template.design.button &&
      (template.design.button.background || template.design.button.textColor)
    ) {
      temEstilizacaoBotoes = true;
    }

    // Verificar validação antes da navegação
    let temValidacaoAntesNavegacao = false;

    if (
      (template.logic && template.logic.formHandling && template.logic.formHandling.validation) ||
      tsxContent.includes('validateForm') ||
      tsxContent.includes('isValid') ||
      tsxContent.includes('validateBeforeNext')
    ) {
      temValidacaoAntesNavegacao = true;
    }

    const estilosReport = [
      `- Estilização de botões: ${temEstilizacaoBotoes ? '✅ Configurada' : '❌ Não configurada'}`,
      `- Validação antes da navegação: ${temValidacaoAntesNavegacao ? '✅ Implementada' : '❌ Não implementada'}`,
    ].join('\n');

    // Montar relatório completo
    const navegacaoReport = [
      `### Configuração de Navegação no JSON\n${navegacaoJsonReport}\n`,
      `### Componentes de Navegação\n- CTA: ${temCta ? '✅ Presente' : '❌ Ausente'}\n- Botões de navegação: ${temNavigationButtons || temQuizNavigation ? '✅ Presentes' : '❌ Ausentes'}\n`,
      `### Implementação no TSX\n${navegacaoTsxReport}\n`,
      `### Estilização e Validação\n${estilosReport}`,
    ].join('\n');

    // Verificar se há erros
    const temErros =
      !nextStep || !(temCta || temNavigationButtons || temQuizNavigation) || !temNextFunction;

    addSection('Verificação de Navegação e CTA', navegacaoReport, temErros);
  } catch (error) {
    addSection(
      'Verificação de Navegação e CTA',
      `❌ Erro ao verificar navegação: ${error.message}`,
      true
    );
  }
}

// Função para verificar validações visuais e funcionais
function verificarValidacoesVisuais() {
  console.log(chalk.blue('🔍 Verificando validações visuais e funcionais...'));

  try {
    // Verificar no JSON
    const jsonContent = fs.readFileSync(PATHS.jsonTemplate, 'utf8');
    const template = JSON.parse(jsonContent);

    // Verificar mensagens de validação
    const temMensagensValidacao =
      template.validation &&
      ((template.validation.nameField && template.validation.nameField.errorMessage) ||
        Object.values(template.validation).some(v => v.errorMessage));

    // Verificar feedback visual
    let temFeedbackVisual = false;

    if (template.blocks) {
      for (const block of template.blocks) {
        if (
          block.type === 'lead-form' &&
          block.properties &&
          (block.properties.showValidationFeedback ||
            block.properties.errorStyle ||
            block.properties.successStyle)
        ) {
          temFeedbackVisual = true;
          break;
        }
      }
    }

    // Verificar no TSX
    const tsxContent = fs.readFileSync(PATHS.tsxTemplate, 'utf8');

    // Verificar feedback de erro visual
    const temErrorState =
      tsxContent.includes('error={') ||
      tsxContent.includes('hasError') ||
      tsxContent.includes('isError') ||
      tsxContent.includes('error && ');

    // Verificar exibição de mensagens de erro
    const temErrorMessage =
      tsxContent.includes('errorMessage') ||
      tsxContent.includes('error.message') ||
      tsxContent.includes('validationMessage');

    // Verificar indicadores visuais
    const temIndicadoresVisuais =
      tsxContent.includes('isValid') ||
      tsxContent.includes('border-red') ||
      tsxContent.includes('text-red') ||
      tsxContent.includes('invalid') ||
      tsxContent.includes('valid');

    // Verificar estilos CSS para validação
    const temEstilosValidacao =
      tsxContent.includes('valid:') ||
      tsxContent.includes('invalid:') ||
      tsxContent.includes('error:') ||
      tsxContent.includes('focus-visible:');

    // Montar relatório
    const validacaoVisualReport = [
      `### Configuração no JSON\n- Mensagens de validação: ${temMensagensValidacao ? '✅ Configuradas' : '❌ Não configuradas'}\n- Feedback visual: ${temFeedbackVisual ? '✅ Configurado' : '❌ Não configurado'}\n`,
      `### Implementação no TSX\n- Estado de erro: ${temErrorState ? '✅ Implementado' : '❌ Não implementado'}\n- Mensagens de erro: ${temErrorMessage ? '✅ Implementadas' : '❌ Não implementadas'}\n- Indicadores visuais: ${temIndicadoresVisuais ? '✅ Implementados' : '❌ Não implementados'}\n- Estilos CSS para validação: ${temEstilosValidacao ? '✅ Implementados' : '❌ Não implementados'}`,
    ].join('\n');

    // Verificar se há erros
    const temErros =
      !temMensagensValidacao ||
      !temErrorState ||
      !temErrorMessage ||
      (!temIndicadoresVisuais && !temEstilosValidacao);

    addSection('Verificação de Validações Visuais e Funcionais', validacaoVisualReport, temErros);
  } catch (error) {
    addSection(
      'Verificação de Validações Visuais e Funcionais',
      `❌ Erro ao verificar validações visuais: ${error.message}`,
      true
    );
  }
}
