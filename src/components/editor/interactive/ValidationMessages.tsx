import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import React, { memo } from 'react';

interface ValidationMessagesProps {
  validationState: Record<string, boolean>;
  hasInteractedWith: Record<string, boolean>;
  blockTypes: Record<string, string>;
  className?: string;
}

/**
 * 🎯 COMPONENTE DE MENSAGENS DE VALIDAÇÃO
 *
 * Exibe feedback de validação para campos interativos:
 * - Status de validação por campo
 * - Mensagens de erro específicas
 * - Indicadores visuais
 * - Suporte a múltiplos tipos de campo
 */
export const ValidationMessages: React.FC<ValidationMessagesProps> = memo(
  ({ validationState, hasInteractedWith, blockTypes, className = '' }) => {
    const invalidFields = Object.entries(validationState)
      .filter(([_, isValid]) => !isValid)
      .map(([fieldId]) => fieldId);

    const interactedInvalidFields = invalidFields.filter(fieldId => hasInteractedWith[fieldId]);

    // Não exibir se não há erros ou não houve interação
    if (invalidFields.length === 0) {
      return null;
    }

    // Mostrar apenas campos com os quais o usuário interagiu
    if (interactedInvalidFields.length === 0) {
      return null;
    }

    return (
      <div className={`validation-messages space-y-2 ${className}`}>
        {interactedInvalidFields.map(fieldId => {
          const fieldType = blockTypes[fieldId] || 'campo';
          const message = getValidationMessage(fieldType);

          return (
            <div
              key={fieldId}
              className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <span className="font-medium">{message.title}</span>
                {message.description && (
                  <span className="block text-red-700 mt-1">{message.description}</span>
                )}
              </div>
            </div>
          );
        })}

        {/* Resumo de validação quando há múltiplos erros */}
        {interactedInvalidFields.length > 1 && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mt-3">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <span className="font-medium">
                {interactedInvalidFields.length} campos precisam ser preenchidos
              </span>
              <span className="block text-amber-700 mt-1">
                Corrija os itens destacados para continuar.
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

// Helper para gerar mensagens de validação específicas
function getValidationMessage(fieldType: string) {
  const messages: Record<string, { title: string; description?: string }> = {
    'quiz-question-inline': {
      title: 'Selecione uma opção',
      description: 'Escolha a alternativa que melhor representa você.',
    },
    'input-field': {
      title: 'Campo obrigatório',
      description: 'Este campo precisa ser preenchido para continuar.',
    },
    'text-input': {
      title: 'Digite sua resposta',
      description: 'Este campo de texto é obrigatório.',
    },
    'email-input': {
      title: 'E-mail obrigatório',
      description: 'Digite um endereço de e-mail válido.',
    },
    'phone-input': {
      title: 'Telefone obrigatório',
      description: 'Digite um número de telefone válido.',
    },
    'name-input': {
      title: 'Nome obrigatório',
      description: 'Digite seu nome completo.',
    },
    'multiple-choice': {
      title: 'Selecione uma opção',
      description: 'Escolha uma das alternativas disponíveis.',
    },
    checkbox: {
      title: 'Marque esta opção',
      description: 'Este campo de confirmação é obrigatório.',
    },
    rating: {
      title: 'Avalie este item',
      description: 'Selecione uma nota de 1 a 5.',
    },
    slider: {
      title: 'Ajuste o valor',
      description: 'Mova o controle para definir sua preferência.',
    },
    default: {
      title: 'Campo obrigatório',
      description: 'Complete este campo para prosseguir.',
    },
  };

  return messages[fieldType] || messages.default;
}

/**
 * 🎯 COMPONENTE DE FEEDBACK POSITIVO
 *
 * Exibe mensagem de sucesso quando todos os campos estão válidos
 */
interface ValidationSuccessProps {
  message?: string;
  className?: string;
}

export const ValidationSuccess: React.FC<ValidationSuccessProps> = memo(
  ({ message = 'Todos os campos estão preenchidos corretamente!', className = '' }) => {
    return (
      <div className={`validation-success ${className}`}>
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
          <div className="text-sm text-green-800">
            <span className="font-medium">{message}</span>
          </div>
        </div>
      </div>
    );
  }
);

/**
 * 🎯 HOOK PARA VALIDAÇÃO DE CAMPOS
 *
 * Gerencia estado de validação e interação
 */
export function useFieldValidation() {
  const [validationState, setValidationState] = React.useState<Record<string, boolean>>({});
  const [hasInteractedWith, setHasInteractedWith] = React.useState<Record<string, boolean>>({});
  const [blockTypes, setBlockTypes] = React.useState<Record<string, string>>({});

  const updateValidation = React.useCallback(
    (fieldId: string, isValid: boolean, fieldType?: string) => {
      setValidationState(prev => ({ ...prev, [fieldId]: isValid }));
      if (fieldType) {
        setBlockTypes(prev => ({ ...prev, [fieldId]: fieldType }));
      }
    },
    []
  );

  const markAsInteracted = React.useCallback((fieldId: string) => {
    setHasInteractedWith(prev => ({ ...prev, [fieldId]: true }));
  }, []);

  const isFormValid = React.useMemo(() => {
    return Object.values(validationState).every(isValid => isValid);
  }, [validationState]);

  const hasErrors = React.useMemo(() => {
    return Object.values(validationState).some(isValid => !isValid);
  }, [validationState]);

  const interactedErrorCount = React.useMemo(() => {
    return Object.entries(validationState).filter(
      ([fieldId, isValid]) => !isValid && hasInteractedWith[fieldId]
    ).length;
  }, [validationState, hasInteractedWith]);

  return {
    validationState,
    hasInteractedWith,
    blockTypes,
    updateValidation,
    markAsInteracted,
    isFormValid,
    hasErrors,
    interactedErrorCount,
  };
}

ValidationMessages.displayName = 'ValidationMessages';
ValidationSuccess.displayName = 'ValidationSuccess';
