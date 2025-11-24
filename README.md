# This is a test comment added at the top of the README file
# 🎯 Quiz Flow Pro - Verso 03342

Sistema interativo profissional de criação e gerenciamento de quizzes e funis de conversão com arquitetura consolidada de alta performance.

[![Performance](https://img.shields.io/badge/Performance-Excelente-success)]()
[![Bundle Size](https://img.shields.io/badge/Bundle-180KB-success)]()
[![Tests](https://img.shields.io/badge/Tests-Passing-success)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)]()
[![React](https://img.shields.io/badge/React-18-blue)]()


## 🚀 Quick Start

```bash
# 1. Instalar dependências
npm install

# 2. Executar em desenvolvimento
npm run dev

# 3. Acessar aplicação
# Editor: http://localhost:5173/editor
# Dashboard: http://localhost:5173/admin
```

### Primeiro Acesso
1. Acesse `/editor` para criar seu primeiro funil
2. Arraste componentes da biblioteca para o canvas
3. Configure propriedades no painel direito
4. Salve e publique seu funil


## 📊 Status do Projeto

**Última Atualização:** 22 de Novembro de 2025

| Aspecto | Status | Métrica |
|---------|--------|---------|
| **Performance** | 🟢 Excelente | 180KB bundle, ~2s TTI |
| **Testes** | 🟢 Excelente | 115 passing, 31 security tests |
| **Build** | 🟢 OK | Sem erros TypeScript |
| **Segurança** | 🟢 Melhorado | XSS Prevention com DOMPurify |
| **Organização** | 🟢 Excelente | 57→34 arquivos na raiz (-40%) |

**✅ Consolidação Completa (7/8 Etapas):**

Ver: [CHANGELOG.md](./CHANGELOG.md) para detalhes completos


## 📚 Documentação

### Guias Principais

### Análise e Planejamento

## 🏗️ Arquitetura Consolidada

**Nova arquitetura otimizada (2025)** - Sistema completamente consolidado para máxima performance e manutenibilidade:

### 📊 Performance Metrics

### 🎯 Editor Modular (Sprint 4 - 2025)

### 🔧 Consolidação Realizada

## 🚀 Tecnologias


### Gestão de Funis


## 🏗️ Estrutura do Projeto

```
src/
├── components/           # Componentes React
│   ├── blocks/          # Blocos de conteúdo
│   ├── editor/          # Editor visual
│   ├── quiz-builder/    # Construtor de quiz
│   └── ui/              # Componentes de interface
├── context/             # Context API
├── hooks/               # Custom hooks
├── pages/               # Páginas da aplicação
├── types/               # Definições TypeScript
└── config/              # Configurações
```

## 🎯 Editor Principal

O editor modular de produção está localizado em:


### Arquitetura do Editor (4 Colunas)
1. **Steps Panel**: Navegação entre etapas do funil
2. **Component Library**: Biblioteca de componentes drag & drop
3. **Visual Canvas**: Preview em tempo real com drop zones
4. **Properties Panel**: Edição detalhada de propriedades

### Features

## � Sistema de Templates v3.1

Sistema robusto de gerenciamento de templates com múltiplas fontes e validação type-safe.

### Características


### Hooks Disponíveis

```typescript
import {
  useTemplateStep,        // Carregar step individual
  useTemplateSteps,       // Carregar múltiplos steps
  usePrefetchTemplateStep,// Prefetch em background
  usePrepareTemplate,     // Preparar template
  usePreloadTemplate,     // Preload completo
} from '@/services/hooks';
```

### Exportar Templates

```bash
# Exportar template específico
npm run export-templates -- --template=quiz21StepsComplete

# Exportar todos os templates
npm run export-templates:all

# Modo verbose
npm run export-templates:verbose
```

### Documentação Detalhada


## �🛠️ Tecnologias


## 📚 Documentação

### 🎯 Guias Essenciais (NOVO)

### 📂 Estrutura Completa

## �️ Comandos Principais

### Desenvolvimento
```bash
npm run dev              # Servidor de desenvolvimento (http://localhost:5173)
npm run build            # Build de produção
npm run preview          # Preview do build de produção
npm test                 # Executar testes unitários
npm run test:integration # Executar testes de integração
```

### Exportar Templates
```bash
npm run export-templates -- --template=quiz21StepsComplete  # Template específico
npm run export-templates:all                                 # Todos os templates
npm run export-templates:verbose                            # Com logs detalhados
```

### Manutenção
```bash
npm run lint             # Verificar código com ESLint
npm run type-check       # Verificar tipos TypeScript
npm run lovable:prepare  # Preparação para deploy
```


## �️ Estrutura do Projeto

```
quiz-flow-pro-verso-03342/
├── .archive/              # 📦 Scripts históricos e temporários (142 arquivos)
│   ├── scripts-debug/     # Scripts de diagnóstico
│   ├── scripts-correcao/  # Scripts de correção e fix
│   ├── scripts-analise/   # Scripts de análise
│   ├── scripts-teste/     # Scripts de teste
│   └── relatorios-html/   # Relatórios históricos
├── docs/                  # 📚 Documentação completa
│   ├── analysis/          # Análises técnicas
│   ├── architecture/      # Arquitetura do sistema
│   ├── guides/            # Guias práticos
│   └── INDEX.md           # Índice de documentação
├── public/                # Arquivos públicos e assets
├── src/                   # 💻 Código-fonte principal
│   ├── components/        # Componentes React (1,501 arquivos)
│   │   ├── blocks/        # Blocos de conteúdo
│   │   ├── editor/        # Editor visual
│   │   ├── quiz-builder/  # Construtor de quiz
│   │   └── ui/            # Componentes de interface
│   ├── config/            # Configurações (154 arquivos)
│   ├── contexts/          # Context API (38 arquivos)
│   ├── hooks/             # Custom hooks (255 arquivos)
│   ├── lib/               # Bibliotecas utilitárias (332 arquivos)
│   ├── pages/             # Páginas da aplicação (93 arquivos)
│   ├── services/          # Serviços de negócio (251 arquivos)
│   ├── templates/         # Templates de funis (24 arquivos)
│   └── types/             # Definições TypeScript (77 arquivos)
├── scripts/               # Scripts de automação
├── server/                # Servidor backend
└── package.json           # Dependências e scripts
```

**Total:** ~3,145 arquivos de código-fonte

## 🏆 Características Técnicas

### Performance

### Qualidade de Código

### UX/UI


## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, leia nosso **[Guia de Contribuição](./CONTRIBUTING.md)** para detalhes sobre:


### Quick Start para Contribuidores

```bash
# 1. Fork e clone o repositório
git clone https://github.com/SEU_USUARIO/quiz-flow-pro-verso-03342.git

# 2. Crie uma branch
git checkout -b feature/minha-feature

# 3. Faça suas alterações e teste
npm test && npm run build

# 4. Commit com mensagem semântica
git commit -m "feat: adiciona nova funcionalidade"

# 5. Push e abra PR
git push origin feature/minha-feature
```

Ver: **[CONTRIBUTING.md](./CONTRIBUTING.md)** para guia completo


## 📞 Suporte e Contato



## 📜 Licença

Projeto proprietário - Todos os direitos reservados.


**Desenvolvido com ❤️ para criação de funis de conversão eficazes.**

*Última atualização: 09 de Novembro de 2025*
