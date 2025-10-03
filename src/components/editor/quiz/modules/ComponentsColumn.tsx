import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, ListTree, Plus, Trash2 } from 'lucide-react';
import type { EditableQuizStep } from '../QuizFunnelEditor';

const STEP_TYPES: Array<string> = [
    'intro', 'question', 'strategic-question', 'transition', 'transition-result', 'result', 'offer'
];

interface ComponentsColumnProps {
    steps: EditableQuizStep[];
    selectedStep: EditableQuizStep | undefined;
    onUpdateStep: (id: string, patch: Partial<EditableQuizStep>) => void;
    onSave: () => void;
    onReset: () => void;
    isSaving: boolean;
}

const ComponentsColumn: React.FC<ComponentsColumnProps> = ({
    steps,
    selectedStep,
    onUpdateStep,
    onSave,
    onReset,
    isSaving
}) => {
    return (
        <div className="w-72 border-r flex flex-col">
            <div className="p-3 border-b flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-1">
                    <ListTree className="w-3 h-3" /> Componentes
                </span>
                <Badge variant="secondary" className="text-[10px]">{steps.length}</Badge>
            </div>
            
            <div className="flex-1 overflow-auto p-3 text-xs space-y-4">
                {selectedStep && (
                    <div className="space-y-2">
                        <label className="block text-[10px] uppercase tracking-wide text-muted-foreground">
                            Tipo da Etapa
                        </label>
                        <select 
                            className="w-full border rounded px-2 py-1 text-xs" 
                            value={selectedStep.type} 
                            onChange={e => onUpdateStep(selectedStep.id, { type: e.target.value as any })}
                        >
                            {STEP_TYPES.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                        
                        {selectedStep.type === 'question' && (
                            <div className="pt-2 border-t space-y-2">
                                <div className="flex items-center justify-between text-[10px] font-medium">
                                    <span>Opções</span>
                                    <Button 
                                        size="sm" 
                                        variant="ghost" 
                                        onClick={() => onUpdateStep(selectedStep.id, { 
                                            options: [...(selectedStep.options || []), { 
                                                id: `opt-${Date.now()}`, 
                                                text: 'Nova opção' 
                                            }] 
                                        })}
                                    >
                                        + Add
                                    </Button>
                                </div>
                                <div className="space-y-1">
                                    {(selectedStep.options || []).map((opt, oi) => (
                                        <div key={opt.id} className="flex items-center gap-1">
                                            <input 
                                                className="flex-1 border rounded px-1 py-0.5 text-[11px]" 
                                                value={opt.text} 
                                                onChange={(e) => {
                                                    const clone = [...(selectedStep.options || [])];
                                                    clone[oi] = { ...clone[oi], text: e.target.value };
                                                    onUpdateStep(selectedStep.id, { options: clone });
                                                }} 
                                            />
                                            <Button 
                                                size="icon" 
                                                variant="ghost" 
                                                className="h-5 w-5" 
                                                onClick={() => {
                                                    const clone = (selectedStep.options || []).filter((_, i) => i !== oi);
                                                    onUpdateStep(selectedStep.id, { options: clone });
                                                }}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            
                {/* Inventário de componentes por tipo de etapa */}
                <div className="pt-2 border-t space-y-2">
                    <div className="text-[10px] font-semibold uppercase tracking-wide">Inventário</div>
                    {(() => {
                        const groups: Record<string, number> = {};
                        steps.forEach(s => { 
                            groups[s.type] = (groups[s.type] || 0) + 1; 
                        });
                        const entries = Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
                        
                        return entries.map(([type, count]) => (
                            <div key={type} className="flex items-center justify-between bg-muted/40 rounded px-2 py-1">
                                <button 
                                    type="button" 
                                    className={`text-left text-[11px] font-medium hover:underline ${
                                        selectedStep?.type === type ? 'text-primary' : ''
                                    }`} 
                                    onClick={() => {
                                        const firstOfType = steps.find(s => s.type === type); 
                                        if (firstOfType) {
                                            // Esta função precisa ser passada como prop ou usar callback do parent
                                            // onSelectStep(firstOfType.id);
                                        }
                                    }}
                                >
                                    {type}
                                </button>
                                <span 
                                    className="text-[10px] bg-background/60 px-1 rounded border" 
                                    title="Quantidade deste tipo"
                                >
                                    {count}
                                </span>
                            </div>
                        ));
                    })()}
                </div>
            </div>
            
            <div className="p-2 border-t flex gap-2">
                <Button 
                    size="sm" 
                    className="flex-1" 
                    onClick={onSave} 
                    disabled={isSaving}
                >
                    {isSaving ? 'Salvando...' : 'Salvar'}
                </Button>
                <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={onReset}
                >
                    <RefreshCw className="w-4 h-4 mr-1" /> Reset
                </Button>
            </div>
        </div>
    );
};

export default ComponentsColumn;