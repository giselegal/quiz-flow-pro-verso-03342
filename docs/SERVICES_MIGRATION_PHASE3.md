# 📦 Migração de Services - FASE 3 (Consolidação)

**Data inicial:** 2025-11-03  
**Status:** 🔄 Em progresso

---

## 🎯 OBJETIVO DA FASE 3

Consolidar 80+ services em 30 services canônicos, organizados por domínio:
- **Template Services** (Domínio 1)
- **Quiz Services** (Domínio 2)
- **Funnel Services** (Domínio 3)
- **Cache/Storage** (Domínio 4)

---

## ✅ DOMÍNIO 1: TEMPLATE SERVICES (CONCLUÍDO 40%)

### Services Movidos para `/deprecated`

#### 1. ✅ HybridTemplateService.ts
**Status:** Movido  
**Motivo:** Adapter legado que apenas delega para `templateService` canônico  
**Uso ativo:** ❌ Apenas re-export em `aliases/index.ts`  
**Ação tomada:**
- Movido para `src/services/deprecated/HybridTemplateService.ts`
- Mantido re-export em `aliases/index.ts` para compatibilidade temporária
- Warnings de depreciação já presentes no código

**Migração recomendada para consumidores:**
```typescript
// ❌ ANTES (deprecado)
import HybridTemplateService from '@/services/HybridTemplateService';
const template = await HybridTemplateService.getTemplate('step-01');

// ✅ DEPOIS (canônico)
import { templateService } from '@/services/canonical/TemplateService';
const result = await templateService.getStep('step-01');
if (result.success) {
  const template = result.data;
}
```

#### 2. ✅ Quiz21CompleteService.ts
**Status:** Movido  
**Motivo:** Dados estáticos e funções de criação de funil, não é service core  
**Uso ativo:** ❌ Apenas export de `QUIZ_21_COMPLETE_DATA` em `aliases/index.ts`  
**Ação tomada:**
- Movido para `src/services/deprecated/Quiz21CompleteService.ts`
- Mantido export de dados em `aliases/index.ts`
- Service completo preservado para referência histórica

**Migração recomendada:**
```typescript
// ❌ ANTES
import { QUIZ_21_COMPLETE_DATA } from '@/services/Quiz21CompleteService';

// ✅ DEPOIS
import { QUIZ_21_COMPLETE_DATA } from '@/services/aliases';
// OU usar templateService.getTemplate('quiz21StepsComplete') no futuro
```

---

### ⏳ Services Ativos (Migração Futura)

#### 3. 📋 TemplatesCacheService.ts
**Status:** ⚠️ ATIVO - Não mover ainda  
**Motivo:** Usado em 4 arquivos críticos do editor  
**Uso ativo:** ✅ SIM
- `src/components/editor/unified/RealStagesProvider.tsx`
- `src/components/editor/unified/UnifiedCRUDIntegration.tsx`
- `src/components/editor/unified/index.ts`
- `src/hooks/core/useUnifiedEditorProduction.ts`

**Plano de migração (Sprint futura):**
1. Integrar funcionalidades no `canonical/CacheService`
2. Criar adapter de compatibilidade
3. Migrar consumidores gradualmente
4. Deprecar e mover após 100% de migração

**Target canônico:**
```typescript
// Futuro: usar canonical/CacheService
import { cacheService } from '@/services/canonical/CacheService';
const cached = await cacheService.get('template', 'step-01');
```

#### 4. 📋 TemplateLoader.ts (em `/editor`)
**Status:** ⚠️ ATIVO - Não mover ainda  
**Usado em:** `src/components/editor/quiz/QuizModularEditor/index.tsx`  
**Ação futura:** Consolidar em `canonical/TemplateService` ou `canonical/EditorService`

#### 5. 📋 TemplateRegistry.ts
**Status:** ⚠️ ATIVO - Não mover ainda  
**Usado em:** 4 arquivos (bootstrap, editor, templates, utils)  
**Ação futura:** Avaliar se deve ser parte do `canonical/TemplateService`

---

## 📊 PROGRESSO DOMÍNIO 1

```
████░░░░░░ 40% Concluído

✅ Movidos para /deprecated:  2/5 (40%)
⏳ Aguardando migração:       3/5 (60%)
```

**Services movidos:** HybridTemplateService, Quiz21CompleteService  
**Services ativos:** TemplatesCacheService, TemplateLoader, TemplateRegistry  

---

## ✅ DOMÍNIO 2: QUIZ SERVICES (CONCLUÍDO 20%)

### Services Movidos para `/deprecated`

#### 1. ✅ quizService.ts
**Status:** Movido  
**Motivo:** STUB de 2 linhas sem implementação real  
**Uso ativo:** ❌ Nunca foi usado efetivamente  
**Ação tomada:**
- Movido para `src/services/deprecated/quizService.ts`
- Mantido re-export em `aliases/index.ts` com warning de depreciação
- Service era apenas placeholder: `getQuiz: async () => null, saveQuiz: async () => null`

**Migração recomendada para consumidores:**
```typescript
// ❌ ANTES (deprecado - nunca funcionou)
import { quizService } from '@/services/quizService';
const quiz = await quizService.getQuiz(); // Sempre retorna null

// ✅ DEPOIS - Para gestão de sessões locais
import { quizDataService } from '@/services/quizDataService';
quizDataService.startSession('userName', 'email');
quizDataService.addAnswer(questionId, questionText, options, ...);

// ✅ DEPOIS - Para persistência no banco
import { quizSupabaseService } from '@/services/quizSupabaseService';
await quizSupabaseService.createQuizSession({ funnelId, quizUserId, ... });
await quizSupabaseService.saveQuizResponse({ sessionId, stepNumber, ... });
```

---

### ⏳ Services Ativos (Migração Futura)

#### 2. 📋 quizDataService.ts
**Status:** ⚠️ ATIVO - Não mover ainda  
**Motivo:** Service core de 654 linhas usado em 3 arquivos críticos  
**Uso ativo:** ✅ SIM
- `src/components/quiz/QuizDataViewer.tsx`
- `src/hooks/useQuizTracking.ts`
- `src/services/aliases/index.ts`

**Funcionalidades:**
- Gestão de sessões de quiz (localStorage)
- Tracking de clicks e eventos
- Integração com Facebook Pixel e Google Analytics
- Captura de UTM parameters
- Analytics local

**Plano de migração (Sprint futura):**
- Consolidar em `canonical/DataService` ou criar `canonical/QuizService`
- Manter como service especializado por enquanto
- Alto impacto: usado em sistema de tracking crítico

#### 3. 📋 quizSupabaseService.ts
**Status:** ⚠️ ATIVO - Não mover ainda  
**Motivo:** Service core de 510 linhas para persistência no banco  
**Usado em:** Exportado via `aliases/index.ts` e usado em múltiplos fluxos

**Funcionalidades:**
- CRUD de quiz_users, quiz_sessions, quiz_step_responses
- Gestão de quiz_results e quiz_analytics
- Conversions tracking
- Legacy functions para retrocompatibilidade

**Plano de migração:** Consolidar em `canonical/DataService` (futuro)

#### 4. 📋 quizResultsService.ts
**Status:** ⚠️ ATIVO - Não mover ainda  
**Motivo:** Service de 804 linhas com lógica complexa de cálculo  
**Usado em:** `src/__tests__/quiz_results_progressive.test.ts`

**Funcionalidades:**
- Cálculo de perfil de estilo (styleConfig.ts)
- Análise de respostas por categoria
- Geração de recomendações personalizadas
- Persistência de resultados

**Plano de migração:** Consolidar em `canonical/AnalyticsService` (futuro)

#### 5. 📋 quizBuilderService.ts
**Status:** ⚠️ ATIVO - Não mover ainda  
**Motivo:** Service de 223 linhas usado em 2 arquivos do editor  
**Usado em:**
- `src/components/quiz/builder/components/QuizTemplateImporter.tsx`
- `src/hooks/useQuizBuilder.ts`

**Funcionalidades:**
- Geração de stages/components iniciais
- Conversão de templates para QuizBuilderState
- Conversão de ResultPageConfig

**Plano de migração:** Consolidar em `canonical/EditorService` (futuro)

---

## 📊 PROGRESSO DOMÍNIO 2

```
████░░░░░░ 20% Concluído

✅ Movidos para /deprecated:  1/5 (20%)
⏳ Aguardando migração:       4/5 (80%)
```

**Services movidos:** quizService (STUB)  
**Services ativos:** quizDataService, quizSupabaseService, quizResultsService, quizBuilderService

---

## 🔄 DOMÍNIO 3: FUNNEL SERVICES (FUTURO)

**Status:** Pendente  
**Target:** Consolidar em `canonical/EditorService`

Candidatos identificados:
- `FunnelUnifiedService.ts` (deprecar)
- `EnhancedFunnelService.ts` (deprecar)
- `funnelService.refactored.ts` (merge com original)

---

## 🔄 DOMÍNIO 4: CACHE/STORAGE (FUTURO)

**Status:** Pendente  
**Target:** Consolidar em `canonical/CacheService` e `canonical/StorageService`

Candidatos identificados:
- `CacheManager.ts` → CacheService
- `UnifiedCacheService.ts` → CacheService
- `localPublishStore.ts` → StorageService

---

## 📋 CHECKLIST PARA MOVER UM SERVICE

Antes de mover qualquer service para `/deprecated`:

1. ✅ Buscar imports ativos no codebase
2. ✅ Verificar se é apenas re-export ou uso real
3. ✅ Manter re-exports em `aliases/index.ts` se necessário
4. ✅ Adicionar warnings de depreciação no código
5. ✅ Documentar migração neste arquivo
6. ✅ Atualizar `docs/DEPRECATED_SERVICES.md`
7. ✅ Criar código de exemplo para migração

---

## 🎯 PRÓXIMOS PASSOS

**Imediato:**
1. ✅ Validar que HybridTemplateService e Quiz21CompleteService não quebraram nada
2. ⏳ Continuar Domínio 1: Analisar próximos candidatos (TemplateLoader, TemplateRegistry)
3. ⏳ Iniciar Domínio 2: Mapear Quiz Services

**Sprint atual (2-3h restantes):**
- Mover mais 2-3 services de Template
- Começar análise de Quiz Services
- Documentar todos os movimentos

**Sprints futuras:**
- Migrar TemplatesCacheService → canonical/CacheService (4h)
- Consolidar Quiz Services (3h)
- Consolidar Funnel Services (4h)
- Consolidar Cache/Storage (2h)

---

## 📈 MÉTRICAS GERAIS

**Antes:** 80 services  
**Meta:** 30 services  
**Progresso:** 2 movidos (2.5% do total)

**Estimativa restante:** 20-25 horas de trabalho
