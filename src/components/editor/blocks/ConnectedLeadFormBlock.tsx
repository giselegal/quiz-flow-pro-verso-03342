import ConnectedLeadForm from '@/components/forms/ConnectedLeadForm';
import { cn } from '@/lib/utils';
import React from 'react';

interface ConnectedLeadFormBlockProps {
  block?: {
    id: string;
    type: string;
    properties?: {
      onSubmitAction?: string;
      className?: string;
      backgroundColor?: string;
      padding?: string;
      // Configurações JSON exportáveis
      formConfig?: {
        enableValidation: boolean;
        realTimeValidation: boolean;
        requiredFields: string[];
        submitButtonText: string;
        placeholderText: string;
        labelText: string;
        successMessage: string;
        errorMessage: string;
        nextStep?: string;
        trackingEnabled: boolean;
      };
    };
    content?: any;
  };
  onPropertyChange?: (key: string, value: any) => void;
  onFormSubmit?: (data: any) => void;
}

/**
 * 🎯 CONNECTED LEAD FORM BLOCK
 * ✅ Formulário avançado com validação complexa
 * ✅ Configuração JSON exportável
 * ✅ Compatível com editor de blocos
 */
const ConnectedLeadFormBlock: React.FC<ConnectedLeadFormBlockProps> = ({
  block,
  onPropertyChange,
  onFormSubmit,
}) => {
  const properties = block?.properties || {};
  const {
    className = '',
    backgroundColor = 'transparent',
    padding = 'p-4',
    formConfig,
  } = properties;

  // Configuração padrão ou do JSON
  const config = formConfig || {
    enableValidation: true,
    realTimeValidation: true,
    requiredFields: ['name'],
    submitButtonText: 'Continuar',
    placeholderText: 'Digite seu primeiro nome...',
    labelText: 'Como posso te chamar?',
    successMessage: 'Nome capturado com sucesso!',
    errorMessage: 'Por favor, digite um nome válido',
    trackingEnabled: true,
  };

  const handleSubmit = (data: any) => {
    console.log('✅ ConnectedLeadFormBlock: Dados capturados:', data);
    
    // Callback personalizado
    if (onFormSubmit) {
      onFormSubmit(data);
    }

    // Atualizar propriedades do bloco
    if (onPropertyChange) {
      onPropertyChange('lastSubmittedData', data);
      onPropertyChange('formSubmitted', true);
    }

    // Navegação automática se configurada
    if (config.nextStep) {
      console.log(`🚀 Navegando para: ${config.nextStep}`);
      // Aqui você pode implementar a navegação
    }
  };

  return (
    <div
      className={cn('connected-lead-form-block', className, padding)}
      style={{ backgroundColor }}
    >
      <ConnectedLeadForm
        onSubmit={handleSubmit}
        className="w-full"
        // Props personalizáveis via JSON
        placeholder={config.placeholderText}
        buttonText={config.submitButtonText}
        validationEnabled={config.enableValidation}
        realTimeValidation={config.realTimeValidation}
      />
      
      {/* Debug info (apenas em desenvolvimento) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 text-xs text-gray-500">
          <details>
            <summary>Form Config (Debug)</summary>
            <pre className="mt-1 text-xs bg-gray-100 p-2 rounded">
              {JSON.stringify(config, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default ConnectedLeadFormBlock;

// ✅ CONFIGURAÇÃO JSON EXPORTÁVEL
export const getConnectedLeadFormConfig = (customConfig?: Partial<any>) => ({
  id: `connected-lead-form-${Date.now()}`,
  type: 'connected-lead-form',
  properties: {
    formConfig: {
      enableValidation: true,
      realTimeValidation: true,
      requiredFields: ['name'],
      submitButtonText: 'Continuar →',
      placeholderText: 'Digite seu primeiro nome...',
      labelText: 'Como posso te chamar?',
      successMessage: 'Perfeito! Vamos continuar...',
      errorMessage: 'Por favor, digite um nome válido',
      trackingEnabled: true,
      ...customConfig,
    },
    className: 'w-full max-w-md mx-auto',
    backgroundColor: 'transparent',
    padding: 'p-4',
  },
});
