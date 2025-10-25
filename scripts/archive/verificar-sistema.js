#!/usr/bin/env node

const chalk = require('chalk');
const { execSync } = require('child_process');
const path = require('path');

console.log(chalk.blue('🚀 Iniciando verificação completa do sistema...\n'));

try {
  // Executar verificador de 21 etapas
  console.log(chalk.yellow('Verificando 21 etapas do quiz...'));
  execSync('node ' + path.join(__dirname, 'verificador-21-etapas.js'), { stdio: 'inherit' });

  // Executar verificador de schema e hooks
  console.log(chalk.yellow('\nVerificando schema e hooks...'));
  execSync('node ' + path.join(__dirname, 'verificador-schema-hooks.js'), { stdio: 'inherit' });

  console.log(chalk.green('\n✨ Todas as verificações foram concluídas com sucesso!'));
} catch (error) {
  console.error(chalk.red('\n❌ Erro durante as verificações:'), error.message);
  process.exit(1);
}
