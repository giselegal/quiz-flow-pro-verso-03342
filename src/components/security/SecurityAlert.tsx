/**
 * Componente de Alerta de Segurança
 * Exibe alertas críticos de segurança de forma não intrusiva
 */

import React from 'react';
import { useSecurity } from '@/providers/SecurityProvider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  XCircle, 
  X,
  ExternalLink
} from 'lucide-react';

interface SecurityAlertProps {
  onDismiss?: () => void;
  showDetails?: boolean;
}

export const SecurityAlert: React.FC<SecurityAlertProps> = ({ 
  onDismiss,
  showDetails = false 
}) => {
  const { 
    systemStatus, 
    hasCriticalIssues, 
    hasWarnings,
    isSystemHealthy 
  } = useSecurity();

  // Não mostrar se o sistema está saudável
  if (isSystemHealthy) {
    return null;
  }

  const getCriticalCount = () => {
    return (systemStatus?.summary?.critical_metrics || 0) + 
           (systemStatus?.summary?.critical_events || 0);
  };

  const getWarningCount = () => {
    return (systemStatus?.summary?.warning_metrics || 0) + 
           (systemStatus?.summary?.high_severity_events || 0);
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      {hasCriticalIssues && (
        <Alert variant="destructive" className="mb-2 shadow-lg border-2">
          <XCircle className="h-4 w-4" />
          <AlertDescription className="flex items-start justify-between">
            <div className="flex-1">
              <div className="font-semibold mb-1">🚨 Alerta Crítico de Segurança</div>
              <div className="text-sm">
                {getCriticalCount()} problemas críticos detectados no sistema.
                {showDetails && systemStatus && (
                  <div className="mt-2 space-y-1">
                    {systemStatus.summary.critical_metrics > 0 && (
                      <div>• {systemStatus.summary.critical_metrics} métricas críticas</div>
                    )}
                    {systemStatus.summary.critical_events > 0 && (
                      <div>• {systemStatus.summary.critical_events} eventos críticos</div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" className="h-7">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Ver Dashboard
                </Button>
              </div>
            </div>
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="h-6 w-6 p-0 ml-2 text-destructive-foreground hover:bg-destructive/20"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}

      {hasWarnings && !hasCriticalIssues && (
        <Alert className="shadow-lg">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-start justify-between">
            <div className="flex-1">
              <div className="font-semibold mb-1">⚠️ Avisos de Performance</div>
              <div className="text-sm">
                {getWarningCount()} avisos detectados. Sistema operacional mas com problemas de performance.
                {showDetails && systemStatus && (
                  <div className="mt-2 space-y-1">
                    {systemStatus.summary.warning_metrics > 0 && (
                      <div>• {systemStatus.summary.warning_metrics} métricas com aviso</div>
                    )}
                    {systemStatus.summary.high_severity_events > 0 && (
                      <div>• {systemStatus.summary.high_severity_events} eventos de alta severidade</div>
                    )}
                  </div>
                )}
              </div>
            </div>
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="h-6 w-6 p-0 ml-2"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default SecurityAlert;