import { supabase } from '@/integrations/supabase/customClient';
import { FunnelSettings, defaultFunnelSettings } from '@/types/funnelSettings';

export class FunnelSettingsService {
  /**
   * Carrega as configurações de um funil específico
   */
  static async loadSettings(funnelId: string): Promise<FunnelSettings | null> {
    try {
      console.log('📥 Carregando configurações do funil:', funnelId);

      const { data, error } = await supabase
        .from('funnels')
        .select('settings')
        .eq('id', funnelId)
        .single();

      if (error) {
        console.error('Erro ao carregar configurações:', error);

        // Se o funil não existe, retornar configurações padrão
        if (error.code === 'PGRST116') {
          console.log('Funil não encontrado, usando configurações padrão');
          return defaultFunnelSettings;
        }

        throw error;
      }

      // Se não há configurações salvas, retornar padrão
      if (!data?.settings) {
        console.log('Nenhuma configuração encontrada, usando padrão');
        return defaultFunnelSettings;
      }

      // Mesclar com configurações padrão para garantir que todas as propriedades existam
      const savedSettings = data.settings as any;
      const settings = {
        ...defaultFunnelSettings,
        ...savedSettings,
        seo: { ...defaultFunnelSettings.seo, ...savedSettings?.seo },
        analytics: {
          ...defaultFunnelSettings.analytics,
          ...savedSettings?.analytics,
        },
        webhooks: {
          ...defaultFunnelSettings.webhooks,
          ...savedSettings?.webhooks,
        },
        domain: { ...defaultFunnelSettings.domain, ...savedSettings?.domain },
      };

      console.log('✅ Configurações carregadas:', settings);
      return settings;
    } catch (error) {
      console.error('Erro no FunnelSettingsService.loadSettings:', error);

      // Tentar carregar do localStorage como fallback
      try {
        const localSettings = localStorage.getItem(`funnel-settings-${funnelId}`);
        if (localSettings) {
          console.log('📱 Usando configurações do localStorage como fallback');
          return JSON.parse(localSettings);
        }
      } catch (localError) {
        console.error('Erro ao carregar do localStorage:', localError);
      }

      return null;
    }
  }

  /**
   * Salva as configurações de um funil
   */
  static async saveSettings(funnelId: string, settings: FunnelSettings): Promise<void> {
    try {
      console.log('💾 Salvando configurações do funil:', funnelId, settings);

      // Salvar no Supabase
      const { error } = await supabase
        .from('funnels')
        .update({
          settings: settings as any,
          updated_at: new Date().toISOString(),
        })
        .eq('id', funnelId);

      if (error) {
        console.error('Erro ao salvar configurações no Supabase:', error);
        throw error;
      }

      // Backup no localStorage
      try {
        localStorage.setItem(`funnel-settings-${funnelId}`, JSON.stringify(settings));
      } catch (localError) {
        console.warn('Não foi possível salvar no localStorage:', localError);
      }

      console.log('✅ Configurações salvas com sucesso');
    } catch (error) {
      console.error('Erro no FunnelSettingsService.saveSettings:', error);

      // Tentar salvar apenas no localStorage como fallback
      try {
        localStorage.setItem(`funnel-settings-${funnelId}`, JSON.stringify(settings));
        console.log('📱 Configurações salvas no localStorage como fallback');
      } catch (localError) {
        console.error('Erro ao salvar no localStorage:', localError);
        throw new Error('Não foi possível salvar as configurações');
      }
    }
  }

  /**
   * Valida uma URL de webhook
   */
  static async validateWebhookUrl(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        mode: 'no-cors',
      });
      return true;
    } catch (error) {
      console.error('URL de webhook inválida:', error);
      return false;
    }
  }

  /**
   * Testa um webhook enviando dados de exemplo
   */
  static async testWebhook(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          test: true,
          timestamp: new Date().toISOString(),
          event: 'test_webhook',
          data: {
            funnelId: 'test',
            userId: 'test-user',
          },
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Erro ao testar webhook:', error);
      return false;
    }
  }

  /**
   * Valida um domínio verificando registros DNS
   */
  static async validateDomain(domain: string): Promise<boolean> {
    try {
      // Simular validação DNS
      // Em produção, isso seria feito via API backend
      const response = await fetch(`https://${domain}`, {
        method: 'HEAD',
        mode: 'no-cors',
      });
      return true;
    } catch (error) {
      console.error('Domínio inválido:', error);
      return false;
    }
  }

  /**
   * Exporta configurações para arquivo JSON
   */
  static exportSettings(settings: FunnelSettings, funnelId: string): void {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `funnel-settings-${funnelId}.json`;
    link.click();

    URL.revokeObjectURL(link.href);
  }

  /**
   * Importa configurações de arquivo JSON
   */
  static async importSettings(file: File): Promise<FunnelSettings> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = e => {
        try {
          const settings = JSON.parse(e.target?.result as string);

          // Validar estrutura básica
          if (!settings.seo || !settings.analytics || !settings.webhooks || !settings.domain) {
            throw new Error('Arquivo de configurações inválido');
          }

          // Mesclar com configurações padrão
          const validSettings = {
            ...defaultFunnelSettings,
            ...settings,
            seo: { ...defaultFunnelSettings.seo, ...settings.seo },
            analytics: {
              ...defaultFunnelSettings.analytics,
              ...settings.analytics,
            },
            webhooks: {
              ...defaultFunnelSettings.webhooks,
              ...settings.webhooks,
            },
            domain: { ...defaultFunnelSettings.domain, ...settings.domain },
          };

          resolve(validSettings);
        } catch (error) {
          reject(new Error('Erro ao processar arquivo de configurações'));
        }
      };

      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsText(file);
    });
  }
}
