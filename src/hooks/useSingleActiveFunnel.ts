/**
 * 🔍 VERIFICADOR DE FUNIL ÚNICO - Hook para garantir apenas um funil ativo
 * 
 * Este hook verifica se existe apenas um funil ativo no sistema e
 * garante que ele seja baseado no template quiz21StepsComplete.ts
 */

import { useState, useEffect } from 'react';

interface FunnelStatus {
    isUnique: boolean;
    activeFunnelId: string | null;
    origin: string | null;
    totalFunnels: number;
    cleanupPerformed: boolean;
    lastCleanup: string | null;
}

interface UseSingleActiveFunnelOptions {
    autoCleanup?: boolean;
    requiredOrigin?: string;
}

export const useSingleActiveFunnel = (options: UseSingleActiveFunnelOptions = {}) => {
    const {
        autoCleanup = true,
        requiredOrigin = 'quiz21StepsComplete.ts'
    } = options;

    const [status, setStatus] = useState<FunnelStatus>({
        isUnique: false,
        activeFunnelId: null,
        origin: null,
        totalFunnels: 0,
        cleanupPerformed: false,
        lastCleanup: null
    });

    const [isLoading, setIsLoading] = useState(true);

    const checkFunnelStatus = async () => {
        try {
            setIsLoading(true);

            // 1. Verificar localStorage
            const keys = Object.keys(localStorage);
            const funnelKeys = keys.filter(key =>
                key.startsWith('funnel-') ||
                key.startsWith('funnelData-') ||
                key.includes('funnel') ||
                key.includes('Funnel') ||
                key.includes('quiz') ||
                key.includes('Quiz')
            );

            console.log('🔍 Verificação de funis:', {
                totalKeys: keys.length,
                funnelKeys: funnelKeys.length,
                keys: funnelKeys
            });

            // 2. Buscar funil ativo principal
            const activeFunnelKey = 'active-funnel-main';
            const activeFunnelData = localStorage.getItem(activeFunnelKey);

            let activeFunnel = null;
            if (activeFunnelData) {
                try {
                    activeFunnel = JSON.parse(activeFunnelData);
                } catch (error) {
                    console.warn('❌ Erro ao parsear funil ativo:', error);
                }
            }

            // 3. Verificar se precisamos de limpeza
            const needsCleanup = funnelKeys.length > 1 ||
                !activeFunnel ||
                activeFunnel.origin !== requiredOrigin;

            // 4. Executar limpeza automática se necessário
            let cleanupPerformed = false;
            if (needsCleanup && autoCleanup) {
                console.log('🧹 Executando limpeza automática...');

                // Importar e executar limpeza
                if (typeof window !== 'undefined' && window.cleanupFunnels) {
                    const result = window.cleanupFunnels();
                    cleanupPerformed = result.success;

                    if (cleanupPerformed) {
                        // Recarregar dados após limpeza
                        const cleanedData = localStorage.getItem(activeFunnelKey);
                        if (cleanedData) {
                            activeFunnel = JSON.parse(cleanedData);
                        }
                    }
                }
            }

            // 5. Atualizar status
            const newStatus: FunnelStatus = {
                isUnique: activeFunnel && funnelKeys.length <= 1,
                activeFunnelId: activeFunnel?.id || null,
                origin: activeFunnel?.origin || null,
                totalFunnels: funnelKeys.length,
                cleanupPerformed,
                lastCleanup: localStorage.getItem('funnel-cleanup-timestamp')
            };

            setStatus(newStatus);

            console.log('📊 Status do funil:', newStatus);

        } catch (error) {
            console.error('❌ Erro na verificação de funil:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const forceCleanup = async () => {
        setIsLoading(true);
        try {
            if (typeof window !== 'undefined' && window.cleanupFunnels) {
                const result = window.cleanupFunnels();
                if (result.success) {
                    await checkFunnelStatus();
                    return result;
                }
            }
            return { success: false, error: 'Função de limpeza não disponível' };
        } catch (error) {
            console.error('❌ Erro na limpeza forçada:', error);
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    const getActiveFunnel = () => {
        try {
            const activeFunnelData = localStorage.getItem('active-funnel-main');
            return activeFunnelData ? JSON.parse(activeFunnelData) : null;
        } catch (error) {
            console.error('❌ Erro ao obter funil ativo:', error);
            return null;
        }
    };

    // Verificação inicial e listener para mudanças
    useEffect(() => {
        checkFunnelStatus();

        // Listener para evento de limpeza
        const handleCleanupComplete = (event) => {
            console.log('🎉 Limpeza detectada, atualizando status...');
            checkFunnelStatus();
        };

        window.addEventListener('funnelCleanupCompleted', handleCleanupComplete);

        // Listener para mudanças no localStorage
        const handleStorageChange = (event) => {
            if (event.key?.includes('funnel') || event.key?.includes('Funnel')) {
                checkFunnelStatus();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('funnelCleanupCompleted', handleCleanupComplete);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return {
        status,
        isLoading,
        checkFunnelStatus,
        forceCleanup,
        getActiveFunnel,
        // Utilitários
        isValid: status.isUnique && status.origin === requiredOrigin,
        needsCleanup: !status.isUnique || status.origin !== requiredOrigin
    };
};

export default useSingleActiveFunnel;
