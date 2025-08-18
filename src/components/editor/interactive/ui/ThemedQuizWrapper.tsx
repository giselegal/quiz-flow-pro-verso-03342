import React from 'react';
import { InteractiveQuizCanvas } from '../InteractiveQuizCanvas';
import { QUIZ_THEMES, QuizStyleManager, QuizTheme } from '../styles/QuizThemes';
import { QuizAnimationWrapper, QuizButton, QuizCard } from '../ui/StyledComponents';

interface ThemedQuizWrapperProps {
  theme?: QuizTheme;
  onThemeChange?: (theme: QuizTheme) => void;
  onClose?: () => void;
}

/**
 * 🎨 WRAPPER TEMÁTICO PARA QUIZ INTERATIVO
 *
 * Aplica temas visuais ao InteractiveQuizCanvas
 */
export const ThemedQuizWrapper: React.FC<ThemedQuizWrapperProps> = ({
  theme = 'default',
  onThemeChange,
  onClose,
}) => {
  const styleManager = new QuizStyleManager(theme);
  const themeConfig = QUIZ_THEMES[theme];

  return (
    <div className={styleManager.getContainerClass()}>
      <QuizAnimationWrapper animation="fadeIn" theme={theme}>
        <div className="py-8">
          {/* Header com seletor de tema */}
          <QuizCard theme={theme} variant="glass" className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold mb-1">🎯 Quiz Interativo</h1>
                <p className="text-sm text-gray-600">
                  Tema: {themeConfig.name} - {themeConfig.description}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                {onThemeChange && (
                  <select
                    value={theme}
                    onChange={e => onThemeChange(e.target.value as QuizTheme)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(QUIZ_THEMES).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.name}
                      </option>
                    ))}
                  </select>
                )}

                {onClose && (
                  <QuizButton variant="secondary" onClick={onClose} theme={theme}>
                    ✕ Fechar
                  </QuizButton>
                )}
              </div>
            </div>
          </QuizCard>

          {/* Canvas do Quiz com tema aplicado */}
          <QuizCard theme={theme} variant="elevated">
            <InteractiveQuizCanvas className={`quiz-canvas theme-${theme}`} theme={theme} />
          </QuizCard>
        </div>
      </QuizAnimationWrapper>

      {/* Estilos CSS customizados para o tema */}
      <style>{`
        .quiz-canvas.theme-${theme} {
          /* Variáveis CSS para o tema atual */
          --quiz-primary: var(--color-primary);
          --quiz-secondary: var(--color-secondary);
          --quiz-background: var(--color-background);
          --quiz-surface: var(--color-surface);
          --quiz-text: var(--color-text);
        }
      `}</style>
    </div>
  );
};
