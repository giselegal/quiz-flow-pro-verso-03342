/**
 * 🧪 EDITOR DE TESTE ULTRA SIMPLES
 *
 * Para isolar completamente qualquer problema de dependências
 */
const EditorTestUltraSimples = () => {
  return (
    <div className="p-8 bg-blue-100 min-h-screen">
      <h1 className="text-4xl font-bold text-blue-800 mb-4">🧪 Editor de Teste Ultra Simples</h1>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">✅ Teste de Funcionamento</h2>

        <div className="space-y-4">
          <p className="text-green-600 font-medium">✅ React funcionando</p>

          <p className="text-green-600 font-medium">✅ Tailwind funcionando</p>

          <p className="text-green-600 font-medium">✅ Componente carregando sem erros</p>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => alert('Botão funcionando!')}
          >
            🚀 Testar Clique
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorTestUltraSimples;
