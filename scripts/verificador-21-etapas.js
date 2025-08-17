const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Caminho para o arquivo quiz21StepsComplete.ts
const templatePath = path.join(__dirname, '../src/templates/quiz21StepsComplete.ts');

// Função principal de verificação
async function verificarEtapas() {
  console.log(chalk.blue('🔍 Iniciando verificação das 21 etapas do quiz...\n'));

  try {
    const template = require(templatePath).default;
    let relatorio = [];
    let temErros = false;

    // 1. Verificação de Componentes
    console.log(chalk.yellow('1. Verificando componentes...'));
    const componentesObrigatorios = [
      'quiz-intro-header',
      'text-inline',
      'image-inline',
      'lead-form',
      'accessibility-skip-link',
      'call-to-action',
      'navigation-buttons',
    ];

    const componentesEncontrados = new Set();
    Object.values(template).forEach(etapa => {
      etapa.forEach(bloco => {
        componentesEncontrados.add(bloco.type);
      });
    });

    const componentesFaltando = componentesObrigatorios.filter(
      comp => !componentesEncontrados.has(comp)
    );

    if (componentesFaltando.length > 0) {
      temErros = true;
      relatorio.push({
        secao: 'Componentes',
        status: '❌',
        mensagem: `Componentes faltando: ${componentesFaltando.join(', ')}`,
      });
    } else {
      relatorio.push({
        secao: 'Componentes',
        status: '✅',
        mensagem: 'Todos os componentes obrigatórios estão presentes',
      });
    }

    // 2. Verificação de IDs
    console.log(chalk.yellow('2. Verificando IDs...'));
    const idsUnicos = new Set();
    let idsRepetidos = false;
    let padraoCorreto = true;

    Object.entries(template).forEach(([etapa, blocos]) => {
      blocos.forEach(bloco => {
        if (idsUnicos.has(bloco.id)) {
          idsRepetidos = true;
        }
        idsUnicos.add(bloco.id);

        if (etapa === 'step-1' && !bloco.id.startsWith('step1-')) {
          padraoCorreto = false;
        }
      });
    });

    if (idsRepetidos || !padraoCorreto) {
      temErros = true;
      relatorio.push({
        secao: 'IDs',
        status: '❌',
        mensagem: idsRepetidos ? 'Existem IDs duplicados' : 'IDs não seguem o padrão correto',
      });
    } else {
      relatorio.push({
        secao: 'IDs',
        status: '✅',
        mensagem: 'Todos os IDs são únicos e seguem o padrão correto',
      });
    }

    // 3. Verificação de Navegação
    console.log(chalk.yellow('3. Verificando navegação...'));
    const navegacaoValida = verificarNavegacao(template);

    relatorio.push({
      secao: 'Navegação',
      status: navegacaoValida ? '✅' : '❌',
      mensagem: navegacaoValida
        ? 'Configuração de navegação está correta'
        : 'Problemas encontrados na navegação',
    });

    // 4. Verificação do Formulário de Nome
    console.log(chalk.yellow('4. Verificando formulário de nome...'));
    const formValido = verificarFormularioNome(template['step-1']);

    relatorio.push({
      secao: 'Formulário de Nome',
      status: formValido ? '✅' : '❌',
      mensagem: formValido
        ? 'Formulário de nome configurado corretamente'
        : 'Problemas no formulário de nome',
    });

    // 5. Verificação de Arquivos JSON
    console.log(chalk.yellow('5. Verificando configurações JSON...'));
    const jsonValido = verificarConfiguracoesJSON(template);

    relatorio.push({
      secao: 'Configurações JSON',
      status: jsonValido ? '✅' : '❌',
      mensagem: jsonValido
        ? 'Configurações JSON estão corretas'
        : 'Problemas nas configurações JSON',
    });

    // 6. Verificação de Validações
    console.log(chalk.yellow('6. Verificando validações...'));
    const validacoesOK = verificarValidacoes(template);

    relatorio.push({
      secao: 'Validações',
      status: validacoesOK ? '✅' : '❌',
      mensagem: validacoesOK
        ? 'Sistema de validação configurado corretamente'
        : 'Problemas nas validações',
    });

    // Gerar relatório final
    console.log(chalk.blue('\n📋 Relatório Final:'));
    relatorio.forEach(item => {
      const statusColor = item.status === '✅' ? chalk.green : chalk.red;
      console.log(statusColor(`${item.status} ${item.secao}: ${item.mensagem}`));
    });

    return !temErros;
  } catch (error) {
    console.error(chalk.red('❌ Erro ao verificar template:'), error);
    return false;
  }
}

// Funções auxiliares de verificação
function verificarNavegacao(template) {
  try {
    // Verifica se todas as etapas têm propriedades de navegação necessárias
    for (const [etapa, blocos] of Object.entries(template)) {
      const temBotaoNavegacao = blocos.some(
        bloco =>
          bloco.properties &&
          (bloco.properties.buttonText ||
            bloco.properties.nextButtonText ||
            bloco.properties.autoAdvanceOnComplete)
      );

      if (!temBotaoNavegacao && etapa !== 'step-21') {
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error('Erro ao verificar navegação:', error);
    return false;
  }
}

function verificarFormularioNome(etapa1) {
  try {
    const formBlock = etapa1.find(bloco => bloco.type === 'form-container');
    if (!formBlock) return false;

    return (
      formBlock.content.placeholder &&
      formBlock.content.buttonText &&
      formBlock.properties.requiredMessage &&
      formBlock.properties.validationMessage &&
      formBlock.properties.dataKey === 'userName'
    );
  } catch (error) {
    console.error('Erro ao verificar formulário:', error);
    return false;
  }
}

function verificarConfiguracoesJSON(template) {
  try {
    // Verifica estrutura básica do JSON
    return (
      template &&
      typeof template === 'object' &&
      Object.keys(template).length === 21 &&
      Object.values(template).every(etapa => Array.isArray(etapa))
    );
  } catch (error) {
    console.error('Erro ao verificar JSON:', error);
    return false;
  }
}

function verificarValidacoes(template) {
  try {
    // Verifica configurações de validação em cada etapa
    return Object.values(template).every(etapa =>
      etapa.every(
        bloco =>
          !bloco.properties ||
          !bloco.properties.required ||
          (bloco.properties.validationMessage &&
            bloco.properties.requiredMessage &&
            bloco.properties.showValidationFeedback !== undefined)
      )
    );
  } catch (error) {
    console.error('Erro ao verificar validações:', error);
    return false;
  }
}

// Execução do verificador
verificarEtapas().then(sucesso => {
  if (sucesso) {
    console.log(chalk.green('\n✨ Verificação concluída com sucesso!'));
  } else {
    console.log(chalk.red('\n❌ Verificação concluída com erros.'));
    process.exit(1);
  }
});
