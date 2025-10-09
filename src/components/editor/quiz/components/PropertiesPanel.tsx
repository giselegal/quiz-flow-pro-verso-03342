import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Copy, ArrowRightCircle, Trash2 } from 'lucide-react';
import DynamicPropertiesForm from '../components/DynamicPropertiesForm';

// Tipagens locais (mantêm o componente independente do arquivo gigante)
export interface BlockComponent { id: string; type: string; order: number; parentId?: string | null; properties: Record<string, any>; content: Record<string, any>; }
export interface EditableQuizStep { id: string; type: string; order: number; blocks: BlockComponent[]; offerMap?: Record<string, any>; }
export interface BlockSnippet { id: string; name: string; blocks: BlockComponent[]; }

export interface PropertiesPanelProps {
    selectedStep?: EditableQuizStep;
    selectedBlock?: BlockComponent;
    headerConfig: any;
    onHeaderConfigChange: (patch: any) => void;
    clipboard: BlockComponent[] | null;
    canPaste: boolean;
    onPaste: () => void;
    multiSelectedIds: string[];
    onDuplicateInline: () => void;
    onPrepareDuplicateToAnother: () => void;
    onCopyMultiple: () => void;
    onRemoveMultiple: () => void;
    onRemoveBlock: () => void;
    onSaveAsSnippet: () => void;
    snippets: BlockSnippet[];
    snippetFilter: string;
    onSnippetFilterChange: (v: string) => void;
    onSnippetInsert: (snippet: BlockSnippet) => void;
    onSnippetRename: (snippet: BlockSnippet, newName: string) => void;
    onSnippetDelete: (snippet: BlockSnippet) => void;
    onRefreshSnippets: () => void;
    onBlockPatch: (patch: Record<string, any>) => void;
    isOfferStep: boolean;
    OfferMapComponent: React.ComponentType<any>;
    onOfferMapUpdate: (content: any) => void;
    ThemeEditorPanel: React.ComponentType<{ onApply: (t: any) => void }>;
    onApplyTheme: (tokens: any) => void;
    // Opcional: callbacks para runtime/scoring
    onRuntimeScoringChange?: (scoring: { tieBreak?: string; weights?: Record<string, number> }) => void;
    currentRuntimeScoring?: { tieBreak?: string; weights?: Record<string, number> } | null;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
    selectedStep,
    selectedBlock,
    headerConfig,
    onHeaderConfigChange,
    clipboard,
    canPaste,
    onPaste,
    multiSelectedIds,
    onDuplicateInline,
    onPrepareDuplicateToAnother,
    onCopyMultiple,
    onRemoveMultiple,
    onRemoveBlock,
    onSaveAsSnippet,
    snippets,
    snippetFilter,
    onSnippetFilterChange,
    onSnippetInsert,
    onSnippetRename,
    onSnippetDelete,
    onRefreshSnippets,
    onBlockPatch,
    isOfferStep,
    OfferMapComponent,
    onOfferMapUpdate,
    ThemeEditorPanel,
    onApplyTheme,
    onRuntimeScoringChange,
    currentRuntimeScoring,
}) => {
    // Estado local para edição simples de scoring (UI leve)
    const [tieBreak, setTieBreak] = React.useState<'alphabetical' | 'first' | 'natural-first' | 'random'>(
        (currentRuntimeScoring?.tieBreak as any) || 'alphabetical'
    );
    const [weightsText, setWeightsText] = React.useState<string>(
        currentRuntimeScoring?.weights ? JSON.stringify(currentRuntimeScoring.weights, null, 2) : ''
    );

    React.useEffect(() => {
        // Atualizar UI quando props externas mudarem
        if (currentRuntimeScoring) {
            setTieBreak((currentRuntimeScoring.tieBreak as any) || 'alphabetical');
            setWeightsText(currentRuntimeScoring.weights ? JSON.stringify(currentRuntimeScoring.weights, null, 2) : '');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(currentRuntimeScoring || {})]);

    const emitScoring = React.useCallback(() => {
        let weights: Record<string, number> | undefined;
        try {
            const txt = weightsText.trim();
            if (txt) {
                const obj = JSON.parse(txt);
                if (obj && typeof obj === 'object') weights = obj as Record<string, number>;
            }
        } catch {
            // ignore parse errors silently (UI mostrará feedback básico)
        }
        onRuntimeScoringChange?.({ tieBreak, weights });
        // Persistência local opcional (para sessões do editor)
        try {
            const payload = JSON.stringify({ tieBreak, weights });
            localStorage.setItem('quiz_editor_runtime_scoring_v1', payload);
        } catch {/* ignore */ }
    }, [tieBreak, weightsText, onRuntimeScoringChange]);

    return (
        <div className="px-4 pt-3 border-b flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-semibold text-sm">Painéis</h2>
                    <p className="text-xs text-muted-foreground">Configuração de blocos e tema</p>
                </div>
                <div className="flex gap-1">
                    <Button size="sm" variant="outline" disabled={!canPaste} onClick={onPaste} className="h-7 px-2 text-[11px]">Colar</Button>
                </div>
            </div>
            <Tabs defaultValue="props" className="w-full">
                <TabsList className="grid grid-cols-3 h-8">
                    <TabsTrigger value="props" className="text-[11px]">Propriedades</TabsTrigger>
                    <TabsTrigger value="runtime" className="text-[11px]">Runtime</TabsTrigger>
                    <TabsTrigger value="theme" className="text-[11px]">Tema</TabsTrigger>
                </TabsList>
                <TabsContent value="props" className="m-0 p-0 h-[calc(100vh-190px)]">
                    <ScrollArea className="h-full">
                        {selectedBlock && selectedStep ? (
                            <div className="p-4 space-y-6">
                                <DynamicPropertiesForm
                                    type={selectedBlock.type}
                                    values={{ ...selectedBlock.properties, ...selectedBlock.content }}
                                    onChange={(patch) => onBlockPatch(patch)}
                                />
                                <div className="pt-2 border-t space-y-2">
                                    <Button variant="outline" size="sm" className="w-full" onClick={onDuplicateInline}><Copy className="w-4 h-4 mr-2" />Duplicar</Button>
                                    <Button variant="secondary" size="sm" className="w-full" onClick={onPrepareDuplicateToAnother}><ArrowRightCircle className="w-4 h-4 mr-2" />Duplicar em…</Button>
                                    {multiSelectedIds.length > 1 && (
                                        <Button variant="outline" size="sm" className="w-full" onClick={onCopyMultiple}><Copy className="w-4 h-4 mr-2" /> Copiar {multiSelectedIds.length}</Button>
                                    )}
                                    {multiSelectedIds.length > 1 && (
                                        <Button variant="destructive" size="sm" className="w-full" onClick={onRemoveMultiple}><Trash2 className="w-4 h-4 mr-2" /> Remover {multiSelectedIds.length}</Button>
                                    )}
                                    <Button variant="destructive" size="sm" className="w-full" onClick={onRemoveBlock}><Trash2 className="w-4 h-4 mr-2" />Remover</Button>
                                    {(multiSelectedIds.length > 0 || selectedBlock) && (
                                        <Button variant="outline" size="sm" className="w-full" onClick={onSaveAsSnippet}><Copy className="w-4 h-4 mr-2" /> Salvar como Snippet</Button>
                                    )}
                                </div>
                                <div className="pt-4 border-t space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-semibold text-muted-foreground uppercase">Snippets</h3>
                                        <button onClick={onRefreshSnippets} className="text-[10px] text-blue-600 hover:underline">Atualizar</button>
                                    </div>
                                    <Input placeholder="Filtrar..." value={snippetFilter} onChange={e => onSnippetFilterChange(e.target.value)} className="h-7 text-xs" />
                                    <div className="space-y-2 max-h-60 overflow-auto pr-1">
                                        {snippets.filter(s => !snippetFilter || s.name.toLowerCase().includes(snippetFilter.toLowerCase())).map(s => (
                                            <div key={s.id} className="border rounded-md p-2 group relative">
                                                <p className="text-xs font-medium truncate">{s.name}</p>
                                                <p className="text-[10px] text-muted-foreground">{s.blocks.length} blocos</p>
                                                <div className="flex gap-1 mt-1">
                                                    <Button variant="outline" size="sm" className="h-6 text-[10px] flex-1" onClick={() => onSnippetInsert(s)}>Insert</Button>
                                                    <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => { const newName = prompt('Renomear snippet:', s.name); if (!newName) return; onSnippetRename(s, newName); }}>Renomear</Button>
                                                    <Button variant="destructive" size="sm" className="h-6 text-[10px]" onClick={() => { if (!confirm('Excluir snippet?')) return; onSnippetDelete(s); }}>Del</Button>
                                                </div>
                                            </div>
                                        ))}
                                        {snippets.length === 0 && (<p className="text-[11px] text-muted-foreground">Nenhum snippet salvo</p>)}
                                    </div>
                                </div>
                            </div>
                        ) : selectedStep && isOfferStep ? (
                            <div className="p-4 space-y-4">
                                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600">Mapa de Ofertas</h3>
                                <p className="text-[11px] text-muted-foreground leading-relaxed">Edite as 4 variações de oferta personalizadas. Use <code>{'{userName}'}</code> nos textos.</p>
                                <React.Suspense fallback={<div className="text-[11px] text-muted-foreground">Carregando editor de ofertas…</div>}>
                                    <OfferMapComponent mode="editor" content={{ offerMap: selectedStep?.offerMap || {} }} onUpdate={onOfferMapUpdate} userName={"Preview"} />
                                </React.Suspense>
                            </div>
                        ) : (
                            <div className="p-4 space-y-4 text-xs">
                                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600">Cabeçalho Fixo</h3>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2"><input type="checkbox" checked={headerConfig.showLogo} onChange={e => onHeaderConfigChange({ showLogo: e.target.checked })} />Exibir Logo</label>
                                    {headerConfig.showLogo && (<>
                                        <div className="space-y-1"><span>Logo URL</span><input className="w-full border rounded px-2 py-1" value={headerConfig.logoUrl} onChange={e => onHeaderConfigChange({ logoUrl: e.target.value })} /></div>
                                        <div className="space-y-1"><span>Largura Logo</span><input className="w-full border rounded px-2 py-1" value={headerConfig.logoWidth} onChange={e => onHeaderConfigChange({ logoWidth: e.target.value })} /></div>
                                    </>)}
                                    <label className="flex items-center gap-2"><input type="checkbox" checked={headerConfig.progressEnabled} onChange={e => onHeaderConfigChange({ progressEnabled: e.target.checked })} />Exibir Barra de Progresso</label>
                                    {headerConfig.progressEnabled && (<>
                                        <label className="flex items-center gap-2"><input type="checkbox" checked={headerConfig.autoProgress} onChange={e => onHeaderConfigChange({ autoProgress: e.target.checked })} />Cálculo Automático</label>
                                        {!headerConfig.autoProgress && (<div className="space-y-1"><span>Porcentagem Manual</span><input type="number" min={0} max={100} className="w-full border rounded px-2 py-1" value={headerConfig.manualPercent} onChange={e => onHeaderConfigChange({ manualPercent: Number(e.target.value) })} /></div>)}
                                        <div className="space-y-1"><span>Espessura Barra</span><input className="w-full border rounded px-2 py-1" value={headerConfig.barHeight} onChange={e => onHeaderConfigChange({ barHeight: e.target.value })} /></div>
                                        <div className="space-y-1"><span>Cor Barra</span><input type="color" className="w-full h-8 border rounded" value={headerConfig.barColor} onChange={e => onHeaderConfigChange({ barColor: e.target.value })} /></div>
                                        <div className="space-y-1"><span>Cor Fundo</span><input type="color" className="w-full h-8 border rounded" value={headerConfig.barBackground} onChange={e => onHeaderConfigChange({ barBackground: e.target.value })} /></div>
                                    </>)}
                                </div>
                                <p className="text-[10px] text-muted-foreground leading-snug">O cabeçalho se aplica a todas as etapas (exceto resultado e oferta). Desative logo ou barra conforme necessário.</p>
                            </div>
                        )}
                    </ScrollArea>
                </TabsContent>
                <TabsContent value="theme" className="m-0 p-0 h-[calc(100vh-190px)]">
                    <ThemeEditorPanel onApply={onApplyTheme} />
                </TabsContent>
                <TabsContent value="runtime" className="m-0 p-0 h-[calc(100vh-190px)]">
                    <ScrollArea className="h-full">
                        <div className="p-4 space-y-4 text-xs">
                            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600">Pontuação (Scoring)</h3>
                            <div className="space-y-2">
                                <label className="block text-[11px] text-slate-600">Desempate (tieBreak)</label>
                                <select
                                    className="border rounded px-2 py-1 text-[12px] w-full bg-white"
                                    value={tieBreak}
                                    onChange={(e) => setTieBreak(e.target.value as any)}
                                >
                                    <option value="alphabetical">Alfabético</option>
                                    <option value="first">Primeiro</option>
                                    <option value="natural-first">Natural Primeiro</option>
                                    <option value="random">Aleatório</option>
                                </select>
                                <p className="text-[10px] text-muted-foreground">Critério quando estilos empatam.</p>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[11px] text-slate-600">Pesos (JSON)</label>
                                <textarea
                                    className="w-full min-h-[120px] border rounded px-2 py-1 font-mono text-[11px]"
                                    placeholder='Ex: {"natural": 1.2, "classico": 1}'
                                    value={weightsText}
                                    onChange={(e) => setWeightsText(e.target.value)}
                                />
                                <p className="text-[10px] text-muted-foreground">Mapeie styleId → peso. Deixe vazio para pesos padrão (=1).</p>
                            </div>
                            <div className="flex gap-2 pt-1">
                                <Button size="sm" className="h-7 text-[11px]" onClick={emitScoring}>Aplicar no Preview</Button>
                            </div>
                        </div>
                    </ScrollArea>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default PropertiesPanel;
