import React, { useState } from 'react';
import { QuizDemo } from './examples/QuizDemo';
import { QuizShowcase } from './examples/QuizShowcase';
import { QuizTheme } from './styles/QuizThemes';
import { QuizAnimationWrapper, QuizButton, QuizCard } from './ui/StyledComponents';
import { ThemedQuizWrapper } from './ui/ThemedQuizWrapper';

type DemoMode = 'showcase' | 'themed-quiz' | 'complete-demo' | 'menu';

/**
 * 🎮 APLICAÇÃO DEMO COMPLETA DOS COMPONENTES DE QUIZ
 * 
 * Demonstra todas as funcionalidades implementadas nos 4 passos
 */
export const QuizDemoApp: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<DemoMode>('menu');
  const [selectedTheme, setSelectedTheme] = useState<QuizTheme>('default');

  const renderMode = () => {
    switch (currentMode) {
      case 'showcase':
        return (
          <QuizShowcase onClose={() => setCurrentMode('menu')} />
        );

      case 'themed-quiz':
        return (
          <ThemedQuizWrapper
            theme={selectedTheme}
            onThemeChange={setSelectedTheme}
            onClose={() => setCurrentMode('menu')}
          />
        );

      case 'complete-demo':
        return (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <QuizAnimationWrapper animation="fadeIn">
              <QuizCard variant="glass" className="mb-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold">
                    📱 Quiz Completo - Exemplo Prático
                  </h1>
                  <QuizButton
                    variant="secondary"
                    onClick={() => setCurrentMode('menu')}
                  >
                    ← Voltar ao Menu
                  </QuizButton>
                </div>
              </QuizCard>
              
              <QuizDemo />
            </QuizAnimationWrapper>
          </div>
        );

      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
            <QuizAnimationWrapper animation="slideUp">
              <QuizCard variant="elevated" className="max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-6xl mb-6">🎯</div>
                  <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Quiz Quest Demo
                  </h1>
                  <p className="text-lg text-gray-600 mb-8">
                    Explore todas as funcionalidades implementadas nos 4 passos do desenvolvimento
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Showcase de Componentes */}
                    <div className="group">
                      <QuizCard variant="bordered" className="h-full hover-lift cursor-pointer transition-all duration-300">
                        <div className="text-center" onClick={() => setCurrentMode('showcase')}>
                          <div className="text-4xl mb-4 group-hover:animate-bounce">🎨</div>
                          <h3 className="text-xl font-semibold mb-2">
                            Showcase Visual
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Explore todos os temas, componentes e estilos disponíveis
                          </p>
                          <QuizButton variant="primary" className="w-full">
                            Abrir Showcase
                          </QuizButton>
                        </div>
                      </QuizCard>
                    </div>

                    {/* Quiz Temático */}
                    <div className="group">
                      <QuizCard variant="bordered" className="h-full hover-lift cursor-pointer transition-all duration-300">
                        <div className="text-center" onClick={() => setCurrentMode('themed-quiz')}>
                          <div className="text-4xl mb-4 group-hover:animate-pulse">🎭</div>
                          <h3 className="text-xl font-semibold mb-2">
                            Quiz Temático
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Experimente o quiz interativo com diferentes temas visuais
                          </p>
                          <QuizButton variant="primary" className="w-full">
                            Iniciar Quiz
                          </QuizButton>
                        </div>
                      </QuizCard>
                    </div>

                    {/* Exemplo Completo */}
                    <div className="group">
                      <QuizCard variant="bordered" className="h-full hover-lift cursor-pointer transition-all duration-300">
                        <div className="text-center" onClick={() => setCurrentMode('complete-demo')}>
                          <div className="text-4xl mb-4 group-hover:animate-glow">📱</div>
                          <h3 className="text-xl font-semibold mb-2">
                            Demo Completo
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Teste o exemplo completo com 21 perguntas e resultados
                          </p>
                          <QuizButton variant="primary" className="w-full">
                            Ver Demo
                          </QuizButton>
                        </div>
                      </QuizCard>
                    </div>
                  </div>

                  {/* Informações dos Passos Implementados */}
                  <div className="mt-12 p-6 bg-gray-50 rounded-xl">
                    <h2 className="text-xl font-semibold mb-4">
                      ✅ Funcionalidades Implementadas
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-green-500">🔗</span>
                          <span className="text-sm">Integração com Editor Responsivo</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-green-500">🧪</span>
                          <span className="text-sm">Testes Funcionais Completos</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-green-500">📱</span>
                          <span className="text-sm">Quiz Completo (21 Perguntas)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-green-500">🎨</span>
                          <span className="text-sm">Refinamentos UX e Temas</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 text-center">
                      <p className="text-sm text-gray-600">
                        <strong>Tecnologias:</strong> React 18.3.1, TypeScript, Tailwind CSS, Vitest
                      </p>
                    </div>
                  </div>
                </div>
              </QuizCard>
            </QuizAnimationWrapper>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      {renderMode()}
    </div>
  );
};
