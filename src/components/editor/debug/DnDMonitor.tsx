import React, { useEffect, useState } from 'react';

/**
 * Componente de debug que monitora o estado do DnD em tempo real
 */
export const DnDMonitor: React.FC = () => {
  const [stats, setStats] = useState({
    draggables: 0,
    droppables: 0,
    lastUpdate: new Date().toISOString(),
    events: [] as string[],
    lastActiveId: '' as string | undefined,
    lastOverId: '' as string | undefined,
    lastPosition: '' as string | number | undefined,
    lastAction: '' as string | undefined,
  });

  useEffect(() => {
    const updateStats = () => {
      const draggables = document.querySelectorAll('[data-dnd-kit-draggable-handle]');
      const droppables = document.querySelectorAll('[data-dnd-kit-droppable]');

      setStats(prev => ({
        ...prev,
        draggables: draggables.length,
        droppables: droppables.length,
        lastUpdate: new Date().toISOString().split('T')[1].split('.')[0],
      }));
    };

    // Atualizar a cada 2 segundos
    const interval = setInterval(updateStats, 2000);
    updateStats(); // Primeira execução

    // Monitorar eventos globais de DnD
    const handleDragStart = () => {
      setStats(prev => ({
        ...prev,
        events: [
          ...prev.events.slice(-4),
          `🚀 DragStart: ${new Date().toISOString().split('T')[1].split('.')[0]}`,
        ],
      }));
    };

    const handleDragEnd = () => {
      setStats(prev => ({
        ...prev,
        events: [
          ...prev.events.slice(-4),
          `🎯 DragEnd: ${new Date().toISOString().split('T')[1].split('.')[0]}`,
        ],
      }));
    };

    const handleMouseDown = (e: any) => {
      if (e.target.closest('[data-dnd-kit-draggable-handle]')) {
        setStats(prev => ({
          ...prev,
          events: [
            ...prev.events.slice(-4),
            `🖱️ MouseDown: ${new Date().toISOString().split('T')[1].split('.')[0]}`,
          ],
        }));
      }
    };

    // Eventos custom dnd-* para debug detalhado
    const handleDndStart = (e: any) => {
      const { activeId } = e.detail || {};
      setStats(prev => ({
        ...prev,
        lastActiveId: activeId,
        lastOverId: undefined,
        lastPosition: undefined,
        lastAction: 'start',
        events: [...prev.events.slice(-4), `🚀 dnd-start: active=${String(activeId || '')}`],
      }));
    };

    const handleDndEnd = (e: any) => {
      const { activeId, overId, validation, action, targetIndex } = e.detail || {};
      const pos = validation?.position ?? targetIndex ?? undefined;
      setStats(prev => ({
        ...prev,
        lastActiveId: activeId,
        lastOverId: overId,
        lastPosition: pos,
        lastAction: action || validation?.action,
        events: [
          ...prev.events.slice(-4),
          `🎯 dnd-end: over=${String(overId || '')} action=${String(
            (action || validation?.action || '') as any
          )}`,
        ],
      }));
    };

    // Listeners globais
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('dragend', handleDragEnd);
    document.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('dnd-start', handleDndStart as any);
    window.addEventListener('dnd-end', handleDndEnd as any);

    return () => {
      clearInterval(interval);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('dragend', handleDragEnd);
      document.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('dnd-start', handleDndStart as any);
      window.removeEventListener('dnd-end', handleDndEnd as any);
    };
  }, []);

  return (
    <div
      className="fixed top-4 right-4 bg-black/90 text-white text-xs p-3 rounded-lg font-mono z-50 min-w-[200px]"
      style={{ pointerEvents: 'none' }}
    >
      <div className="font-bold text-green-400 mb-2">🔍 DnD Monitor</div>
      <div className="space-y-1">
        <div>
          Draggables: <span className="text-yellow-400">{stats.draggables}</span>
        </div>
        <div>
          Droppables: <span className="text-blue-400">{stats.droppables}</span>
        </div>
        <div>
          Updated: <span className="text-gray-400">{stats.lastUpdate}</span>
        </div>
        {stats.lastActiveId && (
          <div>
            Active: <span className="text-gray-300">{stats.lastActiveId}</span>
          </div>
        )}
        {typeof stats.lastOverId !== 'undefined' && (
          <div>
            Over: <span className="text-gray-300">{String(stats.lastOverId || 'null')}</span>
          </div>
        )}
        {typeof stats.lastPosition !== 'undefined' && (
          <div>
            Pos: <span className="text-gray-300">{String(stats.lastPosition)}</span>
          </div>
        )}
        {stats.lastAction && (
          <div>
            Action: <span className="text-gray-300">{stats.lastAction}</span>
          </div>
        )}
      </div>

      {stats.events.length > 0 && (
        <div className="mt-3 pt-2 border-t border-gray-600">
          <div className="font-bold text-green-400 mb-1">Events:</div>
          {stats.events.map((event, i) => (
            <div key={i} className="text-xs text-gray-300">
              {event}
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 pt-2 border-t border-gray-600 text-xs text-gray-400">
        Clique para ativar console debug:
        <button
          onClick={() => {
            (window as any).__DND_DEBUG = true;
            console.log('🎯 Debug ativado!');
          }}
          className="ml-2 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
          style={{ pointerEvents: 'auto' }}
        >
          Debug
        </button>
      </div>
    </div>
  );
};
