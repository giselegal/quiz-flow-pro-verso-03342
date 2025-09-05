import { useEffect } from 'react';

/**
 * Desabilita auto-scroll e scrollIntoView programáticos dentro de rotas do editor.
 * Restaura no cleanup.
 */
export function useDisableAutoScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    const path = window.location?.pathname || '';
    if (!path.includes('/editor')) return;

    const g: any = window as any;
    g.__DISABLE_AUTO_SCROLL = true;
    g.__DISABLE_SCROLL_SYNC = true;

    const originalScrollTo = window.scrollTo?.bind(window);
    const originalScrollIntoView = (Element.prototype as any).scrollIntoView?.bind(Element.prototype);

    try {
      window.scrollTo = ((..._args: any[]) => { }) as any;
      (Element.prototype as any).scrollIntoView = ((..._args: any[]) => { }) as any;
    } catch { }

    return () => {
      try {
        g.__DISABLE_AUTO_SCROLL = false;
        g.__DISABLE_SCROLL_SYNC = false;
        if (originalScrollTo) window.scrollTo = originalScrollTo as any;
        if (originalScrollIntoView) (Element.prototype as any).scrollIntoView = originalScrollIntoView as any;
      } catch { }
    };
  }, [enabled]);
}

export default useDisableAutoScroll;
