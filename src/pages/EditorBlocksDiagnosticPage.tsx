import React from 'react';
import { useEditor } from '@/hooks/useEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

const EditorBlocksDiagnosticPage: React.FC = () => {
    const editor = useEditor({ optional: true } as any);

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
                <p className="text-sm text-muted-foreground mb-6">Origem dos dados por etapa e quantidade de blocos carregados.</p>

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
