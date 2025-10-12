import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
import { StorageService } from '@/services/core/StorageService';
  Trash2,
  RefreshCcw,
  Info,
  Play,
  CheckCircle,
  Eye,
  Users,
  ShoppingCart,
  MousePointer,
} from 'lucide-react';

interface LoggedEvent {
  type: string;
  timestamp: string;
  details?: any;
}

export const EventLogger: React.FC = () => {
  const [events, setEvents] = useState<LoggedEvent[]>([]);
  const [filter, setFilter] = useState<string | null>(null);

  const loadEvents = () => {
    try {
      const eventsJson = StorageService.safeGetString('fb_pixel_event_log');
      const loadedEvents = eventsJson ? JSON.parse(eventsJson) : [];
      setEvents(loadedEvents);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      setEvents([]);
    }
  };

  useEffect(() => {
    loadEvents();

    // Configurar atualização automática a cada 5 segundos
    const interval = setInterval(() => {
      loadEvents();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const clearEvents = () => {
    StorageService.safeRemove('fb_pixel_event_log');
    setEvents([]);
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'QuizStart':
        return <Play className="h-4 w-4" />;
      case 'QuizAnswer':
        return <Info className="h-4 w-4" />;
      case 'QuizComplete':
        return <CheckCircle className="h-4 w-4" />;
      case 'ResultView':
        return <Eye className="h-4 w-4" />;
      case 'Lead':
        return <Users className="h-4 w-4" />;
      case 'Purchase':
        return <ShoppingCart className="h-4 w-4" />;
      case 'ButtonClick':
        return <MousePointer className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'QuizStart':
        return 'bg-[#B89B7A]/100';
      case 'QuizAnswer':
        return 'bg-[#B89B7A]/100';
      case 'QuizComplete':
        return 'bg-green-500';
      case 'ResultView':
        return 'bg-stone-500';
      case 'Lead':
        return 'bg-[#B89B7A]/100';
      case 'Purchase':
        return 'bg-red-500';
      case 'ButtonClick':
        return 'bg-[#B89B7A]/100';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredEvents = filter ? events.filter(event => event.type === filter) : events;

  return (
    <Card className="border-border/40 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base">Log de Eventos Facebook Pixel</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Eventos enviados para o Facebook Pixel
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => loadEvents()}
            >
              <RefreshCcw className="h-3.5 w-3.5 mr-1" />
              Atualizar
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => clearEvents()}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Limpar
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          <Badge
            variant={filter === null ? 'default' : 'outline'}
            className="cursor-pointer text-[10px] h-5"
            onClick={() => setFilter(null)}
          >
            Todos
          </Badge>
          <Badge
            variant={filter === 'QuizStart' ? 'default' : 'outline'}
            className="cursor-pointer text-[10px] h-5"
            onClick={() => setFilter('QuizStart')}
          >
            Início Quiz
          </Badge>
          <Badge
            variant={filter === 'QuizAnswer' ? 'default' : 'outline'}
            className="cursor-pointer text-[10px] h-5"
            onClick={() => setFilter('QuizAnswer')}
          >
            Respostas
          </Badge>
          <Badge
            variant={filter === 'QuizComplete' ? 'default' : 'outline'}
            className="cursor-pointer text-[10px] h-5"
            onClick={() => setFilter('QuizComplete')}
          >
            Conclusão
          </Badge>
          <Badge
            variant={filter === 'ResultView' ? 'default' : 'outline'}
            className="cursor-pointer text-[10px] h-5"
            onClick={() => setFilter('ResultView')}
          >
            Resultados
          </Badge>
          <Badge
            variant={filter === 'Lead' ? 'default' : 'outline'}
            className="cursor-pointer text-[10px] h-5"
            onClick={() => setFilter('Lead')}
          >
            Leads
          </Badge>
          <Badge
            variant={filter === 'Purchase' ? 'default' : 'outline'}
            className="cursor-pointer text-[10px] h-5"
            onClick={() => setFilter('Purchase')}
          >
            Compras
          </Badge>
          <Badge
            variant={filter === 'ButtonClick' ? 'default' : 'outline'}
            className="cursor-pointer text-[10px] h-5"
            onClick={() => setFilter('ButtonClick')}
          >
            Cliques
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-y-auto pb-0">
        <div className="space-y-2">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              {filter ? `Nenhum evento "${filter}" registrado` : 'Nenhum evento registrado'}
            </div>
          ) : (
            filteredEvents.map((event, index) => (
              <div key={index} className="text-xs border rounded-md p-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className={`rounded-full p-1.5 ${getEventColor(event.type)}`}>
                      {getEventIcon(event.type)}
                    </div>
                    <div>
                      <div className="font-medium">{event.type}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {new Date(event.timestamp).toLocaleString('pt-BR')}
                      </div>
                    </div>
                  </div>
                </div>
                {event.details && (
                  <div className="mt-2 pl-8 text-[10px] text-muted-foreground">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(event.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventLogger;
