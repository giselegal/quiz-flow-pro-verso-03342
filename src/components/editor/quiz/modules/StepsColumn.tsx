import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, Copy, Trash2, Plus } from 'lucide-react';
import type { EditableQuizStep } from '../QuizFunnelEditor';

interface StepsColumnProps {
    steps: EditableQuizStep[];
    selectedId: string;
    reachableInfo: {
        reachable: Set<string>;
        orphans: Set<string>;
    };
    onSelectStep: (id: string) => void;
    onMoveStep: (id: string, direction: -1 | 1) => void;
    onDuplicateStep: (id: string) => void;
    onRemoveStep: (id: string) => void;
    onAddStep: (afterId?: string, type?: string) => void;
    getNextStepStatus: (step: EditableQuizStep, index: number) => 'ok' | 'missing' | 'invalid';
}

const StepsColumn: React.FC<StepsColumnProps> = ({
    steps,
    selectedId,
    reachableInfo,
    onSelectStep,
    onMoveStep,
    onDuplicateStep,
    onRemoveStep,
    onAddStep,
    getNextStepStatus
}) => {
    const isOrphan = (id: string) => reachableInfo.orphans.has(id);

    return (
        <div className="w-60 border-r flex flex-col">
            <div className="p-3 flex items-center justify-between border-b">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold">Etapas</span>
                    {reachableInfo.orphans.size > 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-pink-600 text-white" title="Existem etapas que não são alcançadas a partir da primeira.">
                            {reachableInfo.orphans.size} órfã(s)
                        </span>
                    )}
                </div>
                <Badge variant="secondary" className="text-[10px]">{steps.length}</Badge>
            </div>
            
            <div className="flex-1 overflow-auto text-xs">
                {steps.map((s, idx) => {
                    const active = s.id === selectedId;
                    const nStatus = getNextStepStatus(s, idx);
                    const statusColor = nStatus === 'ok' ? 'bg-emerald-500' : nStatus === 'missing' ? 'bg-amber-500' : 'bg-red-500';
                    const statusTitle = nStatus === 'ok' ? 'Fluxo OK' : nStatus === 'missing' ? 'nextStep ausente (pode impedir fluxo)' : 'nextStep inválido (ID não encontrado)';
                    const orphan = isOrphan(s.id);
                    
                    return (
                        <div 
                            key={s.id} 
                            className={`px-3 py-2 border-b cursor-pointer group ${active ? 'bg-primary/10' : 'hover:bg-muted/50'}`} 
                            onClick={() => onSelectStep(s.id)}
                        >
                            <div className="flex items-center gap-2">
                                <span className="font-medium truncate">{idx + 1}. {s.type}</span>
                                <span className={`w-2 h-2 rounded-full ${statusColor}`} title={statusTitle} />
                                {orphan && (
                                    <span className="text-[9px] px-1 py-0.5 rounded bg-pink-600 text-white" title="Step não alcançável a partir da origem">
                                        ÓRFÃO
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition">
                                <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-5 w-5" 
                                    disabled={idx === 0} 
                                    onClick={(e) => { e.stopPropagation(); onMoveStep(s.id, -1); }}
                                >
                                    <ArrowUp className="w-3 h-3" />
                                </Button>
                                <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-5 w-5" 
                                    disabled={idx === steps.length - 1} 
                                    onClick={(e) => { e.stopPropagation(); onMoveStep(s.id, 1); }}
                                >
                                    <ArrowDown className="w-3 h-3" />
                                </Button>
                                <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-5 w-5" 
                                    onClick={(e) => { e.stopPropagation(); onDuplicateStep(s.id); }}
                                >
                                    <Copy className="w-3 h-3" />
                                </Button>
                                <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-5 w-5 text-red-500" 
                                    onClick={(e) => { e.stopPropagation(); onRemoveStep(s.id); }}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="p-2 border-t space-y-2">
                <Button 
                    size="sm" 
                    variant="secondary" 
                    className="w-full" 
                    onClick={() => onAddStep(selectedId, 'question')}
                >
                    <Plus className="w-4 h-4 mr-1" /> Nova Pergunta
                </Button>
                <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => onAddStep(selectedId, 'strategic-question')}
                >
                    + Estratégica
                </Button>
                <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => onAddStep(selectedId, 'transition')}
                >
                    + Transição
                </Button>
            </div>
        </div>
    );
};

export default StepsColumn;