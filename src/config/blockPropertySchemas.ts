export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'boolean'
  | 'color'
  | 'options-list'
  | 'json';

export interface BlockFieldSchema {
  key: string;
  label: string;
  type: FieldType;
}

export interface BlockSchema {
  label: string;
  fields: BlockFieldSchema[];
}

export const blockPropertySchemas: Record<string, BlockSchema> = {
  'quiz-intro-header': {
    label: 'Cabeçalho do Quiz',
    fields: [
      { key: 'logoUrl', label: 'Logo', type: 'text' },
      { key: 'logoAlt', label: 'Texto Alternativo', type: 'text' },
      { key: 'logoWidth', label: 'Largura do Logo', type: 'number' },
      { key: 'logoHeight', label: 'Altura do Logo', type: 'number' },
      { key: 'progressValue', label: 'Valor do Progresso', type: 'number' },
      { key: 'progressMax', label: 'Máximo do Progresso', type: 'number' },
      { key: 'showBackButton', label: 'Mostrar Voltar', type: 'boolean' },
      { key: 'showProgress', label: 'Mostrar Progresso', type: 'boolean' },
      { key: 'title', label: 'Título', type: 'text' },
      { key: 'subtitle', label: 'Subtítulo', type: 'text' },
      { key: 'alignment', label: 'Alinhamento', type: 'text' },
      { key: 'type', label: 'Tipo', type: 'text' },
    ],
  },
  'decorative-bar-inline': {
    label: 'Barra Decorativa',
    fields: [
      { key: 'width', label: 'Largura', type: 'text' },
      { key: 'height', label: 'Altura', type: 'number' },
      { key: 'color', label: 'Cor', type: 'color' },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color' },
      { key: 'marginTop', label: 'Margem Superior', type: 'number' },
      { key: 'marginBottom', label: 'Margem Inferior', type: 'number' },
    ],
  },
  'text-inline': {
    label: 'Texto',
    fields: [
      { key: 'content', label: 'Conteúdo', type: 'textarea' },
      { key: 'fontSize', label: 'Tamanho da Fonte', type: 'text' },
      { key: 'fontWeight', label: 'Peso da Fonte', type: 'text' },
      { key: 'textAlign', label: 'Alinhamento', type: 'text' },
      { key: 'color', label: 'Cor', type: 'color' },
      { key: 'marginBottom', label: 'Margem Inferior', type: 'number' },
      { key: 'marginTop', label: 'Margem Superior', type: 'number' },
    ],
  },
  'image-display-inline': {
    label: 'Imagem',
    fields: [
      { key: 'src', label: 'URL da Imagem', type: 'text' },
      { key: 'alt', label: 'Texto Alternativo', type: 'text' },
      { key: 'width', label: 'Largura', type: 'number' },
      { key: 'height', label: 'Altura', type: 'number' },
      { key: 'containerPosition', label: 'Posição', type: 'text' },
      { key: 'marginBottom', label: 'Margem Inferior', type: 'number' },
    ],
  },
  'form-container': {
    label: 'Formulário',
    fields: [
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color' },
      { key: 'marginTop', label: 'Margem Superior', type: 'number' },
      { key: 'marginBottom', label: 'Margem Inferior', type: 'number' },
      { key: 'paddingTop', label: 'Padding Superior', type: 'number' },
      { key: 'paddingBottom', label: 'Padding Inferior', type: 'number' },
      { key: 'requireNameToEnableButton', label: 'Requer Nome para Habilitar Botão', type: 'boolean' },
      { key: 'targetButtonId', label: 'ID do Botão', type: 'text' },
      { key: 'visuallyDisableButton', label: 'Desabilitar Botão Visualmente', type: 'boolean' },
    ],
  },
  'form-input': {
    label: 'Campo de Formulário',
    fields: [
      { key: 'inputType', label: 'Tipo de Input', type: 'text' },
      { key: 'placeholder', label: 'Placeholder', type: 'text' },
      { key: 'label', label: 'Label', type: 'text' },
      { key: 'required', label: 'Obrigatório', type: 'boolean' },
      { key: 'name', label: 'Nome Campo', type: 'text' },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color' },
      { key: 'borderColor', label: 'Cor da Borda', type: 'color' },
      { key: 'marginBottom', label: 'Margem Inferior', type: 'number' },
    ],
  },
  'button-inline': {
    label: 'Botão',
    fields: [
      { key: 'text', label: 'Texto', type: 'text' },
      { key: 'variant', label: 'Variante', type: 'text' },
      { key: 'size', label: 'Tamanho', type: 'text' },
      { key: 'fullWidth', label: 'Largura Total', type: 'boolean' },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color' },
      { key: 'textColor', label: 'Cor do Texto', type: 'color' },
      { key: 'requiresValidInput', label: 'Requer Input Válido', type: 'boolean' },
      { key: 'disabledText', label: 'Texto Desabilitado', type: 'text' },
      { key: 'showDisabledState', label: 'Mostrar Estado Desabilitado', type: 'boolean' },
      { key: 'disabledOpacity', label: 'Opacidade Desabilitado', type: 'number' },
      { key: 'marginTop', label: 'Margem Superior', type: 'number' },
    ],
  },
  'options-grid': {
    label: 'Grade de Opções',
    fields: [
      { key: 'options', label: 'Opções', type: 'options-list' },
      { key: 'columns', label: 'Colunas', type: 'number' },
      { key: 'imageSize', label: 'Tamanho da Imagem', type: 'number' },
      { key: 'showImages', label: 'Exibir Imagens', type: 'boolean' },
      { key: 'multipleSelection', label: 'Seleção Múltipla', type: 'boolean' },
      { key: 'minSelections', label: 'Mínimo Seleções', type: 'number' },
      { key: 'maxSelections', label: 'Máximo Seleções', type: 'number' },
      { key: 'borderColor', label: 'Cor da Borda', type: 'color' },
      { key: 'selectedBorderColor', label: 'Cor da Borda Selecionada', type: 'color' },
      { key: 'hoverColor', label: 'Cor de Hover', type: 'color' },
    ],
  },
};
