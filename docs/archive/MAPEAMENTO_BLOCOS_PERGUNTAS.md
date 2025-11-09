# ✅ MAPEAMENTO DE BLOCOS - ETAPAS COM PERGUNTAS (02-18)

## 📊 Tipos de Blocos Usados

### **Steps 02-18** (Perguntas e Perguntas Estratégicas)

| Tipo no JSON | Componente Usado | Arquivo | Status |
|--------------|------------------|---------|--------|
| `question-progress` | `QuestionProgressBlock` | `atomic/QuestionProgressBlock.tsx` | ✅ Atômico |
| `question-title` | `QuestionTextBlock` | `atomic/QuestionTextBlock.tsx` | ✅ Atômico |
| `question-hero` | `QuizQuestionHeaderBlock` | `renderers/blocks/QuizQuestionHeaderBlock.tsx` | ⚠️ Não-atômico |
| `options-grid` | `OptionsGridAtomic` | `atomic/OptionsGridBlock.tsx` | ✅ Atômico |
| `question-navigation` | `QuestionNavigationBlock` | `atomic/QuestionNavigationBlock.tsx` | ✅ Atômico |

---

## 🔄 Mapeamento Detalhado no BlockTypeRenderer

### 1. **question-progress**
```tsx
case 'question-progress':
    return <QuestionProgressBlock block={block} {...rest} />;
```
- ✅ **Componente**: `QuestionProgressBlock` (atômico)
- ✅ **Import**: `import QuestionProgressBlock from '@/components/editor/blocks/atomic/QuestionProgressBlock'`
- ✅ **Usado em**: Steps 02-18 (todas as perguntas)

### 2. **question-title**
```tsx
case 'question-title':
    return <QuestionTextBlock block={block} {...rest} />;
```
- ✅ **Componente**: `QuestionTextBlock` (atômico)
- ✅ **Import**: `import QuestionTextBlock from '@/components/editor/blocks/atomic/QuestionTextBlock'`
- ✅ **Usado em**: Steps 02-18 (todas as perguntas)

### 3. **question-hero**
```tsx
case 'question-hero':
    return <QuizQuestionHeaderBlock block={block} {...rest} />;
```
- ⚠️ **Componente**: `QuizQuestionHeaderBlock` (NÃO é atômico)
- ⚠️ **Import**: `import QuizQuestionHeaderBlock from './blocks/QuizQuestionHeaderBlock'`
- ⚠️ **Usado em**: Steps 05-18 (perguntas com hero)
- ⚠️ **Observação**: Este componente está em `renderers/blocks/` e NÃO é atômico

### 4. **options-grid**
```tsx
case 'quiz-options':
case 'options-grid':
    return <OptionsGridAtomic block={block} {...rest} contextData={rest.contextData} />;
```
- ✅ **Componente**: `OptionsGridAtomic` (atômico)
- ✅ **Import**: `import OptionsGridAtomic from '@/components/editor/blocks/atomic/OptionsGridBlock'`
- ✅ **Usado em**: Steps 02-18 (todas as perguntas)
- ✅ **Recebe**: `contextData` para estado de seleção

### 5. **question-navigation**
```tsx
case 'question-navigation':
case 'quiz-navigation':
case 'navigation':
    return <QuestionNavigationBlock block={block} {...rest} contextData={rest.contextData} />;
```
- ✅ **Componente**: `QuestionNavigationBlock` (atômico)
- ✅ **Import**: `import QuestionNavigationBlock from '@/components/editor/blocks/atomic/QuestionNavigationBlock'`
- ✅ **Usado em**: Steps 02-18 (todas as perguntas)
- ✅ **Recebe**: `contextData` para navegação

---

## 📦 Imports Necessários (Atuais)

```tsx
// ✅ IMPORTS CORRETOS NO BlockTypeRenderer.tsx
import QuestionProgressBlock from '@/components/editor/blocks/atomic/QuestionProgressBlock';
import QuestionTextBlock from '@/components/editor/blocks/atomic/QuestionTextBlock';
import QuestionNavigationBlock from '@/components/editor/blocks/atomic/QuestionNavigationBlock';
import OptionsGridAtomic from '@/components/editor/blocks/atomic/OptionsGridBlock';

// ⚠️ NÃO-ATÔMICO (usado para question-hero)
import QuizQuestionHeaderBlock from './blocks/QuizQuestionHeaderBlock';

// ❌ NÃO USADOS em perguntas (apenas em outros contextos)
import CTAButtonAtomic from '@/components/editor/blocks/atomic/CTAButtonBlock'; // Usado em transições/ofertas
```

---

## 🎯 Resumo de Uso

### **Componentes Atômicos Usados (4/5)**
✅ `QuestionProgressBlock` - Barra de progresso  
✅ `QuestionTextBlock` - Título da pergunta  
✅ `OptionsGridAtomic` - Grade de opções com imagens  
✅ `QuestionNavigationBlock` - Botões de navegação  

### **Componentes Não-Atômicos (1/5)**
⚠️ `QuizQuestionHeaderBlock` - Header composto (question-hero)

---

## ⚠️ Observações Importantes

### **1. CTAButtonAtomic NÃO é usado em perguntas**
```tsx
// ❌ FALSO: CTAButtonAtomic não aparece nos JSONs de perguntas
// Steps 02-18 usam 'question-navigation', não 'CTAButton'
```

### **2. QuizQuestionHeaderBlock não é atômico**
```tsx
// ⚠️ Este componente precisa ser migrado para atomic/
// Caminho atual: src/components/editor/quiz/renderers/blocks/QuizQuestionHeaderBlock.tsx
// Caminho ideal: src/components/editor/blocks/atomic/QuestionHeroBlock.tsx
```

### **3. Aliases funcionam**
```tsx
// Todos esses tipos mapeiam para o mesmo componente:
'options-grid' → OptionsGridAtomic
'quiz-options' → OptionsGridAtomic

'question-navigation' → QuestionNavigationBlock  
'quiz-navigation' → QuestionNavigationBlock
'navigation' → QuestionNavigationBlock
```

---

## ✅ Validação

Rodando no terminal:
```bash
# Ver tipos usados em perguntas
for i in {02..18}; do 
  echo "Step $i:" && cat public/templates/blocks/step-$i.json | jq -r '.blocks[].type' | sort -u
done
```

**Resultado esperado (consistente em todos os steps):**
```
question-hero        ← ⚠️ Aparece em 05-18 (não-atômico)
question-navigation  ← ✅ Atômico
question-progress    ← ✅ Atômico
question-title       ← ✅ Atômico
options-grid         ← ✅ Atômico
```

---

## 🔧 Recomendação

**Para 100% de blocos atômicos, migrar:**
```
src/components/editor/quiz/renderers/blocks/QuizQuestionHeaderBlock.tsx
→
src/components/editor/blocks/atomic/QuestionHeroBlock.tsx
```

**E atualizar BlockTypeRenderer:**
```tsx
case 'question-hero':
    return <QuestionHeroBlock block={block} {...rest} />;
```

---

**Última atualização:** 2025-01-29  
**Status:** ✅ 4/5 blocos são atômicos (80%)  
**Pendente:** Migrar QuizQuestionHeaderBlock para atomic
