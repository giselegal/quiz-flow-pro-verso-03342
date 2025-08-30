import chalk from 'chalk';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Análise detalhada de cada etapa do quiz
class AnalisadorQuiz {
  constructor() {
    this.templatePath = join(__dirname, '../src/templates/quiz21StepsComplete.ts');
    this.relatorio = {
      etapas: {},
      erros: [],
      avisos: [],
    };
  }

  async analisar() {
    console.log(chalk.blue('🔍 Iniciando análise detalhada do quiz...\n'));

    try {
      const module = await import(this.templatePath);
      const template = module.QUIZ_STYLE_21_STEPS_TEMPLATE;

      // Análise de cada etapa
      for (let i = 1; i <= 21; i++) {
        const etapaKey = `step-${i}`;
        if (template[etapaKey]) {
          this.analisarEtapa(i, template[etapaKey]);
        } else {
          this.relatorio.erros.push(`Etapa ${i} não encontrada no template`);
        }
      }

      // Análise global
      this.analisarComponentesGlobais(template);
      this.analisarNavegacao(template);
      this.analisarPontuacao(template);

      return this.gerarRelatorio();
    } catch (error) {
      console.error(chalk.red('❌ Erro durante análise:'), error);
      return false;
    }
  }

  analisarEtapa(numero, blocos) {
    console.log(chalk.yellow(`\nAnalisando Etapa ${numero}...`));

    const etapa = {
      numero,
      componentes: [],
      configuracoes: {},
      validacoes: [],
      problemas: [],
    };

    blocos.forEach(bloco => {
      // Análise de componentes
      etapa.componentes.push({
        id: bloco.id,
        tipo: bloco.type,
        ordem: bloco.order,
      });

      // Análise de configurações
      if (bloco.properties) {
        Object.assign(etapa.configuracoes, {
          [bloco.id]: this.validarConfiguracoes(bloco.properties),
        });
      }

      // Validações específicas por tipo de componente
      this.validarComponenteEspecifico(bloco, etapa);
    });

    this.relatorio.etapas[numero] = etapa;
  }

  validarConfiguracoes(properties) {
    const validacoes = {
      valido: true,
      problemas: [],
    };

    // Verificações comuns
    if (properties.required && !properties.validationMessage) {
      validacoes.valido = false;
      validacoes.problemas.push('Campo obrigatório sem mensagem de validação');
    }

    // Verificar configurações de estilo
    if (properties.backgroundColor && !this.isValidColor(properties.backgroundColor)) {
      validacoes.problemas.push('Cor de fundo inválida');
    }

    return validacoes;
  }

  validarComponenteEspecifico(bloco, etapa) {
    switch (bloco.type) {
      case 'form-container':
        this.validarFormulario(bloco, etapa);
        break;
      case 'options-grid':
        this.validarOpcoes(bloco, etapa);
        break;
      case 'result-header-inline':
        this.validarResultado(bloco, etapa);
        break;
    }
  }

  validarFormulario(bloco, etapa) {
    if (!bloco.content.placeholder) {
      etapa.problemas.push(`Formulário ${bloco.id} sem placeholder`);
    }
    const props = bloco.properties || {};
    const content = bloco.content || {};

    // dataKey pode estar em content ou properties; também aceitar input filho com 'name'.
    let hasDataKey = !!props.dataKey || !!content.dataKey;

    if (!hasDataKey && Array.isArray(props.children)) {
      const hasInputName = props.children.some(
        child => child && child.type === 'form-input' && child.properties && child.properties.name
      );
      hasDataKey = hasInputName;
    }

    if (!hasDataKey) {
      etapa.problemas.push(`Formulário ${bloco.id} sem dataKey`);
    }
  }

  validarOpcoes(bloco, etapa) {
    if (!bloco.content.options || !Array.isArray(bloco.content.options)) {
      etapa.problemas.push(`Grid de opções ${bloco.id} sem opções válidas`);
      return;
    }

    // Validar pontuação
    if (bloco.properties.scoreValues) {
      const opcoes = bloco.content.options;
      const pontuacoes = bloco.properties.scoreValues;

      opcoes.forEach(opcao => {
        if (!pontuacoes[opcao.id]) {
          etapa.problemas.push(`Opção ${opcao.id} sem pontuação definida`);
        }
      });
    }
  }

  validarResultado(bloco, etapa) {
    const camposNecessarios = ['title', 'subtitle', 'description'];
    camposNecessarios.forEach(campo => {
      if (!bloco.content[campo]) {
        etapa.problemas.push(`Bloco de resultado sem ${campo}`);
      }
    });
  }

  analisarComponentesGlobais(template) {
    console.log(chalk.yellow('\nAnalisando componentes globais...'));

    const componentesObrigatorios = new Set([
      'quiz-intro-header',
      'form-container',
      'options-grid',
      'result-header-inline',
    ]);

    const componentesEncontrados = new Set();

    Object.values(template).forEach(blocos => {
      blocos.forEach(bloco => {
        componentesEncontrados.add(bloco.type);
      });
    });

    componentesObrigatorios.forEach(comp => {
      if (!componentesEncontrados.has(comp)) {
        this.relatorio.erros.push(`Componente obrigatório ${comp} não encontrado`);
      }
    });
  }

  analisarNavegacao(template) {
    console.log(chalk.yellow('Analisando navegação...'));

    const hasNavigationDeep = bloco => {
      if (!bloco) return false;
      const props = bloco.properties || {};
      const content = bloco.content || {};

      const selfHas =
        !!props.buttonText ||
        !!content.buttonText ||
        !!props.autoAdvanceOnComplete ||
        (typeof bloco.type === 'string' && bloco.type.includes('button')) ||
        !!props.action ||
        !!props.nextStepId;

      const children = Array.isArray(props.children) ? props.children : [];
      return selfHas || children.some(child => hasNavigationDeep(child));
    };

    Object.entries(template).forEach(([etapa, blocos]) => {
      const temNavegacao = blocos.some(bloco => hasNavigationDeep(bloco));

      if (!temNavegacao && etapa !== 'step-21') {
        this.relatorio.avisos.push(`Etapa ${etapa} sem navegação clara`);
      }
    });
  }

  analisarPontuacao(template) {
    console.log(chalk.yellow('Analisando sistema de pontuação...'));

    let temPontuacao = false;
    Object.values(template).forEach(blocos => {
      blocos.forEach(bloco => {
        if (bloco.properties && bloco.properties.scoreValues) {
          temPontuacao = true;
        }
      });
    });

    if (!temPontuacao) {
      this.relatorio.avisos.push('Sistema de pontuação não encontrado');
    }
  }

  isValidColor(color) {
    return /^#[0-9A-F]{6}$/i.test(color) || /^rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)$/.test(color);
  }

  gerarRelatorio() {
    console.log(chalk.blue('\n📊 Relatório de Análise:\n'));

    // Exibir erros críticos
    if (this.relatorio.erros.length > 0) {
      console.log(chalk.red('❌ Erros encontrados:'));
      this.relatorio.erros.forEach(erro => console.log(chalk.red(`  - ${erro}`)));
    }

    // Exibir avisos
    if (this.relatorio.avisos.length > 0) {
      console.log(chalk.yellow('\n⚠️ Avisos:'));
      this.relatorio.avisos.forEach(aviso => console.log(chalk.yellow(`  - ${aviso}`)));
    }

    // Exibir resumo por etapa
    console.log(chalk.blue('\n📋 Resumo por etapa:'));
    Object.entries(this.relatorio.etapas).forEach(([numero, etapa]) => {
      console.log(chalk.cyan(`\nEtapa ${numero}:`));
      console.log(`  Componentes: ${etapa.componentes.length}`);

      if (etapa.problemas.length > 0) {
        console.log(chalk.yellow('  Problemas encontrados:'));
        etapa.problemas.forEach(problema => console.log(chalk.yellow(`    - ${problema}`)));
      } else {
        console.log(chalk.green('  ✅ Sem problemas'));
      }
    });

    return this.relatorio.erros.length === 0;
  }
}

// Executar análise
const analisador = new AnalisadorQuiz();
analisador.analisar().then(sucesso => {
  if (sucesso) {
    console.log(chalk.green('\n✨ Análise concluída com sucesso!'));
  } else {
    console.log(chalk.red('\n❌ Análise concluída com erros.'));
    process.exit(1);
  }
});
