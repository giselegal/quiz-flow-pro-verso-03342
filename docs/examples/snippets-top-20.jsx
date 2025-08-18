// ===== SNIPPETS TOP 20 PARA SEU PROJETO =====

/*
🚀 SNIPPETS ESSENCIAIS PARA PRODUTIVIDADE MÁXIMA

Como usar:
1. Digite o snippet
2. Pressione Tab
3. Preencha os placeholders
4. Use Tab para navegar entre campos
*/

// ===== 1. COMPONENTE FUNCIONAL COM EXPORT (rafce) =====
// Digite: rafce + Tab
import React from 'react';

const NomeDoComponente = () => {
  return <div></div>;
};

export default NomeDoComponente;

// ===== 2. USESTATE HOOK (useState) =====
// Digite: useState + Tab
const [state, setState] = React.useState(initialState);

// ===== 3. USEEFFECT HOOK (useEffect) =====
// Digite: useEffect + Tab
React.useEffect(() => {
  // efeito aqui
}, []);

// ===== 4. USECALLBACK HOOK (useCallback) =====
// Digite: useCallback + Tab
const memoizedCallback = React.useCallback(() => {
  // função aqui
}, []);

// ===== 5. USEMEMO HOOK (useMemo) =====
// Digite: useMemo + Tab
const memoizedValue = React.useMemo(() => {
  // computação aqui
}, []);

// ===== 6. CONSOLE.LOG (clg) =====
// Digite: clg + Tab
console.log('texto');

// ===== 7. CONSOLE.LOG COM OBJETO (clo) =====
// Digite: clo + Tab
console.log('objeto', objeto);

// ===== 8. ARROW FUNCTION (anfn) =====
// Digite: anfn + Tab
const functionName = () => {};

// ===== 9. IMPORT DEFAULT (imp) =====
// Digite: imp + Tab

// ===== 10. IMPORT DESTRUCTURING (imd) =====
// Digite: imd + Tab

// ===== 11. DESTRUCTURING OBJECT (dob) =====
// Digite: dob + Tab
const { propertyName } = objectToDestructure;

// ===== 12. DESTRUCTURING ARRAY (dar) =====
// Digite: dar + Tab
const [propertyName] = arrayToDestructure;

// ===== 13. SETTIMEOUT (sti) =====
// Digite: sti + Tab
setTimeout(() => {}, timeout);

// ===== 14. EXPORT DEFAULT (exp) =====
// Digite: exp + Tab
// export default moduleName;

// ===== 15. EXPORT NAMED (exd) =====
// Digite: exd + Tab
// export { destructured } from 'module';

// ===== 16. USEREF HOOK (useRef) =====
// Digite: useRef + Tab
const ref = React.useRef(initialValue);

// ===== 17. FORWARDREF (forwardRef) =====
// Digite: forwardRef + Tab
const ComponentName = React.forwardRef((props, ref) => {
  return <div ref={ref}></div>;
});

// ===== 18. MEMO (memo) =====
// Digite: memo + Tab
const MemoizedComponent = React.memo(({ prop }) => {
  return <div>{prop}</div>;
});

// ===== 19. CLASS COMPONENT (rcc) =====
// Digite: rcc + Tab
class ComponentName extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <div></div>;
  }
}

// ===== 20. TRY/CATCH (try) =====
// Digite: try + Tab
try {
  // código que pode falhar
} catch (error) {
  console.error(error);
}

// ===== SNIPPETS ESPECÍFICOS PARA SEU PROJETO =====

// 📝 TEMPLATE: Componente de Pergunta do Quiz
// Digite: rafce + Tab e personalize:
const QuizQuestion = ({ question, onAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = React.useState(null);

  const handleSubmit = React.useCallback(() => {
    if (selectedAnswer) {
      onAnswer(selectedAnswer);
    }
  }, [selectedAnswer, onAnswer]);

  return (
    <div className="quiz-question">
      <h2>{question.text}</h2>
      {question.options.map((option, index) => (
        <button
          key={index}
          onClick={() => setSelectedAnswer(option)}
          className={selectedAnswer === option ? 'selected' : ''}
        >
          {option.text}
        </button>
      ))}
      <button onClick={handleSubmit}>Responder</button>
    </div>
  );
};

// 📝 TEMPLATE: Hook Personalizado para Quiz
// Digite: uch + Tab e personalize:
const useQuizState = () => {
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [answers, setAnswers] = React.useState([]);
  const [isCompleted, setIsCompleted] = React.useState(false);

  const nextQuestion = React.useCallback(() => {
    setCurrentQuestion(prev => prev + 1);
  }, []);

  const saveAnswer = React.useCallback(answer => {
    setAnswers(prev => [...prev, answer]);
  }, []);

  return {
    currentQuestion,
    answers,
    isCompleted,
    nextQuestion,
    saveAnswer,
  };
};

// 📝 TEMPLATE: Componente de Resultado
// Digite: rafce + Tab e personalize:
const QuizResult = ({ score, totalQuestions, onRestart }) => {
  const percentage = React.useMemo(() => {
    return (score / totalQuestions) * 100;
  }, [score, totalQuestions]);

  React.useEffect(() => {
    // Analytics do resultado
    console.log('Quiz completed with score:', score);
  }, [score]);

  return (
    <div className="quiz-result">
      <h2>Resultado Final</h2>
      <div className="score">{percentage.toFixed(1)}%</div>
      <p>
        Você acertou {score} de {totalQuestions} perguntas
      </p>
      <button onClick={onRestart}>Refazer Quiz</button>
    </div>
  );
};

// 📝 TEMPLATE: Context para Estado Global
// Digite: rafce + Tab e personalize:
const QuizContext = React.createContext();

const QuizProvider = ({ children }) => {
  const [quizData, setQuizData] = React.useState({
    questions: [],
    currentIndex: 0,
    answers: [],
    isCompleted: false,
  });

  const updateQuizData = React.useCallback(updates => {
    setQuizData(prev => ({ ...prev, ...updates }));
  }, []);

  return (
    <QuizContext.Provider value={{ quizData, updateQuizData }}>{children}</QuizContext.Provider>
  );
};

// 📝 TEMPLATE: Hook para LocalStorage
// Digite: uch + Tab e personalize:
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = React.useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = React.useCallback(
    value => {
      try {
        setStoredValue(value);
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    },
    [key]
  );

  return [storedValue, setValue];
};

// 📝 TEMPLATE: Componente de Loading
// Digite: rafce + Tab e personalize:
const LoadingSpinner = ({ message = 'Carregando...' }) => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
};

// 📝 TEMPLATE: Hook para Fetch de Dados
// Digite: uch + Tab e personalize:
const useFetch = url => {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

// ===== SHORTCUTS DE PRODUTIVIDADE =====

/*
🔥 COMBINAÇÕES PODEROSAS:

1. Novo componente completo:
   rafce + Tab → Componente base
   useState + Tab → Estado
   useEffect + Tab → Efeitos
   useCallback + Tab → Callbacks otimizados

2. Hook personalizado:
   uch + Tab → Base do hook
   useState + Tab → Estado interno
   useCallback + Tab → Funções memorizadas
   useMemo + Tab → Valores computados

3. Debugging rápido:
   clg + Tab → Log simples
   clo + Tab → Log com label
   try + Tab → Try/catch block

4. Imports organizados:
   imp + Tab → Import default
   imd + Tab → Import destructured
   ime + Tab → Import tudo

5. Funções otimizadas:
   anfn + Tab → Arrow function
   useCallback + Tab → Callback otimizado
   useMemo + Tab → Valor memoizado
*/

// ===== CONFIGURAÇÃO DE SNIPPETS CUSTOMIZADOS =====

/*
Para criar seus próprios snippets:

1. Ctrl+Shift+P
2. "Preferences: Configure User Snippets"
3. Escolha "typescriptreact" ou "javascript"
4. Adicione seus snippets personalizados:

{
  "Quiz Component": {
    "prefix": "qcomp",
    "body": [
      "const $1 = ({ $2 }) => {",
      "  const [selected, setSelected] = React.useState(null);",
      "  ",
      "  const handleSelect = React.useCallback((value) => {",
      "    setSelected(value);",
      "  }, []);",
      "  ",
      "  return (",
      "    <div className=\"$3\">",
      "      $4",
      "    </div>",
      "  );",
      "};",
      "",
      "export default $1;"
    ],
    "description": "Componente de Quiz personalizado"
  }
}

Agora você pode usar "qcomp" + Tab para criar componentes de quiz rapidamente!
*/

export {
  LoadingSpinner,
  QuizProvider,
  QuizQuestion,
  QuizResult,
  useFetch,
  useLocalStorage,
  useQuizState,
};
