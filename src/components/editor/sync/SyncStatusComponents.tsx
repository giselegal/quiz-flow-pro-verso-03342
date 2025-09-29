'use client';

/**
 * 🔄 SYNC STATUS COMPONENTS - FASE 3
 * 
 * Componentes visuais para mostrar status de sincronização,
 * auto-save, conflitos e estado online/offline.
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Wifi, WifiOff, Cloud, CloudOff, CheckCircle, AlertCircle,
    Clock, Zap, RefreshCw, AlertTriangle, Shield
} from 'lucide-react';

// ===============================
// 🎯 INTERFACES
// ===============================

export interface SyncStatusProps {
    status: 'synced' | 'saving' | 'offline' | 'error';
    lastSaved?: string;
    isDirty?: boolean;
    isOnline?: boolean;
    className?: string;
}

export interface ConflictIndicatorProps {
    conflicts: any[];
    onResolveConflict?: (conflictId: string, resolution: 'local' | 'remote') => void;
    className?: string;
}

export interface AutoSaveIndicatorProps {
    isAutoSaving: boolean;
    autoSaveInterval: number;
    lastAutoSave?: string;
    className?: string;
}

// ===============================
// 🔄 STATUS DE SINCRONIZAÇÃO
// ===============================

export const SyncStatusIndicator: React.FC<SyncStatusProps> = ({
    status,
    lastSaved,
    isDirty = false,
    isOnline = true,
    className = ''
}) => {
    const getStatusConfig = () => {
        switch (status) {
            case 'saving':
                return {
                    icon: <Cloud className="w-4 h-4 animate-pulse text-blue-500" />,
                    text: 'Salvando...',
                    variant: 'secondary' as const,
                    color: 'text-blue-600'
                };

            case 'synced':
                return {
                    icon: <CheckCircle className="w-4 h-4 text-green-500" />,
                    text: lastSaved ? `Salvo às ${lastSaved}` : 'Sincronizado',
                    variant: 'default' as const,
                    color: 'text-green-600'
                };

            case 'offline':
                return {
                    icon: <WifiOff className="w-4 h-4 text-orange-500" />,
                    text: 'Offline - Salvará quando conectar',
                    variant: 'secondary' as const,
                    color: 'text-orange-600'
                };

            case 'error':
                return {
                    icon: <AlertCircle className="w-4 h-4 text-red-500" />,
                    text: 'Erro de sincronização',
                    variant: 'destructive' as const,
                    color: 'text-red-600'
                };

            default:
                return {
                    icon: <Wifi className="w-4 h-4 text-gray-500" />,
                    text: 'Conectando...',
                    variant: 'outline' as const,
                    color: 'text-gray-600'
                };
        }
    };

    const config = getStatusConfig();

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {/* Status principal */}
            <div className="flex items-center gap-2">
                {config.icon}
                <span className={`text-sm ${config.color}`}>
                    {config.text}
                </span>
            </div>

            {/* Indicadores adicionais */}
            <div className="flex items-center gap-2">
                {isDirty && (
                    <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        Não salvo
                    </Badge>
                )}

                {!isOnline && (
                    <Badge variant="secondary" className="text-xs">
                        <WifiOff className="w-3 h-3 mr-1" />
                        Offline
                    </Badge>
                )}

                {status === 'error' && (
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                        <RefreshCw className="w-3 h-3 mr-1" />
                        <span className="text-xs">Tentar novamente</span>
                    </Button>
                )}
            </div>
        </div>
    );
};

// ===============================
// 💾 INDICADOR DE AUTO-SAVE
// ===============================

export const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({
    isAutoSaving,
    autoSaveInterval,
    lastAutoSave,
    className = ''
}) => {
    return (
        <Card className={`${className}`}>
            <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    Auto-Save
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        {isAutoSaving ? (
                            <div className="flex items-center gap-1 text-blue-600">
                                <RefreshCw className="w-3 h-3 animate-spin" />
                                <span>Salvando...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 text-green-600">
                                <CheckCircle className="w-3 h-3" />
                                <span>Ativo</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Intervalo:</span>
                        <Badge variant="outline" className="text-xs">
                            {autoSaveInterval / 1000}s
                        </Badge>
                    </div>

                    {lastAutoSave && (
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Último save:</span>
                            <span className="text-xs">{lastAutoSave}</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

// ===============================
// ⚠️ INDICADOR DE CONFLITOS
// ===============================

export const ConflictIndicator: React.FC<ConflictIndicatorProps> = ({
    conflicts,
    onResolveConflict,
    className = ''
}) => {
    if (conflicts.length === 0) {
        return null;
    }

    return (
        <Alert className={`border-orange-200 bg-orange-50 ${className}`}>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription>
                <div className="space-y-3">
                    <div className="font-medium text-orange-800">
                        {conflicts.length} conflito(s) de sincronização detectado(s)
                    </div>

                    <div className="space-y-2">
                        {conflicts.map((conflict, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                                <div className="text-sm">
                                    <div className="font-medium">{conflict.type}</div>
                                    <div className="text-muted-foreground text-xs">
                                        {conflict.timestamp}
                                    </div>
                                </div>

                                {onResolveConflict && (
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onResolveConflict(conflict.id, 'local')}
                                            className="h-6 px-2 text-xs"
                                        >
                                            Usar Local
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onResolveConflict(conflict.id, 'remote')}
                                            className="h-6 px-2 text-xs"
                                        >
                                            Usar Remoto
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </AlertDescription>
        </Alert>
    );
};

// ===============================
// 🌐 INDICADOR DE CONECTIVIDADE
// ===============================

export const ConnectivityIndicator: React.FC<{
    isOnline: boolean;
    className?: string;
}> = ({ isOnline, className = '' }) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {isOnline ? (
                <>
                    <Wifi className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600">Online</span>
                </>
            ) : (
                <>
                    <WifiOff className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-orange-600">Offline</span>
                </>
            )}
        </div>
    );
};

// ===============================
// 🛡️ PAINEL DE STATUS COMPLETO
// ===============================

export interface SyncStatusPanelProps {
    syncStatus: 'synced' | 'saving' | 'offline' | 'error';
    isOnline: boolean;
    isDirty: boolean;
    isSyncing: boolean;
    lastSaved?: string;
    conflicts: any[];
    autoSaveInterval: number;
    onResolveConflict?: (conflictId: string, resolution: 'local' | 'remote') => void;
    onForceSync?: () => void;
    className?: string;
}

export const SyncStatusPanel: React.FC<SyncStatusPanelProps> = ({
    syncStatus,
    isOnline,
    isDirty,
    isSyncing,
    lastSaved,
    conflicts,
    autoSaveInterval,
    onResolveConflict,
    onForceSync,
    className = ''
}) => {
    return (
        <Card className={`${className}`}>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Status de Sincronização
                    <Badge variant="outline">FASE 3</Badge>
                </CardTitle>
                <CardDescription>
                    Monitoramento em tempo real da sincronização bidirecional
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Status principal */}
                <SyncStatusIndicator
                    status={syncStatus}
                    lastSaved={lastSaved}
                    isDirty={isDirty}
                    isOnline={isOnline}
                />

                {/* Conectividade */}
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Conectividade:</span>
                    <ConnectivityIndicator isOnline={isOnline} />
                </div>

                {/* Auto-save info */}
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Auto-save:</span>
                    <div className="flex items-center gap-2">
                        <Badge variant={isSyncing ? "default" : "outline"} className="text-xs">
                            {isSyncing ? 'Ativo' : `${autoSaveInterval / 1000}s`}
                        </Badge>
                        {isSyncing && <RefreshCw className="w-3 h-3 animate-spin text-blue-500" />}
                    </div>
                </div>

                {/* Conflitos */}
                {conflicts.length > 0 && (
                    <ConflictIndicator
                        conflicts={conflicts}
                        onResolveConflict={onResolveConflict}
                    />
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t">
                    {onForceSync && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onForceSync}
                            disabled={isSyncing}
                            className="flex-1"
                        >
                            <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                            {isSyncing ? 'Sincronizando...' : 'Forçar Sync'}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default SyncStatusPanel;