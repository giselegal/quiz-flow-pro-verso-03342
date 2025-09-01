type EventPayload = Record<string, any> & { ts?: number };

export function track(event: string, payload: EventPayload = {}) {
    try {
        const entry = { event, ts: Date.now(), ...payload };
        (window as any).__EDITOR_TELEMETRY__ = (window as any).__EDITOR_TELEMETRY__ || [];
        (window as any).__EDITOR_TELEMETRY__.push(entry);
        if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.log(`[telemetry] ${event}`, entry);
        }
    } catch { /* no-op */ }
}

export default { track };
