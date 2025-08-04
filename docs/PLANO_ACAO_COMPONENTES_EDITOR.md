# 🎯 PLANO DE AÇÃO: PREENCHIMENTO COMPLETO DO EDITOR COM COMPONENTES

## 📊 **STATUS ATUAL DO PROJETO**

### **✅ O QUE JÁ TEMOS**

- `blockDefinitions.ts` com ~150 componentes definidos
- `UniversalBlockRenderer.tsx` com sistema de switch
- `ComponentsList.tsx` para painel lateral
- `PropertyPanel.tsx` para edição de propriedades
- Integração com Supabase configurada
- Sistema de 21 etapas do funil definido

### **❌ O QUE FALTA**

- Componentes React físicos (arquivos .tsx)
- Testes de funcionamento no editor
- Validações e tratamento de erros

## 🚀 **FASE 1: COMPONENTES CRÍTICOS DO QUIZ (PRIORIDADE MÁXIMA)**

### **1.1 Quiz Question Interactive**

**Arquivo:** `src/components/editor/blocks/QuizQuestionInteractiveBlock.tsx`

```typescript
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';

const QuizQuestionInteractiveBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected,
  onClick,
  onPropertyChange
}) => {
  const {
    question = 'Qual dessas opções representa melhor seu estilo?',
    questionNumber = 1,
    totalQuestions = 10,
    layout = 'grid-2',
    allowMultiple = false,
    showImages = true,
    autoAdvance = true,
    showProgress = true,
    options = [
      { id: 'opt1', text: 'Opção 1', image: 'https://via.placeholder.com/300x200', value: 'option1' },
      { id: 'opt2', text: 'Opção 2', image: 'https://via.placeholder.com/300x200', value: 'option2' }
    ]
  } = block.properties;

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const progress = (questionNumber / totalQuestions) * 100;

  const handleOptionClick = (optionId: string) => {
    if (allowMultiple) {
      setSelectedOptions(prev =>
        prev.includes(optionId)
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  return (
    <div
      className={cn(
        'quiz-question-interactive-block p-6 rounded-lg border-2 transition-all',
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200',
        'hover:border-gray-300 cursor-pointer'
      )}
      onClick={onClick}
    >
      {/* PROGRESS BAR */}
      {showProgress && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Questão {questionNumber} de {totalQuestions}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* QUESTION */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{question}</h2>
        {allowMultiple && (
          <p className="text-sm text-gray-600">Você pode selecionar múltiplas opções</p>
        )}
      </div>

      {/* OPTIONS GRID */}
      <div className={cn(
        'grid gap-4 mb-6',
        layout === 'grid-2' && 'grid-cols-1 md:grid-cols-2',
        layout === 'grid-3' && 'grid-cols-1 md:grid-cols-3',
        layout === 'grid-4' && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        layout === 'list' && 'grid-cols-1',
        layout === 'horizontal' && 'grid-cols-1 md:grid-cols-4'
      )}>
        {options.map((option: any) => (
          <div
            key={option.id}
            className={cn(
              'option-card p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md',
              selectedOptions.includes(option.id)
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            )}
            onClick={() => handleOptionClick(option.id)}
          >
            {showImages && option.image && (
              <img
                src={option.image}
                alt={option.text}
                className="w-full h-32 object-cover rounded mb-3"
              />
            )}
            <p className="text-gray-700 font-medium text-center">{option.text}</p>
            {selectedOptions.includes(option.id) && (
              <div className="mt-2 flex justify-center">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CONTINUE BUTTON */}
      <button
        className={cn(
          'w-full py-3 px-6 rounded-lg font-semibold transition-all',
          selectedOptions.length > 0
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        )}
        disabled={selectedOptions.length === 0}
      >
        {autoAdvance ? 'Continuar' : 'Próxima Questão'}
      </button>

      {/* EDITOR OVERLAY */}
      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
          Editando: Questão Interativa
        </div>
      )}
    </div>
  );
};

export default QuizQuestionInteractiveBlock;
```

### **1.2 Quiz Result Calculated**

**Arquivo:** `src/components/editor/blocks/QuizResultCalculatedBlock.tsx`

```typescript
import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';

const QuizResultCalculatedBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected,
  onClick,
  onPropertyChange
}) => {
  const {
    showPercentages = true,
    showSecondaryStyles = true,
    maxSecondaryStyles = 2
  } = block.properties;

  // SIMULAÇÃO de resultado calculado
  const mainResult = {
    style: 'Elegante',
    percentage: 85,
    description: 'Você tem um estilo sofisticado e atemporal',
    image: 'https://via.placeholder.com/400x300'
  };

  const secondaryResults = [
    { style: 'Moderno', percentage: 20 },
    { style: 'Casual', percentage: 15 }
  ].slice(0, maxSecondaryStyles);

  return (
    <div
      className={cn(
        'quiz-result-calculated-block p-8 rounded-lg border-2 transition-all',
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200',
        'hover:border-gray-300 cursor-pointer bg-gradient-to-br from-blue-50 to-purple-50'
      )}
      onClick={onClick}
    >
      {/* MAIN RESULT */}
      <div className="text-center mb-8">
        <div className="mb-4">
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            Resultado Calculado
          </span>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Seu Estilo é <span className="text-blue-600">{mainResult.style}</span>
        </h1>

        {showPercentages && (
          <div className="text-6xl font-bold text-blue-600 mb-4">
            {mainResult.percentage}%
          </div>
        )}

        <p className="text-xl text-gray-600 mb-6">{mainResult.description}</p>

        <img
          src={mainResult.image}
          alt={`Estilo ${mainResult.style}`}
          className="w-full max-w-md mx-auto rounded-lg shadow-lg"
        />
      </div>

      {/* SECONDARY STYLES */}
      {showSecondaryStyles && secondaryResults.length > 0 && (
        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Seus Estilos Secundários
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {secondaryResults.map((result, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">{result.style}</span>
                  {showPercentages && (
                    <span className="text-blue-600 font-bold">{result.percentage}%</span>
                  )}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${result.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EDITOR OVERLAY */}
      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
          Editando: Resultado Calculado
        </div>
      )}
    </div>
  );
};

export default QuizResultCalculatedBlock;
```

### **1.3 Progress Bar Modern**

**Arquivo:** `src/components/editor/blocks/ProgressBarModernBlock.tsx`

```typescript
import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';

const ProgressBarModernBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected,
  onClick,
  onPropertyChange
}) => {
  const {
    percentage = 65,
    showLabel = true,
    label = 'Progresso do Quiz',
    showPercentage = true,
    color = '#3b82f6',
    backgroundColor = '#e5e7eb',
    height = 'md',
    animated = true,
    style = 'modern'
  } = block.properties;

  const heightClasses = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6'
  };

  return (
    <div
      className={cn(
        'progress-bar-modern-block p-6 rounded-lg border-2 transition-all',
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200',
        'hover:border-gray-300 cursor-pointer'
      )}
      onClick={onClick}
    >
      {/* LABEL */}
      {showLabel && (
        <div className="flex justify-between items-center mb-3">
          <span className="text-lg font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-lg font-bold" style={{ color }}>{percentage}%</span>
          )}
        </div>
      )}

      {/* PROGRESS BAR */}
      <div className="relative">
        <div
          className={cn(
            'w-full rounded-full overflow-hidden',
            heightClasses[height as keyof typeof heightClasses],
            style === 'modern' && 'shadow-inner'
          )}
          style={{ backgroundColor }}
        >
          <div
            className={cn(
              'h-full rounded-full transition-all duration-1000 ease-out',
              animated && 'animate-pulse',
              style === 'modern' && 'shadow-sm'
            )}
            style={{
              width: `${percentage}%`,
              backgroundColor: color,
              background: style === 'modern'
                ? `linear-gradient(90deg, ${color}, ${color}dd, ${color})`
                : color
            }}
          />
        </div>

        {/* PROGRESS STEPS */}
        {style === 'stepped' && (
          <div className="absolute top-0 left-0 w-full h-full flex">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className="flex-1 border-r border-white last:border-r-0"
              />
            ))}
          </div>
        )}
      </div>

      {/* MILESTONE MARKERS */}
      {style === 'milestone' && (
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Início</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>Completo</span>
        </div>
      )}

      {/* EDITOR OVERLAY */}
      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
          Editando: Barra de Progresso
        </div>
      )}
    </div>
  );
};

export default ProgressBarModernBlock;
```

## 🏗️ **FASE 2: COMPONENTES DE CONTEÚDO BÁSICO**

### **2.1 Heading Block**

**Arquivo:** `src/components/editor/blocks/HeadingBlock.tsx`

```typescript
import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';

const HeadingBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected,
  onClick,
  onPropertyChange
}) => {
  const {
    content = 'Seu Título Aqui',
    level = 'h1'
  } = block.properties;

  const HeadingTag = level as keyof JSX.IntrinsicElements;

  const headingClasses = {
    h1: 'text-4xl font-bold',
    h2: 'text-3xl font-semibold',
    h3: 'text-2xl font-semibold',
    h4: 'text-xl font-medium'
  };

  return (
    <div
      className={cn(
        'heading-block p-4 rounded border-2 transition-all',
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent',
        'hover:border-gray-200 cursor-pointer'
      )}
      onClick={onClick}
    >
      <HeadingTag className={cn(
        headingClasses[level as keyof typeof headingClasses],
        'text-gray-800'
      )}>
        {content}
      </HeadingTag>

      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
          Editando: {level.toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default HeadingBlock;
```

### **2.2 Text Block**

**Arquivo:** `src/components/editor/blocks/TextBlock.tsx`

```typescript
import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';

const TextBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected,
  onClick,
  onPropertyChange
}) => {
  const {
    content = 'Parágrafo de texto editável.'
  } = block.properties;

  return (
    <div
      className={cn(
        'text-block p-4 rounded border-2 transition-all',
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent',
        'hover:border-gray-200 cursor-pointer'
      )}
      onClick={onClick}
    >
      <p className="text-gray-700 leading-relaxed">
        {content}
      </p>

      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
          Editando: Texto
        </div>
      )}
    </div>
  );
};

export default TextBlock;
```

### **2.3 Button Block**

**Arquivo:** `src/components/editor/blocks/ButtonBlock.tsx`

```typescript
import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';

const ButtonBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected,
  onClick,
  onPropertyChange
}) => {
  const {
    text = 'Clique Aqui',
    url = '#'
  } = block.properties;

  return (
    <div
      className={cn(
        'button-block p-4 rounded border-2 transition-all',
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent',
        'hover:border-gray-200 cursor-pointer'
      )}
      onClick={onClick}
    >
      <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
        {text}
      </button>

      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
          Editando: Botão
        </div>
      )}
    </div>
  );
};

export default ButtonBlock;
```

## 🔗 **FASE 3: MAPEAMENTO NO UNIVERSALBLOCKRENDERER**

**Arquivo:** `src/components/editor/blocks/UniversalBlockRenderer.tsx`

```typescript
// ADICIONAR estes cases no switch:

case 'quiz-question-interactive':
  return <QuizQuestionInteractiveBlock {...props} />;

case 'quiz-result-calculated':
  return <QuizResultCalculatedBlock {...props} />;

case 'progress-bar-modern':
  return <ProgressBarModernBlock {...props} />;

case 'heading':
  return <HeadingBlock {...props} />;

case 'text':
  return <TextBlock {...props} />;

case 'button':
  return <ButtonBlock {...props} />;
```

## ✅ **FASE 4: CRONOGRAMA DE IMPLEMENTAÇÃO**

### **SEMANA 1: Componentes Críticos**

- [ ] QuizQuestionInteractiveBlock
- [ ] QuizResultCalculatedBlock
- [ ] ProgressBarModernBlock
- [ ] Testes no editor
- [ ] Mapeamento no UniversalBlockRenderer

### **SEMANA 2: Componentes Básicos**

- [ ] HeadingBlock
- [ ] TextBlock
- [ ] ButtonBlock
- [ ] ImageBlock
- [ ] Testes e validações

### **SEMANA 3: Componentes Inline**

- [ ] TextInlineBlock
- [ ] ButtonInlineBlock
- [ ] BadgeInlineBlock
- [ ] StatInlineBlock
- [ ] ProgressInlineBlock

### **SEMANA 4: Componentes Avançados**

- [ ] PricingCardBlock
- [ ] TestimonialCardBlock
- [ ] CountdownTimerBlock
- [ ] SocialProofBlock
- [ ] Testes finais

## 🧪 **CHECKLIST DE VALIDAÇÃO**

Para cada componente implementado:

### **✅ Definição**

- [ ] Existe no `blockDefinitions.ts`
- [ ] `propertiesSchema` está completo
- [ ] `defaultProperties` são válidas

### **✅ Componente React**

- [ ] Arquivo `.tsx` criado
- [ ] Recebe `BlockComponentProps`
- [ ] Extrai propriedades corretamente
- [ ] Implementa visual de seleção
- [ ] Tem overlay de edição

### **✅ Integração**

- [ ] Mapeado no `UniversalBlockRenderer`
- [ ] Aparece no `ComponentsList`
- [ ] Pode ser adicionado ao canvas
- [ ] Propriedades aparecem no painel

### **✅ Funcionamento**

- [ ] Pode ser selecionado
- [ ] Propriedades são editáveis
- [ ] Mudanças aplicadas em tempo real
- [ ] Auto-save funciona

---

**ESTE PLANO** garante que **todos os componentes** funcionem corretamente no `/editor` seguindo a mecânica exata documentada! 🚀
