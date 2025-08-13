export type FieldType =
  | 'text'
    | 'textarea'
      | 'number'
        | 'boolean'
          | 'color'
            | 'options-list'
              | 'select'
                | 'json';

                export interface BlockFieldSchema {
                  key: string;
                    label: string;
                      type: FieldType;
                        options?: Array<{ label: string; value: string | number }>; // para selects
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
      // Propriedades de container e layout
      { key: 'containerWidth', label: 'Largura do Container', type: 'text' },
      { key: 'containerPosition', label: 'Posição do Container', type: 'text' },
      { key: 'spacing', label: 'Espaçamento Interno', type: 'text' },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color' },
      { key: 'marginTop', label: 'Margem Superior', type: 'number' },
      { key: 'marginBottom', label: 'Margem Inferior', type: 'number' },
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
      
      // === VALIDAÇÃO BASEADA EM OPTIONS-GRID ===
      { key: 'requiresGridSelection', label: 'Requer Seleção do Grid', type: 'boolean' },
      { key: 'watchGridId', label: 'ID do Grid a Monitorar', type: 'text' },
      { key: 'minRequiredSelections', label: 'Mín. Seleções Obrigatórias', type: 'number' },
      
      { key: 'marginTop', label: 'Margem Superior', type: 'number' },
    ],
  },
  'options-grid': {
    label: 'Grade de Opções',
    fields: [
      // === CONFIGURAÇÃO VISUAL PRINCIPAL ===
      { key: 'options', label: 'Lista de Opções', type: 'options-list' },
      
      { key: 'layout', label: 'Layout', type: 'select', options: [
        { label: 'Grade', value: 'grid' },
        { label: 'Lista', value: 'list' },
      ] },
      { key: 'columns', label: 'Número de Colunas', type: 'select', options: [
        { label: '1 Coluna', value: 1 },
        { label: '2 Colunas', value: 2 },
        { label: '3 Colunas', value: 3 },
        { label: '4 Colunas', value: 4 },
      ] },
      { key: 'layoutOrientation', label: 'Direção do Layout', type: 'select', options: [
        { label: 'Vertical', value: 'vertical' },
        { label: 'Horizontal', value: 'horizontal' },
      ] },
      { key: 'contentType', label: 'Tipo de Conteúdo', type: 'select', options: [
        { label: 'Imagem + Texto', value: 'text-and-image' },
        { label: 'Apenas Imagem', value: 'image-only' },
        { label: 'Apenas Texto', value: 'text-only' },
      ] },
      
      // === CONFIGURAÇÃO DE IMAGENS ===
      { key: 'showImages', label: 'Mostrar Imagens', type: 'boolean' },
      { key: 'imagePosition', label: 'Posição da Imagem', type: 'select', options: [
        { label: 'Acima do Texto', value: 'top' },
        { label: 'À Esquerda', value: 'left' },
        { label: 'À Direita', value: 'right' },
        { label: 'Como Fundo', value: 'background' },
      ] },
      { key: 'imageSize', label: 'Tamanho da Imagem (px)', type: 'number' },
      { key: 'imageAspect', label: 'Proporção da Imagem', type: 'select', options: [
        { label: '1:1 (Quadrado)', value: '1:1' },
        { label: '4:3 (Paisagem)', value: '4:3' },
        { label: '16:9 (Widescreen)', value: '16:9' },
      ] },
      
      // === COMPORTAMENTO DE SELEÇÃO ===
      { key: 'multipleSelection', label: 'Seleção Múltipla', type: 'boolean' },
      { key: 'minSelections', label: 'Mínimo de Seleções', type: 'number' },
      { key: 'maxSelections', label: 'Máximo de Seleções', type: 'number' },
      { key: 'allowDeselect', label: 'Permitir Desmarcar', type: 'boolean' },
      { key: 'showCheckmark', label: 'Mostrar Marcador', type: 'boolean' },
      
      // === ESTILO VISUAL ===
      { key: 'gap', label: 'Espaçamento entre Itens (px)', type: 'number' },
      { key: 'cardRadius', label: 'Arredondamento (px)', type: 'number' },
      { key: 'borderColor', label: 'Cor da Borda', type: 'color' },
      { key: 'selectedBorderColor', label: 'Cor da Borda Selecionada', type: 'color' },
      { key: 'hoverColor', label: 'Cor de Hover', type: 'color' },
      { key: 'labelPosition', label: 'Posição do Rótulo', type: 'select', options: [
        { label: 'Abaixo da Imagem', value: 'bottom' },
        { label: 'À Direita da Imagem', value: 'right' },
        { label: 'Sobreposto', value: 'overlay' },
      ] },
      
      // === CONFIGURAÇÃO AVANÇADA ===
      { key: 'showBorders', label: 'Mostrar Bordas', type: 'boolean' },
      { key: 'showShadows', label: 'Mostrar Sombras', type: 'boolean' },
      { key: 'responsiveColumns', label: 'Colunas Responsivas', type: 'boolean' },
      { key: 'scale', label: 'Escala do Componente (%)', type: 'number' },
    ],
  },
};
