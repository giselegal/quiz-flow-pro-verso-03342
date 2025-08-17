/**
 * EXERCÍCIOS PRÁTICOS - ES7 REACT SNIPPETS
 *
 * Complete os exercícios usando os snippets ES7 React.
 * Cada exercício tem uma instrução e você deve usar o snippet correspondente.
 *
 * INSTRUÇÕES:
 * 1. Posicione o cursor onde indicado
 * 2. Digite o snippet sugerido
 * 3. Pressione Tab
 * 4. Complete o código
 */

import React from 'react';

// ===== EXERCÍCIO 1: COMPONENTES =====

// TODO: Crie um componente chamado "Header" usando rafce + Tab
// Cursor aqui:

// TODO: Crie um componente chamado "Footer" usando rafc + Tab
// Cursor aqui:

// TODO: Crie um componente chamado "Sidebar" usando rfc + Tab
// Cursor aqui:

// ===== EXERCÍCIO 2: HOOKS BÁSICOS =====

export const ExercicioHooks = () => {
  // TODO: Adicione um state para "nome" usando useState + Tab
  // Cursor aqui:

  // TODO: Adicione um state para "email" usando useState + Tab
  // Cursor aqui:

  // TODO: Adicione um useEffect que roda quando o componente monta
  // Digite: useEffect + Tab
  // Cursor aqui:

  // TODO: Adicione um useCallback para handleSubmit
  // Digite: useCallback + Tab
  // Cursor aqui:

  // TODO: Adicione um useMemo para validar o email
  // Digite: useMemo + Tab
  // Cursor aqui:

  return (
    <div>
      <h2>Exercício de Hooks</h2>
      {/* Complete o JSX aqui */}
    </div>
  );
};

// ===== EXERCÍCIO 3: HOOKS CUSTOMIZADOS =====

// TODO: Crie um hook customizado useCounter
// Dica: Use useState, useCallback
// Cursor aqui:

// TODO: Crie um hook customizado useApi para fetch de dados
// Dica: Use useState, useEffect, useCallback
// Cursor aqui:

// ===== EXERCÍCIO 4: IMPORTS E EXPORTS =====

// TODO: Adicione imports necessários usando snippets
// Digite: imp + Tab para React
// Digite: imd + Tab para hooks específicos
// Cursor aqui:

// TODO: Adicione exports usando snippets
// Digite: exp + Tab
// Cursor aqui:

// ===== EXERCÍCIO 5: DEBUGGING =====

export const ExercicioDebug = () => {
  const data = { name: 'João', age: 30 };
  const items = ['item1', 'item2', 'item3'];

  // TODO: Adicione um console.log simples usando clg + Tab
  // Cursor aqui:

  // TODO: Adicione um console.log com label usando clo + Tab
  // Cursor aqui:

  return <div>Debug Component</div>;
};

// ===== EXERCÍCIO 6: FUNÇÕES =====

// TODO: Crie uma arrow function usando anfn + Tab
// Cursor aqui:

// TODO: Crie uma function nomeada usando nfn + Tab
// Cursor aqui:

// ===== EXERCÍCIO 7: DESTRUCTURING =====

export const ExercicioDestructuring = () => {
  const user = { name: 'Maria', email: 'maria@email.com', age: 25 };
  const colors = ['red', 'green', 'blue'];

  // TODO: Faça destructuring do objeto user usando dob + Tab
  // Cursor aqui:

  // TODO: Faça destructuring do array colors usando dar + Tab
  // Cursor aqui:

  return <div>Destructuring Component</div>;
};

// ===== EXERCÍCIO 8: PROJETO PRÁTICO =====

// TODO: Crie um componente QuizCard completo
// Deve ter:
// - Props tipadas
// - Estado local para selected
// - useCallback para handleClick
// - useEffect para logging
// - Styling condicional

// Cursor aqui:

// ===== EXERCÍCIO 9: FORMULÁRIO COMPLETO =====

// TODO: Crie um formulário de cadastro com:
// - useState para cada campo
// - useCallback para validation
// - useEffect para auto-save
// - useMemo para computed values

// Cursor aqui:

// ===== EXERCÍCIO 10: CONTEXT API =====

// TODO: Crie um Context para tema
// - createContext
// - Provider component
// - useContext hook customizado

// Cursor aqui:

// ===== RESPOSTAS DOS EXERCÍCIOS =====

// ===== RESPOSTA 1: COMPONENTES =====

// rafce + Tab
export const Header = () => {
  return (
    <header>
      <h1>Meu Header</h1>
    </header>
  );
};

// rafc + Tab
const Footer = () => {
  return (
    <footer>
      <p>© 2024 Minha Empresa</p>
    </footer>
  );
};

// rfc + Tab
function Sidebar() {
  return (
    <aside>
      <nav>Navegação</nav>
    </aside>
  );
}

// ===== RESPOSTA 2: HOOKS BÁSICOS =====

export const RespostaHooks = () => {
  // useState + Tab
  const [nome, setNome] = React.useState('');
  const [email, setEmail] = React.useState('');

  // useEffect + Tab
  React.useEffect(() => {
    console.log('Componente montado');
  }, []);

  // useCallback + Tab
  const handleSubmit = React.useCallback(() => {
    console.log('Formulário enviado', { nome, email });
  }, [nome, email]);

  // useMemo + Tab
  const isEmailValid = React.useMemo(() => {
    return email.includes('@');
  }, [email]);

  return (
    <div>
      <h2>Formulário</h2>
      <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome" />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <button onClick={handleSubmit} disabled={!isEmailValid}>
        Enviar
      </button>
    </div>
  );
};

// ===== RESPOSTA 3: HOOKS CUSTOMIZADOS =====

const useCounter = (initialValue = 0) => {
  // useState + Tab
  const [count, setCount] = React.useState(initialValue);

  // useCallback + Tab
  const increment = React.useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  // useCallback + Tab
  const decrement = React.useCallback(() => {
    setCount(prev => prev - 1);
  }, []);

  return { count, increment, decrement };
};

const useApi = (url: string) => {
  // useState + Tab
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // useCallback + Tab
  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url]);

  // useEffect + Tab
  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// ===== RESPOSTA 4: IMPORTS E EXPORTS =====

// imp + Tab (exemplo)
// import React from 'react';
// imd + Tab (exemplo)
// import { useState, useEffect, useCallback } from 'react';

// exp + Tab
export default useCounter;

// ===== RESPOSTA 5: DEBUGGING =====

export const RespostaDebug = () => {
  const data = { name: 'João', age: 30 };
  const items = ['item1', 'item2', 'item3'];

  // clg + Tab
  console.log('Componente renderizado');

  // clo + Tab
  console.log('data', data);
  console.log('items', items);

  return <div>Debug Component</div>;
};

// ===== RESPOSTA 6: FUNÇÕES =====

// anfn + Tab
const minhaArrowFunction = () => {
  console.log('Arrow function executada');
};

// nfn + Tab
function minhaFunctionNomeada() {
  console.log('Function nomeada executada');
}

// ===== RESPOSTA 7: DESTRUCTURING =====

export const RespostaDestructuring = () => {
  const user = { name: 'Maria', email: 'maria@email.com', age: 25 };
  const colors = ['red', 'green', 'blue'];

  // dob + Tab
  const { name, email, age } = user;

  // dar + Tab
  const [primary, secondary, tertiary] = colors;

  return (
    <div>
      <p>Nome: {name}</p>
      <p>Email: {email}</p>
      <p>Idade: {age}</p>
      <p>Cor primária: {primary}</p>
    </div>
  );
};

// ===== RESPOSTA 8: PROJETO PRÁTICO =====

interface QuizCardProps {
  question: string;
  options: string[];
  onSelect: (option: string) => void;
}

// rafce + Tab
export const QuizCard = ({ question, options, onSelect }: QuizCardProps) => {
  // useState + Tab
  const [selected, setSelected] = React.useState<string | null>(null);

  // useCallback + Tab
  const handleClick = React.useCallback(
    (option: string) => {
      setSelected(option);
      onSelect(option);
    },
    [onSelect]
  );

  // useEffect + Tab
  React.useEffect(() => {
    if (selected) {
      console.log('Opção selecionada:', selected);
    }
  }, [selected]);

  return (
    <div className="quiz-card">
      <h3>{question}</h3>
      <div className="options">
        {options.map(option => (
          <button
            key={option}
            onClick={() => handleClick(option)}
            className={selected === option ? 'selected' : ''}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

// ===== RESUMO: SNIPPETS MAIS USADOS =====

/*
🔥 TOP 10 SNIPPETS MAIS ÚTEIS:

1. rafce → Component com export
2. useState → Estado local
3. useEffect → Efeitos colaterais
4. useCallback → Callbacks memorizados
5. useMemo → Valores memorizados
6. imp → Import padrão
7. imd → Import com destructuring
8. clg → Console log
9. anfn → Arrow function
10. dob → Destructuring objeto

💡 DICAS PARA USAR SNIPPETS:
- Sempre Tab para navegar entre placeholders
- Ctrl+Space para ver snippets disponíveis
- Memorize os 5 mais usados: rafce, useState, useEffect, useCallback, clg
- Pratique todos os dias para criar muscle memory
- Customize seus próprios snippets quando necessário

🎯 PRÓXIMOS PASSOS:
1. Pratique todos os exercícios acima
2. Use snippets no seu projeto real
3. Cronometre o tempo que economiza
4. Crie seus próprios snippets customizados
*/
