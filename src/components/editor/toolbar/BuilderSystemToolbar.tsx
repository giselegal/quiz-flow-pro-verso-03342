/**
 * 🎯 BUILDER SYSTEM TOOLBAR - CONTROLES RÁPIDOS
 * 
 * Toolbar otimizada para acesso rápido às funcionalidades do Builder System
 * Integrada com AI Orchestrator e Performance Monitoring
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useBuilderSystem } from '@/hooks/useBuilderSystem';
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Rocket, 
  Brain, 
  Zap, 
  LayoutTemplate, 
  Settings, 
  TrendingUp,
  Sparkles,
  ChevronDown,
  Activity
} from 'lucide-react';

interface BuilderSystemToolbarProps {
  onModeChange?: (mode: 'automatic' | 'manual' | 'hybrid') => void;
  onQuickAction?: (action: string, data?: any) => void;
  className?: string;
}

export const BuilderSystemToolbar: React.FC<BuilderSystemToolbarProps> = ({
  onModeChange,
  onQuickAction,
  className = ''
}) => {
  const { toast } = useToast();
  const builderSystem = useBuilderSystem();
  
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [showPerformance, setShowPerformance] = useState(false);

  // 🎯 TOGGLE MODO AUTOMÁTICO
  const handleModeToggle = (checked: boolean) => {
    setIsAutoMode(checked);
    const newMode = checked ? 'automatic' : 'manual';
    onModeChange?.(newMode);
    
    toast({
      title: `Modo ${checked ? 'Automático' : 'Manual'} ativado`,
      description: checked 
        ? "IA irá otimizar automaticamente suas criações"
        : "Controle manual total sobre as configurações",
      variant: "default"
    });
  };

  // 🚀 AÇÕES RÁPIDAS
  const handleQuickAction = async (action: string) => {
    try {
      switch (action) {
        case 'optimize':
          toast({
            title: "🔄 Otimizando...",
            description: "Aplicando otimizações automáticas",
            variant: "default"
          });
          onQuickAction?.('optimize');
          break;
          
        case 'ai-improve':
          toast({
            title: "🤖 IA ativa",
            description: "Melhorando conteúdo com inteligência artificial",
            variant: "default"
          });
          onQuickAction?.('ai-improve');
          break;
          
        case 'performance':
          setShowPerformance(!showPerformance);
          onQuickAction?.('toggle-performance', { show: !showPerformance });
          break;
          
        default:
          onQuickAction?.(action);
      }
    } catch (error) {
      toast({
        title: "Erro na ação",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    }
  };

  // 🎯 STATUS INDICATOR
  const StatusIndicator = () => {
    if (!builderSystem.isReady) {
      return <Badge variant="outline" className="bg-yellow-50">Inicializando</Badge>;
    }
    
    if (builderSystem.state.error) {
      return <Badge variant="destructive">Erro</Badge>;
    }
    
    return (
      <Badge variant="default" className="bg-green-50 text-green-700 border-green-200">
        Ativo
      </Badge>
    );
  };

  return (
    <TooltipProvider>
      <div className={`builder-system-toolbar flex items-center gap-2 p-2 bg-background border rounded-lg ${className}`}>
        
        {/* 🚀 BUILDER STATUS */}
        <div className="flex items-center gap-2">
          <Rocket className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Builder System</span>
          <StatusIndicator />
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* 🎯 MODO AUTOMÁTICO/MANUAL */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-blue-600" />
                <Switch
                  checked={isAutoMode}
                  onCheckedChange={handleModeToggle}
                  disabled={!builderSystem.canUseAI}
                />
                <span className="text-xs font-medium">
                  {isAutoMode ? 'Auto' : 'Manual'}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {isAutoMode 
                  ? 'Modo Automático: IA otimiza automaticamente'
                  : 'Modo Manual: Controle total do usuário'
                }
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* 🔥 AÇÕES RÁPIDAS */}
        <div className="flex items-center gap-1">
          
          {/* Otimizar */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuickAction('optimize')}
                disabled={builderSystem.state.isGenerating}
              >
                <TrendingUp className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Otimizar automaticamente</p>
            </TooltipContent>
          </Tooltip>

          {/* IA Melhorar */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuickAction('ai-improve')}
                disabled={!builderSystem.canUseAI || builderSystem.state.isGenerating}
              >
                <Sparkles className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Melhorar com IA</p>
            </TooltipContent>
          </Tooltip>

          {/* Performance */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuickAction('performance')}
                className={showPerformance ? 'bg-primary/10' : ''}
              >
                <Activity className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle Performance Monitor</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* 🎨 TEMPLATES DROPDOWN */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1">
            <LayoutTemplate className="h-4 w-4" />
            <span className="text-xs">Templates</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Templates Rápidos</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {builderSystem.state.availablePresets.slice(0, 3).map((preset) => (
              <DropdownMenuItem 
                key={preset}
                onClick={() => onQuickAction?.('apply-preset', { preset })}
              >
                <LayoutTemplate className="mr-2 h-4 w-4" />
                {preset.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase())}
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onQuickAction?.('open-templates')}>
              <Settings className="mr-2 h-4 w-4" />
              Ver todos templates
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 🎯 INDICADORES DE CAPACIDADE */}
        <div className="flex items-center gap-1 ml-auto">
          {builderSystem.canUseAI && (
            <Badge variant="secondary" className="text-xs gap-1">
              <Brain className="h-3 w-3" />
              IA
            </Badge>
          )}
          {builderSystem.canUseTemplates && (
            <Badge variant="secondary" className="text-xs gap-1">
              <LayoutTemplate className="h-3 w-3" />
              Templates
            </Badge>
          )}
          {isAutoMode && (
            <Badge variant="outline" className="text-xs gap-1">
              <Zap className="h-3 w-3" />
              Auto
            </Badge>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};