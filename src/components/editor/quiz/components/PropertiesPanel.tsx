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
    // Configs globais/unificadas para exibir e editar na UI
    unifiedConfig?: { runtime?: any; results?: any; ui?: any; settings?: any } | null;
    onUnifiedConfigPatch?: (patch: Partial<{ runtime: any; results: any; ui: any; settings: any }>) => void;
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
    unifiedConfig,
    onUnifiedConfigPatch,
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
                <TabsList className="grid grid-cols-5 h-8">
                    <TabsTrigger value="props" className="text-[11px]">Propriedades</TabsTrigger>
                    <TabsTrigger value="runtime" className="text-[11px]">Runtime</TabsTrigger>
                    <TabsTrigger value="results" className="text-[11px]">Resultados</TabsTrigger>
                    <TabsTrigger value="funnel" className="text-[11px]">Funil</TabsTrigger>
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
                <TabsContent value="results" className="m-0 p-0 h-[calc(100vh-190px)]">
                    <ScrollArea className="h-full">
                        <div className="p-4 space-y-4 text-xs">
                            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600">Exibição do Resultado</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <label className="flex items-center gap-2"><input type="checkbox" checked={!!unifiedConfig?.ui?.behavior?.resultDisplay?.showUserName} onChange={e => onUnifiedConfigPatch?.({ ui: { behavior: { ...(unifiedConfig?.ui?.behavior||{}), resultDisplay: { ...(unifiedConfig?.ui?.behavior?.resultDisplay||{}), showUserName: e.target.checked } } } })} />Exibir nome do usuário</label>
                                <label className="flex items-center gap-2"><input type="checkbox" checked={!!unifiedConfig?.ui?.behavior?.resultDisplay?.showStyleName} onChange={e => onUnifiedConfigPatch?.({ ui: { behavior: { ...(unifiedConfig?.ui?.behavior||{}), resultDisplay: { ...(unifiedConfig?.ui?.behavior?.resultDisplay||{}), showStyleName: e.target.checked } } } })} />Exibir nome do estilo</label>
                                <label className="flex items-center gap-2"><input type="checkbox" checked={!!unifiedConfig?.ui?.behavior?.resultDisplay?.showPrimaryPercentage} onChange={e => onUnifiedConfigPatch?.({ ui: { behavior: { ...(unifiedConfig?.ui?.behavior||{}), resultDisplay: { ...(unifiedConfig?.ui?.behavior?.resultDisplay||{}), showPrimaryPercentage: e.target.checked } } } })} />Exibir % do estilo predominante</label>
                                <label className="flex items-center gap-2"><input type="checkbox" checked={!!unifiedConfig?.ui?.behavior?.resultDisplay?.showSecondaryRanking} onChange={e => onUnifiedConfigPatch?.({ ui: { behavior: { ...(unifiedConfig?.ui?.behavior||{}), resultDisplay: { ...(unifiedConfig?.ui?.behavior?.resultDisplay||{}), showSecondaryRanking: e.target.checked } } } })} />Exibir ranking dos secundários</label>
                            </div>
                            <div className="grid grid-cols-2 gap-3 items-center">
                                <span>Qtd. secundários</span>
                                <input type="number" min={0} max={6} className="border rounded px-2 py-1 text-[12px]" value={unifiedConfig?.ui?.behavior?.resultDisplay?.secondaryCount ?? 2}
                                    onChange={e => onUnifiedConfigPatch?.({ ui: { behavior: { ...(unifiedConfig?.ui?.behavior||{}), resultDisplay: { ...(unifiedConfig?.ui?.behavior?.resultDisplay||{}), secondaryCount: Number(e.target.value) } } } })} />
                            </div>

                            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600 mt-4">Estilos</h3>
                            <p className="text-[10px] text-muted-foreground">Edite título, descrição, imagens e metadados de cada estilo</p>
                            <div className="space-y-3">
                                {Object.entries((unifiedConfig?.results?.styles||{})).map(([styleId, data]: any) => (
                                    <div key={styleId} className="border rounded p-3 bg-white">
                                        <div className="flex items-center justify-between">
                                            <div className="font-medium">{styleId}</div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 mt-2">
                                            <div className="space-y-2">
                                                <label className="block text-[11px]">Título</label>
                                                <input className="w-full border rounded px-2 py-1" value={data.title || ''} onChange={e=> onUnifiedConfigPatch?.({ results: { styles: { ...(unifiedConfig?.results?.styles||{}), [styleId]: { ...data, title: e.target.value } } } })} />
                                                <label className="block text-[11px] mt-2">Descrição</label>
                                                <textarea className="w-full border rounded px-2 py-1 min-h-[72px]" value={data.description || ''} onChange={e=> onUnifiedConfigPatch?.({ results: { styles: { ...(unifiedConfig?.results?.styles||{}), [styleId]: { ...data, description: e.target.value } } } })} />
                                                <label className="block text-[11px] mt-2">Categoria</label>
                                                <input className="w-full border rounded px-2 py-1" value={data.category || ''} onChange={e=> onUnifiedConfigPatch?.({ results: { styles: { ...(unifiedConfig?.results?.styles||{}), [styleId]: { ...data, category: e.target.value } } } })} />
                                                <label className="block text-[11px] mt-2">Palavras-chave (separadas por vírgula)</label>
                                                <input className="w-full border rounded px-2 py-1" value={(data.keywords||[]).join(', ')} onChange={e=> onUnifiedConfigPatch?.({ results: { styles: { ...(unifiedConfig?.results?.styles||{}), [styleId]: { ...data, keywords: e.target.value.split(',').map((s:string)=>s.trim()).filter(Boolean) } } } })} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-[11px]">Imagem do Estilo</label>
                                                <input className="w-full border rounded px-2 py-1" value={data.image || ''} onChange={e=> onUnifiedConfigPatch?.({ results: { styles: { ...(unifiedConfig?.results?.styles||{}), [styleId]: { ...data, image: e.target.value } } } })} />
                                                <label className="block text-[11px] mt-2">Imagem do Guia (material)</label>
                                                <input className="w-full border rounded px-2 py-1" value={data.guideImage || ''} onChange={e=> onUnifiedConfigPatch?.({ results: { styles: { ...(unifiedConfig?.results?.styles||{}), [styleId]: { ...data, guideImage: e.target.value } } } })} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {Object.keys(unifiedConfig?.results?.styles||{}).length === 0 && (
                                    <div className="text-[11px] text-muted-foreground">Nenhum estilo encontrado no documento unificado</div>
                                )}
                            </div>
                        </div>
                    </ScrollArea>
                </TabsContent>

                <TabsContent value="funnel" className="m-0 p-0 h-[calc(100vh-190px)]">
                    <ScrollArea className="h-full">
                        <div className="p-4 space-y-4 text-xs">
                            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600">Configurações do Funil</h3>
                            <div className="grid grid-cols-2 gap-3 items-center">
                                <span>URL Base</span>
                                <input className="border rounded px-2 py-1" placeholder="https://seu-dominio.com" value={unifiedConfig?.settings?.seo?.canonical || ''} onChange={e=> onUnifiedConfigPatch?.({ settings: { ...(unifiedConfig?.settings||{}), seo: { ...(unifiedConfig?.settings?.seo||{}), canonical: e.target.value } } })} />
                                <span>Pixel ID</span>
                                <input className="border rounded px-2 py-1" placeholder="FB-PIXEL-ID" value={unifiedConfig?.settings?.analytics?.facebookPixel?.pixelId || ''} onChange={e=> onUnifiedConfigPatch?.({ settings: { ...(unifiedConfig?.settings||{}), analytics: { ...(unifiedConfig?.settings?.analytics||{}), facebookPixel: { ...(unifiedConfig?.settings?.analytics?.facebookPixel||{}), pixelId: e.target.value } } } })} />
                                <span>Token</span>
                                <input className="border rounded px-2 py-1" placeholder="seu-token" value={unifiedConfig?.settings?.integrations?.custom?.token || ''} onChange={e=> onUnifiedConfigPatch?.({ settings: { ...(unifiedConfig?.settings||{}), integrations: { ...(unifiedConfig?.settings?.integrations||{}), custom: { ...(unifiedConfig?.settings?.integrations?.custom||{}), token: e.target.value } } } })} />
                                <span>API Base</span>
                                <input className="border rounded px-2 py-1" placeholder="https://api.exemplo.com" value={unifiedConfig?.settings?.integrations?.custom?.apiBaseUrl || ''} onChange={e=> onUnifiedConfigPatch?.({ settings: { ...(unifiedConfig?.settings||{}), integrations: { ...(unifiedConfig?.settings?.integrations||{}), custom: { ...(unifiedConfig?.settings?.integrations?.custom||{}), apiBaseUrl: e.target.value } } } })} />
                                <span>Webhook URL</span>
                                <input className="border rounded px-2 py-1" placeholder="https://hooks.exemplo.com/lead" value={(unifiedConfig?.settings?.integrations?.webhooks?.[0]?.url) || ''} onChange={e=> onUnifiedConfigPatch?.({ settings: { ...(unifiedConfig?.settings||{}), integrations: { ...(unifiedConfig?.settings?.integrations||{}), webhooks: [{ ...(unifiedConfig?.settings?.integrations?.webhooks?.[0]||{ name:'Lead', method:'POST', headers:{}, events:[], active:true, retryPolicy:{maxRetries:3, backoffMultiplier:2}}), url: e.target.value }] } } })} />
                                <span>UTM (source)</span>
                                <input className="border rounded px-2 py-1" placeholder="utm_source" value={unifiedConfig?.settings?.analytics?.utm?.source || ''} onChange={e=> onUnifiedConfigPatch?.({ settings: { ...(unifiedConfig?.settings||{}), analytics: { ...(unifiedConfig?.settings?.analytics||{}), utm: { ...(unifiedConfig?.settings?.analytics?.utm||{}), source: e.target.value } } } })} />
                                <span>UTM (medium)</span>
                                <input className="border rounded px-2 py-1" placeholder="utm_medium" value={unifiedConfig?.settings?.analytics?.utm?.medium || ''} onChange={e=> onUnifiedConfigPatch?.({ settings: { ...(unifiedConfig?.settings||{}), analytics: { ...(unifiedConfig?.settings?.analytics||{}), utm: { ...(unifiedConfig?.settings?.analytics?.utm||{}), medium: e.target.value } } } })} />
                                <span>UTM (campaign)</span>
                                <input className="border rounded px-2 py-1" placeholder="utm_campaign" value={unifiedConfig?.settings?.analytics?.utm?.campaign || ''} onChange={e=> onUnifiedConfigPatch?.({ settings: { ...(unifiedConfig?.settings||{}), analytics: { ...(unifiedConfig?.settings?.analytics||{}), utm: { ...(unifiedConfig?.settings?.analytics?.utm||{}), campaign: e.target.value } } } })} />
                            </div>
                            <div className="grid grid-cols-2 gap-3 items-start">
                                <div>
                                    <label className="block text-[11px]">SEO Title</label>
                                    <input className="w-full border rounded px-2 py-1" value={unifiedConfig?.settings?.seo?.title || ''} onChange={e=> onUnifiedConfigPatch?.({ settings: { ...(unifiedConfig?.settings||{}), seo: { ...(unifiedConfig?.settings?.seo||{}), title: e.target.value } } })} />
                                </div>
                                <div>
                                    <label className="block text-[11px]">SEO Description</label>
                                    <textarea className="w-full border rounded px-2 py-1 min-h-[60px]" value={unifiedConfig?.settings?.seo?.description || ''} onChange={e=> onUnifiedConfigPatch?.({ settings: { ...(unifiedConfig?.settings||{}), seo: { ...(unifiedConfig?.settings?.seo||{}), description: e.target.value } } })} />
                                </div>
                            </div>
                        </div>
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
