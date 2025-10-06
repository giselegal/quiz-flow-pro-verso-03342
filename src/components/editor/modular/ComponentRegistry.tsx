/**
 * 🔧 SISTEMA DE REGISTRO DE COMPONENTES MODULARES
 * 
 * Registry centralizado para todos os componentes modulares
 */

import React from 'react';
import { ComponentType, ModularComponent } from '@/types/modular-editor';

// Importar todos os componentes modulares
import ModularHeader from './components/ModularHeader';
import ModularTitleStable from './components/ModularTitleStable';
import ModularTextStable from './components/ModularTextStable';
import ModularImageSimple from './components/ModularImageSimple';
import ModularOptionsGridSimple from './components/ModularOptionsGridSimple';

// Definir interface do registro
interface ComponentInfo {
    component: React.ComponentType<any>;
    name: string;
    description: string;
    category: 'layout' | 'content' | 'input' | 'media' | 'navigation';
    icon: string;
    defaultProps: any;
}

// Registry de componentes
export const COMPONENT_REGISTRY: Record<ComponentType, ComponentInfo> = {
    // Layout Components
    'header': {
        component: ModularHeader,
        name: 'Cabeçalho',
        description: 'Cabeçalho com logo, progresso e navegação',
        category: 'layout',
        icon: '🎯',
        defaultProps: {
            showLogo: true,
            logoUrl: '',
            logoAlt: 'Logo',
            showProgress: true,
            progressColor: 'brand',
            allowReturn: false,
            returnText: 'Voltar',
            backgroundColor: 'white',
            textColor: 'gray.800',
        },
    },

    'title': {
        component: ModularTitleStable,
        name: 'Título',
        description: 'Título configurável e editável',
        category: 'content',
        icon: '📝',
        defaultProps: {
            text: 'Título da Etapa',
            fontSize: '2xl',
            fontWeight: 'bold',
            textAlign: 'center',
            color: 'gray.800',
            backgroundColor: 'transparent',
            padding: 4,
            margin: 0,
        },
    },

    'text': {
        component: ModularTextStable,
        name: 'Texto',
        description: 'Bloco de texto configurável',
        category: 'content',
        icon: '📄',
        defaultProps: {
            text: 'Digite o texto aqui...',
            fontSize: 'md',
            fontWeight: 'normal',
            textAlign: 'left',
            color: 'gray.700',
            backgroundColor: 'transparent',
            padding: 4,
            margin: 0,
            maxLength: 1000,
            placeholder: 'Digite o texto aqui...',
        },
    },

    'image': {
        component: ModularImageSimple,
        name: 'Imagem',
        description: 'Imagem com upload e configurações',
        category: 'media',
        icon: '🖼️',
        defaultProps: {
            src: '',
            alt: 'Imagem',
            width: 'auto',
            height: 'auto',
            objectFit: 'cover',
            borderRadius: 'md',
            backgroundColor: 'transparent',
            padding: 4,
            margin: 0,
            allowUpload: true,
            maxFileSize: 5 * 1024 * 1024, // 5MB
            acceptedFormats: ['jpeg', 'jpg', 'png', 'gif', 'webp'],
        },
    },

    'options-grid': {
        component: ModularOptionsGridSimple,
        name: 'Grid de Opções',
        description: 'Grid de opções para quiz/formulário',
        category: 'input',
        icon: '⚡',
        defaultProps: {
            options: [],
            columns: 2,
            gap: 4,
            optionStyle: 'button',
            allowMultipleSelection: false,
            backgroundColor: 'transparent',
            padding: 4,
            margin: 0,
        },
    },

    'spacer': {
        component: ({ height = 4, ...props }) => (
            <div style={{ height: `${height * 4}px` }} {...props} />
        ),
        name: 'Espaçador',
        description: 'Espaço em branco configurável',
        category: 'layout',
        icon: '⬜',
        defaultProps: {
            height: 4,
        },
    },

    'divider': {
        component: ({ style, ...props }) => (
            <hr
                style={{
                    border: 'none',
                    height: '1px',
                    backgroundColor: '#e2e8f0',
                    margin: '16px 0',
                    ...style,
                }
                }
                {...props}
            />
        ),
        name: 'Divisor',
        description: 'Linha divisória horizontal',
        category: 'layout',
        icon: '➖',
        defaultProps: {
            color: 'gray.200',
            thickness: 1,
            margin: 4,
        },
    },

    'button': {
        component: ({ text = 'Botão', ...props }) => (
            <button
                style={{
                    padding: '12px 24px',
                    backgroundColor: '#0090ff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '500',
                }}
                {...props}
            >
                {text}
            </button>
        ),
        name: 'Botão',
        description: 'Botão de ação configurável',
        category: 'input',
        icon: '🔲',
        defaultProps: {
            text: 'Continuar',
            variant: 'solid',
            colorScheme: 'brand',
            size: 'md',
            isFullWidth: false,
            isDisabled: false,
        },
    },

    'video': {
        component: ({ src, ...props }) => (
            <video
                controls
                style={{
                    width: '100%',
                    maxWidth: '100%',
                    borderRadius: '8px',
                }}
                {...props}
            >
                <source src={src} />
                Seu navegador não suporta vídeos.
            </video>
        ),
        name: 'Vídeo',
        description: 'Player de vídeo incorporado',
        category: 'media',
        icon: '🎥',
        defaultProps: {
            src: '',
            autoplay: false,
            controls: true,
            loop: false,
            muted: false,
            width: '100%',
            height: 'auto',
        },
    },

    'audio': {
        component: ({ src, ...props }) => (
            <audio
                controls
                style={{
                    width: '100%',
                }}
                {...props}
            >
                <source src={src} />
                Seu navegador não suporta áudio.
            </audio>
        ),
        name: 'Áudio',
        description: 'Player de áudio incorporado',
        category: 'media',
        icon: '🎵',
        defaultProps: {
            src: '',
            autoplay: false,
            controls: true,
            loop: false,
            muted: false,
        },
    },

    'form-input': {
        component: ({ placeholder = 'Digite aqui...', ...props }) => (
            <input
                type="text"
                placeholder={placeholder}
                style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '16px',
                }}
                {...props}
            />
        ),
        name: 'Campo de Texto',
        description: 'Campo de entrada de texto',
        category: 'input',
        icon: '📝',
        defaultProps: {
            placeholder: 'Digite aqui...',
            required: false,
            maxLength: 255,
            type: 'text',
        },
    },

    'countdown': {
        component: ({ seconds = 30, ...props }) => (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#e53e3e',
                }}
                {...props}
            >
                ⏰ {seconds} s
            </div>
        ),
        name: 'Contador',
        description: 'Contador regressivo configurável',
        category: 'content',
        icon: '⏰',
        defaultProps: {
            seconds: 30,
            autoStart: false,
            onComplete: null,
            color: 'red.500',
            fontSize: 'xl',
        },
    },

    'progress-bar': {
        component: ({ progress = 0, ...props }) => (
            <div
                style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#e2e8f0',
                    borderRadius: '4px',
                    overflow: 'hidden',
                }}
                {...props}
            >
                <div
                    style={{
                        width: `${progress}%`,
                        height: '100%',
                        backgroundColor: '#0090ff',
                        transition: 'width 0.3s ease',
                    }}
                />
            </div>
        ),
        name: 'Barra de Progresso',
        description: 'Indicador de progresso visual',
        category: 'content',
        icon: '▶️',
        defaultProps: {
            progress: 0,
            colorScheme: 'brand',
            size: 'md',
            hasStripe: false,
            isAnimated: false,
        },
    },

    'quiz-result': {
        component: ({ score = 0, total = 10, ...props }) => (
            <div
                style={{
                    textAlign: 'center',
                    padding: '24px',
                    backgroundColor: '#f7fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                }}
                {...props}
            >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
                    {score} / {total}
                </div>
                <div style={{ color: '#4a5568' }}>
                    Pontuação Final
                </div>
            </div>
        ),
        name: 'Resultado do Quiz',
        description: 'Exibição de resultado/pontuação',
        category: 'content',
        icon: '🏆',
        defaultProps: {
            score: 0,
            total: 10,
            showPercentage: true,
            successThreshold: 70,
            successMessage: 'Parabéns!',
            failMessage: 'Tente novamente!',
        },
    },
};

// Funções utilitárias
export const getComponent = (type: ComponentType): React.ComponentType<any> | null => {
    return COMPONENT_REGISTRY[type]?.component || null;
};

export const getComponentInfo = (type: ComponentType): ComponentInfo | null => {
    return COMPONENT_REGISTRY[type] || null;
};

export const getAllComponents = (): Array<{ type: ComponentType; info: ComponentInfo }> => {
    return Object.entries(COMPONENT_REGISTRY).map(([type, info]) => ({
        type: type as ComponentType,
        info,
    }));
};

export const getComponentsByCategory = (category: ComponentInfo['category']) => {
    return getAllComponents().filter(({ info }) => info.category === category);
};

export const createDefaultComponent = (type: ComponentType): ModularComponent => {
    const info = getComponentInfo(type);
    if (!info) {
        throw new Error(`Tipo de componente não encontrado: ${type}`);
    }

    return {
        id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        props: { ...info.defaultProps },
        style: {},
    };
};

export default COMPONENT_REGISTRY;