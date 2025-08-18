/**
 * GUIA PRÁTICO: ES7 React/Redux/React-Native/JS Snippets
 *
 * Este arquivo demonstra como usar os snippets mais úteis da extensão
 * ES7+ React/Redux/React-Native snippets no VS Code
 *
 * COMO USAR:
 * 1. Digite o snippet (ex: rafce)
 * 2. Pressione Tab ou Enter
 * 3. O código será gerado automaticamente
 * 4. Use Tab para navegar entre placeholders
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';

// ===== COMPONENTES BÁSICOS =====

// 1. RAFCE - React Arrow Function Component Export
// Digite: rafce + Tab
export const ComponenteBasico = () => {
  return (
    <div>
      <h1>Componente criado com rafce</h1>
    </div>
  );
};

// 2. RAFC - React Arrow Function Component
// Digite: rafc + Tab
const ComponenteArrow = () => {
  return (
    <div>
      <h2>Componente Arrow Function</h2>
    </div>
  );
};

// 3. RFC - React Function Component
// Digite: rfc + Tab
function ComponenteFuncao() {
  return (
    <div>
      <h2>Componente Function</h2>
    </div>
  );
}

// ===== HOOKS BÁSICOS =====

export const ExemplosHooks = () => {
  // 4. Digite: useState + Tab
  const [count, setCount] = useState(0);

  // 5. Digite: useEffect + Tab
  useEffect(() => {
    console.log('Component mounted');
  }, []);

  // 6. Digite: useCallback + Tab
  const handleClick = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  // 7. Digite: useMemo + Tab
  const expensiveValue = useMemo(() => {
    return count * 2;
  }, [count]);

  return (
    <div>
      <p>Count: {count}</p>
      <p>Expensive Value: {expensiveValue}</p>
      <button onClick={handleClick}>Increment</button>
    </div>
  );
};

// ===== HOOKS CUSTOMIZADOS =====

// 8. Hook para contador
// Digite: const use + Tab para começar
const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  const decrement = useCallback(() => {
    setCount(prev => prev - 1);
  }, []);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  return { count, increment, decrement, reset };
};

// 9. Hook para toggle
const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  return [value, toggle] as const;
};

// 10. Hook para localStorage
const useLocalStorage = (key: string, initialValue: string) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: string) => {
      try {
        setStoredValue(value);
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Erro ao salvar no localStorage:', error);
      }
    },
    [key]
  );

  return [storedValue, setValue] as const;
};

// ===== EXEMPLOS PRÁTICOS PARA SEU PROJETO =====

// 11. Componente de Quiz Question usando snippets
export const QuizQuestion = () => {
  // Digite: useState + Tab
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);

  // Digite: useCallback + Tab
  const handleAnswerSelect = useCallback((answer: string) => {
    setSelectedAnswer(answer);
    setIsAnswered(true);
  }, []);

  // Digite: useEffect + Tab
  useEffect(() => {
    if (isAnswered) {
      console.log('Answer selected:', selectedAnswer);
    }
  }, [isAnswered, selectedAnswer]);

  const options = ['Elegante', 'Casual', 'Romântico', 'Moderno'];

  return (
    <div className="quiz-question">
      <h3>Qual seu estilo preferido?</h3>
      <div className="options">
        {options.map(option => (
          <button
            key={option}
            onClick={() => handleAnswerSelect(option)}
            className={selectedAnswer === option ? 'selected' : ''}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

// 12. Componente de Timer usando hooks customizados
export const Timer = () => {
  const [time, setTime] = useState(300); // 5 minutos
  const [isRunning, toggleRunning] = useToggle(false);

  // Digite: useEffect + Tab
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      toggleRunning(); // Para o timer quando chega a zero
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, time, toggleRunning]);

  // Digite: useMemo + Tab
  const formattedTime = useMemo(() => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [time]);

  return (
    <div className="timer">
      <h2>Tempo restante: {formattedTime}</h2>
      <button onClick={toggleRunning}>{isRunning ? 'Pausar' : 'Iniciar'}</button>
    </div>
  );
};

// 13. Componente de Formulário usando hooks customizados
export const FormularioContato = () => {
  const [nome, setNome] = useLocalStorage('nome', '');
  const [email, setEmail] = useLocalStorage('email', '');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Digite: useCallback + Tab
  const validate = useCallback(() => {
    const newErrors: { [key: string]: string } = {};

    if (!nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [nome, email]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (validate()) {
        console.log('Formulário válido:', { nome, email });
        // Aqui você pode enviar para sua API
      }
    },
    [nome, email, validate]
  );

  return (
    <form onSubmit={handleSubmit} className="formulario">
      <div className="form-group">
        <label htmlFor="nome">Nome:</label>
        <input
          id="nome"
          type="text"
          value={nome}
          onChange={e => setNome(e.target.value)}
          className={errors.nome ? 'error' : ''}
        />
        {errors.nome && <span className="error-text">{errors.nome}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>

      <button type="submit">Enviar</button>
    </form>
  );
};

// ===== SNIPPETS PARA IMPORTS =====

// 14. Digite: imp + Tab
// import moduleName from 'module';

// 15. Digite: imd + Tab
// import { destructured } from 'module';

// 16. Digite: ime + Tab
// import * as alias from 'module';

// 17. Digite: ima + Tab
// import { originalName as aliasName } from 'module';

// ===== SNIPPETS PARA EXPORTS =====

// 18. Digite: exp + Tab
// export default moduleName;

// 19. Digite: exd + Tab
// export { destructured } from 'module';

// ===== SNIPPETS PARA DEBUGGING =====

// 20. Digite: clg + Tab
console.log('Debug message');

// 21. Digite: clo + Tab
// console.log('object', object);

// ===== SNIPPETS PARA FUNÇÕES =====

// 22. Digite: anfn + Tab
const minhaFuncao = () => {
  // código aqui
};

// 23. Digite: nfn + Tab
function minhaFuncaoNomeada() {
  // código aqui
}

// ===== SNIPPETS PARA DESTRUCTURING =====

// 24. Digite: dob + Tab
// const { propriedade } = objeto;

// 25. Digite: dar + Tab
// const [primeiro, segundo] = array;

// ===== EXEMPLO FINAL: APLICAÇÃO DOS SNIPPETS =====

export const AplicacaoCompleta = () => {
  // Usando múltiplos hooks customizados
  const { count, increment, decrement, reset } = useCounter(0);
  const [isVisible, toggleVisible] = useToggle(false);
  const [userName, setUserName] = useLocalStorage('userName', '');

  // Digite: useEffect + Tab
  useEffect(() => {
    console.log('Componente montado');
  }, []);

  // Digite: useCallback + Tab
  const handleSaveUser = useCallback(() => {
    if (userName.trim()) {
      console.log('Usuário salvo:', userName);
    }
  }, [userName]);

  return (
    <div className="aplicacao-completa">
      <h1>Aplicação Completa com Snippets</h1>

      <div className="contador">
        <h2>Contador: {count}</h2>
        <button onClick={increment}>+</button>
        <button onClick={decrement}>-</button>
        <button onClick={reset}>Reset</button>
      </div>

      <div className="toggle">
        <button onClick={toggleVisible}>{isVisible ? 'Ocultar' : 'Mostrar'}</button>
        {isVisible && <p>Conteúdo visível!</p>}
      </div>

      <div className="user-form">
        <input
          type="text"
          value={userName}
          onChange={e => setUserName(e.target.value)}
          placeholder="Digite seu nome"
        />
        <button onClick={handleSaveUser}>Salvar</button>
      </div>

      <QuizQuestion />
      <Timer />
      <FormularioContato />
    </div>
  );
};

// ===== RESUMO DOS SNIPPETS MAIS ÚTEIS =====

/*
COMPONENTES:
- rafce → React Arrow Function Component Export
- rafc → React Arrow Function Component
- rfc → React Function Component

HOOKS:
- useState → const [state, setState] = useState()
- useEffect → useEffect(() => {}, [])
- useCallback → useCallback(() => {}, [])
- useMemo → useMemo(() => {}, [])

IMPORTS:
- imp → import moduleName from 'module'
- imd → import { destructured } from 'module'
- ime → import * as alias from 'module'

DEBUGGING:
- clg → console.log()
- clo → console.log('object', object)

FUNÇÕES:
- anfn → const functionName = () => {}
- nfn → function functionName() {}

DESTRUCTURING:
- dob → const { property } = object
- dar → const [first, second] = array

DICA: Sempre use Tab para navegar entre os placeholders após gerar o snippet!
*/

export default AplicacaoCompleta;
