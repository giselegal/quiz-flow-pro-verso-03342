import React, { createContext, useContext, useMemo } from 'react';
import { z } from 'zod';

// Definição de um bloco modular de conteúdo do quiz (ex: Headline Resultado, Oferta CTA, Urgência, Depoimento etc.)
export interface BlockDefinition<Config extends Record<string, any> = any> {
    id: string;                                 // identificador único (ex: result.headline)
    version: number;                            // versionamento para migrações futuras
    label: string;                              // nome amigável para UI
    category?: string;                          // agrupamento (resultado, oferta, conversão...)
    schema: z.ZodType<Config>;                  // validação do config
    defaultConfig: Config;                      // config inicial
    render: (props: { config: Config; state?: any }) => React.ReactNode; // renderização pura (sem layout externo)
}

export interface BlockInstance {
    id: string;              // id único da instância (uuid ou incremental)
    type: string;            // referencia BlockDefinition.id
    config: Record<string, any>;
}

interface BlockRegistryContextValue {
    blocks: Record<string, BlockDefinition<any>>;
    list: BlockDefinition<any>[];
    get: (id: string) => BlockDefinition<any> | undefined;
}

const BlockRegistryContext = createContext<BlockRegistryContextValue | null>(null);

interface BlockRegistryProviderProps {
    definitions: BlockDefinition<any>[];
    children: React.ReactNode;
}

export const BlockRegistryProvider: React.FC<BlockRegistryProviderProps> = ({ definitions, children }) => {
    const value = useMemo<BlockRegistryContextValue>(() => {
        const map: Record<string, BlockDefinition<any>> = {};
        definitions.forEach(def => { map[def.id] = def; });
        return {
            blocks: map,
            list: definitions.slice().sort((a, b) => a.label.localeCompare(b.label)),
            get: (id: string) => map[id]
        };
    }, [definitions]);
    return <BlockRegistryContext.Provider value={value}>{children}</BlockRegistryContext.Provider>;
};

export function useBlockRegistry() {
    const ctx = useContext(BlockRegistryContext);
    if (!ctx) throw new Error('useBlockRegistry deve ser usado dentro de BlockRegistryProvider');
    return ctx;
}

// Variante opcional para cenários de teste / fallback onde preferimos não lançar exceção
export function useBlockRegistryOptional() {
    return useContext(BlockRegistryContext);
}

// Helpers para criação rápida de blocos
export function defineBlock<Cfg extends Record<string, any>>(def: Omit<BlockDefinition<Cfg>, 'version'> & { version?: number }): BlockDefinition<Cfg> {
    return { version: 1, ...def } as BlockDefinition<Cfg>;
}

// Blocos de exemplo iniciais (serão expandidos na FASE 2)
export const ResultHeadlineBlock = defineBlock({
    id: 'result.headline',
    label: 'Resultado: Headline',
    category: 'resultado',
    schema: z.object({
        prefix: z.string().default('Seu estilo é'),
        highlight: z.string().default('{primaryStyle}'),
        showSecondary: z.boolean().default(true)
    }),
    defaultConfig: { prefix: 'Seu estilo é', highlight: '{primaryStyle}', showSecondary: true },
    render: ({ config }) => (
        <div className="space-y-1 text-center">
            <h2 className="text-xl font-bold">
                {config.prefix}: <span className="text-primary">{config.highlight}</span>
            </h2>
            {config.showSecondary && <p className="text-xs opacity-70">Exploraremos também seus estilos secundários…</p>}
        </div>
    )
});

export const OfferCoreBlock = defineBlock({
    id: 'offer.core',
    label: 'Oferta: Core',
    category: 'oferta',
    schema: z.object({
        title: z.string().default('Oferta Especial'),
        description: z.string().default('Descrição da oferta personalizada.'),
        ctaLabel: z.string().default('Quero Acessar'),
        ctaUrl: z.string().url().default('https://exemplo.com'),
        accent: z.string().default('#B89B7A')
    }),
    defaultConfig: { title: 'Oferta Especial', description: 'Descrição da oferta personalizada.', ctaLabel: 'Quero Acessar', ctaUrl: 'https://exemplo.com', accent: '#B89B7A' },
    render: ({ config }) => (
        <div className="border rounded p-4 text-left" style={{ borderColor: config.accent }}>
            <h3 className="font-semibold mb-1" style={{ color: config.accent }}>{config.title}</h3>
            <p className="text-sm mb-2">{config.description}</p>
            <a href={config.ctaUrl} target="_blank" className="inline-block bg-primary text-primary-foreground text-xs px-3 py-1 rounded hover:opacity-90">{config.ctaLabel}</a>
        </div>
    )
});

// Lista de estilos secundários
export const ResultSecondaryListBlock = defineBlock({
    id: 'result.secondaryList',
    label: 'Resultado: Estilos Secundários',
    category: 'resultado',
    schema: z.object({
        title: z.string().default('Outros estilos que combinam com você:'),
        bulletPrefix: z.string().default('•'),
        emptyText: z.string().default('Nenhum estilo secundário calculado'),
        max: z.number().int().positive().max(10).default(3)
    }),
    defaultConfig: { title: 'Outros estilos que combinam com você:', bulletPrefix: '•', emptyText: 'Nenhum estilo secundário calculado', max: 3 },
    render: ({ config, state }) => {
        const secondary = (state?.userProfile?.secondaryStyles || []).slice(0, config.max);
        return (
            <div className="text-sm space-y-2">
                <h4 className="font-semibold text-primary text-center text-base">{config.title}</h4>
                {secondary.length ? (
                    <ul className="list-disc pl-5 space-y-1">
                        {secondary.map((s: string) => <li key={s} className="text-xs">{config.bulletPrefix} {s}</li>)}
                    </ul>
                ) : <p className="text-xs italic text-muted-foreground text-center">{config.emptyText}</p>}
            </div>
        );
    }
});

// Urgência / Contagem regressiva simples (client-side)
export const OfferUrgencyBlock = defineBlock({
    id: 'offer.urgency',
    label: 'Oferta: Urgência',
    category: 'oferta',
    schema: z.object({
        deadlineISO: z.string().default(() => new Date(Date.now() + 3600_000).toISOString()),
        headline: z.string().default('Oferta expira em:'),
        expiredText: z.string().default('Oferta expirada'),
        accent: z.string().default('#bd0000')
    }),
    defaultConfig: { deadlineISO: new Date(Date.now() + 3600_000).toISOString(), headline: 'Oferta expira em:', expiredText: 'Oferta expirada', accent: '#bd0000' },
    render: ({ config }) => {
        const deadlineStr = config.deadlineISO || new Date(Date.now() + 3600_000).toISOString();
        const deadline = new Date(deadlineStr).getTime();
        const now = Date.now();
        const diff = Math.max(0, deadline - now);
        const totalSec = Math.floor(diff / 1000);
        const h = Math.floor(totalSec / 3600).toString().padStart(2, '0');
        const m = Math.floor((totalSec % 3600) / 60).toString().padStart(2, '0');
        const s = Math.floor(totalSec % 60).toString().padStart(2, '0');
        const expired = diff <= 0;
        return (
            <div className="border rounded p-3 text-center" style={{ borderColor: config.accent }}>
                <p className="text-xs font-semibold mb-1" style={{ color: config.accent }}>{config.headline}</p>
                <div className="font-mono text-lg tracking-widest" style={{ color: config.accent }}>
                    {expired ? config.expiredText : `${h}:${m}:${s}`}
                </div>
            </div>
        );
    }
});

// Testimonial / Depoimento simples
export const OfferTestimonialBlock = defineBlock({
    id: 'offer.testimonial',
    label: 'Oferta: Depoimento',
    category: 'oferta',
    schema: z.object({
        quote: z.string().default('Esse programa transformou minha relação com meu guarda-roupa!'),
        author: z.string().default('Aluna satisfeita'),
        accent: z.string().default('#432818')
    }),
    defaultConfig: { quote: 'Esse programa transformou minha relação com meu guarda-roupa!', author: 'Aluna satisfeita', accent: '#432818' },
    render: ({ config }) => (
        <figure className="border rounded p-4 bg-muted/30" style={{ borderColor: config.accent }}>
            <blockquote className="text-sm italic mb-2" style={{ color: config.accent }}>
                “{config.quote}”
            </blockquote>
            <figcaption className="text-xs opacity-80">— {config.author}</figcaption>
        </figure>
    )
});

// ================= BLOCOS NORMALIZED (Fase de Migração) =================
export const HeroBlock = defineBlock({
    id: 'hero-block',
    label: 'Hero (Intro)',
    category: 'intro',
    schema: z.object({
        titleHtml: z.string().default('<strong>Bem-vinda</strong>'),
        subtitleHtml: z.string().optional(),
        imageUrl: z.string().url().optional(),
        imageAlt: z.string().optional(),
        logoUrl: z.string().url().optional(),
        logoAlt: z.string().optional()
    }),
    defaultConfig: { titleHtml: '<strong>Bem-vinda</strong>' },
    render: ({ config }) => (
        <div className="text-center space-y-4">
            {config.logoUrl && (
                <img src={config.logoUrl} alt={config.logoAlt || 'Logo'} className="mx-auto h-16 w-auto object-contain" />
            )}
            {config.titleHtml && <h1 className="text-2xl md:text-3xl font-serif leading-snug" dangerouslySetInnerHTML={{ __html: config.titleHtml }} />}
            {config.subtitleHtml && <p className="text-sm opacity-80" dangerouslySetInnerHTML={{ __html: config.subtitleHtml }} />}
            {config.imageUrl && (
                <div className="mx-auto max-w-xs">
                    <img src={config.imageUrl} alt={config.imageAlt || 'Imagem'} className="rounded-lg shadow-sm w-full h-auto object-cover" />
                </div>
            )}
        </div>
    )
});

export const WelcomeFormBlock = defineBlock({
    id: 'welcome-form-block',
    label: 'Formulário Nome (Intro)',
    category: 'intro',
    schema: z.object({
        questionLabel: z.string().default('Como posso te chamar?'),
        placeholder: z.string().default('Digite seu nome...'),
        buttonText: z.string().default('Começar'),
        required: z.boolean().default(true)
    }),
    defaultConfig: { questionLabel: 'Como posso te chamar?', placeholder: 'Digite seu nome...', buttonText: 'Começar', required: true },
    render: ({ config, state }) => {
        // O state pode conter onNameSubmit para integração com runtime
        const [value, setValue] = React.useState('');
        const handle = (e: React.FormEvent) => {
            e.preventDefault();
            if (!value.trim()) return;
            if (state?.onNameSubmit) state.onNameSubmit(value.trim());
        };
        return (
            <form onSubmit={handle} className="space-y-3 max-w-sm mx-auto">
                <label className="block text-xs font-semibold tracking-wide uppercase opacity-80">
                    {config.questionLabel}{config.required && ' *'}
                </label>
                <input
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder={config.placeholder}
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                    type="submit"
                    disabled={!value.trim()}
                    className="w-full bg-primary text-white py-2 rounded font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {config.buttonText}
                </button>
            </form>
        );
    }
});

export const QuestionBlock = defineBlock({
    id: 'question-block',
    label: 'Pergunta (Múltipla)',
    category: 'question',
    schema: z.object({
        questionNumber: z.string().optional(),
        questionText: z.string().default('Pergunta'),
        requiredSelections: z.number().int().positive().default(1),
        options: z.array(z.object({ id: z.string(), text: z.string(), image: z.string().optional() })).default([])
    }),
    defaultConfig: { questionText: 'Pergunta', requiredSelections: 1, options: [] },
    render: ({ config, state }) => {
        const [answers, setAnswers] = React.useState<string[]>([]);
        const required = config.requiredSelections ?? 1;
        const toggle = (optId: string) => {
            setAnswers(prev => {
                const selected = prev.includes(optId);
                let next = selected ? prev.filter(i => i !== optId) : [...prev, optId];
                if (next.length > required) {
                    next = next.slice(0, required);
                }
                if (state?.onAnswersChange) state.onAnswersChange(next);
                // Auto avançar se completou
                if (next.length === required && state?.onComplete) {
                    setTimeout(() => state.onComplete(), 250);
                }
                return next;
            });
        };
        const options = config.options ?? [];
        return (
            <div className="space-y-4">
                {config.questionNumber && <h2 className="text-sm font-semibold opacity-70">{config.questionNumber}</h2>}
                <h3 className="text-xl font-bold text-primary leading-snug">{config.questionText}</h3>
                <p className="text-xs opacity-70">Selecione {required} opção(ões) ({answers.length}/{required})</p>
                <div className={`grid ${options.some(o => o.image) ? 'grid-cols-2 gap-3' : 'grid-cols-1 gap-2'}`}>
                    {options.map(opt => {
                        const active = answers.includes(opt.id);
                        return (
                            <button
                                type="button"
                                key={opt.id}
                                onClick={() => toggle(opt.id)}
                                className={`border rounded p-2 text-left text-xs sm:text-sm transition relative ${active ? 'border-primary shadow' : 'border-gray-200 hover:border-primary/60'}`}
                            >
                                {opt.image && <img src={opt.image} alt={opt.text} className="w-full aspect-[4/5] object-cover rounded mb-1" />}
                                <span className="block leading-snug break-words">{opt.text}</span>
                                {active && <span className="absolute top-1 right-1 w-5 h-5 text-[10px] rounded-full bg-primary text-white flex items-center justify-center">✓</span>}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }
});

export const DEFAULT_BLOCK_DEFINITIONS: BlockDefinition<any>[] = [
    // Normalized (novos)
    HeroBlock,
    WelcomeFormBlock,
    QuestionBlock,
    // Existentes
    ResultHeadlineBlock,
    ResultSecondaryListBlock,
    OfferCoreBlock,
    OfferUrgencyBlock,
    OfferTestimonialBlock
];

// =============== REGISTROS COMPLEMENTARES (paridade com Canvas) ===============
// Nota: Esses blocos aproximam visual/comportamento dos tipos inline do editor.
// Eles são simples e seguros (sem dependências externas) para evitar 'Bloco não encontrado'.

export const ResultHeaderInlineBlock = defineBlock({
    id: 'result-header-inline',
    label: 'Resultado: Cabeçalho Inline',
    category: 'resultado',
    schema: z.object({
        title: z.string().default('Seu Resultado:'),
        subtitle: z.string().optional()
    }),
    defaultConfig: { title: 'Seu Resultado:' },
    render: ({ config }) => (
        <div className="text-center space-y-2 py-4">
            <h2 className="text-2xl font-bold text-slate-800">{config.title}</h2>
            {config.subtitle && <p className="text-sm text-slate-600">{config.subtitle}</p>}
        </div>
    )
});

export const StyleCardInlineBlock = defineBlock({
    id: 'style-card-inline',
    label: 'Resultado: Cartão de Estilo',
    category: 'resultado',
    schema: z.object({
        styleId: z.string().optional(),
        styleName: z.string().default('Seu Estilo'),
        image: z.string().url().optional(),
        description: z.string().default('Descrição do estilo')
    }),
    defaultConfig: { styleName: 'Seu Estilo', description: 'Descrição do estilo' },
    render: ({ config }) => (
        <div className="border rounded-lg p-6 bg-gradient-to-br from-white to-slate-50 shadow-sm">
            <h3 className="text-lg font-bold mb-2">{config.styleName}</h3>
            {config.image && <img src={config.image} alt={config.styleName} className="w-full h-48 object-cover rounded-lg mb-3" />}
            <p className="text-sm text-slate-600">{config.description}</p>
        </div>
    )
});

export const SecondaryStylesInlineBlock = defineBlock({
    id: 'secondary-styles',
    label: 'Resultado: Estilos Secundários (Inline)',
    category: 'resultado',
    schema: z.object({
        styles: z.array(z.object({ id: z.string().optional(), name: z.string().optional(), score: z.number().optional() })).default([]),
        max: z.number().default(2)
    }),
    defaultConfig: { styles: [], max: 2 },
    render: ({ config, state }) => {
        // Se vazio, derive do userProfile
        let styles = Array.isArray(config.styles) && config.styles.length ? config.styles : [];
        if (!styles.length && state?.userProfile?.secondaryStyles) {
            styles = (state.userProfile.secondaryStyles as string[]).slice(0, config.max).map(s => ({ name: s }));
        }
        return (
            <div className="space-y-2">
                <div className="text-sm font-medium text-slate-700 mb-2">Estilos Secundários:</div>
                <div className="grid grid-cols-2 gap-2">
                    {(styles as any[]).map((style, idx) => (
                        <div key={idx} className="border rounded-lg p-3 bg-white text-center">
                            <div className="text-sm font-medium">{style.name || `Estilo ${idx + 1}`}</div>
                            {style.score != null && <div className="text-xs text-slate-500">{style.score}%</div>}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
});

export const QuizOfferCtaInlineBlock = defineBlock({
    id: 'quiz-offer-cta-inline',
    label: 'Oferta: CTA Inline',
    category: 'oferta',
    schema: z.object({
        title: z.string().default('Oferta Especial'),
        description: z.string().default('Conteúdo exclusivo liberado'),
        buttonText: z.string().default('Quero Aproveitar'),
        buttonUrl: z.string().url().default('#'),
        image: z.string().url().optional(),
        offerKey: z.string().optional()
    }),
    defaultConfig: { title: 'Oferta Especial', description: 'Conteúdo exclusivo liberado', buttonText: 'Quero Aproveitar', buttonUrl: '#' },
    render: ({ config }) => (
        <div className="bg-gradient-to-r from-[#B89B7A] to-[#D4AF37] text-white rounded-lg p-6 shadow-lg">
            {config.image && <img src={config.image} alt={config.title} className="w-full h-40 object-cover rounded mb-3 opacity-95" />}
            <h3 className="text-xl font-bold mb-2">{config.title}</h3>
            <p className="text-sm mb-4 opacity-90">{config.description}</p>
            <a href={config.buttonUrl} target="_blank" rel="noreferrer">
                <button type="button" className="bg-white text-[#B89B7A] px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors">
                    {config.buttonText}
                </button>
            </a>
        </div>
    )
});

export const ConversionInlineBlock = defineBlock({
    id: 'conversion',
    label: 'Conversão (Inline)',
    category: 'oferta',
    schema: z.object({
        headline: z.string().default('Pronta para transformar seu estilo?'),
        subheadline: z.string().default('Conheça nosso programa completo.'),
        ctaText: z.string().default('Quero participar')
    }),
    defaultConfig: { headline: 'Pronta para transformar seu estilo?', subheadline: 'Conheça nosso programa completo.', ctaText: 'Quero participar' },
    render: ({ config }) => (
        <div className="rounded-lg p-6 border bg-white shadow-sm text-center">
            <h3 className="text-xl font-bold text-slate-800 mb-1">{config.headline}</h3>
            <p className="text-sm text-slate-600 mb-4">{config.subheadline}</p>
            <button type="button" className="px-6 py-3 rounded-md bg-[#B89B7A] text-white font-semibold">{config.ctaText}</button>
        </div>
    )
});

export const UrgencyTimerInlineBlock = defineBlock({
    id: 'urgency-timer-inline',
    label: 'Urgência: Timer Inline',
    category: 'oferta',
    schema: z.object({}),
    defaultConfig: {},
    render: () => (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <div className="text-sm font-medium text-red-700 mb-2">⏰ Oferta Expira em:</div>
            <div className="text-2xl font-bold text-red-600 font-mono">00:15:00</div>
        </div>
    )
});

export const GuaranteeInlineBlock = defineBlock({
    id: 'guarantee',
    label: 'Garantia',
    category: 'oferta',
    schema: z.object({ title: z.string().default('Garantia'), description: z.string().default('Satisfação garantida') }),
    defaultConfig: { title: 'Garantia', description: 'Satisfação garantida' },
    render: ({ config }) => (
        <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-green-700 mb-2">✓ {config.title}</div>
            <p className="text-sm text-green-600">{config.description}</p>
        </div>
    )
});

export const BonusInlineBlock = defineBlock({
    id: 'bonus',
    label: 'Bônus',
    category: 'oferta',
    schema: z.object({ title: z.string().default('Bônus Exclusivo'), description: z.string().default('Aproveite este bônus') }),
    defaultConfig: { title: 'Bônus Exclusivo', description: 'Aproveite este bônus' },
    render: ({ config }) => (
        <div className="border-2 border-yellow-300 bg-yellow-50 rounded-lg p-4">
            <div className="text-lg font-bold text-yellow-700 mb-2">🎁 {config.title}</div>
            <p className="text-sm text-yellow-600">{config.description}</p>
        </div>
    )
});

export const BenefitsInlineBlock = defineBlock({
    id: 'benefits',
    label: 'Benefícios',
    category: 'oferta',
    schema: z.object({ benefits: z.array(z.union([z.string(), z.object({ text: z.string() })])).default([]) }),
    defaultConfig: { benefits: [] },
    render: ({ config }) => (
        <div className="space-y-2">
            {(config.benefits as any[]).map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-sm text-slate-700">{typeof benefit === 'string' ? benefit : benefit.text}</span>
                </div>
            ))}
            {(!config.benefits || (config.benefits as any[]).length === 0) && (
                <div className="text-xs text-slate-400 italic">Nenhum benefício adicionado</div>
            )}
        </div>
    )
});

export const SecurePurchaseInlineBlock = defineBlock({
    id: 'secure-purchase',
    label: 'Compra Segura',
    category: 'oferta',
    schema: z.object({ text: z.string().default('Compra 100% Segura') }),
    defaultConfig: { text: 'Compra 100% Segura' },
    render: ({ config }) => (
        <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
            <span>🔒</span>
            <span>{config.text}</span>
        </div>
    )
});

export const ValueAnchoringInlineBlock = defineBlock({
    id: 'value-anchoring',
    label: 'Ancoragem de Valor',
    category: 'oferta',
    schema: z.object({ oldPrice: z.string().default('R$ 297,00'), newPrice: z.string().default('R$ 97,00'), discount: z.string().default('Economize 67%') }),
    defaultConfig: { oldPrice: 'R$ 297,00', newPrice: 'R$ 97,00', discount: 'Economize 67%' },
    render: ({ config }) => (
        <div className="text-center space-y-2">
            <div className="text-sm text-slate-500 line-through">{config.oldPrice}</div>
            <div className="text-3xl font-bold text-green-600">{config.newPrice}</div>
            <div className="text-sm text-red-600 font-medium">{config.discount}</div>
        </div>
    )
});

export const BeforeAfterInlineBlock = defineBlock({
    id: 'before-after-inline',
    label: 'Antes e Depois',
    category: 'oferta',
    schema: z.object({ beforeImage: z.string().url().optional(), afterImage: z.string().url().optional(), beforeText: z.string().default('Situação anterior'), afterText: z.string().default('Resultado alcançado') }),
    defaultConfig: { beforeText: 'Situação anterior', afterText: 'Resultado alcançado' },
    render: ({ config }) => (
        <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
                <div className="text-sm font-medium text-slate-600 mb-2">Antes</div>
                {config.beforeImage && <img src={config.beforeImage} alt="Antes" className="w-full rounded-lg" />}
                <p className="text-xs text-slate-500 mt-2">{config.beforeText}</p>
            </div>
            <div className="text-center">
                <div className="text-sm font-medium text-green-600 mb-2">Depois</div>
                {config.afterImage && <img src={config.afterImage} alt="Depois" className="w-full rounded-lg" />}
                <p className="text-xs text-slate-700 mt-2">{config.afterText}</p>
            </div>
        </div>
    )
});

export const MentorSectionInlineBlock = defineBlock({
    id: 'mentor-section-inline',
    label: 'Seção Mentor (Inline)',
    category: 'oferta',
    schema: z.object({ mentorImage: z.string().url().optional(), mentorName: z.string().default('Mentor'), mentorBio: z.string().default('Descrição do mentor') }),
    defaultConfig: { mentorName: 'Mentor', mentorBio: 'Descrição do mentor' },
    render: ({ config }) => (
        <div className="flex items-start gap-4 bg-slate-50 border rounded-lg p-4">
            {config.mentorImage && <img src={config.mentorImage} alt={config.mentorName} className="w-20 h-20 rounded-full object-cover flex-shrink-0" />}
            <div className="flex-1">
                <div className="text-sm font-bold text-slate-800 mb-1">{config.mentorName}</div>
                <p className="text-xs text-slate-600">{config.mentorBio}</p>
            </div>
        </div>
    )
});

// Estender a lista padrão com os registros complementares
export const EXTENDED_BLOCK_DEFINITIONS: BlockDefinition<any>[] = [
    ...DEFAULT_BLOCK_DEFINITIONS,
    ResultHeaderInlineBlock,
    StyleCardInlineBlock,
    SecondaryStylesInlineBlock,
    QuizOfferCtaInlineBlock,
    ConversionInlineBlock,
    UrgencyTimerInlineBlock,
    GuaranteeInlineBlock,
    BonusInlineBlock,
    BenefitsInlineBlock,
    SecurePurchaseInlineBlock,
    ValueAnchoringInlineBlock,
    BeforeAfterInlineBlock,
    MentorSectionInlineBlock,
];
