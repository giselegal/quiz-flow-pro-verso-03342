import React from 'react';
import { OperationStatus } from '@/hooks/editor/useOperationsManager';

interface OperationsPanelProps {
  statuses: Record<string, OperationStatus>;
  onClose?: () => void;
}

export const OperationsPanel: React.FC<OperationsPanelProps> = ({ statuses, onClose }) => {
  const items = Object.values(statuses).sort((a,b) => (b.startedAt || 0) - (a.startedAt || 0));
  return (
    <div className="p-3 w-80 bg-background border-l border-border h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">Operações</h3>
        {onClose && <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground">Fechar</button>}
      </div>
      <div className="flex-1 overflow-auto space-y-2 text-xs">
        {items.length === 0 && <div className="text-muted-foreground">Nenhuma operação ainda</div>}
        {items.map(op => {
          const duration = op.finishedAt && op.startedAt ? Math.round(op.finishedAt - op.startedAt) : null;
          return (
            <div key={op.key} className="border rounded-md p-2 bg-muted/30">
              <div className="flex items-center justify-between">
                <span className="font-medium">{op.key}</span>
                <span className="text-[10px] uppercase tracking-wide {op.running ? 'text-primary' : 'text-muted-foreground'}">
                  {op.running ? 'RUNNING' : (op.error ? 'ERROR' : 'DONE')}
                </span>
              </div>
              {op.progress && (
                <div className="mt-1 flex items-center justify-between">
                  <div className="flex-1 bg-muted h-1.5 rounded overflow-hidden mr-2">
                    <div className="h-full bg-primary transition-all" style={{ width: `${op.progress.value}%` }} />
                  </div>
                  <span>{op.progress.value}%</span>
                </div>
              )}
              <div className="mt-1 space-y-0.5">
                {op.progress?.label && <div className="text-muted-foreground">{op.progress.label}</div>}
                {duration !== null && <div className="text-muted-foreground">{duration}ms</div>}
                {op.error && <div className="text-red-500">{op.error.message}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OperationsPanel;
