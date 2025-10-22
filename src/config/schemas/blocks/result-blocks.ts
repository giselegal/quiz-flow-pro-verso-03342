import { templates } from '../base/builder';

// RESULT: Cabeçalho
export const resultHeaderSchema = templates
  .full('result-header', 'Cabeçalho do Resultado')
  .category('result')
  .icon('Header')
  .addField({ key: 'title', label: 'Título', type: 'string', group: 'content', default: 'Seu Estilo Predominante é:' })
  .addField({ key: 'subtitle', label: 'Subtítulo', type: 'string', group: 'content', default: 'Baseado nas suas respostas' })
  .addField({ key: 'emoji', label: 'Emoji', type: 'string', group: 'content', default: '🎉' })
  .addField({ key: 'titleColor', label: 'Cor do Título', type: 'color', group: 'style', default: '#5b4135' })
  .addField({ key: 'subtitleColor', label: 'Cor do Subtítulo', type: 'color', group: 'style', default: '#8F7A6A' })
  .addField({ key: 'textAlign', label: 'Alinhamento', type: 'select', group: 'layout', enumValues: ['left', 'center', 'right'], default: 'center' })
  .version('1.0.0')
  .build();

// RESULT: Descrição
export const resultDescriptionSchema = templates
  .full('result-description', 'Descrição do Resultado')
  .category('result')
  .icon('AlignLeft')
  .addField({ key: 'text', label: 'Texto', type: 'string', group: 'content', default: 'Descrição do seu estilo principal', required: true })
  .addField({ key: 'fontSize', label: 'Tamanho da Fonte', type: 'select', group: 'style', enumValues: ['sm', 'base', 'lg'], default: 'base' })
  .addField({ key: 'color', label: 'Cor do Texto', type: 'color', group: 'style', default: '#5b4135' })
  .addField({ key: 'textAlign', label: 'Alinhamento', type: 'select', group: 'layout', enumValues: ['left', 'center', 'right'], default: 'left' })
  .version('1.0.0')
  .build();

// RESULT: Imagem
export const resultImageSchema = templates
  .full('result-image', 'Imagem do Resultado')
  .category('result')
  .icon('Image')
  .addField({ key: 'url', label: 'URL da Imagem', type: 'string', group: 'content', default: '' })
  .addField({ key: 'alt', label: 'Texto Alternativo', type: 'string', group: 'content', default: 'Imagem do resultado' })
  .addField({ key: 'borderRadius', label: 'Arredondamento', type: 'string', group: 'style', default: '12px' })
  .addField({ key: 'maxHeight', label: 'Altura Máxima', type: 'string', group: 'layout', default: '400px' })
  .version('1.0.0')
  .build();

// RESULT: CTA genérico
export const resultCtaSchema = templates
  .full('result-cta', 'CTA de Resultado (Genérico)')
  .category('result')
  .icon('MousePointer')
  .addField({ key: 'text', label: 'Texto do Botão', type: 'string', group: 'content', default: 'Ver Recomendações', required: true })
  .addField({ key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', default: '#B89B7A' })
  .addField({ key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', default: '#FFFFFF' })
  .addField({ key: 'size', label: 'Tamanho', type: 'select', group: 'layout', enumValues: ['sm', 'md', 'lg', 'xl'], default: 'lg' })
  .version('1.0.0')
  .build();

// RESULT: Barras de Progresso
export const resultProgressBarsSchema = templates
  .full('result-progress-bars', 'Barras de Progresso (Estilos)')
  .category('result')
  .icon('BarChart2')
  .addField({ key: 'title', label: 'Título', type: 'string', group: 'content', default: 'Compatibilidade com estilos:' })
  .addField({ key: 'showTop3', label: 'Exibir apenas Top 3', type: 'boolean', group: 'content', default: true })
  .addField({ key: 'barColor', label: 'Cor das Barras', type: 'color', group: 'style', default: 'hsl(var(--primary))' })
  .addField({ key: 'marginBottom', label: 'Margem Inferior', type: 'string', group: 'layout', default: '8' })
  .version('1.0.0')
  .build();

// RESULT: Estilo Principal (Main)
export const resultMainSchema = templates
  .full('result-main', 'Estilo Principal de Resultado')
  .category('result')
  .icon('Star')
  .addField({ key: 'styleName', label: 'Nome do Estilo', type: 'string', group: 'content', default: 'Estilo Dominante', required: true })
  .addField({ key: 'description', label: 'Descrição', type: 'string', group: 'content', default: 'Descrição do seu estilo principal' })
  .addField({ key: 'imageUrl', label: 'URL da Imagem', type: 'string', group: 'content', default: '' })
  .addField({ key: 'showIcon', label: 'Mostrar Ícone', type: 'boolean', group: 'style', default: true })
  .addField({ key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', default: '#F3F4F6' })
  .version('1.0.0')
  .build();

// RESULT: Card de Estilo
export const resultStyleSchema = templates
  .full('result-style', 'Card de Estilo')
  .category('result')
  .icon('Layers')
  .addField({ key: 'styleName', label: 'Nome do Estilo', type: 'string', group: 'content', default: 'Seu Estilo', required: true })
  .addField({ key: 'percentage', label: 'Percentual', type: 'number', group: 'content', min: 0, max: 100, default: 0 })
  .addField({ key: 'description', label: 'Descrição', type: 'string', group: 'content', default: '' })
  .addField({ key: 'color', label: 'Cor', type: 'color', group: 'style', default: '#3B82F6' })
  .addField({ key: 'showBar', label: 'Mostrar Barra', type: 'boolean', group: 'style', default: true })
  .version('1.0.0')
  .build();

// RESULT: Características
export const resultCharacteristicsSchema = templates
  .full('result-characteristics', 'Características do Resultado')
  .category('result')
  .icon('List')
  .addField({ key: 'title', label: 'Título', type: 'string', group: 'content', default: 'Características', required: true })
  .addField({ key: 'items', label: 'Características', type: 'options-list', group: 'content', default: [] })
  .version('1.0.0')
  .build();

// RESULT: Estilos Secundários
export const resultSecondaryStylesSchema = templates
  .full('result-secondary-styles', 'Estilos Secundários')
  .category('result')
  .icon('PieChart')
  .addField({ key: 'title', label: 'Título', type: 'string', group: 'content', default: 'Outros Estilos', required: true })
  .addField({ key: 'styles', label: 'Estilos', type: 'options-list', group: 'content', default: [] })
  .addField({ key: 'showPercentages', label: 'Mostrar Percentuais', type: 'boolean', group: 'style', default: true })
  .version('1.0.0')
  .build();

// RESULT: CTA Primário
export const resultCtaPrimarySchema = templates
  .full('result-cta-primary', 'CTA Principal')
  .category('result')
  .icon('MousePointer')
  .addField({ key: 'text', label: 'Texto do Botão', type: 'string', group: 'content', default: 'Ver Oferta Personalizada', required: true })
  .addField({ key: 'url', label: 'URL', type: 'string', group: 'content', default: '#' })
  .addField({ key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', default: '#3B82F6' })
  .addField({ key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', default: '#FFFFFF' })
  .addField({ key: 'size', label: 'Tamanho', type: 'select', group: 'layout', enumValues: ['sm', 'md', 'lg', 'xl'], default: 'lg' })
  .version('1.0.0')
  .build();

// RESULT: CTA Secundário
export const resultCtaSecondarySchema = templates
  .full('result-cta-secondary', 'CTA Secundário')
  .category('result')
  .icon('MousePointer2')
  .addField({ key: 'text', label: 'Texto do Botão', type: 'string', group: 'content', default: 'Refazer Quiz', required: true })
  .addField({ key: 'url', label: 'URL', type: 'string', group: 'content', default: '#' })
  .addField({ key: 'variant', label: 'Variante', type: 'select', group: 'style', enumValues: ['outline', 'ghost', 'link'], default: 'outline' })
  .addField({ key: 'size', label: 'Tamanho', type: 'select', group: 'layout', enumValues: ['sm', 'md', 'lg'], default: 'md' })
  .version('1.0.0')
  .build();

// RESULT: Compartilhamento
export const resultShareSchema = templates
  .full('result-share', 'Compartilhamento do Resultado')
  .category('result')
  .icon('Share2')
  .addField({ key: 'title', label: 'Título', type: 'string', group: 'content', default: 'Compartilhe seu resultado' })
  .addField({ key: 'platforms', label: 'Plataformas', type: 'options-list', group: 'content', default: ['facebook', 'twitter', 'whatsapp', 'linkedin'] })
  .addField({ key: 'message', label: 'Mensagem', type: 'string', group: 'content', default: 'Confira meu resultado!' })
  .version('1.0.0')
  .build();
