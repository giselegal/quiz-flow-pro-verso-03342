# 🎯 Sistema de Componentes de Funil - Quiz Quest Challenge Verse

## 📋 Visão Geral

Este sistema oferece uma arquitetura completa de componentes reutilizáveis, editáveis e modulares para construção de funis de conversão, especialmente focado em questionários (quizzes), páginas de resultado e ofertas comerciais.

## ✨ Características Principais

- **📦 Componentes Modulares**: 21 etapas de funil completamente configuráveis
- **🎨 Editor Visual**: Integração com sistema de propriedades avançado
- **⚡ Flexbox**: Layouts responsivos e modernos
- **🔧 Reutilizáveis**: Componentes que podem ser usados em múltiplos contextos
- **📱 Responsivo**: Otimizado para desktop, tablet e mobile
- **🎯 Production Ready**: Testado e pronto para produção

## 🏗️ Estrutura do Sistema

### 📁 Componentes de Etapas (`/steps`)

#### Etapas Principais (1-21)
1. **FunnelIntroStep** - Introdução ao funil/quiz
2. **NameCollectStep** - Coleta de nome do usuário  
3. **QuizIntroStep** - Introdução às perguntas do quiz
4. **QuestionMultipleStep** - Perguntas de múltipla escolha (etapas 4-14)
5. **QuizTransitionStep** - Transição entre perguntas e resultado
6. **ProcessingStep** - Processamento do resultado
7. **ResultIntroStep** - Introdução ao resultado
8. **ResultDetailsStep** - Detalhes do resultado
9. **ResultGuideStep** - Guia baseado no resultado
10. **OfferTransitionStep** - Transição para oferta
11. **OfferPageStep** - Página de oferta final

### 🔗 Componentes Compartilhados (`/shared`)

- **FunnelProgressBar** - Barra de progresso do funil
- **QuizOption** - Opção de resposta para perguntas
- **CountdownTimer** - Temporizador de contagem regressiva
- **ResultCard** - Card para exibição de resultado
- **StyleGuideViewer** - Visualizador de guia de estilo
- **OfferCard** - Card para exibição de oferta

### 🛠️ Sistema de Edição (`/editor`)

- **FunnelBlockRenderer** - Renderizador principal dos componentes
- **FunnelConfigProvider** - Provedor de contexto global
- **ModularPropertiesPanel** - Painel de propriedades modular
- **ModularEditor** - Editor visual completo

### 🎣 Hooks Personalizados (`/hooks`)

- **useFunnelNavigation** - Gerenciamento de navegação entre etapas
- **useFunnelConfig** - Acesso ao contexto global do funil

## 🚀 Como Usar

### Exemplo Básico

```tsx
import {
  FunnelConfigProvider,
  FunnelIntroStep,
  useFunnelNavigation
} from '@/components/funnel-blocks';

export default function MyFunnel() {
  const { currentStep, goToNextStep, goToPreviousStep } = useFunnelNavigation({
    initialStep: 0
  });

  const funnelData = {
    steps: [
      {
        id: 'intro',
        type: 'intro',
        data: {
          title: 'Meu Quiz Personalizado',
          subtitle: 'Responda e descubra seu perfil'
        }
      }
    ],
    theme: {
      primaryColor: '#B89B7A',
      secondaryColor: '#403C34',
      backgroundColor: '#FFFFFF',
      textColor: '#333333',
      fontFamily: 'Inter, sans-serif'
    }
  };

  return (
    <FunnelConfigProvider config={funnelData}>
      <FunnelIntroStep
        id="intro"
        stepType="intro"
        stepNumber={1}
        totalSteps={21}
        onNext={goToNextStep}
        data={funnelData.steps[0].data}
      />
    </FunnelConfigProvider>
  );
}
```

### Criando um Funil Completo

```tsx
import { useState } from 'react';
import {
  FunnelConfigProvider,
  FunnelIntroStep,
  NameCollectStep,
  QuestionMultipleStep,
  ResultDetailsStep,
  OfferPageStep,
  useFunnelNavigation
} from '@/components/funnel-blocks';

export default function CompleteFunnel() {
  const { currentStep, goToNextStep, goToPreviousStep } = useFunnelNavigation();
  
  const steps = [
    {
      id: 'intro',
      component: FunnelIntroStep,
      data: {
        title: 'Descubra Seu Estilo Ideal',
        subtitle: 'Responda nosso quiz personalizado',
        buttonText: 'Começar Agora'
      }
    },
    {
      id: 'name',
      component: NameCollectStep,
      data: {
        title: 'Como podemos te chamar?',
        placeholder: 'Seu nome aqui...'
      }
    },
    {
      id: 'question-1',
      component: QuestionMultipleStep,
      data: {
        question: 'Qual é seu tipo de roupa favorita?',
        options: [
          {
            id: 'casual',
            text: 'Casual e confortável',
            imageUrl: '/images/casual.jpg',
            value: 'casual'
          },
          {
            id: 'formal',
            text: 'Formal e elegante',
            imageUrl: '/images/formal.jpg',
            value: 'formal'
          }
        ]
      }
    },
    {
      id: 'result',
      component: ResultDetailsStep,
      data: {
        result: {
          title: 'Seu estilo é Casual!',
          description: 'Você prefere conforto e praticidade.',
          recommendations: ['Invista em básicos', 'Combine texturas']
        }
      }
    },
    {
      id: 'offer',
      component: OfferPageStep,
      data: {
        offer: {
          title: 'Consultoria de Estilo Personalizada',
          price: 'R$ 297',
          originalPrice: 'R$ 497'
        }
      }
    }
  ];

  const CurrentStepComponent = steps[currentStep]?.component;
  const currentData = steps[currentStep]?.data;

  return (
    <FunnelConfigProvider config={{ steps, theme: defaultTheme }}>
      <CurrentStepComponent
        id={steps[currentStep].id}
        stepNumber={currentStep + 1}
        totalSteps={steps.length}
        data={currentData}
        onNext={goToNextStep}
        onPrevious={goToPreviousStep}
      />
    </FunnelConfigProvider>
  );
}
```

## 🎨 Integração com Editor Visual

### Sistema de Blocos

Todos os componentes estão integrados ao sistema de blocos do editor:

```tsx
import { FunnelBlockRenderer } from '@/components/editor/FunnelBlockRenderer';

// O renderizador identifica automaticamente componentes de funil
<FunnelBlockRenderer
  block={{
    id: 'intro-1',
    type: 'funnel-intro-step',
    properties: {
      title: 'Meu Título',
      subtitle: 'Meu Subtítulo',
      buttonText: 'Começar'
    }
  }}
  isEditable={true}
/>
```

### Painel de Propriedades

```tsx
import { ModularPropertiesPanel } from '@/components/editor/ModularPropertiesPanel';

<ModularPropertiesPanel
  selectedComponent={selectedComponent}
  onUpdateComponent={(updates) => {
    // Atualizações em tempo real
    setSelectedComponent({ ...selectedComponent, ...updates });
  }}
/>
```

## 📊 Páginas de Demonstração

### 1. Demo Completo de Funil
- **Rota**: `/funnel-demo`
- **Componente**: `FunnelComponentsDemo`
- **Funcionalidades**:
  - Navegação completa entre etapas
  - Preview de todos os componentes
  - Editor visual integrado
  - Painel de propriedades

### 2. Demo de Componentes Modulares
- **Rota**: `/modular-demo`
- **Componente**: `ModularComponentsDemo`
- **Funcionalidades**:
  - Sistema modular flexbox
  - Drag-and-drop
  - Edição em tempo real

## 🔧 Configuração e Personalização

### Tema Global

```tsx
const customTheme = {
  primaryColor: '#B89B7A',      // Cor principal
  secondaryColor: '#403C34',    // Cor secundária
  backgroundColor: '#FFFFFF',   // Fundo
  textColor: '#333333',         // Texto
  fontFamily: 'Inter, sans-serif' // Fonte
};
```

### Propriedades Personalizadas

Cada componente aceita propriedades específicas via `data`:

```tsx
// Exemplo para FunnelIntroStep
const introData = {
  title: 'Título customizado',
  subtitle: 'Subtítulo customizado',
  buttonText: 'Ação customizada',
  logoUrl: 'https://...',
  backgroundImage: 'https://...',
  showProgressBar: true
};
```

## 📱 Responsividade

Todos os componentes são responsivos por padrão:

- **Desktop**: Layout completo com múltiplas colunas
- **Tablet**: Layout adaptado com 2 colunas
- **Mobile**: Layout single-column otimizado

## 🎯 Tipos de Propriedades Suportadas

O sistema de propriedades suporta todos os tipos:

- ✅ `text-input` - Campos de texto
- ✅ `textarea` - Áreas de texto
- ✅ `number-input` - Campos numéricos
- ✅ `boolean-switch` - Switches on/off
- ✅ `color-picker` - Seletores de cor
- ✅ `select` - Dropdowns
- ✅ `array-of-objects` - Arrays de objetos (ex: opções de quiz)
- ✅ `image-url` - URLs de imagem
- ✅ `json-editor` - Editor JSON avançado

## 🧪 Teste e Validação

### Executar Demo Local

```bash
# Instalar dependências
npm install

# Executar servidor de desenvolvimento
npm run dev

# Acessar demos
# http://localhost:8080/funnel-demo
# http://localhost:8080/modular-demo
```

### Build de Produção

```bash
# Build completo
npm run build

# Verificar se todos componentes compilam
# ✓ Componentes de funil integrados
# ✓ Sistema de propriedades funcional
# ✓ Editor visual operacional
```

## 🔍 Troubleshooting

### Problemas Comuns

1. **Caminhos de Importação**
   ```tsx
   // ✅ Correto
   import { FunnelIntroStep } from '@/components/funnel-blocks';
   
   // ❌ Incorreto
   import { FunnelIntroStep } from './src/components/funnel-blocks';
   ```

2. **Tipos TypeScript**
   - Todas as interfaces estão em `@/types/funnel.ts`
   - Propriedades são tipadas via `PropertySchema`

3. **Estados e Navegação**
   - Use `useFunnelNavigation` para controle de fluxo
   - Use `useFunnelConfig` para dados globais

## 📈 Próximos Passos

- [ ] Adicionar mais variações de layout
- [ ] Implementar sistema de A/B testing
- [ ] Adicionar analytics integrado
- [ ] Criar templates pré-configurados
- [ ] Adicionar animações avançadas

## 📄 Licença

Este projeto está licenciado sob a licença MIT.

---

## 🔗 Links Úteis

- **Demo Funil**: [http://localhost:8080/funnel-demo](http://localhost:8080/funnel-demo)
- **Demo Modular**: [http://localhost:8080/modular-demo](http://localhost:8080/modular-demo)
- **Editor Principal**: [http://localhost:8080/editor](http://localhost:8080/editor)
- **Documentação de Tipos**: `src/types/funnel.ts`
- **Exemplos Completos**: `src/components/funnel-blocks/examples/`

---

**🎉 Sistema completo de componentes reutilizáveis, editáveis, modulares e flexbox implementado com sucesso!**
