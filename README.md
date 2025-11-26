# 🎯 Quiz Flow Pro - Verso 03342

Sistema interativo profissional de criação e gerenciamento de quizzes e funis de conversão com arquitetura consolidada de alta performance.

[![Performance](https://img.shields.io/badge/Performance-Excelente-success)]()
[![Bundle Size](https://img.shields.io/badge/Bundle-180KB-success)]()
[![Tests](https://img.shields.io/badge/Tests-455_files-success)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)]()
[![React](https://img.shields.io/badge/React-18-blue)]()
[![Status](https://img.shields.io/badge/Status-FASE_0_Conclu%C3%ADda-green)]()
[![Security](https://img.shields.io/badge/Security-7%2F10-yellow)]()

> **🎉 FASE 0 Concluída (85%)** - Arquitetura analisada, gargalos identificados, roadmap de 17 semanas criado.  
> 📊 [Ver Roadmap](.archive/reports/CONSOLIDATION_ROADMAP.md) | 🔒 [Audit Segurança](.archive/reports/SECURITY_AUDIT_REPORT.md)

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

**Última Atualização:** 26 de Novembro de 2025 - **FASE 0: Quick Wins Concluída** ✅

| Aspecto | Status | Métrica |
|---------|--------|---------|
| **Organização** | 🟢 Excelente | 40→15 arquivos raiz (-62%) |
| **Performance** | 🟢 Excelente | 8.7M dev, 180KB prod |
| **Testes** | 🟡 Bom | 455 arquivos de teste |
| **Segurança** | 🟡 Melhorando | 7/10 (6 vulns, CSP ativo) |
| **Arquitetura** | 🟡 Em Progresso | 101 serviços, 140 deprecated |
| **Build** | 🟢 OK | Sem erros críticos |

### 🎯 Roadmap de Consolidação

**FASE 0:** ✅ 85% Concluída (1 semana)
- ✅ Arquivos organizados (-62%)
- ✅ Gargalos identificados
- ✅ Auditoria de segurança
- ✅ Roadmap 17 semanas criado

**FASE 1:** 📋 Planejada (4 semanas) - Estabilização
**FASE 2:** 📋 Planejada (8 semanas) - Consolidação (101→35 serviços)
**FASE 3:** 📋 Planejada (4 semanas) - Otimização

📖 [Ver Roadmap Completo](.archive/reports/CONSOLIDATION_ROADMAP.md) | 📊 [Status Detalhado](PROJECT_STATUS_UPDATED.md)


## 🏗️ Canonical Services Architecture (Phase 4 - FINALIZED)

**Status**: ✅ Production Ready | **Version**: 4.0.0 | **Date**: 24 Nov 2025

This project uses a **canonical services architecture** where all business logic flows through a single, unified service layer. As of Phase 4, this is now the **permanent and only supported architecture**.

### Key Principles

1. **Single Source of Truth**: Each domain has exactly ONE canonical service
2. **No Feature Flags**: Migration-related flags have been permanently removed
3. **React Query Integration**: All data fetching uses React Query hooks
4. **Result Pattern**: Consistent error handling with `ServiceResult<T>`
5. **No Legacy Paths**: All legacy service code paths have been removed

### Canonical Services (12 Total)

| Service | Purpose | Status |
|---------|---------|--------|
| `TemplateService` | Template management | ✅ Production |
| `FunnelService` | Funnel management | ✅ Production |
| `CacheService` | Caching layer | ✅ Production |
| `StorageService` | File & storage operations | ✅ Production |
| `AnalyticsService` | Metrics & tracking | ✅ Production |
| `ValidationService` | Validation & RBAC | ✅ Production |
| `MonitoringService` | Performance & health | ✅ Production |
| `NotificationService` | User notifications | ✅ Production |
| `AuthService` | Authentication | ✅ Production |
| `ConfigService` | Configuration management | ✅ Production |
| `HistoryService` | Undo/redo & versioning | ✅ Production |
| `EditorService` | Editor operations | ✅ Production |

### Usage Example

```typescript
// ✅ CORRECT: Use canonical service through React Query
import { useTemplateList } from '@/hooks/useTemplate';
import { useCreateTemplate } from '@/hooks/useUpdateTemplate';

function MyComponent() {
  const { data: templates, isLoading } = useTemplateList();
  const createMutation = useCreateTemplate();
  
  // All operations go through canonical service
  return <div>{/* ... */}</div>;
}

// ❌ INCORRECT: Don't import legacy services or use feature flags
import { getAllTemplates } from '@/services/templates/templateService'; // REMOVED
import { featureFlags } from '@/config/flags'; // Migration flags REMOVED
```

### Rollback Strategy

**Important**: Runtime feature flags are NO LONGER AVAILABLE.

If critical issues are discovered, rollback must be done via Git:

```bash
# Revert Phase 4 to restore Phase 3 with emergency rollback capability
git revert <phase-4-commit-hash>

# Or rollback to specific commit
git reset --hard <phase-3-commit-hash>
```

This will restore:
- Emergency rollback flag (`DISABLE_CANONICAL_SERVICES_GLOBAL`)
- Migration helper functions
- Dual-path logic in affected components

### Migration History

- **Phase 1**: Established canonical services with feature flags
- **Phase 2**: Migrated components to use canonical services
- **Phase 3**: Inverted flags - canonical became default, legacy became emergency rollback
- **Phase 4** (Current): Removed ALL migration code and feature flags - canonical is permanent

For detailed migration history, see:
- [SERVICES_MIGRATION_PROGRESS.md](./SERVICES_MIGRATION_PROGRESS.md)
- [SERVICES_CONSOLIDATION_REPORT.md](./SERVICES_CONSOLIDATION_REPORT.md)


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

### 🎨 Sistema WYSIWYG (v1.0 - 2025)

**Edição Visual Instantânea** - Mudanças no Painel de Propriedades aparecem imediatamente no Canvas.

#### ✨ Features

- **Edição em Tempo Real**: Sincronização instantânea entre propriedades e canvas
- **3 Modos de Visualização**:
  - **Edit** (Ctrl+1): Modo edição completo
  - **Preview Live** (Ctrl+2): Visualização com dados locais (não salvos)
  - **Preview Production** (Ctrl+3): Visualização com dados publicados
- **Viewport Responsivo** (Ctrl+Alt+1/2/3/0):
  - Mobile: 375px (iPhone SE)
  - Tablet: 768px (iPad)
  - Desktop: 1280px
  - Full: 100% (sem restrições)
- **Auto-save Inteligente**: Salva automaticamente após 2s de inatividade
- **Validação em Tempo Real**: Valida blocos antes de renderizar

#### ⌨️ Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `Ctrl + 1` | Modo Editar |
| `Ctrl + 2` | Preview Editor (Live) |
| `Ctrl + 3` | Preview Publicado |
| `Ctrl + Alt + 1/2/3/0` | Viewport Mobile/Tablet/Desktop/Full |
| `Ctrl + Z` | Desfazer |
| `Ctrl + Y` | Refazer |

📖 **Documentação Completa**: [docs/WYSIWYG_ARCHITECTURE.md](./docs/WYSIWYG_ARCHITECTURE.md)

### Arquitetura do Editor (4 Colunas)
1. **Steps Panel**: Navegação entre etapas do funil
2. **Component Library**: Biblioteca de componentes drag & drop
3. **Visual Canvas**: Preview em tempo real com drop zones (WYSIWYG)
4. **Properties Panel**: Edição detalhada de propriedades (atualização instantânea)

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
