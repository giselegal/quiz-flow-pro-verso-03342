import React, { useEffect, useState } from 'react';
import { templateService } from '@/services/canonical/TemplateService';
import type { Block } from '@/services/UnifiedTemplateRegistry';

export type CanvasColumnProps = {
    currentStepKey: string | null;
    blocks?: Block[] | null;
};

export default function CanvasColumn({ currentStepKey, blocks: blocksFromProps }: CanvasColumnProps) {
    const [blocks, setBlocks] = useState<Block[] | null>(blocksFromProps ?? null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            // Se blocos forem fornecidos via props, priorizar essa fonte e não carregar do serviço
            if (blocksFromProps) {
                setBlocks(blocksFromProps);
                setLoading(false);
                setError(null);
                return;
            }
            if (!currentStepKey) {
                setBlocks(null);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const res = await templateService.getStep(currentStepKey);
                if (!cancelled) {
                    if (res.success) setBlocks(res.data);
                    else {
                        setBlocks([]);
                        setError(res.error.message);
                    }
                }
            } catch (err: any) {
                if (!cancelled) {
                    setBlocks([]);
                    setError(err?.message || 'Erro ao carregar blocos');
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => { cancelled = true; };
    }, [currentStepKey, blocksFromProps]);

    if (!currentStepKey) {
        return (
            <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-sm">Selecione uma etapa</div>
            </div>
        );
    }

    if (!blocksFromProps && loading) {
        return <div className="p-3 text-sm">Carregando blocos de {currentStepKey}…</div>;
    }

    if (error) {
        return <div className="p-3 text-sm text-red-500">Erro: {error}</div>;
    }

    if (!blocks || blocks.length === 0) {
        return <div className="p-3 text-sm">Nenhum bloco nesta etapa.</div>;
    }

    return (
        <div className="p-3 space-y-2">
            <div className="text-sm font-medium mb-2">{currentStepKey}</div>
            <ul className="space-y-1">
                {blocks.map((b) => (
                    <li key={b.id} className="border rounded p-2">
                        <div className="text-xs uppercase text-muted-foreground">{b.type}</div>
                        {/* Placeholder de preview simples */}
                        <pre className="text-[10px] whitespace-pre-wrap break-all opacity-70">{JSON.stringify(b.properties || b.content || {}, null, 2)}</pre>
                    </li>
                ))}
            </ul>
        </div>
    );
}
