import React, { useState } from 'react';
import { cn } from '../../../../lib/utils';
import { useInlineBlock } from '../../../../hooks/useInlineBlock';
import { InlineBlockProps } from '../../../../types/inlineBlocks';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { Calendar, CheckCircle, Clock, Target, TrendingUp, Users, BookOpen, Star, ArrowRight } from 'lucide-react';

interface QuizActionPlanInlineBlockProps extends InlineBlockProps {
  // Propriedades específicas do componente de plano de ação
}

/**
 * Componente inline para plano de ação (Etapa 10)
 * Exibição de um roadmap personalizado com passos específicos e cronograma
 */
export const QuizActionPlanInlineBlock: React.FC<QuizActionPlanInlineBlockProps> = ({
  block,
  isSelected,
  onClick,
  onPropertyChange,
  className
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  
  const {
    properties,
    handlePropertyChange,
    commonProps
  } = useInlineBlock({
    block,
    isSelected,
    onClick,
    onPropertyChange,
    className
  });

  const title = properties.title || 'Seu Plano de Ação Personalizado';
  const subtitle = properties.subtitle || 'Um roadmap estratégico desenvolvido especialmente para o seu perfil e objetivos';
  const timeframe = properties.timeframe || '90 dias';
  const actionSteps = properties.actionSteps || [
    {
      id: 1,
      phase: 'Semana 1-2',
      title: 'Fundações Estratégicas',
      description: 'Estabeleça as bases sólidas para seu desenvolvimento',
      tasks: [
        'Complete o curso de Liderança Estratégica',
        'Leia "Pensamento de Design" - Capítulos 1-3',
        'Defina seus objetivos SMART para os próximos 90 dias'
      ],
      priority: 'high',
      estimatedTime: '10-15 horas',
      completed: false
    },
    {
      id: 2,
      phase: 'Semana 3-4',
      title: 'Implementação Prática',
      description: 'Coloque em prática os conceitos aprendidos',
      tasks: [
        'Participe do workshop de Inovação e Criatividade',
        'Aplique design thinking em um projeto real',
        'Forme um grupo de estudos com colegas'
      ],
      priority: 'high',
      estimatedTime: '12-18 horas',
      completed: false
    },
    {
      id: 3,
      phase: 'Semana 5-8',
      title: 'Desenvolvimento Avançado',
      description: 'Aprofunde suas competências e expanda sua rede',
      tasks: [
        'Mentoria individual com especialista',
        'Lidere um projeto de inovação na sua equipe',
        'Participe de eventos de networking'
      ],
      priority: 'medium',
      estimatedTime: '15-20 horas',
      completed: false
    },
    {
      id: 4,
      phase: 'Semana 9-12',
      title: 'Consolidação e Expansão',
      description: 'Consolide o aprendizado e prepare próximos passos',
      tasks: [
        'Apresente resultados para a liderança',
        'Documente lições aprendidas',
        'Planeje próximos 90 dias'
      ],
      priority: 'medium',
      estimatedTime: '8-12 horas',
      completed: false
    }
  ];
  const showTimeEstimates = properties.showTimeEstimates || true;
  const showProgress = properties.showProgress || true;
  const showPriorities = properties.showPriorities || true;
  const layoutStyle = properties.layoutStyle || 'timeline'; // timeline, cards, list
  const theme = properties.theme || 'blue';

  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getThemeClasses = () => {
    const themes = {
      blue: {
        bg: 'from-blue-50 to-indigo-50',
        border: 'border-blue-200',
        accent: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700',
        timeline: 'bg-blue-500',
        card: 'border-blue-100'
      },
      green: {
        bg: 'from-green-50 to-emerald-50',
        border: 'border-green-200',
        accent: 'text-green-600',
        button: 'bg-green-600 hover:bg-green-700',
        timeline: 'bg-green-500',
        card: 'border-green-100'
      },
      purple: {
        bg: 'from-purple-50 to-violet-50',
        border: 'border-purple-200',
        accent: 'text-purple-600',
        button: 'bg-purple-600 hover:bg-purple-700',
        timeline: 'bg-purple-500',
        card: 'border-purple-100'
      }
    };
    return themes[theme as keyof typeof themes] || themes.blue;
  };

  const themeClasses = getThemeClasses();

  const addActionStep = () => {
    const newStep = {
      id: Date.now(),
      phase: 'Nova Fase',
      title: 'Novo Passo',
      description: 'Descrição do passo...',
      tasks: ['Nova tarefa'],
      priority: 'medium',
      estimatedTime: '5-10 horas',
      completed: false
    };
    handlePropertyChange('actionSteps', [...actionSteps, newStep]);
  };

  const updateActionStep = (id: number, field: string, value: any) => {
    const updatedSteps = actionSteps.map(step =>
      step.id === id ? { ...step, [field]: value } : step
    );
    handlePropertyChange('actionSteps', updatedSteps);
  };

  const removeActionStep = (id: number) => {
    const filteredSteps = actionSteps.filter(step => step.id !== id);
    handlePropertyChange('actionSteps', filteredSteps);
  };

  const toggleTaskCompletion = (stepId: number) => {
    updateActionStep(stepId, 'completed', !actionSteps.find(s => s.id === stepId)?.completed);
  };

  const completedSteps = actionSteps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / actionSteps.length) * 100;

  return (
    <div
      {...commonProps}
      onClick={onClick}
      className={cn(
        'min-h-[800px] p-8',
        `bg-gradient-to-br ${themeClasses.bg}`,
        `border ${themeClasses.border} rounded-lg`,
        'transition-all duration-300',
        isSelected && `ring-2 ring-${theme}-500`,
        className
      )}
    >
      {/* Botão de Edição */}
      {isSelected && (
        <div className="absolute top-2 right-2">
          <Button
            size="sm"
            variant={isEditMode ? "default" : "outline"}
            onClick={(e) => {
              e.stopPropagation();
              toggleEditMode();
            }}
          >
            {isEditMode ? 'Salvar' : 'Editar'}
          </Button>
        </div>
      )}

      {/* Cabeçalho */}
      <div className="text-center mb-8">
        {isEditMode ? (
          <div className="space-y-3">
            <input
              type="text"
              value={title}
              onChange={(e) => handlePropertyChange('title', e.target.value)}
              placeholder="Título do plano"
              className="w-full text-3xl font-bold text-center p-2 border border-gray-300 rounded"
            />
            <textarea
              value={subtitle}
              onChange={(e) => handlePropertyChange('subtitle', e.target.value)}
              placeholder="Subtítulo"
              rows={2}
              className="w-full text-center p-2 border border-gray-300 rounded resize-none"
            />
          </div>
        ) : (
          <div>
            <h1 className={cn('text-3xl font-bold mb-3', themeClasses.accent)}>
              {title}
            </h1>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          </div>
        )}

        {/* Informações do Plano */}
        <div className="flex justify-center items-center gap-6 mt-6">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-5 h-5" />
            {isEditMode ? (
              <input
                type="text"
                value={timeframe}
                onChange={(e) => handlePropertyChange('timeframe', e.target.value)}
                className="p-1 border border-gray-300 rounded"
              />
            ) : (
              <span className="font-medium">{timeframe}</span>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <Target className="w-5 h-5" />
            <span className="font-medium">{actionSteps.length} etapas</span>
          </div>

          {showProgress && (
            <div className="flex items-center gap-2 text-gray-600">
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">{progressPercentage.toFixed(0)}% concluído</span>
            </div>
          )}
        </div>

        {/* Barra de Progresso Geral */}
        {showProgress && (
          <div className="max-w-md mx-auto mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={cn(
                  'h-3 rounded-full transition-all duration-1000 ease-out',
                  themeClasses.timeline
                )}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Lista de Passos do Plano */}
      <div className={cn(
        layoutStyle === 'timeline' && 'relative',
        layoutStyle === 'cards' && 'grid grid-cols-1 md:grid-cols-2 gap-6',
        layoutStyle === 'list' && 'space-y-4'
      )}>
        {/* Linha do Timeline */}
        {layoutStyle === 'timeline' && (
          <div className={cn(
            'absolute left-6 top-0 bottom-0 w-0.5',
            themeClasses.timeline
          )} />
        )}

        {actionSteps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              'relative',
              layoutStyle === 'timeline' && 'flex gap-6 mb-8',
              layoutStyle !== 'timeline' && 'bg-white rounded-lg border p-6 shadow-sm'
            )}
          >
            {/* Indicador do Timeline */}
            {layoutStyle === 'timeline' && (
              <div className="flex-shrink-0">
                <div
                  className={cn(
                    'w-12 h-12 rounded-full border-4 border-white shadow-lg flex items-center justify-center font-bold text-white',
                    step.completed ? 'bg-green-500' : themeClasses.timeline
                  )}
                >
                  {step.completed ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
              </div>
            )}

            {/* Conteúdo do Passo */}
            <div className={cn(
              layoutStyle === 'timeline' && 'flex-1 bg-white rounded-lg border p-6 shadow-sm',
              layoutStyle === 'timeline' && themeClasses.card
            )}>
              {/* Cabeçalho do Passo */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {/* Fase */}
                  {isEditMode ? (
                    <input
                      type="text"
                      value={step.phase}
                      onChange={(e) => updateActionStep(step.id, 'phase', e.target.value)}
                      className="text-sm font-medium text-gray-500 p-1 border border-gray-300 rounded mb-2 w-full"
                    />
                  ) : (
                    <div className="text-sm font-medium text-gray-500 mb-2">
                      {step.phase}
                    </div>
                  )}

                  {/* Título */}
                  {isEditMode ? (
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => updateActionStep(step.id, 'title', e.target.value)}
                      className="text-xl font-semibold p-1 border border-gray-300 rounded w-full"
                    />
                  ) : (
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {step.title}
                    </h3>
                  )}

                  {/* Descrição */}
                  {isEditMode ? (
                    <textarea
                      value={step.description}
                      onChange={(e) => updateActionStep(step.id, 'description', e.target.value)}
                      rows={2}
                      className="w-full p-2 border border-gray-300 rounded resize-none"
                    />
                  ) : (
                    <p className="text-gray-600 mb-4">
                      {step.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2 ml-4">
                  {/* Prioridade */}
                  {showPriorities && (
                    <Badge className={cn('text-xs', getPriorityColor(step.priority))}>
                      {step.priority}
                    </Badge>
                  )}

                  {/* Checkbox de Conclusão */}
                  {!isEditMode && (
                    <Button
                      size="sm"
                      variant={step.completed ? "default" : "outline"}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTaskCompletion(step.id);
                      }}
                    >
                      {step.completed ? <CheckCircle className="w-4 h-4" /> : 'Marcar como Feito'}
                    </Button>
                  )}

                  {/* Botão Remover (Modo Edição) */}
                  {isEditMode && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeActionStep(step.id)}
                    >
                      Remover
                    </Button>
                  )}
                </div>
              </div>

              {/* Tarefas */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Tarefas
                </h4>
                
                {isEditMode ? (
                  <div className="space-y-2">
                    {step.tasks.map((task, taskIndex) => (
                      <div key={taskIndex} className="flex gap-2">
                        <input
                          type="text"
                          value={task}
                          onChange={(e) => {
                            const newTasks = [...step.tasks];
                            newTasks[taskIndex] = e.target.value;
                            updateActionStep(step.id, 'tasks', newTasks);
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const newTasks = step.tasks.filter((_, i) => i !== taskIndex);
                            updateActionStep(step.id, 'tasks', newTasks);
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newTasks = [...step.tasks, 'Nova tarefa'];
                        updateActionStep(step.id, 'tasks', newTasks);
                      }}
                      className="w-full border-dashed"
                    >
                      + Adicionar Tarefa
                    </Button>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {step.tasks.map((task, taskIndex) => (
                      <li key={taskIndex} className="flex items-start gap-3 text-gray-700">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                        <span className="text-sm">{task}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Tempo Estimado */}
              {showTimeEstimates && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  {isEditMode ? (
                    <input
                      type="text"
                      value={step.estimatedTime}
                      onChange={(e) => updateActionStep(step.id, 'estimatedTime', e.target.value)}
                      className="p-1 border border-gray-300 rounded"
                    />
                  ) : (
                    <span>{step.estimatedTime}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Botão Adicionar Novo Passo */}
        {isEditMode && (
          <div
            className={cn(
              'bg-white/50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-white/70 transition-colors',
              layoutStyle === 'timeline' && 'ml-18'
            )}
            onClick={addActionStep}
          >
            <Button variant="outline" className="w-full">
              + Adicionar Novo Passo
            </Button>
          </div>
        )}
      </div>

      {/* Botão de Ação Principal */}
      {!isEditMode && (
        <div className="text-center mt-8">
          <Button
            size="lg"
            className={cn(
              'px-8 py-3 text-lg font-medium text-white rounded-lg',
              'transition-all duration-200 transform hover:scale-105',
              'shadow-lg hover:shadow-xl',
              themeClasses.button
            )}
          >
            Começar Meu Plano
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}

      {/* Controles de Edição */}
      {isEditMode && (
        <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
          {/* Opções de Exibição */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={showProgress ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showProgress', !showProgress)}
            >
              Mostrar Progresso
            </Badge>
            
            <Badge
              variant={showTimeEstimates ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showTimeEstimates', !showTimeEstimates)}
            >
              Tempo Estimado
            </Badge>

            <Badge
              variant={showPriorities ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handlePropertyChange('showPriorities', !showPriorities)}
            >
              Prioridades
            </Badge>
          </div>

          {/* Layout */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Layout
            </label>
            <div className="flex gap-2">
              {['timeline', 'cards', 'list'].map((layout) => (
                <Badge
                  key={layout}
                  variant={layoutStyle === layout ? "default" : "outline"}
                  className="cursor-pointer capitalize"
                  onClick={() => handlePropertyChange('layoutStyle', layout)}
                >
                  {layout}
                </Badge>
              ))}
            </div>
          </div>

          {/* Tema */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tema
            </label>
            <div className="flex gap-2">
              {['blue', 'green', 'purple'].map((color) => (
                <Badge
                  key={color}
                  variant={theme === color ? "default" : "outline"}
                  className="cursor-pointer capitalize"
                  onClick={() => handlePropertyChange('theme', color)}
                >
                  {color}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizActionPlanInlineBlock;
