import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';
import { ArrowRight, Download, Edit3, MousePointer2, Play, Star } from 'lucide-react';
import React, { useEffect, useState, useMemo } from 'react';
import { sessionService } from '../../../services/sessionService';
import { userResponseService } from '../../../services/userResponseService';
import { trackQuizStart } from '../../../utils/analytics';
import { useOptimizedScheduler } from '@/hooks/useOptimizedScheduler';
import { StorageService } from '@/services/core/StorageService';
import { useGlobalEventManager } from '@/hooks/useGlobalEventManager';
import { useQuizRulesConfig } from '@/hooks/useQuizRulesConfig';
import { useUnifiedQuizState } from '@/hooks/useUnifiedQuizState';

/**
 * ButtonInlineBlock - Componente modular inline horizontal
 * Botão responsivo e configurável com múltiplas variantes
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 * 
 * ✅ CONFIGURAÇÃO CENTRALIZADA: Usa useQuizRulesConfig para regras automáticas
 */

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

const ButtonInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange: _onPropertyChange,
  className = '',
}) => {
  // Verificação de segurança para evitar erro de undefined
  if (!block) {
    return (
      <div style={{ borderColor: '#B89B7A' }}>
        <p style={{ color: '#432818' }}>Erro: Bloco não encontrado</p>
      </div>
    );
  }

  if (!block.properties) {
    return <div style={{ color: '#432818' }}>⚠️ Erro: Propriedades do bloco não encontradas</div>;
  }

  const {
    text = 'Clique aqui',
    variant = 'primary',
    size = 'medium',
    icon = 'none',
    iconPosition = 'right',
    href = '',
    url = '', // Campo adicional para URL
    target = '_blank',
    disabled = false,
    customStyles: _customStyles = '',
    requiresValidInput = false,
    requiresValidSelection = false,
    // Configurações de cores
    backgroundColor = '#B89B7A',
    textColor = '#FFFFFF',
    borderColor = '#B89B7A',
    // Configurações de fonte
    fontSize = '16',
    fontFamily = 'inherit',
    fontWeight = '500',
    // Configurações de navegação/fluxo
    action = 'none', // "next-step", "url", "none"
    nextStepId = '', // ID da próxima etapa
    autoAdvanceOnComplete = false,
    autoAdvanceDelay = 600,
    // Sistema completo de margens com controles deslizantes
    marginTop = 8,
    marginBottom = 8,
    marginLeft = 0,
    marginRight = 0,
    // Novas propriedades de efeitos visuais
    shadowType = 'none',
    shadowColor = '#000000',
    effectType = 'none',
    borderRadius = 8,
    hoverOpacity = 90,
    // Estado visual/validação
    showDisabledState = false,
    disabledText = '',
    disabledOpacity = 50,
    loading = false,
  } = (block?.properties as any) || {};

  // 🎯 APLICAR CONFIGURAÇÕES AUTOMÁTICAS POR ETAPA
  const {
    getStepRules,
    isAlwaysActiveStep,
    getRequiredSelections,
    getButtonActivationRule
  } = useQuizRulesConfig();
  const { getCurrentStep } = useUnifiedQuizState();

  // Obter etapa atual
  const currentStep = getCurrentStep();
  const stepRule = getStepRules(currentStep);
  const requiredSelections = getRequiredSelections(currentStep);
  const buttonActivationRule = getButtonActivationRule(currentStep);
  const isAlwaysActive = isAlwaysActiveStep(currentStep);

  // Aplicar regras específicas baseadas na configuração centralizada
  const finalRequiresValidInput = (
    buttonActivationRule === 'requiresValidInput' ||
    (stepRule?.validation.type === 'input' && stepRule.validation.required) ||
    requiresValidInput
  );

  const finalRequiresValidSelection = (
    buttonActivationRule === 'requiresValidSelection' ||
    (stepRule?.validation.type === 'selection' && stepRule.validation.required) ||
    requiresValidSelection
  );

  const finalAutoAdvanceOnComplete = stepRule?.behavior.autoAdvance || autoAdvanceOnComplete;
  const finalAutoAdvanceDelay = stepRule?.behavior.autoAdvanceDelay || autoAdvanceDelay;

  console.log('🎯 ButtonInlineBlock - Configurações aplicadas:', {
    currentStep,
    stepRule: stepRule ? {
      type: stepRule.type,
      validation: stepRule.validation,
      behavior: stepRule.behavior
    } : null,
    requiredSelections,
    buttonActivationRule,
    isAlwaysActive,
    finalRequiresValidInput,
    finalRequiresValidSelection,
    finalAutoAdvanceOnComplete,
    finalAutoAdvanceDelay
  });

  // Suporte a controle externo de estado (eventos globais)
  const buttonId =
    (block?.id as string) || (block?.properties as any)?.buttonId || 'cta-button-modular';
  const [externalDisabled, setExternalDisabled] = useState<boolean | null>(null);
  const { addEventListener } = useGlobalEventManager();

  useEffect(() => {
    const onButtonState = (e: Event) => {
      const evt = e as CustomEvent<{ buttonId?: string; enabled?: boolean; disabled?: boolean }>;
      const detail = evt.detail || {};
      if (detail.buttonId && detail.buttonId !== buttonId) return;
      if (typeof detail.enabled === 'boolean') {
        setExternalDisabled(!detail.enabled);
      } else if (typeof detail.disabled === 'boolean') {
        setExternalDisabled(!!detail.disabled);
      }
    };

    // Usar o gerenciador central ao invés de window.addEventListener direto
    const cleanup1 = addEventListener('quiz-button-state-change', onButtonState);
    const cleanup2 = addEventListener('step01-button-state-change', onButtonState);

    return () => {
      cleanup1();
      cleanup2();
    };
  }, [buttonId, addEventListener]);

  const [isValidated, setIsValidated] = useState(false);
  const [isSelectionValid, setIsSelectionValid] = useState(!finalRequiresValidSelection);

  // Efeito para verificar validação de input quando necessário
  useEffect(() => {
    if (finalRequiresValidInput) {
      // Verificar se há input válido (exemplo: nome preenchido)
      userResponseService
        .getResponse('intro-name-input')
        .then(nameValue => {
          setIsValidated(!!nameValue && nameValue.trim().length > 0);
        })
        .catch(() => {
          setIsValidated(false);
        });
    } else {
      setIsValidated(true);
    }
  }, [finalRequiresValidInput]);

  // Efeito para ouvir mudanças de seleção do quiz (validação de seleção)
  useEffect(() => {
    const handleQuizSelectionChange = (event: Event) => {
      const e = event as CustomEvent<any>;

      // Validação inteligente baseada no número de seleções necessárias
      if (finalRequiresValidSelection && requiredSelections > 0) {
        const selectedCount = e.detail?.selectedCount || e.detail?.count || 0;
        const isValid = selectedCount >= requiredSelections;

        console.log('🎯 ButtonInlineBlock - Validação de seleção:', {
          currentStep,
          requiredSelections,
          selectedCount,
          isValid
        });

        setIsSelectionValid(isValid);
      } else {
        // Fallback para validação genérica
        const valid = typeof e.detail?.isValid === 'boolean' ? e.detail.isValid : !!e.detail?.valid;
        if (finalRequiresValidSelection) setIsSelectionValid(valid);
      }
    };

    const handleQuizInputChange = (event: Event) => {
      if (!finalRequiresValidInput) return;
      const e = event as CustomEvent<any>;
      const { value, valid } = e.detail || {};
      const ok = typeof value === 'string' ? value.trim().length > 0 : !!valid;
      setIsValidated(ok);
    };

    // Usar o gerenciador central
    let cleanup1: (() => void) | null = null;
    let cleanup2: (() => void) | null = null;

    if (finalRequiresValidSelection) {
      cleanup1 = addEventListener('quiz-selection-change', handleQuizSelectionChange);
    }
    if (finalRequiresValidInput) {
      cleanup2 = addEventListener('quiz-input-change', handleQuizInputChange);
    }

    return () => {
      cleanup1?.();
      cleanup2?.();
    };
  }, [finalRequiresValidSelection, finalRequiresValidInput, requiredSelections, currentStep, addEventListener]);

  // Determinar se o botão deve estar desabilitado baseado nas regras centralizadas
  const isButtonDisabled = useMemo(() => {
    // Se tem controle externo, usar ele
    if (externalDisabled !== null) return externalDisabled;

    // Se está loading, desabilitar
    if (loading) return true;

    // Se disabled manual, desabilitar  
    if (disabled) return true;

    // Se é etapa sempre ativa (12, 19-21), nunca desabilitar
    if (isAlwaysActive) return false;

    // Lógica inteligente baseada nas configurações centralizadas
    if (buttonActivationRule === 'always') {
      // Botão sempre ativo
      return false;
    } else if (buttonActivationRule === 'requiresValidInput') {
      // Etapa 1: requer input válido (nome)
      return !isValidated;
    } else if (buttonActivationRule === 'requiresValidSelection') {
      // Etapas que requerem seleção (2-11: 3 seleções, 13-18: 1 seleção)
      return !isSelectionValid;
    }

    // Fallback para casos específicos (não deveria ser necessário)
    switch (currentStep) {
      case 1:
        return !isValidated;
      case 12: case 19: case 20: case 21:
        return false;
      default:
        return (finalRequiresValidInput && !isValidated) ||
          (finalRequiresValidSelection && !isSelectionValid);
    }
  }, [
    externalDisabled,
    loading,
    disabled,
    isAlwaysActive,
    buttonActivationRule,
    currentStep,
    isValidated,
    isSelectionValid,
    finalRequiresValidInput,
    finalRequiresValidSelection
  ]);
  // 🚀 Função para inicializar quiz no Supabase
  const initializeQuizWithSupabase = async (userName: string) => {
    try {
      // Garante um sessionId local
      sessionService.ensureLocalSessionId();
      // Tenta iniciar sessão real (gera UUID) e persistir
      const start = await sessionService.startQuizSession({
        name: userName,
        quizId: 'default-funnel',
      });
      if (start.success) {
        console.log('✅ Sessão Supabase iniciada:', start.sessionId);
        // Após obter UUID, tentar flush de respostas pendentes
        await userResponseService.flushPending();
      } else {
        console.log('⚠️ Usando sessão local sem UUID, permaneceremos offline-first');
      }
    } catch (error) {
      console.error('❌ Erro ao inicializar quiz no Supabase:', error);
    }
  };

  // Ícones disponíveis
  const iconMap = {
    none: null,
    'arrow-right': ArrowRight,
    download: Download,
    play: Play,
    star: Star,
  };

  const IconComponent = iconMap[icon as keyof typeof iconMap];

  // Função para gerar classes de sombra
  const getShadowClasses = () => {
    const shadowClasses = {
      none: '',
      small: 'shadow-sm',
      medium: 'shadow-md',
      large: 'shadow-lg',
      inner: 'shadow-inner',
      glow: `shadow-lg`,
    };

    return shadowClasses[shadowType as keyof typeof shadowClasses] || '';
  };

  // Função para gerar estilos de sombra customizada
  const getShadowStyles = () => {
    if (shadowType === 'glow') {
      return {
        boxShadow: `0 0 20px ${shadowColor}40, 0 0 40px ${shadowColor}20`,
      };
    }
    if (shadowType === 'inner') {
      return {
        boxShadow: `inset 0 2px 4px ${shadowColor}30`,
      };
    }
    if (shadowType !== 'none' && shadowColor !== '#000000') {
      const intensity = shadowType === 'small' ? '20' : shadowType === 'medium' ? '30' : '40';
      const blur = shadowType === 'small' ? '6px' : shadowType === 'medium' ? '10px' : '15px';
      const offset = shadowType === 'small' ? '2px' : shadowType === 'medium' ? '4px' : '6px';
      return {
        boxShadow: `0 ${offset} ${blur} ${shadowColor}${intensity}`,
      };
    }
    return {};
  };

  // Função para gerar classes de efeitos visuais
  const getEffectClasses = () => {
    const effectClasses = {
      none: '',
      'hover-lift': 'hover:transform hover:-translate-y-1 hover:scale-105',
      pulse: 'animate-pulse',
      bounce: 'animate-bounce',
      gradient: 'bg-gradient-to-r',
      shine: 'relative overflow-hidden',
    };

    return effectClasses[effectType as keyof typeof effectClasses] || '';
  };

  // Variantes de cor - usando as configurações customizáveis
  const getButtonStyles = () => {
    const baseStyle = {
      fontFamily: fontFamily,
      fontSize: `${fontSize}px`,
      fontWeight: fontWeight,
      borderRadius: `${borderRadius}px`,
      transition: 'all 0.3s ease',
      ...getShadowStyles(),
    };

    if (variant === 'custom' || variant === 'primary') {
      // Suporte a gradiente para effectType === "gradient"
      if (effectType === 'gradient') {
        return {
          ...baseStyle,
          background: `linear-gradient(135deg, ${backgroundColor}, ${backgroundColor}dd)`,
          color: textColor,
          borderColor: borderColor,
        };
      }

      return {
        ...baseStyle,
        backgroundColor: backgroundColor,
        color: textColor,
        borderColor: borderColor,
      };
    }

    const predefinedStyles = {
      secondary: {
        backgroundColor: '#6B7280',
        color: '#FFFFFF',
        borderColor: '#6B7280',
      },
      success: {
        backgroundColor: '#10B981',
        color: '#FFFFFF',
        borderColor: '#10B981',
      },
      warning: {
        backgroundColor: '#F59E0B',
        color: '#FFFFFF',
        borderColor: '#F59E0B',
      },
      danger: {
        backgroundColor: '#aa6b5d',
        color: '#FFFFFF',
        borderColor: '#aa6b5d',
      },
      outline: {
        backgroundColor: 'transparent',
        color: backgroundColor,
        borderColor: backgroundColor,
      },
    };

    const selectedStyle =
      predefinedStyles[variant as keyof typeof predefinedStyles] || predefinedStyles.secondary;

    // Aplicar gradiente se necessário
    if (effectType === 'gradient') {
      return {
        ...baseStyle,
        background: `linear-gradient(135deg, ${selectedStyle.backgroundColor}, ${selectedStyle.backgroundColor}dd)`,
        color: selectedStyle.color,
        borderColor: selectedStyle.borderColor,
      };
    }

    return {
      ...baseStyle,
      ...selectedStyle,
    };
  };

  // Tamanhos de botão
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm gap-1.5 min-h-[32px]',
    medium: 'px-4 py-2 text-base gap-2 min-h-[40px]',
    large: 'px-6 py-3 text-lg gap-2.5 min-h-[48px]',
  };

  const iconSizes = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-5 h-5',
  };

  // Função para determinar classes responsivas
  const getResponsiveClasses = () => {
    return cn(
      // Classes base do botão
      'inline-flex items-center justify-center font-medium transition-all duration-300',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89B7A] focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'border-2 w-full',

      // Aplicar tamanho
      sizeClasses[size as keyof typeof sizeClasses],

      // Classes de sombra
      getShadowClasses(),

      // Classes de efeitos visuais
      getEffectClasses(),

      // Hover dinâmico baseado na opacidade configurada
      `hover:opacity-[${hoverOpacity}%]`,

      // Estado de seleção no editor
      isSelected && 'ring-2 ring-[#B89B7A] ring-offset-2',

      // Classes customizadas
      className
    );
  };

  return (
    <div
      className={cn(
        'group relative inline-flex w-full cursor-pointer transition-all duration-200',
        isSelected && 'ring-1 ring-[#B89B7A]/40',
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
      onClick={onClick}
      data-block-id={block?.id}
      data-block-type={block?.type}
    >
      {/* Botão principal */}
      <button
        type="button"
        id={block?.id}
        disabled={isButtonDisabled}
        aria-disabled={isButtonDisabled}
        className={getResponsiveClasses()}
        style={{
          ...getButtonStyles(),
          ...(isButtonDisabled && showDisabledState
            ? { opacity: Math.max(0, Math.min(100, Number(disabledOpacity))) / 100 }
            : {}),
        }}
        onClick={async e => {
          e.stopPropagation();
          // Validação robusta: se exigir input válido, checar DOM e storage em tempo real
          let allowProceed = true;
          if (finalRequiresValidInput) {
            // 1) Tentar pegar diretamente do DOM (campo de nome)
            const nameInputEl = document.querySelector(
              'input[name="userName"]'
            ) as HTMLInputElement | null;
            const domValue = nameInputEl?.value?.trim() || '';

            // 2) Fallback: ler resposta salva (local/offline ou Supabase)
            let storedValue = '';
            try {
              storedValue =
                (await userResponseService.getResponse('intro-name-input'))?.trim() || '';
            } catch { }

            const effectiveName = domValue || storedValue;
            allowProceed = !!effectiveName && effectiveName.length > 0;
          }

          if (isButtonDisabled && !allowProceed) {
            return;
          }
          if (!allowProceed) {
            return;
          }
          if (finalRequiresValidSelection && !isSelectionValid) {
            return;
          }

          if (true) {
            // Handle URL navigation
            if (action === 'url' && (href || url)) {
              const targetUrl = url || href;
              window.open(targetUrl, target);
              return;
            }

            // Handle step navigation
            if (action === 'next-step' && nextStepId) {
              const detail = { stepId: nextStepId, source: `button-${block?.id}` } as any;
              import('@/utils/stepEvents').then(({ dispatchNavigate }) => dispatchNavigate(nextStepId, detail));
              return;
            }

            // Handle quiz start button
            if (text && text.includes('Descobrir meu Estilo')) {
              const userName =
                (await userResponseService.getResponse('intro-name-input')) || 'Anônimo';
              console.log('🚀 Iniciando tracking do quiz para:', userName);

              // Initialize quiz with Supabase
              await initializeQuizWithSupabase(userName);

              // Track quiz start
              trackQuizStart(userName);

              // Save start time and user data (via StorageService com fallback)
              try {
                StorageService.safeSetString('quiz_start_time', Date.now().toString());
                StorageService.safeSetString('quiz_start_tracked', 'true');
                StorageService.safeSetString('userName', userName);
                // Compatibilidade legada
                StorageService.safeSetString('quizUserName', userName);
                // Evento de atualização de nome
                try {
                  window.dispatchEvent(
                    new CustomEvent('quiz-user-name-updated', { detail: { userName, source: 'ButtonInlineBlock' } })
                  );
                } catch { }
              } catch {
                // Fallback silencioso caso StorageService não esteja disponível
                try {
                  localStorage.setItem('quiz_start_time', Date.now().toString());
                  localStorage.setItem('quiz_start_tracked', 'true');
                  localStorage.setItem('userName', userName);
                  localStorage.setItem('quizUserName', userName);
                  try {
                    window.dispatchEvent(
                      new CustomEvent('quiz-user-name-updated', { detail: { userName, source: 'ButtonInlineBlock:fallback' } })
                    );
                  } catch { }
                } catch { }
              }

              // Dispatch quiz start event
              window.dispatchEvent(
                new CustomEvent('quiz-start', {
                  detail: { userName, timestamp: Date.now() },
                })
              );

              // Navegação: se configurado para auto-advance, usa nextStepId do próprio botão
              const targetStep = nextStepId || 'step-2';
              if (finalAutoAdvanceOnComplete) {
                const { schedule } = useOptimizedScheduler();
                return schedule('button-auto-advance', () => {
                  const detail = { stepId: targetStep, source: 'step1-button' } as any;
                  import('@/utils/stepEvents').then(({ dispatchNavigate }) => dispatchNavigate(targetStep, detail));
                }, Number(finalAutoAdvanceDelay) || 0);
              }
            }
          }
        }}
      >
        {/* Efeito de brilho deslizante */}
        {effectType === 'shine' && (
          <div className="absolute inset-0 -top-1 -bottom-1 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        )}

        {/* Ícone à esquerda */}
        {IconComponent && iconPosition === 'left' && (
          <IconComponent
            className={cn(iconSizes[size as keyof typeof iconSizes], 'mr-2 relative z-10')}
          />
        )}

        {/* Texto do botão */}
        <span className="flex-1 text-center truncate relative z-10 font-medium">
          {loading
            ? 'Carregando...'
            : (isButtonDisabled && showDisabledState && disabledText ? disabledText : text) ||
            'Clique aqui'}
        </span>

        {/* Ícone à direita */}
        {IconComponent && iconPosition === 'right' && (
          <IconComponent
            className={cn(iconSizes[size as keyof typeof iconSizes], 'ml-2 relative z-10')}
          />
        )}
      </button>

      {/* Indicador de seleção */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-[#B89B7A]/100 text-white rounded-full p-1">
          <Edit3 className="w-3 h-3" />
        </div>
      )}

      {/* Empty state */}
      {!text && (
        <div style={{ color: '#8B7355' }}>
          <MousePointer2 className="w-4 h-4 mr-2" />
          Clique para selecionar e editar no painel
        </div>
      )}
    </div>
  );
};

export default ButtonInlineBlock;
