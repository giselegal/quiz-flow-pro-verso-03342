/**
 * 📡 PUBLICATION SETTINGS BUTTON
 * 
 * Botão para acessar configurações técnicas de publicação
 * Integrado ao toolbar existente
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings } from 'lucide-react';
import { FunnelPublicationPanel } from '@/components/editor/publication/FunnelPublicationPanel';
import { useFunnelPublication } from '@/hooks/useFunnelPublication';

interface PublicationSettingsButtonProps {
    funnelId: string;
    funnelTitle?: string;
    className?: string;
}

export function PublicationSettingsButton({
    funnelId,
    funnelTitle = 'Funil',
    className = ''
}: PublicationSettingsButtonProps) {
    const [showDialog, setShowDialog] = useState(false);

    const {
        settings,
        updateSettings,
        publishFunnel,
        isPublishing,
        getPublicationStatus,
        generatePreviewUrl
    } = useFunnelPublication(funnelId, {
        autoSave: true
    });

    const publicationStatus = getPublicationStatus();

    const handlePublish = async () => {
        try {
            await publishFunnel();
            setShowDialog(false);
            // Aqui você pode adicionar uma notificação de sucesso
            console.log('✅ Funil publicado com sucesso!', generatePreviewUrl());
        } catch (error) {
            console.error('❌ Erro ao publicar funil:', error);
            // Aqui você pode adicionar uma notificação de erro
        }
    };

    const getStatusConfig = () => {
        switch (publicationStatus) {
            case 'published':
                return {
                    icon: '🟢',
                    label: 'Online',
                    variant: 'default' as const,
                    color: 'text-green-600'
                };
            case 'error':
                return {
                    icon: '🔴',
                    label: 'Erro',
                    variant: 'destructive' as const,
                    color: 'text-red-600'
                };
            default:
                return {
                    icon: '⭕',
                    label: 'Rascunho',
                    variant: 'secondary' as const,
                    color: 'text-yellow-600'
                };
        }
    };

    const statusConfig = getStatusConfig();

    return (
        <>
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        className={`flex items-center gap-2 ${className}`}
                        title="Configurações de Publicação"
                    >
                        <Settings className="w-4 h-4" />
                        <span className="hidden sm:inline">{isPublishing ? 'Publicando…' : 'Publicação'}</span>

                        {/* Status Badge */}
                        <Badge
                            variant={statusConfig.variant}
                            className="ml-1 text-xs flex items-center gap-1"
                        >
                            <span>{statusConfig.icon}</span>
                            <span className="hidden md:inline">{statusConfig.label}</span>
                        </Badge>
                    </Button>
                </DialogTrigger>

                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            📡 Configurações de Publicação
                            <Badge variant="outline" className="text-xs">
                                {funnelTitle}
                            </Badge>
                        </DialogTitle>
                    </DialogHeader>

                    <FunnelPublicationPanel
                        funnelId={funnelId}
                        settings={settings}
                        onSettingsChange={updateSettings}
                        onPublish={handlePublish}
                    />
                </DialogContent>
            </Dialog>

            {/* Quick Access Preview URL */}
            {publicationStatus === 'published' && (
                <div className="hidden lg:flex items-center ml-2">
                    <a
                        href={generatePreviewUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                        title="Ver funil publicado"
                    >
                        🔗 Ver online
                    </a>
                </div>
            )}
        </>
    );
}

/**
 * 🎯 QUICK PUBLICATION STATUS
 * 
 * Indicador compacto de status de publicação
 */
export function QuickPublicationStatus({
    funnelId,
    showUrl = false
}: {
    funnelId: string;
    showUrl?: boolean;
}) {
    const { getPublicationStatus, generatePreviewUrl } = useFunnelPublication(funnelId);
    const status = getPublicationStatus();
    const url = generatePreviewUrl();

    const statusConfig = {
        published: { icon: '🟢', label: 'Online', color: 'text-green-600' },
        error: { icon: '🔴', label: 'Erro', color: 'text-red-600' },
        draft: { icon: '⭕', label: 'Rascunho', color: 'text-yellow-600' }
    };

    const config = statusConfig[status];

    return (
        <div className="flex items-center gap-2 text-sm">
            <span className={config.color}>
                {config.icon} {config.label}
            </span>

            {showUrl && status === 'published' && (
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-xs"
                >
                    {url.replace('https://', '')}
                </a>
            )}
        </div>
    );
}

/**
 * 🚀 QUICK PUBLISH BUTTON
 * 
 * Botão rápido para publicar sem abrir o modal completo
 */
export function QuickPublishButton({
    funnelId,
    className = '',
    size = 'default'
}: {
    funnelId: string;
    className?: string;
    size?: 'sm' | 'default' | 'lg';
}) {
    const { publishFunnel, isPublishing, getPublicationStatus } = useFunnelPublication(funnelId);
    const status = getPublicationStatus();

    const handleQuickPublish = async () => {
        try {
            await publishFunnel();
            // Notificação de sucesso
        } catch (error) {
            console.error('Erro na publicação rápida:', error);
            // Notificação de erro
        }
    };

    const getButtonConfig = () => {
        if (isPublishing) {
            return {
                icon: '🚀',
                label: 'Publicando...',
                disabled: true,
                className: 'bg-gradient-to-r from-blue-600 to-purple-600'
            };
        }

        if (status === 'published') {
            return {
                icon: '🔄',
                label: 'Atualizar',
                disabled: false,
                className: 'bg-gradient-to-r from-green-600 to-emerald-600'
            };
        }

        return {
            icon: '📡',
            label: 'Publicar',
            disabled: false,
            className: 'bg-gradient-to-r from-blue-600 to-purple-600'
        };
    };

    const buttonConfig = getButtonConfig();

    return (
        <Button
            size={size}
            onClick={handleQuickPublish}
            disabled={buttonConfig.disabled}
            className={`flex items-center gap-2 ${buttonConfig.className} hover:opacity-90 ${className}`}
        >
            <span>{buttonConfig.icon}</span>
            <span className="hidden sm:inline">{buttonConfig.label}</span>
        </Button>
    );
}
