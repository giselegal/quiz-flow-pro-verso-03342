# Exemplos de Código - Quiz v4.1-saas

## 🎯 Guia Rápido de Implementação

Este documento mostra **exatamente** como usar o novo formato em seus componentes React/TypeScript.

---

## 1. Renderizar Options (OptionsGrid)

### Código Completo

```typescript
import React, { useState } from 'react';
import { normalizeOption, resolveAssetUrl, type SaaSOption } from '@/lib/quiz-v4-saas-adapter';

interface OptionsGridProps {
  block: {
    properties: {
      columns: number;
      gap: number;
    };
    content: {
      options: Array<any>; // Aceita formato antigo OU novo
    };
  };
  onSelectionChange: (selectedIds: string[]) => void;
  maxSelections?: number;
}

export function OptionsGrid({ block, onSelectionChange, maxSelections = 3 }: OptionsGridProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 1️⃣ Normalizar options (garante formato consistente)
  const options = block.content.options.map(normalizeOption);

  // 2️⃣ Handler de seleção
  const handleSelect = (option: SaaSOption) => {
    let newSelection: string[];

    if (selectedIds.includes(option.id)) {
      // Desselecionar
      newSelection = selectedIds.filter((id) => id !== option.id);
    } else {
      // Selecionar (respeitando limite)
      if (selectedIds.length >= maxSelections) {
        return; // Limite atingido
      }
      newSelection = [...selectedIds, option.id];
    }

    setSelectedIds(newSelection);
    onSelectionChange(newSelection);
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${block.properties.columns}, 1fr)`,
        gap: `${block.properties.gap}px`,
      }}
    >
      {options.map((option) => {
        const isSelected = selectedIds.includes(option.id);
        const imageUrl = resolveAssetUrl(option.imageUrl);

        return (
          <button
            key={option.id}
            onClick={() => handleSelect(option)}
            className={`option-card ${isSelected ? 'selected' : ''}`}
            aria-pressed={isSelected}
          >
            {imageUrl && (
              <img 
                src={imageUrl} 
                alt={option.label} 
                className="option-image"
                loading="lazy"
              />
            )}
            
            <span className="option-label">{option.label}</span>

            {isSelected && (
              <svg className="check-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}
```

### CSS (Tailwind)

```css
.option-card {
  @apply relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 
         border-gray-200 bg-white transition-all duration-200 cursor-pointer
         hover:border-primary hover:shadow-md;
}

.option-card.selected {
  @apply border-primary bg-primary-50 shadow-lg;
}

.option-image {
  @apply w-full h-40 object-cover rounded-md;
}

.option-label {
  @apply text-sm text-center font-medium text-gray-700;
}

.check-icon {
  @apply absolute top-2 right-2 w-6 h-6 text-primary;
}
```

---

## 2. Renderizar Rich-Text

### Componente RichText

```typescript
import React from 'react';
import { renderRichText, type TextContent } from '@/lib/quiz-v4-saas-adapter';

interface RichTextProps {
  content: TextContent;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  highlightClassName?: string;
}

export function RichText({
  content,
  as: Component = 'p',
  className = '',
  highlightClassName = 'font-semibold text-primary',
}: RichTextProps) {
  const blocks = renderRichText(content, highlightClassName);
  
  return (
    <Component className={className}>
      {blocks.map((block) => (
        <span key={block.key} className={block.className}>
          {block.value}
        </span>
      ))}
    </Component>
  );
}
```

### Uso no IntroTitle

```typescript
function IntroTitle({ block }) {
  return (
    <div className="text-center py-8">
      <RichText
        content={block.content.title}
        as="h1"
        className="text-3xl font-bold leading-tight"
        highlightClassName="text-primary-600 font-extrabold"
      />
    </div>
  );
}
```

### Resultado Visual

**Input JSON**:
```json
{
  "type": "rich-text",
  "blocks": [
    { "type": "highlight", "value": "Chega" },
    { "type": "text", "value": " de um guarda-roupa lotado e da sensação de que " },
    { "type": "highlight", "value": "nada combina com você" },
    { "type": "text", "value": "." }
  ]
}
```

**Output HTML**:
```html
<h1 class="text-3xl font-bold leading-tight">
  <span class="text-primary-600 font-extrabold">Chega</span>
  <span> de um guarda-roupa lotado e da sensação de que </span>
  <span class="text-primary-600 font-extrabold">nada combina com você</span>
  <span>.</span>
</h1>
```

---

## 3. Calcular Scoring

### Hook useQuizScoring

```typescript
import { useState, useCallback } from 'react';
import { calculateScoring, normalizeOption, type SaaSOption } from '@/lib/quiz-v4-saas-adapter';
import type { QuizTemplateV4 } from '@/types/quiz-v4';

export function useQuizScoring(quiz: QuizTemplateV4) {
  const [selections, setSelections] = useState<Record<string, string[]>>({});

  // Adicionar seleção de um step
  const addSelection = useCallback((stepId: string, optionIds: string[]) => {
    setSelections((prev) => ({
      ...prev,
      [stepId]: optionIds,
    }));
  }, []);

  // Calcular resultado final
  const calculateResult = useCallback(() => {
    // 1. Coletar todas as opções selecionadas
    const allSelectedOptions: SaaSOption[] = [];

    Object.entries(selections).forEach(([stepId, optionIds]) => {
      const step = quiz.steps.find((s) => s.id === stepId);
      if (!step) return;

      const optionsBlock = step.blocks.find((b) => b.type === 'options-grid');
      if (!optionsBlock?.content?.options) return;

      optionIds.forEach((optionId) => {
        const option = optionsBlock.content.options.find((o: any) => o.id === optionId);
        if (option) {
          allSelectedOptions.push(normalizeOption(option));
        }
      });
    });

    // 2. Calcular pontuação
    const scores = calculateScoring(
      allSelectedOptions,
      quiz.settings.scoring.categories
    );

    // 3. Retornar predominante + todos os scores
    return {
      predominant: scores[0]?.category || 'Natural',
      scores,
      totalSelections: allSelectedOptions.length,
    };
  }, [selections, quiz]);

  return {
    selections,
    addSelection,
    calculateResult,
  };
}
```

### Uso no Quiz

```typescript
function Quiz({ template }: { template: QuizTemplateV4 }) {
  const { selections, addSelection, calculateResult } = useQuizScoring(template);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [result, setResult] = useState<any>(null);

  const currentStep = template.steps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < template.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Última pergunta → calcular resultado
      const finalResult = calculateResult();
      setResult(finalResult);
    }
  };

  if (result) {
    return (
      <ResultScreen
        predominant={result.predominant}
        scores={result.scores}
      />
    );
  }

  return (
    <div>
      <QuizStep
        step={currentStep}
        onSelectionChange={(optionIds) => addSelection(currentStep.id, optionIds)}
      />
      <button onClick={handleNext}>Próxima</button>
    </div>
  );
}
```

---

## 4. Validar Step com Defaults

### Hook useStepValidation

```typescript
import { useMemo } from 'react';
import { resolveValidation, type ValidationRules } from '@/lib/quiz-v4-saas-adapter';
import type { QuizTemplateV4, QuizStep } from '@/types/quiz-v4';

export function useStepValidation(
  step: QuizStep,
  quiz: QuizTemplateV4
) {
  const rules = useMemo(() => {
    return resolveValidation(
      step.validation,
      step.type,
      quiz.settings.validation?.defaults || {}
    );
  }, [step, quiz]);

  const validate = (selectedIds: string[]) => {
    const { minSelections = 1, maxSelections = 999, errorMessage } = rules;

    if (selectedIds.length < minSelections) {
      return {
        valid: false,
        error: errorMessage || `Selecione ao menos ${minSelections} opções`,
      };
    }

    if (selectedIds.length > maxSelections) {
      return {
        valid: false,
        error: errorMessage || `Selecione no máximo ${maxSelections} opções`,
      };
    }

    return { valid: true, error: null };
  };

  return {
    rules,
    validate,
    canProceed: (selectedIds: string[]) => validate(selectedIds).valid,
  };
}
```

### Uso no QuizStep

```typescript
function QuizStep({ step, quiz, onNext }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { rules, validate, canProceed } = useStepValidation(step, quiz);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    const validation = validate(selectedIds);
    
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setError(null);
    onNext(selectedIds);
  };

  return (
    <div>
      {/* Options */}
      <OptionsGrid
        block={step.blocks.find((b) => b.type === 'options-grid')}
        onSelectionChange={setSelectedIds}
        maxSelections={rules.maxSelections}
      />

      {/* Erro de validação */}
      {error && <div className="error-message">{error}</div>}

      {/* Contador */}
      <div className="selection-counter">
        {selectedIds.length} / {rules.maxSelections}
      </div>

      {/* Botão Next */}
      <button
        onClick={handleNext}
        disabled={!canProceed(selectedIds)}
        className={canProceed(selectedIds) ? 'btn-primary' : 'btn-disabled'}
      >
        Continuar
      </button>
    </div>
  );
}
```

---

## 5. Resolver Asset URLs

### Configuração (env)

```env
# .env.local
NEXT_PUBLIC_ASSET_CDN=https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329
```

### Adapter Customizado

```typescript
// src/lib/config.ts
export const ASSET_CDN = process.env.NEXT_PUBLIC_ASSET_CDN || '';

// src/lib/quiz-v4-saas-adapter.ts (ajustar função)
export function resolveAssetUrl(url: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('http')) return url; // Já é absoluta

  // Mapear /quiz-assets/ → CDN
  if (url.startsWith('/quiz-assets/')) {
    const filename = url.replace('/quiz-assets/', '');
    return `${ASSET_CDN}/${filename}`;
  }

  return url;
}
```

### Uso Universal

```typescript
// Sempre usar o resolver
const imageUrl = resolveAssetUrl(option.imageUrl);

<img src={imageUrl} alt={option.label} />
```

**Benefícios**:
- ✅ Trocar CDN = 1 env var
- ✅ Funciona em dev/staging/prod
- ✅ Cache-busting via version no CDN

---

## 6. Adapter - Uso Geral

### Hook All-in-One

```typescript
import { useQuizV4Adapter } from '@/lib/quiz-v4-saas-adapter';

function MyQuizComponent({ template }) {
  const adapter = useQuizV4Adapter(template);

  // Normalizar opções
  const options = block.content.options.map(adapter.normalizeOption);

  // Renderizar rich-text
  const titleElement = (
    <h1>{adapter.renderRichText(block.content.title)}</h1>
  );

  // Resolver validação
  const rules = adapter.resolveValidation(step.validation, step.type);

  // Calcular scoring
  const scores = adapter.calculateScoring(selectedOptions);

  // Resolver asset
  const imageUrl = adapter.resolveAssetUrl(option.imageUrl);

  return (
    // ... seu componente
  );
}
```

---

## 7. Testes (Jest/Vitest)

### Testar normalizeOption

```typescript
import { normalizeOption } from '@/lib/quiz-v4-saas-adapter';

describe('normalizeOption', () => {
  it('should normalize legacy format', () => {
    const legacy = {
      id: 'natural',
      text: 'Conforto...',
      image: 'https://cloudinary.com/image.webp',
    };

    const normalized = normalizeOption(legacy);

    expect(normalized).toEqual({
      id: 'natural',
      label: 'Conforto...',
      value: 'natural',
      imageUrl: 'https://cloudinary.com/image.webp',
      score: {
        category: 'Natural',
        points: 1,
      },
    });
  });

  it('should pass through new format', () => {
    const newFormat = {
      id: 'natural',
      label: 'Conforto...',
      value: 'natural',
      imageUrl: '/quiz-assets/image.webp',
      score: { category: 'Natural', points: 1 },
    };

    const normalized = normalizeOption(newFormat);

    expect(normalized).toEqual(newFormat);
  });
});
```

### Testar calculateScoring

```typescript
import { calculateScoring } from '@/lib/quiz-v4-saas-adapter';

describe('calculateScoring', () => {
  it('should calculate scores correctly', () => {
    const options = [
      { id: '1', label: 'A', value: '1', imageUrl: null, score: { category: 'Natural', points: 1 } },
      { id: '2', label: 'B', value: '2', imageUrl: null, score: { category: 'Natural', points: 1 } },
      { id: '3', label: 'C', value: '3', imageUrl: null, score: { category: 'Clássico', points: 1 } },
    ];

    const scores = calculateScoring(options, ['Natural', 'Clássico', 'Romântico']);

    expect(scores).toEqual([
      { category: 'Natural', points: 2, percentage: 66.67 },
      { category: 'Clássico', points: 1, percentage: 33.33 },
      { category: 'Romântico', points: 0, percentage: 0 },
    ]);
  });
});
```

---

## 📚 Resumo

### Fluxo Completo

1. **Carregar template**: `quiz21-v4-saas.json`
2. **Normalizar options**: `normalizeOption()`
3. **Renderizar rich-text**: `<RichText content={...} />`
4. **Validar seleções**: `resolveValidation()` + `canProceed()`
5. **Calcular resultado**: `calculateScoring()` → predominante
6. **Resolver assets**: `resolveAssetUrl()` → CDN

### Imports Essenciais

```typescript
import {
  normalizeOption,
  renderRichText,
  resolveValidation,
  calculateScoring,
  resolveAssetUrl,
  useQuizV4Adapter,
} from '@/lib/quiz-v4-saas-adapter';
```

---

**Pronto!** Agora você tem todos os exemplos práticos para implementar o novo formato. 🚀
