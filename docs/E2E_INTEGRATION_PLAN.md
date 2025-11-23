# 🔄 Plano de Integração E2E - JSON v4

**Data:** 23 de Novembro de 2025  
**Status:** Em Execução

---

## 📋 CHECKLIST DE INTEGRAÇÃO

### 1️⃣ BACKEND / SERVIÇOS (30 min)

- [ ] **TemplateService** - Carregar quiz21-v4.json
  - `src/services/canonical/TemplateService.ts`
  - Adicionar método `loadV4Template()`
  - Validar com QuizSchemaZ
  
- [ ] **TemplateLoader** - Suporte a v4
  - `src/services/editor/TemplateLoader.ts`
  - Detectar versão do template
  - Converter v3 → v4 se necessário

- [ ] **TemplateCache** - Cache de v4
  - `src/services/TemplateCache.ts`
  - Cachear estrutura v4
  - Invalidação por versão

### 2️⃣ HOOKS / ESTADO (45 min)

- [ ] **useTemplateLoader** - Carregar v4
  - `src/hooks/useTemplateLoader.ts`
  - `loadQuizEstiloTemplate()` usa v4
  - Validação Zod antes de retornar

- [ ] **useQuizState** - Logic Engine integration
  - `src/contexts/quiz/QuizStateProvider.tsx`
  - Adicionar Logic Engine instance
  - `evaluateNavigation()` method
  - `shouldShowResult()` method

- [ ] **useTemplateConfig** - Configurações v4
  - `src/hooks/useTemplateConfig.ts`
  - Carregar de `settings` do v4
  - Extrair scoring rules

- [ ] **useMasterRuntime** - Runtime v4
  - `src/hooks/useMasterRuntime.ts`
  - Ler de quiz21-v4.json
  - Expor `blockLibrary`

### 3️⃣ EDITOR VISUAL (60 min)

- [ ] **EditorProvider** - Context v4
  - `src/contexts/providers/EditorProvider.tsx`
  - Validar blocks com QuizBlockZ
  - Suporte a block metadata

- [ ] **QuizModularEditor** - Editor principal
  - `src/components/editor/quiz/QuizModularEditor/QuizModularEditor.tsx`
  - Carregar quiz21-v4.json
  - Usar builders para criar blocks

- [ ] **BlockRenderer** - Renderizar blocks v4
  - `src/components/editor/blocks/BlockRenderer.tsx`
  - Suporte a todos os block types
  - Validar properties antes de renderizar

- [ ] **PropertiesPanel** - Edição de propriedades
  - `src/components/editor/panels/PropertiesPanel.tsx`
  - Validar com Zod antes de salvar
  - Mostrar erros de validação

### 4️⃣ QUIZ RUNTIME (30 min)

- [ ] **QuizApp** - Runtime principal
  - `src/components/quiz/QuizApp.tsx`
  - Carregar v4 template
  - Usar Logic Engine para navegação

- [ ] **QuizStateProvider** - Estado do quiz
  - Integrar Logic Engine
  - Conditional navigation
  - Result logic

- [ ] **QuizNavigation** - Navegação
  - Usar `logicEngine.getNextStep()`
  - Suporte a conditions
  - Skip logic

### 5️⃣ PAINEL DE PROPRIEDADES (45 min)

- [ ] **BlockPropertiesEditor**
  - Validação Zod em tempo real
  - Autocomplete de properties
  - Error messages

- [ ] **PropertyInput components**
  - TextProperty com validação
  - NumberProperty com min/max
  - ColorProperty com regex
  - SelectProperty com enum

- [ ] **ValidationFeedback**
  - Mostrar erros do Zod
  - Highlight de campos inválidos
  - Mensagens amigáveis

### 6️⃣ TESTES E2E (30 min)

- [ ] **Editor E2E**
  - Carregar quiz21-v4.json
  - Editar block properties
  - Salvar alterações
  - Validar persistência

- [ ] **Quiz E2E**
  - Carregar template v4
  - Responder perguntas
  - Testar jump logic
  - Verificar resultado

- [ ] **Validação E2E**
  - Schema validation em todos pontos
  - Error handling
  - Fallback para v3

---

## 🎯 PRIORIDADE DE EXECUÇÃO

### FASE A - CORE (URGENTE)
1. TemplateService + TemplateLoader
2. useTemplateLoader
3. QuizApp

### FASE B - EDITOR (IMPORTANTE)
4. EditorProvider
5. QuizModularEditor
6. PropertiesPanel

### FASE C - MELHORIAS (DESEJÁVEL)
7. Logic Engine integration
8. Builders usage
9. E2E tests

---

## 📊 IMPACTO ESPERADO

### Antes da Integração
- ❌ v4 criado mas não usado
- ❌ Logic Engine isolado
- ❌ Builders sem uso
- ❌ Sem validação Zod no frontend

### Depois da Integração
- ✅ v4 usado em toda aplicação
- ✅ Logic Engine controlando navegação
- ✅ Builders criando blocks
- ✅ Validação Zod em tempo real
- ✅ E2E funcionando

---

## 🚀 COMEÇAR IMPLEMENTAÇÃO

**Ordem de execução:**

1. TemplateService.loadV4Template()
2. useTemplateLoader validation
3. QuizApp integration
4. EditorProvider validation
5. PropertiesPanel Zod
6. Logic Engine navigation
7. E2E tests
