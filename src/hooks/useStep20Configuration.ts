import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Step20Configuration {
    pageTitle: string;
    resultMessage: string;
    ctaButtonText: string;
    backgroundType: 'gradient' | 'image' | 'solid';
    backgroundGradientFrom: string;
    backgroundGradientVia: string;
    backgroundGradientTo: string;
    backgroundImage: string;
    backgroundSolid: string;
    showResultIcon: boolean;
    resultIconType: 'trophy' | 'star' | 'check' | 'heart';
    enableSocialSharing: boolean;
    socialShareText: string;
    showNextSteps: boolean;
    nextStepsText: string;
    // URL específica
    isResultPage: boolean;
    routePath: string;
}

interface Step20Store {
    configuration: Step20Configuration;
    updateConfiguration: (config: Partial<Step20Configuration>) => void;
    resetToDefaults: () => void;
    getBackgroundStyle: () => React.CSSProperties;
    getResultIcon: () => string;
}

const DEFAULT_STEP20_CONFIG: Step20Configuration = {
    pageTitle: 'Seu Estilo Pessoal Revelado!',
    resultMessage: 'Parabéns! Com base nas suas respostas, descobrimos seu estilo único e preparamos recomendações especiais para você.',
    ctaButtonText: 'Ver Minha Consultoria Personalizada',
    backgroundType: 'gradient',
    backgroundGradientFrom: '#FAF9F7',
    backgroundGradientVia: '#F5F2E9',
    backgroundGradientTo: '#E8D5C0',
    backgroundImage: '',
    backgroundSolid: '#FAF9F7',
    showResultIcon: true,
    resultIconType: 'trophy',
    enableSocialSharing: true,
    socialShareText: 'Acabei de descobrir meu estilo pessoal! Faça o teste também: ',
    showNextSteps: true,
    nextStepsText: 'Agora você pode acessar sua consultoria personalizada com recomendações exclusivas baseadas no seu estilo!',
    isResultPage: true,
    routePath: '/step20'
};

export const useStep20Configuration = create<Step20Store>()(
    persist(
        (set, get) => ({
            configuration: DEFAULT_STEP20_CONFIG,

            updateConfiguration: (config) =>
                set((state) => ({
                    configuration: { ...state.configuration, ...config }
                })),

            resetToDefaults: () =>
                set({ configuration: DEFAULT_STEP20_CONFIG }),

            getBackgroundStyle: () => {
                const { configuration } = get();

                switch (configuration.backgroundType) {
                    case 'gradient':
                        return {
                            background: `linear-gradient(135deg, ${configuration.backgroundGradientFrom} 0%, ${configuration.backgroundGradientVia} 50%, ${configuration.backgroundGradientTo} 100%)`
                        };
                    case 'image':
                        return {
                            backgroundImage: `url(${configuration.backgroundImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        };
                    case 'solid':
                        return {
                            backgroundColor: configuration.backgroundSolid
                        };
                    default:
                        return {};
                }
            },

            getResultIcon: () => {
                const { configuration } = get();

                switch (configuration.resultIconType) {
                    case 'trophy':
                        return '🏆';
                    case 'star':
                        return '⭐';
                    case 'check':
                        return '✅';
                    case 'heart':
                        return '💖';
                    default:
                        return '🏆';
                }
            }
        }),
        {
            name: 'step20-configuration',
            version: 1,
        }
    )
);

// Hook para integração com NoCode Configuration
export const useStep20NoCodeIntegration = () => {
    const { configuration, updateConfiguration } = useStep20Configuration();

    const applyToStepNavigation = () => {
        // Integração com useStepNavigationStore para aplicar configurações específicas da etapa 20
        const step20NavConfig = {
            requiredSelections: 0,
            maxSelections: 0,
            multipleSelection: false,
            autoAdvanceOnComplete: false,
            autoAdvanceDelay: 0,
            enableButtonOnlyWhenValid: false,
            showValidationFeedback: false,
            showSelectionCount: false,
            showProgressMessage: false,
            validationMessage: '',
            progressMessage: '',
            nextButtonText: configuration.ctaButtonText,
            selectionStyle: 'border' as const,
            selectedColor: '#B89B7A',
            hoverColor: '#F3E8E6',
            backgroundFrom: configuration.backgroundGradientFrom,
            backgroundVia: configuration.backgroundGradientVia,
            backgroundTo: configuration.backgroundGradientTo,
        };

        return step20NavConfig;
    };

    const getPageMetadata = () => ({
        title: configuration.pageTitle,
        description: configuration.resultMessage,
        isResultPage: configuration.isResultPage,
        routePath: configuration.routePath,
        socialShareText: configuration.enableSocialSharing ? configuration.socialShareText : undefined
    });

    return {
        configuration,
        updateConfiguration,
        applyToStepNavigation,
        getPageMetadata
    };
};

export default useStep20Configuration;
