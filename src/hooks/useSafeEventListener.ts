/**
 * 🔒 SAFE EVENT LISTENER HOOK
 * 
 * Previne event listener leaks garantindo cleanup adequado
 * e usando handlers estáveis com useRef
 */

import { useEffect, useRef } from 'react';

// Global tracker para monitorar listeners ativos (DEV only)
class EventListenerTracker {
  private listeners: Map<string, number> = new Map();
  private enabled = import.meta.env.DEV;

  register(eventName: string) {
    if (!this.enabled) return;
    
    const count = this.listeners.get(eventName) || 0;
    this.listeners.set(eventName, count + 1);
    
    if (count > 10) {
      console.warn(`⚠️ [EventListenerTracker] High listener count for "${eventName}": ${count + 1}`);
    }
  }

  unregister(eventName: string) {
    if (!this.enabled) return;
    
    const count = this.listeners.get(eventName) || 0;
    if (count > 0) {
      this.listeners.set(eventName, count - 1);
    }
  }

  getStats() {
    return Object.fromEntries(this.listeners);
  }

  clear() {
    this.listeners.clear();
  }
}

export const eventListenerTracker = new EventListenerTracker();

// Expor globalmente para debugging
if (typeof window !== 'undefined') {
  (window as any).__eventListenerTracker = eventListenerTracker;
}

interface UseSafeEventListenerOptions {
  target?: EventTarget | null;
  enabled?: boolean;
}

/**
 * Hook seguro para event listeners
 * 
 * @example
 * ```tsx
 * useSafeEventListener('resize', () => {
 *   console.log('Window resized');
 * });
 * 
 * useSafeEventListener('custom-event', handleCustom, {
 *   target: document,
 *   enabled: shouldListen
 * });
 * ```
 */
export function useSafeEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: UseSafeEventListenerOptions
): void;

export function useSafeEventListener(
  eventName: string,
  handler: (event: Event) => void,
  options?: UseSafeEventListenerOptions
): void;

export function useSafeEventListener(
  eventName: string,
  handler: (event: any) => void,
  options: UseSafeEventListenerOptions = {}
): void {
  const { target = typeof window !== 'undefined' ? window : null, enabled = true } = options;
  
  // Usar useRef para manter handler estável
  const handlerRef = useRef(handler);
  
  // Atualizar ref quando handler mudar (evita stale closures)
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled || !target) return;

    // Wrapper estável que sempre chama a versão mais recente do handler
    const stableHandler = (event: any) => {
      handlerRef.current(event);
    };

    // Registrar listener
    target.addEventListener(eventName, stableHandler);
    eventListenerTracker.register(eventName);

    if (import.meta.env.DEV) {
      console.debug(`👂 [useSafeEventListener] Registered "${eventName}"`);
    }

    // Cleanup garantido
    return () => {
      target.removeEventListener(eventName, stableHandler);
      eventListenerTracker.unregister(eventName);
      
      if (import.meta.env.DEV) {
        console.debug(`🔇 [useSafeEventListener] Unregistered "${eventName}"`);
      }
    };
  }, [eventName, target, enabled]);
}

export default useSafeEventListener;
