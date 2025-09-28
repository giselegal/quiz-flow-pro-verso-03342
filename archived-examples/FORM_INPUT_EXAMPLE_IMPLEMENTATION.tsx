// 🎯 EXEMPLO PRÁTICO: Como implementar form-input avançado
// Arquivo: /src/components/quiz/examples/FormInputExample.tsx

import React, { useEffect, useState } from 'react';
import { useUnifiedProperties } from '../../../hooks/useUnifiedProperties';

interface FormInputAdvancedProps {
  blockId: string;
  blockType: string;
  properties: Record<string, any>;
  onUpdate: (id: string, updates: any) => void;
}

export const FormInputAdvanced: React.FC<FormInputAdvancedProps> = ({
  blockId,
  blockType,
  properties,
  onUpdate,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [showError, setShowError] = useState(false);

  const {
    properties: unifiedProps,
    updateProperty,
    getPropertyByKey,
  } = useUnifiedProperties(
    blockType,
    blockId,
    { id: blockId, type: blockType, properties },
    onUpdate
  );

  // Propriedades extraídas
  const label = getPropertyByKey('label')?.value || 'Campo de Input';
  const placeholder = getPropertyByKey('placeholder')?.value || 'Digite aqui...';
  const required = getPropertyByKey('required')?.value || false;
  const enableButtonWhenFilled = getPropertyByKey('enableButtonWhenFilled')?.value !== false;
  const minLength = getPropertyByKey('minLength')?.value || 1;
  const maxLength = getPropertyByKey('maxLength')?.value || 255;
  const validationPattern = getPropertyByKey('validationPattern')?.value || '';
  const errorMessage = getPropertyByKey('errorMessage')?.value || 'Por favor, preencha este campo';

  // Configurações do botão
  const buttonText = getPropertyByKey('buttonText')?.value || 'Continuar';
  const buttonStyle = getPropertyByKey('buttonStyle')?.value || 'primary';
  const buttonSize = getPropertyByKey('buttonSize')?.value || 'medium';

  // Configurações de navegação
  const nextStepAction = getPropertyByKey('nextStepAction')?.value || 'next-step';
  const specificStep = getPropertyByKey('specificStep')?.value || '';
  const targetUrl = getPropertyByKey('targetUrl')?.value || '';

  // Validação em tempo real
  useEffect(() => {
    const validateInput = () => {
      if (!inputValue && required) {
        setIsValid(false);
        return;
      }

      if (inputValue.length < minLength) {
        setIsValid(false);
        return;
      }

      if (validationPattern) {
        const regex = new RegExp(validationPattern);
        if (!regex.test(inputValue)) {
          setIsValid(false);
          return;
        }
      }

      setIsValid(true);
    };

    validateInput();
  }, [inputValue, required, minLength, validationPattern]);

  // Handler do input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowError(false);

    // Atualizar propriedades
    updateProperty('value', value);
  };

  // Handler do botão
  const handleButtonClick = () => {
    if (!isValid && enableButtonWhenFilled) {
      setShowError(true);
      return;
    }

    // Executar ação baseada na configuração
    switch (nextStepAction) {
      case 'next-step':
        // Navegar para próxima etapa
        onUpdate(blockId, { action: 'next-step', value: inputValue });
        break;

      case 'specific-step':
        // Navegar para etapa específica
        onUpdate(blockId, {
          action: 'navigate-to-step',
          targetStep: specificStep,
          value: inputValue,
        });
        break;

      case 'url':
        // Abrir URL
        if (targetUrl) {
          window.open(targetUrl, '_blank');
        }
        onUpdate(blockId, { action: 'url-opened', url: targetUrl, value: inputValue });
        break;

      case 'submit':
        // Enviar formulário
        onUpdate(blockId, {
          action: 'submit-form',
          formData: { [blockId]: inputValue },
        });
        break;
    }
  };

  // Determinar se botão deve estar habilitado
  const isButtonEnabled = enableButtonWhenFilled ? isValid : true;

  // Classes CSS responsivas para o botão
  const getButtonClasses = () => {
    const baseClasses =
      'transition-all duration-200 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2';

    const sizeClasses = {
      small: 'px-3 py-1.5 text-sm',
      medium: 'px-4 py-2 text-base',
      large: 'px-6 py-3 text-lg',
      full: 'w-full px-4 py-3 text-base sm:text-lg',
    };

    const styleClasses = {
      primary:
        'bg-[#B89B7A] text-white hover:bg-[#A68B6A] focus:ring-[#B89B7A] disabled:bg-gray-300',
      secondary:
        'bg-[#D4C2A8] text-[#432818] hover:bg-[#C4B298] focus:ring-[#D4C2A8] disabled:bg-gray-200',
      outline:
        'border-2 border-[#B89B7A] text-[#B89B7A] hover:bg-[#B89B7A] hover:text-white focus:ring-[#B89B7A] disabled:border-gray-300 disabled:text-gray-300',
      ghost: 'text-[#B89B7A] hover:bg-[#F3E8D3] focus:ring-[#B89B7A] disabled:text-gray-300',
    };

    return `${baseClasses} ${sizeClasses[buttonSize]} ${styleClasses[buttonStyle]}`;
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Label */}
      <label className="block text-sm font-medium text-[#432818] mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input */}
      <div className="relative">
        <input
          type={getPropertyByKey('inputType')?.value || 'text'}
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`
            w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-1
            ${
              isValid
                ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                : showError
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-[#B89B7A] focus:border-[#A68B6A] focus:ring-[#F3E8D3]'
            }
          `}
          style={{
            borderColor: getPropertyByKey('borderColor')?.value || '#B89B7A',
          }}
        />

        {/* Ícone de status */}
        {inputValue && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isValid ? (
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        )}
      </div>

      {/* Mensagem de erro */}
      {showError && !isValid && (
        <p className="text-red-600 text-sm mt-1 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {errorMessage}
        </p>
      )}

      {/* Contador de caracteres */}
      <div className="text-right text-xs text-gray-500">
        {inputValue.length}/{maxLength}
      </div>

      {/* Botão */}
      <button
        onClick={handleButtonClick}
        disabled={!isButtonEnabled}
        className={getButtonClasses()}
      >
        {buttonText}
      </button>

      {/* Debug info (apenas em desenvolvimento) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs">
          <strong>Debug Info:</strong>
          <br />• Valid: {isValid.toString()}
          <br />• Action: {nextStepAction}
          <br />• Target: {specificStep || targetUrl || 'next-step'}
          <br />• Button Enabled: {isButtonEnabled.toString()}
        </div>
      )}
    </div>
  );
};

export default FormInputAdvanced;
