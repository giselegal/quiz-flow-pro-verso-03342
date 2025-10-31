/**/**

 * 💾 SAVE STATUS INDICATOR * 💾 SAVE STATUS INDICATOR

  *  * 

 * Fase 2.2 - Visual indicator de auto - save * Fase 2.2 - Visual indicator de auto - save

  *  * 

 * Mostra status do save em tempo real: * Mostra status do save em tempo real:

 * - "Salvando..."(azul, spinner) * - "Salvando..."(azul, spinner)

  * - "Salvo"(verde, checkmark) * - "Salvo"(verde, checkmark)

  * - "Erro ao salvar"(vermelho, X) * - "Erro ao salvar"(vermelho, X)

  * - Oculto quando idle * - Oculto quando idle

    *  * 

 * @version 2.0 - Simplificado para Fase 2 * @version 2.0 - Simplificado para Fase 2

  * / */



import React from 'react'; import React from 'react';

import { Loader2, Check, X, Clock } from 'lucide-react'; import { Loader2, Check, X, Clock } from 'lucide-react';

import { cn } from '@/lib/utils'; import { cn } from '@/lib/utils';



export type SaveStatus = 'idle' | 'pending' | 'saving' | 'saved' | 'error'; export type SaveStatus = 'idle' | 'pending' | 'saving' | 'saved' | 'error';



export interface SaveStatusIndicatorProps {export interface SaveStatusIndicatorProps {

  status: SaveStatus; status: SaveStatus;

  className?: string; className?: string;

}}



export const SaveStatusIndicator: React.FC<SaveStatusIndicatorProps> = ({
  export const SaveStatusIndicator: React.FC<SaveStatusIndicatorProps> = ({

    status, status,

    className, className,

  }) => { }) => {

  // Não mostrar quando idle  // Não mostrar quando idle

  if (status === 'idle') return null; if (status === 'idle') return null;



  return (  return (

    <div    <div

      className={cn(className = {
      cn(

        'fixed top-16 right-4 z-[9998] px-3 py-2 rounded-lg shadow-lg transition-all',        'fixed top-16 right-4 z-[9998] px-3 py-2 rounded-lg shadow-lg transition-all',

        'flex items-center gap-2 text-sm font-medium',        'flex items-center gap-2 text-sm font-medium',

        {        {

          'bg-blue-50 text-blue-700 border border-blue-200': status === 'pending', 'bg-blue-50 text-blue-700 border border-blue-200': status === 'pending',

      'bg-blue-500 text-white': status === 'saving', 'bg-blue-500 text-white': status === 'saving',

      'bg-green-500 text-white': status === 'saved', 'bg-green-500 text-white': status === 'saved',

      'bg-red-500 text-white': status === 'error', 'bg-red-500 text-white': status === 'error',

        },        },

        className        className

      )}      )}

    >    >

  { status === 'pending' && ({ status === 'pending' && (

    <>        <>

      <Clock className="w-4 h-4" />          <Clock className="w-4 h-4" />

      <span>Pendente...</span>          <span>Pendente...</span>

    </>        </>

  )}      )}



{
  status === 'saving' && ({ status === 'saving' && (

    <>        <>

      <Loader2 className="w-4 h-4 animate-spin" />          <Loader2 className="w-4 h-4 animate-spin" />

      <span>Salvando...</span>          <span>Salvando...</span>

    </>        </>

  )}      )}



{
  status === 'saved' && ({ status === 'saved' && (

    <>        <>

      <Check className="w-4 h-4" />          <Check className="w-4 h-4" />

      <span>Salvo</span>          <span>Salvo</span>

    </>        </>

  )}      )}



{
  status === 'error' && ({ status === 'error' && (

    <>        <>

      <X className="w-4 h-4" />          <X className="w-4 h-4" />

      <span>Erro ao salvar</span>          <span>Erro ao salvar</span>

    </>        </>

  )}      )}

    </div >    </div >

  );  );

};};



export default SaveStatusIndicator; export default SaveStatusIndicator;


/**
 * 🔄 INDICADOR DE STATUS DE SALVAMENTO
 * 
 * Componente que mostra:
 * - Status atual do salvamento
 * - Última vez que foi salvo
 * - Botão para salvamento manual
 * - Indicadores visuais claros
 */
export const SaveStatusIndicator: React.FC<SaveStatusIndicatorProps> = ({
  funnelId,
  autoSaveEnabled = true,
  lastSaved,
  isSaving = false,
  onManualSave,
}) => {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(lastSaved || null);
  const [currentFunnelId, setCurrentFunnelId] = useState<string>('');

  // 🎯 Determinar funil atual
  useEffect(() => {
    const activeFunnelId = funnelId || getFunnelIdFromEnvOrStorage() || 'quiz-estilo-completo';
    setCurrentFunnelId(activeFunnelId);
  }, [funnelId]);

  // 🔄 Atualizar status baseado nas props
  useEffect(() => {
    if (isSaving) {
      setSaveStatus('saving');
    } else if (lastSaved) {
      setSaveStatus('saved');
      setLastSaveTime(lastSaved);
    }
  }, [isSaving, lastSaved]);

  // 💾 Salvamento manual
  const handleManualSave = async () => {
    if (!currentFunnelId) {
      toast({
        title: 'Erro',
        description: 'Nenhum funil ativo para salvar',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaveStatus('saving');
      appLogger.debug('💾 Iniciando salvamento manual para funil:', currentFunnelId);

      // Se há um callback customizado, usar ele
      if (onManualSave) {
        await onManualSave();
      } else {
        // Caso contrário, tentar salvar com o serviço padrão
        // Aqui você pode adicionar lógica para coletar os dados atuais do editor
        toast({
          title: 'Salvamento manual',
          description: 'Use o botão de salvar no editor para salvar as alterações',
          variant: 'default',
        });
      }

      setSaveStatus('saved');
      setLastSaveTime(new Date());

      toast({
        title: 'Salvo com sucesso',
        description: 'Suas alterações foram salvas no Supabase',
        variant: 'default',
      });
    } catch (error) {
      appLogger.error('❌ Erro no salvamento manual:', error);
      setSaveStatus('error');

      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar as alterações',
        variant: 'destructive',
      });
    }
  };

  // 🎨 Configuração visual baseada no status
  const getStatusConfig = () => {
    switch (saveStatus) {
      case 'saving':
        return {
          icon: '⏳',
          text: 'Salvando...',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
        };
      case 'saved':
        return {
          icon: '✅',
          text: 'Salvo',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
        };
      case 'unsaved':
        return {
          icon: '⚠️',
          text: 'Não salvo',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
        };
      case 'error':
        return {
          icon: '❌',
          text: 'Erro',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
        };
      default:
        return {
          icon: '💾',
          text: 'Desconhecido',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
        };
    }
  };

  const config = getStatusConfig();

  // 🕒 Formato de tempo relativo
  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) return 'agora';
    if (diffMins === 1) return '1 min atrás';
    if (diffMins < 60) return `${diffMins} mins atrás`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hora atrás';
    if (diffHours < 24) return `${diffHours} horas atrás`;

    return date.toLocaleDateString();
  };

  return (
    <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-lg border ${config.bgColor} ${config.borderColor}`}>
      {/* 🎯 Status Principal */}
      <div className="flex items-center gap-2">
        <span className="text-lg">{config.icon}</span>
        <span className={`font-medium ${config.color}`}>
          {config.text}
        </span>
      </div>

      {/* 🕒 Informações de Tempo */}
      {lastSaveTime && saveStatus === 'saved' && (
        <div className="text-sm text-gray-500 border-l border-gray-300 pl-3">
          {getTimeAgo(lastSaveTime)}
        </div>
      )}

      {/* 🎯 Informações do Funil */}
      {currentFunnelId && (
        <div className="text-sm text-gray-500 border-l border-gray-300 pl-3">
          <span className="font-mono text-xs">
            {currentFunnelId}
          </span>
        </div>
      )}

      {/* 💾 Botão de Salvamento Manual */}
      {!isSaving && (
        <button
          onClick={handleManualSave}
          className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
          title="Forçar salvamento manual"
        >
          <span>💾</span>
          Salvar
        </button>
      )}

      {/* 🔄 Auto-save Indicator */}
      {autoSaveEnabled && (
        <div className="text-xs text-gray-400 border-l border-gray-300 pl-3">
          Auto-save ON
        </div>
      )}
    </div>
  );
};

/**
 * 🎯 VERSÃO COMPACTA DO INDICADOR
 * Para uso em toolbars ou espaços limitados
 */
export const CompactSaveIndicator: React.FC<Pick<SaveStatusIndicatorProps, 'isSaving' | 'lastSaved'>> = ({
  isSaving,
  lastSaved,
}) => {
  if (isSaving) {
    return (
      <div className="flex items-center gap-1 text-blue-600">
        <span className="animate-spin">⏳</span>
        <span className="text-sm">Salvando...</span>
      </div>
    );
  }

  if (lastSaved) {
    const now = new Date();
    const diffMs = now.getTime() - lastSaved.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    return (
      <div className="flex items-center gap-1 text-green-600">
        <span>✅</span>
        <span className="text-sm">
          {diffMins < 1 ? 'Salvo agora' : `Salvo há ${diffMins}min`}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-gray-500">
      <span>💾</span>
      <span className="text-sm">Não salvo</span>
    </div>
  );
};

export default SaveStatusIndicator;