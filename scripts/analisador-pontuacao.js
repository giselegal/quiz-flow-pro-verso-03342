import chalk from 'chalk';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class AnalisadorPontuacao {
  constructor() {
    this.templatePath = join(__dirname, '../src/templates/quiz21StepsComplete.ts');
    this.relatorio = {
      estilos: {},
      problemas: [],
      sugestoes: [],
    };
  }

  async analisar() {
    console.log(chalk.blue('🎯 Iniciando análise do sistema de pontuação...\n'));

    try {
      const module = await import(this.templatePath);
      const template = module.QUIZ_STYLE_21_STEPS_TEMPLATE;

      this.mapearEstilos(template);
      this.validarPontuacao(template);
      this.validarResultados(template);

      return this.gerarRelatorio();
    } catch (error) {
      console.error(chalk.red('❌ Erro durante análise:'), error);
      return false;
    }
  }

  mapearEstilos(template) {
    console.log(chalk.yellow('Mapeando estilos...'));

    const estilos = new Set();

    Object.values(template).forEach(blocos => {
      blocos.forEach(bloco => {
        if (bloco.properties && bloco.properties.scoreValues) {
          Object.keys(bloco.properties.scoreValues).forEach(key => {
            const estilo = key.split('_')[0];
            estilos.add(estilo);
          });
        }
      });
    });

    estilos.forEach(estilo => {
      this.relatorio.estilos[estilo] = {
        questoes: 0,
        pontuacaoMaxima: 0,
        distribuicao: {},
      };
    });
  }

  validarPontuacao(template) {
    console.log(chalk.yellow('Validando sistema de pontuação...'));

    Object.entries(template).forEach(([etapa, blocos]) => {
      blocos.forEach(bloco => {
        if (bloco.properties && bloco.properties.scoreValues) {
          Object.entries(bloco.properties.scoreValues).forEach(([key, valor]) => {
            const [estilo] = key.split('_');

            if (this.relatorio.estilos[estilo]) {
              this.relatorio.estilos[estilo].questoes++;
              this.relatorio.estilos[estilo].pontuacaoMaxima += valor;

              // Distribuição por etapa
              if (!this.relatorio.estilos[estilo].distribuicao[etapa]) {
                this.relatorio.estilos[estilo].distribuicao[etapa] = 0;
              }
              this.relatorio.estilos[estilo].distribuicao[etapa] += valor;
            }
          });
        }
      });
    });

    // Validar balanceamento
    this.validarBalanceamento();
  }

  validarBalanceamento() {
    const pontuacoes = Object.values(this.relatorio.estilos).map(e => e.pontuacaoMaxima);

    const media = pontuacoes.reduce((a, b) => a + b) / pontuacoes.length;
    const desvio = Math.max(...pontuacoes) - Math.min(...pontuacoes);

    if (desvio > media * 0.2) {
      // Desvio maior que 20% da média
      this.relatorio.problemas.push('Sistema de pontuação desbalanceado entre estilos');
    }
  }

  validarResultados(template) {
    console.log(chalk.yellow('Validando página de resultados...'));

    const etapaResultado = template['step-20'];
    if (!etapaResultado) {
      this.relatorio.problemas.push('Etapa de resultado não encontrada');
      return;
    }

    // Verificar componentes necessários
    const componentesNecessarios = [
      'result-header-inline',
      'style-card-inline',
      'secondary-styles',
    ];

    const componentesEncontrados = etapaResultado.map(b => b.type);

    componentesNecessarios.forEach(comp => {
      if (!componentesEncontrados.includes(comp)) {
        this.relatorio.problemas.push(`Componente ${comp} não encontrado na página de resultado`);
      }
    });

    // Verificar placeholders de resultado
    const placeholdersNecessarios = [
      '{resultStyle}',
      '{resultPersonality}',
      '{resultColors}',
      '{resultFabrics}',
      '{resultPrints}',
      '{resultAccessories}',
    ];

    etapaResultado.forEach(bloco => {
      if (bloco.content) {
        const conteudo = JSON.stringify(bloco.content);
        placeholdersNecessarios.forEach(placeholder => {
          if (!conteudo.includes(placeholder)) {
            this.relatorio.problemas.push(
              `Placeholder ${placeholder} não encontrado nos resultados`
            );
          }
        });
      }
    });
  }

  gerarRelatorio() {
    console.log(chalk.blue('\n📊 Relatório do Sistema de Pontuação:\n'));

    // Exibir estilos e pontuações
    Object.entries(this.relatorio.estilos).forEach(([estilo, dados]) => {
      console.log(chalk.cyan(`\nEstilo: ${estilo}`));
      console.log(`  Questões: ${dados.questoes}`);
      console.log(`  Pontuação Máxima: ${dados.pontuacaoMaxima}`);

      console.log('  Distribuição por etapa:');
      Object.entries(dados.distribuicao).forEach(([etapa, pontos]) => {
        console.log(`    ${etapa}: ${pontos} pontos`);
      });
    });

    // Exibir problemas
    if (this.relatorio.problemas.length > 0) {
      console.log(chalk.red('\n❌ Problemas encontrados:'));
      this.relatorio.problemas.forEach(problema => console.log(chalk.red(`  - ${problema}`)));
    }

    // Exibir sugestões
    if (this.relatorio.sugestoes.length > 0) {
      console.log(chalk.yellow('\n💡 Sugestões de melhoria:'));
      this.relatorio.sugestoes.forEach(sugestao => console.log(chalk.yellow(`  - ${sugestao}`)));
    }

    return this.relatorio.problemas.length === 0;
  }
}

// Executar análise
const analisador = new AnalisadorPontuacao();
analisador.analisar().then(sucesso => {
  if (sucesso) {
    console.log(chalk.green('\n✨ Análise do sistema de pontuação concluída com sucesso!'));
  } else {
    console.log(chalk.red('\n❌ Análise concluída com problemas.'));
    process.exit(1);
  }
});
