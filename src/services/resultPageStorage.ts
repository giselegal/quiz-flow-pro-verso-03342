import { ResultPageConfig } from '@/types/resultPageConfig';
import { appLogger } from '@/lib/utils/appLogger';

const STORAGE_KEY_PREFIX = 'result_page_config_';

export const resultPageStorage = {
  save: (config: ResultPageConfig): boolean => {
    try {
      if (!config || !config.styleType) {
        appLogger.error('Configuração inválida ou styleType não definido');
        return false;
      }

      const key = `${STORAGE_KEY_PREFIX}${config.styleType}`;
      localStorage.setItem(key, JSON.stringify(config));
      appLogger.info(`Configuração salva para ${config.styleType}`);
      return true;
    } catch (error) {
      appLogger.error('Erro ao salvar configuração:', { data: [error] });
      return false;
    }
  },

  load: (styleType: string): ResultPageConfig | null => {
    try {
      if (!styleType) {
        appLogger.error('styleType não definido');
        return null;
      }

      const key = `${STORAGE_KEY_PREFIX}${styleType}`;
      const storedConfig = localStorage.getItem(key);

      if (storedConfig) {
        appLogger.info(`Configuração carregada para ${styleType}`);
        return JSON.parse(storedConfig);
      } else {
        appLogger.info(`Nenhuma configuração encontrada para ${styleType}`);
        return null;
      }
    } catch (error) {
      appLogger.error('Erro ao carregar configuração:', { data: [error] });
      return null;
    }
  },

  delete: (styleType: string): boolean => {
    try {
      if (!styleType) {
        appLogger.error('styleType não definido');
        return false;
      }

      const key = `${STORAGE_KEY_PREFIX}${styleType}`;
      localStorage.removeItem(key);
      appLogger.info(`Configuração excluída para ${styleType}`);
      return true;
    } catch (error) {
      appLogger.error('Erro ao excluir configuração:', { data: [error] });
      return false;
    }
  },

  getAllStyles: (): string[] => {
    try {
      const styles: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
          styles.push(key.replace(STORAGE_KEY_PREFIX, ''));
        }
      }
      return styles;
    } catch (error) {
      appLogger.error('Erro ao obter estilos:', { data: [error] });
      return [];
    }
  },
};
