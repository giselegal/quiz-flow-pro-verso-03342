import { useEffect } from 'react';

/**
 * Interceptador global para debugar eventos que podem estar interferindo no DnD
 */
export const GlobalEventInterceptor = () => {
  useEffect(() => {
    console.log('🕵️ GlobalEventInterceptor ATIVO - Monitorizando todos os eventos...');

    const eventTypes = [
      'mousedown',
      'mouseup',
      'mousemove',
      'click',
      'touchstart',
      'touchend',
      'touchmove',
      'dragstart',
      'drag',
      'dragend',
      'dragover',
      'drop',
      'pointermove',
      'pointerdown',
      'pointerup',
    ];

    const loggers: { [key: string]: (event: Event) => void } = {};

    eventTypes.forEach(eventType => {
      const logger = (event: Event) => {
        const target = event.target as HTMLElement;

        // Filtragem para focar em elementos relevantes
        if (
          target?.classList?.contains('draggable-component-item') ||
          target?.classList?.contains('dnd-draggable-item') ||
          target?.closest('.draggable-component-item') ||
          target?.closest('.dnd-draggable-item') ||
          eventType.includes('drag')
        ) {
          console.log(`🔍 ${eventType.toUpperCase()}:`, {
            type: eventType,
            target: target?.tagName,
            classes: target?.className,
            id: target?.id,
            isDraggable: target?.draggable,
            style: {
              pointerEvents: getComputedStyle(target)?.pointerEvents,
              userSelect: getComputedStyle(target)?.userSelect,
              zIndex: getComputedStyle(target)?.zIndex,
              position: getComputedStyle(target)?.position,
            },
            event: event,
            timestamp: Date.now(),
          });
        }

        // Log crítico para eventos de drag
        if (eventType.includes('drag')) {
          console.log(`🚨 EVENTO DRAG DETECTADO: ${eventType}`, {
            target: target?.tagName,
            classes: target?.className,
            defaultPrevented: event.defaultPrevented,
            cancelable: event.cancelable,
            bubbles: event.bubbles,
            timestamp: Date.now(),
          });
        }
      };

      loggers[eventType] = logger;

      // Capture = true para interceptar na fase de captura
      document.addEventListener(eventType, logger, { capture: true, passive: false });
    });

    // Interceptador especial para preventDefault
    const originalPreventDefault = Event.prototype.preventDefault;
    Event.prototype.preventDefault = function (this: Event) {
      if (
        this.type.includes('drag') ||
        this.type.includes('mouse') ||
        this.type.includes('touch')
      ) {
        console.log('🚫 preventDefault CHAMADO em:', {
          type: this.type,
          target: (this.target as HTMLElement)?.tagName,
          classes: (this.target as HTMLElement)?.className,
          stack: new Error().stack,
        });
      }
      return originalPreventDefault.call(this);
    };

    return () => {
      // Cleanup
      eventTypes.forEach(eventType => {
        document.removeEventListener(eventType, loggers[eventType], { capture: true });
      });

      // Restaurar preventDefault
      Event.prototype.preventDefault = originalPreventDefault;

      console.log('🕵️ GlobalEventInterceptor DESATIVADO');
    };
  }, []);

  return null; // Componente invisível
};

export default GlobalEventInterceptor;
