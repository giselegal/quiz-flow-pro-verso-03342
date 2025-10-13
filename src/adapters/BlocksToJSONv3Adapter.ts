/**
 * 🔄 ADAPTADOR BIDIRECIONAL: Blocks ↔ JSON v3.0
 * 
 * Converte entre formato do Editor (Blocks) e formato JSON v3.0 (Sections)
 * Permite exportar funil editado de volta para JSON v3.0
 */

import { Block } from '@/types/editor';
import { QuizStep } from '@/data/quizSteps';

// ============================================================================
// TIPOS JSON v3.0
// ============================================================================

export interface JSONv3Section {
    type: string;
    id: string;
    content: Record<string, any>;
    style?: Record<string, any>;
    animation?: Record<string, any>;
}

export interface JSONv3Template {
    templateVersion: string;
    metadata: {
        id: string;
        name: string;
        description?: string;
        category: string;
        tags?: string[];
        createdAt?: string;
        updatedAt?: string;
        author?: string;
    };
    theme?: {
        colors?: Record<string, string>;
        fonts?: Record<string, string>;
        spacing?: Record<string, number>;
        borderRadius?: Record<string, number>;
    };
    sections: JSONv3Section[];
    validation?: Record<string, any>;
    navigation: {
        nextStep: string | null;
        prevStep?: string | null;
        allowBack?: boolean;
        requiresUserInput?: boolean;
    };
    analytics?: {
        events?: string[];
        trackingId?: string;
    };
}

// ============================================================================
// MAPEAMENTOS DE TIPOS
// ============================================================================

const BLOCK_TO_SECTION_TYPE_MAP: Record<string, string> = {
    'quiz-intro-header': 'intro-hero',
    'form-input': 'welcome-form',
    'quiz-header': 'question-hero',
    'options-grid': 'options-grid',
    'text-inline': 'text-block',
    'image-display-inline': 'image-display',
    'button-inline': 'button-primary',
    'progress-bar': 'progress-indicator',
    'result-display': 'result-hero',
    'offer-card': 'offer-section',
};

const SECTION_TO_BLOCK_TYPE_MAP: Record<string, string> = {
    'intro-hero': 'quiz-intro-header',
    'welcome-form': 'form-input',
    'question-hero': 'quiz-header',
    'options-grid': 'options-grid',
    'text-block': 'text-inline',
    'image-display': 'image-display-inline',
    'button-primary': 'button-inline',
    'progress-indicator': 'progress-bar',
    'result-hero': 'result-display',
    'offer-section': 'offer-card',
};

// ============================================================================
// ADAPTADOR PRINCIPAL
// ============================================================================

export class BlocksToJSONv3Adapter {
    /**
     * 🔄 Blocks → JSON v3.0
     */
    static blocksToJSONv3(blocks: Block[], stepId: string, metadata?: Partial<JSONv3Template['metadata']>): JSONv3Template {
        const sections = blocks
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map(block => this.blockToSection(block));

        const category = this.detectCategory(blocks);
        const nextStep = this.inferNextStep(stepId);

        return {
            templateVersion: '3.0',
            metadata: {
                id: stepId,
                name: metadata?.name || `Step ${stepId}`,
                description: metadata?.description || `Generated from editor`,
                category,
                tags: metadata?.tags || [category],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                author: metadata?.author || 'Quiz Flow Pro Editor',
                ...metadata,
            },
            theme: this.extractTheme(blocks),
            sections,
            navigation: {
                nextStep,
                prevStep: this.inferPrevStep(stepId),
                allowBack: true,
                requiresUserInput: this.requiresUserInput(blocks),
            },
            validation: this.extractValidation(blocks),
            analytics: {
                events: ['page_view', 'section_view', 'user_interaction'],
                trackingId: stepId,
            },
        };
    }

    /**
     * 🔄 JSON v3.0 → Blocks
     */
    static jsonv3ToBlocks(json: JSONv3Template): Block[] {
        return json.sections.map((section, index) => this.sectionToBlock(section, index));
    }

    /**
     * 📦 Block → Section
     */
    private static blockToSection(block: Block): JSONv3Section {
        const sectionType = BLOCK_TO_SECTION_TYPE_MAP[block.type as string] || 'custom-section';

        // Separar content e style
        const { backgroundColor, padding, margin, color, fontSize, ...content } = block.content || {};

        const style: Record<string, any> = {};
        if (backgroundColor) style.backgroundColor = backgroundColor;
        if (padding) style.padding = padding;
        if (margin) style.margin = margin;
        if (color) style.color = color;
        if (fontSize) style.fontSize = fontSize;

        return {
            type: sectionType,
            id: block.id,
            content,
            style: Object.keys(style).length > 0 ? style : undefined,
            animation: block.properties || undefined,
        };
    }

    /**
     * 📦 Section → Block
     */
    private static sectionToBlock(section: JSONv3Section, index: number): Block {
        const blockType = SECTION_TO_BLOCK_TYPE_MAP[section.type] || 'text-inline';

        return {
            id: section.id,
            type: blockType as any,
            content: {
                ...section.content,
                ...section.style, // Merge style into content
            },
            properties: section.animation || {},
            order: index,
        };
    }

    /**
     * 🎨 Extrair tema dos blocos
     */
    private static extractTheme(blocks: Block[]): JSONv3Template['theme'] {
        const colors: Record<string, string> = {};
        const fonts: Record<string, string> = {};

        blocks.forEach(block => {
            if (block.content?.backgroundColor) {
                colors.background = block.content.backgroundColor;
            }
            if (block.content?.primaryColor) {
                colors.primary = block.content.primaryColor;
            }
            if (block.content?.fontFamily) {
                fonts.body = block.content.fontFamily;
            }
        });

        return Object.keys(colors).length > 0 || Object.keys(fonts).length > 0
            ? { colors, fonts }
            : undefined;
    }

    /**
     * ✅ Extrair validação dos blocos
     */
    private static extractValidation(blocks: Block[]): Record<string, any> | undefined {
        const formBlock = blocks.find(b => b.type === 'form-input');
        if (!formBlock) return undefined;

        return {
            required: ['userName'],
            rules: {
                userName: {
                    minLength: 2,
                    maxLength: 50,
                    pattern: '^[a-zA-ZÀ-ÿ\\s]+$',
                    errorMessage: 'Por favor, digite um nome válido',
                },
            },
        };
    }

    /**
     * 🔍 Detectar categoria baseado nos blocos
     */
    private static detectCategory(blocks: Block[]): string {
        const types = blocks.map(b => b.type);

        if (types.includes('form-input')) return 'intro';
        if (types.includes('options-grid')) return 'question';
        if (types.includes('result-display')) return 'result';
        if (types.includes('offer-card')) return 'offer';

        return 'custom';
    }

    /**
     * ➡️ Inferir próximo step
     */
    private static inferNextStep(stepId: string): string | null {
        const match = stepId.match(/step-(\d+)/);
        if (!match) return null;

        const stepNumber = parseInt(match[1]);
        if (stepNumber >= 21) return null; // Última etapa

        return `step-${String(stepNumber + 1).padStart(2, '0')}`;
    }

    /**
     * ⬅️ Inferir step anterior
     */
    private static inferPrevStep(stepId: string): string | null {
        const match = stepId.match(/step-(\d+)/);
        if (!match) return null;

        const stepNumber = parseInt(match[1]);
        if (stepNumber <= 1) return null; // Primeira etapa

        return `step-${String(stepNumber - 1).padStart(2, '0')}`;
    }

    /**
     * 🔍 Verificar se requer input do usuário
     */
    private static requiresUserInput(blocks: Block[]): boolean {
        return blocks.some(b => {
            const type = b.type as string;
            return type === 'form-input' ||
                type === 'options-grid' ||
                type.includes('quiz-options') ||
                type.includes('form');
        });
    }    /**
     * 🔄 Conversão completa: QuizStep → JSON v3.0
     */
    static quizStepToJSONv3(step: QuizStep, stepId: string): JSONv3Template {
        // Usar conversão existente QuizStep → Blocks
        const { convertStepToBlocks } = require('@/utils/quizConversionUtils');
        const blocks = convertStepToBlocks(step);

        // Converter Blocks → JSON v3.0
        return this.blocksToJSONv3(blocks, stepId, {
            name: step.title || stepId,
            category: step.type || 'custom',
        });
    }

    /**
     * 🔄 Conversão completa: JSON v3.0 → QuizStep
     */
    static jsonv3ToQuizStep(json: JSONv3Template): QuizStep {
        // Usar adaptador existente
        const { QuizStepAdapter } = require('@/adapters/QuizStepAdapter');
        return QuizStepAdapter.fromJSON(json);
    }

    /**
     * ✅ Validar round-trip (ida e volta preserva dados)
     */
    static validateRoundTrip(original: JSONv3Template): { valid: boolean; errors: string[] } {
        try {
            const blocks = this.jsonv3ToBlocks(original);
            const reconstructed = this.blocksToJSONv3(blocks, original.metadata.id);

            const errors: string[] = [];

            // Validar preservação de sections
            if (original.sections.length !== reconstructed.sections.length) {
                errors.push(`Section count mismatch: ${original.sections.length} vs ${reconstructed.sections.length}`);
            }

            // Validar navigation
            if (original.navigation.nextStep !== reconstructed.navigation.nextStep) {
                errors.push(`nextStep mismatch: ${original.navigation.nextStep} vs ${reconstructed.navigation.nextStep}`);
            }

            return {
                valid: errors.length === 0,
                errors,
            };
        } catch (error) {
            return {
                valid: false,
                errors: [error instanceof Error ? error.message : 'Unknown error'],
            };
        }
    }
}

export default BlocksToJSONv3Adapter;
