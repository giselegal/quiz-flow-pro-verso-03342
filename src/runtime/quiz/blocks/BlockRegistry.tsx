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
            <h1 className="text-2xl md:text-3xl font-serif leading-snug" dangerouslySetInnerHTML={{ __html: config.titleHtml }} />
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
        const toggle = (optId: string) => {
            setAnswers(prev => {
                const selected = prev.includes(optId);
                let next = selected ? prev.filter(i => i !== optId) : [...prev, optId];
                if (next.length > config.requiredSelections) {
                    next = next.slice(0, config.requiredSelections);
                }
                if (state?.onAnswersChange) state.onAnswersChange(next);
                // Auto avançar se completou
                if (next.length === config.requiredSelections && state?.onComplete) {
                    setTimeout(() => state.onComplete(), 250);
                }
                return next;
            });
        };
        return (
            <div className="space-y-4">
                {config.questionNumber && <h2 className="text-sm font-semibold opacity-70">{config.questionNumber}</h2>}
                <h3 className="text-xl font-bold text-primary leading-snug">{config.questionText}</h3>
                <p className="text-xs opacity-70">Selecione {config.requiredSelections} opção(ões) ({answers.length}/{config.requiredSelections})</p>
                <div className={`grid ${config.options.some(o => o.image) ? 'grid-cols-2 gap-3' : 'grid-cols-1 gap-2'}`}>
                    {config.options.map(opt => {
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
