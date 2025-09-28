/**
 * 🎨 CONFIGURAÇÕES VISUAIS NOCODE - V1 EDITÁVEL
 * 
 * Sistema completo de configurações visuais baseado no template
 */

import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import { StyleType } from './QuizCalculationEngine';

// 🎨 CONFIGURAÇÃO VISUAL DE CADA ESTILO
export interface StyleVisualConfig {
    category: StyleType;
    name: string;
    description: string;
    colors: {
        primary: string;
        secondary: string;
        background: string;
        text: string;
        accent: string;
    };
    images: {
        hero: string;
        guide: string;
        icon: string;
    };
    fonts: {
        primary: string;
        secondary: string;
    };
    ui: {
        borderRadius: string;
        shadows: string;
        animations: boolean;
    };
}

// 📱 CONFIGURAÇÃO RESPONSIVA
export interface ResponsiveConfig {
    mobile: {
        columns: number;
        fontSize: string;
        spacing: string;
    };
    tablet: {
        columns: number;
        fontSize: string;
        spacing: string;
    };
    desktop: {
        columns: number;
        fontSize: string;
        spacing: string;
    };
}

// ⚙️ CONFIGURAÇÕES GLOBAIS NOCODE
export interface NoCodeGlobalConfig {
    branding: {
        logo: string;
        logoAlt: string;
        primaryColor: string;
        secondaryColor: string;
        fontFamily: string;
    };
    quiz: {
        questionsPerStep: number;
        autoAdvance: boolean;
        autoAdvanceDelay: number;
        showProgress: boolean;
        showQuestionNumbers: boolean;
        requiredSelections: number;
    };
    ui: {
        animations: boolean;
        soundEffects: boolean;
        hapticFeedback: boolean;
        darkMode: boolean;
        reduceMotion: boolean;
    };
    responsive: ResponsiveConfig;
    analytics: {
        trackingEnabled: boolean;
        googleAnalyticsId?: string;
        facebookPixelId?: string;
        customEvents: string[];
    };
    performance: {
        lazyLoading: boolean;
        imageOptimization: boolean;
        preloadImages: boolean;
        cacheEnabled: boolean;
    };
}

/**
 * 🔧 EXTRATOR DE CONFIGURAÇÕES DO TEMPLATE
 */
export class NoCodeConfigExtractor {
    private template = QUIZ_STYLE_21_STEPS_TEMPLATE;
    private globalConfig: NoCodeGlobalConfig;

    constructor() {
        this.globalConfig = this.extractGlobalConfig();
    }

    /**
     * 🌍 Extrai configurações globais do template
     */
    private extractGlobalConfig(): NoCodeGlobalConfig {
        // Extrai informações do primeiro bloco com logo
        const logoBlock = this.findBlockByType('quiz-intro-header');

        return {
            branding: {
                logo: logoBlock?.properties?.logoUrl || 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
                logoAlt: logoBlock?.properties?.logoAlt || 'Logo Gisele Galvão',
                primaryColor: '#F59E0B', // Dourado amber-500
                secondaryColor: '#92400E', // Dourado escuro amber-800
                fontFamily: 'Playfair Display, serif',
            },
            quiz: {
                questionsPerStep: 1,
                autoAdvance: this.extractAutoAdvanceConfig(),
                autoAdvanceDelay: this.extractAutoAdvanceDelay(),
                showProgress: this.extractProgressConfig(),
                showQuestionNumbers: true,
                requiredSelections: this.extractRequiredSelections(),
            },
            ui: {
                animations: true,
                soundEffects: false,
                hapticFeedback: false,
                darkMode: false,
                reduceMotion: false,
            },
            responsive: {
                mobile: { columns: 1, fontSize: '14px', spacing: '12px' },
                tablet: { columns: 2, fontSize: '16px', spacing: '16px' },
                desktop: { columns: 2, fontSize: '18px', spacing: '20px' }, // Max 2 colunas
            },
            analytics: {
                trackingEnabled: true,
                customEvents: ['quiz_started', 'quiz_completed', 'step_completed', 'option_selected'],
            },
            performance: {
                lazyLoading: true,
                imageOptimization: true,
                preloadImages: true,
                cacheEnabled: true,
            },
        };
    }

    /**
     * 🎯 Extrai configurações específicas por estilo
     */
    extractStyleConfigs(): StyleVisualConfig[] {
        const styles: StyleType[] = ['natural', 'classico', 'contemporaneo', 'elegante', 'romantico', 'sexy', 'dramatico', 'criativo'];

        return styles.map(style => ({
            category: style,
            name: this.getStyleName(style),
            description: this.getStyleDescription(style),
            colors: this.getStyleColors(style),
            images: this.getStyleImages(style),
            fonts: this.getStyleFonts(style),
            ui: this.getStyleUI(style),
        }));
    }

    /**
     * 🔍 Busca bloco por tipo
     */
    private findBlockByType(type: string): any {
        for (const [, blocks] of Object.entries(this.template)) {
            const block = blocks.find(b => b.type === type);
            if (block) return block;
        }
        return null;
    }

    /**
     * 📊 Extrai todas as opções com imagens
     */
    extractImageOptions(): Record<string, { text: string; imageUrl: string }[]> {
        const imageOptions: Record<string, { text: string; imageUrl: string }[]> = {};

        Object.entries(this.template).forEach(([stepId, blocks]) => {
            blocks.forEach(block => {
                if (block.type === 'options-grid' && block.content.options) {
                    const options = block.content.options
                        .filter((opt: any) => opt.imageUrl)
                        .map((opt: any) => ({
                            id: opt.id,
                            text: opt.text,
                            imageUrl: opt.imageUrl,
                        }));

                    if (options.length > 0) {
                        imageOptions[stepId] = options;
                    }
                }
            });
        });

        return imageOptions;
    }

    /**
     * 📝 Extrai todas as questões
     */
    extractQuestions(): Record<string, { question: string; options: any[] }> {
        const questions: Record<string, { question: string; options: any[] }> = {};

        Object.entries(this.template).forEach(([stepId, blocks]) => {
            blocks.forEach(block => {
                if (block.type === 'options-grid' && block.content.question) {
                    questions[stepId] = {
                        question: block.content.question,
                        options: block.content.options || [],
                    };
                }
            });
        });

        return questions;
    }

    // 🎨 Métodos auxiliares para configurações por estilo
    private getStyleName(style: StyleType): string {
        const names = {
            natural: 'Natural',
            classico: 'Clássico',
            contemporaneo: 'Contemporâneo',
            elegante: 'Elegante',
            romantico: 'Romântico',
            sexy: 'Sexy',
            dramatico: 'Dramático',
            criativo: 'Criativo',
        };
        return names[style];
    }

    private getStyleDescription(style: StyleType): string {
        const descriptions = {
            natural: 'Estilo despojado e natural, priorizando conforto e simplicidade.',
            classico: 'Elegância atemporal com peças tradicionais e refinadas.',
            contemporaneo: 'Moderno e atual, combinando tendências com praticidade.',
            elegante: 'Sofisticação e refinamento em cada detalhe.',
            romantico: 'Feminilidade e delicadeza em tons suaves.',
            sexy: 'Sensualidade elegante que valoriza as curvas.',
            dramatico: 'Personalidade marcante com peças statement.',
            criativo: 'Originalidade e ousadia em combinações únicas.',
        };
        return descriptions[style];
    }

    private getStyleColors(style: StyleType) {
        const colorPalettes = {
            natural: {
                primary: '#8FBC8F',
                secondary: '#F5F5DC',
                background: '#FAFAFA',
                text: '#2F4F2F',
                accent: '#228B22'
            },
            classico: {
                primary: '#2F4F4F',
                secondary: '#F8F8FF',
                background: '#FFFFFF',
                text: '#1C1C1C',
                accent: '#4682B4'
            },
            contemporaneo: {
                primary: '#4A90E2',
                secondary: '#F0F4F8',
                background: '#FFFFFF',
                text: '#2C3E50',
                accent: '#3498DB'
            },
            elegante: {
                primary: '#2C2C2C',
                secondary: '#F7F7F7',
                background: '#FFFFFF',
                text: '#1A1A1A',
                accent: '#8B4513'
            },
            romantico: {
                primary: '#DDA0DD',
                secondary: '#FFF0F5',
                background: '#FFFAFD',
                text: '#4B0082',
                accent: '#FF69B4'
            },
            sexy: {
                primary: '#DC143C',
                secondary: '#FFE4E1',
                background: '#FFFAFA',
                text: '#8B0000',
                accent: '#B22222'
            },
            dramatico: {
                primary: '#000000',
                secondary: '#F5F5F5',
                background: '#FFFFFF',
                text: '#1C1C1C',
                accent: '#FF4500'
            },
            criativo: {
                primary: '#FF6347',
                secondary: '#F0FFFF',
                background: '#FFFAFA',
                text: '#2F4F4F',
                accent: '#32CD32'
            }
        };
        return colorPalettes[style];
    }

    private getStyleImages(style: StyleType) {
        return {
            hero: `https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/${style}_hero.webp`,
            guide: `https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/${style}_guide.webp`,
            icon: `https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/${style}_icon.webp`,
        };
    }

    private getStyleFonts(style: StyleType) {
        const fontPairings = {
            natural: { primary: 'Inter, sans-serif', secondary: 'Georgia, serif' },
            classico: { primary: 'Playfair Display, serif', secondary: 'Source Sans Pro, sans-serif' },
            contemporaneo: { primary: 'Montserrat, sans-serif', secondary: 'Open Sans, sans-serif' },
            elegante: { primary: 'Cormorant Garamond, serif', secondary: 'Lato, sans-serif' },
            romantico: { primary: 'Dancing Script, cursive', secondary: 'Nunito, sans-serif' },
            sexy: { primary: 'Oswald, sans-serif', secondary: 'Roboto, sans-serif' },
            dramatico: { primary: 'Anton, sans-serif', secondary: 'Work Sans, sans-serif' },
            criativo: { primary: 'Pacifico, cursive', secondary: 'Quicksand, sans-serif' }
        };
        return fontPairings[style];
    }

    private getStyleUI(style: StyleType) {
        return {
            borderRadius: style === 'classico' ? '4px' : style === 'criativo' ? '16px' : '8px',
            shadows: style === 'elegante' ? 'lg' : style === 'natural' ? 'none' : 'md',
            animations: style === 'criativo' || style === 'dramatico'
        };
    }

    // 🔧 Métodos auxiliares para configurações globais
    private extractAutoAdvanceConfig(): boolean {
        const gridBlock = this.findBlockByType('options-grid');
        return gridBlock?.properties?.autoAdvanceOnComplete || false;
    }

    private extractAutoAdvanceDelay(): number {
        const gridBlock = this.findBlockByType('options-grid');
        return gridBlock?.properties?.autoAdvanceDelay || 1500;
    }

    private extractProgressConfig(): boolean {
        const headerBlock = this.findBlockByType('quiz-intro-header');
        return headerBlock?.properties?.enableProgressBar || true;
    }

    private extractRequiredSelections(): number {
        const gridBlock = this.findBlockByType('options-grid');
        return gridBlock?.properties?.requiredSelections || 3;
    }

    /**
     * � Determina o número de colunas baseado no tipo de questão
     */
    getColumnsForQuestion(hasImages: boolean): number {
        // REGRA: Opções com imagem = 2 colunas, só texto = 1 coluna
        return hasImages ? 2 : 1;
    }

    /**
     * 🎨 Gera classe CSS responsiva para colunas
     */
    getResponsiveColumnClass(hasImages: boolean): string {
        if (hasImages) {
            // Com imagens: 1 col mobile, 2 col desktop
            return 'grid-cols-1 md:grid-cols-2';
        } else {
            // Só texto: sempre 1 coluna
            return 'grid-cols-1';
        }
    }

    /**
     * 📱 Verifica se deve usar layout responsivo
     */
    shouldUseResponsiveColumns(hasImages: boolean): boolean {
        // Só usa responsivo quando tem imagens
        return hasImages;
    }

    /**
     * �🚀 Obtém configuração global
     */
    getGlobalConfig(): NoCodeGlobalConfig {
        return this.globalConfig;
    }

    /**
     * 💾 Serializa configurações para armazenamento
     */
    serialize(): string {
        return JSON.stringify({
            globalConfig: this.globalConfig,
            styleConfigs: this.extractStyleConfigs(),
            imageOptions: this.extractImageOptions(),
            questions: this.extractQuestions(),
            timestamp: Date.now(),
        });
    }
}

// 🏭 Instância singleton
export const noCodeConfig = new NoCodeConfigExtractor();