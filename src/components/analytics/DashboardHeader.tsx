
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCcw, Download, Trash2, Filter, LayoutGrid, LayoutList } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DashboardHeaderProps {
  timeRange: '7d' | '30d' | 'all';
  onTimeRangeChange: (range: '7d' | '30d' | 'all') => void;
  onRefresh: () => void;
  onExportData: () => void;
  onClearData: () => void;
  onEventSelectionChange: (events: string[]) => void;
  selectedEvents: string[];
  compactView?: boolean;
  onToggleCompactView?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  timeRange,
  onTimeRangeChange,
  onRefresh,
  onExportData,
  onClearData,
  onEventSelectionChange,
  selectedEvents,
  compactView = false,
  onToggleCompactView
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleTimeRangeChange = (value: string) => {
    onTimeRangeChange(value as '7d' | '30d' | 'all');
  };

  const toggleEvent = (eventType: string) => {
    if (selectedEvents.includes(eventType)) {
      onEventSelectionChange(selectedEvents.filter(e => e !== eventType));
    } else {
      onEventSelectionChange([...selectedEvents, eventType]);
    }
  };

  const eventLabels: Record<string, string> = {
    quiz_start: 'Início do Quiz',
    quiz_complete: 'Quiz Completo',
    quiz_answer: 'Respostas',
    result_view: 'Visualização de Resultado',
    lead_generated: 'Leads Gerados',
    sale: 'Vendas',
    button_click: 'Cliques em Botões'
  };

  return (
    <Card className="mb-6 border-none shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Analytics</h1>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={onToggleCompactView}
                  >
                    {compactView ? 
                      <LayoutGrid className="h-4 w-4" /> : 
                      <LayoutList className="h-4 w-4" />
                    }
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {compactView ? "Expandir visualização" : "Compactar visualização"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={timeRange}
              onValueChange={handleTimeRangeChange}
            >
              <SelectTrigger className="h-8 w-[130px] text-xs">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="all">Todo o período</SelectItem>
              </SelectContent>
            </Select>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <Filter className="h-3.5 w-3.5 mr-2" />
                  <span className="text-xs">Filtrar Eventos</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Tipos de Evento</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.entries(eventLabels).map(([key, label]) => (
                  <DropdownMenuCheckboxItem
                    key={key}
                    checked={selectedEvents.includes(key)}
                    onCheckedChange={() => toggleEvent(key)}
                  >
                    {label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCcw className={`h-3.5 w-3.5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="text-xs">Atualizar</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={onExportData}
            >
              <Download className="h-3.5 w-3.5 mr-2" />
              <span className="text-xs">Exportar</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-red-200 hover:bg-red-50 hover:text-red-600 text-red-500"
              onClick={onClearData}
            >
              <Trash2 className="h-3.5 w-3.5 mr-2" />
              <span className="text-xs">Limpar Dados</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
