// ===== GUIA COMPLETO: ES7 React/Redux/React-Native/JS Snippets =====

// Este arquivo demonstra como usar todos os snippets da extensão ES7 React/Redux/React-Native/JS snippets

// ===== SNIPPETS BÁSICOS =====

// 1. COMPONENTES REACT
/*
rafce → React Arrow Function Component Export
rfc → React Function Component  
rfce → React Function Component Export
rafc → React Arrow Function Component
rcc → React Class Component
rcce → React Class Component Export
*/

// Exemplo usando "rafce":
import React from 'react';

const ComponenteExemplo = () => {
  return (
    <div>
      <h1>Componente criado com rafce</h1>
    </div>
  );
};

export default ComponenteExemplo;

// ===== HOOKS SNIPPETS =====

// 2. HOOKS
/*
useState → useState Hook
useEffect → useEffect Hook
useContext → useContext Hook
useReducer → useReducer Hook
useCallback → useCallback Hook
useMemo → useMemo Hook
useRef → useRef Hook
useImperativeHandle → useImperativeHandle Hook
useLayoutEffect → useLayoutEffect Hook
useDebugValue → useDebugValue Hook
*/

const ExemploHooks = () => {
  // useState - Digite "useState" + Tab
  const [count, setCount] = React.useState(0);

  // useEffect - Digite "useEffect" + Tab
  React.useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  // useCallback - Digite "useCallback" + Tab
  const handleClick = React.useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  // useMemo - Digite "useMemo" + Tab
  const expensiveValue = React.useMemo(() => {
    return count * 2;
  }, [count]);

  // useRef - Digite "useRef" + Tab
  const inputRef = React.useRef(null);

  return (
    <div>
      <p>Count: {count}</p>
      <p>Expensive: {expensiveValue}</p>
      <button onClick={handleClick}>Increment</button>
      <input ref={inputRef} />
    </div>
  );
};

// ===== IMPORT/EXPORT SNIPPETS =====

// 3. IMPORTS
/*
imp → import moduleName from 'module'
imn → import 'module'
imd → import { destructured } from 'module'
ime → import * as alias from 'module'
ima → import { originalName as aliasName } from 'module'
*/

// Exemplos:
// imp + Tab → import React from 'react'
// imd + Tab → import { useState, useEffect } from 'react'
// ime + Tab → import * as React from 'react'

// 4. EXPORTS
/*
exp → export default moduleName
exd → export { destructured } from 'module'
exa → export { originalName as aliasName } from 'module'
eno → export const functionName = () => {}
*/

// ===== CONSOLE SNIPPETS =====

// 5. CONSOLE
/*
clg → console.log()
clo → console.log('object', object)
ctr → console.trace()
cti → console.time()
cte → console.timeEnd()
*/

const exemploConsole = () => {
  // clg + Tab
  console.log('Hello World');

  // clo + Tab
  console.log('count', count);

  // ctr + Tab
  console.trace('trace');
};

// ===== FUNCTION SNIPPETS =====

// 6. FUNCTIONS
/*
anfn → const functionName = () => {}
nfn → const functionName = function() {}
fn → function functionName() {}
iife → (() => {})()
*/

// anfn + Tab
const minhaFuncao = () => {
  console.log('Função arrow');
};

// nfn + Tab
const minhaFuncao2 = function () {
  console.log('Função normal');
};

// fn + Tab
function minhaFuncao3() {
  console.log('Function declaration');
}

// ===== DESTRUCTURING SNIPPETS =====

// 7. DESTRUCTURING
/*
dob → const { propertyName } = objectToDestructure
dar → const [propertyName] = arrayToDestructure
sti → setTimeout(() => {}, intervalInms)
si → setInterval(() => {}, intervalInms)
*/

const exemploDestructuring = () => {
  const user = { name: 'João', age: 30 };
  const numbers = [1, 2, 3, 4, 5];

  // dob + Tab
  const { name, age } = user;

  // dar + Tab
  const [first, second] = numbers;

  // sti + Tab
  setTimeout(() => {
    console.log('Timeout executado');
  }, 1000);

  // si + Tab
  setInterval(() => {
    console.log('Interval executado');
  }, 1000);
};

// ===== REACT NATIVE SNIPPETS =====

// 8. REACT NATIVE (se aplicável)
/*
rnstyle → const styles = StyleSheet.create({})
rncs → const componentName = () => { return (<View></View>) }
*/

// ===== REDUX SNIPPETS =====

// 9. REDUX
/*
reduxmap → const mapStateToProps = (state) => ({})
rxaction → export const actionName = (payload) => ({ type: 'ACTION_TYPE', payload })
rxreducer → const initialState = {}; export default (state = initialState, action) => {}
*/

// ===== SNIPPETS AVANÇADOS =====

// 10. CUSTOM HOOKS
const useCounter = (initialValue = 0) => {
  const [count, setCount] = React.useState(initialValue);

  const increment = React.useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  const decrement = React.useCallback(() => {
    setCount(prev => prev - 1);
  }, []);

  const reset = React.useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  return { count, increment, decrement, reset };
};

// 11. CONTEXT API
const ThemeContext = React.createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = React.useState('light');

  const toggleTheme = React.useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

// 12. useReducer Example
const initialState = { count: 0 };

const reducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return initialState;
    default:
      throw new Error();
  }
};

const ExemploReducer = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <div>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
};

// 13. forwardRef Example
const CustomInput = React.forwardRef((props, ref) => {
  return <input ref={ref} {...props} />;
});

// 14. memo Example
const MemoizedComponent = React.memo(({ title, count }) => {
  console.log('MemoizedComponent renderizado');
  return (
    <div>
      <h3>{title}</h3>
      <p>Count: {count}</p>
    </div>
  );
});

// 15. Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Algo deu errado!</h1>;
    }

    return this.props.children;
  }
}

// ===== COMO USAR OS SNIPPETS =====

/*
1. MÉTODO PRINCIPAL:
   - Digite o snippet (ex: rafce)
   - Pressione Tab ou Enter
   - O código será gerado automaticamente

2. NAVEGAÇÃO:
   - Use Tab para navegar entre placeholders
   - Digite o conteúdo desejado em cada placeholder

3. INTELLISENSE:
   - O VS Code mostrará sugestões enquanto você digita
   - Use ↑↓ para navegar nas sugestões
   - Enter ou Tab para aceitar

4. CUSTOMIZAÇÃO:
   - Ctrl+Shift+P → "Preferences: Configure User Snippets"
   - Escolha a linguagem (typescript, javascript, etc.)
   - Adicione seus próprios snippets
*/

// ===== SNIPPETS MAIS ÚTEIS PARA SEU PROJETO =====

// Para componentes de quiz:
const QuizComponent = () => {
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [answers, setAnswers] = React.useState([]);
  const [isCompleted, setIsCompleted] = React.useState(false);

  const handleAnswer = React.useCallback(
    answer => {
      setAnswers(prev => [...prev, answer]);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setIsCompleted(true);
      }
    },
    [currentQuestion]
  );

  const resetQuiz = React.useCallback(() => {
    setCurrentQuestion(0);
    setAnswers([]);
    setIsCompleted(false);
  }, []);

  return <div>{/* Quiz UI aqui */}</div>;
};

// Para hooks personalizados:
const useQuizState = () => {
  const [questions, setQuestions] = React.useState([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [userAnswers, setUserAnswers] = React.useState([]);

  const nextQuestion = React.useCallback(() => {
    setCurrentIndex(prev => prev + 1);
  }, []);

  const previousQuestion = React.useCallback(() => {
    setCurrentIndex(prev => prev - 1);
  }, []);

  const saveAnswer = React.useCallback(answer => {
    setUserAnswers(prev => [...prev, answer]);
  }, []);

  return {
    questions,
    currentIndex,
    userAnswers,
    nextQuestion,
    previousQuestion,
    saveAnswer,
  };
};

export {
  ComponenteExemplo,
  ExemploHooks,
  ExemploReducer,
  CustomInput,
  MemoizedComponent,
  ErrorBoundary,
  QuizComponent,
  useCounter,
  useQuizState,
};
