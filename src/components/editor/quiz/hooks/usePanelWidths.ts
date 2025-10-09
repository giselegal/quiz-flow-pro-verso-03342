import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface PanelWidths { steps: number; library: number; props: number }
interface UsePanelWidthsOptions { min?: number; max?: number; storageKey?: string }

export function usePanelWidths(options: UsePanelWidthsOptions = {}) {
    const { min = 220, max = 420, storageKey = 'quizEditor.panelWidths' } = options;
    const [panelWidths, setPanelWidths] = useState<PanelWidths>(() => {
        if (typeof window !== 'undefined') {
            try { const saved = localStorage.getItem(storageKey); if (saved) return JSON.parse(saved); } catch { /* ignore */ }
        }
        return { steps: 288, library: 288, props: 288 };
    });

    const save = (next: PanelWidths) => {
        setPanelWidths(next);
        try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* ignore */ }
    };

    const resizingRef = useRef<null | { panel: keyof PanelWidths; startX: number; startWidth: number }>(null);

    const onMouseMove = useCallback((e: MouseEvent) => {
        const ctx = resizingRef.current; if (!ctx) return;
        const delta = e.clientX - ctx.startX;
        let raw = ctx.startWidth + (ctx.panel === 'props' ? -delta : delta);
        raw = Math.max(min, Math.min(max, raw));
        save({ ...panelWidths, [ctx.panel]: raw });
    }, [panelWidths, min, max]);

    const stopResize = useCallback(() => { resizingRef.current = null; document.body.style.userSelect = ''; }, []);

    useEffect(() => {
        const move = (e: MouseEvent) => onMouseMove(e);
        const up = () => stopResize();
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', up);
        return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
    }, [onMouseMove, stopResize]);

    const startResize = (panel: keyof PanelWidths, e: React.MouseEvent) => {
        e.preventDefault();
        resizingRef.current = { panel, startX: e.clientX, startWidth: panelWidths[panel] };
        document.body.style.userSelect = 'none';
    };

    const Resizer = ({ panel, side }: { panel: keyof PanelWidths; side: 'right' | 'left' }) => (
        <div
      onMouseDown= {(e) => startResize(panel, e)
}
className = { cn('resize-handle group w-1 cursor-col-resize relative z-10', 'after:absolute after:inset-0 after:bg-transparent hover:after:bg-blue-300/30') }
style = {{ width: 6, marginLeft: side === 'right' ? -3 : 0, marginRight: side === 'left' ? -3 : 0, cursor: 'col-resize' }}
    />
  );

return { panelWidths, Resizer };
}
