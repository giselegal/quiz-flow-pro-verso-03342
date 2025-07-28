import * as React from 'react';
import { useState } from 'react';

const SimpleEditor: React.FC = () => {
  const [message, setMessage] = useState('Editor está funcionando!');

  return (
    <div style={{ padding: '20px', minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h1 style={{ color: '#333', marginBottom: '20px' }}>Editor Simples</h1>
        <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }}>
          {message}
        </p>
        
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          flexWrap: 'wrap',
          marginBottom: '20px'
        }}>
          <button 
            onClick={() => setMessage('Botão 1 clicado!')}
            style={{ 
              background: '#007bff', 
              color: 'white', 
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Teste 1
          </button>
          
          <button 
            onClick={() => setMessage('Botão 2 clicado!')}
            style={{ 
              background: '#28a745', 
              color: 'white', 
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Teste 2
          </button>
          
          <button 
            onClick={() => setMessage('Editor está funcionando!')}
            style={{ 
              background: '#6c757d', 
              color: 'white', 
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reset
          </button>
        </div>

        <div style={{ 
          background: '#f8f9fa', 
          padding: '15px', 
          borderRadius: '4px',
          border: '1px solid #dee2e6'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Área do Canvas</h3>
          <div style={{
            minHeight: '200px',
            background: 'white',
            border: '2px dashed #dee2e6',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6c757d',
            fontSize: '14px'
          }}>
            Canvas vazio - Drag & Drop aqui
          </div>
        </div>

        <div style={{ 
          marginTop: '20px',
          fontSize: '12px',
          color: '#6c757d',
          textAlign: 'center'
        }}>
          Se você consegue ver esta página e interagir com os botões, o React está funcionando corretamente.
        </div>
      </div>
    </div>
  );
};

export default SimpleEditor;
