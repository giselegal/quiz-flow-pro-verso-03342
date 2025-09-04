/**
 * 🎯 COMPREHENSIVE STEP NAVIGATION - NAVEGAÇÃO COMPLETA DAS 21 ETAPAS
 * 
 * Componente que permite navegar e editar todas as 21 etapas do quiz,
 * mostrando uma visão completa de todas as propriedades configuráveis.
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Settings,
  Eye,
  Edit3,
  Copy,
  Trash2,
  Plus,
  Check,
  AlertCircle,
  Info,
  Play,
  SkipForward,
  SkipBack,
  Layers,
  Grid,
  List,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import NoCodePropertiesPanel from './NoCodePropertiesPanel';
import type { Block } from '@/types/editor';

// ===== INTERFACES =====

interface ComprehensiveStepNavigationProps {
  onBlockUpdate?: (stepKey: string, blockId: string, updates: Record<string, any>) => void;
  onBlockDuplicate?: (stepKey: string, blockId: string) => void;
  onBlockDelete?: (stepKey: string, blockId: string) => void;
  onStepValidate?: (stepKey: string) => boolean;
  className?: string;
}

interface StepInfo {
  key: string;
  number: number;
  title: string;
  description: string;
  type: 'intro' | 'question' | 'strategic' | 'transition' | 'result' | 'offer';
  blocks: Block[];
  isValid: boolean;
  hasChanges: boolean;
  propertyCount: number;
}

interface BlockSummary {
  id: string;
  type: string;
  propertyCount: number;
  hasInterpolation: boolean;
  isValid: boolean;
  preview: string;
}

// ===== STEP DEFINITIONS =====

const STEP_DEFINITIONS: Record<string, Omit<StepInfo, 'key' | 'number' | 'blocks' | 'isValid' | 'hasChanges' | 'propertyCount'>> = {
  'step-1': {
    title: 'Coleta do Nome',
    description: 'Primeira etapa para coletar o nome do usuário',
    type: 'intro'
  },
  'step-2': {
    title: 'Tipo de Roupa Favorita',
    description: 'Questão sobre preferências de vestimenta',
    type: 'question'
  },
  'step-3': {
    title: 'Personalidade',
    description: 'Análise do perfil de personalidade',
    type: 'question'
  },
  'step-4': {
    title: 'Visual de Identificação',
    description: 'Como o usuário gosta de se expressar',
    type: 'question'
  },
  'step-5': {
    title: 'Detalhes Preferidos',
    description: 'Preferências sobre detalhes no visual',
    type: 'question'
  },
  'step-6': {
    title: 'Estampas Favoritas',
    description: 'Tipos de estampas preferidas',
    type: 'question'
  },
  'step-7': {
    title: 'Casaco Favorito',
    description: 'Preferências para peças de sobreposição',
    type: 'question'
  },
  'step-8': {
    title: 'Sapatos Favoritos',
    description: 'Estilo de calçados preferidos',
    type: 'question'
  },
  'step-9': {
    title: 'Cores Preferidas',
    description: 'Paleta de cores de preferência',
    type: 'question'
  },
  'step-10': {
    title: 'Acessórios',
    description: 'Preferências sobre acessórios',
    type: 'question'
  },
  'step-11': {
    title: 'Ocasião de Uso',
    description: 'Contextos onde as roupas serão usadas',
    type: 'question'
  },
  'step-12': {
    title: 'Transição Estratégica',
    description: 'Preparação para questões estratégicas',
    type: 'transition'
  },
  'step-13': {
    title: 'Orçamento',
    description: 'Faixa de investimento disponível',
    type: 'strategic'
  },
  'step-14': {
    title: 'Frequência de Compras',
    description: 'Com que frequência compra roupas',
    type: 'strategic'
  },
  'step-15': {
    title: 'Influências',
    description: 'O que influencia suas decisões de moda',
    type: 'strategic'
  },
  'step-16': {
    title: 'Desafios de Estilo',
    description: 'Principais dificuldades com moda',
    type: 'strategic'
  },
  'step-17': {
    title: 'Objetivo de Imagem',
    description: 'Como quer ser vista pelas pessoas',
    type: 'strategic'
  },
  'step-18': {
    title: 'Confiança no Estilo',
    description: 'Nível de confiança atual com o visual',
    type: 'strategic'
  },
  'step-19': {
    title: 'Transição para Resultado',
    description: 'Preparação para mostrar o resultado',
    type: 'transition'
  },
  'step-20': {
    title: 'Página de Resultado',
    description: 'Exibição do estilo predominante calculado',
    type: 'result'
  },
  'step-21': {
    title: 'Página de Oferta',
    description: 'Apresentação da consultoria personalizada',
    type: 'offer'
  }
};

const STEP_TYPE_META = {
  intro: { label: 'Introdução', color: 'bg-blue-100 text-blue-800' },
  question: { label: 'Questão', color: 'bg-green-100 text-green-800' },
  strategic: { label: 'Estratégica', color: 'bg-purple-100 text-purple-800' },
  transition: { label: 'Transição', color: 'bg-orange-100 text-orange-800' },
  result: { label: 'Resultado', color: 'bg-yellow-100 text-yellow-800' },
  offer: { label: 'Oferta', color: 'bg-red-100 text-red-800' }
};

// ===== UTILITIES =====

/**
 * Conta propriedades editáveis de um bloco
 */
const countBlockProperties = (block: Block): number => {
  let count = 0;

  if (block.properties) {
    count += Object.keys(block.properties).length;
  }

  if (block.content) {
    count += Object.keys(block.content).filter(key => key !== 'children').length;
  }

  // Propriedades básicas do bloco
  count += 3; // id, type, order

  return count;
};

/**
 * Verifica se um bloco tem interpolação
 */
const hasInterpolation = (block: Block): boolean => {
  const checkValue = (value: any): boolean => {
    if (typeof value === 'string') {
      return /\{[^}]+\}/.test(value);
    }
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(checkValue);
    }
    return false;
  };

  return checkValue(block.properties) || checkValue(block.content);
};

/**
 * Gera preview de um bloco
 */
const generateBlockPreview = (block: Block): string => {
  // Tentar extrair texto do conteúdo
  if (block.content?.text) {
    const text = String(block.content.text);
    return text.length > 50 ? text.substring(0, 50) + '...' : text;
  }

  if (block.properties?.text) {
    const text = String(block.properties.text);
    return text.length > 50 ? text.substring(0, 50) + '...' : text;
  }

  if (block.properties?.title) {
    const text = String(block.properties.title);
    return text.length > 50 ? text.substring(0, 50) + '...' : text;
  }

  if (block.properties?.content) {
    const text = String(block.properties.content);
    return text.length > 50 ? text.substring(0, 50) + '...' : text;
  }

  return `${block.type} (${block.id})`;
};

/**
 * Valida um bloco (verificações básicas)
 */
const validateBlock = (block: Block): boolean => {
  // Verificações básicas
  if (!block.id || !block.type) return false;

  // TODO: Adicionar validações específicas por tipo de bloco
  return true;
};

// ===== COMPONENTE PRINCIPAL =====

export const ComprehensiveStepNavigation: React.FC<ComprehensiveStepNavigationProps> = ({
  onBlockUpdate,
  onBlockDuplicate,
  onBlockDelete,
  onStepValidate,
  className
}) => {
  // Estados locais
  const [activeStep, setActiveStep] = useState('step-1');
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'overview'>('list');
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set(['step-1']));
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'intro' | 'question' | 'strategic' | 'transition' | 'result' | 'offer'>('all');

  // Processar informações das etapas
  const stepsInfo = useMemo((): StepInfo[] => {
    return Object.keys(STEP_DEFINITIONS).map(stepKey => {
      const definition = STEP_DEFINITIONS[stepKey];
      const blocks = QUIZ_STYLE_21_STEPS_TEMPLATE[stepKey] || [];
      const number = parseInt(stepKey.replace('step-', ''));

      const propertyCount = blocks.reduce((total, block) => total + countBlockProperties(block), 0);
      const isValid = blocks.every(validateBlock);
      
      return {
        key: stepKey,
        number,
        title: definition.title,
        description: definition.description,
        type: definition.type,
        blocks,
        isValid,
        hasChanges: false, // TODO: Implementar detecção de mudanças
        propertyCount
      };
    });
  }, []);

  // Filtrar etapas
  const filteredSteps = useMemo(() => {
    let filtered = stepsInfo;

    // Filtrar por tipo
    if (filterType !== 'all') {
      filtered = filtered.filter(step => step.type === filterType);
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(step =>
        step.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        step.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        step.blocks.some(block => 
          block.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          block.id.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    return filtered;
  }, [stepsInfo, filterType, searchTerm]);

  // Informações da etapa ativa
  const activeStepInfo = useMemo(() => {
    return stepsInfo.find(step => step.key === activeStep);
  }, [stepsInfo, activeStep]);

  // Resumo dos blocos da etapa ativa
  const activeStepBlocks = useMemo((): BlockSummary[] => {
    if (!activeStepInfo) return [];

    return activeStepInfo.blocks.map(block => ({
      id: block.id,
      type: block.type,
      propertyCount: countBlockProperties(block),
      hasInterpolation: hasInterpolation(block),
      isValid: validateBlock(block),
      preview: generateBlockPreview(block)
    }));
  }, [activeStepInfo]);

  // Handlers
  const handleStepChange = useCallback((stepKey: string) => {
    setActiveStep(stepKey);
    setSelectedBlock(null);
  }, []);

  const handleBlockSelect = useCallback((block: Block) => {
    setSelectedBlock(block);
  }, []);

  const handleBlockUpdate = useCallback((updates: Record<string, any>) => {
    if (selectedBlock && onBlockUpdate) {
      onBlockUpdate(activeStep, selectedBlock.id, updates);
    }
  }, [selectedBlock, activeStep, onBlockUpdate]);

  const handleBlockDuplicate = useCallback(() => {
    if (selectedBlock && onBlockDuplicate) {
      onBlockDuplicate(activeStep, selectedBlock.id);
    }
  }, [selectedBlock, activeStep, onBlockDuplicate]);

  const handleBlockDelete = useCallback(() => {
    if (selectedBlock && onBlockDelete) {
      onBlockDelete(activeStep, selectedBlock.id);
      setSelectedBlock(null);
    }
  }, [selectedBlock, activeStep, onBlockDelete]);

  const toggleStepExpanded = useCallback((stepKey: string) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepKey)) {
      newExpanded.delete(stepKey);
    } else {
      newExpanded.add(stepKey);
    }
    setExpandedSteps(newExpanded);
  }, [expandedSteps]);

  const navigateStep = useCallback((direction: 'prev' | 'next') => {
    const currentIndex = stepsInfo.findIndex(step => step.key === activeStep);
    
    if (direction === 'prev' && currentIndex > 0) {
      setActiveStep(stepsInfo[currentIndex - 1].key);
    } else if (direction === 'next' && currentIndex < stepsInfo.length - 1) {
      setActiveStep(stepsInfo[currentIndex + 1].key);
    }
  }, [stepsInfo, activeStep]);

  // Estatísticas globais
  const globalStats = useMemo(() => {
    const totalBlocks = stepsInfo.reduce((total, step) => total + step.blocks.length, 0);
    const totalProperties = stepsInfo.reduce((total, step) => total + step.propertyCount, 0);
    const validSteps = stepsInfo.filter(step => step.isValid).length;
    const stepsWithChanges = stepsInfo.filter(step => step.hasChanges).length;

    return {
      totalSteps: stepsInfo.length,
      totalBlocks,
      totalProperties,
      validSteps,
      stepsWithChanges,
      completionPercentage: Math.round((validSteps / stepsInfo.length) * 100)
    };
  }, [stepsInfo]);

  return (
    <div className={cn('h-full flex', className)}>
      {/* Sidebar com navegação das etapas */}
      <div className="w-80 border-r bg-gray-50 flex flex-col">
        {/* Header da navegação */}
        <div className="p-4 border-b bg-white">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg">Navegação de Etapas</h3>
            <Badge variant="outline" className="text-xs">
              {filteredSteps.length} de {stepsInfo.length}
            </Badge>
          </div>

          {/* Estatísticas globais */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="text-center p-2 bg-blue-50 rounded">
              <div className="text-lg font-bold text-blue-600">{globalStats.totalBlocks}</div>
              <div className="text-xs text-blue-700">Blocos</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded">
              <div className="text-lg font-bold text-green-600">{globalStats.totalProperties}</div>
              <div className="text-xs text-green-700">Propriedades</div>
            </div>
          </div>

          {/* Progresso geral */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span>Progresso</span>
              <span>{globalStats.completionPercentage}%</span>
            </div>
            <Progress value={globalStats.completionPercentage} className="h-2" />
          </div>

          {/* Filtros */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar etapas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os tipos</option>
              <option value="intro">Introdução</option>
              <option value="question">Questões</option>
              <option value="strategic">Estratégicas</option>
              <option value="transition">Transições</option>
              <option value="result">Resultado</option>
              <option value="offer">Oferta</option>
            </select>
          </div>
        </div>

        {/* Lista de etapas */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {filteredSteps.map((step) => {
              const isActive = step.key === activeStep;
              const isExpanded = expandedSteps.has(step.key);
              const typeMeta = STEP_TYPE_META[step.type];

              return (
                <div key={step.key} className="space-y-1">
                  {/* Cabeçalho da etapa */}
                  <div
                    className={cn(
                      'p-3 rounded-lg cursor-pointer transition-all',
                      isActive
                        ? 'bg-blue-100 border-2 border-blue-300'
                        : 'bg-white border border-gray-200 hover:bg-gray-50'
                    )}
                    onClick={() => handleStepChange(step.key)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {step.number}
                        </Badge>
                        <Badge className={cn('text-xs', typeMeta.color)}>
                          {typeMeta.label}
                        </Badge>
                        {!step.isValid && (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStepExpanded(step.key);
                        }}
                      >
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </Button>
                    </div>

                    <div className="mt-2">
                      <div className="font-medium text-sm">{step.title}</div>
                      <div className="text-xs text-gray-600 mt-1">{step.description}</div>
                    </div>

                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <span>{step.blocks.length} blocos</span>
                      <span>{step.propertyCount} propriedades</span>
                    </div>
                  </div>

                  {/* Blocos expandidos */}
                  {isExpanded && (
                    <div className="ml-4 space-y-1">
                      {step.blocks.map((block, index) => (
                        <div
                          key={block.id}
                          className={cn(
                            'p-2 text-sm border rounded cursor-pointer transition-colors',
                            selectedBlock?.id === block.id
                              ? 'bg-blue-50 border-blue-300'
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          )}
                          onClick={() => {
                            handleStepChange(step.key);
                            handleBlockSelect(block);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="text-xs">
                              {block.type}
                            </Badge>
                            <div className="flex items-center gap-1">
                              {hasInterpolation(block) && (
                                <Badge variant="outline" className="text-xs">
                                  Interpolação
                                </Badge>
                              )}
                              {!validateBlock(block) && (
                                <AlertCircle className="w-3 h-3 text-red-500" />
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-gray-600 mt-1 truncate">
                            {generateBlockPreview(block)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Navegação rápida */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateStep('prev')}
              disabled={!activeStepInfo || activeStepInfo.number === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Anterior
            </Button>

            <span className="text-sm text-gray-600">
              {activeStepInfo?.number || 1} de {stepsInfo.length}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateStep('next')}
              disabled={!activeStepInfo || activeStepInfo.number === stepsInfo.length}
            >
              Próxima
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Painel principal */}
      <div className="flex-1 flex flex-col">
        {/* Header da etapa ativa */}
        {activeStepInfo && (
          <div className="p-4 border-b bg-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">Etapa {activeStepInfo.number}</Badge>
                  <Badge className={STEP_TYPE_META[activeStepInfo.type].color}>
                    {STEP_TYPE_META[activeStepInfo.type].label}
                  </Badge>
                  {!activeStepInfo.isValid && (
                    <Badge variant="destructive" className="text-xs">
                      Erro
                    </Badge>
                  )}
                </div>
                <h2 className="text-xl font-bold">{activeStepInfo.title}</h2>
                <p className="text-gray-600">{activeStepInfo.description}</p>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-600">
                  {activeStepInfo.blocks.length} blocos
                </div>
                <div className="text-sm text-gray-600">
                  {activeStepInfo.propertyCount} propriedades
                </div>
              </div>
            </div>

            {/* Resumo dos blocos */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {activeStepBlocks.map((blockSummary) => {
                const isSelected = selectedBlock?.id === blockSummary.id;
                const block = activeStepInfo.blocks.find(b => b.id === blockSummary.id);

                return (
                  <div
                    key={blockSummary.id}
                    className={cn(
                      'p-3 border rounded-lg cursor-pointer transition-all',
                      isSelected
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    )}
                    onClick={() => block && handleBlockSelect(block)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {blockSummary.type}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {blockSummary.hasInterpolation && (
                          <Badge variant="outline" className="text-xs">
                            {'{...}'}
                          </Badge>
                        )}
                        {!blockSummary.isValid && (
                          <AlertCircle className="w-3 h-3 text-red-500" />
                        )}
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-600 mb-2">
                      {blockSummary.propertyCount} propriedades
                    </div>
                    
                    <div className="text-sm truncate">
                      {blockSummary.preview}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Painel de propriedades */}
        <div className="flex-1">
          <NoCodePropertiesPanel
            selectedBlock={selectedBlock}
            currentStep={activeStepInfo?.number}
            totalSteps={stepsInfo.length}
            onUpdate={handleBlockUpdate}
            onDuplicate={handleBlockDuplicate}
            onDelete={handleBlockDelete}
            onStepChange={(step) => handleStepChange(`step-${step}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveStepNavigation;