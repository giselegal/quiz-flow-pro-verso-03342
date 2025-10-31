// 🚀 FASE 3.5: Service Worker Manager
// Gerenciador de registro e comunicação com Service Worker

export class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private updateAvailable = false;

  /**
   * Registrar Service Worker
   */
  async register(): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) {
      console.warn('[SW Manager] Service Workers não suportados neste navegador');
      return null;
    }

    try {
      console.log('[SW Manager] Registrando Service Worker...');
      
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('[SW Manager] Service Worker registrado:', this.registration.scope);

      // Monitorar atualizações
      this.setupUpdateListener();

      // Verificar atualizações periodicamente (a cada hora)
      setInterval(() => {
        this.checkForUpdates();
      }, 60 * 60 * 1000);

      return this.registration;
    } catch (error) {
      console.error('[SW Manager] Erro ao registrar Service Worker:', error);
      return null;
    }
  }

  /**
   * Desregistrar Service Worker
   */
  async unregister(): Promise<boolean> {
    if (!this.registration) {
      return false;
    }

    try {
      const success = await this.registration.unregister();
      console.log('[SW Manager] Service Worker desregistrado:', success);
      return success;
    } catch (error) {
      console.error('[SW Manager] Erro ao desregistrar Service Worker:', error);
      return false;
    }
  }

  /**
   * Verificar atualizações manualmente
   */
  async checkForUpdates(): Promise<void> {
    if (!this.registration) {
      return;
    }

    try {
      await this.registration.update();
      console.log('[SW Manager] Verificação de atualização concluída');
    } catch (error) {
      console.error('[SW Manager] Erro ao verificar atualizações:', error);
    }
  }

  /**
   * Ativar atualização pendente
   */
  async activateUpdate(): Promise<void> {
    if (!this.registration || !this.registration.waiting) {
      return;
    }

    // Enviar mensagem para o SW waiting ativar
    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });

    // Recarregar página quando o novo SW assumir controle
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }

  /**
   * Limpar todos os caches
   */
  async clearCache(): Promise<boolean> {
    if (!this.registration || !this.registration.active) {
      return false;
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.success || false);
      };

      this.registration!.active!.postMessage(
        { type: 'CLEAR_CACHE' },
        [messageChannel.port2]
      );
    });
  }

  /**
   * Pré-cachear URLs específicas
   */
  async cacheUrls(urls: string[]): Promise<boolean> {
    if (!this.registration || !this.registration.active) {
      return false;
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.success || false);
      };

      this.registration!.active!.postMessage(
        { type: 'CACHE_URLS', urls },
        [messageChannel.port2]
      );
    });
  }

  /**
   * Verificar se está online
   */
  isOnline(): boolean {
    return navigator.onLine;
  }

  /**
   * Verificar se há atualização disponível
   */
  hasUpdateAvailable(): boolean {
    return this.updateAvailable;
  }

  /**
   * Monitorar eventos de atualização do SW
   */
  private setupUpdateListener(): void {
    if (!this.registration) {
      return;
    }

    // Detectar SW waiting (nova versão disponível)
    this.registration.addEventListener('updatefound', () => {
      const newWorker = this.registration!.installing;
      
      if (!newWorker) {
        return;
      }

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // Nova versão disponível
          this.updateAvailable = true;
          console.log('[SW Manager] Nova versão disponível');
          
          // Disparar evento customizado
          window.dispatchEvent(new CustomEvent('sw-update-available', {
            detail: { registration: this.registration },
          }));
        }
      });
    });
  }
}

// Instância singleton
export const swManager = new ServiceWorkerManager();

/**
 * Hook React para usar Service Worker
 */
export function useServiceWorker() {
  const [isOnline, setIsOnline] = React.useState(swManager.isOnline());
  const [updateAvailable, setUpdateAvailable] = React.useState(false);

  React.useEffect(() => {
    // Registrar SW na montagem
    swManager.register();

    // Monitorar status online/offline
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Monitorar atualizações do SW
    const handleUpdate = () => setUpdateAvailable(true);
    window.addEventListener('sw-update-available', handleUpdate);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('sw-update-available', handleUpdate);
    };
  }, []);

  const activateUpdate = React.useCallback(() => {
    swManager.activateUpdate();
  }, []);

  const clearCache = React.useCallback(async () => {
    return swManager.clearCache();
  }, []);

  return {
    isOnline,
    updateAvailable,
    activateUpdate,
    clearCache,
  };
}

// Adicionar import do React
import React from 'react';
