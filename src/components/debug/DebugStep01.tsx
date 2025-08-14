import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFunnelNavigation } from '@/hooks/useFunnelNavigation';

/**
 * 🧪 COMPONENTE DE DEBUG PARA STEP-01
 * Monitora eventos de validação e estado do formulário
 */
const DebugStep01: React.FC = () => {
  const [events, setEvents] = useState<string[]>([]);
  const [validationState, setValidationState] = useState({
    isNameValid: false,
    nameValue: '',
    buttonEnabled: false,
  });
  
  const { navigateToStep } = useFunnelNavigation();

  useEffect(() => {
    console.log('🧪 [DebugStep01] Iniciando monitoramento Step-01');

    // Monitor de eventos de input
    const inputHandler = (e: CustomEvent) => {
      const { blockId, value, valid } = e.detail;
      const timestamp = new Date().toLocaleTimeString();
      
      setEvents(prev => [
        `${timestamp} - INPUT: ${blockId} = "${value}" (${valid ? 'VÁLIDO' : 'INVÁLIDO'})`,
        ...prev.slice(0, 9) // Manter apenas 10 eventos
      ]);
      
      if (blockId === 'intro-form-input') {
        setValidationState(prev => ({
          ...prev,
          nameValue: value,
          isNameValid: valid,
        }));
      }
    };

    // Monitor de eventos de botão
    const buttonHandler = (e: CustomEvent) => {
      const { buttonId, enabled } = e.detail;
      const timestamp = new Date().toLocaleTimeString();
      
      setEvents(prev => [
        `${timestamp} - BUTTON: ${buttonId} ${enabled ? 'HABILITADO' : 'DESABILITADO'}`,
        ...prev.slice(0, 9)
      ]);
      
      if (buttonId === 'intro-cta-button') {
        setValidationState(prev => ({
          ...prev,
          buttonEnabled: enabled,
        }));
      }
    };

    // Registrar listeners
    window.addEventListener('quiz-input-change', inputHandler as EventListener);
    window.addEventListener('step01-button-state-change', buttonHandler as EventListener);

    return () => {
      window.removeEventListener('quiz-input-change', inputHandler as EventListener);
      window.removeEventListener('step01-button-state-change', buttonHandler as EventListener);
    };
  }, []);

  const goToStep01 = () => {
    console.log('🧪 [DebugStep01] Navegando para step-01');
    navigateToStep(1);
  };

  const clearLogs = () => {
    setEvents([]);
    console.log('🧪 [DebugStep01] Logs limpos');
  };

  return (
    <div className="fixed top-4 right-4 w-80 bg-white border-2 border-gray-200 rounded-lg p-4 shadow-lg z-50 max-h-96 overflow-y-auto">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm">🧪 DEBUG STEP-01</h3>
          <Button variant="outline" size="sm" onClick={clearLogs}>
            Limpar
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs">Nome Válido:</span>
            <Badge variant={validationState.isNameValid ? 'default' : 'secondary'}>
              {validationState.isNameValid ? 'SIM' : 'NÃO'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs">Valor:</span>
            <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
              "{validationState.nameValue}"
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs">Botão Ativo:</span>
            <Badge variant={validationState.buttonEnabled ? 'default' : 'secondary'}>
              {validationState.buttonEnabled ? 'SIM' : 'NÃO'}
            </Badge>
          </div>
        </div>

        <Button onClick={goToStep01} size="sm" className="w-full">
          🎯 IR PARA STEP-01
        </Button>

        <div className="border-t pt-2">
          <h4 className="text-xs font-semibold mb-2">📊 EVENTOS RECENTES:</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {events.length === 0 ? (
              <p className="text-xs text-gray-500 italic">Nenhum evento capturado</p>
            ) : (
              events.map((event, index) => (
                <div key={index} className="text-xs font-mono bg-gray-50 p-1 rounded text-gray-700">
                  {event}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugStep01;