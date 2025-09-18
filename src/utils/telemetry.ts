// Wrapper seguro para telemetria (ex.: lovable)
// - Desabilita via REACT_APP_DISABLE_TELEMETRY=true
// - Captura erros e sempre resolve para evitar "uncaught (in promise)"
const DISABLE_TELEMETRY = process.env.REACT_APP_DISABLE_TELEMETRY === 'true';
let client: any = null;

export function initTelemetry(rawClient?: any) {
  if (DISABLE_TELEMETRY) {
    client = null;
    return;
  }
  try {
    client = rawClient ?? (window as any).__lovableClient ?? null;
  } catch (err) {
    // não propagar
    // eslint-disable-next-line no-console
    console.warn('telemetry init failed (ignored):', err);
    client = null;
  }
}

export async function capture(eventName: string, payload?: any) {
  if (DISABLE_TELEMETRY || !client) return { ok: false, disabled: true };
  try {
    if (typeof client.capture === 'function') {
      await Promise.resolve(client.capture(eventName, payload));
    } else if (typeof client.send === 'function') {
      await Promise.resolve(client.send(eventName, payload));
    } else {
      // fallback: no-op
      await Promise.resolve();
    }
    return { ok: true };
  } catch (err) {
    // não propagar erro para a aplicação
    // eslint-disable-next-line no-console
    console.debug('telemetry capture error (ignored):', err);
    return { ok: false, error: String(err) };
  }
}

export default { initTelemetry, capture };
