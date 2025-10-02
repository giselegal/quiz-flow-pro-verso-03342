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

export const DEFAULT_BLOCK_DEFINITIONS: BlockDefinition<any>[] = [
    ResultHeadlineBlock,
    ResultSecondaryListBlock,
    OfferCoreBlock,
    OfferUrgencyBlock,
    OfferTestimonialBlock
];
