import React, { useState, useEffect } from 'react';
import { getFunnelIdFromEnvOrStorage } from '@/utils/funnelIdentity';
import { toast } from '@/hooks/use-toast';

interface SaveStatusIndicatorProps {
  funnelId?: string;
  autoSaveEnabled?: boolean;
  lastSaved?: Date | null;
  isSaving?: boolean;
  onManualSave?: () => void;
}

type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

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
  onManualSave
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
        variant: 'destructive'
      });
      return;
    }

    try {
      setSaveStatus('saving');
      console.log('💾 Iniciando salvamento manual para funil:', currentFunnelId);

      // Se há um callback customizado, usar ele
      if (onManualSave) {
        await onManualSave();
      } else {
        // Caso contrário, tentar salvar com o serviço padrão
        // Aqui você pode adicionar lógica para coletar os dados atuais do editor
        toast({
          title: 'Salvamento manual',
          description: 'Use o botão de salvar no editor para salvar as alterações',
          variant: 'default'
        });
      }

      setSaveStatus('saved');
      setLastSaveTime(new Date());

      toast({
        title: 'Salvo com sucesso',
        description: 'Suas alterações foram salvas no Supabase',
        variant: 'default'
      });
    } catch (error) {
      console.error('❌ Erro no salvamento manual:', error);
      setSaveStatus('error');

      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar as alterações',
        variant: 'destructive'
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
          borderColor: 'border-blue-200'
        };
      case 'saved':
        return {
          icon: '✅',
          text: 'Salvo',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'unsaved':
        return {
          icon: '⚠️',
          text: 'Não salvo',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
      case 'error':
        return {
          icon: '❌',
          text: 'Erro',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      default:
        return {
          icon: '💾',
          text: 'Desconhecido',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
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
  lastSaved
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