import React, { useEffect, useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getQuizEvents, getQuizMetrics, clearQuizEvents, flushQuizEvents, flushQuizEventsWithRetry } from '@/utils/quizAnalytics';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface FilterState {
    sessionId: string;
    from: string;
    to: string;
}

const fmt = (n: number) => Number.isFinite(n) ? n : 0;

const QuizAnalyticsDashboard: React.FC = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [filter, setFilter] = useState<FilterState>({ sessionId: '', from: '', to: '' });
    const [flushUrl, setFlushUrl] = useState('');
    const [isFlushing, setIsFlushing] = useState(false);
    const [useRetryFlush, setUseRetryFlush] = useState(true);
    const [flushLog, setFlushLog] = useState<string[]>([]);
    const [lastFlushResult, setLastFlushResult] = useState<{ flushed: number; batches?: number } | null>(null);
    const appendLog = (line: string) => setFlushLog(l => [...l.slice(-200), `[${new Date().toLocaleTimeString()}] ${line}`]);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [refreshInterval, setRefreshInterval] = useState(15000); // default 15s
    const [lastAutoRefresh, setLastAutoRefresh] = useState<number | null>(null);

    const load = () => setEvents(getQuizEvents());
    useEffect(() => { load(); }, []);

    // Auto refresh effect
    useEffect(() => {
        if (!autoRefresh) return;
        const id = setInterval(() => {
            load();
            setLastAutoRefresh(Date.now());
        }, refreshInterval);
        return () => clearInterval(id);
    }, [autoRefresh, refreshInterval]);

    const metrics = useMemo(() => getQuizMetrics({
        sessionId: filter.sessionId || undefined,
        fromTs: filter.from || undefined,
        toTs: filter.to || undefined
    }), [events, filter]);

    const sessions = useMemo(() => Array.from(new Set(events.map(e => e.sessionId))), [events]);

    const filteredEvents = useMemo(() => {
        return events.filter(e => {
            if (filter.sessionId && e.sessionId !== filter.sessionId) return false;
            if (filter.from && e.ts < filter.from) return false;
            if (filter.to && e.ts > filter.to) return false;
            return true;
        });
    }, [events, filter]);

    // Série temporal agregada simples: contar eventos por minuto (step_view) para mini gráfico
    const timeSeries = useMemo(() => {
        const buckets: Record<string, number> = {};
        filteredEvents.filter(e => e.type === 'step_view').forEach(e => {
            const minute = e.ts.slice(0, 16); // YYYY-MM-DDTHH:MM
            buckets[minute] = (buckets[minute] || 0) + 1;
        });
        return Object.entries(buckets).sort((a, b) => a[0].localeCompare(b[0])).map(([t, c]) => ({ time: t.slice(11), views: c }));
    }, [filteredEvents]);

    const exportCsv = () => {
        const rows = filteredEvents.map(e => ({ ...e }));
        if (!rows.length) return;
        const headers = Object.keys(rows[0]);
        const csv = [headers.join(',')].concat(rows.map(r => headers.map(h => JSON.stringify(r[h] ?? '')).join(','))).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'quiz-events.csv'; a.click(); URL.revokeObjectURL(url);
    };

    return (
        <div className="p-6 space-y-6">
            <header>
                <h1 className="text-xl font-semibold">Quiz Analytics Dashboard</h1>
                <p className="text-xs text-muted-foreground">Eventos locais armazenados em localStorage (buffer limitado a 500).</p>
            </header>
            <section className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div className="p-3 border rounded bg-muted/30"><div className="text-[11px] uppercase">Steps</div><div className="font-bold">{metrics.totalSteps}</div></div>
                <div className="p-3 border rounded bg-muted/30"><div className="text-[11px] uppercase">Resultados</div><div className="font-bold">{metrics.totalResultComputes}</div></div>
                <div className="p-3 border rounded bg-muted/30"><div className="text-[11px] uppercase">Ofertas</div><div className="font-bold">{metrics.totalOffers}</div></div>
                <div className="p-3 border rounded bg-muted/30"><div className="text-[11px] uppercase">CTA Clicks</div><div className="font-bold">{metrics.totalCtaClicks}</div></div>
                <div className="p-3 border rounded bg-muted/30"><div className="text-[11px] uppercase">Sessões</div><div className="font-bold">{metrics.distinctSessions}</div></div>
                <div className="p-3 border rounded bg-muted/30 col-span-2 md:col-span-1"><div className="text-[11px] uppercase">Usuários</div><div className="font-bold">{metrics.distinctUsers}</div></div>
                <div className="p-3 border rounded bg-muted/30"><div className="text-[11px] uppercase">Ans/Resultado</div><div className="font-bold">{fmt(metrics.avgAnswersPerResult)}</div></div>
                <div className="p-3 border rounded bg-muted/30"><div className="text-[11px] uppercase">Offer/Result</div><div className="font-bold">{fmt(metrics.conversionRateOfferPerResult)}</div></div>
                <div className="p-3 border rounded bg-muted/30"><div className="text-[11px] uppercase">CTA/Offer</div><div className="font-bold">{fmt(metrics.ctaClickThroughPerOffer)}</div></div>
            </section>
            <section className="space-y-4 text-xs">
                <h2 className="text-sm font-semibold">Filtros</h2>
                <div className="flex flex-col md:flex-row gap-2 items-start md:items-end">
                    <div>
                        <label className="block text-[10px] mb-1">Sessão</label>
                        <select className="border rounded px-2 py-1" value={filter.sessionId} onChange={e => setFilter(f => ({ ...f, sessionId: e.target.value }))}>
                            <option value="">(todas)</option>
                            {sessions.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] mb-1">De (ISO)</label>
                        <input className="border rounded px-2 py-1" value={filter.from} onChange={e => setFilter(f => ({ ...f, from: e.target.value }))} placeholder="2025-10-02T00:00:00Z" />
                    </div>
                    <div>
                        <label className="block text-[10px] mb-1">Até (ISO)</label>
                        <input className="border rounded px-2 py-1" value={filter.to} onChange={e => setFilter(f => ({ ...f, to: e.target.value }))} placeholder="2025-10-02T23:59:59Z" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="block text-[10px] mb-1">Auto Refresh</label>
                        <div className="flex items-center gap-2">
                            <Button type="button" size="sm" variant={autoRefresh ? 'default' : 'outline'} onClick={() => setAutoRefresh(v => !v)}>{autoRefresh ? 'Ativo' : 'Inativo'}</Button>
                            <select
                                className="border rounded px-2 py-1 text-[11px]"
                                value={refreshInterval}
                                onChange={e => setRefreshInterval(Number(e.target.value))}
                                disabled={!autoRefresh}
                            >
                                <option value={5000}>5s</option>
                                <option value={10000}>10s</option>
                                <option value={15000}>15s</option>
                                <option value={30000}>30s</option>
                                <option value={60000}>60s</option>
                            </select>
                        </div>
                        {autoRefresh && (
                            <span className="text-[10px] text-muted-foreground">
                                Última: {lastAutoRefresh ? new Date(lastAutoRefresh).toLocaleTimeString() : '---'}
                            </span>
                        )}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setFilter({ sessionId: '', from: '', to: '' })}>Limpar</Button>
                    <Button variant="secondary" size="sm" onClick={load}>Recarregar</Button>
                </div>
            </section>
            <Separator />
            <section className="space-y-4 text-xs">
                <h2 className="text-sm font-semibold">Flush</h2>
                <div className="flex flex-col md:flex-row gap-2 items-start md:items-end">
                    <input className="border rounded px-2 py-1 text-xs flex-1" placeholder="https://api.seuservico.com/quiz-events" value={flushUrl} onChange={e => setFlushUrl(e.target.value)} />
                    <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1 text-[10px] cursor-pointer select-none">
                            <input type="checkbox" className="scale-75" checked={useRetryFlush} onChange={e => setUseRetryFlush(e.target.checked)} /> Retry/Backoff
                        </label>
                        <Button size="sm" disabled={!flushUrl || isFlushing} onClick={async () => {
                            setIsFlushing(true); setFlushLog([]); setLastFlushResult(null);
                            try {
                                if (useRetryFlush) {
                                    const controller = new AbortController();
                                    const res = await flushQuizEventsWithRetry({
                                        endpoint: flushUrl,
                                        batchSize: 100,
                                        maxRetries: 3,
                                        backoffBaseMs: 500,
                                        onProgress: info => {
                                            appendLog(`Batch ${info.batchIndex + 1}/${info.batchTotal} tentativa ${info.attempt} => ${info.success ? 'OK' : 'FAIL'}`);
                                        }
                                    });
                                    setLastFlushResult(res);
                                    appendLog(`Concluído. Eventos enviados: ${res.flushed}`);
                                } else {
                                    const res = await flushQuizEvents({ endpoint: flushUrl, batchSize: 100 });
                                    setLastFlushResult(res as any);
                                    appendLog(`Flush simples concluído. Eventos enviados: ${res.flushed}`);
                                }
                                load();
                            } catch (err: any) {
                                appendLog('Erro: ' + (err?.message || String(err)));
                            } finally { setIsFlushing(false); }
                        }}>{isFlushing ? 'Enviando...' : 'Flush'}</Button>
                    </div>
                    <Button size="sm" variant="destructive" onClick={() => { clearQuizEvents(); load(); }}>Limpar Eventos</Button>
                </div>
                {(lastFlushResult || flushLog.length) && (
                    <div className="w-full border rounded bg-muted/20 p-2 space-y-1 max-h-40 overflow-auto">
                        {lastFlushResult && (
                            <div className="text-[11px] text-foreground/90 font-medium">
                                Resultado: {lastFlushResult.flushed} eventos enviados{lastFlushResult.batches !== undefined ? ` | Batches: ${lastFlushResult.batches}` : ''}
                            </div>
                        )}
                        {flushLog.map((l, i) => <div key={i} className="text-[10px] font-mono leading-tight">{l}</div>)}
                    </div>
                )}
            </section>
            <Separator />
            <section className="space-y-6">
                <h2 className="text-sm font-semibold">Eventos ({filteredEvents.length})</h2>
                <div className="h-48 border rounded bg-muted/30 p-2">
                    {timeSeries.length ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={timeSeries} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-primary, hsl(var(--primary)))" stopOpacity={0.6} />
                                        <stop offset="95%" stopColor="var(--color-primary, hsl(var(--primary)))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                                <Tooltip contentStyle={{ fontSize: 10 }} />
                                <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorViews)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : <div className="text-[11px] text-muted-foreground flex items-center justify-center h-full">Sem dados de step_view para gráfico.</div>}
                </div>
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" disabled={!filteredEvents.length} onClick={exportCsv}>Export CSV</Button>
                </div>
                <div className="border rounded max-h-[400px] overflow-auto divide-y bg-muted/10">
                    {filteredEvents.slice().reverse().map((e, i) => (
                        <div key={i} className="p-2 flex flex-col gap-1 text-[11px]">
                            <div className="flex justify-between">
                                <span className="font-medium">{e.type}</span>
                                <span className="text-muted-foreground">{e.ts}</span>
                            </div>
                            <pre className="whitespace-pre-wrap leading-tight text-[10px] opacity-80">{JSON.stringify(e, null, 2)}</pre>
                        </div>
                    ))}
                    {!filteredEvents.length && <div className="p-4 text-[11px] text-muted-foreground">Nenhum evento.</div>}
                </div>
            </section>
        </div>
    );
};

export default QuizAnalyticsDashboard;
