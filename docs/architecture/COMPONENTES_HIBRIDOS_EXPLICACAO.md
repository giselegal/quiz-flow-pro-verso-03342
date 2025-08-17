# Componentes Híbridos: JSON + React

## 🔄 Como Funciona a Abordagem Híbrida?

### 1. JSON COMO TEMPLATE (Configuração)

```json
{
  "type": "quiz-section",
  "config": {
    "layout": "cards",
    "animation": "fade",
    "spacing": "md"
  },
  "content": {
    "title": "Seção de Perguntas",
    "items": [
      {
        "type": "multiple-choice",
        "question": "Qual sua cor favorita?",
        "options": ["Azul", "Verde", "Vermelho"]
      }
    ]
  }
}
```

### 2. COMPONENTE COMO EXECUTOR (Implementação)

```tsx
const HybridQuizSection: React.FC<{ template: QuizTemplate }> = ({ template }) => {
  // 1. Interpretação do Template
  const { config, content } = template;

  // 2. Lógica & Estado
  const [answers, setAnswers] = useState({});

  // 3. Processamento Dinâmico
  const processAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  // 4. Renderização Inteligente
  return (
    <section className={`quiz-section layout-${config.layout}`}>
      <motion.div animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <h2>{content.title}</h2>
        {content.items.map(item => (
          <QuizItem key={item.question} data={item} onAnswer={processAnswer} />
        ))}
      </motion.div>
    </section>
  );
};
```

## 🎯 BENEFÍCIOS DA ABORDAGEM HÍBRIDA

### 1. Flexibilidade + Poder

- ✅ **JSON**: Define estrutura e conteúdo
- ✅ **React**: Implementa comportamento e interatividade

### 2. Separação de Responsabilidades

```typescript
// 1. Configuração (JSON)
const questionTemplate = {
  type: "styled-question",
  theme: "modern",
  content: { /* ... */ }
};

// 2. Implementação (React)
const StyledQuestion = ({ template }) => {
  // Lógica complexa aqui
  return <ComponenteDinamico {...template} />;
};
```

## 🔧 COMO IMPLEMENTAMOS

### 1. Template Registry (Mapeamento)

```typescript
const ComponentRegistry = {
  "quiz-question": QuizQuestionComponent,
  "result-card": ResultCardComponent,
  "style-analysis": StyleAnalysisComponent,
};
```

### 2. Template Resolver (Execução)

```typescript
const TemplateResolver: React.FC<{ template: any }> = ({ template }) => {
  const Component = ComponentRegistry[template.type];

  if (!Component) {
    console.error(`Componente não encontrado: ${template.type}`);
    return null;
  }

  return <Component {...template.properties} />;
};
```

## 📈 VANTAGENS PRÁTICAS

1. **Manutenção Simplificada**
   - JSON: Fácil de modificar conteúdo
   - React: Lógica centralizada

2. **Reutilização**
   - Templates podem ser reutilizados
   - Componentes são genéricos

3. **Escalabilidade**
   - Novos templates sem mudar código
   - Lógica complexa encapsulada

## 🎯 CONCLUSÃO

A abordagem híbrida nos permite:

1. **Configurar** com JSON (estrutura/conteúdo)
2. **Executar** com React (comportamento/interatividade)
3. **Escalar** facilmente (templates + componentes)

É como ter uma **receita configurável** (JSON) com um **chef experiente** (React) que sabe como interpretá-la e executá-la perfeitamente! 🚀
