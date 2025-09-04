// Mapeamento padrão para propriedades do cabeçalho
import { Block, EditableContent } from '@/types/editor';

export interface HeaderProperties {
  logoUrl: string;
  logoAlt: string;
  logoWidth: number;
  logoHeight: number;
  // 🎛️ Toggle Controls - Advanced Header Configuration
  showLogo?: boolean; // Nova propriedade para controlar visibilidade do logo
  showProgress: boolean;
  progressValue: number;
  progressMax: number;
  showBackButton: boolean;
  backgroundColor: string;
  isSticky: boolean;
  marginTop: number;
  marginBottom: number;
  // 🎨 Propriedades avançadas de configuração de header
  logoPosition?: 'left' | 'center' | 'right';
  headerStyle?: 'default' | 'minimal' | 'compact' | 'full';
  showBorder?: boolean;
  borderColor?: string;
  enableAnimation?: boolean;
  customCssClass?: string;
  // 📊 Configurações de progresso avançadas
  progressHeight?: number;
  progressStyle?: 'bar' | 'circle' | 'dots';
  progressColor?: string;
  progressBackgroundColor?: string;
  // 🔙 Configurações de botão de voltar avançadas
  backButtonStyle?: 'icon' | 'text' | 'both';
  backButtonText?: string;
  backButtonPosition?: 'left' | 'right';
}

export const defaultHeaderProperties: HeaderProperties = {
  logoUrl: 'https://placehold.co/200x60',
  logoAlt: 'Logo',
  logoWidth: 200,
  logoHeight: 60,
  // 🎛️ Toggle Controls - Advanced Header Configuration
  showLogo: true,
  showProgress: true,
  progressValue: 0,
  progressMax: 100,
  showBackButton: true,
  backgroundColor: '#ffffff',
  isSticky: true,
  marginTop: 0,
  marginBottom: 24,
  // 🎨 Propriedades avançadas de configuração de header
  logoPosition: 'center',
  headerStyle: 'default',
  showBorder: false,
  borderColor: '#E5E7EB',
  enableAnimation: true,
  customCssClass: '',
  // 📊 Configurações de progresso avançadas
  progressHeight: 4,
  progressStyle: 'bar',
  progressColor: '#B89B7A',
  progressBackgroundColor: '#E5DDD5',
  // 🔙 Configurações de botão de voltar avançadas
  backButtonStyle: 'icon',
  backButtonText: 'Voltar',
  backButtonPosition: 'left',
};

export const convertLegacyHeader = (block: Block): HeaderProperties => {
  if (!block.properties) return defaultHeaderProperties;

  // Converter cabeçalho aninhado
  if (block.properties.header) {
    return {
      ...defaultHeaderProperties,
      ...block.properties.header,
    };
  }

  // Converter propriedades diretas
  return {
    ...defaultHeaderProperties,
    ...block.properties,
  };
};

export const createHeaderBlock = (
  stageId: string
): Omit<Block, 'stageId'> & { stageId: string } => {
  return {
    id: `${stageId}-header`,
    type: 'quiz-intro-header',
    properties: defaultHeaderProperties,
    content: {
      type: 'doc',
      content: [],
    } as EditableContent,
    order: 0,
    stageId,
  };
};
