/**
 * 🔄 FUNNEL ADAPTERS
 * 
 * Adaptadores para converter funis existentes para o formato universal
 * e vice-versa, garantindo compatibilidade total
 */

import { UniversalFunnel, UniversalStep, UniversalBlock } from './UniversalFunnelEditor';

// ===============================
// 🎯 QUIZ 21 STEPS ADAPTER
// ===============================

interface Quiz21Step {
    id: number;
    titulo: string;
    pergunta: string;
    opcoes: Array<{
        texto: string;
        valor: string;
        proximoStep?: number;
    }>;
    tipo?: string;
    configuracoes?: any;
}

interface Quiz21Data {
    id: string;
    nome: string;
    steps: Quiz21Step[];
    configuracoes?: any;
    tema?: any;
}

export class Quiz21StepsAdapter {
    /**
     * Converte Quiz21 para formato universal
     */
    static toUniversal(quiz21Data: Quiz21Data): UniversalFunnel {
        const universalSteps: UniversalStep[] = quiz21Data.steps.map((step) => {
            const blocks: UniversalBlock[] = [];

            // Adicionar título como bloco
            if (step.titulo) {
                blocks.push({
                    id: `title-${step.id}`,
                    type: 'heading',
                    content: { text: step.titulo }
                });
            }

            // Adicionar pergunta como bloco
            if (step.pergunta) {
                blocks.push({
                    id: `question-${step.id}`,
                    type: 'question',
                    content: {
                        question: step.pergunta,
                        options: step.opcoes.map((opcao, index) => ({
                            text: opcao.texto,
                            value: opcao.valor,
                            nextStep: opcao.proximoStep
                        }))
                    }
                });
            }

            return {
                id: step.id.toString(),
                name: step.titulo || `Step ${step.id}`,
                blocks,
                metadata: {
                    type: step.tipo,
                    originalConfig: step.configuracoes
                }
            };
        });

        return {
            id: quiz21Data.id,
            name: quiz21Data.nome || 'Quiz 21 Steps',
            type: 'quiz',
            steps: universalSteps,
            config: {
                theme: quiz21Data.tema,
                originalConfig: quiz21Data.configuracoes
            },
            metadata: {
                originalType: 'quiz21Steps',
                created: new Date().toISOString(),
                version: '1.0'
            }
        };
    }

    /**
     * Converte formato universal de volta para Quiz21
     */
    static fromUniversal(universalFunnel: UniversalFunnel): Quiz21Data {
        const quiz21Steps: Quiz21Step[] = universalFunnel.steps.map((step) => {
            const titleBlock = step.blocks.find(b => b.type === 'heading');
            const questionBlock = step.blocks.find(b => b.type === 'question');

            return {
                id: parseInt(step.id) || 0,
                titulo: titleBlock?.content?.text || step.name,
                pergunta: questionBlock?.content?.question || '',
                opcoes: questionBlock?.content?.options || [],
                tipo: step.metadata?.type,
                configuracoes: step.metadata?.originalConfig
            };
        });

        return {
            id: universalFunnel.id,
            nome: universalFunnel.name,
            steps: quiz21Steps,
            configuracoes: universalFunnel.config?.originalConfig,
            tema: universalFunnel.config?.theme
        };
    }
}

// ===============================
// 🎯 LEAD MAGNET ADAPTER
// ===============================

interface LeadMagnetStep {
    id: string;
    type: 'landing' | 'form' | 'thank-you' | 'download';
    content: {
        headline?: string;
        description?: string;
        cta?: string;
        fields?: Array<{
            name: string;
            type: string;
            required: boolean;
            placeholder: string;
        }>;
        downloadUrl?: string;
        redirectUrl?: string;
    };
    design?: any;
}

interface LeadMagnetData {
    id: string;
    name: string;
    description: string;
    steps: LeadMagnetStep[];
    settings: any;
}

export class LeadMagnetAdapter {
    static toUniversal(leadMagnetData: LeadMagnetData): UniversalFunnel {
        const universalSteps: UniversalStep[] = leadMagnetData.steps.map((step) => {
            const blocks: UniversalBlock[] = [];

            // Headline
            if (step.content.headline) {
                blocks.push({
                    id: `headline-${step.id}`,
                    type: 'heading',
                    content: { text: step.content.headline }
                });
            }

            // Description
            if (step.content.description) {
                blocks.push({
                    id: `desc-${step.id}`,
                    type: 'text',
                    content: { text: step.content.description }
                });
            }

            // Form fields (for form steps)
            if (step.type === 'form' && step.content.fields) {
                step.content.fields.forEach((field, index) => {
                    blocks.push({
                        id: `field-${step.id}-${index}`,
                        type: 'form-field',
                        content: {
                            fieldType: field.type,
                            name: field.name,
                            placeholder: field.placeholder,
                            required: field.required
                        }
                    });
                });
            }

            // CTA Button
            if (step.content.cta) {
                blocks.push({
                    id: `cta-${step.id}`,
                    type: 'button',
                    content: { text: step.content.cta }
                });
            }

            return {
                id: step.id,
                name: getStepName(step.type),
                blocks,
                metadata: {
                    type: step.type,
                    originalContent: step.content,
                    design: step.design
                }
            };
        });

        return {
            id: leadMagnetData.id,
            name: leadMagnetData.name,
            type: 'lead-magnet',
            steps: universalSteps,
            config: {
                description: leadMagnetData.description,
                settings: leadMagnetData.settings
            },
            metadata: {
                originalType: 'leadMagnet',
                created: new Date().toISOString(),
                version: '1.0'
            }
        };
    }

    static fromUniversal(universalFunnel: UniversalFunnel): LeadMagnetData {
        const leadMagnetSteps: LeadMagnetStep[] = universalFunnel.steps.map((step) => {
            const headlineBlock = step.blocks.find(b => b.type === 'heading');
            const textBlock = step.blocks.find(b => b.type === 'text');
            const buttonBlock = step.blocks.find(b => b.type === 'button');
            const formFields = step.blocks.filter(b => b.type === 'form-field');

            return {
                id: step.id.toString(),
                type: (step.metadata?.type as any) || 'landing',
                content: {
                    headline: headlineBlock?.content?.text,
                    description: textBlock?.content?.text,
                    cta: buttonBlock?.content?.text,
                    fields: formFields.map(field => ({
                        name: field.content?.name || '',
                        type: field.content?.fieldType || 'text',
                        required: field.content?.required || false,
                        placeholder: field.content?.placeholder || ''
                    })),
                    ...step.metadata?.originalContent
                },
                design: step.metadata?.design
            };
        });

        return {
            id: universalFunnel.id,
            name: universalFunnel.name,
            description: universalFunnel.config?.description || '',
            steps: leadMagnetSteps,
            settings: universalFunnel.config?.settings || {}
        };
    }
}

// ===============================
// 🎯 PERSONAL BRANDING ADAPTER
// ===============================

interface PersonalBrandingStep {
    id: string;
    section: 'hero' | 'about' | 'services' | 'portfolio' | 'testimonials' | 'contact';
    content: {
        title?: string;
        subtitle?: string;
        description?: string;
        image?: string;
        items?: Array<{
            title: string;
            description: string;
            image?: string;
            link?: string;
        }>;
    };
    layout?: string;
    styling?: any;
}

interface PersonalBrandingData {
    id: string;
    name: string;
    profile: {
        name: string;
        title: string;
        bio: string;
        avatar: string;
    };
    steps: PersonalBrandingStep[];
    theme: any;
}

export class PersonalBrandingAdapter {
    static toUniversal(pbData: PersonalBrandingData): UniversalFunnel {
        const universalSteps: UniversalStep[] = pbData.steps.map((step) => {
            const blocks: UniversalBlock[] = [];

            // Title
            if (step.content.title) {
                blocks.push({
                    id: `title-${step.id}`,
                    type: 'heading',
                    content: { text: step.content.title }
                });
            }

            // Subtitle
            if (step.content.subtitle) {
                blocks.push({
                    id: `subtitle-${step.id}`,
                    type: 'text',
                    content: { text: step.content.subtitle }
                });
            }

            // Description
            if (step.content.description) {
                blocks.push({
                    id: `desc-${step.id}`,
                    type: 'text',
                    content: { text: step.content.description }
                });
            }

            // Image
            if (step.content.image) {
                blocks.push({
                    id: `image-${step.id}`,
                    type: 'image',
                    content: { src: step.content.image }
                });
            }

            // Items (services, portfolio, etc.)
            step.content.items?.forEach((item, index) => {
                blocks.push({
                    id: `item-${step.id}-${index}`,
                    type: 'card',
                    content: {
                        title: item.title,
                        description: item.description,
                        image: item.image,
                        link: item.link
                    }
                });
            });

            return {
                id: step.id,
                name: getSectionName(step.section),
                blocks,
                metadata: {
                    section: step.section,
                    layout: step.layout,
                    styling: step.styling
                }
            };
        });

        return {
            id: pbData.id,
            name: pbData.name,
            type: 'personal-branding',
            steps: universalSteps,
            config: {
                profile: pbData.profile,
                theme: pbData.theme
            },
            metadata: {
                originalType: 'personalBranding',
                created: new Date().toISOString(),
                version: '1.0'
            }
        };
    }

    static fromUniversal(universalFunnel: UniversalFunnel): PersonalBrandingData {
        const pbSteps: PersonalBrandingStep[] = universalFunnel.steps.map((step) => {
            const titleBlock = step.blocks.find(b => b.type === 'heading');
            const textBlocks = step.blocks.filter(b => b.type === 'text');
            const imageBlock = step.blocks.find(b => b.type === 'image');
            const cardBlocks = step.blocks.filter(b => b.type === 'card');

            return {
                id: step.id.toString(),
                section: (step.metadata?.section as any) || 'hero',
                content: {
                    title: titleBlock?.content?.text,
                    subtitle: textBlocks[0]?.content?.text,
                    description: textBlocks[1]?.content?.text,
                    image: imageBlock?.content?.src,
                    items: cardBlocks.map(card => ({
                        title: card.content?.title || '',
                        description: card.content?.description || '',
                        image: card.content?.image,
                        link: card.content?.link
                    }))
                },
                layout: step.metadata?.layout,
                styling: step.metadata?.styling
            };
        });

        return {
            id: universalFunnel.id,
            name: universalFunnel.name,
            profile: universalFunnel.config?.profile || {
                name: '',
                title: '',
                bio: '',
                avatar: ''
            },
            steps: pbSteps,
            theme: universalFunnel.config?.theme || {}
        };
    }
}

// ===============================
// 🎯 UNIVERSAL ADAPTER FACTORY
// ===============================

export class FunnelAdapterFactory {
    private static adapters = {
        'quiz21Steps': Quiz21StepsAdapter,
        'leadMagnet': LeadMagnetAdapter,
        'personalBranding': PersonalBrandingAdapter
    };

    /**
     * Converte qualquer funil para formato universal
     */
    static toUniversal(data: any, type: string): UniversalFunnel {
        const adapter = this.adapters[type as keyof typeof this.adapters];
        if (!adapter) {
            throw new Error(`Adapter não encontrado para tipo: ${type}`);
        }
        return adapter.toUniversal(data);
    }

    /**
     * Converte formato universal de volta para tipo específico
     */
    static fromUniversal(universalFunnel: UniversalFunnel): any {
        const originalType = universalFunnel.metadata?.originalType;
        if (!originalType) {
            throw new Error('Tipo original não encontrado no metadata');
        }

        const adapter = this.adapters[originalType as keyof typeof this.adapters];
        if (!adapter) {
            throw new Error(`Adapter não encontrado para tipo: ${originalType}`);
        }

        return adapter.fromUniversal(universalFunnel);
    }

    /**
     * Detecta automaticamente o tipo de funil
     */
    static detectType(data: any): string {
        // Quiz21Steps
        if (data.steps && Array.isArray(data.steps) && data.steps[0]?.pergunta) {
            return 'quiz21Steps';
        }

        // Lead Magnet
        if (data.steps && Array.isArray(data.steps) && data.steps[0]?.type === 'landing') {
            return 'leadMagnet';
        }

        // Personal Branding
        if (data.profile && data.steps && data.steps[0]?.section) {
            return 'personalBranding';
        }

        return 'custom';
    }

    /**
     * Lista todos os adaptadores disponíveis
     */
    static getAvailableAdapters(): string[] {
        return Object.keys(this.adapters);
    }
}

// ===============================
// 🎯 HELPER FUNCTIONS
// ===============================

function getStepName(type: string): string {
    const names = {
        'landing': 'Página de Captura',
        'form': 'Formulário',
        'thank-you': 'Obrigado',
        'download': 'Download'
    };
    return names[type as keyof typeof names] || type;
}

function getSectionName(section: string): string {
    const names = {
        'hero': 'Hero Section',
        'about': 'Sobre',
        'services': 'Serviços',
        'portfolio': 'Portfolio',
        'testimonials': 'Depoimentos',
        'contact': 'Contato'
    };
    return names[section as keyof typeof names] || section;
}

export default FunnelAdapterFactory;