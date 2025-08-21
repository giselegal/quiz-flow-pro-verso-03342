import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = (path: string) => {
    window.location.href = path;
  };
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // TESTE: Mudança dramática para verificar se hot reload está funcionando
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-600">
      <div className="container mx-auto px-4 py-16 text-center text-white">
        <h1 className="text-6xl font-bold mb-8">🚀 PRIORIDADE 2 - EDITOR UNIFICADO</h1>
        <p className="text-2xl mb-8">
          Teste de Hot Reload - Se você vê esta mensagem, as mudanças estão funcionando!
        </p>
        <div className="space-y-4">
          <button
            onClick={() => navigate('/editor')}
            className="bg-white text-purple-600 px-8 py-4 rounded-lg text-xl font-bold hover:bg-gray-100 transition-colors"
          >
            🎨 Abrir Editor Unificado
          </button>
          <button
            onClick={() => navigate('/editor-original')}
            className="bg-yellow-400 text-black px-8 py-4 rounded-lg text-xl font-bold hover:bg-yellow-300 transition-colors ml-4"
          >
            🔄 Ver Editor Original
          </button>
        </div>

        {user && (
          <div className="mt-8 p-4 bg-white/20 rounded-lg">
            <p className="text-lg">Logado como: {user.email}</p>
            <button
              onClick={() => logout()}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        )}

        {isLoading && (
          <div className="mt-8">
            <p className="text-lg">Carregando...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
