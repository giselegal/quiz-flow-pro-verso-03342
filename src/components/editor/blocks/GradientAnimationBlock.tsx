import { cn } from '@/lib/utils';
import React from 'react';

interface GradientAnimationBlockProps {
  block?: {
    id: string;
    type: string;
    properties?: {
      className?: string;
      // Configurações JSON exportáveis
      gradientConfig?: {
        type: 'linear' | 'radial' | 'conic';
        direction?: string;
        colors: string[];
        animationType: 'none' | 'move' | 'pulse' | 'rainbow' | 'flow' | 'wave';
        duration: string;
        opacity: number;
        blendMode?: string;
        overlay?: boolean;
        overlayOpacity?: number;
        zIndex?: number;
      };
      containerStyles?: {
        minHeight?: string;
        position?: 'relative' | 'absolute' | 'fixed';
        overflow?: 'hidden' | 'visible' | 'auto';
      };
    };
    content?: any;
  };
  children?: React.ReactNode;
  onPropertyChange?: (key: string, value: any) => void;
}

/**
 * 🎯 GRADIENT ANIMATION BLOCK
 * ✅ Gradientes e animações personalizadas
 * ✅ Configuração JSON exportável
 * ✅ Compatível com editor de blocos
 */
const GradientAnimationBlock: React.FC<GradientAnimationBlockProps> = ({
  block,
  children,
  onPropertyChange,
}) => {
  const properties = block?.properties || {};
  const {
    className = '',
    gradientConfig,
    containerStyles,
  } = properties;

  // Configuração padrão
  const config = gradientConfig || {
    type: 'linear' as const,
    direction: 'to-br',
    colors: ['#FAF9F7', '#ffffff', '#B89B7A/10'],
    animationType: 'flow' as const,
    duration: '15s',
    opacity: 1,
    blendMode: 'normal',
    overlay: false,
    overlayOpacity: 0.1,
    zIndex: -1,
  };

  const containerConfig = containerStyles || {
    minHeight: 'min-h-screen',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  };

  // Gerar CSS do gradiente
  const generateGradientCSS = () => {
    const { type, direction, colors } = config;
    
    switch (type) {
      case 'radial':
        return `radial-gradient(circle, ${colors.join(', ')})`;
      case 'conic':
        return `conic-gradient(${colors.join(', ')})`;
      default:
        return `linear-gradient(${direction}, ${colors.join(', ')})`;
    }
  };

  // Gerar classes de animação
  const generateAnimationClass = () => {
    switch (config.animationType) {
      case 'move':
        return 'animate-gradient-move';
      case 'pulse':
        return 'animate-pulse';
      case 'rainbow':
        return 'animate-gradient-rainbow';
      case 'flow':
        return 'animate-gradient-flow';
      case 'wave':
        return 'animate-gradient-wave';
      default:
        return '';
    }
  };

  // Estilos CSS customizados para animações
  const customStyles = `
    .animate-gradient-move {
      background-size: 400% 400%;
      animation: gradientMove ${config.duration} ease infinite;
    }
    
    .animate-gradient-flow {
      background-size: 300% 300%;
      animation: gradientFlow ${config.duration} ease-in-out infinite;
    }
    
    .animate-gradient-wave {
      background-size: 200% 200%;
      animation: gradientWave ${config.duration} ease-in-out infinite alternate;
    }
    
    .animate-gradient-rainbow {
      background-size: 400% 400%;
      animation: gradientRainbow ${config.duration} linear infinite;
    }
    
    @keyframes gradientMove {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    
    @keyframes gradientFlow {
      0%, 100% { background-position: 0% 0%; }
      25% { background-position: 100% 0%; }
      50% { background-position: 100% 100%; }
      75% { background-position: 0% 100%; }
    }
    
    @keyframes gradientWave {
      0% { background-position: 0% 0%; }
      100% { background-position: 100% 100%; }
    }
    
    @keyframes gradientRainbow {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `;

  React.useEffect(() => {
    // Injetar estilos customizados
    const styleId = `gradient-animations-${block?.id || 'default'}`;
    let styleElement = document.getElementById(styleId);
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = customStyles;
    
    return () => {
      // Cleanup ao desmontar
      if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, [block?.id, customStyles]);

  const backgroundStyle = {
    background: generateGradientCSS(),
    opacity: config.opacity,
    mixBlendMode: config.blendMode,
    zIndex: config.zIndex,
  } as React.CSSProperties;

  const overlayStyle = config.overlay ? {
    background: `linear-gradient(${config.direction}, rgba(0,0,0,${config.overlayOpacity}), transparent)`,
  } : {};

  return (
    <div
      className={cn(
        'gradient-animation-block',
        containerConfig.minHeight,
        `${containerConfig.position}`,
        `overflow-${containerConfig.overflow}`,
        className
      )}
    >
      {/* Gradiente de fundo */}
      <div
        className={cn(
          'absolute inset-0',
          generateAnimationClass()
        )}
        style={backgroundStyle}
      />
      
      {/* Overlay opcional */}
      {config.overlay && (
        <div
          className="absolute inset-0"
          style={overlayStyle}
        />
      )}
      
      {/* Conteúdo */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Debug info (apenas em desenvolvimento) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50 text-xs text-gray-500 bg-white/90 p-2 rounded shadow-lg max-w-xs">
          <details>
            <summary className="cursor-pointer">Gradient Config (Debug)</summary>
            <pre className="mt-1 text-xs bg-gray-100 p-2 rounded max-h-32 overflow-auto">
              {JSON.stringify(config, null, 2)}
            </pre>
            <div className="mt-1 text-xs">
              <strong>CSS:</strong> {generateGradientCSS()}
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

export default GradientAnimationBlock;

// ✅ CONFIGURAÇÃO JSON EXPORTÁVEL - PRESETS
export const getGradientAnimationConfig = (preset: 'intro' | 'question' | 'result' | 'custom' = 'intro', customConfig?: Partial<any>) => {
  const presets = {
    intro: {
      type: 'linear' as const,
      direction: 'to-br',
      colors: ['#FAF9F7', 'rgba(255, 255, 255, 0.9)', 'rgba(184, 155, 122, 0.1)'],
      animationType: 'flow' as const,
      duration: '20s',
      opacity: 1,
      overlay: false,
    },
    question: {
      type: 'linear' as const,
      direction: 'to-r',
      colors: ['#ffffff', 'rgba(184, 155, 122, 0.05)', '#ffffff'],
      animationType: 'move' as const,
      duration: '15s',
      opacity: 0.8,
      overlay: false,
    },
    result: {
      type: 'radial' as const,
      direction: 'circle',
      colors: ['rgba(184, 155, 122, 0.2)', 'rgba(67, 40, 24, 0.1)', 'transparent'],
      animationType: 'pulse' as const,
      duration: '8s',
      opacity: 0.9,
      overlay: true,
      overlayOpacity: 0.05,
    },
    custom: customConfig || {},
  };

  return {
    id: `gradient-animation-${preset}-${Date.now()}`,
    type: 'gradient-animation',
    properties: {
      gradientConfig: {
        ...presets[preset],
        zIndex: -1,
        blendMode: 'normal',
      },
      containerStyles: {
        minHeight: 'min-h-screen',
        position: 'relative' as const,
        overflow: 'hidden' as const,
      },
      className: 'w-full',
    },
  };
};
