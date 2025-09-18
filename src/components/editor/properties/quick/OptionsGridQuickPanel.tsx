import type { Block } from '@/types/editor';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

type BatchUpdateFn = (updates: Record<string, any>) => void;

interface OptionsGridQuickPanelProps {
    block: Block;
    onBatchUpdate: BatchUpdateFn;
}

/**
 * Fase 1: Quick wins para o painel de propriedades de options-grid
 * - Seções enxutas: Layout, Seleção/Validação, Auto-avanço, Pontuação, Aparência
 * - Presets de 1 clique
 */
export default function OptionsGridQuickPanel({ block, onBatchUpdate }: OptionsGridQuickPanelProps) {
    const props = block.properties || {};
    const options = block.content?.options || [];

    // Helpers de presets
    const applyExact3Preset = () => {
        onBatchUpdate({
            requiredSelections: 3,
            minSelections: 3,
            maxSelections: 3,
            multipleSelection: true,
            enableButtonOnlyWhenValid: true,
            showValidationFeedback: true,
            showSelectionCount: true,
            validationMessage: 'Selecione 3 opções para continuar',
            progressMessage: 'Você selecionou {count} de {required} opções',
        });
    };

    const applyDelayPreset = (ms: number) => {
        onBatchUpdate({
            autoAdvanceOnComplete: true,
            autoAdvanceDelay: ms,
        });
    };

    const applyDefaultScoring = () => {
        const scoreValues: Record<string, number> = {};
        (options as any[]).forEach(opt => {
            if (opt?.id) scoreValues[opt.id] = 1;
        });
        onBatchUpdate({ scoreValues });
    };

    return (
        <div className="space-y-4">
            {/* Status compacto */}
            <div className="rounded-md border bg-muted/30 p-3 text-xs">
                <div className="flex flex-wrap items-center gap-3">
                    <div><span className="font-medium">Pergunta:</span> {props.questionId || block.id}</div>
                    <Separator orientation="vertical" className="h-4" />
                    <div><span className="font-medium">Opções:</span> {Array.isArray(options) ? options.length : 0}</div>
                    <Separator orientation="vertical" className="h-4" />
                    <div>
                        <span className="font-medium">Seleção:</span>{' '}
                        {props.minSelections || props.requiredSelections || 0}
                        {props.requiredSelections ? ' / ' + props.requiredSelections : ''}
                        {props.maxSelections ? ' / ' + props.maxSelections : ''}
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div>
                        <span className="font-medium">Auto-avanço:</span>{' '}
                        {props.autoAdvanceOnComplete ? `${props.autoAdvanceDelay || 1500}ms` : 'Desligado'}
                    </div>
                </div>
            </div>

            {/* Layout */}
            <Card>
                <CardContent className="space-y-3 pt-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">Layout</h4>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => onBatchUpdate({ columns: 1, responsiveColumns: false })}>1 coluna</Button>
                            <Button variant="outline" size="sm" onClick={() => onBatchUpdate({ columns: 2, responsiveColumns: true })}>2 colunas</Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label>Mostrar imagens</Label>
                            <div className="flex items-center gap-2">
                                <Switch checked={!!props.showImages} onCheckedChange={(v) => onBatchUpdate({ showImages: v })} />
                                <span className="text-xs text-muted-foreground">Exibe miniaturas nas opções</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Estilo de seleção</Label>
                            <Select value={props.selectionStyle || 'border'} onValueChange={(v) => onBatchUpdate({ selectionStyle: v })}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Selecione" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="border">Borda</SelectItem>
                                    <SelectItem value="background">Fundo</SelectItem>
                                    <SelectItem value="glow">Glow</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Seleção e Validação */}
            <Card>
                <CardContent className="space-y-3 pt-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">Seleção e Validação</h4>
                        <Button variant="outline" size="sm" onClick={applyExact3Preset}>Exatamente 3</Button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                            <Label htmlFor="minSel" className="text-xs">Mín.</Label>
                            <Input id="minSel" type="number" className="h-8 text-xs" value={props.minSelections ?? props.requiredSelections ?? 3}
                                onChange={(e) => onBatchUpdate({ minSelections: parseInt(e.target.value) || 0 })} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="reqSel" className="text-xs">Obrigatórias</Label>
                            <Input id="reqSel" type="number" className="h-8 text-xs" value={props.requiredSelections ?? 3}
                                onChange={(e) => onBatchUpdate({ requiredSelections: parseInt(e.target.value) || 0 })} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="maxSel" className="text-xs">Máx.</Label>
                            <Input id="maxSel" type="number" className="h-8 text-xs" value={props.maxSelections ?? 3}
                                onChange={(e) => onBatchUpdate({ maxSelections: parseInt(e.target.value) || 0 })} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch checked={props.multipleSelection ?? true} onCheckedChange={(v) => onBatchUpdate({ multipleSelection: v })} />
                        <span className="text-xs">Permitir seleção múltipla</span>
                    </div>
                </CardContent>
            </Card>

            {/* Auto-avanço */}
            <Card>
                <CardContent className="space-y-3 pt-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">Auto‑avanço</h4>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => applyDelayPreset(250)}>250ms</Button>
                            <Button variant="outline" size="sm" onClick={() => applyDelayPreset(800)}>800ms</Button>
                            <Button variant="outline" size="sm" onClick={() => applyDelayPreset(1500)}>1500ms</Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-2 col-span-1">
                            <Label>Ativar</Label>
                            <div className="flex items-center gap-2">
                                <Switch checked={!!props.autoAdvanceOnComplete} onCheckedChange={(v) => onBatchUpdate({ autoAdvanceOnComplete: v })} />
                                <span className="text-xs text-muted-foreground">Avança ao completar</span>
                            </div>
                        </div>
                        <div className="space-y-1 col-span-2">
                            <Label htmlFor="delay" className="text-xs">Delay (ms)</Label>
                            <Input id="delay" type="number" className="h-8 text-xs" value={props.autoAdvanceDelay ?? 1500}
                                onChange={(e) => onBatchUpdate({ autoAdvanceDelay: parseInt(e.target.value) || 0 })} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Pontuação */}
            <Card>
                <CardContent className="space-y-3 pt-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">Pontuação</h4>
                        <Button variant="outline" size="sm" onClick={applyDefaultScoring}>Padrão (1 ponto)</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Aplica 1 ponto para cada opção atual usando suas chaves de ID.
                    </p>
                </CardContent>
            </Card>

            {/* Aparência (básico) */}
            <Card>
                <CardContent className="space-y-3 pt-4">
                    <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                            <Label className="text-xs">Gap (px)</Label>
                            <Input type="number" className="h-8 text-xs" value={props.gridGap ?? 12}
                                onChange={(e) => onBatchUpdate({ gridGap: parseInt(e.target.value) || 0 })} />
                        </div>
                        <div className="space-y-2 col-span-2">
                            <Label className="text-xs">Colunas responsivas</Label>
                            <div className="flex items-center gap-2">
                                <Switch checked={props.responsiveColumns ?? false} onCheckedChange={(v) => onBatchUpdate({ responsiveColumns: v })} />
                                <span className="text-xs text-muted-foreground">Ajusta colunas no mobile</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
