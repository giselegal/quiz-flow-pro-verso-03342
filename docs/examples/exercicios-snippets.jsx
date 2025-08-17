// ===== EXERCÍCIOS PRÁTICOS: ES7 SNIPPETS =====

/*
🎯 DESAFIOS PARA PRATICAR OS SNIPPETS

Objetivo: Criar componentes completos usando apenas snippets
Tempo estimado: 30 minutos
Nível: Iniciante a Avançado

INSTRUÇÕES:
1. Tente criar cada componente usando APENAS snippets
2. Não digite código manualmente - use os snippets
3. Pratique a navegação com Tab entre placeholders
4. Cronometre-se para melhorar a velocidade
*/

// ===== EXERCÍCIO 1: CONTADOR SIMPLES =====
/*
DESAFIO: Criar um contador usando snippets

Snippets para usar:
- rafce (componente)
- useState (estado)
- useCallback (funções)
- clg (debug)

RESULTADO ESPERADO:
- Componente funcional
- Estado para contador
- Botões para incrementar/decrementar
- Console.log para debug
*/

// SOLUÇÃO (não olhe antes de tentar!):
// 1. rafce + Tab
import React from 'react';

const ContadorExercicio = () => {
  // 2. useState + Tab
  const [count, setCount] = React.useState(0);

  // 3. useCallback + Tab (duas vezes)
  const increment = React.useCallback(() => {
    setCount(prev => prev + 1);
    // 4. clg + Tab
    console.log('Incrementado:', count + 1);
  }, [count]);

  const decrement = React.useCallback(() => {
    setCount(prev => prev - 1);
    // clg + Tab
    console.log('Decrementado:', count - 1);
  }, [count]);

  return (
    <div>
      <h2>Contador: {count}</h2>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
};

export default ContadorExercicio;

// ===== EXERCÍCIO 2: FORMULÁRIO COM VALIDAÇÃO =====
/*
DESAFIO: Criar um formulário com validação

Snippets para usar:
- rafce (componente)
- useState (múltiplos estados)
- useCallback (funções)
- useEffect (validação)
- dob (destructuring)
- try (tratamento de erro)

RESULTADO ESPERADO:
- Formulário com nome e email
- Validação em tempo real
- Feedback visual de erro
- Função de submit
*/

// SOLUÇÃO:
// rafce + Tab
const FormularioExercicio = () => {
  // useState + Tab (múltiplas vezes)
  const [formData, setFormData] = React.useState({
    nome: '',
    email: '',
  });
  const [errors, setErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // useCallback + Tab
  const handleChange = React.useCallback(e => {
    // dob + Tab
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // useEffect + Tab
  React.useEffect(() => {
    const validateForm = () => {
      const newErrors = {};

      if (!formData.nome.trim()) {
        newErrors.nome = 'Nome é obrigatório';
      }

      if (!formData.email.includes('@')) {
        newErrors.email = 'Email inválido';
      }

      setErrors(newErrors);
    };

    validateForm();
  }, [formData]);

  // useCallback + Tab
  const handleSubmit = React.useCallback(
    async e => {
      e.preventDefault();
      setIsSubmitting(true);

      // try + Tab
      try {
        // Simular envio
        await new Promise(resolve => setTimeout(resolve, 1000));
        // clg + Tab
        console.log('Formulário enviado:', formData);
        alert('Formulário enviado com sucesso!');
      } catch (error) {
        console.error('Erro ao enviar:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData]
  );

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          value={formData.nome}
          onChange={handleChange}
        />
        {errors.nome && <span className="error">{errors.nome}</span>}
      </div>

      <div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  );
};

// ===== EXERCÍCIO 3: LISTA COM FILTRO =====
/*
DESAFIO: Criar uma lista de itens com filtro

Snippets para usar:
- rafce (componente)
- useState (estado)
- useMemo (filtro)
- useCallback (funções)
- useEffect (dados)
- dob (destructuring)

RESULTADO ESPERADO:
- Lista de produtos
- Campo de busca
- Filtro em tempo real
- Contagem de resultados
*/

// SOLUÇÃO:
// rafce + Tab
const ListaComFiltro = () => {
  // useState + Tab (múltiplas vezes)
  const [produtos, setProdutos] = React.useState([]);
  const [filtro, setFiltro] = React.useState('');

  // useEffect + Tab
  React.useEffect(() => {
    // Simular carregamento de dados
    const dadosMock = [
      { id: 1, nome: 'Produto A', categoria: 'categoria1' },
      { id: 2, nome: 'Produto B', categoria: 'categoria2' },
      { id: 3, nome: 'Produto C', categoria: 'categoria1' },
    ];
    setProdutos(dadosMock);
  }, []);

  // useMemo + Tab
  const produtosFiltrados = React.useMemo(() => {
    if (!filtro) return produtos;
    return produtos.filter(produto => produto.nome.toLowerCase().includes(filtro.toLowerCase()));
  }, [produtos, filtro]);

  // useCallback + Tab
  const handleFilterChange = React.useCallback(e => {
    setFiltro(e.target.value);
  }, []);

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar produtos..."
        value={filtro}
        onChange={handleFilterChange}
      />

      <p>Mostrando {produtosFiltrados.length} produtos</p>

      <ul>
        {produtosFiltrados.map(produto => (
          <li key={produto.id}>
            {produto.nome} - {produto.categoria}
          </li>
        ))}
      </ul>
    </div>
  );
};

// ===== EXERCÍCIO 4: HOOK PERSONALIZADO =====
/*
DESAFIO: Criar um hook personalizado para timer

Snippets para usar:
- anfn (função)
- useState (estado)
- useEffect (timer)
- useCallback (controles)
- sti (setTimeout)

RESULTADO ESPERADO:
- Hook useTimer
- Controles de start/stop/reset
- Formatação de tempo
- Cleanup automático
*/

// SOLUÇÃO:
// anfn + Tab
const useTimer = (initialSeconds = 0) => {
  // useState + Tab (múltiplas vezes)
  const [seconds, setSeconds] = React.useState(initialSeconds);
  const [isRunning, setIsRunning] = React.useState(false);

  // useEffect + Tab
  React.useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  // useCallback + Tab (múltiplas vezes)
  const start = React.useCallback(() => {
    setIsRunning(true);
  }, []);

  const stop = React.useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = React.useCallback(() => {
    setSeconds(initialSeconds);
    setIsRunning(false);
  }, [initialSeconds]);

  // useMemo + Tab
  const formattedTime = React.useMemo(() => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [seconds]);

  return {
    seconds,
    formattedTime,
    isRunning,
    start,
    stop,
    reset,
  };
};

// Componente que usa o hook
// rafce + Tab
const TimerComponent = () => {
  const { formattedTime, isRunning, start, stop, reset } = useTimer(0);

  return (
    <div>
      <h2>Timer: {formattedTime}</h2>
      <button onClick={start} disabled={isRunning}>
        Start
      </button>
      <button onClick={stop} disabled={!isRunning}>
        Stop
      </button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};

// ===== EXERCÍCIO 5: COMPONENTE COM CONTEXT =====
/*
DESAFIO: Criar um sistema de tema com Context

Snippets para usar:
- rafce (componentes)
- useState (estado)
- useCallback (funções)
- useContext (consumo)
- memo (otimização)

RESULTADO ESPERADO:
- Context para tema
- Provider component
- Hook para usar tema
- Componente que consome tema
*/

// SOLUÇÃO:
// Primeiro, criar o Context
const ThemeContext = React.createContext();

// rafce + Tab
const ThemeProvider = ({ children }) => {
  // useState + Tab
  const [theme, setTheme] = React.useState('light');

  // useCallback + Tab
  const toggleTheme = React.useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

// Hook personalizado
// anfn + Tab
const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  return context;
};

// Componente que consome o tema
// memo + Tab
const ThemedComponent = React.memo(() => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`theme-${theme}`}>
      <h2>Tema atual: {theme}</h2>
      <button onClick={toggleTheme}>Alternar para {theme === 'light' ? 'dark' : 'light'}</button>
    </div>
  );
});

// ===== EXERCÍCIO FINAL: MINI QUIZ =====
/*
DESAFIO FINAL: Criar um mini quiz usando todos os snippets aprendidos

Combine todos os snippets para criar:
- Componente principal do quiz
- Hook para gerenciar estado
- Componente de pergunta
- Componente de resultado
- Context para dados globais
- Tratamento de erros

Use sua criatividade!
*/

// Sua solução aqui... (tente fazer antes de ver a solução abaixo)

// SOLUÇÃO COMPLETA:
// Context para o quiz
const QuizContext = React.createContext();

// rafce + Tab
const QuizProvider = ({ children }) => {
  // useState + Tab
  const [quizState, setQuizState] = React.useState({
    questions: [
      {
        id: 1,
        text: 'Qual é a capital do Brasil?',
        options: ['Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador'],
        correct: 2,
      },
      {
        id: 2,
        text: 'Quanto é 2 + 2?',
        options: ['3', '4', '5', '6'],
        correct: 1,
      },
    ],
    currentQuestion: 0,
    answers: [],
    score: 0,
    isCompleted: false,
  });

  // useCallback + Tab
  const updateQuizState = React.useCallback(updates => {
    setQuizState(prev => ({ ...prev, ...updates }));
  }, []);

  return (
    <QuizContext.Provider value={{ quizState, updateQuizState }}>{children}</QuizContext.Provider>
  );
};

// Hook personalizado
// anfn + Tab
const useQuiz = () => {
  const context = React.useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz deve ser usado dentro de QuizProvider');
  }
  return context;
};

// Componente de pergunta
// memo + Tab
const QuizQuestion = React.memo(() => {
  const { quizState, updateQuizState } = useQuiz();
  // dob + Tab
  const { questions, currentQuestion, answers } = quizState;

  // useState + Tab
  const [selectedAnswer, setSelectedAnswer] = React.useState(null);

  // useCallback + Tab
  const handleAnswer = React.useCallback(
    answerIndex => {
      const isCorrect = answerIndex === questions[currentQuestion].correct;
      const newAnswers = [
        ...answers,
        { questionIndex: currentQuestion, answer: answerIndex, isCorrect },
      ];

      if (currentQuestion < questions.length - 1) {
        updateQuizState({
          currentQuestion: currentQuestion + 1,
          answers: newAnswers,
          score: isCorrect ? quizState.score + 1 : quizState.score,
        });
      } else {
        updateQuizState({
          answers: newAnswers,
          score: isCorrect ? quizState.score + 1 : quizState.score,
          isCompleted: true,
        });
      }

      // clg + Tab
      console.log('Resposta selecionada:', answerIndex, 'Correta:', isCorrect);
    },
    [currentQuestion, questions, answers, quizState.score, updateQuizState]
  );

  if (currentQuestion >= questions.length) {
    return null;
  }

  const question = questions[currentQuestion];

  return (
    <div className="quiz-question">
      <h2>
        Pergunta {currentQuestion + 1} de {questions.length}
      </h2>
      <h3>{question.text}</h3>
      <div className="options">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            className={selectedAnswer === index ? 'selected' : ''}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
});

// Componente de resultado
// rafce + Tab
const QuizResult = () => {
  const { quizState, updateQuizState } = useQuiz();
  // dob + Tab
  const { score, questions } = quizState;

  // useMemo + Tab
  const percentage = React.useMemo(() => {
    return Math.round((score / questions.length) * 100);
  }, [score, questions.length]);

  // useCallback + Tab
  const restart = React.useCallback(() => {
    updateQuizState({
      currentQuestion: 0,
      answers: [],
      score: 0,
      isCompleted: false,
    });
  }, [updateQuizState]);

  return (
    <div className="quiz-result">
      <h2>Quiz Finalizado!</h2>
      <p>
        Você acertou {score} de {questions.length} perguntas
      </p>
      <p>Porcentagem: {percentage}%</p>
      <button onClick={restart}>Refazer Quiz</button>
    </div>
  );
};

// Componente principal
// rafce + Tab
const MiniQuiz = () => {
  const { quizState } = useQuiz();

  return (
    <div className="mini-quiz">
      <h1>Mini Quiz</h1>
      {quizState.isCompleted ? <QuizResult /> : <QuizQuestion />}
    </div>
  );
};

// App principal
// rafce + Tab
const QuizApp = () => {
  return (
    <QuizProvider>
      <MiniQuiz />
    </QuizProvider>
  );
};

// ===== RESUMO DOS SNIPPETS USADOS =====
/*
✅ rafce - Componente funcional com export (6x)
✅ useState - Hook de estado (5x)
✅ useCallback - Callback memoizado (8x)
✅ useMemo - Valor memoizado (2x)
✅ useEffect - Efeito (2x)
✅ useContext - Context hook (2x)
✅ memo - Componente memoizado (2x)
✅ dob - Destructuring object (3x)
✅ anfn - Arrow function (3x)
✅ clg - Console.log (2x)
✅ try - Try/catch (1x)
✅ sti - setTimeout (1x)

TOTAL: 37 snippets usados!
*/

export {
  ContadorExercicio,
  FormularioExercicio,
  ListaComFiltro,
  TimerComponent,
  ThemedComponent,
  ThemeProvider,
  QuizApp,
  useTimer,
  useTheme,
  useQuiz,
};
