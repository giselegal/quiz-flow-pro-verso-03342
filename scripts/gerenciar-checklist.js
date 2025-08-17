#!/usr/bin/env node

import chalk from 'chalk';
import fs from 'fs';
import { dirname, join } from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class ChecklistManager {
  constructor() {
    this.checklistPath = join(__dirname, '../docs/CHECKLIST_VERIFICACOES.md');
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  async iniciar() {
    console.clear();
    console.log(chalk.blue('📋 Gerenciador de Checklist de Verificações\n'));

    const conteudo = await fs.promises.readFile(this.checklistPath, 'utf8');
    const secoes = this.extrairSecoes(conteudo);

    await this.mostrarMenu(secoes);
  }

  extrairSecoes(conteudo) {
    const secoes = [];
    let secaoAtual = null;
    let itens = [];

    conteudo.split('\n').forEach(linha => {
      if (linha.startsWith('## ')) {
        if (secaoAtual) {
          secoes.push({ nome: secaoAtual, itens });
        }
        secaoAtual = linha.replace('## ', '').trim();
        itens = [];
      } else if (linha.startsWith('- [ ]')) {
        itens.push({
          texto: linha.replace('- [ ]', '').trim(),
          completo: false,
        });
      } else if (linha.startsWith('- [x]')) {
        itens.push({
          texto: linha.replace('- [x]', '').trim(),
          completo: true,
        });
      }
    });

    if (secaoAtual) {
      secoes.push({ nome: secaoAtual, itens });
    }

    return secoes;
  }

  async mostrarMenu(secoes) {
    console.clear();
    console.log(chalk.blue('🔍 Seções do Checklist:\n'));

    secoes.forEach((secao, index) => {
      const completados = secao.itens.filter(item => item.completo).length;
      const total = secao.itens.length;
      const porcentagem = Math.round((completados / total) * 100);

      console.log(
        chalk.cyan(`${index + 1}. ${secao.nome}`) +
          chalk.gray(` [${completados}/${total} - ${porcentagem}%]`)
      );
    });

    console.log('\n' + chalk.yellow('Digite o número da seção para gerenciar ou "q" para sair'));

    const resposta = await this.perguntar('> ');

    if (resposta.toLowerCase() === 'q') {
      this.rl.close();
      return;
    }

    const index = parseInt(resposta) - 1;
    if (index >= 0 && index < secoes.length) {
      await this.gerenciarSecao(secoes[index]);
      await this.mostrarMenu(secoes);
    } else {
      console.log(chalk.red('\nOpção inválida!'));
      await new Promise(resolve => setTimeout(resolve, 1500));
      await this.mostrarMenu(secoes);
    }
  }

  async gerenciarSecao(secao) {
    while (true) {
      console.clear();
      console.log(chalk.blue(`📝 ${secao.nome}\n`));

      secao.itens.forEach((item, index) => {
        const checkbox = item.completo ? chalk.green('[✓]') : chalk.gray('[ ]');
        console.log(`${index + 1}. ${checkbox} ${item.texto}`);
      });

      console.log('\n' + chalk.yellow('Digite o número do item para alternar, "v" para voltar'));
      const resposta = await this.perguntar('> ');

      if (resposta.toLowerCase() === 'v') {
        break;
      }

      const index = parseInt(resposta) - 1;
      if (index >= 0 && index < secao.itens.length) {
        secao.itens[index].completo = !secao.itens[index].completo;
        await this.salvarAlteracoes(secao);
      }
    }
  }

  async salvarAlteracoes(secao) {
    const conteudo = await fs.promises.readFile(this.checklistPath, 'utf8');
    const linhas = conteudo.split('\n');
    let dentroSecao = false;
    let indiceItem = 0;

    const novasLinhas = linhas.map(linha => {
      if (linha.startsWith('## ') && linha.includes(secao.nome)) {
        dentroSecao = true;
        return linha;
      } else if (linha.startsWith('## ')) {
        dentroSecao = false;
        return linha;
      }

      if (dentroSecao && (linha.startsWith('- [ ]') || linha.startsWith('- [x]'))) {
        const item = secao.itens[indiceItem];
        indiceItem++;
        return `- [${item.completo ? 'x' : ' '}] ${item.texto}`;
      }

      return linha;
    });

    await fs.promises.writeFile(this.checklistPath, novasLinhas.join('\n'));
  }

  perguntar(pergunta) {
    return new Promise(resolve => {
      this.rl.question(pergunta, resposta => {
        resolve(resposta);
      });
    });
  }
}

// Iniciar o gerenciador
const gerenciador = new ChecklistManager();
gerenciador.iniciar();
