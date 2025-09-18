/**
 * 🔄 TELA DE LOADING ESPECÍFICA - FASE 4
 * 
 * Tela de loading inteligente para cálculo de resultado
 * com feedback visual e botão de retry
 */

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface QuizLoadingScreenProps {
  isVisible: boolean;
  status: 'loading' | 'calculating' | 'error' | 'success';
  onRetry?: () => void;
  onSkip?: () => void;
  errorMessage?: string;
}

export const QuizLoadingScreen: React.FC<QuizLoadingScreenProps> = ({
  isVisible,
  status,
  onRetry,
  onSkip,
  errorMessage
}) => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState('');

  const messages = {
    loading: [
      'Carregando seus dados...',
      'Verificando respostas...',
      'Preparando análise...'
    ],
    calculating: [
      'Analisando seu perfil...',
      'Calculando compatibilidades...',
      'Determinando seu estilo...',
      'Finalizando resultado...'
    ]
  };

  useEffect(() => {
    if (!isVisible || status === 'error' || status === 'success') {
      return;
    }

    let messageIndex = 0;
    let progressValue = 0;
    
    const updateMessage = () => {
      const messageList = messages[status] || messages.loading;
      setCurrentMessage(messageList[messageIndex % messageList.length]);
      messageIndex++;
    };

    const updateProgress = () => {
      progressValue += Math.random() * 15 + 5;
      if (progressValue > 95) progressValue = 95;
      setProgress(progressValue);
    };

    // Inicializar
    updateMessage();
    updateProgress();

    const messageInterval = setInterval(updateMessage, 2000);
    const progressInterval = setInterval(updateProgress, 800);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, [isVisible, status]);

  // Reset progress quando status muda
  useEffect(() => {
    if (status === 'loading' || status === 'calculating') {
      setProgress(0);
    } else if (status === 'success') {
      setProgress(100);
    }
  }, [status]);

  if (!isVisible) return null;

  const renderContent = () => {
    switch (status) {
      case 'error':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-900">
                Ops! Algo deu errado
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {errorMessage || 'Não conseguimos calcular seu resultado. Vamos tentar novamente?'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {onRetry && (
                <Button 
                  onClick={onRetry}
                  className="inline-flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Tentar Novamente
                </Button>
              )}
              
              {onSkip && (
                <Button 
                  onClick={onSkip}
                  variant="outline"
                >
                  Pular para Resultado
                </Button>
              )}
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-900">
                Resultado Calculado!
              </h3>
              <p className="text-gray-600">
                Redirecionando para seus resultados...
              </p>
            </div>
          </div>
        );

      default: // loading or calculating
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto">
              <Loader2 className="w-16 h-16 text-primary animate-spin" />
            </div>
            
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-900">
                {status === 'calculating' ? 'Calculando seu Resultado' : 'Carregando...'}
              </h3>
              
              <p className="text-gray-600 min-h-[1.5rem] transition-all duration-500">
                {currentMessage}
              </p>

              {/* Barra de progresso */}
              <div className="w-full max-w-xs mx-auto">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary rounded-full h-2 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {Math.round(progress)}% concluído
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-md w-full">
        {renderContent()}
      </div>
    </div>
  );
};