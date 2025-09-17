import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { UnifiedBlockComponentProps } from '@/types/core';

interface LeadFormBlockProps extends UnifiedBlockComponentProps {
  fields?: string[];
  submitText?: string;
  spacing?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  borderRadius?: number;
  fontSize?: number;
  required?: boolean;
  showValidation?: boolean;
  autoFocus?: boolean;
  onSubmitAction?: string;
  redirectUrl?: string;
  successMessage?: string;
  // Mobile-first properties
  mobileColumns?: number;
  tabletColumns?: number;
  desktopColumns?: number;
  mobilePadding?: number;
  tabletPadding?: number;
  desktopPadding?: number;
  mobileOptimized?: boolean;
  onSubmit?: (formData: Record<string, string>) => void;
}

const LeadFormBlock: React.FC<LeadFormBlockProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  className = '',
  fields = ['name', 'email'],
  submitText = 'Receber Guia Gratuito',
  containerWidth = 'full',
  // spacing = 'small', // Remove unused parameter
  backgroundColor = '#FFFFFF',
  borderColor = '#E5E7EB',
  textColor = '#374151',
  buttonColor = '#B89B7A',
  buttonTextColor = '#FFFFFF',
  borderRadius = 8,
  fontSize = 16,
  required = true,
  showValidation = true,
  autoFocus = false,
  onSubmitAction = 'show-message',
  redirectUrl = '',
  successMessage = 'Obrigado! Você receberá seu guia por email.',
  // Remove unused variables to fix TypeScript warnings
  // const mobileColumns = responsiveSettings?.mobileColumns || 1;
  // const tabletColumns = responsiveSettings?.tabletColumns || 2;
  // const desktopColumns = responsiveSettings?.desktopColumns || 3;
  mobilePadding = 16,
  tabletPadding = 24,
  desktopPadding = 32,
  mobileOptimized = true,
  onSubmit,
}) => {
  // Extrair propriedades do bloco se disponível
  const blockProps = block?.properties || {};

  // Usar propriedades do bloco como fallback
  const finalFields = blockProps.fields || fields;
  const finalSubmitText = blockProps.submitText || submitText;
  const finalContainerWidth = blockProps.containerWidth || containerWidth;
  // const finalSpacing = blockProps.spacing || spacing; // Unused
  const finalBackgroundColor = blockProps.backgroundColor || backgroundColor;
  const finalBorderColor = blockProps.borderColor || borderColor;
  const finalTextColor = blockProps.textColor || textColor;
  const finalButtonColor = blockProps.buttonColor || buttonColor;
  const finalButtonTextColor = blockProps.buttonTextColor || buttonTextColor;
  const finalBorderRadius = blockProps.borderRadius || borderRadius;
  const finalFontSize = blockProps.fontSize || fontSize;
  const finalMobilePadding = blockProps.mobilePadding || mobilePadding;
  const finalTabletPadding = blockProps.tabletPadding || tabletPadding;
  const finalDesktopPadding = blockProps.desktopPadding || desktopPadding;
  const finalMobileOptimized = blockProps.mobileOptimized !== false && mobileOptimized;
  const finalRequired = blockProps.required !== false && required;
  const finalShowValidation = blockProps.showValidation !== false && showValidation;
  const finalAutoFocus = blockProps.autoFocus || autoFocus;
  const finalOnSubmitAction = blockProps.onSubmitAction || onSubmitAction;
  const finalSuccessMessage = blockProps.successMessage || successMessage;

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Mobile-first responsive classes
  const containerClasses = cn(
    'lead-form-block w-full transition-all duration-200',
    // Mobile-first container width
    finalContainerWidth === 'small' && 'max-w-sm mx-auto',
    finalContainerWidth === 'medium' && 'max-w-md mx-auto',
    finalContainerWidth === 'large' && 'max-w-lg mx-auto',
    finalContainerWidth === 'full' && 'max-w-full',
    // Mobile-first padding using CSS-in-JS for precise control
    finalMobileOptimized && 'touch-manipulation',
    isSelected && 'ring-2 ring-blue-500 ring-opacity-50',
    className
  );

  // Dynamic styles for mobile-first approach
  const dynamicStyles: React.CSSProperties = {
    backgroundColor: finalBackgroundColor,
    borderRadius: `${finalBorderRadius}px`,
    border: `1px solid ${finalBorderColor}`,
    fontSize: `${finalFontSize}px`,
    color: finalTextColor,
    // Mobile-first padding
    padding: `${finalMobilePadding}px`,
    // Tablet padding (md breakpoint)
    ...(window.innerWidth >= 768 && { padding: `${finalTabletPadding}px` }),
    // Desktop padding (lg breakpoint)
    ...(window.innerWidth >= 1024 && { padding: `${finalDesktopPadding}px` }),
  };

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Notify parent component of changes
    if (onPropertyChange) {
      onPropertyChange('formData', { ...formData, [field]: value });
    }
  }, [formData, errors, onPropertyChange]);

  const validateForm = useCallback((): boolean => {
    if (!finalRequired) return true;

    const newErrors: Record<string, string> = {};

    finalFields.forEach((field: any) => {
      const value = formData[field]?.trim() || '';

      if (!value) {
        newErrors[field] = `${getFieldLabel(field)} é obrigatório`;
      } else if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors[field] = 'E-mail inválido';
      } else if ((field === 'phone' || field === 'whatsapp') && !/^\d{10,11}$/.test(value.replace(/\D/g, ''))) {
        newErrors[field] = 'Telefone deve ter 10 ou 11 dígitos';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [finalFields, finalRequired, formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Dispatch form completion event with enhanced data
      const event = new CustomEvent('quiz-form-complete', {
        detail: {
          formData,
          source: 'LeadFormBlock',
          blockId: block?.id,
          timestamp: new Date().toISOString(),
          fields: finalFields,
          step: 'step-20'
        },
      });
      window.dispatchEvent(event);

      // Call parent onSubmit if provided
      if (onSubmit) {
        await onSubmit(formData);
      }

      // Handle different submit actions
      switch (finalOnSubmitAction) {
        case 'show-message':
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 5000);
          break;
        case 'redirect':
          if (redirectUrl) {
            window.location.href = redirectUrl;
          }
          break;
        case 'next-step':
          // Trigger navigation to next step
          window.dispatchEvent(new CustomEvent('quiz-next-step', {
            detail: { from: 'lead-form', formData }
          }));
          break;
        default:
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 5000);
      }

    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ submit: 'Erro ao enviar formulário. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldLabel = (field: string): string => {
    const labels: Record<string, string> = {
      name: 'Nome Completo',
      email: 'E-mail',
      phone: 'Telefone',
      whatsapp: 'WhatsApp',
    };
    return labels[field] || field.charAt(0).toUpperCase() + field.slice(1);
  };

  const getFieldType = (field: string): string => {
    const types: Record<string, string> = {
      email: 'email',
      phone: 'tel',
      whatsapp: 'tel',
    };
    return types[field] || 'text';
  };

  const getFieldPlaceholder = (field: string): string => {
    const placeholders: Record<string, string> = {
      name: 'Digite seu nome completo',
      email: 'Digite seu melhor e-mail',
      phone: 'Digite seu telefone',
      whatsapp: 'Digite seu WhatsApp',
    };
    return placeholders[field] || `Digite seu ${field}`;
  };

  return (
    <div
      className={containerClasses}
      style={dynamicStyles}
      onClick={onClick}
    >
      {showSuccess ? (
        <div className="text-center py-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Sucesso!</h3>
            <p className="text-green-700">{finalSuccessMessage}</p>
          </div>
          <Button
            onClick={() => setShowSuccess(false)}
            variant="outline"
            size="sm"
          >
            Voltar ao formulário
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Grid responsivo para campos */}
          <div className={cn(
            'grid gap-4',
            // Mobile-first grid
            'grid-cols-1',
            // Tablet breakpoint
            finalFields.length > 2 && 'md:grid-cols-2',
            // Desktop breakpoint  
            finalFields.length > 4 && 'lg:grid-cols-3'
          )}>
            {finalFields.map((field: any, index: number) => (
              <div key={field} className="space-y-2">
                <Label
                  htmlFor={field}
                  className="text-sm font-medium"
                  style={{ color: finalTextColor }}
                >
                  {getFieldLabel(field)}
                  {finalRequired && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <Input
                  id={field}
                  name={field}
                  type={getFieldType(field)}
                  placeholder={getFieldPlaceholder(field)}
                  value={formData[field] || ''}
                  onChange={e => handleInputChange(field, e.target.value)}
                  className={cn(
                    'w-full transition-colors duration-200',
                    // Mobile-optimized input height
                    finalMobileOptimized && 'h-12 md:h-10',
                    errors[field] && 'border-red-500 focus:border-red-500'
                  )}
                  style={{
                    borderColor: errors[field] ? '#EF4444' : finalBorderColor,
                    fontSize: finalMobileOptimized ? '16px' : `${finalFontSize}px` // Prevent zoom on iOS
                  }}
                  required={finalRequired}
                  autoFocus={finalAutoFocus && index === 0}
                />
                {finalShowValidation && errors[field] && (
                  <p className="text-sm text-red-500 mt-1">{errors[field]}</p>
                )}
              </div>
            ))}
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'w-full font-medium transition-all duration-200',
              // Mobile-optimized button height
              finalMobileOptimized && 'h-12 text-lg md:h-10 md:text-base'
            )}
            style={{
              backgroundColor: finalButtonColor,
              color: finalButtonTextColor,
              borderRadius: `${finalBorderRadius}px`,
            }}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Enviando...
              </div>
            ) : (
              finalSubmitText
            )}
          </Button>

          {/* General error message */}
          {finalShowValidation && errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          )}

          {/* Debug info in development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
              <p>Fields: {finalFields.join(', ')}</p>
              <p>Mobile Optimized: {finalMobileOptimized ? 'Yes' : 'No'}</p>
              <p>Form Data: {JSON.stringify(formData, null, 2)}</p>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default LeadFormBlock;
