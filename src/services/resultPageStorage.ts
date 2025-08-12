import { ResultPageConfig } from '@/types/resultPageConfig';

const STORAGE_KEY_PREFIX = 'result_page_config_';

export const resultPageStorage = {
  save: (config: ResultPageConfig): boolean => {
    try {
      if (!config || !config.styleType) {
        console.error('Configuração inválida ou styleType não definido');
        return false;
      }

      const key = `${STORAGE_KEY_PREFIX}${config.styleType}`;
      localStorage.setItem(key, JSON.stringify(config));
      console.log(`Configuração salva para ${config.styleType}`);
      return true;
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      return false;
    }
  },

  load: (styleType: string): ResultPageConfig | null => {
    try {
      if (!styleType) {
        console.error('styleType não definido');
        return null;
      }

      const key = `${STORAGE_KEY_PREFIX}${styleType}`;
      const storedConfig = localStorage.getItem(key);

      if (storedConfig) {
        console.log(`Configuração carregada para ${styleType}`);
        return JSON.parse(storedConfig);
      } else {
        console.log(`Nenhuma configuração encontrada para ${styleType}`);
        return null;
      }
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
      return null;
    }
  },

  delete: (styleType: string): boolean => {
    try {
      if (!styleType) {
        console.error('styleType não definido');
        return false;
      }

      const key = `${STORAGE_KEY_PREFIX}${styleType}`;
      localStorage.removeItem(key);
      console.log(`Configuração excluída para ${styleType}`);
      return true;
    } catch (error) {
      console.error('Erro ao excluir configuração:', error);
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
      console.error('Erro ao obter estilos:', error);
      return [];
    }
  },
};
