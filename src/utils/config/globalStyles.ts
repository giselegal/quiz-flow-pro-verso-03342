/**
 * TODO: TypeScript Migration - Deadline: Janeiro 2025
 * - [ ] Expandir interface com propriedades CSS específicas (margins, paddings, borders)
 * - [ ] Criar types para cores (HexColor, RgbaColor) com validação
 * - [ ] Implementar theme variants (light, dark, high-contrast)
 * - [ ] Adicionar factory methods para diferentes themes/brands
 * - [ ] Separar configurações de logo das configurações de estilo
 */

import { appLogger } from '../logger';

// Tipos mínimos para migração
type CssColor = string; // TODO: implementar validação hex/rgba
type CssFontFamily = string;
type CssLength = string; // TODO: validar unidades CSS

export interface GlobalStylesConfig {
  primaryColor: CssColor;
  secondaryColor: CssColor;
  textColor: CssColor;
  backgroundColor: CssColor;
  fontFamily: CssFontFamily;
  logo?: string;
  logoHeight?: CssLength;
  logoAlt?: string;
}

export const createGlobalStyles = (): GlobalStylesConfig => {
  appLogger.debug('Creating global styles configuration');

  return {
    primaryColor: '#B89B7A',
    secondaryColor: '#432818',
    textColor: '#1A1818',
    backgroundColor: '#FAF9F7',
    fontFamily: 'Inter, sans-serif',
    logo: '',
    logoHeight: 'auto',
    logoAlt: 'Logo da marca',
  };
};
