import { useEffect, useRef, useState } from 'react';

export type LiveSteps = Record<string, any>;

export function useFunnelLivePreview(funnelId?: string) {
    const [liveSteps, setLiveSteps] = useState<LiveSteps | null>(null);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        // Não conectar se não houver funnelId válido
        if (!funnelId || funnelId.startsWith('funnel-')) {
            // funnelId temporário (novo funil não salvo) - não usar WebSocket
            console.log('🚫 WebSocket: funnelId inválido ou temporário, não conectando:', funnelId);
            return;
        }

        console.log('🔌 Tentando conectar WebSocket para funnelId:', funnelId);
        const id = funnelId;
        const proto = location.protocol === 'https:' ? 'wss' : 'ws';
        // Em dev (Vite em 5173 + backend 3001), conectamos direto no backend para WS
        const isDev = typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.DEV;
        const host = isDev ? `${location.hostname}:3001` : location.host;
        const url = `${proto}://${host}/?funnelId=${encodeURIComponent(id)}`;
        try {
            const ws = new WebSocket(url);
            wsRef.current = ws;
            ws.onopen = () => {
                console.log('🔗 WebSocket conectado para funnelId:', id);
            };
            ws.onmessage = (ev) => {
                try {
                    const msg = JSON.parse(ev.data);
                    if (msg?.type === 'steps' && msg.steps) {
                        setLiveSteps(msg.steps);
                    }
                } catch {
                    // ignore
                }
            };
            ws.onerror = (err) => {
                console.error('❌ WebSocket erro para funnelId:', id, err);
            };
            ws.onclose = () => {
                console.log('🔌 WebSocket desconectado para funnelId:', id);
            };
        } catch (err) {
            console.error('❌ Falha ao criar WebSocket:', err);
        }
        return () => {
            try { wsRef.current?.close(); } catch { /* ignore */ }
            wsRef.current = null;
        };
    }, [funnelId]);

    const sendSteps = (steps: LiveSteps) => {
        try {
            wsRef.current?.send(JSON.stringify({ type: 'steps', steps }));
        } catch {
            // ignore
        }
    };

    return { liveSteps, sendSteps } as const;
}
