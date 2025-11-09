import React, { useEffect, useState } from 'react';
import { useEditor } from '@/hooks/useEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { blockRegistry } from '@/core/registry/UnifiedBlockRegistry';
import { Button } from '@/components/ui/button';

const SourceBadge: React.FC<{ source?: string }> = ({ source }) => {
    if (!source) return <Badge variant="secondary">desconhecida</Badge>;
    switch (source) {
        case 'modular-json':
            return <Badge className="bg-emerald-600">modular-json</Badge>;
        case 'master-json':
            return <Badge className="bg-indigo-600">master-json</Badge>;
        case 'ts-template':
            return <Badge className="bg-gray-600">ts-template</Badge>;
        default:
            return <Badge variant="secondary">{source}</Badge>;
    }
};

type ResolutionStatus = 'pending' | 'ok' | 'error' | 'missing';

const TARGET_TYPES = [
    'result-secondary-styles',
    'result-image',
    'result-description',
    'result-share',
    'question-hero',
];

const EditorBlocksDiagnosticPage: React.FC = () => {
    const editor = useEditor({ optional: true } as any);
    const [resolution, setResolution] = useState<Record<string, { status: ResolutionStatus; message?: string }>>({});

    // Executa um diagnóstico de resolução de componentes no registry para os tipos alvo
    const runResolutionCheck = async () => {
        const results: Record<string, { status: ResolutionStatus; message?: string }> = {};
        for (const type of TARGET_TYPES) {
            try {
                const has = blockRegistry.has(type);
                if (!has) {
                    results[type] = { status: 'missing', message: 'Não encontrado no registry' };
                    continue;
                }
                // getComponentAsync força o carregamento do lazy loader e retorna o componente real
                const Comp = await blockRegistry.getComponentAsync(type);
                if (typeof Comp === 'function' || typeof (Comp as any) === 'object') {
                    results[type] = { status: 'ok' };
                } else {
                    results[type] = { status: 'error', message: 'Tipo inesperado de componente' };
                }
            } catch (err: any) {
                results[type] = { status: 'error', message: String(err?.message || err) };
            }
        }
        setResolution(results);
        // expõe no window para inspeção rápida pelo console
        (window as any).__EDITOR_DIAGNOSTICS__ = {
            ...(window as any).__EDITOR_DIAGNOSTICS__,
            blockResolution: results,
        };
    };

    useEffect(() => {
        // dispara uma checagem automática ao abrir a página
        runResolutionCheck().catch(() => {/* ignore */ });
    }, []);

    if (!editor) {
        return (
            <div className="p-6">
                <h1 className="text-xl font-semibold">Diagnóstico de Blocos do Editor</h1>
                <p className="text-sm text-muted-foreground mt-2">EditorProviderUnified não está montado neste contexto.</p>
                <p className="text-sm text-muted-foreground">Abra a rota /editor antes de acessar este diagnóstico ou integre o provider nesta página.</p>
            </div>
        );
    }

    const { state } = editor;
    const steps = Object.keys(state.stepBlocks).sort();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">🔎 Diagnóstico: Blocos por Step</h1>
                <p className="text-sm text-muted-foreground mb-6">Origem dos dados por etapa, quantidade de blocos e status de resolução de componentes no registry.</p>

                {/* Resolução de componentes alvo */}
                <Card className="mb-6">
                    <CardHeader className="flex items-center justify-between gap-2">
                        <CardTitle>Resolução de componentes (alvos)</CardTitle>
                        <Button variant="outline" size="sm" onClick={runResolutionCheck}>Reexecutar checagem</Button>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {TARGET_TYPES.map((t) => {
                                const r = resolution[t];
                                let variant: any = 'secondary';
                                let label = 'pendente';
                                if (r) {
                                    if (r.status === 'ok') { variant = 'default'; label = 'ok'; }
                                    if (r.status === 'missing') { variant = 'destructive'; label = 'ausente'; }
                                    if (r.status === 'error') { variant = 'destructive'; label = 'erro'; }
                                }
                                return (
                                    <div key={t} className="flex items-center gap-2">
                                        <Badge variant="outline" className="font-mono">{t}</Badge>
                                        <Badge variant={variant}>{label}</Badge>
                                        {r?.message && (
                                            <span className="text-xs text-muted-foreground">{r.message}</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {steps.length === 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Nenhum step carregado</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">Carregue alguma etapa no editor para visualizar.</p>
                            </CardContent>
                        </Card>
                    )}

                    {steps.map((key) => {
                        const blocks = state.stepBlocks[key] || [];
                        const source = state.stepSources?.[key];
                        const types = Array.from(new Set(blocks.map(b => String(b.type))));
                        return (
                            <Card key={key}>
                                <CardHeader className="flex items-center justify-between gap-2">
                                    <CardTitle className="flex items-center gap-2">
                                        <span className="font-mono text-sm">{key}</span>
                                        <Badge variant="outline">{blocks.length} blocos</Badge>
                                    </CardTitle>
                                    <SourceBadge source={source} />
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {types.map((t) => (
                                            <Badge key={t} variant="secondary">{t}</Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Estado bruto</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="text-xs bg-white p-4 rounded border overflow-auto max-h-96">
                            {JSON.stringify({ stepSources: state.stepSources, steps: Object.keys(state.stepBlocks).length }, null, 2)}
                        </pre>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default EditorBlocksDiagnosticPage;
