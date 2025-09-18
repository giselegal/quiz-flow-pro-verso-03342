/**
 * 🧪 UTILITIES PARA TESTES DAS PROPRIEDADES
 * Utilitários específicos para testes do painel de propriedades
 */

import { vi } from 'vitest';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { EditorProvider } from '@/components/editor/EditorProvider';
import { Block, BlockType } from '@/types/editor';

// Mock do contexto de editor para testes
export const createMockEditorContext = () => ({
    state: {
        stepBlocks: {
            'step-1': [],
            'step-2': [],
            'step-3': [],
            'step-4': [],
            'step-5': [],
            'step-6': [],
            'step-7': [],
            'step-8': [],
            'step-9': [],
            'step-10': [],
            'step-11': [],
            'step-12': [],
            'step-13': [],
            'step-14': [],
            'step-15': [],
            'step-16': [],
            'step-17': [],
            'step-18': [],
            'step-19': [],
            'step-20': [],
            'step-21': []
        },
        currentStep: 1,
        selectedBlockId: null,
        stepValidation: {},
        isSupabaseEnabled: false,
        databaseMode: 'local' as const,
        isLoading: false,
    },
    actions: {
        updateBlock: vi.fn().mockImplementation((_stepId, blockId, properties) => {
            return Promise.resolve({ success: true, blockId, properties });
        }),
        setSelectedBlockId: vi.fn(),
        addBlock: vi.fn(),
        removeBlock: vi.fn(),
        reorderBlocks: vi.fn(),
        setCurrentStep: vi.fn(),
        setStepValid: vi.fn(),
        loadDefaultTemplate: vi.fn(),
        ensureStepLoaded: vi.fn(),
        undo: vi.fn(),
        redo: vi.fn(),
        canUndo: false,
        canRedo: false,
        exportJSON: vi.fn(),
        importJSON: vi.fn(),
        loadSupabaseComponents: vi.fn(),
    }
});

// Provider personalizado para testes
interface ProvidersProps {
    children: ReactNode;
    initialState?: any;
}

const AllProviders = ({ children, initialState }: ProvidersProps) => {
    const mockContext = createMockEditorContext();
    const context = initialState ? { ...mockContext, ...initialState } : mockContext;

    return (
        <EditorProvider initial={context.state}>
            {children}
        </EditorProvider>
    );
};

// Função customizada de render
export const renderWithProviders = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'> & {
        initialState?: any;
    }
) => {
    const { initialState, ...renderOptions } = options || {};

    return render(ui, {
        wrapper: ({ children }) => (
            <AllProviders initialState={initialState}>
                {children}
            </AllProviders>
        ),
        ...renderOptions,
    });
};

// Factory para criar blocos de teste
export const createTestBlock = (type: BlockType, properties: Record<string, any> = {}): Block => {
    const defaultProperties = getDefaultPropertiesForBlockType(type);

    return {
        id: `test-${type}-${Date.now()}`,
        type,
        order: 0,
        content: {},
        properties: {
            ...defaultProperties,
            ...properties
        }
    };
};

// Propriedades padrão por tipo de bloco
function getDefaultPropertiesForBlockType(type: BlockType): Record<string, any> {
    const defaults: Partial<Record<BlockType, Record<string, any>>> = {
        // ETAPA 1 - Introdução
        'quiz-intro-header': {
            title: 'Descubra Seu Estilo',
            subtitle: 'Quiz personalizado',
            backgroundColor: '#f8f9fa',
            textColor: '#333333'
        },
        'text-inline': {
            text: 'Texto de exemplo',
            fontSize: '16px',
            fontWeight: 'normal',
            textAlign: 'left',
            color: '#333333'
        },
        'form-input': {
            label: 'Nome',
            placeholder: 'Digite seu nome',
            required: true,
            type: 'text'
        },
        'button-inline': {
            text: 'Continuar',
            variant: 'primary',
            size: 'md',
            fullWidth: false
        },

        // ETAPAS 2-11 - Questões pontuadas
        'quiz-question-inline': {
            question: 'Qual sua pergunta?',
            multipleSelection: true,
            maxSelections: 3,
            minSelections: 1,
            options: []
        },
        'options-grid': {
            options: [],
            columns: 2,
            gap: '16px',
            selectionStyle: 'checkbox'
        },

        // ETAPA 12 - Transição
        'quiz-navigation': {
            showProgress: true,
            progressText: 'Etapa {current} de {total}',
            nextButtonText: 'Próximo',
            prevButtonText: 'Anterior'
        },

        // ETAPAS 13-18 - Questões estratégicas
        'heading-inline': {
            text: 'Título',
            level: 2,
            fontSize: '24px',
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#333333'
        },

        // ETAPA 19 - Transição para resultado
        'progress-inline': {
            value: 95,
            max: 100,
            showPercentage: true,
            color: 'primary',
            animated: true
        },

        // ETAPA 20 - Resultado personalizado
        'step20-result-header': {
            celebrationText: 'Parabéns!',
            resultTitle: 'Seu Estilo é...',
            showConfetti: true,
            backgroundColor: '#f8f9fa'
        },
        'step20-style-reveal': {
            styleName: 'Clássico Elegante',
            styleDescription: 'Descrição do estilo',
            showAnimation: true,
            cardStyle: 'elegant'
        },
        'step20-user-greeting': {
            greetingText: 'Olá, {userName}!',
            personalizedMessage: true,
            showAvatar: false
        },
        'step20-compatibility': {
            percentage: 85,
            showAnimatedCounter: true,
            color: '#22c55e',
            description: 'compatibilidade com seu estilo'
        },
        'step20-secondary-styles': {
            showSecondaryStyles: true,
            maxSecondaryStyles: 3,
            cardLayout: 'grid'
        },
        'step20-personalized-offer': {
            offerTitle: 'Oferta Personalizada',
            ctaText: 'Quero Descobrir Mais',
            showDiscount: true,
            discountPercentage: 20
        },

        // ETAPA 21 - Oferta
        'urgency-timer-inline': {
            deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            showDays: true,
            showHours: true,
            showMinutes: true,
            showSeconds: false,
            urgencyText: 'Oferta expira em:'
        },
        'before-after-inline': {
            beforeTitle: 'Antes',
            afterTitle: 'Depois',
            beforeImage: '',
            afterImage: '',
            showLabels: true
        },
        'bonus': {
            title: 'Bônus Exclusivo',
            description: 'Descrição do bônus',
            value: '50',
            showValue: true
        },
        'secure-purchase': {
            securityText: 'Compra 100% Segura',
            showBadges: true,
            showGuarantee: true,
            guaranteeDays: 30
        },
        'value-anchoring': {
            originalPrice: '197',
            currentPrice: '97',
            showSavings: true,
            currency: 'R$'
        },
        'mentor-section-inline': {
            mentorName: 'Gisele Galvão',
            mentorTitle: 'Consultora de Imagem e Estilo, Personal Branding',
            mentorImage: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745347467/GISELE-GALV%C3%83O-POSE-ACESSIBILIDADE_i23qvj.webp',
            testimonial: 'Advogada de formação, mãe e esposa. Apaixonada por ajudar mulheres a descobrirem seu estilo autêntico e transformarem sua relação com a imagem pessoal.'
        },

        // Blocos gerais
        'image-inline': {
            src: '',
            alt: 'Imagem',
            width: 'auto',
            height: 'auto'
        },
        'spacer-inline': {
            height: '32px'
        },
        'legal-notice-inline': {
            text: 'Aviso legal',
            fontSize: '12px',
            textAlign: 'center',
            color: '#666666'
        }
    };

    return defaults[type] || {};
}

// Helpers para simulação de eventos
export const TestHelpers = {

    // Simular debounce
    async waitForDebounce(delay: number = 300) {
        vi.advanceTimersByTime(delay);
        await new Promise(resolve => setTimeout(resolve, 0));
    },

    // Simular animação
    async waitForAnimation(duration: number = 500) {
        vi.advanceTimersByTime(duration);
        await new Promise(resolve => setTimeout(resolve, 0));
    },

    // Criar arquivo mock
    createMockFile: (name: string = 'test.jpg', type: string = 'image/jpeg') => {
        return new File(['test content'], name, { type });
    },

    // Simular mudança de viewport
    setViewport: (width: number, height: number) => {
        Object.defineProperty(window, 'innerWidth', { value: width, configurable: true });
        Object.defineProperty(window, 'innerHeight', { value: height, configurable: true });
        window.dispatchEvent(new Event('resize'));
    },

    // Mock de localStorage
    mockLocalStorage: () => {
        const store: Record<string, string> = {};
        return {
            getItem: vi.fn((key) => store[key] || null),
            setItem: vi.fn((key, value) => { store[key] = value; }),
            removeItem: vi.fn((key) => { delete store[key]; }),
            clear: vi.fn(() => { Object.keys(store).forEach(key => delete store[key]); })
        };
    }
};

// Dados de teste organizados por etapa
export const TestData = {
    // Blocos das 21 etapas organizados
    stepBlocks: {
        etapa1: ['quiz-intro-header', 'text-inline', 'form-input', 'button-inline'],
        etapas2a11: ['quiz-question-inline', 'options-grid'],
        etapa12: ['quiz-navigation'],
        etapas13a18: ['heading-inline', 'quiz-question-inline', 'options-grid'],
        etapa19: ['progress-inline'],
        etapa20: [
            'step20-result-header',
            'step20-style-reveal',
            'step20-user-greeting',
            'step20-compatibility',
            'step20-secondary-styles',
            'step20-personalized-offer'
        ],
        etapa21: [
            'urgency-timer-inline',
            'before-after-inline',
            'bonus',
            'secure-purchase',
            'value-anchoring',
            'mentor-section-inline'
        ]
    },

    // Exemplos de propriedades válidas
    validProperties: {
        'quiz-intro-header': {
            title: 'Quiz de Estilo',
            subtitle: 'Descubra seu estilo único',
            backgroundColor: '#ffffff',
            textColor: '#000000'
        },
        'step20-compatibility': {
            percentage: 85,
            showAnimatedCounter: true,
            color: '#22c55e',
            description: 'compatibilidade'
        }
    },

    // Exemplos de propriedades inválidas
    invalidProperties: {
        'quiz-intro-header': {
            title: '', // vazio
            backgroundColor: 'not-a-color', // cor inválida
            textColor: null // tipo errado
        },
        'step20-compatibility': {
            percentage: 150, // fora do range
            color: 'invalid'
        }
    },

    // Dados de usuário mock
    mockUser: {
        userName: 'Maria Silva',
        userAvatar: '/avatars/test-user.jpg',
        quizProgress: {
            currentStep: 5,
            answers: ['resposta1', 'resposta2'],
            scores: {
                classic: 10,
                modern: 15,
                romantic: 8
            }
        }
    }
};

// Export da função render customizada como padrão
export { renderWithProviders as render };