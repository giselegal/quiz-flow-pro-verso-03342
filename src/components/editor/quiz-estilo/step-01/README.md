# 🏠 Componentes Separados - Etapa 1 (IntroStep)

> **Componentes modulares e editáveis para o editor `/editor?template=quiz-estilo`**  
> Data de Criação: 16 de Outubro de 2025

---

## 📋 VISÃO GERAL

Esta pasta contém componentes **separados e modulares** para a **Etapa 1 (IntroStep)** do template quiz-estilo. Cada componente é independente, editável e pode ser usado individualmente ou em conjunto.

### Estrutura de Componentes

```
step-01/
├── IntroStep01_Header.tsx          # Cabeçalho (logo, progresso)
├── IntroStep01_Title.tsx           # Título principal
├── IntroStep01_Image.tsx           # Imagem principal
├── IntroStep01_Description.tsx     # Texto descritivo
├── IntroStep01_Form.tsx            # Formulário (input + botão)
├── IntroStep01_Main.tsx            # Componente integrador
├── IntroStep01_PropertiesPanel.tsx # Painel de propriedades
├── index.ts                        # Barrel exports
└── README.md                       # Esta documentação
```

---

## 🎯 COMPONENTES

### 1. IntroStep01_Header

**Responsabilidade:** Cabeçalho fixo com logo e navegação

**Props:**
```tsx
interface IntroStep01HeaderProps {
    logoUrl?: string;
    logoAlt?: string;
    logoWidth?: number;
    logoHeight?: number;
    showBackButton?: boolean;
    onBack?: () => void;
    showProgressBar?: boolean;
    progressValue?: number;
    isEditable?: boolean;
    onEdit?: (field: string, value: any) => void;
}
```

**Uso:**
```tsx
import { IntroStep01_Header } from '@/components/editor/quiz-estilo/step-01';

<IntroStep01_Header
    logoUrl="https://..."
    logoWidth={96}
    logoHeight={96}
    showProgressBar={true}
    progressValue={5}
/>
```

---

### 2. IntroStep01_Title

**Responsabilidade:** Título principal com suporte a HTML rico

**Props:**
```tsx
interface IntroStep01TitleProps {
    title?: string;
    textColor?: string;
    accentColor?: string;
    fontSize?: string;
    fontFamily?: string;
    textAlign?: 'left' | 'center' | 'right';
    isEditable?: boolean;
    onEdit?: (field: string, value: any) => void;
}
```

**Uso:**
```tsx
import { IntroStep01_Title } from '@/components/editor/quiz-estilo/step-01';

<IntroStep01_Title
    title='<span style="color: #B89B7A;">Chega</span> de um guarda-roupa lotado...'
    textColor="#432818"
    accentColor="#B89B7A"
    fontSize="text-2xl sm:text-3xl md:text-4xl"
/>
```

---

### 3. IntroStep01_Image

**Responsabilidade:** Imagem principal responsiva

**Props:**
```tsx
interface IntroStep01ImageProps {
    imageUrl?: string;
    imageAlt?: string;
    maxWidth?: number;
    maxHeight?: number;
    aspectRatio?: string;
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
    showShadow?: boolean;
    borderRadius?: string;
    isEditable?: boolean;
    onEdit?: (field: string, value: any) => void;
}
```

**Uso:**
```tsx
import { IntroStep01_Image } from '@/components/editor/quiz-estilo/step-01';

<IntroStep01_Image
    imageUrl="https://..."
    imageAlt="Descubra seu estilo"
    maxWidth={300}
    maxHeight={204}
    aspectRatio="1.47"
    objectFit="contain"
/>
```

---

### 4. IntroStep01_Description

**Responsabilidade:** Texto descritivo com suporte a HTML

**Props:**
```tsx
interface IntroStep01DescriptionProps {
    description?: string;
    descriptionHtml?: string;
    textColor?: string;
    accentColor?: string;
    fontSize?: string;
    textAlign?: 'left' | 'center' | 'right';
    maxWidth?: string;
    isEditable?: boolean;
    onEdit?: (field: string, value: any) => void;
}
```

**Uso:**
```tsx
import { IntroStep01_Description } from '@/components/editor/quiz-estilo/step-01';

<IntroStep01_Description
    description="Em poucos minutos, descubra seu <strong>Estilo Predominante</strong>..."
    textColor="#6B7280"
    accentColor="#B89B7A"
/>
```

---

### 5. IntroStep01_Form

**Responsabilidade:** Formulário de input do nome + botão

**Props:**
```tsx
interface IntroStep01FormProps {
    formQuestion?: string;
    inputPlaceholder?: string;
    inputLabel?: string;
    buttonText?: string;
    required?: boolean;
    buttonColor?: string;
    buttonTextColor?: string;
    inputBorderColor?: string;
    onSubmit?: (name: string) => void;
    isEditable?: boolean;
    onEdit?: (field: string, value: any) => void;
}
```

**Uso:**
```tsx
import { IntroStep01_Form } from '@/components/editor/quiz-estilo/step-01';

<IntroStep01_Form
    formQuestion="Como posso te chamar?"
    inputPlaceholder="Digite seu primeiro nome aqui..."
    buttonText="Quero Descobrir meu Estilo Agora!"
    onSubmit={(name) => console.log('Nome:', name)}
/>
```

---

### 6. IntroStep01_Main

**Responsabilidade:** Componente principal que integra todos os sub-componentes

**Props:**
```tsx
interface IntroStep01MainProps {
    data?: {
        // Todas as props dos componentes acima combinadas
    };
    onNameSubmit?: (name: string) => void;
    onBack?: () => void;
    isEditable?: boolean;
    onEdit?: (field: string, value: any) => void;
}
```

**Uso:**
```tsx
import { IntroStep01_Main } from '@/components/editor/quiz-estilo/step-01';

<IntroStep01_Main
    data={{
        logoUrl: 'https://...',
        title: 'Chega de...',
        imageUrl: 'https://...',
        formQuestion: 'Como posso te chamar?',
        buttonText: 'Começar!'
    }}
    onNameSubmit={(name) => handleNameSubmit(name)}
    isEditable={true}
    onEdit={(field, value) => handleEdit(field, value)}
/>
```

---

### 7. IntroStep01_PropertiesPanel

**Responsabilidade:** Painel de propriedades para o editor

**Props:**
```tsx
interface IntroStep01PropertiesPanelProps {
    properties: Record<string, any>;
    onUpdate: (key: string, value: any) => void;
}
```

**Uso:**
```tsx
import { IntroStep01_PropertiesPanel } from '@/components/editor/quiz-estilo/step-01';

<IntroStep01_PropertiesPanel
    properties={currentStepProperties}
    onUpdate={(key, value) => {
        console.log('Atualizando:', key, value);
        updateStepProperty(stepId, key, value);
    }}
/>
```

---

## 🚀 EXEMPLOS DE USO

### Exemplo 1: Usar Componente Principal (Recomendado)

```tsx
import { IntroStep01_Main } from '@/components/editor/quiz-estilo/step-01';
import { useState } from 'react';

function QuizEditor() {
    const [stepData, setStepData] = useState({
        logoUrl: 'https://...',
        title: '<span style="color: #B89B7A;">Chega</span> de um guarda-roupa lotado...',
        imageUrl: 'https://...',
        formQuestion: 'Como posso te chamar?',
        buttonText: 'Quero Descobrir meu Estilo Agora!',
        backgroundColor: '#FAF9F7'
    });

    const handleEdit = (field: string, value: any) => {
        setStepData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleNameSubmit = (name: string) => {
        console.log('Nome submetido:', name);
        // Avançar para próxima etapa
    };

    return (
        <IntroStep01_Main
            data={stepData}
            onNameSubmit={handleNameSubmit}
            isEditable={true}
            onEdit={handleEdit}
        />
    );
}
```

---

### Exemplo 2: Usar Componentes Separados

```tsx
import {
    IntroStep01_Header,
    IntroStep01_Title,
    IntroStep01_Image,
    IntroStep01_Description,
    IntroStep01_Form
} from '@/components/editor/quiz-estilo/step-01';

function CustomIntroStep() {
    return (
        <div className="min-h-screen bg-[#FAF9F7]">
            <IntroStep01_Header
                logoUrl="https://..."
                showProgressBar={true}
                progressValue={5}
            />

            <main className="py-8 space-y-8">
                <IntroStep01_Title
                    title="Meu Título Personalizado"
                    textColor="#000000"
                />

                <IntroStep01_Image
                    imageUrl="https://..."
                    maxWidth={400}
                />

                <IntroStep01_Description
                    description="Minha descrição personalizada"
                />

                <IntroStep01_Form
                    formQuestion="Qual seu nome?"
                    buttonText="Continuar"
                    onSubmit={(name) => console.log(name)}
                />
            </main>
        </div>
    );
}
```

---

### Exemplo 3: Integração com Editor WYSIWYG

```tsx
import { IntroStep01_Main, IntroStep01_PropertiesPanel } from '@/components/editor/quiz-estilo/step-01';
import { useState } from 'react';

function EditorPage() {
    const [selectedStep, setSelectedStep] = useState('step-01');
    const [stepProperties, setStepProperties] = useState({
        logoUrl: 'https://...',
        title: 'Chega de...',
        // ... outras propriedades
    });

    const handlePropertyUpdate = (key: string, value: any) => {
        setStepProperties(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <div className="grid grid-cols-[1fr_400px] gap-4">
            {/* Canvas de Preview */}
            <div className="border rounded-lg overflow-hidden">
                <IntroStep01_Main
                    data={stepProperties}
                    isEditable={true}
                    onEdit={handlePropertyUpdate}
                />
            </div>

            {/* Painel de Propriedades */}
            <div className="border rounded-lg p-4">
                <h2 className="text-lg font-bold mb-4">Propriedades</h2>
                <IntroStep01_PropertiesPanel
                    properties={stepProperties}
                    onUpdate={handlePropertyUpdate}
                />
            </div>
        </div>
    );
}
```

---

## 🎨 CUSTOMIZAÇÃO

### Cores Padrão

```tsx
const DEFAULT_COLORS = {
    backgroundColor: '#FAF9F7',  // Fundo neutro
    textColor: '#432818',        // Marrom escuro
    accentColor: '#B89B7A',      // Dourado/Bronze
    descriptionColor: '#6B7280', // Cinza médio
    buttonColor: '#B89B7A',      // Dourado
    buttonTextColor: '#FFFFFF'   // Branco
};
```

### Fontes Padrão

```tsx
const DEFAULT_FONTS = {
    title: '"Playfair Display", serif',
    body: 'system-ui, -apple-system, sans-serif'
};
```

### Tamanhos Padrão

```tsx
const DEFAULT_SIZES = {
    logoWidth: 96,
    logoHeight: 96,
    imageMaxWidth: 300,
    imageMaxHeight: 204
};
```

---

## 📱 RESPONSIVIDADE

Todos os componentes são **mobile-first** e responsivos:

- **Mobile** (< 640px): Layout vertical compacto
- **Tablet** (640px - 1024px): Layout intermediário
- **Desktop** (> 1024px): Layout completo

**Classes Tailwind utilizadas:**
```
text-sm sm:text-base md:text-lg
max-w-xs sm:max-w-md md:max-w-lg
px-4 py-8 md:py-12
```

---

## ♿ ACESSIBILIDADE

Todos os componentes seguem boas práticas de acessibilidade:

- ✅ Texto alternativo em imagens (`alt` attributes)
- ✅ Labels em formulários (`<label>` + `htmlFor`)
- ✅ Navegação por teclado (Enter no input)
- ✅ ARIA attributes (progressbar)
- ✅ Contraste de cores adequado (WCAG AA)
- ✅ Foco visível em elementos interativos

---

## 🔧 DESENVOLVIMENTO

### Adicionar Novo Campo Editável

1. **Adicionar prop ao componente:**
```tsx
export interface IntroStep01TitleProps {
    // ... props existentes
    newField?: string; // ← Nova prop
}
```

2. **Usar no componente:**
```tsx
<h1 data-editable={isEditable ? 'newField' : undefined}>
    {newField}
</h1>
```

3. **Adicionar ao painel de propriedades:**
```tsx
<div>
    <Label htmlFor="newField">Novo Campo</Label>
    <Input
        id="newField"
        value={newField}
        onChange={(e) => onUpdate('newField', e.target.value)}
    />
</div>
```

---

## 🧪 TESTES

### Testar Componente Individual

```bash
# Criar arquivo de teste
touch src/components/editor/quiz-estilo/step-01/IntroStep01_Main.test.tsx
```

```tsx
import { render, screen } from '@testing-library/react';
import { IntroStep01_Main } from './IntroStep01_Main';

describe('IntroStep01_Main', () => {
    it('renderiza com props padrão', () => {
        render(<IntroStep01_Main />);
        expect(screen.getByRole('heading')).toBeInTheDocument();
    });

    it('chama onNameSubmit ao submeter formulário', () => {
        const handleSubmit = jest.fn();
        render(<IntroStep01_Main onNameSubmit={handleSubmit} />);
        
        // ... interagir com formulário
        
        expect(handleSubmit).toHaveBeenCalledWith('Nome Teste');
    });
});
```

---

## 📚 RECURSOS ADICIONAIS

### Documentação Relacionada

- [GUIA_CRIAR_COMPONENTES_SEPARADOS.md](../../../../GUIA_CRIAR_COMPONENTES_SEPARADOS.md)
- [FLUXO_RENDERIZACAO_COMPONENTES.md](../../../../FLUXO_RENDERIZACAO_COMPONENTES.md)
- [QUICK_START_CRIAR_STEPS.md](../../../../QUICK_START_CRIAR_STEPS.md)

### Componentes Relacionados

- `src/components/quiz/IntroStep.tsx` - Versão de produção
- `src/components/editor/editable-steps/EditableIntroStep.tsx` - Wrapper editável
- `src/components/editor/quiz-estilo/EditorIntroStep.tsx` - Versão anterior do editor

---

## 🎉 CONCLUSÃO

Estes componentes separados permitem:

✅ **Modularidade** - Cada parte é independente  
✅ **Reutilização** - Componentes podem ser usados em diferentes contextos  
✅ **Manutenibilidade** - Código organizado e fácil de modificar  
✅ **Testabilidade** - Componentes pequenos são mais fáceis de testar  
✅ **Escalabilidade** - Estrutura clara para adicionar novos steps  

**Próximos Passos:**
1. Testar componentes no editor
2. Criar componentes separados para outras etapas (step-02, step-03, etc.)
3. Adicionar mais customizações ao painel de propriedades
4. Integrar com sistema de preview em tempo real

---

**Criado em:** 16 de Outubro de 2025  
**Autor:** GitHub Copilot  
**Versão:** 1.0.0
