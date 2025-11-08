# 🚨 PLANO DE EMERGÊNCIA - Consolidação de Arquitetura

**Status:** EM EXECUÇÃO  
**Início:** 2025-11-08  
**Prioridade:** CRÍTICA

---

## 📋 FASE 1: EMERGÊNCIA (1-2 dias) 🚨

### ✅ Concluído

#### PR1: Correções Críticas QuizModularEditor
- ✅ UUID v4 substituindo Date.now() (3 locais)
- ✅ AbortController para cancelamento (2 useEffect)
- ✅ Await fixes (1 local)
- ✅ Logging estruturado (6 catch blocks)
- ✅ Documentação completa

#### PR2: Validação e Normalização de Templates
- ✅ Zod instalado
- ✅ Schema templateV3Schema.ts (217 linhas)
- ✅ normalize.ts com validação (276 linhas)
- ✅ 20 testes unitários passando
- ✅ Integração em QuizModularEditor
- ✅ Documentação completa

### 🔄 Em Andamento

#### Tarefa 1.1: Corrigir Erros de Build TypeScript
**Objetivo:** Eliminar 24 erros TypeScript

**Problemas Identificados:**
1. ❌ **Schema Block Incorreto** - Testes usando schema antigo
   ```typescript
   // ❌ ERRADO (testes atuais)
   { id: 'test', type: 'text', properties: {} }
   
   // ✅ CORRETO (schema real)
   { 
     id: 'test', 
     type: 'text', 
     order: 0,
     content: {},
     properties: {} 
   }
   ```

2. ❌ **ValidationResult.error** - Deveria ser `errors` (plural)
   - Arquivos: `templateWorkflows.test.tsx` (linhas 149, 155)

3. ❌ **Event Handlers sem Tipo** - 10 erros de `any` implícito
   - Arquivos: `StepsPanel.tsx`, `SortableBlockWrapper.tsx`

**Ações:**
- [ ] Atualizar mocks em `templateWorkflows.test.tsx`
- [ ] Corrigir `ValidationResult.error` → `ValidationResult.errors`
- [ ] Adicionar tipos em event handlers
- [ ] Validar com `npm run check`

#### Tarefa 1.2: Consolidar EditorProviders
**Objetivo:** Ter UM único provedor ativo

**Situação Atual:**
- ⚠️ `EditorProviderUnified` (OBSOLETO - ainda em uso)
- ✅ `EditorProviderCanonical` (OFICIAL)
- ⚠️ `SuperUnifiedProvider` (?)

**Ações:**
- [ ] Criar script `scripts/migrate-editor-providers.ts`
- [ ] Migrar todos imports → `EditorProviderCanonical`
- [ ] Arquivar provider obsoleto
- [ ] Atualizar exports em `src/components/editor/index.ts`
- [ ] Documentar decisão em ADR

---

## 🔧 FASE 2: ESTABILIZAÇÃO (3-5 dias)

### Tarefa 2.1: Consolidar FunnelServices
**Problema:** 15+ variações de FunnelService

**Serviços Identificados:**
- `FunnelService.ts`
- `FunnelUnifiedService.ts`
- `EnhancedFunnelService.ts`
- `ContextualFunnelService.ts`
- `MigratedContextualFunnelService.ts`
- `FunnelConfigPersistenceService.ts`
- ... (9+ outros)

**Decisão:** Usar apenas `CanonicalFunnelService`

**Ações:**
- [ ] Criar `src/services/aliases/FunnelServiceAliases.ts`
- [ ] Adicionar re-exports para compatibilidade
- [ ] Deprecar serviços duplicados
- [ ] Mover para `.archive/` após 1 sprint

### Tarefa 2.2: Simplificar Sistema de Templates
**Problema:** 5 fontes diferentes + 7 tentativas de carregamento

**Ordem de Prioridade Definida:**
1. **Supabase** (se habilitado) - dados personalizados do usuário
2. **JSON v3 por step** - conteúdo enriquecido `/templates/step-XX-v3.json`
3. **Master JSON** - fallback confiável `/templates/quiz21-complete.json`
4. **TS fallback** - último recurso `src/templates/quiz21StepsComplete.ts`

**Ações:**
- [ ] Atualizar `TemplateLoader.ts` com ordem clara
- [ ] Remover fallbacks redundantes (blocos legados)
- [ ] Implementar circuit breaker (máx 2 tentativas)
- [ ] Criar `docs/TEMPLATE_LOADING_GUIDE.md`

### Tarefa 2.3: Consolidar Sistemas de Cache
**Problema:** 3 sistemas de cache diferentes

**Decisão:** Usar apenas `HybridCacheStrategy`

**Ações:**
- [ ] Criar `CacheMigrationAdapter.ts`
- [ ] Migrar dados de caches antigos
- [ ] Deprecar `UnifiedCacheService`
- [ ] Deprecar `TemplateCacheService`
- [ ] Atualizar BlockRegistry para usar cache unificado

---

## ⚡ FASE 3: OTIMIZAÇÃO (1-2 semanas)

### Tarefa 3.1: Block Registry Protegido
**Objetivo:** Primeiro carregamento < 2s

**Estratégias:**
- [ ] Pré-carregamento inteligente por tipo de step
- [ ] Agrupar imports relacionados (barrel exports)
- [ ] Code splitting inteligente no Vite
- [ ] Medir com Performance API

### Tarefa 3.2: Melhorar Testes
**Objetivo:** 70%+ cobertura, todos passando

**Ações:**
- [ ] Corrigir testes existentes (schema Block)
- [ ] Adicionar testes faltantes (BlockRegistry, Cache, Navigation)
- [ ] Configurar CI/CD com GitHub Actions
- [ ] Integrar Codecov

### Tarefa 3.3: Documentação Técnica
**Objetivo:** Onboarding < 1 dia

**Ações:**
- [ ] Criar ADRs (Architecture Decision Records)
- [ ] Documentar fluxos de dados com diagramas
- [ ] Criar `docs/DEVELOPER_GUIDE.md`
- [ ] Criar `docs/ARCHITECTURE.md`

---

## 🔄 FASE 4: MANUTENÇÃO (Contínuo)

### Tarefas Mensais
- [ ] Identificar código não usado (`depcheck`, `unimported`)
- [ ] Remover arquivos `.archive/` após 3 meses
- [ ] Atualizar dependências
- [ ] Revisar métricas de performance

### Monitoramento Contínuo
- [ ] Tempo de carregamento por step
- [ ] Taxa de acertos do cache
- [ ] Tamanho do bundle por feature
- [ ] Alertas: bundle > 500KB, load > 3s

---

## ✅ CRITÉRIOS DE SUCESSO

### Build & Deploy
- [ ] 0 erros TypeScript
- [ ] Tempo de build < 60s
- [ ] Bundle size < 2MB

### Performance
- [ ] Primeira carga < 2s
- [ ] Carga de step < 500ms
- [ ] Cache hit rate > 80%

### Qualidade
- [ ] Cobertura de testes > 70%
- [ ] 1 provider ativo (EditorProviderCanonical)
- [ ] 1 FunnelService ativo (CanonicalFunnelService)
- [ ] < 10 arquivos obsoletos

### Developer Experience
- [ ] Setup em 5 comandos
- [ ] Documentação completa
- [ ] Onboarding < 1 dia

---

## 📊 PROGRESSO GERAL

**FASE 1 (Emergência):** ███████░░░ 70%  
- ✅ PR1: Correções Críticas (100%)
- ✅ PR2: Validação Templates (100%)
- 🔄 Tarefa 1.1: Erros TypeScript (0%)
- ⏳ Tarefa 1.2: Providers (0%)

**FASE 2 (Estabilização):** ░░░░░░░░░░ 0%

**FASE 3 (Otimização):** ░░░░░░░░░░ 0%

**FASE 4 (Manutenção):** ░░░░░░░░░░ 0%

---

## 🎯 PRÓXIMA AÇÃO IMEDIATA

**Tarefa:** Corrigir schema Block em testes  
**Arquivo:** `src/__tests__/integration/templateWorkflows.test.tsx`  
**Tempo estimado:** 30 minutos  
**Comando de validação:** `npm run check && npm run test:run:core`

---

## 📝 NOTAS

### Decisões Arquiteturais Pendentes
1. **SuperUnifiedProvider** - Investigar propósito e consolidar com Canonical
2. **Craft.js** - Verificar se `@craftjs/core` e `@craftjs/layers` estão em uso
3. **Dependencies Audit** - Revisar `leva`, `quill`, `mustache` (necessários?)

### Débito Técnico Priorizado
1. 🔴 **CRÍTICO:** Erros de build TypeScript (24 erros)
2. 🟠 **ALTO:** Fragmentação de providers (3 providers)
3. 🟠 **ALTO:** Serviços duplicados (15+ FunnelService)
4. 🟡 **MÉDIO:** Sistema de cache fragmentado (3 sistemas)
5. 🟡 **MÉDIO:** Templates com 7 tentativas de carregamento

### Lições Aprendidas
- ✅ **PR1+PR2** mostraram que consolidação incremental funciona
- ⚠️ Testes desatualizados bloqueiam validação
- ⚠️ Refatoração "pela metade" cria mais problemas que soluções
- ✅ Documentação detalhada facilita code review

---

**Última atualização:** 2025-11-08 00:45 UTC  
**Responsável:** GitHub Copilot  
**Status:** 🔄 FASE 1 EM ANDAMENTO
