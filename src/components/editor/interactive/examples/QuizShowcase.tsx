import React from 'react';
import { InteractiveQuizCanvas } from '../InteractiveQuizCanvas';
import { QUIZ_THEMES, QuizStyleManager, QuizTheme } from '../styles/QuizThemes';
import {
  QuizAlert,
  QuizAnimationWrapper,
  QuizBadge,
  QuizButton,
  QuizCard,
  QuizProgressBar,
  useAccessibility,
  useResponsiveDesign,
} from '../ui/StyledComponents';

interface QuizShowcaseProps {
  onClose?: () => void;
}

/**
 * 🎨 SHOWCASE DE TEMAS E COMPONENTES ESTILIZADOS
 *
 * Demonstra todos os temas e componentes visuais disponíveis
 */
export const QuizShowcase: React.FC<QuizShowcaseProps> = ({ onClose }) => {
  const [selectedTheme, setSelectedTheme] = React.useState<QuizTheme>('default');
  const [showQuiz, setShowQuiz] = React.useState(false);
  const device = useResponsiveDesign();
  const { highContrast, reducedMotion } = useAccessibility();
  const styleManager = new QuizStyleManager(selectedTheme, device);

  const themeNames = Object.keys(QUIZ_THEMES) as QuizTheme[];

  if (showQuiz) {
    return (
      <div className={styleManager.getContainerClass()}>
        <QuizAnimationWrapper animation="pageTransition" theme={selectedTheme}>
          <div className="py-8">
            <QuizCard theme={selectedTheme} variant="elevated">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  Quiz com Tema: {QUIZ_THEMES[selectedTheme].name}
                </h2>
                <QuizButton
                  variant="secondary"
                  onClick={() => setShowQuiz(false)}
                  theme={selectedTheme}
                >
                  ← Voltar ao Showcase
                </QuizButton>
              </div>

              <InteractiveQuizCanvas />
            </QuizCard>
          </div>
        </QuizAnimationWrapper>
      </div>
    );
  }

  return (
    <div className={styleManager.getContainerClass()}>
      <QuizAnimationWrapper animation="fadeIn" theme={selectedTheme}>
        <div className="py-8">
          {/* Header */}
          <QuizCard theme={selectedTheme} variant="glass" className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold mb-2">🎨 Quiz Showcase</h1>
                <p className="text-lg text-gray-600">Explore temas e componentes visuais</p>

                {/* Informações de Acessibilidade */}
                <div className="flex space-x-4 mt-4">
                  {highContrast && (
                    <QuizBadge variant="info" theme={selectedTheme}>
                      Alto Contraste Ativo
                    </QuizBadge>
                  )}
                  {reducedMotion && (
                    <QuizBadge variant="warning" theme={selectedTheme}>
                      Movimento Reduzido
                    </QuizBadge>
                  )}
                  <QuizBadge variant="default" theme={selectedTheme}>
                    Dispositivo: {device}
                  </QuizBadge>
                </div>
              </div>

              {onClose && (
                <QuizButton variant="secondary" onClick={onClose} theme={selectedTheme}>
                  ✕ Fechar
                </QuizButton>
              )}
            </div>
          </QuizCard>

          {/* Seletor de Temas */}
          <QuizCard theme={selectedTheme} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">🎭 Seletor de Temas</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {themeNames.map(themeName => {
                const themeConfig = QUIZ_THEMES[themeName];
                const isSelected = selectedTheme === themeName;

                return (
                  <div
                    key={themeName}
                    className={`
                      p-4 border-2 rounded-lg cursor-pointer transition-all duration-300
                      ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 scale-105'
                          : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                    onClick={() => setSelectedTheme(themeName)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{themeConfig.name}</h3>
                      {isSelected && (
                        <QuizBadge variant="success" size="small">
                          Ativo
                        </QuizBadge>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{themeConfig.description}</p>

                    {/* Preview das cores */}
                    <div className="flex space-x-2">
                      <div
                        className={`w-6 h-6 rounded ${themeConfig.colors.primary.replace('bg-', 'bg-')}`}
                      />
                      <div className={`w-6 h-6 rounded ${themeConfig.colors.secondary}`} />
                      <div className={`w-6 h-6 rounded ${themeConfig.colors.success}`} />
                    </div>
                  </div>
                );
              })}
            </div>

            <QuizButton
              variant="primary"
              size="large"
              onClick={() => setShowQuiz(true)}
              theme={selectedTheme}
              className="w-full"
            >
              🚀 Testar Quiz com Tema Selecionado
            </QuizButton>
          </QuizCard>

          {/* Demonstração de Componentes */}
          <QuizCard theme={selectedTheme} className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">🧩 Componentes Disponíveis</h2>

            {/* Barra de Progresso */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">📊 Barra de Progresso</h3>
              <QuizProgressBar
                currentStep={7}
                totalSteps={10}
                theme={selectedTheme}
                animated={!reducedMotion}
                showPercentage={true}
              />
            </div>

            {/* Botões */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">🔘 Botões</h3>
              <div className="flex flex-wrap gap-4">
                <QuizButton variant="primary" theme={selectedTheme}>
                  Primário
                </QuizButton>
                <QuizButton variant="secondary" theme={selectedTheme}>
                  Secundário
                </QuizButton>
                <QuizButton variant="success" theme={selectedTheme}>
                  Sucesso
                </QuizButton>
                <QuizButton variant="error" theme={selectedTheme}>
                  Erro
                </QuizButton>
                <QuizButton variant="primary" theme={selectedTheme} loading={true}>
                  Carregando
                </QuizButton>
                <QuizButton variant="primary" theme={selectedTheme} disabled={true}>
                  Desabilitado
                </QuizButton>
              </div>
            </div>

            {/* Alertas */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">🚨 Alertas</h3>
              <div className="space-y-4">
                <QuizAlert
                  type="info"
                  title="Informação"
                  message="Esta é uma mensagem informativa sobre o quiz."
                  theme={selectedTheme}
                />
                <QuizAlert
                  type="success"
                  title="Sucesso"
                  message="Parabéns! Você completou a seção com sucesso."
                  theme={selectedTheme}
                />
                <QuizAlert
                  type="warning"
                  title="Atenção"
                  message="Verifique suas respostas antes de continuar."
                  theme={selectedTheme}
                />
                <QuizAlert
                  type="error"
                  title="Erro"
                  message="Ocorreu um erro ao processar sua resposta."
                  theme={selectedTheme}
                />
              </div>
            </div>

            {/* Badges */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">🏷️ Badges</h3>
              <div className="flex flex-wrap gap-2">
                <QuizBadge variant="default" theme={selectedTheme}>
                  Padrão
                </QuizBadge>
                <QuizBadge variant="success" theme={selectedTheme}>
                  Completo
                </QuizBadge>
                <QuizBadge variant="warning" theme={selectedTheme}>
                  Pendente
                </QuizBadge>
                <QuizBadge variant="error" theme={selectedTheme}>
                  Erro
                </QuizBadge>
                <QuizBadge variant="info" theme={selectedTheme}>
                  Info
                </QuizBadge>
              </div>
            </div>

            {/* Cards */}
            <div>
              <h3 className="text-lg font-medium mb-4">🎴 Tipos de Cartão</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <QuizCard theme={selectedTheme} variant="default">
                  <h4 className="font-semibold mb-2">Cartão Padrão</h4>
                  <p className="text-sm text-gray-600">Layout básico para conteúdo geral.</p>
                </QuizCard>

                <QuizCard theme={selectedTheme} variant="elevated">
                  <h4 className="font-semibold mb-2">Cartão Elevado</h4>
                  <p className="text-sm text-gray-600">Com efeito hover e elevação.</p>
                </QuizCard>

                <QuizCard theme={selectedTheme} variant="bordered">
                  <h4 className="font-semibold mb-2">Cartão com Borda</h4>
                  <p className="text-sm text-gray-600">Destaque visual com bordas.</p>
                </QuizCard>

                <QuizCard theme={selectedTheme} variant="glass">
                  <h4 className="font-semibold mb-2">Efeito Vidro</h4>
                  <p className="text-sm text-gray-600">Transparência com blur moderno.</p>
                </QuizCard>
              </div>
            </div>
          </QuizCard>

          {/* Informações Técnicas */}
          <QuizCard theme={selectedTheme} variant="bordered">
            <h2 className="text-xl font-semibold mb-4">⚡ Informações Técnicas</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-medium mb-2">🎨 Tema Atual</h4>
                <p className="text-gray-600">
                  <strong>{QUIZ_THEMES[selectedTheme].name}</strong>
                  <br />
                  {QUIZ_THEMES[selectedTheme].description}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">📱 Responsividade</h4>
                <p className="text-gray-600">
                  Dispositivo: <strong>{device}</strong>
                  <br />
                  Adaptação automática de layout
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">♿ Acessibilidade</h4>
                <p className="text-gray-600">
                  Alto contraste: {highContrast ? '✅' : '❌'}
                  <br />
                  Movimento reduzido: {reducedMotion ? '✅' : '❌'}
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">🔧 Recursos Implementados</h4>
              <div className="flex flex-wrap gap-2">
                <QuizBadge size="small" variant="success">
                  Temas Dinâmicos
                </QuizBadge>
                <QuizBadge size="small" variant="success">
                  Animações CSS
                </QuizBadge>
                <QuizBadge size="small" variant="success">
                  Design Responsivo
                </QuizBadge>
                <QuizBadge size="small" variant="success">
                  Acessibilidade WCAG
                </QuizBadge>
                <QuizBadge size="small" variant="success">
                  TypeScript
                </QuizBadge>
                <QuizBadge size="small" variant="success">
                  Tailwind CSS
                </QuizBadge>
              </div>
            </div>
          </QuizCard>
        </div>
      </QuizAnimationWrapper>
    </div>
  );
};
