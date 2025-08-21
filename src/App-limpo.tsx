import React, { Suspense } from 'react';
import { Route, Router, Switch } from 'wouter';

// Import do componente super simples
const EditorSuperSimples = React.lazy(() => import('./components/editor/EditorSuperSimples'));

// Loading simples
const Loading = () => (
  <div
    style={{
      background: 'linear-gradient(45deg, #f093fb, #f5576c)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      color: 'white',
      fontWeight: 'bold',
    }}
  >
    🚀 Carregando...
  </div>
);

/**
 * 🚨 APP LIMPO - TESTE DE DUPLICAÇÃO
 *
 * Removendo TODAS as complexidades para testar se o problema
 * é duplicação de rotas ou conflito de providers
 */
function App() {
  console.log('🔥 App.tsx: CARREGANDO APP LIMPO...');

  return (
    <Router>
      <div style={{ minHeight: '100vh' }}>
        <Switch>
          {/* 🏠 HOME SIMPLES */}
          <Route path="/">
            <div
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '32px',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              <div>
                <h1 style={{ margin: '0 0 20px 0' }}>🏠 HOME FUNCIONANDO!</h1>
                <a
                  href="/editor"
                  style={{
                    color: 'white',
                    textDecoration: 'underline',
                    fontSize: '20px',
                  }}
                >
                  ➡️ Ir para o Editor
                </a>
              </div>
            </div>
          </Route>

          {/* 🚀 EDITOR - ROTA ÚNICA */}
          <Route path="/editor">
            <div
              style={{
                background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)',
                minHeight: '100vh',
                padding: '20px',
              }}
            >
              <div
                style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '20px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  textAlign: 'center',
                }}
              >
                <h1
                  style={{
                    fontSize: '48px',
                    color: '#333',
                    margin: '0 0 20px 0',
                  }}
                >
                  🎯 ROTA ÚNICA - SEM DUPLICAÇÃO!
                </h1>
                <div
                  style={{
                    background: '#4CAF50',
                    color: 'white',
                    padding: '15px',
                    borderRadius: '10px',
                    margin: '20px 0',
                    fontSize: '20px',
                    fontWeight: 'bold',
                  }}
                >
                  ✅ Se você vê isso, a rota está funcionando!
                </div>
                <Suspense fallback={<Loading />}>
                  <EditorSuperSimples />
                </Suspense>
              </div>
            </div>
          </Route>

          {/* 🚫 404 - FALLBACK */}
          <Route>
            <div
              style={{
                background: '#ff4757',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '32px',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              <div>
                <h1 style={{ margin: '0 0 20px 0' }}>🚫 404 - Página não encontrada</h1>
                <a
                  href="/"
                  style={{
                    color: 'white',
                    textDecoration: 'underline',
                    fontSize: '20px',
                  }}
                >
                  ⬅️ Voltar ao Início
                </a>
              </div>
            </div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
