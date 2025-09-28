# 🎯 TICKETS DE REFATORAÇÃO DO EDITOR - PRONTOS PARA CADASTRO

## 📋 **RESUMO EXECUTIVO**
6 epics principais derivados da análise completa do sistema de editor, organizados em 20 tickets específicos prontos para implementação.

---

## 🎫 **TICKET #1: CONSOLIDAR PROVIDERS E HOOKS DO EDITOR**

### **📊 Informações do Ticket:**
- **Epic:** Arquitetura e Refatoração
- **Prioridade:** 🔴 Alta
- **Estimativa:** 8-13 pontos
- **Sprint:** Sprint 1

### **🎯 Objetivo:**
Eliminar conflitos entre `@/context/EditorContext` e `@/components/editor/EditorProvider`, garantindo uma única fonte de verdade para `useEditor`.

### **📋 Tarefas:**
- [ ] **T1.1** - Mapear todas as importações de `useEditor` no sistema
- [ ] **T1.2** - Renomear opções legadas (`useLegacyEditor`, `useBuilderEditor`)
- [ ] **T1.3** - Criar adaptadores para manter compatibilidade
- [ ] **T1.4** - Remover arquivos de backup (`*_backup.tsx`, `.broken`, `.disabled`) do bundle

### **✅ Entregáveis:**
- Provider único documentado e testado
- Plano de migração para componentes dependentes
- Limpeza de artefatos legados

### **⚠️ Riscos/Dependências:**
- Componentes que assumem comportamento específico do provider legado podem exigir refatoração adicional
- Coordenação com times que ainda usam a API antiga

### **🔍 Critérios de Aceite:**
- [ ] Zero importações duplicadas de `useEditor`
- [ ] Provider único funcional em todos os contextos
- [ ] Adaptadores backward-compatible funcionando
- [ ] Bundle reduzido (sem arquivos legados)

---

## 🎫 **TICKET #2: RESTAURAR PIPELINE DE ETAPAS E PREVIEW EM TEMPO REAL**

### **📊 Informações do Ticket:**
- **Epic:** Funcionalidades Core
- **Prioridade:** 🔴 Alta  
- **Estimativa:** 13-21 pontos
- **Sprint:** Sprint 1-2

### **🎯 Objetivo:**
Fazer o `EditorContext` carregar estágios reais e garantir que o preview funcione sem quebrar em runtime.

### **📋 Tarefas:**
- [ ] **T2.1** - Implementar `realStages` e `stageActions` completos
- [ ] **T2.2** - Criar cache de templates sob demanda
- [ ] **T2.3** - Substituir `require` em `UnifiedPreviewEngine` por import compatível com Vite/ESM
- [ ] **T2.4** - Cobrir casos sem dados com fallback explícito

### **✅ Entregáveis:**
- Navegação exibindo etapas corretas com indicadores
- Preview funcional no navegador
- Testes de regressão cobrindo carregamento assíncrono

### **⚠️ Riscos/Dependências:**
- Necessário entender a fonte final dos templates (`TemplateManager`, `Supabase`)
- Ajustes em `ModularEditorPro` podem ser necessários para refletir o novo estado

### **🔍 Critérios de Aceite:**
- [ ] Pipeline de etapas navegável
- [ ] Preview em tempo real sem erros
- [ ] Cache de templates performático
- [ ] Fallbacks funcionais para dados ausentes

---

## 🎫 **TICKET #3: PRODUCTIONIZAR UNIFIED CRUD E HOOK USEUNIFIEDEDITOR**

### **📊 Informações do Ticket:**
- **Epic:** CRUD Operations
- **Prioridade:** 🟡 Média-Alta
- **Estimativa:** 8-13 pontos
- **Sprint:** Sprint 2

### **🎯 Objetivo:**
Entregar um fluxo CRUD real para o editor unificado, removendo mocks e TODOs.

### **📋 Tarefas:**
- [ ] **T3.1** - Implementar todos os métodos de `useUnifiedEditor` (salvar, duplicar, excluir, reorder)
- [ ] **T3.2** - Alinhar com `UnifiedCRUDProvider`
- [ ] **T3.3** - Criar testes unitários e integração (mockando serviços)
- [ ] **T3.4** - Validar UI de status (dirty state, undo/redo)

### **✅ Entregáveis:**
- Hook completo com cobertura de testes
- Integração estável com `UnifiedCRUDProvider`
- Documentação de endpoints/serviços necessários

### **⚠️ Riscos/Dependências:**
- Serviços `funnelUnifiedService` / `UnifiedDataService` devem estar disponíveis ou simulados
- Sincronização com `EditorDashboardSyncService` pode exigir ajustes

### **🔍 Critérios de Aceite:**
- [ ] Todos os métodos CRUD implementados
- [ ] Testes com 80%+ de cobertura
- [ ] Estado dirty/clean funcionando
- [ ] Undo/redo operacional

---

## 🎫 **TICKET #4: ENDURECER A ROTA /EDITOR (MODERNUNIFIEDEDITOR)**

### **📊 Informações do Ticket:**
- **Epic:** Robustez e Performance
- **Prioridade:** 🟡 Média
- **Estimativa:** 5-8 pontos
- **Sprint:** Sprint 2-3

### **🎯 Objetivo:**
Garantir que a página principal funcione em SSR/testes e ofereça fallbacks adequados.

### **📋 Tarefas:**
- [ ] **T4.1** - Proteger acessos a `window`/`localStorage`
- [ ] **T4.2** - Revisar `Suspense` aninhados
- [ ] **T4.3** - Alinhar o toggle de `realExperienceMode` com o engine de preview
- [ ] **T4.4** - Validar comportamento em modo `admin-integrated`

### **✅ Entregáveis:**
- Página `/editor` robusta (SSR-safe)
- Fallback de loading consistente
- Documentação dos modos de operação e overlays

### **⚠️ Riscos/Dependências:**
- Pode exigir atualizações no `EditorProUnified` e no preview para suportar o novo flag
- Ajustes em testes E2E

### **🔍 Critérios de Aceite:**
- [ ] Compatibilidade SSR completa
- [ ] Fallbacks de loading funcionais
- [ ] Modos de operação documentados
- [ ] Testes E2E passando

---

## 🎫 **TICKET #5: UNIFICAR COMPONENTES DUPLICADOS DO EDITOR**

### **📊 Informações do Ticket:**
- **Epic:** Arquitetura e Performance
- **Prioridade:** 🟡 Média
- **Estimativa:** 8-13 pontos
- **Sprint:** Sprint 3

### **🎯 Objetivo:**
Reduzir redundância entre sidebars, toolbars e canvas, planejando uma biblioteca única de componentes.

### **📋 Tarefas:**
- [ ] **T5.1** - Escolher a versão padrão de componentes críticos (`ComponentsSidebar`, `EditorToolbar`, `EditorCanvas`)
- [ ] **T5.2** - Remover duplicatas
- [ ] **T5.3** - Ajustar imports
- [ ] **T5.4** - Revisar estilos/classes para evitar regressões

### **✅ Entregáveis:**
- Componentes únicos exportados via `index.ts`
- Bundle reduzido
- Documentação de como estender cada peça

### **⚠️ Riscos/Dependências:**
- Regressões visuais possíveis
- Necessidade de alinhar estilos com o design system

### **🔍 Critérios de Aceite:**
- [ ] Zero componentes duplicados
- [ ] Bundle size reduzido em 15-30%
- [ ] Exports centralizados funcionando
- [ ] Testes visuais passando

---

## 🎫 **TICKET #6: MAPEAR SERVIÇOS EXTERNOS E OBSERVABILIDADE**

### **📊 Informações do Ticket:**
- **Epic:** Observabilidade e Integrações
- **Prioridade:** 🟢 Média-Baixa
- **Estimativa:** 5-8 pontos
- **Sprint:** Sprint 3-4

### **🎯 Objetivo:**
Tornar explícitas as dependências externas e garantir feedback ao usuário em operações críticas.

### **📋 Tarefas:**
- [ ] **T6.1** - Catalogar integrações (`TemplateManager`, `funnelUnifiedService`, `UnifiedDataService`, `Supabase`)
- [ ] **T6.2** - Definir fallbacks quando ausentes
- [ ] **T6.3** - Padronizar notificações/toasts (sucesso/erro)
- [ ] **T6.4** - Instrumentar logs com níveis configuráveis

### **✅ Entregáveis:**
- Documento de dependências e configuração
- Tratamento de erro consistente para ações de salvar/publicar/duplicar
- Chaves de log centralizadas

### **⚠️ Riscos/Dependências:**
- Necessidade de colaboração com equipes de backend/infra
- Implantação de observabilidade pode depender de tooling adicional

### **🔍 Critérios de Aceite:**
- [ ] Todas as dependências catalogadas
- [ ] Fallbacks funcionais implementados
- [ ] Sistema de notificações unificado
- [ ] Logs estruturados em produção

---

## 📊 **RESUMO DE PRIORIZAÇÃO**

### **Sprint 1 (Prioridade Alta):**
- 🎫 **Ticket #1:** Consolidar Providers e Hooks
- 🎫 **Ticket #2:** Restaurar Pipeline de Etapas

### **Sprint 2 (Prioridade Média-Alta):**
- 🎫 **Ticket #3:** Productionizar Unified CRUD
- 🎫 **Ticket #4:** Endurecer Rota /editor

### **Sprint 3 (Prioridade Média):**
- 🎫 **Ticket #5:** Unificar Componentes Duplicados
- 🎫 **Ticket #6:** Mapear Serviços Externos

---

## 🎯 **MÉTRICAS DE SUCESSO**

### **Técnicas:**
- ✅ Bundle size reduzido em 20-30%
- ✅ Tempo de build reduzido em 15%
- ✅ Zero erros TypeScript relacionados ao editor
- ✅ Cobertura de testes 80%+

### **Funcionais:**
- ✅ Preview em tempo real 100% funcional
- ✅ CRUD operations completas e testadas
- ✅ Navegação entre etapas fluida
- ✅ Fallbacks robustos para todos os cenários

### **Qualidade:**
- ✅ Documentação completa de componentes
- ✅ Logs estruturados em produção
- ✅ Monitoramento de performance ativo
- ✅ Design system alinhado

---

**🚀 TICKETS PRONTOS PARA CADASTRO NO SISTEMA DE GESTÃO DE PROJETOS**
