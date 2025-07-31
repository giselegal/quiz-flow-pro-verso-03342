// Exemplo de uso dos snippets ES7 React
import React from 'react';
import ReactDOM from 'react-dom';
import { render, fireEvent } from '@testing-library/react';

// 1. Digite "rafce" e pressione Tab para criar este componente:
interface ExemploSnippetsProps {
  title: string;
}

const ExemploSnippets: React.FC<ExemploSnippetsProps> = ({ title }) => {
  // 2. Digite "useState" e pressione Tab:
  const [count, setCount] = React.useState(0);
  
  // 3. Digite "useEffect" e pressione Tab:
  React.useEffect(() => {
    console.log('Component mounted');
  }, []);

  // 4. Digite "useCallback" e pressione Tab:
  const handleClick = React.useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  // 5. Digite "useMemo" e pressione Tab:
  const expensiveValue = React.useMemo(() => {
    return count * 2;
  }, [count]);

  return (
    <div>
      <h1>{title}</h1>
      <p>Count: {count}</p>
      <p>Expensive Value: {expensiveValue}</p>
      <button onClick={handleClick}>Increment</button>
    </div>
  );
};

export default ExemploSnippets;

// Outros exemplos de snippets úteis:

// Digite "clg" + Tab:
console.log('Debug message');

// Digite "clo" + Tab (exemplo com variável):
// console.log('count', count);

// Digite "dob" + Tab (exemplo com props):
// const { title: pageTitle } = props;

// Digite "dar" + Tab (exemplo com array):
// const [first, second] = myArray;

// Digite "anfn" + Tab:
const myFunction = () => {
  // código aqui
};

// Outros imports úteis:
// Digite "imp" + Tab: import moduleName from 'module';
// Digite "imd" + Tab: import { destructured } from 'module';
// Digite "ime" + Tab: import * as alias from 'module';

// ===== SNIPPETS AVANÇADOS PARA REACT =====

// 1. CUSTOM HOOKS (Digite "uch" + Tab):
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

// 2. CONTEXT SETUP (Digite "rccontext" + Tab):
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  
  const toggleTheme = React.useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. REDUCER SETUP (Digite "ureducer" + Tab):
interface CounterState {
  count: number;
  loading: boolean;
  error: string | null;
}

type CounterAction = 
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'RESET' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const counterReducer = (state: CounterState, action: CounterAction): CounterState => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'RESET':
      return { ...state, count: 0 };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

// 4. COMPONENTE COM FORWARDREF (Digite "forwardRef" + Tab):
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

const CustomButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, onClick, variant = 'primary' }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        className={`btn btn-${variant}`}
      >
        {children}
      </button>
    );
  }
);

CustomButton.displayName = 'CustomButton';

// 5. MEMO COMPONENT (Digite "memo" + Tab):
interface MemoComponentProps {
  title: string;
  count: number;
}

const MemoComponent = React.memo<MemoComponentProps>(({ title, count }) => {
  console.log('MemoComponent renderizado');
  
  return (
    <div>
      <h3>{title}</h3>
      <p>Count: {count}</p>
    </div>
  );
});

MemoComponent.displayName = 'MemoComponent';

// 6. LAZY LOADING (Digite "lazy" + Tab):
const LazyComponent = React.lazy(() => import('./LazyComponent'));

const ComponentWithSuspense: React.FC = () => {
  return (
    <React.Suspense fallback={<div>Carregando...</div>}>
      <LazyComponent />
    </React.Suspense>
  );
};

// 7. ERROR BOUNDARY (Digite "rcep" + Tab):
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Algo deu errado!</h2>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// 8. PORTAL (Digite "portal" + Tab):
const Modal: React.FC<{ children: React.ReactNode; isOpen: boolean }> = ({ 
  children, 
  isOpen 
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
      </div>
    </div>,
    document.body
  );
};

// 9. REFS E IMPERATIVE HANDLE (Digite "useImperativeHandle" + Tab):
interface InputRefType {
  focus: () => void;
  clear: () => void;
}

const CustomInput = React.forwardRef<InputRefType, { placeholder?: string }>(
  ({ placeholder }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    
    React.useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      clear: () => {
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      }
    }));
    
    return <input ref={inputRef} placeholder={placeholder} />;
  }
);

// 10. ASYNC EFFECTS (Digite "useAsyncEffect" + Tab):
const useAsyncEffect = (
  effect: () => Promise<void>,
  deps: React.DependencyList
) => {
  React.useEffect(() => {
    effect();
  }, deps);
};

// Exemplo de uso dos snippets avançados:
const AdvancedExample: React.FC = () => {
  const { count, increment, decrement, reset } = useCounter(0);
  const [loading, setLoading] = React.useState(false);
  const inputRef = React.useRef<InputRefType>(null);
  
  // Digite "useAsyncEffect" + Tab:
  useAsyncEffect(async () => {
    setLoading(true);
    try {
      // Simular chamada async
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setLoading(false);
    }
  }, []);
  
  const handleFocus = React.useCallback(() => {
    inputRef.current?.focus();
  }, []);
  
  const handleClear = React.useCallback(() => {
    inputRef.current?.clear();
  }, []);
  
  if (loading) {
    return <div>Carregando dados...</div>;
  }
  
  return (
    <ErrorBoundary>
      <div>
        <h2>Exemplo Avançado</h2>
        <p>Count: {count}</p>
        <button onClick={increment}>+</button>
        <button onClick={decrement}>-</button>
        <button onClick={reset}>Reset</button>
        
        <CustomInput ref={inputRef} placeholder="Digite algo..." />
        <button onClick={handleFocus}>Focus Input</button>
        <button onClick={handleClear}>Clear Input</button>
        
        <MemoComponent title="Memo Component" count={count} />
        
        <ComponentWithSuspense />
      </div>
    </ErrorBoundary>
  );
};

// ===== SNIPPETS PARA TYPESCRIPT =====

// 1. INTERFACE (Digite "interface" + Tab):
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// 2. TYPE ALIAS (Digite "type" + Tab):
type Status = 'idle' | 'loading' | 'success' | 'error';

// 3. GENERIC TYPE (Digite "generic" + Tab):
type Optional<T> = {
  [K in keyof T]?: T[K];
};

// 4. UNION TYPE (Digite "union" + Tab):
type Theme = 'light' | 'dark' | 'auto';

// 5. MAPPED TYPE (Digite "mapped" + Tab):
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

// ===== SNIPPETS PARA TESTING =====

// 1. TESTE BÁSICO (Digite "test" + Tab):
describe('ExemploSnippets', () => {
  it('should render correctly', () => {
    // Arrange
    const props = { title: 'Test Title' };
    
    // Act
    const result = render(<ExemploSnippets {...props} />);
    
    // Assert
    expect(result.getByText('Test Title')).toBeInTheDocument();
  });
  
  it('should increment count when button is clicked', () => {
    // Arrange
    const props = { title: 'Test' };
    const { getByText } = render(<ExemploSnippets {...props} />);
    
    // Act
    fireEvent.click(getByText('Increment'));
    
    // Assert
    expect(getByText('Count: 1')).toBeInTheDocument();
  });
});

// 2. MOCK (Digite "mock" + Tab):
const mockFunction = jest.fn();
const mockModule = jest.mock('./module', () => ({
  default: mockFunction
}));

// ===== SNIPPETS PARA PERFORMANCE =====

// 1. DEBOUNCE HOOK (Digite "useDebounce" + Tab):
const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// 2. THROTTLE HOOK (Digite "useThrottle" + Tab):
const useThrottle = <T>(value: T, delay: number): T => {
  const [throttledValue, setThrottledValue] = React.useState<T>(value);
  const lastExecuted = React.useRef<number>(Date.now());

  React.useEffect(() => {
    if (Date.now() >= lastExecuted.current + delay) {
      lastExecuted.current = Date.now();
      setThrottledValue(value);
    } else {
      const timerId = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, delay);

      return () => clearTimeout(timerId);
    }
  }, [value, delay]);

  return throttledValue;
};

// ===== SNIPPETS PARA API E DADOS =====

// 1. FETCH HOOK (Digite "useFetch" + Tab):
interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const useFetch = <T>(url: string): FetchState<T> => {
  const [state, setState] = React.useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setState({ data, loading: false, error: null });
      } catch (error) {
        setState({ 
          data: null, 
          loading: false, 
          error: error instanceof Error ? error.message : 'Erro desconhecido' 
        });
      }
    };

    fetchData();
  }, [url]);

  return state;
};

// 2. LOCAL STORAGE HOOK (Digite "useLocalStorage" + Tab):
const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = React.useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
};

// 3. PREVIOUS VALUE HOOK (Digite "usePrevious" + Tab):
const usePrevious = <T>(value: T): T | undefined => {
  const ref = React.useRef<T>();
  
  React.useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
};

// 4. TOGGLE HOOK (Digite "useToggle" + Tab):
const useToggle = (initialValue = false) => {
  const [value, setValue] = React.useState(initialValue);
  
  const toggle = React.useCallback(() => {
    setValue(prev => !prev);
  }, []);
  
  const setTrue = React.useCallback(() => {
    setValue(true);
  }, []);
  
  const setFalse = React.useCallback(() => {
    setValue(false);
  }, []);
  
  return [value, { toggle, setTrue, setFalse }] as const;
};

// 5. INTERVAL HOOK (Digite "useInterval" + Tab):
const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = React.useRef<() => void>();

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    const tick = () => {
      savedCallback.current?.();
    };
    
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

// ===== SNIPPETS PARA FORMULÁRIOS =====

// 1. FORM HOOK (Digite "useForm" + Tab):
interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
}

const useForm = <T extends Record<string, any>>(
  initialValues: T,
  validate?: (values: T) => Partial<Record<keyof T, string>>
) => {
  const [state, setState] = React.useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {}
  });

  const handleChange = React.useCallback((name: keyof T, value: any) => {
    setState(prev => ({
      ...prev,
      values: { ...prev.values, [name]: value },
      touched: { ...prev.touched, [name]: true }
    }));
  }, []);

  const handleBlur = React.useCallback((name: keyof T) => {
    setState(prev => ({
      ...prev,
      touched: { ...prev.touched, [name]: true }
    }));
  }, []);

  const handleSubmit = React.useCallback((onSubmit: (values: T) => void) => {
    return (e: React.FormEvent) => {
      e.preventDefault();
      
      const errors = validate ? validate(state.values) : {};
      
      setState(prev => ({
        ...prev,
        errors,
        touched: Object.keys(prev.values).reduce((acc, key) => ({
          ...acc,
          [key]: true
        }), {})
      }));

      if (Object.keys(errors).length === 0) {
        onSubmit(state.values);
      }
    };
  }, [state.values, validate]);

  const reset = React.useCallback(() => {
    setState({
      values: initialValues,
      errors: {},
      touched: {}
    });
  }, [initialValues]);

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset
  };
};

// 2. INPUT COMPONENT (Digite "input" + Tab):
interface InputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (name: string, value: string) => void;
  onBlur?: (name: string) => void;
  error?: string;
  touched?: boolean;
  placeholder?: string;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
  required
}) => {
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(name, e.target.value);
  }, [name, onChange]);

  const handleBlur = React.useCallback(() => {
    onBlur?.(name);
  }, [name, onBlur]);

  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`form-input ${error && touched ? 'error' : ''}`}
      />
      {error && touched && (
        <span className="error-message">{error}</span>
      )}
    </div>
  );
};

// ===== EXEMPLO PRÁTICO: QUIZ FORM =====

// 1. QUIZ FORM COMPONENT (Digite "rafce" + Tab):
interface QuizFormData {
  name: string;
  email: string;
  age: string;
  style: string;
}

const QuizForm: React.FC = () => {
  // Digite "useForm" + Tab:
  const validateForm = React.useCallback((values: QuizFormData) => {
    const errors: Partial<Record<keyof QuizFormData, string>> = {};
    
    if (!values.name.trim()) {
      errors.name = 'Nome é obrigatório';
    }
    
    if (!values.email.trim()) {
      errors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email inválido';
    }
    
    if (!values.age.trim()) {
      errors.age = 'Idade é obrigatória';
    } else if (parseInt(values.age) < 16) {
      errors.age = 'Idade deve ser maior que 16 anos';
    }
    
    return errors;
  }, []);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset
  } = useForm<QuizFormData>(
    {
      name: '',
      email: '',
      age: '',
      style: ''
    },
    validateForm
  );

  // Digite "useLocalStorage" + Tab:
  const [savedAnswers, setSavedAnswers] = useLocalStorage<QuizFormData | null>('quiz-answers', null);

  // Digite "useEffect" + Tab:
  React.useEffect(() => {
    if (savedAnswers) {
      Object.entries(savedAnswers).forEach(([key, value]) => {
        handleChange(key as keyof QuizFormData, value);
      });
    }
  }, [savedAnswers, handleChange]);

  // Digite "useCallback" + Tab:
  const handleFormSubmit = React.useCallback((formValues: QuizFormData) => {
    console.log('Form submitted:', formValues);
    setSavedAnswers(formValues);
    
    // Aqui você pode fazer a chamada para API
    // trackButtonClick('quiz_form_submit', 'Quiz Form Submitted', 'quiz_page');
  }, [setSavedAnswers]);

  const handleReset = React.useCallback(() => {
    reset();
    setSavedAnswers(null);
  }, [reset, setSavedAnswers]);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="quiz-form">
      <h2>Descobrir Seu Estilo</h2>
      
      <Input
        label="Nome"
        name="name"
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.name}
        touched={touched.name}
        placeholder="Digite seu nome"
        required
      />
      
      <Input
        label="Email"
        name="email"
        type="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.email}
        touched={touched.email}
        placeholder="Digite seu email"
        required
      />
      
      <Input
        label="Idade"
        name="age"
        type="number"
        value={values.age}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.age}
        touched={touched.age}
        placeholder="Digite sua idade"
        required
      />
      
      <div className="form-group">
        <label htmlFor="style" className="form-label">
          Estilo Preferido
        </label>
        <select
          id="style"
          name="style"
          value={values.style}
          onChange={(e) => handleChange('style', e.target.value)}
          className="form-select"
        >
          <option value="">Selecione um estilo</option>
          <option value="elegante">Elegante</option>
          <option value="casual">Casual</option>
          <option value="romantico">Romântico</option>
          <option value="moderno">Moderno</option>
        </select>
      </div>
      
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Descobrir Meu Estilo
        </button>
        <button type="button" onClick={handleReset} className="btn btn-secondary">
          Limpar
        </button>
      </div>
    </form>
  );
};

// ===== SNIPPETS PARA ANIMAÇÕES =====

// 1. FADE IN ANIMATION (Digite "useFadeIn" + Tab):
const useFadeIn = (duration = 300) => {
  const [isVisible, setIsVisible] = React.useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);
  
  return {
    opacity: isVisible ? 1 : 0,
    transition: `opacity ${duration}ms ease-in-out`
  };
};

// 2. SLIDE IN ANIMATION (Digite "useSlideIn" + Tab):
const useSlideIn = (direction: 'left' | 'right' | 'up' | 'down' = 'left', duration = 300) => {
  const [isVisible, setIsVisible] = React.useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);
  
  const getTransform = () => {
    if (!isVisible) {
      switch (direction) {
        case 'left': return 'translateX(-100%)';
        case 'right': return 'translateX(100%)';
        case 'up': return 'translateY(-100%)';
        case 'down': return 'translateY(100%)';
        default: return 'translateX(-100%)';
      }
    }
    return 'translateX(0)';
  };
  
  return {
    transform: getTransform(),
    transition: `transform ${duration}ms ease-in-out`
  };
};

// ===== EXEMPLO PRÁTICO: ANIMATED CARD =====

// 1. ANIMATED CARD COMPONENT (Digite "rafce" + Tab):
interface AnimatedCardProps {
  title: string;
  description: string;
  image?: string;
  delay?: number;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  title, 
  description, 
  image, 
  delay = 0 
}) => {
  const fadeInStyle = useFadeIn(500);
  const slideInStyle = useSlideIn('up', 400);
  
  // Digite "useState" + Tab:
  const [isHovered, setIsHovered] = React.useState(false);
  
  // Digite "useCallback" + Tab:
  const handleMouseEnter = React.useCallback(() => {
    setIsHovered(true);
  }, []);
  
  const handleMouseLeave = React.useCallback(() => {
    setIsHovered(false);
  }, []);
  
  return (
    <div 
      className="animated-card"
      style={{
        ...fadeInStyle,
        ...slideInStyle,
        transitionDelay: `${delay}ms`,
        transform: `${slideInStyle.transform} ${isHovered ? 'scale(1.05)' : 'scale(1)'}`,
        transition: `${slideInStyle.transition}, transform 200ms ease-in-out`
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {image && (
        <div className="card-image">
          <img src={image} alt={title} />
        </div>
      )}
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
      </div>
    </div>
  );
};

export { 
  ExemploSnippets, 
  AdvancedExample, 
  useCounter, 
  useDebounce, 
  useThrottle,
  ThemeProvider,
  CustomButton,
  ErrorBoundary
};
