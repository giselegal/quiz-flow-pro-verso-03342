// Robust matchMedia polyfill for test environments (happy-dom/jsdom)
// - Supports min/max-width and min/max-height evaluation
// - Implements addListener/removeListener (deprecated) and addEventListener/removeEventListener('change')
// - Reacts to window resize and dispatches 'change' when matches toggles

type MediaQueryListEventLike = { matches: boolean; media: string };
type MediaQueryListListener = (e: MediaQueryListEventLike) => void;

interface MediaQueryListLike {
  matches: boolean;
  media: string;
  onchange: ((e: MediaQueryListEventLike) => void) | null;
  addListener: (listener: MediaQueryListListener) => void; // deprecated
  removeListener: (listener: MediaQueryListListener) => void; // deprecated
  addEventListener: (type: 'change', listener: MediaQueryListListener) => void;
  removeEventListener: (type: 'change', listener: MediaQueryListListener) => void;
  dispatchEvent: (e: MediaQueryListEventLike) => boolean;
}

const isBrowser = typeof window !== 'undefined';

// Simple evaluator for a subset of media queries (min/max width/height in px)
function evaluateQuery(query: string): boolean {
  try {
    const width = (window as any).innerWidth ?? 1024;
    const height = (window as any).innerHeight ?? 768;

    // Normalize whitespace
    const q = query.replace(/\s+/g, ' ').trim();

    // Support basic conjunctions with 'and'
    const parts = q.split(/\)\s*and\s*\(/i).map((p) => p.replace(/[()]/g, '').trim());

    // If query is 'print' or 'screen', just return false/screen default
    if (/^print$/i.test(q)) return false;
    if (/^screen$/i.test(q)) return true;

    for (const part of parts) {
      // e.g., 'min-width: 768px'
      const match = part.match(/(min|max)-(width|height)\s*:\s*(\d+)px/i);
      if (!match) {
        // Unknown segment: ignore and continue (optimistic)
        continue;
      }
      const [, bound, axis, valueStr] = match;
      const value = parseInt(valueStr, 10);
      if (axis.toLowerCase() === 'width') {
        if (bound.toLowerCase() === 'min' && !(width >= value)) return false;
        if (bound.toLowerCase() === 'max' && !(width <= value)) return false;
      } else {
        if (bound.toLowerCase() === 'min' && !(height >= value)) return false;
        if (bound.toLowerCase() === 'max' && !(height <= value)) return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}

if (isBrowser && !(window as any).matchMedia) {
  type Entry = { listeners: Set<MediaQueryListListener>; mql: MediaQueryListLike; evaluate: () => boolean; last: boolean };
  const registry = new Map<string, Entry>();

  function createMql(query: string): MediaQueryListLike {
    const listeners = new Set<MediaQueryListListener>();
    const evaluate = () => evaluateQuery(query);
    const initial = evaluate();

    const mql: MediaQueryListLike = {
      matches: initial,
      media: query,
      onchange: null,
      addListener: (listener: MediaQueryListListener) => {
        // Deprecated API should behave like addEventListener('change', listener)
        listeners.add(listener);
      },
      removeListener: (listener: MediaQueryListListener) => {
        listeners.delete(listener);
      },
      addEventListener: (type: 'change', listener: MediaQueryListListener) => {
        if (type !== 'change') return;
        listeners.add(listener);
      },
      removeEventListener: (type: 'change', listener: MediaQueryListListener) => {
        if (type !== 'change') return;
        listeners.delete(listener);
      },
      dispatchEvent: (e: MediaQueryListEventLike) => {
        // Fire onchange first (if present), then listeners
        try {
          if (typeof mql.onchange === 'function') {
            mql.onchange(e);
          }
          listeners.forEach((fn) => fn(e));
        } catch {
          // ignore listener errors for test stability
        }
        return true;
      },
    };

    registry.set(query, { listeners, mql, evaluate, last: initial });
    return mql;
  }

  (window as any).matchMedia = (query: string): MediaQueryListLike => {
    const existing = registry.get(query);
    if (existing) return existing.mql;
    return createMql(query);
  };

  // React to window resize: recompute and emit change if toggled
  const resizeHandler = () => {
    registry.forEach((entry, query) => {
      const next = entry.evaluate();
      if (next !== entry.last) {
        entry.last = next;
        entry.mql.matches = next;
        entry.mql.dispatchEvent({ matches: next, media: query });
      }
    });
  };

  (window as any).addEventListener?.('resize', resizeHandler);

  // Expose a tiny testing helper to force a change (optional)
  // window.__test_matchMediaForceChange?.(query, matches)
  (window as any).__test_matchMediaForceChange = (query: string, matches: boolean) => {
    const entry = registry.get(query) ?? ((): Entry => {
      const mql = createMql(query);
      return registry.get(query)!;
    })();
    if (entry.last !== matches) {
      entry.last = matches;
      entry.mql.matches = matches;
      entry.mql.dispatchEvent({ matches, media: query });
    }
  };
}
