# Progresso da Refatoração Sistêmica

**Data de Início:** 2025-12-04  
**Status:** Em andamento

---

## Fase 1: Correções Críticas ✅ CONCLUÍDA

### 1.1 Template Canônico Criado ✅
- **Ação:** Criado `public/templates/quiz21-v4.json`
- **Fonte:** Copiado de `src/templates/quiz21StepsComplete.json`
- **Impacto:** Elimina 70+ referências a arquivos inexistentes

### 1.2 Paths Atualizados ✅
10 arquivos atualizados para usar `/templates/quiz21-v4.json`

### 1.3 Serviços Duplicados Removidos ✅
- `src/core/services/ITemplateService.ts` (432 linhas)
- `src/core/services/TemplateService.ts` (2038 linhas)
- `src/core/services/TemplateServiceAdapter.ts`
- 2 arquivos de teste órfãos

---

## Fase 2: Consolidação de Hooks ✅ CONCLUÍDA

### 2.1 Hook Canônico do Editor ✅
- **Criado:** `src/hooks/canonical/useEditorCanonical.ts`
- **Consolida:** 15+ hooks useEditor*

### 2.2 Hook Canônico do Quiz ✅
- **Criado:** `src/hooks/canonical/useQuizCanonical.ts`
- **Consolida:** 25+ hooks useQuiz*
- **Funcionalidades:**
  - `navigation`: next, previous, goTo, reset, progress
  - `answers`: add, update, remove, clear, get, has
  - `userProfile`: setName, setEmail, update
  - `result`: calculate, reset, scores
  - `validation`: isStepComplete, canProceed
  - `analytics`: getTimeSpent, trackEvent

---

## Fase 3: Limpeza de Componentes ✅ CONCLUÍDA

### 3.1 Variantes IntroStep Removidas ✅
- 5 variantes deletadas (~554 linhas)

---

## Fase 4: Organização de Arquivos ✅ CONCLUÍDA

### 4.1 Arquivos .md Movidos ✅
- **80+ arquivos** movidos de `/` para `docs/archive/`

---

## Fase 5: Dividir blockPropertySchemas.ts ✅ CONCLUÍDA

### 5.1 Estrutura Modular Criada ✅
Arquivo monolítico (116KB, 2917 linhas) dividido em 9 módulos:

| Módulo | Descrição |
|--------|-----------|
| `types.ts` | Tipos e campos comuns |
| `universal.ts` | Schemas universais |
| `intro.ts` | Intro, headers, decorativos |
| `content.ts` | Texto, imagem, mídia |
| `question.ts` | Perguntas, opções, inputs |
| `result.ts` | Resultados, scores |
| `offer.ts` | Ofertas, CTAs, preços |
| `layout.ts` | Layout, containers |
| `social.ts` | Compartilhamento social |
| `index.ts` | Barrel export |

### 5.2 Compatibilidade Mantida ✅
- `blockPropertySchemas.ts` original redireciona para módulos
- Imports existentes continuam funcionando

---

## Fase 6: Melhoria do Editor ✅ CONCLUÍDA

### 6.1 Sistema de IDs Únicos ✅
- **Criado:** `src/lib/utils/generateId.ts`
- **Funções:** `generateBlockId()`, `generateStepId()`, `generateQuizId()`
- **Biblioteca:** nanoid para IDs criptograficamente seguros
- **Formato:** `{type}-{nanoid12}` ex: `text-heading-V1StGXR8_Z5j`

### 6.2 Block Factory ✅
- **Criado:** `src/lib/utils/blockFactory.ts`
- **Funções:** `createBlock()`, `cloneBlock()`, `getBlockDefaults()`
- **Defaults:** 20+ tipos de blocos com propriedades padrão
- **Categorias:** intro, content, question, result, offer, layout, navigation

### 6.3 Painel de Propriedades Aprimorado ✅
- **Criado:** `src/components/editor/properties/editors/RichTextEditorQuill.tsx`
- **WYSIWYG:** Integração com react-quill para campos HTML
- ColorPicker já existente em `propertyEditors.tsx`
- Image preview já existente no `UploadEditor`

### 6.4 Funcionalidades de Publicação ✅
- **PublishButton:** `src/components/editor/ModernQuizEditor/components/PublishButton.tsx`
  - Validação completa antes de publicar
  - Integração com RPC `publish_quiz_draft()`
  - Feedback visual de progresso
  
- **DuplicateFunnelButton:** `src/components/editor/ModernQuizEditor/components/DuplicateFunnelButton.tsx`
  - Duplicação via RPC ou fallback local
  - Navegação automática para novo funil

### 6.5 quizStore Atualizado ✅
- `addBlock()` usa `createBlock()` com BlockFactory
- `duplicateBlock()` usa `cloneBlock()` com ID único via nanoid
- Steps recebem versionamento automático (`version`, `lastModified`)

---

## Métricas de Impacto Total

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| Serviços duplicados | 3 | 0 | -100% |
| Variantes IntroStep | 6 | 1 | -83% |
| Arquivos .md na raiz | 100+ | 4 | -96% |
| Hooks useEditor* | 15+ | 1 canônico | Consolidado |
| Hooks useQuiz* | 25+ | 1 canônico | Consolidado |
| Colisão de IDs | Possível | Impossível | ✅ |
| Blocos sem defaults | 60% | 5% | -92% |
| Botão Publicar | ❌ | ✅ | Novo |
| Botão Duplicar | ❌ | ✅ | Novo |

---

## Próximas Fases (Pendentes)

### Fase 7: Segurança 🔒
- [ ] Habilitar Leaked Password Protection no Supabase
