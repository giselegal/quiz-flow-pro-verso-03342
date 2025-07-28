import * as React from 'react';

const TestPage: React.FC = () => {
  return (
    <div style={{ padding: '20px', background: '#f0f0f0', minHeight: '100vh' }}>
      <h1>Página de Teste</h1>
      <p>Se você consegue ver esta página, o React está funcionando!</p>
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        marginTop: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2>Componentes estão renderizando</h2>
        <button style={{ 
          background: '#007bff', 
          color: 'white', 
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Botão de Teste
        </button>
      </div>
    </div>
  );
};

export default TestPage;
