# Scripts do Projeto

Este diretório contém scripts utilitários organizados por categoria.

## 📁 Estrutura

### `/analysis/` - Scripts de Análise

- **analyze-\*.cjs** - Scripts para análise de componentes e estrutura
- **debug-\*.cjs** - Scripts de debugging e diagnóstico
- **diagnostic-\*.js** - Scripts de diagnóstico do sistema
- **find-\*.cjs/.js** - Scripts de busca e localização
- **generate-\*.mjs** - Scripts de geração de relatórios
- **investigate-\*.mjs/.cjs** - Scripts de investigação detalhada

### `/cleanup/` - Scripts de Limpeza

- **cleanup-\*.sh** - Scripts de limpeza geral
- **extract-\*.sh** - Scripts de extração e organização
- **fix-\*.cjs/.js/.sh** - Scripts de correção automática

### `/git/` - Scripts Git

- **git-\*.sh** - Scripts de automação Git
- **merge-\*.sh** - Scripts de merge e rebase

### `/testing/` - Scripts de Teste

- **test-\*.cjs/.js/.ts** - Scripts de teste automatizados
- **validate-\*.js/.cjs** - Scripts de validação
- **verify-\*.mjs/.js** - Scripts de verificação

## 🚀 Como Usar

```bash
# Executar script de análise
node scripts/analysis/analyze-components.cjs

# Executar limpeza
chmod +x scripts/cleanup/cleanup-editors.sh
./scripts/cleanup/cleanup-editors.sh

# Scripts Git
chmod +x scripts/git/git-quick-commands.sh
./scripts/git/git-quick-commands.sh

# Testes e validação
node scripts/testing/test-components.cjs
```

## 📋 Convenções

- **`.cjs`** - CommonJS modules
- **`.mjs`** - ES modules
- **`.js`** - JavaScript genérico
- **`.ts`** - TypeScript
- **`.sh`** - Shell scripts (necessitam chmod +x)

## 🔧 Dependências

Alguns scripts podem precisar de:

- Node.js
- npm packages específicos
- Permissões de execução para .sh

## 📝 Logs

Os scripts geram logs em:

- Console durante execução
- Arquivos temporários (quando aplicável)
- Relatórios em `/docs/reports/`
