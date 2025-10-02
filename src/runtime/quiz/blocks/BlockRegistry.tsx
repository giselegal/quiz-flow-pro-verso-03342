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

export const DEFAULT_BLOCK_DEFINITIONS: BlockDefinition<any>[] = [ResultHeadlineBlock, OfferCoreBlock];
