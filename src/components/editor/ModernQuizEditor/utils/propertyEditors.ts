/**
 * Mapa mínimo de editores por tipo de bloco
 * Fase 2: foco em tipos mais comuns
 */

export type FieldDef = {
  key: string;
  label: string;
  kind: 'text' | 'number' | 'boolean' | 'json' | 'image' | 'options';
};

export const PropertySchemaMap: Record<string, FieldDef[]> = {
  // ============================================================================
  // PROGRESS & NAVIGATION
  // ============================================================================
  'question-progress': [
    { key: 'current', label: 'Passo atual', kind: 'number' },
    { key: 'total', label: 'Total de passos', kind: 'number' },
    { key: 'showPercentage', label: 'Mostrar porcentagem', kind: 'boolean' },
  ],
  'question-navigation': [
    { key: 'showBack', label: 'Mostrar voltar', kind: 'boolean' },
    { key: 'showNext', label: 'Mostrar avançar', kind: 'boolean' },
    { key: 'nextLabel', label: 'Texto do botão', kind: 'text' },
  ],

  // ============================================================================
  // INTRO BLOCKS
  // ============================================================================
  'intro-logo': [
    { key: 'src', label: 'URL do logo', kind: 'image' },
    { key: 'alt', label: 'Texto alternativo', kind: 'text' },
    { key: 'width', label: 'Largura', kind: 'number' },
  ],
  'intro-logo-header': [
    { key: 'src', label: 'URL do logo', kind: 'image' },
    { key: 'alt', label: 'Texto alternativo', kind: 'text' },
  ],
  'intro-title': [
    { key: 'text', label: 'Título', kind: 'text' },
    { key: 'align', label: 'Alinhamento', kind: 'text' },
  ],
  'intro-subtitle': [
    { key: 'text', label: 'Subtítulo', kind: 'text' },
    { key: 'align', label: 'Alinhamento', kind: 'text' },
  ],
  'intro-description': [
    { key: 'text', label: 'Descrição', kind: 'text' },
  ],
  'intro-image': [
    { key: 'src', label: 'URL da imagem', kind: 'image' },
    { key: 'alt', label: 'Texto alternativo', kind: 'text' },
  ],
  'intro-form': [
    { key: 'placeholder', label: 'Placeholder', kind: 'text' },
    { key: 'required', label: 'Obrigatório', kind: 'boolean' },
  ],
  'intro-button': [
    { key: 'text', label: 'Texto do botão', kind: 'text' },
    { key: 'variant', label: 'Variante', kind: 'text' },
  ],
  'quiz-intro-header': [
    { key: 'title', label: 'Título', kind: 'text' },
    { key: 'subtitle', label: 'Subtítulo', kind: 'text' },
  ],

  // ============================================================================
  // QUESTION BLOCKS
  // ============================================================================
  'question-title': [
    { key: 'text', label: 'Título', kind: 'text' },
    { key: 'level', label: 'Nível (h1-h6)', kind: 'text' },
  ],
  'question-description': [
    { key: 'text', label: 'Descrição', kind: 'text' },
  ],
  'options-grid': [
    { key: 'title', label: 'Título', kind: 'text' },
    { key: 'options', label: 'Opções', kind: 'options' },
    { key: 'columns', label: 'Colunas', kind: 'number' },
  ],
  'form-input': [
    { key: 'label', label: 'Label', kind: 'text' },
    { key: 'placeholder', label: 'Placeholder', kind: 'text' },
    { key: 'type', label: 'Tipo', kind: 'text' },
    { key: 'required', label: 'Obrigatório', kind: 'boolean' },
  ],
  'question-hero': [
    { key: 'title', label: 'Título', kind: 'text' },
    { key: 'subtitle', label: 'Subtítulo', kind: 'text' },
    { key: 'image', label: 'Imagem', kind: 'image' },
  ],

  // ============================================================================
  // TRANSITION BLOCKS
  // ============================================================================
  'transition-hero': [
    { key: 'title', label: 'Título', kind: 'text' },
    { key: 'subtitle', label: 'Subtítulo', kind: 'text' },
  ],
  'transition-title': [
    { key: 'text', label: 'Título', kind: 'text' },
  ],
  'transition-text': [
    { key: 'text', label: 'Texto', kind: 'text' },
  ],
  'transition-button': [
    { key: 'text', label: 'Texto', kind: 'text' },
  ],
  'transition-image': [
    { key: 'src', label: 'URL', kind: 'image' },
    { key: 'alt', label: 'Alt', kind: 'text' },
  ],

  // ============================================================================
  // RESULT BLOCKS
  // ============================================================================
  'result-header': [
    { key: 'title', label: 'Título', kind: 'text' },
    { key: 'subtitle', label: 'Subtítulo', kind: 'text' },
  ],
  'result-title': [
    { key: 'text', label: 'Título', kind: 'text' },
  ],
  'result-description': [
    { key: 'text', label: 'Descrição', kind: 'text' },
  ],
  'result-image': [
    { key: 'src', label: 'URL', kind: 'image' },
    { key: 'alt', label: 'Alt', kind: 'text' },
  ],
  'result-guide-image': [
    { key: 'src', label: 'URL', kind: 'image' },
    { key: 'alt', label: 'Alt', kind: 'text' },
  ],
  'result-display': [
    { key: 'title', label: 'Título', kind: 'text' },
    { key: 'description', label: 'Descrição', kind: 'text' },
  ],
  'result-congrats': [
    { key: 'message', label: 'Mensagem', kind: 'text' },
  ],
  'quiz-score-display': [
    { key: 'showScore', label: 'Mostrar pontuação', kind: 'boolean' },
  ],
  'result-main': [
    { key: 'title', label: 'Título', kind: 'text' },
    { key: 'description', label: 'Descrição', kind: 'text' },
  ],
  'result-progress-bars': [
    { key: 'categories', label: 'Categorias', kind: 'json' },
  ],
  'result-secondary-styles': [
    { key: 'styles', label: 'Estilos secundários', kind: 'json' },
  ],
  'result-cta': [
    { key: 'text', label: 'Texto', kind: 'text' },
    { key: 'url', label: 'URL', kind: 'text' },
  ],
  'result-share': [
    { key: 'text', label: 'Texto', kind: 'text' },
    { key: 'platforms', label: 'Plataformas', kind: 'json' },
  ],

  // ============================================================================
  // OFFER BLOCKS
  // ============================================================================
  'offer-hero': [
    { key: 'title', label: 'Título', kind: 'text' },
    { key: 'subtitle', label: 'Subtítulo', kind: 'text' },
    { key: 'image', label: 'Imagem', kind: 'image' },
  ],
  'quiz-offer-hero': [
    { key: 'title', label: 'Título', kind: 'text' },
    { key: 'subtitle', label: 'Subtítulo', kind: 'text' },
  ],
  'offer-card': [
    { key: 'title', label: 'Título', kind: 'text' },
    { key: 'price', label: 'Preço', kind: 'text' },
    { key: 'features', label: 'Características', kind: 'json' },
  ],
  'benefits-list': [
    { key: 'items', label: 'Benefícios', kind: 'json' },
  ],
  'testimonials': [
    { key: 'items', label: 'Depoimentos', kind: 'json' },
  ],
  'pricing': [
    { key: 'amount', label: 'Valor', kind: 'text' },
    { key: 'currency', label: 'Moeda', kind: 'text' },
  ],
  'guarantee': [
    { key: 'text', label: 'Texto da garantia', kind: 'text' },
    { key: 'days', label: 'Dias', kind: 'number' },
  ],
  'urgency-timer': [
    { key: 'endDate', label: 'Data final', kind: 'text' },
    { key: 'message', label: 'Mensagem', kind: 'text' },
  ],
  'value-anchoring': [
    { key: 'originalPrice', label: 'Preço original', kind: 'text' },
    { key: 'currentPrice', label: 'Preço atual', kind: 'text' },
  ],
  'secure-purchase': [
    { key: 'text', label: 'Texto', kind: 'text' },
    { key: 'icons', label: 'Ícones', kind: 'json' },
  ],
  'cta-button': [
    { key: 'text', label: 'Texto', kind: 'text' },
    { key: 'url', label: 'URL', kind: 'text' },
    { key: 'variant', label: 'Variante', kind: 'text' },
  ],
  'CTAButton': [
    { key: 'text', label: 'Texto', kind: 'text' },
    { key: 'url', label: 'URL', kind: 'text' },
  ],

  // ============================================================================
  // GENERIC CONTENT
  // ============================================================================
  'text': [
    { key: 'text', label: 'Texto', kind: 'text' },
    { key: 'align', label: 'Alinhamento', kind: 'text' },
  ],
  'text-inline': [
    { key: 'text', label: 'Texto', kind: 'text' },
  ],
  'heading': [
    { key: 'text', label: 'Título', kind: 'text' },
    { key: 'level', label: 'Nível (h1-h6)', kind: 'text' },
  ],
  'image': [
    { key: 'src', label: 'URL', kind: 'image' },
    { key: 'alt', label: 'Alt', kind: 'text' },
    { key: 'width', label: 'Largura', kind: 'number' },
  ],
  'button': [
    { key: 'text', label: 'Texto', kind: 'text' },
    { key: 'variant', label: 'Variante', kind: 'text' },
    { key: 'url', label: 'URL', kind: 'text' },
  ],

  // ============================================================================
  // LAYOUT
  // ============================================================================
  'container': [
    { key: 'maxWidth', label: 'Largura máxima', kind: 'text' },
    { key: 'padding', label: 'Padding', kind: 'text' },
  ],
  'spacer': [
    { key: 'height', label: 'Altura', kind: 'number' },
  ],
  'divider': [
    { key: 'style', label: 'Estilo', kind: 'text' },
  ],
  'footer-copyright': [
    { key: 'text', label: 'Texto', kind: 'text' },
    { key: 'year', label: 'Ano', kind: 'number' },
  ],
};

export function getFieldsForType(blockType: string): FieldDef[] {
  return PropertySchemaMap[blockType] || [];
}
