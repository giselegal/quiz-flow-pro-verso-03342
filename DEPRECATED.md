# 🗑️ DEPRECATED & CONSOLIDATION MAP

> **Data da Análise:** 13 de Outubro de 2025  
> **Status:** Debt Técnico Mapeado - Aguardando Consolidação

## 📊 RESUMO EXECUTIVO

Este documento mapeia **débito técnico crítico** identificado no projeto, incluindo:
- **435 arquivos** com `@ts-nocheck` (91% do código sem verificação de tipos)
- **117 arquivos de serviços** (60%+ duplicados/sobrepostos)
- **102 arquivos relacionados ao editor** (apenas 1 é canônico)
- **44 providers** exportados (20+ ativos simultaneamente)
- **44 templates JSON** (3 fontes de verdade conflitantes)

---

## 🎯 EDITOR CANÔNICO OFICIAL

### ✅ **OFICIAL: QuizModularProductionEditor**
```
Arquivo: src/components/editor/quiz/QuizModularProductionEditor.tsx
Rota: /editor (sem sufixo)
Status: ✅ ATIVO - Editor de Produção
Última Atualização: 13/10/2025
Linhas: ~2.284

Funcionalidades:
- ✅ Drag & Drop com 47 componentes
- ✅ Integração com EnhancedBlockRegistry
- ✅ Painel de propriedades dinâmico
- ✅ 11 categorias de componentes
- ✅ Preview em tempo real
- ✅ Salvar no Supabase
```

### ⚠️ EDITORES OBSOLETOS (NÃO USAR)

#### 🔴 DEPRECATED: QuizFunnelEditorWYSIWYG_Refactored
```
Arquivo: src/components/editor/quiz/QuizFunnelEditorWYSIWYG_Refactored.tsx
Rota: /editor-new
Status: 🔴 DEPRECATED
Motivo: Substituído por QuizModularProductionEditor
Plano: Remover na v4.0 (Janeiro 2026)
```

#### 🔴 DEPRECATED: UnifiedEditorCore
```
Arquivo: src/components/editor/unified/UnifiedEditorCore.tsx
Rota: Não exposto
Status: 🔴 DEPRECATED
Motivo: Tentativa de unificação que não foi adotada
Plano: Remover na v4.0 (Janeiro 2026)
```

#### 🔴 DEPRECATED: QuizFunnelEditorSimplified
```
Arquivo: src/components/editor/quiz/QuizFunnelEditorSimplified.tsx
Rota: Não exposto
Status: 🔴 DEPRECATED
Motivo: Versão simplificada obsoleta
Plano: Remover na v4.0 (Janeiro 2026)
```

---

## 📦 SERVIÇOS DUPLICADOS

### Categoria: Funnel/Funil Services

#### ✅ CANÔNICO: FunnelService
```typescript
Arquivo: src/services/FunnelService.ts
Funcionalidades: CRUD completo de funnels via Supabase
Métodos principais:
  - saveFunnel()
  - loadFunnel()
  - listFunnels()
  - deleteFunnel()
```

#### 🔴 DUPLICADOS (Consolidar ou Remover):
```
1. src/services/FunilUnificadoService.ts
   └─ saveFunnel() → DUPLICADO de FunnelService.saveFunnel()
   
2. src/services/EnhancedFunnelService.ts
   └─ persistFunnel() → DUPLICADO de FunnelService.saveFunnel()
   
3. src/services/AdvancedFunnelStorage.ts
   └─ storeFunnel() → DUPLICADO de FunnelService.saveFunnel()
   
4. src/services/SistemaDeFunilMelhorado.ts
   └─ MESMO PROPÓSITO que FunnelService
   
5. src/services/contextualFunnelService.ts
   └─ WRAPPER desnecessário sobre FunnelService
```

**Plano de Ação:**
- [x] Identificar duplicações (concluído)
- [ ] Migrar código único de cada serviço para FunnelService
- [ ] Adicionar `@deprecated` nos duplicados
- [ ] Remover na v4.0 (Janeiro 2026)

---

## 🔗 PROVIDERS SOBREPOSTOS

### Categoria: Editor Providers

#### ✅ CANÔNICO: EditorProvider
```typescript
Arquivo: src/contexts/editor/EditorContext.tsx
Funcionalidades:
  - Estado global do editor
  - Gerenciamento de steps/blocks
  - Histórico undo/redo
```

#### 🔴 SOBREPOSTOS (Avaliar Consolidação):
```
1. OptimizedEditorProvider
   Arquivo: src/components/editor/OptimizedEditorProvider.tsx
   Motivo: Tentativa de otimização prematura
   Funcionalidades únicas: useMemo em alguns hooks
   Recomendação: Mesclar otimizações em EditorProvider
   
2. EditorProviderMigrationAdapter
   Arquivo: src/components/editor/EditorProviderMigrationAdapter.tsx
   Motivo: Camada de adaptação legacy
   Funcionalidades: Tradução entre APIs antigas/novas
   Recomendação: Remover após migração completa
   
3. PureBuilderProvider
   Arquivo: src/components/editor/PureBuilderProvider.tsx
   Motivo: Experimento de "pure" provider
   Funcionalidades: Nenhuma adicional
   Recomendação: REMOVER imediatamente
   
4. EditorProviderUnified
   Arquivo: src/components/editor/EditorProviderUnified.tsx
   Motivo: Tentativa de unificação não adotada
   Recomendação: REMOVER após análise de uso
```

**Plano de Consolidação:**
- [ ] Analisar uso real de cada provider (grep no código)
- [ ] Migrar componentes para EditorProvider canônico
- [ ] Adicionar deprecation warnings
- [ ] Remover providers não utilizados

---

## 📄 TEMPLATES FRAGMENTADOS

### Situação Atual (3 Fontes de Verdade):

#### 1️⃣ **Master JSON (Recomendado)**
```
Arquivo: public/templates/quiz21-complete.json
Status: ✅ COMPLETO (119 KB)
Steps: 21/21 consolidados
Última Atualização: 13/10/2025
Uso: Editor carrega deste arquivo
```

#### 2️⃣ **TypeScript Template (Legacy)**
```
Arquivo: src/templates/quiz21StepsComplete.ts
Status: ⚠️ DESATUALIZADO
Linhas: 3.742
Uso: Produção (/quiz-estilo)
Problema: Desconectado do editor
```

#### 3️⃣ **Fragmentos JSON (v3)**
```
Arquivos: public/templates/step-XX-v3.json (21 arquivos)
Status: ⚠️ REDUNDANTE
Uso: Foram consolidados em quiz21-complete.json
Recomendação: Mover para /backups/
```

**Plano de Unificação:**
- [x] Verificar quiz21-complete.json tem todos os 21 steps ✅
- [ ] Migrar produção para carregar de quiz21-complete.json
- [ ] Deprecar quiz21StepsComplete.ts
- [ ] Arquivar step-XX-v3.json em /backups/

---

## 🚨 ARQUIVOS COM @ts-nocheck

### Top 10 Mais Problemáticos:

```typescript
1. src/components/editor/quiz/QuizModularProductionEditor.tsx
   Linhas: 2.284
   Prioridade: 🔴 CRÍTICA (editor principal)
   
2. src/services/FunnelService.ts
   Linhas: 1.892
   Prioridade: 🔴 CRÍTICA (serviço principal)
   
3. src/components/quiz/QuizRenderer.tsx
   Linhas: 1.567
   Prioridade: 🟠 ALTA (renderer de produção)
   
4. src/contexts/editor/EditorContext.tsx
   Linhas: 1.234
   Prioridade: 🔴 CRÍTICA (contexto principal)
   
5. src/hooks/useQuizFlow.ts
   Linhas: 892
   Prioridade: 🟠 ALTA (hook crítico)

... (430 outros arquivos)
```

**Estratégia de Limpeza:**
- Fase 1: Remover de arquivos <100 linhas (mais fácil) ✅ 1/435 concluído
- Fase 2: Remover de hooks e utilidades (médio)
- Fase 3: Remover de componentes grandes (difícil)
- Fase 4: Remover de contextos e serviços (muito difícil)

---

## 📈 MÉTRICAS DE PROGRESSO

| Gargalo | Total | Corrigido | Pendente | % Concluído |
|---------|-------|-----------|----------|-------------|
| @ts-nocheck | 435 | 1 | 434 | 0.2% |
| Serviços Duplicados | 117 | 0 | 117 | 0% |
| Editores Obsoletos | 102 | 0 | 102 | 0% |
| Providers Sobrepostos | 44 | 0 | 44 | 0% |
| Templates Fragmentados | 44 | 21 | 23 | 48% |

**Última Atualização:** 13/10/2025 - 17:15

---

## 🎯 PRÓXIMOS PASSOS

### Sprint 1 (Esta Semana):
- [x] Mapear gargalos principais
- [x] Documentar editor canônico
- [ ] Adicionar deprecation warnings em rotas
- [ ] Criar script de análise de uso de providers

### Sprint 2 (Próxima Semana):
- [ ] Consolidar 10 serviços mais duplicados
- [ ] Remover @ts-nocheck de 50 arquivos simples
- [ ] Migrar produção para quiz21-complete.json

### Sprint 3 (Mês que Vem):
- [ ] Consolidar providers em SuperUnifiedProvider
- [ ] Remover editores obsoletos
- [ ] Auditoria e remoção de dependências desnecessárias

---

## 💬 PARA DESENVOLVEDORES

**Se você está começando no projeto:**
1. ✅ USE `QuizModularProductionEditor` (não outros editores)
2. ✅ USE `FunnelService` (não variantes como Enhanced/Advanced)
3. ✅ USE `EditorProvider` (não Optimized/Migration/Pure)
4. ✅ CARREGUE templates de `quiz21-complete.json`
5. ❌ NÃO ADICIONE novos `@ts-nocheck`
6. ❌ NÃO CRIE novos providers sem aprovação
7. ❌ NÃO DUPLIQUE serviços existentes

**Dúvidas?** Consulte este documento ou pergunte no Slack #tech-debt

---

**Documento mantido por:** Sistema de IA + Equipe de Desenvolvimento  
**Última Revisão:** 13 de Outubro de 2025
