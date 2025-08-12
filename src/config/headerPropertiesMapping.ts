// Mapeamento padrão para propriedades do cabeçalho
import { Block } from '@/types/editor';

export interface HeaderProperties {
  logoUrl: string;
  logoAlt: string;
  logoWidth: number;
  logoHeight: number;
  showProgress: boolean;
  progressValue: number;
  progressMax: number;
  showBackButton: boolean;
  backgroundColor: string;
  isSticky: boolean;
  marginTop: number;
  marginBottom: number;
}

export const defaultHeaderProperties: HeaderProperties = {
  logoUrl: 'https://placehold.co/200x60',
  logoAlt: 'Logo',
  logoWidth: 200,
  logoHeight: 60,
  showProgress: true,
  progressValue: 0,
  progressMax: 100,
  showBackButton: true,
  backgroundColor: '#ffffff',
  isSticky: true,
  marginTop: 0,
  marginBottom: 24
};

export const convertLegacyHeader = (block: Block): HeaderProperties => {
  if (!block.properties) return defaultHeaderProperties;

  // Converter cabeçalho aninhado
  if (block.properties.header) {
    return {
      ...defaultHeaderProperties,
      ...block.properties.header
    };
  }

  // Converter propriedades diretas
  return {
    ...defaultHeaderProperties,
    ...block.properties
  };
};

export const createHeaderBlock = (stageId: string): Block => {
  return {
    id: `${stageId}-header`,
    type: 'quiz-intro-header',
    properties: defaultHeaderProperties,
    order: 0,
    stageId
  };
};
