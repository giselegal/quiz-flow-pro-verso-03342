o# Guia de Implementação: Integração de Cálculo e Resultado nas Etapas 20 e 21

## Visão Geral

Este guia descreve como implementar a integração completa entre os cálculos de resultado do quiz e as etapas 20 (Resultado) e 21 (Oferta) do editor do funil. A implementação conecta os dados do usuário, as respostas das questões e o resultado calculado com os componentes visuais do editor.

## Componentes Necessários

1. **Etapa 20 (Resultado)**
   - `QuizResultsBlock`: Exibe o resultado geral
   - `StyleResultsBlock`: Exibe detalhes do estilo predominante

2. **Etapa 21 (Oferta)**
   - `FinalStepEditor`: Editor para a página de oferta
   - `StyleResultsEditor`: Editor para personalizar o estilo exibido

## Passo a Passo para Implementação

### 1. Modificar o Template da Etapa 20

```typescript
// src/config/stepTemplatesMapping.ts
const Step20ResultTemplate = [
  {
    id: 'quiz-results-header',
    type: 'heading',
    content: {
      text: 'Seu Resultado: {primaryStyle}',
      level: 'h1',
      align: 'center',
    },
  },
  {
    id: 'quiz-results-display',
    type: 'quiz-results-block', // Usar o componente de resultados
    content: {
      showScores: true,
      showAllStyles: false,
    },
  },
  {
    id: 'style-results-display',
    type: 'style-results-block', // Usar o componente de estilo
    content: {
      showGuideImage: true,
      showAllStyles: true,
    },
  },
];
```

### 2. Modificar o Template da Etapa 21

```typescript
// src/config/stepTemplatesMapping.ts
const Step21OfferTemplate = [
  {
    id: 'final-step-header',
    type: 'heading',
    content: {
      text: 'Oferta Exclusiva para Seu Estilo: {primaryStyle}',
      level: 'h1',
      align: 'center',
    },
  },
  {
    id: 'final-step-editor',
    type: 'final-step', // Usar o editor de etapa final
    content: {
      stepNumber: 21,
      title: 'Sua Oferta Personalizada',
      subtitle: 'Baseada no seu estilo predominante',
      styleResult: {
        selectedStyle: '{primaryStyle}', // Será substituído pelo estilo real
        showAllStyles: false,
        showGuideImage: true,
      },
    },
  },
];
```

### 3. Criar um Wrapper para Conectar com Supabase

```typescript
// src/components/blocks/quiz/ConnectedQuizResultsBlock.tsx
import React, { useEffect, useState } from 'react';
import { useSupabaseQuiz } from '@/hooks/useSupabaseQuiz';
import QuizResultsBlock from './QuizResultsBlock';

interface ConnectedQuizResultsBlockProps {
  sessionId?: string; // Opcional: ID da sessão se não quiser usar a atual
  showScores?: boolean;
  showAllStyles?: boolean;
}

const ConnectedQuizResultsBlock: React.FC<ConnectedQuizResultsBlockProps> = ({
  sessionId,
  showScores = true,
  showAllStyles = false
}) => {
  const { session, result, isLoading, completeQuiz, resetQuiz } = useSupabaseQuiz();
  const [categoryScores, setCategoryScores] = useState([]);

  // Usar sessionId fornecido ou da sessão atual
  const activeSessionId = sessionId || session?.id;

  // Carregar resultado se ainda não estiver disponível
  useEffect(() => {
    if (!result && activeSessionId && !isLoading) {
      // Carregar resultado do Supabase
      completeQuiz();
    }

    // Processar scores para exibição
    if (result?.scores) {
      const scores = Object.entries(result.scores).map(([category, score]) => ({
        category,
        score: score as number,
        count: 1
      }));
      setCategoryScores(scores);
    }
  }, [result, activeSessionId, isLoading]);

  if (isLoading) {
    return <div>Carregando seu resultado...</div>;
  }

  if (!result) {
    return <div>Resultado não disponível</div>;
  }

  return (
    <QuizResultsBlock
      result={{
        title: `Seu Estilo Predominante: ${result.primaryStyle.category}`,
        description: `Você tem ${result.primaryStyle.percentage}% de compatibilidade com o estilo ${result.primaryStyle.category}.`,
        imageUrl: `/styles/${result.primaryStyle.style.toLowerCase()}.jpg`
      }}
      categoryScores={categoryScores}
      showScores={showScores}
      onReset={resetQuiz}
      onShare={() => {
        // Implementar compartilhamento
        alert('Compartilhar resultado');
      }}
    />
  );
};

export default ConnectedQuizResultsBlock;
```

### 4. Criar um Wrapper para o StyleResultsBlock

```typescript
// src/components/blocks/quiz/ConnectedStyleResultsBlock.tsx
import React, { useEffect } from 'react';
import { useSupabaseQuiz } from '@/hooks/useSupabaseQuiz';
import StyleResultsBlock from './StyleResultsBlock';

interface ConnectedStyleResultsBlockProps {
  showAllStyles?: boolean;
  showGuideImage?: boolean;
}

const ConnectedStyleResultsBlock: React.FC<ConnectedStyleResultsBlockProps> = ({
  showAllStyles = false,
  showGuideImage = true
}) => {
  const { session, result, isLoading, completeQuiz, resetQuiz } = useSupabaseQuiz();

  // Carregar resultado se ainda não estiver disponível
  useEffect(() => {
    if (!result && session?.id && !isLoading) {
      completeQuiz();
    }
  }, [result, session?.id, isLoading]);

  if (isLoading) {
    return <div>Carregando seu estilo...</div>;
  }

  if (!result) {
    return <div>Resultado não disponível</div>;
  }

  return (
    <StyleResultsBlock
      result={{
        title: result.primaryStyle.category,
        description: `Seu estilo predominante é ${result.primaryStyle.category} com ${result.primaryStyle.percentage}% de compatibilidade.`,
        imageUrl: `/styles/${result.primaryStyle.style.toLowerCase()}.jpg`
      }}
      categoryScores={result.scores}
      showAllStyles={showAllStyles}
      showGuideImage={showGuideImage}
      guideImageUrl={`/style-guides/${result.primaryStyle.style.toLowerCase()}-guide.jpg`}
      onReset={resetQuiz}
      onShare={() => {
        // Implementar compartilhamento
        alert('Compartilhar estilo');
      }}
    />
  );
};

export default ConnectedStyleResultsBlock;
```

### 5. Atualizar o Registro de Blocos

```typescript
// src/config/enhancedBlockRegistry.ts

// Adicionar os novos componentes conectados
import ConnectedQuizResultsBlock from '../components/blocks/quiz/ConnectedQuizResultsBlock';
import ConnectedStyleResultsBlock from '../components/blocks/quiz/ConnectedStyleResultsBlock';

export const ENHANCED_BLOCK_REGISTRY: Record<string, React.ComponentType<any>> = {
  // ... outros componentes

  // Componentes originais (para editor)
  'quiz-results': QuizResultsEditor,
  'quiz-results-block': QuizResultsBlock,
  'style-results': StyleResultsEditor,
  'style-results-block': StyleResultsBlock,
  'final-step': FinalStepEditor,

  // Componentes conectados (para visualização real)
  'connected-quiz-results': ConnectedQuizResultsBlock,
  'connected-style-results': ConnectedStyleResultsBlock,

  // ... outros componentes
};
```

### 6. Atualizar o Renderizador de Blocos para Usar os Componentes Conectados

```typescript
// src/components/editor/blocks/UniversalBlockRenderer.tsx

// No método de renderização
const renderBlock = (block: EditorBlock) => {
  // Verificar se estamos no modo preview ou visualização
  const isPreview = mode === 'preview';

  // Substituir blocos por versões conectadas quando em preview
  let blockType = block.type;
  if (isPreview) {
    // Mapeamento para componentes conectados
    const connectedComponents: Record<string, string> = {
      'quiz-results-block': 'connected-quiz-results',
      'style-results-block': 'connected-style-results',
    };

    // Substituir se houver uma versão conectada
    if (blockType in connectedComponents) {
      blockType = connectedComponents[blockType];
    }
  }

  // Restante da lógica de renderização...
};
```

### 7. Implementar o Carregamento de Dados Dinâmicos nas Etapas 20-21

```typescript
// src/context/EditorContext.tsx

// No método de carregamento de etapa
const loadStage = useCallback(
  async (stageId: string) => {
    // Carregar etapa normalmente
    // ...

    // Se for etapa 20 ou 21, carregar dados dinamicamente
    if (stageId === 'step-20' || stageId === 'step-21') {
      try {
        // Usar o hook de quiz para acessar os dados
        const { result } = useSupabaseQuiz();

        if (result) {
          // Percorrer todos os blocos e substituir placeholders
          const updatedBlocks = blocks.map(block => {
            // Copiar conteúdo para não mutar o original
            const newContent = { ...block.content };

            // Substituir placeholders
            if (typeof newContent.text === 'string') {
              newContent.text = newContent.text.replace(
                '{primaryStyle}',
                result.primaryStyle.category
              );
            }

            // Para o bloco final-step
            if (block.type === 'final-step' && newContent.styleResult) {
              newContent.styleResult.selectedStyle = result.primaryStyle.style;
            }

            return {
              ...block,
              content: newContent,
            };
          });

          // Atualizar os blocos
          setStageBlocks({
            ...stageBlocks,
            [stageId]: updatedBlocks,
          });
        }
      } catch (error) {
        console.error('Erro ao carregar dados dinâmicos para etapa:', error);
      }
    }
  },
  [stageBlocks]
);
```

## Testando a Implementação

1. **Iniciar o Servidor de Desenvolvimento**:

   ```bash
   npm run dev
   ```

2. **Preencher o Quiz**:
   - Navegar até a página inicial do quiz
   - Preencher o nome na Etapa 2
   - Responder todas as perguntas nas Etapas 3-12 e 14-19

3. **Verificar o Resultado**:
   - Na Etapa 20, verificar se o resultado está sendo exibido corretamente
   - Confirmar se os componentes `ConnectedQuizResultsBlock` e `ConnectedStyleResultsBlock` estão renderizando os dados corretos

4. **Verificar a Oferta**:
   - Na Etapa 21, confirmar se a oferta está personalizada com base no estilo calculado
   - Verificar se o `FinalStepEditor` está exibindo as informações corretas

## Integração com Editor

Para garantir que estas mudanças funcionem bem no editor, certifique-se de:

1. Usar placeholders nos templates para substituição dinâmica
2. Implementar renderização condicional (editor vs. preview)
3. Carregar dados do Supabase apenas quando necessário
4. Garantir que o editor possa visualizar os blocos sem dados reais

## Conclusão

A implementação acima conecta todo o fluxo de dados do quiz, desde a captura do nome do usuário e respostas das questões até o cálculo e exibição do resultado nas etapas 20 e 21. Os componentes criados são reutilizáveis e podem ser facilmente personalizados pelo editor visual.
