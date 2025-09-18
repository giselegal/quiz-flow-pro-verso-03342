# Componentes Reutilizáveis para Funis

Este diretório contém componentes reutilizáveis para construção de funis completos, especialmente focados em questionários (quizzes), páginas de resultados e ofertas. Os componentes foram projetados para serem totalmente editáveis e configuráveis, permitindo a criação de novos funis com facilidade.

## Estrutura de Diretórios

- `/steps` - Componentes para cada etapa do funil (21 etapas)
- `/shared` - Componentes compartilhados entre etapas
- `/editor` - Componentes para integração com o editor visual
- `/hooks` - Hooks personalizados para funcionalidade do funil
- `/examples` - Exemplos de uso dos componentes

## Componentes de Etapas (Steps)

Estes componentes representam as 21 etapas do funil completo:

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

## Componentes Compartilhados (Shared)

Componentes utilizados em múltiplas etapas:

- **FunnelProgressBar** - Barra de progresso do funil
- **QuizOption** - Opção de resposta para perguntas
- **CountdownTimer** - Temporizador de contagem regressiva
- **ResultCard** - Card para exibição de resultado
- **StyleGuideViewer** - Visualizador de guia de estilo
- **OfferCard** - Card para exibição de oferta

## Integração com Editor Visual

Para usar estes componentes no editor visual:

1. Importe o componente `FunnelStepBlock` no editor
2. Use o `FunnelConfigProvider` para gerenciar o estado global do funil
3. Configure as propriedades via painel de propriedades

## Como Usar

### Exemplo Básico

```tsx
import {
  FunnelConfigProvider,
  FunnelIntroStep,
  useFunnelNavigation,
} from '@/components/funnel-blocks';

export default function MyFunnel() {
  // Configurar navegação do funil
  const { currentStep, goToNextStep, goToPreviousStep } = useFunnelNavigation({
    initialStep: 0,
  });

  // Dados do funil
  const funnelData = {
    steps: [
      {
        id: 'intro',
        type: 'intro',
        data: {
          title: 'Meu Quiz Personalizado',
          subtitle: 'Responda e descubra seu perfil',
        },
      },
      // ... outras etapas
    ],
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

### Criando um Novo Funil

1. Defina as etapas do funil com seus respectivos dados
2. Use o `FunnelConfigProvider` para prover dados globais
3. Renderize cada componente de etapa conforme necessário
4. Use o hook `useFunnelNavigation` para gerenciar a navegação

## Personalização

Todos os componentes aceitam as seguintes propriedades para personalização:

- `className` - Classes CSS adicionais
- `style` - Estilos inline
- `data` - Dados específicos do componente

Para mais detalhes, consulte a documentação de tipos em `@/types/funnel.ts`.

## Resolução de Problemas (Troubleshooting)

### Caminhos Incorretos

Ao trabalhar com este projeto, sempre use o caminho relativo correto:

- ✅ Use `./src/components/funnel-blocks/...` quando estiver na pasta `/client`
- ❌ Evite usar `/client/src/components/funnel-blocks/...`

### Erros de TypeScript

Os erros de TypeScript podem ocorrer devido a:

1. Imports incorretos (verifique os caminhos @/ vs ../)
2. Propriedades faltando nos tipos (verifique as interfaces)
3. Flag JSX não definida (apenas na verificação estática)

### Problemas de Renderização

Se um componente não renderizar corretamente:

1. Verifique se todos os imports estão corretos
2. Confira se as propriedades obrigatórias foram passadas
3. Use o modo de depuração com `data-funnel-step` para identificar qual componente está com problemas
