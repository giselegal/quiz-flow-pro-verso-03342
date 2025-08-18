# 🎯 EXEMPLO PRÁTICO: useReusableComponents

## 🚀 COMO USAR NO SEU QUIZ DE ESTILO

### 1. 📦 DEFINIR COMPONENTES REUTILIZÁVEIS

```typescript
// Componentes da sua marca Gisele Galvão
const brandComponents = {
  'gisele-header': {
    display_name: 'Header Gisele Galvão',
    default_properties: {
      logoUrl: 'https://res.cloudinary.com/.../LOGO_DA_MARCA_GISELE.webp',
      backgroundColor: 'transparent',
      logoWidth: 120,
    },
  },

  'gisele-button': {
    display_name: 'Botão Marca Gisele',
    default_properties: {
      backgroundColor: '#B89B7A',
      textColor: '#ffffff',
      borderRadius: 'rounded-full',
      fontFamily: 'Playfair Display',
    },
  },

  'style-question': {
    display_name: 'Pergunta de Estilo',
    default_properties: {
      fontSize: 'text-2xl',
      fontWeight: 'font-bold',
      color: '#432818',
      textAlign: 'text-center',
    },
  },
};
```

### 2. 🎯 USAR NO QUIZ

```typescript
function QuizBuilder() {
  const { addComponent, stepComponents } = useReusableComponents("estilo-quiz");

  // Adicionar header em todas as etapas
  const addHeaderToAllSteps = async () => {
    for (let step = 1; step <= 10; step++) {
      await addComponent("gisele-header", step, {
        progressValue: (step / 10) * 100,
        showBackButton: step > 1
      });
    }
  };

  // Adicionar pergunta específica
  const addStyleQuestion = async (stepNumber: number, question: string) => {
    await addComponent("style-question", stepNumber, {
      content: question,
      marginBottom: 24
    });
  };

  // Adicionar opções de estilo
  const addStyleOptions = async (stepNumber: number, options: any[]) => {
    await addComponent("options-grid", stepNumber, {
      options,
      columns: 2,
      showImages: true,
      multipleSelection: true
    });
  };

  return (
    <div>
      <button onClick={addHeaderToAllSteps}>
        Adicionar Headers em Todas as Etapas
      </button>

      <button onClick={() => addStyleQuestion(6, "QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?")}>
        Adicionar Pergunta Etapa 6
      </button>
    </div>
  );
}
```

### 3. 🔄 REUTILIZAÇÃO INTELIGENTE

```typescript
// Duplicar pergunta bem-sucedida para outros quizzes
const duplicateSuccessfulComponent = async () => {
  const bestPerformingQuestion = stepComponents[6].find(c => c.component_type === 'style-question');

  // Usar em novo quiz
  await duplicateComponent(bestPerformingQuestion.id, 3);
};

// Atualizar todos os botões da marca de uma vez
const updateBrandButtons = async () => {
  const allButtons = getComponentsByType('gisele-button');

  for (const button of allButtons) {
    await updateComponent(button.id, {
      properties: {
        ...button.properties,
        backgroundColor: '#D4C2A8', // Nova cor da marca
        boxShadow: 'shadow-xl',
      },
    });
  }
};
```

### 4. 🎨 BENEFÍCIOS VISUAIS

```typescript
// ANTES: Código repetitivo em cada step
const Step06 = () => (
  <div>
    <header logoUrl="..." backgroundColor="#B89B7A" />
    <h2 color="#432818" fontSize="text-2xl">Pergunta...</h2>
    <button backgroundColor="#B89B7A" borderRadius="rounded-full">Continuar</button>
  </div>
);

// DEPOIS: Componentes reutilizáveis
const Step06 = () => {
  const { getStepComponents } = useReusableComponents("estilo-quiz");
  const components = getStepComponents(6);

  return (
    <div>
      {components.map(component => (
        <ReusableComponent key={component.id} {...component} />
      ))}
    </div>
  );
};
```

### 5. 📊 VANTAGENS PRÁTICAS

✅ **Consistência Total**: Todos os headers iguais em todas as etapas
✅ **Manutenção Fácil**: Altere uma vez, atualiza em 21 steps
✅ **Velocidade**: Monte novos quizzes em minutos
✅ **Qualidade**: Componentes testados e validados
✅ **Marca Forte**: Visual consistente da Gisele Galvão

### 6. 🚀 RESULTADO FINAL

Com `useReusableComponents`, seu quiz passa de:

- ❌ 21 steps com código duplicado
- ❌ Inconsistências visuais
- ❌ Difícil manutenção

Para:

- ✅ Biblioteca de componentes da marca
- ✅ Montagem tipo LEGO
- ✅ Qualidade profissional garantida

**É como ter uma equipe de design trabalhando automaticamente para manter tudo consistente!** 🎨✨
