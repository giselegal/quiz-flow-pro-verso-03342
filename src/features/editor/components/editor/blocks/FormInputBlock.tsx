import { TextCursorInput } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { userResponseService } from '../../../services/userResponseService';
import type { BlockComponentProps } from '../../../types/blocks';

interface FormInputBlockProps extends BlockComponentProps {
  funnelId?: string;
  onValueChange?: (value: string) => void;
}

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (
  value: string | number,
  type: 'top' | 'bottom' | 'left' | 'right'
): string => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return '';

  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};

const FormInputBlock: React.FC<FormInputBlockProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  className = '',
  funnelId: _funnelId = 'default-quiz-funnel-21-steps',
  onValueChange,
}) => {
  // Verificação de segurança para evitar erro de undefined
  if (!block) {
    return (
      <div style={{ borderColor: '#B89B7A' }}>
        <p style={{ color: '#432818' }}>Erro: Bloco não encontrado</p>
      </div>
    );
  }

  const {
    label = 'Campo de Input',
    placeholder = 'Digite aqui...',
    inputType = 'text',
    required = false,
    fullWidth = true,
    name = 'input',
    // Configurações de estilo
    backgroundColor = '#FFFFFF',
    borderColor = '#B89B7A',
    textColor = '#432818',
    labelColor = '#432818',
    fontSize = '16',
    fontFamily = 'inherit',
    fontWeight = '400',
    borderRadius = '8',
    // Sistema de margens
    marginTop = 8,
    marginBottom = 8,
    marginLeft = 0,
    marginRight = 0,
  } = (block?.properties as any) || {};

  const [value, setValue] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(false);
  const [sessionId] = useState<string>(() => {
    // Get or create session ID
    const existing = localStorage.getItem('quiz_session_id');
    if (existing) return existing;
    
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('quiz_session_id', newSessionId);
    return newSessionId;
  });

  // Carregar valor salvo se existir
  useEffect(() => {
    const savedValue = localStorage.getItem(`quiz_step_${block?.id}`);
    if (savedValue) {
      setValue(savedValue);
      setIsValid(true);
    }
  }, [block?.id]);

  const handleInputChange = async (newValue: string) => {
    setValue(newValue);
    const valid = !required || newValue.trim().length > 0;
    setIsValid(valid);

    // ✅ Usar onPropertyChange para edição no painel de propriedades
    if (onPropertyChange) {
      onPropertyChange('value', newValue);
    }

    // Disparar evento customizado para outros componentes sempre
    window.dispatchEvent(
      new CustomEvent('quiz-input-change', {
        detail: { blockId: block?.id || '', value: newValue.trim(), valid },
      })
    );

    // Salvar automaticamente se válido
    if (valid && newValue.trim()) {
      try {
        // Salvar resposta específica localmente
        userResponseService.saveStepResponse(block?.id || '', newValue.trim());

        // Se for o campo de nome, salvar no Supabase
        if (
          name === 'userName' ||
          block?.id === 'step01-name-input' ||
          block?.id === 'intro-form-input' ||
          block?.id === 'intro-name-input'
        ) {
          // Save to Supabase
          try {
            await userResponseService.createQuizUser({
              sessionId: sessionId,
              name: newValue.trim(),
            });

            // Also save response data
            await userResponseService.saveResponse({
              userId: sessionId,
              sessionId: sessionId,
              step: 'step-01',
              data: { name: newValue.trim(), fieldName: name },
              timestamp: new Date().toISOString(),
            });

            console.log('✅ [FormInputBlock] Nome salvo no Supabase:', newValue.trim());
          } catch (error) {
            console.error('❌ [FormInputBlock] Erro ao salvar no Supabase:', error);
          }

          // Also save locally as fallback
          userResponseService.saveUserName(sessionId, newValue.trim());
        }

        console.log('📝 [FormInputBlock] Input change processed:', {
          blockId: block?.id,
          sessionId: sessionId,
          value: newValue.trim(),
          valid,
          isNameField: name === 'userName' || block?.id?.includes('name'),
        });

        // Notificar componente pai
        if (onValueChange) {
          onValueChange(newValue.trim());
        }
      } catch (error) {
        console.error('❌ Erro ao salvar resposta:', error);
      }
    }
  };

  return (
    <div
      className={`
        p-4 rounded-lg transition-all duration-200
        ${
          isSelected
            ? 'border-2 border-[#B89B7A] bg-[#B89B7A]/10 cursor-pointer'
            : 'border-2 border-transparent hover:bg-[#FAF9F7]'
        }
        ${className}
        ${getMarginClass(marginTop, 'top')}
        ${getMarginClass(marginBottom, 'bottom')}
        ${getMarginClass(marginLeft, 'left')}
        ${getMarginClass(marginRight, 'right')}
      `}
      onClick={onClick}
      data-block-id={block?.id}
      data-block-type={block?.type}
    >
      <div className={`space-y-3 ${fullWidth ? 'w-full' : 'w-auto'}`}>
        <div className="flex items-center gap-2">
          <TextCursorInput className="w-4 h-4" style={{ color: borderColor }} />
          <label
            className="text-sm font-medium uppercase tracking-wide"
            style={{
              color: labelColor,
              fontFamily: fontFamily,
              fontWeight: fontWeight,
            }}
          >
            {label}
            {required && (
              <span style={{ color: borderColor }} className="ml-1">
                *
              </span>
            )}
          </label>
        </div>

        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={e => handleInputChange(e.target.value)}
          style={{
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            color: textColor,
            fontSize: `${fontSize}px`,
            fontFamily: fontFamily,
            fontWeight: fontWeight,
            borderRadius: `${borderRadius}px`,
          }}
          className={`
            w-full px-4 py-3 border-2 
            focus:ring-2 focus:ring-opacity-50 
            transition-all outline-none placeholder-opacity-70
            ${
              isValid
                ? 'ring-2 ring-opacity-20'
                : value && !isValid
                  ? 'border-opacity-50'
                  : 'hover:border-opacity-80'
            }
          `}
        />
      </div>
    </div>
  );
};

export default FormInputBlock;
