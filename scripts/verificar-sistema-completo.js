#!/usr/bin/env node

import chalk from 'chalk';
import { execSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function executarVerificacaoCompleta() {
  console.log(chalk.blue('🚀 Iniciando verificação completa do sistema...\n'));

  try {
    // Executar verificações básicas
    console.log(chalk.yellow('1. Verificando estrutura básica...'));
    execSync('node ' + join(__dirname, 'verificador-21-etapas.js'), { stdio: 'inherit' });

    // Executar verificações de schema e hooks
    console.log(chalk.yellow('\n2. Verificando schema e hooks...'));
    execSync('node ' + join(__dirname, 'verificador-schema-hooks.js'), { stdio: 'inherit' });

    // Executar análise detalhada das etapas
    console.log(chalk.yellow('\n3. Realizando análise detalhada das etapas...'));
    execSync('node ' + join(__dirname, 'analisador-etapas.js'), { stdio: 'inherit' });

    // Executar análise do sistema de pontuação
    console.log(chalk.yellow('\n4. Analisando sistema de pontuação...'));
    execSync('node ' + join(__dirname, 'analisador-pontuacao.js'), { stdio: 'inherit' });

    console.log(chalk.green('\n✨ Todas as verificações foram concluídas com sucesso!'));

    // Gerar relatório final em markdown
    gerarRelatorioMD();
  } catch (error) {
    console.error(chalk.red('\n❌ Erro durante as verificações:'), error.message);
    process.exit(1);
  }
}

function gerarRelatorioMD() {
  const fs = require('fs');
  const dataAtual = new Date().toLocaleDateString('pt-BR');

  const conteudo = `# Relatório de Verificação do Quiz - ${dataAtual}

## Resumo da Verificação

Este relatório foi gerado automaticamente após a execução de todas as verificações do sistema.

### Verificações Realizadas

1. ✅ Estrutura básica do quiz
   - Componentes
   - IDs
   - Navegação
   - Formulários
   - Configurações JSON

2. ✅ Schema e Hooks
   - Interfaces
   - Tipos
   - Hooks necessários
   - Integração

3. ✅ Análise detalhada
   - 21 etapas verificadas
   - Componentes específicos
   - Validações
   - Configurações

4. ✅ Sistema de pontuação
   - Distribuição de pontos
   - Balanceamento
   - Página de resultados
   - Estilos

## Próximos Passos

1. Revisar quaisquer avisos gerados
2. Implementar melhorias sugeridas
3. Manter monitoramento contínuo

## Observações

- Execute este verificador regularmente
- Atualize conforme necessário
- Documente alterações

---
Gerado em: ${dataAtual}
`;

  fs.writeFileSync(path.join(__dirname, '../docs/RELATORIO_VERIFICACAO.md'), conteudo);

  console.log(chalk.blue('\n📄 Relatório gerado em docs/RELATORIO_VERIFICACAO.md'));
}

// Executar verificação completa
executarVerificacaoCompleta();
