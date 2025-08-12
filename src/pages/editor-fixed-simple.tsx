/**
 * Simplified Editor Fixed Page - Temporary version to bypass import issues
 */
const EditorFixedSimple: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-stone-800 mb-4">Editor de Quiz</h1>
          <p className="text-stone-600 mb-6">
            Editor temporário funcionando. A versão completa será restaurada após resolver os
            problemas de configuração.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Sample steps */}
            {Array.from({ length: 21 }, (_, i) => (
              <div
                key={i + 1}
                className="bg-stone-50 border border-stone-200 rounded-md p-4 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <h3 className="font-semibold text-stone-800 mb-2">Etapa {i + 1}</h3>
                <p className="text-sm text-stone-600">
                  {i === 0
                    ? "Página de introdução"
                    : i === 20
                      ? "Página de resultado"
                      : `Pergunta ${i}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorFixedSimple;
