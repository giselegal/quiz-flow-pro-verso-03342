import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, Save, Share2 } from 'lucide-react';
import React, { memo } from 'react';

interface QuizActionsProps {
  currentStep: number;
  totalSteps: number;
  canGoBack: boolean;
  canGoNext: boolean;
  isFormValid: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onRestart?: () => void;
  onSave?: () => void;
  onShare?: () => void;
  showSaveButton?: boolean;
  showShareButton?: boolean;
  isLoading?: boolean;
  customNextText?: string;
  customPrevText?: string;
}

/**
 * 🎯 COMPONENTE DE AÇÕES DO QUIZ
 *
 * Botões de navegação e ações:
 * - Anterior/Próximo
 * - Validação de formulário
 * - Ações especiais (save, share, restart)
 * - Estados de loading
 * - Animações suaves
 */
export const QuizActions: React.FC<QuizActionsProps> = memo(
  ({
    currentStep,
    totalSteps,
    canGoBack,
    canGoNext,
    isFormValid,
    onPrevious,
    onNext,
    onRestart,
    onSave,
    onShare,
    showSaveButton = false,
    showShareButton = false,
    isLoading = false,
    customNextText,
    customPrevText,
  }) => {
    const isFirstStep = currentStep === 1;
    const isLastStep = currentStep === totalSteps;

    // Textos dinâmicos baseados na etapa
    const getNextText = () => {
      if (customNextText) return customNextText;
      if (isLastStep) return 'Finalizar';
      if (currentStep === totalSteps - 1) return 'Ver Resultado';
      return 'Próximo';
    };

    const getPrevText = () => {
      if (customPrevText) return customPrevText;
      return 'Anterior';
    };

    return (
      <div className="quiz-actions bg-white border-t border-gray-200 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Botões de Navegação Principal */}
            <div className="flex items-center gap-3">
              {/* Botão Anterior */}
              <AnimatePresence>
                {!isFirstStep && (
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onClick={onPrevious}
                    disabled={!canGoBack || isLoading}
                    className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                    ${
                      canGoBack && !isLoading
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
                        : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                    }
                  `}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    {getPrevText()}
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Botão Restart (apenas em etapas específicas) */}
              <AnimatePresence>
                {onRestart && (currentStep > 5 || isLastStep) && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={onRestart}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all"
                    title="Recomeçar quiz"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Recomeçar
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Botões de Ação e Próximo */}
            <div className="flex items-center gap-3">
              {/* Botões de Ação (Save/Share) */}
              <div className="flex items-center gap-2">
                <AnimatePresence>
                  {showSaveButton && onSave && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      onClick={onSave}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-blue-100 hover:bg-blue-200 text-blue-700 hover:text-blue-800 transition-all"
                      title="Salvar progresso"
                    >
                      <Save className="w-4 h-4" />
                      Salvar
                    </motion.button>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {showShareButton && onShare && isLastStep && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      onClick={onShare}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-green-100 hover:bg-green-200 text-green-700 hover:text-green-800 transition-all"
                      title="Compartilhar resultado"
                    >
                      <Share2 className="w-4 h-4" />
                      Compartilhar
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Botão Próximo */}
              <motion.button
                whileHover={{ scale: canGoNext && isFormValid && !isLoading ? 1.02 : 1 }}
                whileTap={{ scale: canGoNext && isFormValid && !isLoading ? 0.98 : 1 }}
                onClick={onNext}
                disabled={!canGoNext || !isFormValid || isLoading}
                className={`
                flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all min-w-[120px] justify-center
                ${
                  canGoNext && isFormValid && !isLoading
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    {getNextText()}
                    {!isLastStep && <ChevronRight className="w-4 h-4" />}
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Feedback de Validação */}
          <AnimatePresence>
            {!isFormValid && currentStep > 1 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 text-center"
              >
                <p className="text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg inline-block">
                  💡 Complete todos os campos obrigatórios para continuar
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Indicador de Progresso na Última Etapa */}
          <AnimatePresence>
            {isLastStep && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-4 text-center"
              >
                <p className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg inline-block">
                  🎉 Parabéns! Você chegou ao final do quiz
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }
);

/**
 * 🎯 COMPONENTE SIMPLIFICADO DE AÇÕES
 *
 * Versão mais simples para casos básicos
 */
interface SimpleQuizActionsProps {
  onPrevious?: () => void;
  onNext: () => void;
  canGoBack?: boolean;
  canGoNext?: boolean;
  nextText?: string;
  prevText?: string;
  isLoading?: boolean;
}

export const SimpleQuizActions: React.FC<SimpleQuizActionsProps> = memo(
  ({
    onPrevious,
    onNext,
    canGoBack = true,
    canGoNext = true,
    nextText = 'Próximo',
    prevText = 'Anterior',
    isLoading = false,
  }) => {
    return (
      <div className="simple-quiz-actions flex items-center justify-between p-4">
        {onPrevious ? (
          <button
            onClick={onPrevious}
            disabled={!canGoBack || isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            {prevText}
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={onNext}
          disabled={!canGoNext || isLoading}
          className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processando...
            </>
          ) : (
            <>
              {nextText}
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    );
  }
);

QuizActions.displayName = 'QuizActions';
SimpleQuizActions.displayName = 'SimpleQuizActions';
