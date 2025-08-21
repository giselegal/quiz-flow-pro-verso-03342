import { Route, Router } from 'wouter';
import Editor4ColunasUltraSafe from './components/editor/Editor4ColunasUltraSafe';

function App() {
  return (
    <Router>
      {/* Página inicial */}
      <Route path="/">
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">🎯 Quiz Quest Challenge</h1>
            <p className="text-gray-600 mb-6">Crie quizzes incríveis com nosso editor visual</p>
            <a
              href="/editor"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              Começar a Criar Quiz
            </a>
          </div>
        </div>
      </Route>

      {/* Editor principal */}
      <Route path="/editor">
        <Editor4ColunasUltraSafe />
      </Route>

      {/* 404 */}
      <Route>
        <div className="min-h-screen bg-red-500 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600">404 - Página não encontrada</h1>
            <a href="/" className="text-blue-500 hover:underline mt-4 block">
              Voltar ao início
            </a>
          </div>
        </div>
      </Route>
    </Router>
  );
}

export default App;
