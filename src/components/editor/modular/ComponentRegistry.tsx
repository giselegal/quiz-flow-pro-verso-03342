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
import ModularFormFieldSimple from './components/ModularFormFieldSimple';
import CompositeIntroStep from './components/composite/CompositeIntroStep';
import CompositeQuestionStep from './components/composite/CompositeQuestionStep';
import CompositeStrategicQuestionStep from './components/composite/CompositeStrategicQuestionStep';
import CompositeTransitionStep from './components/composite/CompositeTransitionStep';
import CompositeTransitionResultStep from './components/composite/CompositeTransitionResultStep';
import CompositeResultStep from './components/composite/CompositeResultStep';
import CompositeOfferStep from './components/composite/CompositeOfferStep';

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
        component: ({ style, borderStyle = 'solid', ...props }) => (
            <hr
                style={{
                    border: 'none',
                    height: '1px',
                    backgroundColor: '#e2e8f0',
                    margin: '16px 0',
                    borderStyle,
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
            borderStyle: 'solid',
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

    'form-field': {
        component: ModularFormFieldSimple,
        name: 'Campo de Formulário',
        description: 'Campo versátil com rótulo e opções',
        category: 'input',
        icon: '🧾',
        defaultProps: {
            label: 'Label do campo',
            placeholder: 'Digite aqui...',
            fieldType: 'text',
            required: false,
            helpText: '',
            options: [],
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

    'custom-html': {
        component: ({ html = '<p>Conteúdo HTML personalizado</p>', children: _children, ...props }) => (
            <div
                dangerouslySetInnerHTML={{ __html: html }}
                {...props}
            />
        ),
        name: 'HTML Personalizado',
        description: 'Bloco para inserir HTML personalizado',
        category: 'content',
        icon: '🌐',
        defaultProps: {
            html: '<p>Conteúdo HTML personalizado</p>',
        },
    },

    'result-display': {
        component: ({ title = 'Resultado', description = 'Resumo do resultado', ...props }) => (
            <div
                style={{
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                    textAlign: 'center',
                }}
                {...props}
            >
                <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>{title}</div>
                <div style={{ color: '#4a5568', fontSize: '16px' }}>{description}</div>
            </div>
        ),
        name: 'Resumo de Resultado',
        description: 'Bloco simples para apresentar resultados',
        category: 'content',
        icon: '📊',
        defaultProps: {
            title: 'Resultado',
            description: 'Resumo do resultado obtido.',
        },
    },

    'countdown-timer': {
        component: ({ minutes = 0, seconds = 30, ...props }) => (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    fontWeight: '600',
                    color: '#2b6cb0',
                }}
                {...props}
            >
                🕒 {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </div>
        ),
        name: 'Temporizador',
        description: 'Temporizador simples para etapas ou ações',
        category: 'content',
        icon: '⌛',
        defaultProps: {
            minutes: 0,
            seconds: 30,
            autoStart: false,
        },
    },

    'social-share': {
        component: ({ message = 'Compartilhe com seus amigos!', ...props }) => (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    alignItems: 'center',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#f7fafc',
                }}
                {...props}
            >
                <span style={{ fontWeight: '600', color: '#2d3748' }}>{message}</span>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        style={{
                            padding: '8px 16px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: '#0ea5e9',
                            color: '#fff',
                            cursor: 'pointer',
                        }}
                    >
                        Compartilhar
                    </button>
                    <button
                        style={{
                            padding: '8px 16px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5f5',
                            backgroundColor: '#fff',
                            color: '#2d3748',
                            cursor: 'pointer',
                        }}
                    >
                        Copiar Link
                    </button>
                </div>
            </div>
        ),
        name: 'Compartilhamento Social',
        description: 'Botões simples para incentivar o compartilhamento',
        category: 'navigation',
        icon: '🔗',
        defaultProps: {
            message: 'Compartilhe com seus amigos!',
        },
    },

    'step-intro': {
        component: CompositeIntroStep,
        name: 'Etapa: Introdução',
        description: 'Bloco completo com imagem, chamada e captura de nome.',
        category: 'layout',
        icon: '🚀',
        defaultProps: {
            title: '<span style="color: #B89B7A; font-weight: 700;">Chega</span> de um guarda-roupa lotado e da sensação de que <strong>nada combina com você.</strong>',
            formQuestion: 'Como posso te chamar?',
            placeholder: 'Digite seu primeiro nome aqui...',
            buttonText: 'Quero Descobrir meu Estilo Agora!',
            image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.png',
            description: 'Em poucos minutos, descubra seu <strong>Estilo Predominante</strong> e aprenda a montar looks que refletem sua essência com praticidade e confiança.',
            backgroundColor: '#ffffff',
            textColor: '#1f2937',
            accentColor: '#B89B7A',
            showHeader: true,
            showProgress: false,
            progress: 0,
        },
    },

    'step-question': {
        component: CompositeQuestionStep,
        name: 'Etapa: Pergunta',
        description: 'Layout padrão das perguntas principais do quiz.',
        category: 'content',
        icon: '❓',
        defaultProps: {
            questionNumber: '1 de 10',
            questionText: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
            subtitle: 'Selecione até 3 opções',
            options: [
                { id: 'natural', text: 'Conforto, leveza e praticidade no vestir', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp' },
                { id: 'classico', text: 'Discrição, caimento clássico e sobriedade', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp' },
                { id: 'contemporaneo', text: 'Praticidade com um toque de estilo atual', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp' },
                { id: 'elegante', text: 'Elegância refinada, moderna e sem exageros', image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp' },
            ],
            requiredSelections: 3,
            allowMultipleSelection: true,
            backgroundColor: '#f8fafc',
            textColor: '#0f172a',
            accentColor: '#0ea5e9',
            totalSteps: 21,
            editableHint: true,
        },
    },

    'step-strategic-question': {
        component: CompositeStrategicQuestionStep,
        name: 'Etapa: Pergunta Estratégica',
        description: 'Perguntas complementares para personalização da oferta.',
        category: 'content',
        icon: '🧠',
        defaultProps: {
            questionNumber: 'Pergunta Estratégica',
            questionText: 'Quando você se olha no espelho, como se sente com sua imagem pessoal atualmente?',
            options: [
                { id: 'desconectada', text: 'Me sinto desconectada da mulher que sou hoje' },
                { id: 'duvidas', text: 'Tenho dúvidas sobre o que realmente me valoriza' },
                { id: 'as-vezes-acerto', text: 'Às vezes acerto, às vezes erro' },
                { id: 'segura-evoluir', text: 'Me sinto segura, mas sei que posso evoluir' },
            ],
            backgroundColor: '#0f172a',
            textColor: '#ffffff',
            accentColor: '#38bdf8',
            progressCurrentStep: 15,
            totalSteps: 21,
            editableHint: true,
        },
    },

    'step-transition': {
        component: CompositeTransitionStep,
        name: 'Etapa: Transição',
        description: 'Mensagem intermediária antes das perguntas estratégicas.',
        category: 'layout',
        icon: '🕑',
        defaultProps: {
            title: 'Enquanto calculamos o seu resultado...',
            subtitle: 'Analisando suas respostas',
            text: 'Queremos te fazer algumas perguntas que vão tornar sua experiência ainda mais completa. Responda com sinceridade. Isso é só entre você e a sua nova versão.',
            image: 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cs_fpoukb.png',
            backgroundColor: '#ffffff',
            textColor: '#0f172a',
            accentColor: '#38bdf8',
            showAnimation: true,
            editableHint: true,
        },
    },

    'step-transition-result': {
        component: CompositeTransitionResultStep,
        name: 'Etapa: Transição Resultado',
        description: 'Mensagem de preparação para o resultado final.',
        category: 'layout',
        icon: '⏳',
        defaultProps: {
            title: 'Obrigada por compartilhar.',
            subtitle: 'Estamos combinando suas respostas com nossos modelos exclusivos.',
            description: 'Em poucos segundos você vai descobrir seu estilo predominante e receber recomendações personalizadas.',
            backgroundColor: '',
            textColor: '#0f172a',
            accentColor: '#38bdf8',
            showAnimation: true,
            editableHint: false,
        },
    },

    'step-result': {
        component: CompositeResultStep,
        name: 'Etapa: Resultado',
        description: 'Bloco para exibir o estilo predominante calculado.',
        category: 'content',
        icon: '🏆',
        defaultProps: {
            title: 'Seu estilo predominante é:',
            subtitle: 'Seu resultado foi calculado com base nas suas respostas, {userName}.',
            userName: 'João',
            resultStyle: 'Clássico Elegante',
            description: 'Parabéns! Você descobriu seu estilo único e agora tem um guia completo para usar a moda a seu favor.',
            image: 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_85,w_560,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cs_fpoukb.png',
            characteristics: [
                'Elegante e refinado',
                'Atemporal e sofisticado',
                'Valoriza qualidade',
            ],
            ctaText: 'Descobrir Minha Consultoria Personalizada',
            resultPlaceholder: 'Resultado aparecerá aqui...',
            backgroundColor: '#fff8f0',
            textColor: '#432818',
            accentColor: '#B89B7A',
            accentColorSecondary: '#A1835D',
            showEditableHint: true,
        },
    },

    'step-offer': {
        component: CompositeOfferStep,
        name: 'Etapa: Oferta',
        description: 'Oferta personalizada após o resultado do quiz.',
        category: 'content',
        icon: '🎁',
        defaultProps: {
            title: '{userName}, agora que você descobriu que é {resultStyle}...',
            subtitle: 'Oferta Especial Para Você!',
            description: 'Receba o plano completo pensado para quem tem o estilo {resultStyle} e quer transformar o guarda-roupa com confiança.',
            userName: 'João',
            resultStyle: 'Clássico Elegante',
            buttonText: 'Quero transformar meu estilo agora!',
            image: 'https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_90,w_900,c_limit/v1744735378/offer_image_main_jkldsd.webp',
            testimonial: {
                quote: 'Economizei muito depois que aprendi a combinar e usar as minhas roupas de formas que nunca imaginei.',
                author: 'Ana G., 29 anos, Designer',
            },
            price: '12x de R$ 97,00',
            originalPrice: 'De R$ 1.497,00',
            benefits: [
                'Acesso imediato ao método completo',
                'Plano de ação personalizado',
                'Suporte exclusivo por 30 dias',
            ],
            ctaText: 'Oferta por tempo limitado',
            secureNote: 'Pagamento 100% seguro • Garantia de 7 dias',
            backgroundColor: '#fffaf2',
            textColor: '#5b4135',
            accentColor: '#deac6d',
            showEditableHint: true,
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