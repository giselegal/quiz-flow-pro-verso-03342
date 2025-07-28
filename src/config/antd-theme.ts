
import type { ThemeConfig } from 'antd';

export const quizQuestTheme: ThemeConfig = {
  token: {
    // Cores da marca Quiz Quest
    colorPrimary: '#1890ff', // Azul principal
    colorSuccess: '#52c41a', // Verde de sucesso
    colorWarning: '#faad14', // Amarelo de aviso
    colorError: '#ff4d4f',   // Vermelho de erro
    colorInfo: '#1890ff',    // Azul de info
    
    // Typography
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    
    // Layout
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    
    // Spacing
    paddingXS: 8,
    paddingSM: 12,
    padding: 16,
    paddingMD: 20,
    paddingLG: 24,
    paddingXL: 32,
    
    // Colors específicas para Quiz Quest
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#f5f5f5',
    colorBorder: '#d9d9d9',
    colorBorderSecondary: '#f0f0f0',
    
    // Cores customizadas para diferentes tipos de quiz
    colorLink: '#1890ff',
    colorLinkHover: '#40a9ff',
    colorText: '#000000d9',
    colorTextSecondary: '#00000073',
    colorTextTertiary: '#00000040',
    colorTextQuaternary: '#00000026',
    
    // Shadows
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
    boxShadowSecondary: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
  },
  
  components: {
    Button: {
      primaryColor: '#fff',
      algorithm: true,
      borderRadius: 8,
      controlHeight: 40,
      paddingInline: 24,
      fontWeight: 500,
    },
    
    Input: {
      borderRadius: 8,
      controlHeight: 40,
      paddingInline: 12,
    },
    
    Select: {
      borderRadius: 8,
      controlHeight: 40,
    },
    
    Card: {
      borderRadius: 12,
      boxShadowTertiary: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)',
      paddingLG: 24,
    },
    
    Modal: {
      borderRadius: 12,
      paddingContentHorizontal: 24,
      paddingMD: 20,
    },
    
    Table: {
      borderRadius: 8,
      colorBorderSecondary: '#f0f0f0',
    },
    
    Menu: {
      borderRadius: 8,
      itemBorderRadius: 6,
    },
    
    Tabs: {
      borderRadius: 8,
      cardBg: '#fafafa',
    },
    
    Badge: {
      borderRadius: 10,
      fontWeight: 500,
    },
    
    Tag: {
      borderRadius: 6,
      fontWeight: 500,
    },
    
    Progress: {
      defaultColor: '#1890ff',
      remainingColor: '#f5f5f5',
    }
  },
  
  // Algoritmo de cores para diferentes estados
  algorithm: [],
};

// Cores específicas para categorias de quiz
export const quizCategoryColors = {
  geral: '#1890ff',
  educacao: '#52c41a', 
  entretenimento: '#fa8c16',
  business: '#722ed1',
  tecnologia: '#13c2c2',
  saude: '#eb2f96',
  esportes: '#f5222d',
  historia: '#faad14',
  ciencia: '#52c41a',
  arte: '#eb2f96'
};

// Cores para níveis de dificuldade
export const difficultyColors = {
  easy: '#52c41a',
  medium: '#faad14', 
  hard: '#ff4d4f'
};

// Cores para status
export const statusColors = {
  published: '#52c41a',
  draft: '#faad14',
  archived: '#8c8c8c',
  public: '#1890ff',
  private: '#722ed1'
};
