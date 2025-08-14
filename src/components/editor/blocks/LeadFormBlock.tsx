import { Mail, Phone, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { userResponseService } from '../../../services/userResponseService';
import { useFunnelNavigation } from '../../../hooks/useFunnelNavigation';
import type { BlockComponentProps } from '../../../types/blocks';

// ✅ ADICIONAR DEBUG PARA VERIFICAR SE ESTÁ SENDO CARREGADO
console.log('🔧 LeadFormBlock carregado!');

interface LeadFormBlockProps extends BlockComponentProps {
  onComplete?: (data: LeadFormData) => void;
}

interface LeadFormData {
  name: string;
  email: string;
  phone: string;
}

interface FieldValidation {
  isValid: boolean;
  message: string;
}

const LeadFormBlock: React.FC<LeadFormBlockProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  className = '',
  onComplete,
}) => {
  console.log('🎯 LeadFormBlock renderizado com props:', { block: block?.id, type: block?.type });

  if (!block) {
    console.error('❌ LeadFormBlock: bloco não encontrado');
    return (
      <div className="p-4 border-2 border-red-300 rounded-lg">
        <p className="text-red-600">Erro: Bloco não encontrado</p>
      </div>
    );
  }

  const {
    fields = ['name', 'email', 'phone'],
    submitText = 'Receber Guia Gratuito',
    backgroundColor = '#FFFFFF',
    borderColor = '#B89B7A',
    textColor = '#432818',
    primaryColor = '#B89B7A',
    marginTop = 8,
    marginBottom = 8,
  } = (block?.properties as any) || {};

  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    phone: '',
  });

  const [validation, setValidation] = useState<Record<string, FieldValidation>>({
    name: { isValid: false, message: '' },
    email: { isValid: false, message: '' },
    phone: { isValid: false, message: '' },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const navigation = useFunnelNavigation();

  // Carregar dados salvos
  useEffect(() => {
    const savedData = {
      name: userResponseService.getResponse(`${block?.id}-name`) || '',
      email: userResponseService.getResponse(`${block?.id}-email`) || '',
      phone: userResponseService.getResponse(`${block?.id}-phone`) || '',
    };
    setFormData(savedData);
    
    // Validar dados carregados
    validateField('name', savedData.name);
    validateField('email', savedData.email);
    validateField('phone', savedData.phone);
  }, [block?.id]);

  const validateField = (fieldName: string, value: string): boolean => {
    let isValid = false;
    let message = '';

    switch (fieldName) {
      case 'name':
        isValid = value.trim().length >= 2;
        message = isValid ? '' : 'Nome deve ter pelo menos 2 caracteres';
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
        message = isValid ? '' : 'E-mail inválido';
        break;
      case 'phone':
        const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;
        isValid = phoneRegex.test(value.replace(/\D/g, '')) && value.replace(/\D/g, '').length >= 10;
        message = isValid ? '' : 'Telefone deve ter pelo menos 10 dígitos';
        break;
    }

    setValidation(prev => ({
      ...prev,
      [fieldName]: { isValid, message }
    }));

    return isValid;
  };

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    // Validação em tempo real
    const isValid = validateField(fieldName, value);
    
    // Salvar se válido
    if (isValid && value.trim()) {
      userResponseService.saveStepResponse(`${block?.id}-${fieldName}`, value.trim());
      
      // Se for nome, salvar também como nome do usuário
      if (fieldName === 'name') {
        userResponseService.saveUserName('userId', value.trim());
      }
    }

    // Notificar mudanças no painel de propriedades
    if (onPropertyChange) {
      onPropertyChange(`${fieldName}Value`, value);
    }

    // Disparar evento para sistema de navegação
    window.dispatchEvent(
      new CustomEvent('quiz-form-change', {
        detail: {
          blockId: block?.id || '',
          field: fieldName,
          value: value.trim(),
          isValid,
          formData: { ...formData, [fieldName]: value }
        },
      })
    );
  };

  const isFormValid = () => {
    return fields.every((field: string) => validation[field]?.isValid);
  };

  const handleSubmit = async () => {
    if (!isFormValid() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Salvar todas as respostas
      const completeData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        timestamp: new Date().toISOString(),
        blockId: block?.id,
        stepId: 'step-20',
      };

      // Salvar no serviço
      await userResponseService.saveResponse({
        userId: 'anonymous',
        responses: [completeData],
      });

      // Marcar como completo
      setIsComplete(true);

      // Notificar componente pai
      if (onComplete) {
        onComplete(completeData);
      }

      // Disparar evento de conclusão
      window.dispatchEvent(
        new CustomEvent('quiz-form-complete', {
          detail: {
            blockId: block?.id || '',
            data: completeData,
            isValid: true,
          },
        })
      );

      // Navegar para próximo step automaticamente
      setTimeout(() => {
        if (navigation.canNavigateNext) {
          navigation.handleNext();
        }
      }, 1000);

      console.log('✅ Formulário enviado com sucesso:', completeData);
    } catch (error) {
      console.error('❌ Erro ao enviar formulário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldIcon = (fieldName: string) => {
    switch (fieldName) {
      case 'name':
        return User;
      case 'email':
        return Mail;
      case 'phone':
        return Phone;
      default:
        return User;
    }
  };

  const getFieldLabel = (fieldName: string) => {
    switch (fieldName) {
      case 'name':
        return 'Nome completo';
      case 'email':
        return 'E-mail';
      case 'phone':
        return 'WhatsApp/Telefone';
      default:
        return fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
    }
  };

  const getFieldPlaceholder = (fieldName: string) => {
    switch (fieldName) {
      case 'name':
        return 'Seu nome completo';
      case 'email':
        return 'seu.email@exemplo.com';
      case 'phone':
        return '(11) 99999-9999';
      default:
        return `Digite seu ${fieldName}`;
    }
  };

  const getFieldType = (fieldName: string) => {
    switch (fieldName) {
      case 'email':
        return 'email';
      case 'phone':
        return 'tel';
      default:
        return 'text';
    }
  };

  if (isComplete) {
    return (
      <div
        className={`p-6 rounded-lg border-2 text-center ${className}`}
        style={{
          backgroundColor: backgroundColor,
          borderColor: primaryColor,
          marginTop: `${marginTop}px`,
          marginBottom: `${marginBottom}px`,
        }}
      >
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold" style={{ color: textColor }}>
            Dados recebidos com sucesso!
          </h3>
          <p className="text-sm opacity-75" style={{ color: textColor }}>
            Em instantes você será direcionado para receber seu guia personalizado.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        p-6 rounded-lg transition-all duration-200
        ${isSelected
          ? 'border-2 cursor-pointer'
          : 'border-2 hover:shadow-md'
        }
        ${className}
      `}
      style={{
        backgroundColor: backgroundColor,
        borderColor: isSelected ? primaryColor : 'transparent',
        marginTop: `${marginTop}px`,
        marginBottom: `${marginBottom}px`,
      }}
      onClick={onClick}
      data-block-id={block?.id}
      data-block-type={block?.type}
    >
      <div className="space-y-6">
        {fields.map((fieldName: string) => {
          const Icon = getFieldIcon(fieldName);
          const fieldValidation = validation[fieldName];
          
          return (
            <div key={fieldName} className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" style={{ color: borderColor }} />
                <label className="text-sm font-medium uppercase tracking-wide" style={{ color: textColor }}>
                  {getFieldLabel(fieldName)} *
                </label>
              </div>
              <input
                type={getFieldType(fieldName)}
                placeholder={getFieldPlaceholder(fieldName)}
                value={formData[fieldName as keyof LeadFormData]}
                onChange={(e) => handleInputChange(fieldName, e.target.value)}
                className={`
                  w-full px-4 py-3 border-2 rounded-lg
                  focus:ring-2 focus:ring-opacity-50 
                  transition-all outline-none placeholder-opacity-60
                  ${fieldValidation?.isValid
                    ? 'border-green-400 bg-green-50'
                    : formData[fieldName as keyof LeadFormData] && !fieldValidation?.isValid
                      ? 'border-red-400 bg-red-50'
                      : 'hover:border-opacity-80'
                  }
                `}
                style={{
                  borderColor: fieldValidation?.isValid 
                    ? '#10b981' 
                    : formData[fieldName as keyof LeadFormData] && !fieldValidation?.isValid
                      ? '#ef4444'
                      : borderColor,
                  color: textColor,
                }}
              />
              {fieldValidation?.message && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span>⚠️</span>
                  {fieldValidation.message}
                </p>
              )}
            </div>
          );
        })}

        <button
          onClick={handleSubmit}
          disabled={!isFormValid() || isSubmitting}
          className={`
            w-full py-4 px-6 rounded-lg font-bold text-white
            transition-all duration-200 transform
            ${isFormValid() && !isSubmitting
              ? 'hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
              : 'opacity-50 cursor-not-allowed'
            }
          `}
          style={{
            background: isFormValid() 
              ? `linear-gradient(90deg, ${primaryColor}, #aa6b5d)`
              : '#d1d5db',
            boxShadow: isFormValid() ? `0 4px 14px ${primaryColor}33` : 'none',
          }}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Enviando...
            </div>
          ) : (
            submitText
          )}
        </button>

        {!isFormValid() && Object.values(formData).some(value => value.length > 0) && (
          <p className="text-sm text-center opacity-70" style={{ color: textColor }}>
            Preencha todos os campos corretamente para continuar
          </p>
        )}
      </div>
    </div>
  );
};

export default LeadFormBlock;