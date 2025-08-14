import { defaultHeaderProperties } from '@/config/headerPropertiesMapping';
import { defaultOptionsGridProperties } from '@/config/optionsGridPropertiesMapping';
import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * 🎯 Enumerações e tipos fundamentais
 */
export enum PropertyType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  RANGE = 'range',
  COLOR = 'color',
  SELECT = 'select',
  SWITCH = 'switch',
  ARRAY = 'array',
  OBJECT = 'object',
  UPLOAD = 'upload',
  URL = 'url',
  DATE = 'date',
  TIME = 'time',
  DATETIME = 'datetime',
  JSON = 'json',
  RICH_TEXT = 'rich_text',
  MARKDOWN = 'markdown',
  CODE = 'code',
  EMAIL = 'email',
  PHONE = 'phone',
}

export enum PropertyCategory {
  CONTENT = 'content',
  STYLE = 'style',
  LAYOUT = 'layout',
  BEHAVIOR = 'behavior',
  ADVANCED = 'advanced',
  ANIMATION = 'animation',
  ACCESSIBILITY = 'accessibility',
  SEO = 'seo',
}

export type PropertyCategoryOrString = PropertyCategory | string;

/**
 * 🔧 Interface principal da propriedade
 */
export interface UnifiedProperty {
  key: string;
  value: any;
  type: PropertyType;
  label: string;
  category: PropertyCategoryOrString;
  description?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: any;
  validation?: (value: any) => boolean | string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: Array<{ value: any; label: string; disabled?: boolean }>;
  dependencies?: string[];
  conditional?: {
    key: string;
    value: any;
  };
}

export interface UnifiedBlock {
  id: string;
  type: string;
  properties?: Record<string, any>;
  content?: Record<string, any>; // 🎯 FIX: Adicionar support para content
  children?: string[];
  parentId?: string;
}

export interface UseUnifiedPropertiesReturn {
  properties: UnifiedProperty[];
  updateProperty: (key: string, value: any) => void;
  resetProperties: () => void;
  validateProperties: () => boolean;
  getPropertyByKey: (key: string) => UnifiedProperty | undefined;
  getPropertiesByCategory: (category: PropertyCategoryOrString) => UnifiedProperty[];
  exportProperties: () => Record<string, any>;
  applyBrandColors: () => void;
}

/**
 * ✨ Constantes de cores da marca
 */
const BRAND_COLORS = {
  primary: '#B89B7A',
  secondary: '#D4C2A8',
  accent: '#F3E8D3',
  text: '#432818',
  textPrimary: '#2c1810',
  textSecondary: '#8F7A6A',
  background: '#FEFDFB',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  white: '#FFFFFF',
  border: '#E5E7EB',
};

/**
 * 🏷️ Utilitários de criação
 */
const createProperty = (
  key: string,
  value: any,
  type: PropertyType,
  label: string,
  category: PropertyCategory,
  options?: any
): UnifiedProperty => ({
  key,
  value,
  type,
  label,
  category,
  ...options,
});

const createSelectOptions = (options: Array<{ value: string; label: string }>) => options;

/**
 * 🌟 Funções de propriedades universais
 */
const getUniversalProperties = (): UnifiedProperty[] => [
  // 0. Controles principais de cabeçalho/branding
  createProperty(
    'enableHeader',
    true,
    PropertyType.SWITCH,
    'Habilitar Cabeçalho',
    PropertyCategory.CONTENT
  ),
  createProperty('showLogo', true, PropertyType.SWITCH, 'Mostrar Logo', PropertyCategory.CONTENT),
  createProperty(
    'decorativeBar',
    false,
    PropertyType.SWITCH,
    'Barra Decorativa',
    PropertyCategory.CONTENT
  ),

  // 1. Margens externas (4 direções)
  createProperty('marginTop', 0, PropertyType.RANGE, 'Margem Superior', PropertyCategory.LAYOUT, {
    min: 0,
    max: 100,
    step: 2,
    unit: 'px',
  }),
  createProperty(
    'marginBottom',
    0,
    PropertyType.RANGE,
    'Margem Inferior',
    PropertyCategory.LAYOUT,
    { min: 0, max: 100, step: 2, unit: 'px' }
  ),
  createProperty('marginLeft', 0, PropertyType.RANGE, 'Margem Esquerda', PropertyCategory.LAYOUT, {
    min: 0,
    max: 100,
    step: 2,
    unit: 'px',
  }),
  createProperty('marginRight', 0, PropertyType.RANGE, 'Margem Direita', PropertyCategory.LAYOUT, {
    min: 0,
    max: 100,
    step: 2,
    unit: 'px',
  }),

  // 2. Margens internas (padding)
  createProperty('paddingTop', 0, PropertyType.RANGE, 'Padding Superior', PropertyCategory.LAYOUT, {
    min: 0,
    max: 100,
    step: 2,
    unit: 'px',
  }),
  createProperty(
    'paddingBottom',
    0,
    PropertyType.RANGE,
    'Padding Inferior',
    PropertyCategory.LAYOUT,
    { min: 0, max: 100, step: 2, unit: 'px' }
  ),
  createProperty(
    'paddingLeft',
    0,
    PropertyType.RANGE,
    'Padding Esquerdo',
    PropertyCategory.LAYOUT,
    {
      min: 0,
      max: 100,
      step: 2,
      unit: 'px',
    }
  ),
  createProperty(
    'paddingRight',
    0,
    PropertyType.RANGE,
    'Padding Direito',
    PropertyCategory.LAYOUT,
    {
      min: 0,
      max: 100,
      step: 2,
      unit: 'px',
    }
  ),

  // 3. Escala geral (tamanho)
  createProperty('sizeScale', '100%', PropertyType.SELECT, 'Tamanho', PropertyCategory.LAYOUT, {
    options: [
      { value: '50%', label: '50%' },
      { value: '100%', label: '100%' },
      { value: '110%', label: '110%' },
    ],
  }),

  // 4. Cores de fundo
  createProperty(
    'componentBackgroundColor',
    'transparent',
    PropertyType.COLOR,
    'Cor de Fundo do Componente',
    PropertyCategory.STYLE
  ),
  createProperty(
    'containerBackgroundColor',
    'transparent',
    PropertyType.COLOR,
    'Cor de Fundo do Container',
    PropertyCategory.STYLE
  ),
  createProperty(
    'canvasBackgroundColor',
    'transparent',
    PropertyType.COLOR,
    'Cor de Fundo do Canvas',
    PropertyCategory.STYLE
  ),

  // 5. Alinhamento
  createProperty(
    'textAlign',
    'center',
    PropertyType.SELECT,
    'Alinhamento',
    PropertyCategory.LAYOUT,
    {
      options: [
        { value: 'left', label: 'Esquerda' },
        { value: 'center', label: 'Centro' },
        { value: 'right', label: 'Direita' },
      ],
    }
  ),

  // 6. Largura do texto
  createProperty(
    'textWidth',
    '100%',
    PropertyType.SELECT,
    'Largura do Texto',
    PropertyCategory.LAYOUT,
    {
      options: [
        { value: 'auto', label: 'Automática' },
        { value: '100%', label: 'Total (100%)' },
        { value: '80%', label: '80%' },
        { value: '60%', label: '60%' },
      ],
    }
  ),
];

/**
 * 🎨 Propriedades básicas de texto
 */
const getTextProperties = (): UnifiedProperty[] => [
  createProperty(
    'text',
    'Digite seu texto aqui...',
    PropertyType.TEXT,
    'Texto',
    PropertyCategory.CONTENT
  ),
  createProperty('fontSize', 16, PropertyType.RANGE, 'Tamanho da Fonte', PropertyCategory.STYLE, {
    min: 10,
    max: 48,
    step: 1,
    unit: 'px',
  }),
  createProperty(
    'fontWeight',
    '400',
    PropertyType.SELECT,
    'Peso da Fonte',
    PropertyCategory.STYLE,
    {
      options: createSelectOptions([
        { value: '300', label: 'Leve (300)' },
        { value: '400', label: 'Normal (400)' },
        { value: '500', label: 'Médio (500)' },
        { value: '600', label: 'Semi-negrito (600)' },
        { value: '700', label: 'Negrito (700)' },
      ]),
    }
  ),
  createProperty(
    'textColor',
    BRAND_COLORS.text,
    PropertyType.COLOR,
    'Cor do Texto',
    PropertyCategory.STYLE
  ),
];

/**
 * 🎯 Hook principal para propriedades unificadas
 */
export const useUnifiedProperties = (
  blockType: string,
  blockId?: string,
  block?: UnifiedBlock | null,
  onUpdateExternal?: (blockId: string, updates: Partial<UnifiedBlock>) => void
): UseUnifiedPropertiesReturn => {
  const currentBlock = block;

  const generatedProperties = useMemo(() => {
    if (!blockType) return [];

    switch (blockType) {
      case 'text-inline':
        return [
          // Conteúdo
          createProperty(
            'content',
            currentBlock?.properties?.content ??
              currentBlock?.content?.text ??
              'Digite seu texto aqui...',
            PropertyType.TEXTAREA,
            'Conteúdo',
            PropertyCategory.CONTENT,
            { rows: 4 }
          ),

          // Tipografia
          createProperty(
            'fontSize',
            currentBlock?.properties?.fontSize ?? 'medium',
            PropertyType.SELECT,
            'Tamanho da Fonte',
            PropertyCategory.STYLE,
            {
              options: [
                { value: 'xs', label: 'XS' },
                { value: 'sm', label: 'SM' },
                { value: 'medium', label: 'Médio' },
                { value: 'lg', label: 'LG' },
                { value: 'xl', label: 'XL' },
                { value: '2xl', label: '2XL' },
                { value: '3xl', label: '3XL' },
              ],
            }
          ),
          createProperty(
            'fontWeight',
            currentBlock?.properties?.fontWeight ?? 'normal',
            PropertyType.SELECT,
            'Peso da Fonte',
            PropertyCategory.STYLE,
            {
              options: [
                { value: 'light', label: 'Leve' },
                { value: 'normal', label: 'Normal' },
                { value: 'medium', label: 'Médio' },
                { value: 'semibold', label: 'Semi-negrito' },
                { value: 'bold', label: 'Negrito' },
              ],
            }
          ),
          createProperty(
            'lineHeight',
            currentBlock?.properties?.lineHeight ?? 'leading-normal',
            PropertyType.SELECT,
            'Altura da Linha',
            PropertyCategory.STYLE,
            {
              options: [
                { value: 'leading-none', label: 'Muito compacta' },
                { value: 'leading-tight', label: 'Compacta' },
                { value: 'leading-snug', label: 'Ajustada' },
                { value: 'leading-normal', label: 'Normal' },
                { value: 'leading-relaxed', label: 'Relaxada' },
                { value: 'leading-loose', label: 'Solta' },
              ],
            }
          ),

          // Cores
          createProperty(
            'color',
            currentBlock?.properties?.color ?? BRAND_COLORS.text,
            PropertyType.COLOR,
            'Cor do Texto',
            PropertyCategory.STYLE
          ),
          createProperty(
            'backgroundColor',
            currentBlock?.properties?.backgroundColor ?? 'transparent',
            PropertyType.COLOR,
            'Cor de Fundo',
            PropertyCategory.STYLE
          ),

          // Layout
          createProperty(
            'textAlign',
            currentBlock?.properties?.textAlign ?? 'left',
            PropertyType.SELECT,
            'Alinhamento',
            PropertyCategory.LAYOUT,
            {
              options: [
                { value: 'left', label: 'Esquerda' },
                { value: 'center', label: 'Centro' },
                { value: 'right', label: 'Direita' },
                { value: 'justify', label: 'Justificado' },
              ],
            }
          ),
          createProperty(
            'gridColumns',
            currentBlock?.properties?.gridColumns ?? 'full',
            PropertyType.SELECT,
            'Largura do Bloco',
            PropertyCategory.LAYOUT,
            {
              options: [
                { value: 'full', label: '100% (linha inteira)' },
                { value: 'half', label: '50% (duas colunas)' },
                { value: 'auto', label: 'Automática' },
              ],
            }
          ),
          createProperty(
            'maxWidth',
            currentBlock?.properties?.maxWidth ?? 'auto',
            PropertyType.SELECT,
            'Largura Máxima',
            PropertyCategory.LAYOUT,
            {
              options: [
                { value: 'auto', label: 'Automática' },
                { value: '32rem', label: '32rem (~512px)' },
                { value: '40rem', label: '40rem (~640px)' },
                { value: '48rem', label: '48rem (~768px)' },
              ],
            }
          ),
          createProperty(
            'spacing',
            currentBlock?.properties?.spacing ?? 'normal',
            PropertyType.SELECT,
            'Espaçamento Interno',
            PropertyCategory.STYLE,
            {
              options: [
                { value: 'tight', label: 'Apertado' },
                { value: 'normal', label: 'Normal' },
                { value: 'loose', label: 'Solto' },
              ],
            }
          ),

          // Margens
          createProperty(
            'marginTop',
            currentBlock?.properties?.marginTop ?? 8,
            PropertyType.RANGE,
            'Margem Superior',
            PropertyCategory.LAYOUT,
            { min: -40, max: 100, step: 2, unit: 'px' }
          ),
          createProperty(
            'marginBottom',
            currentBlock?.properties?.marginBottom ?? 8,
            PropertyType.RANGE,
            'Margem Inferior',
            PropertyCategory.LAYOUT,
            { min: -40, max: 100, step: 2, unit: 'px' }
          ),
          createProperty(
            'marginLeft',
            currentBlock?.properties?.marginLeft ?? 0,
            PropertyType.RANGE,
            'Margem Esquerda',
            PropertyCategory.LAYOUT,
            { min: -40, max: 100, step: 2, unit: 'px' }
          ),
          createProperty(
            'marginRight',
            currentBlock?.properties?.marginRight ?? 0,
            PropertyType.RANGE,
            'Margem Direita',
            PropertyCategory.LAYOUT,
            { min: -40, max: 100, step: 2, unit: 'px' }
          ),
        ];

      case 'quiz-header':
      case 'quiz-intro-header':
        // Usar as propriedades padronizadas do HeaderProperties
        const headerProps = { ...defaultHeaderProperties, ...(currentBlock?.properties || {}) };

        return [
          ...getUniversalProperties(),

          // Logo
          createProperty(
            'logoUrl',
            headerProps.logoUrl,
            PropertyType.URL,
            'URL da Logo',
            PropertyCategory.CONTENT
          ),
          createProperty(
            'logoAlt',
            headerProps.logoAlt,
            PropertyType.TEXT,
            'Texto Alternativo',
            PropertyCategory.ACCESSIBILITY
          ),
          createProperty(
            'logoWidth',
            headerProps.logoWidth,
            PropertyType.RANGE,
            'Largura da Logo (px)',
            PropertyCategory.STYLE,
            { min: 50, max: 400, step: 10 }
          ),
          createProperty(
            'logoHeight',
            headerProps.logoHeight,
            PropertyType.RANGE,
            'Altura da Logo (px)',
            PropertyCategory.STYLE,
            { min: 50, max: 400, step: 10 }
          ),

          // Estilo
          createProperty(
            'backgroundColor',
            headerProps.backgroundColor,
            PropertyType.COLOR,
            'Cor de Fundo',
            PropertyCategory.STYLE
          ),

          // Layout
          createProperty(
            'marginTop',
            headerProps.marginTop,
            PropertyType.RANGE,
            'Margem Superior',
            PropertyCategory.LAYOUT,
            { min: 0, max: 100, step: 4 }
          ),
          createProperty(
            'marginBottom',
            headerProps.marginBottom,
            PropertyType.RANGE,
            'Margem Inferior',
            PropertyCategory.LAYOUT,
            { min: 0, max: 100, step: 4 }
          ),
        ];

      case 'image-display-inline':
        return [
          ...getUniversalProperties(),
          createProperty(
            'src',
            currentBlock?.properties?.src || '',
            PropertyType.UPLOAD,
            'Imagem',
            PropertyCategory.CONTENT
          ),
          createProperty(
            'alt',
            currentBlock?.properties?.alt || '',
            PropertyType.TEXT,
            'Texto Alternativo',
            PropertyCategory.ACCESSIBILITY
          ),
          createProperty(
            'width',
            currentBlock?.properties?.width || 'auto',
            PropertyType.TEXT,
            'Largura',
            PropertyCategory.LAYOUT
          ),
          createProperty(
            'height',
            currentBlock?.properties?.height || 'auto',
            PropertyType.TEXT,
            'Altura',
            PropertyCategory.LAYOUT
          ),
          createProperty(
            'borderRadius',
            currentBlock?.properties?.borderRadius ?? 12,
            PropertyType.RANGE,
            'Arredondamento',
            PropertyCategory.STYLE,
            { min: 0, max: 50, step: 2, unit: 'px' }
          ),
          createProperty(
            'shadow',
            currentBlock?.properties?.shadow !== false,
            PropertyType.SWITCH,
            'Sombra',
            PropertyCategory.STYLE
          ),
        ];

      case 'form-input':
        return [
          ...getUniversalProperties(),
          createProperty(
            'label',
            currentBlock?.properties?.label || 'Campo de Input',
            PropertyType.TEXT,
            'Rótulo do Campo',
            PropertyCategory.CONTENT
          ),
          createProperty(
            'placeholder',
            currentBlock?.properties?.placeholder || 'Digite aqui...',
            PropertyType.TEXT,
            'Texto de Placeholder',
            PropertyCategory.CONTENT
          ),
          createProperty(
            'inputType',
            currentBlock?.properties?.inputType || 'text',
            PropertyType.SELECT,
            'Tipo de Input',
            PropertyCategory.BEHAVIOR,
            {
              options: [
                { value: 'text', label: 'Texto' },
                { value: 'email', label: 'E-mail' },
                { value: 'tel', label: 'Telefone' },
                { value: 'number', label: 'Número' },
                { value: 'password', label: 'Senha' },
              ],
            }
          ),
          createProperty(
            'required',
            currentBlock?.properties?.required === true,
            PropertyType.SWITCH,
            'Campo Obrigatório',
            PropertyCategory.BEHAVIOR
          ),
          createProperty(
            'borderColor',
            currentBlock?.properties?.borderColor || BRAND_COLORS.primary,
            PropertyType.COLOR,
            'Cor da Borda',
            PropertyCategory.STYLE
          ),
          // 🔹 CONFIGURAÇÕES DO BOTÃO ASSOCIADO
          createProperty(
            'buttonText',
            currentBlock?.properties?.buttonText || 'Continuar',
            PropertyType.TEXT,
            'Texto do Botão',
            PropertyCategory.CONTENT
          ),
          createProperty(
            'buttonStyle',
            currentBlock?.properties?.buttonStyle || 'primary',
            PropertyType.SELECT,
            'Estilo do Botão',
            PropertyCategory.STYLE,
            {
              options: [
                { value: 'primary', label: 'Primário' },
                { value: 'secondary', label: 'Secundário' },
                { value: 'outline', label: 'Contorno' },
                { value: 'ghost', label: 'Fantasma' },
              ],
            }
          ),
          createProperty(
            'buttonSize',
            currentBlock?.properties?.buttonSize || 'medium',
            PropertyType.SELECT,
            'Tamanho do Botão',
            PropertyCategory.STYLE,
            {
              options: [
                { value: 'small', label: 'Pequeno' },
                { value: 'medium', label: 'Médio' },
                { value: 'large', label: 'Grande' },
                { value: 'full', label: 'Largura Total (Responsivo)' },
              ],
            }
          ),
          createProperty(
            'enableButtonWhenFilled',
            currentBlock?.properties?.enableButtonWhenFilled !== false,
            PropertyType.SWITCH,
            'Ativar Botão Apenas Quando Preenchido',
            PropertyCategory.BEHAVIOR
          ),
          // 🔹 CONFIGURAÇÕES DE NAVEGAÇÃO
          createProperty(
            'nextStepAction',
            currentBlock?.properties?.nextStepAction || 'next-step',
            PropertyType.SELECT,
            'Ação ao Avançar',
            PropertyCategory.BEHAVIOR,
            {
              options: [
                { value: 'next-step', label: 'Próxima Etapa Automática' },
                { value: 'specific-step', label: 'Etapa Específica' },
                { value: 'url', label: 'Abrir URL' },
                { value: 'submit', label: 'Enviar Formulário' },
              ],
            }
          ),
          createProperty(
            'specificStep',
            currentBlock?.properties?.specificStep || '',
            PropertyType.SELECT,
            'Etapa de Destino',
            PropertyCategory.BEHAVIOR,
            {
              options: [
                { value: 'step-01', label: 'Etapa 1' },
                { value: 'step-02', label: 'Etapa 2' },
                { value: 'step-03', label: 'Etapa 3' },
                { value: 'step-04', label: 'Etapa 4' },
                { value: 'step-05', label: 'Etapa 5' },
                { value: 'step-06', label: 'Etapa 6' },
                { value: 'step-07', label: 'Etapa 7' },
                { value: 'step-08', label: 'Etapa 8' },
                { value: 'step-09', label: 'Etapa 9' },
                { value: 'step-10', label: 'Etapa 10' },
                { value: 'results', label: 'Resultados' },
                { value: 'thank-you', label: 'Página de Agradecimento' },
              ],
            }
          ),
          createProperty(
            'targetUrl',
            currentBlock?.properties?.targetUrl || '',
            PropertyType.URL,
            'URL de Destino',
            PropertyCategory.BEHAVIOR
          ),
          // 🔹 CONFIGURAÇÕES AVANÇADAS
          createProperty(
            'minLength',
            currentBlock?.properties?.minLength || 1,
            PropertyType.RANGE,
            'Mínimo de Caracteres',
            PropertyCategory.BEHAVIOR,
            { min: 0, max: 50, step: 1 }
          ),
          createProperty(
            'maxLength',
            currentBlock?.properties?.maxLength || 255,
            PropertyType.RANGE,
            'Máximo de Caracteres',
            PropertyCategory.BEHAVIOR,
            { min: 1, max: 1000, step: 10 }
          ),
          createProperty(
            'validationPattern',
            currentBlock?.properties?.validationPattern || '',
            PropertyType.TEXT,
            'Padrão de Validação (RegEx)',
            PropertyCategory.ADVANCED
          ),
          createProperty(
            'errorMessage',
            currentBlock?.properties?.errorMessage || 'Por favor, preencha este campo',
            PropertyType.TEXT,
            'Mensagem de Erro',
            PropertyCategory.CONTENT
          ),
        ];

      case 'form-container':
        return [
          ...getUniversalProperties(),
          createProperty(
            'elementId',
            currentBlock?.properties?.elementId || 'quiz-form',
            PropertyType.TEXT,
            'ID do Elemento',
            PropertyCategory.ADVANCED
          ),
          createProperty(
            'className',
            currentBlock?.properties?.className || '',
            PropertyType.TEXT,
            'Classe CSS',
            PropertyCategory.ADVANCED
          ),
          createProperty(
            'backgroundColor',
            currentBlock?.properties?.backgroundColor ??
              currentBlock?.properties?.containerBackgroundColor ??
              'transparent',
            PropertyType.COLOR,
            'Cor de Fundo',
            PropertyCategory.STYLE
          ),
          // 🔒 Regras de ativação do botão por Nome (Step01)
          createProperty(
            'requireNameToEnableButton',
            currentBlock?.properties?.requireNameToEnableButton === true,
            PropertyType.SWITCH,
            'Exigir nome para ativar botão',
            PropertyCategory.BEHAVIOR
          ),
          createProperty(
            'nameInputId',
            currentBlock?.properties?.nameInputId || 'name-input-modular',
            PropertyType.TEXT,
            'ID do Campo de Nome',
            PropertyCategory.BEHAVIOR
          ),
          createProperty(
            'targetButtonId',
            currentBlock?.properties?.targetButtonId || 'cta-button-modular',
            PropertyType.TEXT,
            'ID do Botão a Ativar',
            PropertyCategory.BEHAVIOR
          ),
          createProperty(
            'visuallyDisableButton',
            currentBlock?.properties?.visuallyDisableButton !== false,
            PropertyType.SWITCH,
            'Desabilitar visualmente até validar',
            PropertyCategory.STYLE
          ),
        ];
      case 'button-inline':
        return [
          ...getUniversalProperties(),
          ...getTextProperties(),
          createProperty(
            'variant',
            currentBlock?.properties?.variant || 'primary',
            PropertyType.SELECT,
            'Variante',
            PropertyCategory.STYLE,
            {
              options: [
                { value: 'primary', label: 'Primário' },
                { value: 'secondary', label: 'Secundário' },
                { value: 'success', label: 'Sucesso' },
                { value: 'warning', label: 'Aviso' },
                { value: 'danger', label: 'Perigo' },
                { value: 'outline', label: 'Contorno' },
                { value: 'ghost', label: 'Fantasma' },
              ],
            }
          ),
          createProperty(
            'size',
            currentBlock?.properties?.size || 'medium',
            PropertyType.SELECT,
            'Tamanho',
            PropertyCategory.STYLE,
            {
              options: [
                { value: 'small', label: 'Pequeno' },
                { value: 'medium', label: 'Médio' },
                { value: 'large', label: 'Grande' },
                { value: 'full', label: 'Largura Total (Responsivo)' },
              ],
            }
          ),
          // 🔹 SISTEMA DE NAVEGAÇÃO AVANÇADO
          createProperty(
            'action',
            currentBlock?.properties?.action || 'next-step',
            PropertyType.SELECT,
            'Ação do Botão',
            PropertyCategory.BEHAVIOR,
            {
              options: [
                { value: 'none', label: 'Nenhuma Ação' },
                { value: 'next-step', label: 'Próxima Etapa Automática' },
                { value: 'specific-step', label: 'Etapa Específica' },
                { value: 'url', label: 'Abrir URL' },
                { value: 'submit', label: 'Enviar Formulário' },
                { value: 'download', label: 'Download de Arquivo' },
              ],
            }
          ),
          createProperty(
            'specificStep',
            currentBlock?.properties?.specificStep || '',
            PropertyType.SELECT,
            'Etapa de Destino',
            PropertyCategory.BEHAVIOR,
            {
              options: [
                { value: 'step-01', label: 'Etapa 1' },
                { value: 'step-02', label: 'Etapa 2' },
                { value: 'step-03', label: 'Etapa 3' },
                { value: 'step-04', label: 'Etapa 4' },
                { value: 'step-05', label: 'Etapa 5' },
                { value: 'step-06', label: 'Etapa 6' },
                { value: 'step-07', label: 'Etapa 7' },
                { value: 'step-08', label: 'Etapa 8' },
                { value: 'step-09', label: 'Etapa 9' },
                { value: 'step-10', label: 'Etapa 10' },
                { value: 'results', label: 'Resultados' },
                { value: 'thank-you', label: 'Página de Agradecimento' },
              ],
            }
          ),
          createProperty(
            'url',
            currentBlock?.properties?.url || '',
            PropertyType.URL,
            'URL de Destino',
            PropertyCategory.BEHAVIOR
          ),
          createProperty(
            'downloadUrl',
            currentBlock?.properties?.downloadUrl || '',
            PropertyType.URL,
            'URL do Arquivo para Download',
            PropertyCategory.BEHAVIOR
          ),
          createProperty(
            'openInNewTab',
            currentBlock?.properties?.openInNewTab !== false,
            PropertyType.SWITCH,
            'Abrir em Nova Aba',
            PropertyCategory.BEHAVIOR
          ),
          // 🔹 CONFIGURAÇÕES VISUAIS AVANÇADAS
          createProperty(
            'icon',
            currentBlock?.properties?.icon || '',
            PropertyType.TEXT,
            'Ícone (Nome ou SVG)',
            PropertyCategory.STYLE
          ),
          createProperty(
            'iconPosition',
            currentBlock?.properties?.iconPosition || 'left',
            PropertyType.SELECT,
            'Posição do Ícone',
            PropertyCategory.STYLE,
            {
              options: [
                { value: 'left', label: 'Esquerda' },
                { value: 'right', label: 'Direita' },
                { value: 'top', label: 'Acima' },
                { value: 'bottom', label: 'Abaixo' },
              ],
            }
          ),
          createProperty(
            'loading',
            currentBlock?.properties?.loading === true,
            PropertyType.SWITCH,
            'Estado de Carregamento',
            PropertyCategory.BEHAVIOR
          ),
          createProperty(
            'disabled',
            currentBlock?.properties?.disabled === true,
            PropertyType.SWITCH,
            'Botão Desabilitado',
            PropertyCategory.BEHAVIOR
          ),
          // 🔹 SISTEMA DE VALIDAÇÃO CONDICIONAL
          createProperty(
            'requiresValidInput',
            currentBlock?.properties?.requiresValidInput === true,
            PropertyType.SWITCH,
            'Ativar Apenas com Input Válido',
            PropertyCategory.BEHAVIOR
          ),
          createProperty(
            'watchInputId',
            currentBlock?.properties?.watchInputId || '',
            PropertyType.TEXT,
            'ID do Input para Observar',
            PropertyCategory.BEHAVIOR
          ),
          createProperty(
            'disabledText',
            currentBlock?.properties?.disabledText || 'Preencha os campos obrigatórios',
            PropertyType.TEXT,
            'Texto Quando Desabilitado',
            PropertyCategory.CONTENT
          ),
          createProperty(
            'showDisabledState',
            currentBlock?.properties?.showDisabledState !== false,
            PropertyType.SWITCH,
            'Mostrar Estado Desabilitado Visualmente',
            PropertyCategory.STYLE
          ),
          // 🔹 NAVEGAÇÃO ESPECÍFICA PARA VALIDAÇÃO
          createProperty(
            'nextStepId',
            currentBlock?.properties?.nextStepId || '',
            PropertyType.SELECT,
            'ID da Próxima Etapa (Validação)',
            PropertyCategory.BEHAVIOR,
            {
              options: [
                { value: '', label: 'Padrão do Sistema' },
                { value: 'step-02', label: 'Etapa 2' },
                { value: 'step-03', label: 'Etapa 3' },
                { value: 'step-04', label: 'Etapa 4' },
                { value: 'step-05', label: 'Etapa 5' },
                { value: 'step-06', label: 'Etapa 6' },
                { value: 'step-07', label: 'Etapa 7' },
                { value: 'step-08', label: 'Etapa 8' },
                { value: 'step-09', label: 'Etapa 9' },
                { value: 'step-10', label: 'Etapa 10' },
                { value: 'results', label: 'Resultados' },
                { value: 'thank-you', label: 'Página de Agradecimento' },
              ],
            }
          ),
          createProperty(
            'nextStepUrl',
            currentBlock?.properties?.nextStepUrl || '',
            PropertyType.URL,
            'URL da Próxima Etapa (Validação)',
            PropertyCategory.BEHAVIOR
          ),
        ];

      case 'decorative-bar-inline':
        return [
          ...getUniversalProperties(),
          createProperty(
            'width',
            currentBlock?.properties?.width || '100%',
            PropertyType.SELECT,
            'Largura',
            PropertyCategory.LAYOUT,
            {
              options: createSelectOptions([
                { value: '25%', label: 'Pequena (25%)' },
                { value: '50%', label: 'Média (50%)' },
                { value: '75%', label: 'Grande (75%)' },
                { value: '100%', label: 'Total (100%)' },
                { value: '300px', label: 'Fixa 300px' },
                { value: '500px', label: 'Fixa 500px' },
              ]),
            }
          ),
          createProperty(
            'height',
            currentBlock?.properties?.height ?? 4,
            PropertyType.RANGE,
            'Altura',
            PropertyCategory.LAYOUT,
            { min: 1, max: 20, step: 1, unit: 'px' }
          ),
          createProperty(
            'color',
            currentBlock?.properties?.color || BRAND_COLORS.primary,
            PropertyType.COLOR,
            'Cor Principal',
            PropertyCategory.STYLE
          ),
          createProperty(
            'gradientColors',
            JSON.stringify(
              currentBlock?.properties?.gradientColors || [
                BRAND_COLORS.primary,
                '#D4C2A8',
                BRAND_COLORS.primary,
              ]
            ),
            PropertyType.TEXTAREA,
            'Cores do Gradiente (JSON)',
            PropertyCategory.STYLE
          ),
          createProperty(
            'borderRadius',
            currentBlock?.properties?.borderRadius ?? 3,
            PropertyType.RANGE,
            'Arredondamento',
            PropertyCategory.STYLE,
            { min: 0, max: 20, step: 1, unit: 'px' }
          ),
          createProperty(
            'showShadow',
            currentBlock?.properties?.showShadow !== false,
            PropertyType.SWITCH,
            'Mostrar Sombra',
            PropertyCategory.STYLE
          ),
        ];

      case 'legal-notice-inline':
        return [
          ...getUniversalProperties(),
          ...getTextProperties(),
          createProperty(
            'privacyText',
            currentBlock?.properties?.privacyText || 'Política de Privacidade',
            PropertyType.TEXT,
            'Texto Política de Privacidade',
            PropertyCategory.CONTENT
          ),
          createProperty(
            'copyrightText',
            currentBlock?.properties?.copyrightText || '© 2025 Gisele Galvão Consultoria',
            PropertyType.TEXT,
            'Texto de Copyright',
            PropertyCategory.CONTENT
          ),
          createProperty(
            'termsText',
            currentBlock?.properties?.termsText || 'Termos de Uso',
            PropertyType.TEXT,
            'Texto Termos de Uso',
            PropertyCategory.CONTENT
          ),
          createProperty(
            'fontFamily',
            currentBlock?.properties?.fontFamily || 'inherit',
            PropertyType.SELECT,
            'Família da Fonte',
            PropertyCategory.STYLE,
            {
              options: createSelectOptions([
                { value: 'inherit', label: 'Padrão' },
                { value: 'Inter', label: 'Inter' },
                { value: 'Roboto', label: 'Roboto' },
                { value: 'Open Sans', label: 'Open Sans' },
                { value: 'Playfair Display', label: 'Playfair Display' },
              ]),
            }
          ),
          createProperty(
            'linkColor',
            currentBlock?.properties?.linkColor || BRAND_COLORS.accent,
            PropertyType.COLOR,
            'Cor dos Links',
            PropertyCategory.STYLE
          ),
          createProperty(
            'separatorText',
            currentBlock?.properties?.separatorText || ' | ',
            PropertyType.TEXT,
            'Separador',
            PropertyCategory.CONTENT
          ),
        ];

      case 'options-grid':
        // Usar as propriedades padronizadas do OptionsGridProperties
        const gridProps = { ...defaultOptionsGridProperties, ...(currentBlock?.properties || {}) };

        return [
          ...getUniversalProperties(),

          // Layout
          createProperty(
            'columns',
            gridProps.columns,
            PropertyType.SELECT,
            'Número de Colunas',
            PropertyCategory.LAYOUT,
            {
              options: [
                { value: 1, label: '1 Coluna' },
                { value: 2, label: '2 Colunas' },
                { value: 3, label: '3 Colunas' },
                { value: 4, label: '4 Colunas' },
              ],
            }
          ),
          createProperty(
            'gridGap',
            gridProps.gridGap,
            PropertyType.RANGE,
            'Espaçamento (Gap)',
            PropertyCategory.LAYOUT,
            { min: 0, max: 48, step: 4 }
          ),

          // Imagens
          createProperty(
            'showImages',
            gridProps.showImages,
            PropertyType.SWITCH,
            'Mostrar Imagens',
            PropertyCategory.CONTENT
          ),
          createProperty(
            'imageSize',
            gridProps.imageSize,
            PropertyType.SELECT,
            'Tamanho da Imagem',
            PropertyCategory.LAYOUT,
            {
              options: [
                { value: 'small', label: 'Pequena (200x200)' },
                { value: 'medium', label: 'Média (256x256)' },
                { value: 'large', label: 'Grande (300x300)' },
              ],
            }
          ),
          createProperty(
            'imagePosition',
            gridProps.imagePosition,
            PropertyType.SELECT,
            'Posição da Imagem',
            PropertyCategory.LAYOUT,
            {
              options: [
                { value: 'top', label: 'Superior' },
                { value: 'left', label: 'Esquerda' },
                { value: 'right', label: 'Direita' },
                { value: 'bottom', label: 'Inferior' },
              ],
            }
          ),

          // Comportamento
          createProperty(
            'multipleSelection',
            gridProps.multipleSelection,
            PropertyType.SWITCH,
            'Múltipla Seleção',
            PropertyCategory.BEHAVIOR
          ),
          createProperty(
            'maxSelections',
            gridProps.maxSelections,
            PropertyType.RANGE,
            'Máximo de Seleções',
            PropertyCategory.BEHAVIOR,
            { min: 1, max: 10, step: 1 }
          ),
          createProperty(
            'minSelections',
            gridProps.minSelections,
            PropertyType.RANGE,
            'Mínimo de Seleções',
            PropertyCategory.BEHAVIOR,
            { min: 1, max: 10, step: 1 }
          ),

          // Estilo
          createProperty(
            'backgroundColor',
            gridProps.backgroundColor,
            PropertyType.COLOR,
            'Cor de Fundo',
            PropertyCategory.STYLE
          ),
          createProperty(
            'selectedColor',
            gridProps.selectedColor,
            PropertyType.COLOR,
            'Cor de Seleção',
            PropertyCategory.STYLE
          ),
          createProperty(
            'hoverColor',
            gridProps.hoverColor,
            PropertyType.COLOR,
            'Cor de Hover',
            PropertyCategory.STYLE
          ),
          createProperty(
            'borderRadius',
            gridProps.borderRadius,
            PropertyType.RANGE,
            'Borda Arredondada',
            PropertyCategory.STYLE,
            { min: 0, max: 24, step: 2 }
          ),

          // Opções
          createProperty(
            'options',
            gridProps.options,
            PropertyType.ARRAY,
            'Lista de Opções',
            PropertyCategory.CONTENT
          ),
        ];

      // ✅ NOVOS CASES: Result Components (Steps 20-21)
      case 'result-header-inline':
        return [
          ...getUniversalProperties(),
          createProperty(
            'logoUrl',
            currentBlock?.properties?.logoUrl || 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
            PropertyType.URL,
            'URL da Logo',
            PropertyCategory.CONTENT
          ),
          createProperty(
            'logoAlt',
            currentBlock?.properties?.logoAlt || 'Logo',
            PropertyType.TEXT,
            'Texto Alternativo',
            PropertyCategory.ACCESSIBILITY
          ),
          createProperty(
            'logoHeight',
            currentBlock?.properties?.logoHeight || 40,
            PropertyType.RANGE,
            'Altura da Logo',
            PropertyCategory.STYLE,
            { min: 20, max: 200, step: 5 }
          ),
          createProperty(
            'userName',
            currentBlock?.properties?.userName || '',
            PropertyType.TEXT,
            'Nome do Usuário',
            PropertyCategory.CONTENT
          ),
          createProperty(
            'showUserName',
            currentBlock?.properties?.showUserName ?? true,
            PropertyType.SWITCH,
            'Exibir Nome do Usuário',
            PropertyCategory.BEHAVIOR
          ),
        ];

      case 'personalized-hook-inline':
        return [
          ...getUniversalProperties(),
          createProperty(
            'title',
            currentBlock?.properties?.title || 'Seu Estilo {styleCategory} foi Revelado! ✨',
            PropertyType.TEXT,
            'Título',
            PropertyCategory.CONTENT
          ),
          createProperty(
            'subtitle',
            currentBlock?.properties?.subtitle || '',
            PropertyType.TEXTAREA,
            'Subtítulo',
            PropertyCategory.CONTENT
          ),
          createProperty(
            'styleCategory',
            currentBlock?.properties?.styleCategory || 'Elegante',
            PropertyType.SELECT,
            'Categoria de Estilo',
            PropertyCategory.CONTENT,
            {
              options: [
                { value: 'Natural', label: 'Natural' },
                { value: 'Clássico', label: 'Clássico' },
                { value: 'Contemporâneo', label: 'Contemporâneo' },
                { value: 'Elegante', label: 'Elegante' },
                { value: 'Romântico', label: 'Romântico' },
                { value: 'Sexy', label: 'Sexy' },
                { value: 'Dramático', label: 'Dramático' },
                { value: 'Criativo', label: 'Criativo' },
              ],
            }
          ),
          createProperty(
            'ctaText',
            currentBlock?.properties?.ctaText || 'Quero Transformar Minha Imagem',
            PropertyType.TEXT,
            'Texto do Botão',
            PropertyCategory.CONTENT
          ),
          createProperty(
            'ctaUrl',
            currentBlock?.properties?.ctaUrl || '',
            PropertyType.URL,
            'URL do Botão',
            PropertyCategory.CONTENT
          ),
          createProperty(
            'showCTA',
            currentBlock?.properties?.showCTA ?? true,
            PropertyType.SWITCH,
            'Exibir Botão CTA',
            PropertyCategory.BEHAVIOR
          ),
        ];

      case 'final-value-proposition-inline':
        return [
          ...getUniversalProperties(),
          createProperty(
            'title',
            currentBlock?.properties?.title || 'Vista-se de Você — na Prática',
            PropertyType.TEXT,
            'Título',
            PropertyCategory.CONTENT
          ),
          createProperty(
            'subtitle',
            currentBlock?.properties?.subtitle || '',
            PropertyType.TEXTAREA,
            'Subtítulo',
            PropertyCategory.CONTENT
          ),
          createProperty(
            'description',
            currentBlock?.properties?.description || '',
            PropertyType.TEXTAREA,
            'Descrição',
            PropertyCategory.CONTENT
          ),
          createProperty(
            'originalPrice',
            currentBlock?.properties?.originalPrice || 175,
            PropertyType.NUMBER,
            'Preço Original',
            PropertyCategory.CONTENT
          ),
          createProperty(
            'currentPrice',
            currentBlock?.properties?.currentPrice || 39,
            PropertyType.NUMBER,
            'Preço Atual',
            PropertyCategory.CONTENT
          ),
          createProperty(
            'installments',
            currentBlock?.properties?.installments || '5x de R$ 8,83',
            PropertyType.TEXT,
            'Parcelamento',
            PropertyCategory.CONTENT
          ),
          createProperty(
            'ctaText',
            currentBlock?.properties?.ctaText || 'GARANTIR MEU GUIA PERSONALIZADO AGORA',
            PropertyType.TEXT,
            'Texto do Botão',
            PropertyCategory.CONTENT
          ),
          createProperty(
            'ctaUrl',
            currentBlock?.properties?.ctaUrl || '',
            PropertyType.URL,
            'URL do Botão',
            PropertyCategory.CONTENT
          ),
        ];

      // ✅ Step 21 Components  
      case 'next-steps':
        return [
          ...getUniversalProperties(),
          createProperty(
            'title',
            currentBlock?.properties?.title || '📋 Próximos Passos:',
            PropertyType.TEXT,
            'Título',
            PropertyCategory.CONTENT
          ),
          createProperty(
            'steps',
            currentBlock?.properties?.steps || [],
            PropertyType.ARRAY,
            'Lista de Passos',
            PropertyCategory.CONTENT
          ),
        ];

      case 'final-message':
        return [
          ...getUniversalProperties(),
          createProperty(
            'message',
            currentBlock?.properties?.message || '💕 Obrigada por confiar em mim!',
            PropertyType.TEXTAREA,
            'Mensagem',
            PropertyCategory.CONTENT
          ),
          createProperty(
            'author',
            currentBlock?.properties?.author || 'Com carinho, Gisele Galvão',
            PropertyType.TEXT,
            'Assinatura',
            PropertyCategory.CONTENT
          ),
          createProperty(
            'fontStyle',
            currentBlock?.properties?.fontStyle || 'italic',
            PropertyType.SELECT,
            'Estilo da Fonte',
            PropertyCategory.STYLE,
            {
              options: [
                { value: 'normal', label: 'Normal' },
                { value: 'italic', label: 'Itálico' },
              ],
            }
          ),
        ];

      // ✅ Additional inline components commonly used
      case 'urgency-countdown-inline':
      case 'style-guides-visual-inline':  
      case 'motivation-section-inline':
      case 'before-after-transformation-inline':
      case 'bonus-section-inline':
      case 'testimonials-inline':
      case 'guarantee-section-inline':
      case 'mentor-section-inline':
        return [
          ...getUniversalProperties(),
          createProperty(
            'title',
            currentBlock?.properties?.title || '',
            PropertyType.TEXT,
            'Título',
            PropertyCategory.CONTENT
          ),
          createProperty(
            'subtitle',
            currentBlock?.properties?.subtitle || '',
            PropertyType.TEXTAREA,
            'Subtítulo',
            PropertyCategory.CONTENT
          ),
          createProperty(
            'backgroundColor',
            currentBlock?.properties?.backgroundColor || '#ffffff',
            PropertyType.COLOR,
            'Cor de Fundo',
            PropertyCategory.STYLE
          ),
          createProperty(
            'accentColor',
            currentBlock?.properties?.accentColor || '#B89B7A',
            PropertyType.COLOR,
            'Cor de Destaque',
            PropertyCategory.STYLE
          ),
        ];

      default:
        console.warn(
          `🔧 useUnifiedProperties: Tipo de bloco "${blockType}" não tem propriedades específicas definidas.`
        );
        return getUniversalProperties();
    }
  }, [blockType, blockId, currentBlock]);

  const [properties, setProperties] = useState<UnifiedProperty[]>([]);

  // Sincronizar propriedades quando mudarem
  useEffect(() => {
    if (generatedProperties && Array.isArray(generatedProperties)) {
      setProperties(generatedProperties);
    }
  }, [generatedProperties]);

  const updateProperty = useCallback(
    (key: string, value: any) => {
      setProperties(prev => prev.map(prop => (prop.key === key ? { ...prop, value } : prop)));

      if (onUpdateExternal && block) {
        const updatedProps = { ...block.properties, [key]: value };
        onUpdateExternal(block.id, { properties: updatedProps });
      }
    },
    [onUpdateExternal, block]
  );

  const resetProperties = useCallback(() => {
    const resetProps = generatedProperties?.map(prop => ({
      ...prop,
      value: prop.defaultValue ?? prop.value,
    }));
    if (resetProps) {
      setProperties(resetProps);
    }
  }, [generatedProperties]);

  const validateProperty = (property: UnifiedProperty): boolean => {
    if (!property.key || property.value === undefined) {
      return false;
    }

    switch (property.type) {
      case PropertyType.RANGE:
        const numValue = Number(property.value);
        return (
          !isNaN(numValue) &&
          (property.min === undefined || numValue >= property.min) &&
          (property.max === undefined || numValue <= property.max)
        );
      case PropertyType.SELECT:
        return property.options?.some(opt => opt.value === property.value) ?? true;
      case PropertyType.COLOR:
        return typeof property.value === 'string' && property.value.length > 0;
      case PropertyType.SWITCH:
        return typeof property.value === 'boolean';
      default:
        return true;
    }
  };

  const validateProperties = useCallback(() => {
    return properties.every(prop => validateProperty(prop));
  }, [properties]);

  const getPropertyByKey = useCallback(
    (key: string) => {
      return properties.find(prop => prop.key === key);
    },
    [properties]
  );

  const getPropertiesByCategory = useCallback(
    (category: PropertyCategoryOrString) => {
      if (!properties || !Array.isArray(properties)) {
        return [];
      }
      return properties.filter(prop => prop.category === category);
    },
    [properties]
  );

  const exportProperties = useCallback(() => {
    return properties.reduce(
      (acc, prop) => {
        acc[prop.key] = prop.value;
        return acc;
      },
      {} as Record<string, any>
    );
  }, [properties]);

  const applyBrandColors = useCallback(() => {
    if (!properties.length || !block) return;

    setProperties(prev =>
      prev.map(prop => {
        if (prop.type === PropertyType.COLOR) {
          if (prop.key.includes('text') || prop.key.includes('Text')) {
            return { ...prop, value: BRAND_COLORS.textPrimary };
          }
          if (prop.key.includes('background') || prop.key.includes('Background')) {
            return { ...prop, value: BRAND_COLORS.primary };
          }
          if (prop.key.includes('border') || prop.key.includes('Border')) {
            return { ...prop, value: BRAND_COLORS.primary };
          }
        }
        return prop;
      })
    );

    if (onUpdateExternal && block) {
      const updatedProps = properties.reduce(
        (acc, prop) => {
          if (prop.type === PropertyType.COLOR) {
            if (prop.key.includes('text') || prop.key.includes('Text')) {
              acc[prop.key] = BRAND_COLORS.textPrimary;
            } else if (prop.key.includes('background') || prop.key.includes('Background')) {
              acc[prop.key] = BRAND_COLORS.primary;
            } else if (prop.key.includes('border') || prop.key.includes('Border')) {
              acc[prop.key] = BRAND_COLORS.primary;
            } else {
              acc[prop.key] = prop.value;
            }
          } else {
            acc[prop.key] = prop.value;
          }
          return acc;
        },
        {} as Record<string, any>
      );
      onUpdateExternal(block.id, { properties: updatedProps });
    }
  }, [properties, block?.id, onUpdateExternal]);

  return {
    properties,
    updateProperty,
    resetProperties,
    validateProperties,
    getPropertyByKey,
    getPropertiesByCategory,
    exportProperties,
    applyBrandColors,
  };
};

/**
 * 🎯 Helper para componentes inline otimizados
 */
export const getInlineComponentProperties = (type: string, currentProps: any = {}) => {
  const inlineDefaults = {
    'heading-inline': {
      content: 'Título',
      level: 'h2',
      textAlign: 'center',
      color: '#432818',
      fontWeight: 'normal',
    },
    'text-inline': {
      text: 'Digite seu texto aqui...',
      fontSize: '1rem',
      alignment: 'center',
      color: '#6B5B4E',
      fontWeight: 'normal',
    },
    'button-inline': {
      text: 'Clique aqui',
      style: 'primary',
      size: 'medium',
      backgroundColor: '#B89B7A',
      textColor: '#FFFFFF',
      action: 'next-step',
      borderRadius: 8,
      padding: '12px 24px',
      fontWeight: 'medium',
      cursor: 'pointer',
      border: 'none',
      transition: 'all 0.2s ease',
    },
    'image-display-inline': {
      src: '',
      alt: 'Imagem',
      width: 'auto',
      height: 'auto',
      borderRadius: 12,
      shadow: true,
      alignment: 'center',
    },
    'legal-notice-inline': {
      privacyText: 'Política de Privacidade',
      copyrightText: '© 2025 Gisele Galvão Consultoria',
      termsText: 'Termos de Uso',
      fontSize: '0.75rem',
      textAlign: 'center',
      color: '#8F7A6A',
      linkColor: '#B89B7A',
    },
  } as const;

  type InlineDefaultsKey = keyof typeof inlineDefaults;

  return {
    ...((inlineDefaults[type as InlineDefaultsKey] || {}) as object),
    ...currentProps,
  };
};

export default useUnifiedProperties;
