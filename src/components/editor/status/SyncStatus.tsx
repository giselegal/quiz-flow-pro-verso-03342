import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Cloud,
  CloudOff,
  Loader2,
  Save,
  Clock,
  AlertCircle,
  CheckCircle,
  History,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { type AutoSaveState } from '@/services/schemaDrivenFunnelService';

interface SyncStatusProps {
  autoSaveState: AutoSaveState;
  isSaving: boolean;
  isOnline: boolean;
  onManualSave: () => void;
  onSync: () => void;
  onToggleAutoSave: () => void;
  className?: string;
  compact?: boolean;
}

export const SyncStatus: React.FC<SyncStatusProps> = ({
  autoSaveState,
  isSaving,
  isOnline,
  onManualSave,
  onSync,
  onToggleAutoSave,
  className = '',
  compact = false,
}) => {
  const getStatusIcon = () => {
    if (isSaving) {
      return <Loader2 className="w-4 h-4 animate-spin" />;
    }

    if (!isOnline) {
      return <CloudOff className="w-4 h-4 text-orange-500" />;
    }

    if (autoSaveState.pendingChanges) {
      return <Clock className="w-4 h-4 text-yellow-500" />;
    }

    if (autoSaveState.errorCount > 0) {
      return <AlertCircle style={{ color: '#432818' }} />;
    }

    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  const getStatusText = () => {
    if (isSaving) {
      return 'Salvando...';
    }

    if (!isOnline) {
      return 'Offline';
    }

    if (autoSaveState.pendingChanges) {
      return 'Mudanças pendentes';
    }

    if (autoSaveState.errorCount > 0) {
      return `Erro no auto-save (${autoSaveState.errorCount})`;
    }

    if (autoSaveState.lastSave) {
      const timeDiff = Math.floor((Date.now() - autoSaveState.lastSave.getTime()) / 1000);
      if (timeDiff < 60) {
        return `Salvo há ${timeDiff}s`;
      } else if (timeDiff < 3600) {
        return `Salvo há ${Math.floor(timeDiff / 60)}m`;
      } else {
        return `Salvo há ${Math.floor(timeDiff / 3600)}h`;
      }
    }

    return 'Aguardando mudanças';
  };

  const getStatusBadgeVariant = () => {
    if (isSaving) return 'secondary';
    if (!isOnline) return 'destructive';
    if (autoSaveState.pendingChanges) return 'secondary';
    if (autoSaveState.errorCount > 0) return 'destructive';
    return 'default';
  };

  if (compact) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {/* Status icon */}
        <div className="flex items-center space-x-1">
          {getStatusIcon()}
          {!isOnline && <WifiOff className="w-3 h-3 text-gray-400" />}
          {isOnline && <Wifi className="w-3 h-3 text-green-400" />}
        </div>

        {/* Status badge */}
        <Badge variant={getStatusBadgeVariant()} className="text-xs">
          {getStatusText()}
        </Badge>

        {/* Auto-save indicator */}
        {autoSaveState.isEnabled && (
          <Badge variant="outline" className="text-xs">
            Auto-save: {autoSaveState.interval}s
          </Badge>
        )}

        {/* Quick actions */}
        <div className="flex space-x-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={onManualSave}
            disabled={isSaving}
            className="h-6 w-6 p-0"
            title="Salvar manualmente"
          >
            <Save className="w-3 h-3" />
          </Button>

          {!isOnline && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onSync}
              disabled={isSaving}
              className="h-6 w-6 p-0"
              title="Sincronizar com backend"
            >
              <Cloud className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center space-x-2">
          <span>Status de Sincronização</span>
          {!isOnline && <WifiOff className="w-4 h-4 text-orange-500" />}
          {isOnline && <Wifi className="w-4 h-4 text-green-500" />}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status principal */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="text-sm">{getStatusText()}</span>
          </div>
          <Badge variant={getStatusBadgeVariant()}>{isOnline ? 'Online' : 'Offline'}</Badge>
        </div>

        {/* Auto-save settings */}
        <div className="flex items-center justify-between">
          <div style={{ color: '#6B4F43' }}>
            Auto-save: {autoSaveState.isEnabled ? `${autoSaveState.interval}s` : 'Desabilitado'}
          </div>
          <Button size="sm" variant="outline" onClick={onToggleAutoSave} className="h-7 text-xs">
            {autoSaveState.isEnabled ? 'Desabilitar' : 'Habilitar'}
          </Button>
        </div>

        {/* Informações de erro */}
        {autoSaveState.errorCount > 0 && (
          <div style={{ color: '#432818' }}>
            <div className="flex items-center space-x-1">
              <AlertCircle className="w-3 h-3" />
              <span>Falhas no auto-save: {autoSaveState.errorCount}</span>
            </div>
            <div className="mt-1">Intervalo aumentado para {autoSaveState.interval}s</div>
          </div>
        )}

        {/* Última sincronização */}
        {autoSaveState.lastSave && (
          <div style={{ color: '#8B7355' }}>
            <History className="w-3 h-3" />
            <span>Última sincronização: {autoSaveState.lastSave.toLocaleTimeString()}</span>
          </div>
        )}

        {/* Ações */}
        <div className="flex space-x-2">
          <Button size="sm" onClick={onManualSave} disabled={isSaving} className="flex-1">
            {isSaving ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-3 h-3 mr-1" />
                Salvar Agora
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onSync}
            disabled={isSaving || isOnline}
            className="flex-1"
          >
            <Cloud className="w-3 h-3 mr-1" />
            Sincronizar
          </Button>
        </div>

        {/* Mudanças pendentes */}
        {autoSaveState.pendingChanges && (
          <div className="text-xs text-stone-600 bg-stone-50 p-2 rounded flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Existem mudanças não salvas no backend</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
