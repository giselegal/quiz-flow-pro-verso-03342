/*
  Utilitários leves de performance para DEV
  - mark/measure baseados na Performance API
  - logger condicional por prefixo
*/

export const perfEnabled = () => process.env.NODE_ENV === 'development';

export function mark(name: string) {
  if (!perfEnabled() || typeof performance === 'undefined') return;
  try {
    performance.mark(name);
  } catch {}
}

export function measure(name: string, startMark?: string, endMark?: string) {
  if (!perfEnabled() || typeof performance === 'undefined') return;
  try {
    if (startMark && endMark) {
      performance.measure(name, startMark, endMark);
    } else if (startMark) {
      performance.measure(name, startMark);
    } else {
      performance.measure(name);
    }
  } catch {}
}

export function getMeasures(prefix?: string) {
  if (!perfEnabled() || typeof performance === 'undefined') return [] as PerformanceMeasure[];
  const entries = performance.getEntriesByType('measure') as PerformanceMeasure[];
  return prefix ? entries.filter(e => e.name.startsWith(prefix)) : entries;
}

export function clearMarksAndMeasures(prefix?: string) {
  if (!perfEnabled() || typeof performance === 'undefined') return;
  try {
    if (prefix) {
      performance.getEntriesByType('mark').forEach(e => {
        if (e.name.startsWith(prefix)) performance.clearMarks(e.name);
      });
      performance.getEntriesByType('measure').forEach(e => {
        if (e.name.startsWith(prefix)) performance.clearMeasures(e.name);
      });
    } else {
      performance.clearMarks();
      performance.clearMeasures();
    }
  } catch {}
}

export function logMeasures(prefix?: string) {
  if (!perfEnabled()) return;
  const ms = getMeasures(prefix);
  if (!ms.length) return;
  // eslint-disable-next-line no-console
  console.table(
    ms.map(m => ({ name: m.name, duration: Math.round(m.duration), detail: m.detail || '' }))
  );
}
