import { Route, Router, Switch } from 'wouter';

// Import do EDITOR ULTRA SAFE - SEM QUALQUER DEPENDÊNCIA PROBLEMÁTICA
import Editor4ColunasUltraSafe from './components/editor/Editor4ColunasUltraSafe';

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
                <h1 style={{ margin: '0 0 20px 0' }}>🏠 Quiz Quest - Editor Atualizado!</h1>
                <p style={{ margin: '0 0 30px 0', fontSize: '18px', opacity: 0.9 }}>
                  Sistema completo de criação de quizzes
                </p>

                <div
                  style={{
                    display: 'flex',
                    gap: '15px',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <a
                    href="/editor"
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      textDecoration: 'none',
                      fontSize: '18px',
                      padding: '15px 25px',
                      borderRadius: '10px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      fontWeight: 'bold',
                      transition: 'all 0.3s',
                      display: 'inline-block',
                    }}
                  >
                    🚀 Editor Completo
                  </a>

                  <a
                    href="/editor-simples"
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      textDecoration: 'none',
                      fontSize: '18px',
                      padding: '15px 25px',
                      borderRadius: '10px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      fontWeight: 'bold',
                      transition: 'all 0.3s',
                      display: 'inline-block',
                    }}
                  >
                    🧪 Editor Simples
                  </a>
                </div>
              </div>
            </div>
          </Route>

          {/* 🚀 EDITOR COMPLETO E FUNCIONAL */}
          <Route path="/editor">
            <Editor4ColunasSafe />
          </Route>

          {/* 🧪 EDITOR SIMPLES - PARA TESTES */}
          <Route path="/editor-simples">
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
                  🎯 EDITOR SIMPLES
                </h1>
                <Editor4ColunasSafe />
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
