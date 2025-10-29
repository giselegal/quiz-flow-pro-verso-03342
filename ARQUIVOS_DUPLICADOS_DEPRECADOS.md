# 🔍 ARQUIVOS DUPLICADOS E DEPRECATED

## ❌ ARQUIVOS NÃO USADOS (DEPRECATED)

### 1. **layouts/CanvasArea.tsx** (106 linhas)
- **Caminho:** `src/components/editor/layouts/CanvasArea.tsx`
- **Status:** ❌ **NÃO USADO**
- **Imports:** 0 (nenhum arquivo importa este)
- **Motivo:** Versão antiga/simplificada, substituída por quiz/components/CanvasArea.tsx
- **Ação:** MOVER para `archived-deprecated/`

### 2. **unified/UnifiedStepRenderer.tsx** (517 linhas)
- **Caminho:** `src/components/editor/unified/UnifiedStepRenderer.tsx`
- **Status:** ⚠️ **VERIFICAR SE USADO**
- **Imports:** Não encontrado no grep
- **Motivo:** Pode ser versão antiga, substituída por quiz/components/UnifiedStepRenderer.tsx
- **Ação:** VERIFICAR imports e mover se não usado

---

## ✅ ARQUIVOS ATIVOS (USADOS)

### 1. **quiz/components/CanvasArea.tsx** (450 linhas)
- **Caminho:** `src/components/editor/quiz/components/CanvasArea.tsx`
- **Status:** ✅ **USADO pelo QuizModularProductionEditor**
- **Import:** `import CanvasArea from './components/CanvasArea';`
- **Função:** Canvas principal do editor com modos EDITAR/PREVIEW
- **Características:**
  - Modo EDITAR: Usa `UnifiedBlockRenderer` + `renderBlockPreview`
  - Modo PREVIEW: Usa `UnifiedStepRenderer` → componentes `Modular*`

### 2. **quiz/components/UnifiedStepRenderer.tsx** (54 linhas)
- **Caminho:** `src/components/editor/quiz/components/UnifiedStepRenderer.tsx`
- **Status:** ✅ **USADO pelo CanvasArea em modo PREVIEW**
- **Import:** `import { UnifiedStepRenderer } from './UnifiedStepRenderer';`
- **Função:** Wrapper que delega para:
  - `EditModeRenderer` (modo edit)
  - `PreviewModeRenderer` (modo preview)

### 3. **renderers/PreviewModeRenderer.tsx**
- **Caminho:** `src/components/editor/renderers/PreviewModeRenderer.tsx`
- **Status:** ✅ **USADO pelo UnifiedStepRenderer**
- **Função:** Renderiza preview usando `UnifiedStepContent`

### 4. **quiz/renderers/BlockTypeRenderer.tsx**
- **Caminho:** `src/components/editor/quiz/renderers/BlockTypeRenderer.tsx`
- **Status:** ✅ **USADO pelos componentes Modular***
- **Função:** Registry pattern para renderizar blocos atômicos
- **Suporta:** Todos os 24 tipos de blocos (intro, question, transition, result, offer)

---

## 🔄 FLUXO DE RENDERIZAÇÃO COMPLETO

### **MODO EDITAR (Canvas):**
```
QuizModularProductionEditor
  → CanvasArea (mode="edit")
    → UnifiedBlockRenderer
      → renderBlockPreview (inline, 1200+ linhas)
        → Renderiza blocos diretamente
```

### **MODO PREVIEW (Canvas):**
```
QuizModularProductionEditor
  → CanvasArea (mode="preview")
    → UnifiedStepRenderer
      → PreviewModeRenderer
        → UnifiedStepContent
          → ModularIntroStep (step 01)
          → ModularQuestionStep (steps 02-18)
          → ModularTransitionStep (steps 12, 19)
          → ModularResultStep (step 20)
          → ModularOfferStep (step 21)
            → BlockTypeRenderer
              → IntroImageBlock, QuestionProgressBlock, etc.
```

---

## 🎯 CORREÇÕES APLICADAS

### ✅ **renderBlockPreview** (QuizModularProductionEditor)
- Linha ~1827: Suporta `intro-image`
- Linhas 1870-2100: Suporta todos os 24 tipos de blocos
- **Status:** CORRIGIDO ✅

### ✅ **BlockTypeRenderer**
- Suporta `intro-image` via `IntroImageBlock`
- Suporta todos os tipos: intro, question, transition, result, offer
- **Status:** CORRIGIDO ✅

### ✅ **IntroImageBlock**
- Linha 14-17: Lê `content.width` corretamente
- Logs de debug adicionados
- **Status:** CORRIGIDO ✅

---

## 📝 RECOMENDAÇÕES

### IMEDIATO:
1. ✅ Testar imagem no modo PREVIEW (botão "PREVIEW" no canvas)
2. ⚠️ Verificar se imagem aparece no modo EDITAR também

### LIMPEZA:
1. Mover `layouts/CanvasArea.tsx` para `archived-deprecated/`
2. Verificar se `unified/UnifiedStepRenderer.tsx` é usado
3. Consolidar documentação dos fluxos de renderização

### OTIMIZAÇÃO (FUTURO):
1. Considerar unificar `renderBlockPreview` com `BlockTypeRenderer`
2. Eliminar duplicação de lógica de renderização
3. Criar testes para ambos os modos (EDITAR/PREVIEW)
