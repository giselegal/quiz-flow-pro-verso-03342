import { EditorProvider } from '@/context/EditorContext';
import { Block } from '@/types/editor';
import React, { useState } from 'react';
import { InteractiveQuizCanvas } from '../InteractiveQuizCanvas';
import { QUIZ_EXEMPLO_COMPLETO, calcularResultadoQuiz } from './QuizExemploCompleto';

/**
 * 🎯 DEMONSTRAÇÃO COMPLETA DO QUIZ INTERATIVO
 *
 * Página de exemplo que mostra o sistema interativo funcionando
 * com um quiz completo de 21 etapas sobre estilo pessoal.
 */
export const QuizDemo: React.FC = () => {
  const [quizCompleto, setQuizCompleto] = useState(false);
  const [resultados, setResultados] = useState<any>(null);

  // Mock do contexto do editor com os blocos do quiz
  const mockEditorContext = {
    computed: {
      currentBlocks: QUIZ_EXEMPLO_COMPLETO as Block[],
      selectedBlock: null,
    },
    selectedBlockId: null,
    blockActions: {
      setSelectedBlockId: () => {},
      addBlock: async () => 'mock-id',
      updateBlock: async () => {},
      deleteBlock: async () => {},
    },
  };

  const handleQuizComplete = (respostas: Record<string, any>) => {
    const { resultado, pontuacoes } = calcularResultadoQuiz(respostas);
    setResultados({ resultado, pontuacoes, respostas });
    setQuizCompleto(true);
  };

  const resetQuiz = () => {
    setQuizCompleto(false);
    setResultados(null);
    // Limpar localStorage
    localStorage.removeItem('quiz-state');
    window.location.reload();
  };

  if (quizCompleto && resultados) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              🎉 Quiz Concluído com Sucesso!
            </h1>
            <p className="text-lg text-gray-600">
              Veja os resultados gerados pelo sistema interativo
            </p>
          </div>

          {/* Resultado Principal */}
          <div
            className={`bg-gradient-to-br ${resultados.resultado.color} p-8 rounded-2xl shadow-xl text-white mb-8`}
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">{resultados.resultado.title}</h2>
              <p className="text-xl opacity-90 mb-4">{resultados.resultado.subtitle}</p>
              <p className="text-lg leading-relaxed">{resultados.resultado.description}</p>
            </div>
          </div>

          {/* Características */}
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              ✨ Suas Características Principais:
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {resultados.resultado.characteristics.map((char: string, index: number) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-gray-700">{char}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recomendações */}
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 Recomendações Para Você:</h3>
            <div className="space-y-3">
              {resultados.resultado.recommendations.map((rec: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pontuações por Categoria */}
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              📊 Breakdown Detalhado por Categoria:
            </h3>
            <div className="space-y-3">
              {Object.entries(resultados.pontuacoes)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .map(([categoria, pontos]) => {
                  const pontuacaoTotal = Math.max(
                    ...(Object.values(resultados.pontuacoes) as number[])
                  );
                  const porcentagem = Math.round(((pontos as number) / pontuacaoTotal) * 100);
                  return (
                    <div key={categoria} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium capitalize text-gray-700">{categoria}</span>
                        <span className="text-gray-600">{pontos as number} pontos</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${porcentagem}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Debug Info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-gray-100 p-6 rounded-xl shadow-lg mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">🔍 Debug - Dados Técnicos:</h3>
              <div className="space-y-2 text-sm font-mono text-gray-600">
                <div>
                  <strong>Total de Respostas:</strong> {Object.keys(resultados.respostas).length}
                </div>
                <div>
                  <strong>Categoria Dominante:</strong>{' '}
                  {
                    Object.entries(resultados.pontuacoes).sort(
                      ([, a], [, b]) => (b as number) - (a as number)
                    )[0]?.[0]
                  }
                </div>
                <div>
                  <strong>Pontuação Máxima:</strong>{' '}
                  {Math.max(...(Object.values(resultados.pontuacoes) as number[]))}
                </div>
                <div>
                  <strong>Tempo de Conclusão:</strong> Calculado automaticamente
                </div>
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="text-center space-y-4">
            <button
              onClick={resetQuiz}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              🔄 Fazer Quiz Novamente
            </button>

            <div className="text-sm text-gray-600">
              <p>Este é um exemplo do sistema interativo funcionando!</p>
              <p>Os dados foram processados em tempo real conforme você respondia.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header da Demo */}
      <div className="bg-white border-b py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                🎮 Demo: Quiz Interativo Completo
              </h1>
              <p className="text-gray-600 mt-1">
                Experimente o sistema interativo com um quiz real de 21 etapas
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                <div>✅ Sistema integrado</div>
                <div>✅ Validação em tempo real</div>
                <div>✅ Resultados personalizados</div>
              </div>

              <button
                onClick={resetQuiz}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                🔄 Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Canvas */}
      <EditorProvider>
        <InteractiveQuizCanvas className="h-[calc(100vh-120px)]" />
      </EditorProvider>
    </div>
  );
};

export default QuizDemo;
