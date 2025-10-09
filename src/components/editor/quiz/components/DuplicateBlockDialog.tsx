import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export interface DuplicateBlockDialogProps {
    open: boolean;
    blockType?: string | null;
    steps: { id: string; type: string }[];
    targetStepId: string;
    onChangeTarget: (id: string) => void;
    onCancel: () => void;
    onConfirm: () => void;
    disabledConfirm?: boolean;
}

export const DuplicateBlockDialog: React.FC<DuplicateBlockDialogProps> = ({
    open,
    blockType,
    steps,
    targetStepId,
    onChangeTarget,
    onCancel,
    onConfirm,
    disabledConfirm
}) => {
    return (
        <Dialog open={open} onOpenChange={(o) => { if (!o) onCancel(); }}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Duplicar bloco em outra etapa</DialogTitle>
                    <DialogDescription>Selecione a etapa destino. O bloco será adicionado ao final da lista.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <p className="text-xs mb-1 text-muted-foreground">Bloco</p>
                        <p className="text-sm font-medium">{blockType}</p>
                    </div>
                    <div>
                        <label className="text-xs font-medium mb-1 block">Etapa destino</label>
                        <select className="w-full border rounded-md p-2 text-sm" value={targetStepId} onChange={(e) => onChangeTarget(e.target.value)}>
                            {steps.map(s => (<option key={s.id} value={s.id}>{s.id} ({s.type})</option>))}
                        </select>
                    </div>
                </div>
                <DialogFooter className="mt-4 flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={onCancel}>Cancelar</Button>
                    <Button size="sm" disabled={disabledConfirm} onClick={onConfirm}>Duplicar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DuplicateBlockDialog;
