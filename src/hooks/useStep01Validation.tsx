// 🎯 HOOK DE VALIDAÇÃO STEP01 - CONTROLE DE BOTÃO POR NOME
// Sistema para ativação de botão baseada no input de nome

import React, { useEffect, useState } from 'react';

interface Step01ValidationState {
  isNameValid: boolean;
  nameValue: string;
  isButtonEnabled: boolean;
}

interface QuizInputChangeEvent {
  blockId: string;
  value: string;
  valid: boolean;
}

export const useStep01Validation = () => {
  const [validationState, setValidationState] = useState<Step01ValidationState>({
    isNameValid: false,
    nameValue: '',
    isButtonEnabled: false,
  });

  useEffect(() => {
    // Listener para eventos de mudança no input
    const handleInputChange = (event: CustomEvent<QuizInputChangeEvent>) => {
      const { blockId, value, valid } = event.detail;

      // ✅ Verifica se é o input de nome (IDs alinhados com template)
      const nameInputIds = [
        'intro-form-input',    // ✅ ID do template Step01
        'name-input-modular',
        'intro-name-input', 
        'user-name-input',
        'userName',
      ];
      
      console.log('🎯 [useStep01Validation] Input change event:', {
        blockId,
        value: value.trim(),
        validNameIds: nameInputIds,
        isNameField: nameInputIds.includes(blockId)
      });

      if (nameInputIds.includes(blockId)) {
        const isValid = valid && value.trim().length >= 2; // Mínimo 2 caracteres

        setValidationState(prev => ({
          ...prev,
          isNameValid: isValid,
          nameValue: value.trim(),
          isButtonEnabled: isValid,
        }));

        // ✅ Disparar evento para atualizar botão (ID alinhado com template)
        window.dispatchEvent(
          new CustomEvent('step01-button-state-change', {
            detail: {
              buttonId: 'intro-cta-button',  // ✅ ID do template Step01
              enabled: isValid,
              disabled: !isValid,
              requiresValidInput: !isValid,
            },
          })
        );
        
        console.log('🔄 [useStep01Validation] Button state event dispatched:', {
          buttonId: 'intro-cta-button',
          enabled: isValid,
          nameValue: value.trim()
        });

        console.log('🎯 Step01 Validation:', {
          blockId,
          value: value.trim(),
          isValid,
          buttonEnabled: isValid,
        });
      }
    };

    // ✅ Adicionar listener
    window.addEventListener('quiz-input-change', handleInputChange as EventListener);

    // ✅ Cleanup
    return () => {
      window.removeEventListener('quiz-input-change', handleInputChange as EventListener);
    };
  }, []);

  return {
    ...validationState,
    updateNameValue: (value: string) => {
      const isValid = value.trim().length >= 2;
      setValidationState(prev => ({
        ...prev,
        nameValue: value.trim(),
        isNameValid: isValid,
        isButtonEnabled: isValid,
      }));
    },
  };
};

// 🎯 COMPONENTE WRAPPER PARA STEP01 COM VALIDAÇÃO
export const Step01ValidationProvider = ({ children }: { children: React.ReactNode }) => {
  // Inicializar o hook de validação
  useStep01Validation();

  return <>{children}</>;
};

export default useStep01Validation;
