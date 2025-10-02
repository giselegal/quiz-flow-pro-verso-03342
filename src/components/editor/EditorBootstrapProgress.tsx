import * as React from 'react';
import * as Progress from '@radix-ui/react-progress';

interface EditorBootstrapProgressProps {
  step: number;
  total: number;
  label: string;
  phase: string;
  className?: string;
}

export const EditorBootstrapProgress: React.FC<EditorBootstrapProgressProps> = ({ step, total, label, phase, className }) => {
  const value = Math.min(100, Math.round((step / total) * 100));
  return (
    <div className={"w-full max-w-md mx-auto flex flex-col items-center gap-3 " + (className || '')}>
      <div className="text-sm font-medium text-foreground">Inicializando Editor</div>
      <Progress.Root className="relative overflow-hidden bg-muted rounded-full w-full h-3" value={value}>
        <Progress.Indicator
          className="h-full w-full flex-1 bg-primary transition-transform duration-300"
          style={{ transform: `translateX(-${100 - value}%)` }}
        />
      </Progress.Root>
      <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
        <span>{label}</span>
        <span>{value}% ({step}/{total})</span>
      </div>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground/70">fase: {phase}</div>
    </div>
  );
};

export default EditorBootstrapProgress;
