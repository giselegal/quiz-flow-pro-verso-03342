// =====================================================================
// components/editor/components/PropertyHistory.tsx - Histórico de propriedades
// =====================================================================

import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { ScrollArea } from '../../ui/scroll-area';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { History, Undo2, Redo2, Clock, CheckCircle, Circle, Trash2 } from 'lucide-react';

interface HistoryEntry {
  id: string;
  timestamp: number;
  properties: Record<string, any>;
  description: string;
}

interface PropertyHistoryProps {
  history: HistoryEntry[];
  currentIndex: number;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => Record<string, any> | null;
  onRedo: () => Record<string, any> | null;
  onGoToEntry: (index: number) => Record<string, any> | null;
  onClearHistory: () => void;
}

export const PropertyHistory: React.FC<PropertyHistoryProps> = ({
  history,
  currentIndex,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onGoToEntry,
  onClearHistory,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Agora mesmo';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} min atrás`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h atrás`;
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  const getChangedProperties = (current: Record<string, any>, previous?: Record<string, any>) => {
    if (!previous) return [];

    const changes: string[] = [];
    Object.keys(current).forEach(key => {
      if (current[key] !== previous[key]) {
        changes.push(key);
      }
    });

    return changes.slice(0, 3); // Máximo 3 propriedades
  };

  return (
    <div className="flex items-center space-x-1">
      {/* Undo/Redo buttons */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onUndo}
        disabled={!canUndo}
        className="h-8 w-8 p-0"
        title="Desfazer (Ctrl+Z)"
      >
        <Undo2 className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onRedo}
        disabled={!canRedo}
        className="h-8 w-8 p-0"
        title="Refazer (Ctrl+Y)"
      >
        <Redo2 className="w-4 h-4" />
      </Button>

      {/* History dropdown */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Ver histórico">
            <History className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Histórico de Propriedades</CardTitle>
                <div className="flex items-center space-x-1">
                  <Badge variant="secondary" className="text-xs">
                    {history.length} entradas
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearHistory}
                    style={{ color: '#432818' }}
                    title="Limpar histórico"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-64">
                <div className="space-y-1 p-3">
                  {history.map((entry, index) => {
                    const isCurrentEntry = index === currentIndex;
                    const isFutureEntry = index > currentIndex;
                    const changes = getChangedProperties(
                      entry.properties,
                      history[index - 1]?.properties
                    );

                    return (
                      <div key={entry.id}>
                        <button
                          onClick={() => {
                            onGoToEntry(index);
                            setIsOpen(false);
                          }}
                          className={`w-full text-left p-2 rounded-md transition-colors ${
                            isCurrentEntry
                              ? 'bg-[#B89B7A]/10 border border-[#B89B7A]/30'
                              : isFutureEntry
                                ? 'opacity-50 hover:bg-gray-50'
                                : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div className="flex-shrink-0">
                              {isCurrentEntry ? (
                                <CheckCircle className="w-4 h-4 text-[#B89B7A]" />
                              ) : (
                                <Circle className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p style={{ color: '#432818' }}>{entry.description}</p>
                                <div style={{ color: '#8B7355' }}>
                                  <Clock className="w-3 h-3" />
                                  <span>{formatTime(entry.timestamp)}</span>
                                </div>
                              </div>
                              {changes.length > 0 && (
                                <div className="flex items-center space-x-1 mt-1">
                                  {changes.map(prop => (
                                    <Badge
                                      key={prop}
                                      variant="outline"
                                      className="text-xs py-0 px-1"
                                    >
                                      {prop}
                                    </Badge>
                                  ))}
                                  {Object.keys(entry.properties).length > 3 && (
                                    <Badge variant="outline" className="text-xs py-0 px-1">
                                      +{Object.keys(entry.properties).length - 3}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                        {index < history.length - 1 && <Separator className="my-1" />}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              <div style={{ borderColor: '#E5DDD5' }}>
                <div style={{ color: '#6B4F43' }}>
                  <span>
                    Posição: {currentIndex + 1} de {history.length}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span>Ctrl+Z</span>
                    <span>•</span>
                    <span>Ctrl+Y</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
};
