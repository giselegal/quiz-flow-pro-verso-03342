# 🎬 RENDERER STEP-01 - SISTEMA DE RENDERIZAÇÃO

## 📋 Resumo

O **IntroStep01Renderer** é o componente de renderização unificado para o Step-01 (Introdução) do quiz-estilo.

- ✅ **3 modos de renderização**: preview | production | editable
- ✅ **Validação automática** com schema Zod
- ✅ **Normalização de dados** com valores padrão
- ✅ **Adapter** para UnifiedStepRenderer
- ✅ **Type-safe** com TypeScript

---

## 🚀 Instalação e Import

```typescript
// Importar renderer
import { IntroStep01Renderer } from '@/components/editor/quiz-estilo/step-01';

// Importar adapter (para UnifiedStepRenderer)
import { IntroStep01RendererAdapter } from '@/components/editor/quiz-estilo/step-01';

// Importar types
import type { IntroStep01RendererProps, RenderMode } from '@/components/editor/quiz-estilo/step-01';
```

---

## 📦 Props Interface

```typescript
interface IntroStep01RendererProps {
    /** Dados do step (pode ser parcial) */
    data?: Partial<IntroStep01MainData>;
    
    /** Modo de renderização: preview | production | editable */
    mode?: RenderMode;
    
    /** Callback quando nome é submetido */
    onNameSubmit?: (name: string) => void;
    
    /** Callback quando campo é editado (modo editable) */
    onEdit?: (field: string, value: any) => void;
    
    /** Callback quando step avança */
    onNext?: () => void;
    
    /** Callback quando volta */
    onBack?: () => void;
    
    /** Estado do quiz (para modo production) */
    quizState?: {
        userName?: string;
        currentStep?: number;
        totalSteps?: number;
    };
    
    /** CSS classes adicionais */
    className?: string;
}
```

---

## 🎯 Modos de Renderização

### 1. **Mode: Production** (padrão)

Renderiza o step em modo de produção (quiz real, sem edição).

```typescript
<IntroStep01Renderer
    mode="production"
    data={{
        title: 'Bem-vindo ao Quiz',
        buttonText: 'Começar',
    }}
    onNameSubmit={(name) => {
        console.log('Nome:', name);
        // Salvar no banco e avançar
    }}
    onNext={() => {
        // Ir para step-02
        navigate('/quiz-estilo/step-02');
    }}
    quizState={{
        currentStep: 1,
        totalSteps: 21,
    }}
/>
```

**Características:**
- ❌ Não editável
- ✅ Formulário funcional
- ✅ Barra de progresso ativa
- ✅ Botão submit avança para próximo step

---

### 2. **Mode: Preview**

Renderiza o step em modo de visualização (sem interação).

```typescript
<IntroStep01Renderer
    mode="preview"
    data={{
        title: 'Preview do Título',
        backgroundColor: '#F0F0F0',
    }}
/>
```

**Características:**
- ❌ Não editável
- ❌ Formulário inativo (apenas visual)
- ✅ Mostra como ficará na produção
- ✅ Ideal para thumbnails e previews

---

### 3. **Mode: Editable**

Renderiza o step em modo de edição (clique para editar).

```typescript
<IntroStep01Renderer
    mode="editable"
    data={{
        title: 'Título Editável',
        buttonText: 'Começar',
    }}
    onEdit={(field, value) => {
        console.log(`Campo ${field} alterado para:`, value);
        // Atualizar estado do editor
        updateStepData(field, value);
    }}
/>
```

**Características:**
- ✅ Clique para editar
- ✅ Visual indicators (bordas, hover)
- ✅ Callback onEdit para cada mudança
- ✅ Ideal para editor visual

---

## 💡 Exemplos de Uso

### ✅ Exemplo 1: Quiz em Produção

```typescript
import { IntroStep01Renderer } from '@/components/editor/quiz-estilo/step-01';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function QuizPage() {
    const navigate = useNavigate();
    const [quizData, setQuizData] = useState({
        userName: '',
        currentStep: 1,
    });

    const handleNameSubmit = (name: string) => {
        setQuizData(prev => ({ ...prev, userName: name }));
        navigate('/quiz-estilo/step-02');
    };

    return (
        <IntroStep01Renderer
            mode="production"
            data={{
                title: 'Descubra seu Estilo',
                buttonText: 'Quero Descobrir!',
            }}
            onNameSubmit={handleNameSubmit}
            quizState={{
                currentStep: 1,
                totalSteps: 21,
            }}
        />
    );
}
```

---

### ✅ Exemplo 2: Preview em Lista de Templates

```typescript
import { IntroStep01Renderer } from '@/components/editor/quiz-estilo/step-01';

function TemplateCard({ template }) {
    return (
        <div className="w-64 h-48 overflow-hidden border rounded">
            <div className="transform scale-[0.3] origin-top-left w-[300%]">
                <IntroStep01Renderer
                    mode="preview"
                    data={template.step01Data}
                />
            </div>
        </div>
    );
}
```

---

### ✅ Exemplo 3: Editor Visual

```typescript
import { IntroStep01Renderer } from '@/components/editor/quiz-estilo/step-01';
import { IntroStep01_PropertiesPanel } from '@/components/editor/quiz-estilo/step-01';
import { useState } from 'react';

function VisualEditor() {
    const [stepData, setStepData] = useState({
        title: 'Título Inicial',
        buttonText: 'Começar',
        backgroundColor: '#FAF9F7',
    });

    const handleEdit = (field: string, value: any) => {
        setStepData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <div className="grid grid-cols-[1fr_400px]">
            {/* Canvas */}
            <div className="p-8 bg-gray-50">
                <IntroStep01Renderer
                    mode="editable"
                    data={stepData}
                    onEdit={handleEdit}
                />
            </div>

            {/* Properties Panel */}
            <div className="border-l bg-white">
                <IntroStep01_PropertiesPanel
                    properties={stepData}
                    onUpdate={handleEdit}
                />
            </div>
        </div>
    );
}
```

---

### ✅ Exemplo 4: Integração com UnifiedStepRenderer

```typescript
import { IntroStep01RendererAdapter } from '@/components/editor/quiz-estilo/step-01';

// Registrar no UnifiedStepRenderer
const LazyStepComponents = {
    'step-01': lazy(() => import('@/components/editor/quiz-estilo/step-01').then(m => ({ 
        default: m.IntroStep01RendererAdapter 
    }))),
    // ... outros steps
};

// Usar no quiz
<UnifiedStepRenderer
    stepId="step-01"
    mode="production"
    stepProps={{
        data: {
            title: 'Meu Quiz',
            buttonText: 'Começar',
        }
    }}
    onNext={() => setCurrentStep('step-02')}
/>
```

---

### ✅ Exemplo 5: Validação Automática

O renderer normaliza automaticamente os dados com o schema:

```typescript
// Dados parciais do usuário
const partialData = {
    title: 'Meu Título',
    // Faltam 46 campos...
};

// Renderer preenche automaticamente
<IntroStep01Renderer
    data={partialData}
    mode="production"
/>

// Resultado interno:
// {
//   title: 'Meu Título',           ← usuário
//   backgroundColor: '#FAF9F7',     ← padrão
//   logoUrl: 'https://...',         ← padrão
//   progressValue: 5,               ← padrão
//   // ... todos os 47+ campos preenchidos
// }
```

---

## 🔄 Fluxo de Dados

### **Production Mode**

```
Usuário preenche formulário
         ↓
IntroStep01_Form
         ↓
IntroStep01_Main
         ↓
IntroStep01Renderer (handleNameSubmit)
         ↓
onNameSubmit(name) ← Prop do pai
         ↓
onNext() ← Prop do pai
         ↓
Navigate to step-02
```

### **Editable Mode**

```
Usuário clica em elemento
         ↓
IntroStep01_Title (onEdit callback)
         ↓
IntroStep01_Main (propaga)
         ↓
IntroStep01Renderer (handleEdit)
         ↓
onEdit(field, value) ← Prop do pai
         ↓
Pai atualiza estado
         ↓
Re-render com novos dados
```

---

## 🎛️ Adapter (UnifiedStepRenderer)

O `IntroStep01RendererAdapter` converte props do UnifiedStepRenderer para o formato esperado:

```typescript
// Props recebidas do UnifiedStepRenderer
{
    mode: 'production',
    stepProps: { data: {...} },
    quizState: { userName: 'Maria', currentStep: 1 },
    onStepUpdate: (stepId, updates) => {...},
    onNext: () => {...},
}

// Convertidas para:
{
    mode: 'production',
    data: {...},
    quizState: { userName: 'Maria', currentStep: 1 },
    onNameSubmit: (name) => {
        onStepUpdate('step-01', { userName: name });
        onNext();
    },
    onEdit: (field, value) => {
        onStepUpdate('step-01', { [field]: value });
    },
}
```

---

## 🎨 Customização

### **CSS Classes**

```typescript
<IntroStep01Renderer
    className="custom-step-01"
    mode="production"
    data={...}
/>

// CSS customizado
.custom-step-01 {
    max-width: 800px;
    margin: 0 auto;
}

.custom-step-01 [data-mode="production"] {
    background: linear-gradient(to bottom, #fff, #f0f0f0);
}
```

### **Data Attributes**

O renderer adiciona automaticamente:

```html
<div 
    class="intro-step-01-renderer"
    data-mode="production"
    data-step="step-01"
>
    <!-- conteúdo -->
</div>
```

Use para CSS condicional:

```css
[data-mode="editable"] {
    cursor: pointer;
    border: 2px dashed #ccc;
}

[data-mode="preview"] {
    pointer-events: none;
    opacity: 0.9;
}
```

---

## 🧪 Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { IntroStep01Renderer } from '@/components/editor/quiz-estilo/step-01';

describe('IntroStep01Renderer', () => {
    it('renderiza em modo production', () => {
        render(
            <IntroStep01Renderer
                mode="production"
                data={{ title: 'Test Title' }}
            />
        );
        
        expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('chama onNameSubmit quando formulário é submetido', () => {
        const handleSubmit = jest.fn();
        
        render(
            <IntroStep01Renderer
                mode="production"
                onNameSubmit={handleSubmit}
            />
        );
        
        const input = screen.getByPlaceholderText(/digite seu primeiro nome/i);
        const button = screen.getByRole('button');
        
        fireEvent.change(input, { target: { value: 'Maria' } });
        fireEvent.click(button);
        
        expect(handleSubmit).toHaveBeenCalledWith('Maria');
    });

    it('normaliza dados parciais com valores padrão', () => {
        const { container } = render(
            <IntroStep01Renderer
                data={{ title: 'Only Title' }}
                mode="production"
            />
        );
        
        // Verifica se valores padrão foram aplicados
        const mainDiv = container.querySelector('[data-step="step-01"]');
        expect(mainDiv).toHaveStyle({ backgroundColor: '#FAF9F7' });
    });
});
```

---

## 📊 Performance

### **Lazy Loading**

```typescript
// Carrega apenas quando necessário
const IntroStep01Renderer = lazy(() => 
    import('@/components/editor/quiz-estilo/step-01').then(m => ({
        default: m.IntroStep01Renderer
    }))
);

// Use com Suspense
<Suspense fallback={<LoadingSpinner />}>
    <IntroStep01Renderer mode="production" />
</Suspense>
```

### **Memoization**

```typescript
import { memo } from 'react';

const MemoizedRenderer = memo(IntroStep01Renderer, (prev, next) => {
    return (
        prev.mode === next.mode &&
        JSON.stringify(prev.data) === JSON.stringify(next.data)
    );
});
```

---

## 🔧 Troubleshooting

### ❌ Erro: "Cannot find module"

```typescript
// ❌ Errado
import { IntroStep01Renderer } from '@/components/editor/quiz-estilo/step-01/IntroStep01Renderer';

// ✅ Correto
import { IntroStep01Renderer } from '@/components/editor/quiz-estilo/step-01';
```

### ❌ Erro: "onNameSubmit is not a function"

```typescript
// ❌ Esqueceu de passar o callback
<IntroStep01Renderer mode="production" />

// ✅ Sempre passe onNameSubmit em modo production
<IntroStep01Renderer 
    mode="production"
    onNameSubmit={(name) => console.log(name)}
/>
```

### ❌ Dados não atualizando no modo editable

```typescript
// ❌ Esqueceu de atualizar estado no callback
<IntroStep01Renderer 
    mode="editable"
    data={stepData}
    onEdit={(field, value) => {
        console.log(field, value); // ← Apenas log, não atualiza
    }}
/>

// ✅ Atualize o estado
<IntroStep01Renderer 
    mode="editable"
    data={stepData}
    onEdit={(field, value) => {
        setStepData(prev => ({ ...prev, [field]: value }));
    }}
/>
```

---

## 📚 Recursos Relacionados

- 📖 [Componentes Modulares Step-01](./README.md)
- 📖 [Schema de Validação](../../../../schemas/step01Schema.ts)
- 📖 [Guia de Uso do Schema](../../../../../SCHEMA_STEP01_GUIA_USO.md)
- 📖 [Exemplo de Integração](../../../../pages/examples/EditorStep01Exemplo.tsx)

---

## ✅ Checklist de Implementação

- [x] Renderer criado com 3 modos
- [x] Validação automática com schema
- [x] Normalização de dados
- [x] Adapter para UnifiedStepRenderer
- [x] TypeScript types completos
- [x] Documentação completa
- [x] Exemplos de uso
- [x] Testes unitários (exemplo)

---

## 🎉 Resumo

O **IntroStep01Renderer** é:

- ✅ **Unificado**: 1 componente para 3 modos
- ✅ **Type-safe**: TypeScript completo
- ✅ **Validado**: Schema Zod integrado
- ✅ **Flexível**: Suporta dados parciais
- ✅ **Performático**: Lazy loading ready
- ✅ **Testável**: Props isoladas e callbacks

🚀 **Pronto para produção em qualquer contexto!**
