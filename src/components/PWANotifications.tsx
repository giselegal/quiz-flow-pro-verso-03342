// 🚀 FASE 3.5: Componente de notificação PWA
// Exibe banners para atualização disponível e status offline

import React, { useEffect, useState } from 'react';
import { AlertCircle, Download, WifiOff, X } from 'lucide-react';

interface PWANotificationsProps {
    className?: string;
}

export function PWANotifications({ className = '' }: PWANotificationsProps) {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [showOfflineBanner, setShowOfflineBanner] = useState(false);
    const [showUpdateBanner, setShowUpdateBanner] = useState(false);

    useEffect(() => {
        // Monitorar status online/offline
        const handleOnline = () => {
            setIsOnline(true);
            setShowOfflineBanner(false);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setShowOfflineBanner(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Monitorar atualizações do Service Worker
        const handleUpdateAvailable = () => {
            setUpdateAvailable(true);
            setShowUpdateBanner(true);
        };

        window.addEventListener('sw-update-available', handleUpdateAvailable);

        // Verificar status inicial
        if (!navigator.onLine) {
            setShowOfflineBanner(true);
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('sw-update-available', handleUpdateAvailable);
        };
    }, []);

    const handleUpdateClick = () => {
        // Recarregar para aplicar atualização
        window.location.reload();
    };

    const handleDismissUpdate = () => {
        setShowUpdateBanner(false);
    };

    const handleDismissOffline = () => {
        setShowOfflineBanner(false);
    };

    return (
        <div className={`fixed top-4 right-4 z-[9999] flex flex-col gap-2 ${className}`}>
            {/* Banner de Offline */}
            {showOfflineBanner && (
                <div className="bg-amber-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-md animate-slide-in-right">
                    <WifiOff className="w-5 h-5 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="font-medium text-sm">Modo Offline</p>
                        <p className="text-xs opacity-90">
                            Sem conexão. Recursos salvos em cache estão disponíveis.
                        </p>
                    </div>
                    <button
                        onClick={handleDismissOffline}
                        className="p-1 hover:bg-amber-600 rounded transition-colors"
                        aria-label="Fechar"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Banner de Atualização Disponível */}
            {showUpdateBanner && updateAvailable && (
                <div className="bg-indigo-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-md animate-slide-in-right">
                    <Download className="w-5 h-5 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="font-medium text-sm">Atualização Disponível</p>
                        <p className="text-xs opacity-90">
                            Uma nova versão do app está pronta.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleUpdateClick}
                            className="px-3 py-1 bg-white text-indigo-600 rounded text-sm font-medium hover:bg-indigo-50 transition-colors"
                        >
                            Atualizar
                        </button>
                        <button
                            onClick={handleDismissUpdate}
                            className="p-1 hover:bg-indigo-700 rounded transition-colors"
                            aria-label="Fechar"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Indicador de Status (sutil) */}
            {!isOnline && !showOfflineBanner && (
                <div className="bg-amber-100 border border-amber-300 text-amber-800 px-3 py-2 rounded-lg shadow flex items-center gap-2 text-xs">
                    <AlertCircle className="w-4 h-4" />
                    <span>Offline</span>
                </div>
            )}
        </div>
    );
}

// CSS para animação (adicionar ao index.css ou styles)
const styles = `
@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in-right {
  animation: slide-in-right 0.3s ease-out;
}
`;

// Exportar hook para usar em outros componentes
export function usePWAStatus() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [updateAvailable, setUpdateAvailable] = useState(false);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        const handleUpdate = () => setUpdateAvailable(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        window.addEventListener('sw-update-available', handleUpdate);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('sw-update-available', handleUpdate);
        };
    }, []);

    return { isOnline, updateAvailable };
}
