// =====================================================================
// 1. src/types.ts - Definições de tipos (Corrigido e Expandido)
// =====================================================================
import React from 'react';

// Tipos para ícones Lucide React (expandido para incluir todos os usados nas definições)
// A lista é grande, mas focaremos na correção da estrutura do schema.
export type IconType =
  | 'Type'
  | 'Heading1'
  | 'RectangleHorizontal'
  | 'StretchHorizontal'
  | 'Image'
  | 'Input'
  | 'HelpCircle'
  | 'Award'
  | 'CheckCircle'
  | 'Play'
  | 'LoaderCircle'
  | 'AlignHorizontalDistributeEnd'
  | 'Sparkles'
  | 'Quote'
  | 'TextCursorInput'
  | 'Proportions'
  | 'ChartArea'
  | 'SlidersHorizontal'
  | 'List'
  | 'ArrowRightLeft'
  | 'Rows3'
  | 'CircleDollarSign'
  | 'Code'
  | 'Scale'
  | 'Video'
  | 'ShoppingCart'
  | 'Clock'
  | 'MessageSquare'
  | 'Shield'
  | 'Gift'
  | 'Brain'
  | 'Crown'
  | 'Layers'
  | 'RotateCw'
  | 'Heart'
  | 'Stack'
  | 'Users'
  | 'TriangleAlert'
  | 'Book'
  | 'Mic'
  | 'GalleryHorizontalEnd'
  | 'Zap'
  | 'Target'
  | 'TrendingUp'; // Adicionei os ícones que estavam faltando no HTML anterior


// Tipos base para o schema de propriedades
export type PropertyInputType =
  | 'text-input'
  | 'textarea'
  | 'number-input'
  | 'boolean-switch'
  | 'color-picker'
  | 'select'
  | 'image-url'
  | 'video-url'
  | 'array-editor'
  | 'json-editor';

export interface PropertyOption {
  label: string;
  value: string;
}

export interface PropertySchema {
  key: string;
  label: string;
  type: PropertyInputType;
  placeholder?: string;
  defaultValue?: any;
  options?: PropertyOption[];
  min?: number;
  max?: number;
  rows?: number;
  description?: string;
  itemSchema?: PropertySchema[]; // Para 'array-editor'
  nestedPath?: string; // Para propriedades aninhadas
  hidden?: boolean; // Para ocultar no painel
}

// Definição de um bloco para o editor (com metadados para a sidebar)
export interface BlockDefinition {
  // Removido 'id: string;' pois 'type' já serve como identificador único para a definição do bloco.
  type: string; // Tipo de bloco (usado para mapear para o componente React e como ID único)
  name: string; // Nome amigável para exibição na sidebar
  description: string; // Descrição breve do bloco
  icon: IconType; // Nome do ícone Lucide como string
  category: string; // Categoria para agrupar na sidebar (ex: 'Texto', 'Mídia', 'Quiz')
  tags?: string[]; // Tags opcionais para busca/filtragem
  isNew?: boolean; // Flag para indicar que é um bloco novo (pode exibir um badge "Novo!")
  propertiesSchema?: PropertySchema[]; // O schema de propriedades para este bloco
}

// Interface base para qualquer bloco (mantida do código anterior)
export interface Block {
  id: string; // ID único da instância do bloco no funil
  type: string; // Corresponde ao BlockDefinition.type
  properties: Record<string, any>; // Propriedades específicas do bloco
}

// Interface para as opções de um quiz (mais detalhada)
export interface QuizOption {
    id: string;
    text: string; // Pode ser HTML (rich text)
    imageUrl?: string;
    profileType?: string; // Ex: 'Natural', 'Clássico' - para pontuação/perfil
    scoreValue?: number; // Pontuação para a opção
    nextStepId?: string; // Se a opção leva a um caminho condicional
}

// Interfaces para as propriedades de blocos específicos (mantidas do código anterior)
export interface InputBlockProps {
  label: string;
  placeholder?: string;
  inputType: 'text' | 'email' | 'number' | 'password';
  required?: boolean;
  value?: string;
}

export interface ImageBlockProps {
  imageUrl: string;
  altText?: string;
  maxWidth?: number;
  height?: number;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  borderRadius?: BorderSizeType;
}

// Tipos para layout e estilo (mantidos do código anterior)
export type LayoutType = '1-column' | '2-columns' | '3-columns';
export type DirectionType = 'vertical' | 'horizontal';
export type DispositionType = 'image-text' | 'text-image' | 'text-only' | 'image-only';
export type BorderSizeType = 'none' | 'small' | 'medium' | 'large';
export type ShadowSizeType = 'none' | 'small' | 'medium' | 'large';
export type SpacingType = 'small' | 'medium' | 'large';
export type DetailType = 'none' | 'line' | 'dot';
export type StyleType = 'simple' | 'card';

// Interface para o funil (simplificado para este exemplo)
export interface Funnel {
  id: string;
  name: string;
  pages: Page[];
  config: Record<string, any>;
  version: number;
  isPublished: boolean;
}

// Interface para uma página do funil (simplificado)
export interface Page {
  id: string;
  title: string;
  blocks: Block[];
}


// =====================================================================
// 2. src/config/blockDefinitions.ts - Definição dos schemas para cada tipo de bloco (Corrigido e Refatorado)
// =====================================================================
// Importe v4 as uuidv4 se ainda não estiver importado no arquivo principal
// import { v4 as uuidv4 } from 'uuid';

export const blockDefinitions: BlockDefinition[] = [
  // Categoria: Texto
  {
    type: 'main-heading-inline', // Renomeado para inline
    name: 'Título Principal (Inline)',
    description: 'Cabeçalho principal horizontal responsivo inline.',
    icon: 'Heading1', // Corrigido para o nome Lucide correto
    category: 'Inline',
    propertiesSchema: [
      {
        key: 'title',
        label: 'Texto do Título',
        type: 'text-input',
        placeholder: 'Seu Título Aqui',
        defaultValue: 'Título Principal'
      },

  {
    type: 'text-inline',
    name: 'Parágrafo (Inline)',
    description: 'Bloco de texto horizontal responsivo inline com suporte a personalização.',
    icon: 'Type',
    category: 'Inline',
    propertiesSchema: [
      {
        key: 'content',
        label: 'Conteúdo',
        type: 'textarea',
        placeholder: 'Digite seu texto aqui...',
        rows: 4,
        defaultValue: 'Conteúdo do texto aqui...'
      },

  { label: 'Scale In', value: 'scaleIn' },
        ],
        defaultValue: 'fadeIn',
      }
    ],
  },

  // Categoria: Mídia
  {
    type: 'image-inline',
    name: 'Imagem (Inline)',
    description: 'Imagem horizontal responsiva inline.',
    icon: 'Image', // Corrigido para o nome Lucide correto
    category: 'Inline',
    propertiesSchema: [
      {
        key: 'src',
        label: 'URL da Imagem',
        type: 'image-url',
        placeholder: 'https://via.placeholder.com/600x400',
        defaultValue: 'https://via.placeholder.com/600x400?text=Imagem'
      },

  {
    type: 'video-player', // Corrigido de 'video' para 'video-player' para consistência
    name: 'Player de Vídeo',
    description: 'Incorporação de vídeo YouTube/Vimeo.',
    icon: 'Video', // Corrigido para o nome Lucide correto
    category: 'Mídia',
    propertiesSchema: [
      {
        key: 'videoUrl',
        label: 'URL do Vídeo',
        type: 'video-url',
        placeholder: 'https://youtube.com/watch?v=...',
        description: 'Insira a URL direta para o arquivo de vídeo (.mp4, .webm, etc.) ou link do YouTube/Vimeo.'
      },

  {
    type: 'audio',
    name: 'Player de Áudio', // Mais descritivo
    description: 'Player de áudio.',
    icon: 'Mic', // Corrigido para o nome Lucide correto
    category: 'Mídia',
    propertiesSchema: [
      { key: 'audioUrl', label: 'URL do Áudio', type: 'video-url', placeholder: 'https://example.com/audio.mp3', description: 'Insira a URL direta para o arquivo de áudio (.mp3, .wav, etc.).' },

  {
    type: 'carousel',
    name: 'Carrossel de Imagens', // Mais descritivo
    description: 'Galeria de imagens deslizante.',
    icon: 'GalleryHorizontalEnd', // Corrigido para o nome Lucide correto
    category: 'Mídia',
    propertiesSchema: [
      {
        key: 'images',
        label: 'Imagens do Carrossel',
        type: 'array-editor',
        itemSchema: [
          { key: 'src', label: 'URL da Imagem', type: 'image-url', placeholder: 'https://example.com/img1.jpg' },

  { key: 'interval', label: 'Intervalo (ms)', type: 'number-input', min: 1000, defaultValue: 5000, description: 'Tempo entre as transições de imagem.' },
    ],
  },

  // Categoria: Interação
  {
    type: 'button',
    name: 'Botão',
    description: 'Botão de ação personalizável.',
    icon: 'RectangleHorizontal', // Corrigido para o nome Lucide correto
    category: 'Interação',
    propertiesSchema: [
      {
        key: 'text',
        label: 'Texto do Botão',
        type: 'text-input',
        placeholder: 'Clique aqui',
        defaultValue: 'Texto do Botão'
      },

  {
    type: 'form-input', // Renomeado para 'form-input' para clareza
    name: 'Campo de Entrada',
    description: 'Input de texto genérico para formulários.',
    icon: 'TextCursorInput', // Corrigido para o nome Lucide correto
    category: 'Formulário', // Nova categoria
    propertiesSchema: [
      { key: 'label', label: 'Rótulo', type: 'text-input', placeholder: 'Nome Completo' },

  { key: 'required', label: 'Obrigatório', type: 'boolean-switch', defaultValue: false },
    ],
  },

  // Categoria: UI
  {
    type: 'spacer',
    name: 'Espaçador',
    description: 'Adiciona espaço em branco entre blocos.',
    icon: 'StretchHorizontal', // Corrigido para o nome Lucide correto
    category: 'UI',
    propertiesSchema: [
      {
        key: 'height',
        label: 'Altura',
        type: 'text-input',
        placeholder: '50px, 2rem, etc.',
        defaultValue: '50px'
      },

  {
    type: 'alert',
    name: 'Alerta',
    description: 'Caixa de mensagem de alerta com diferentes variantes.',
    icon: 'TriangleAlert', // Corrigido para o nome Lucide correto
    category: 'UI',
    propertiesSchema: [
      { key: 'title', label: 'Título do Alerta', type: 'text-input', placeholder: 'Atenção!' },

  {
    type: 'loader', // Renomeado de 'loader' para 'loader' para consistência
    name: 'Indicador de Carregamento', // Mais descritivo
    description: 'Indicador de carregamento animado.',
    icon: 'LoaderCircle', // Corrigido para o nome Lucide correto
    category: 'UI',
    propertiesSchema: [
      { key: 'message', label: 'Mensagem', type: 'text-input', placeholder: 'Carregando...' },

  {
    type: 'confetti',
    name: 'Efeito Confetti', // Mais descritivo
    description: 'Efeito visual de confete.',
    icon: 'Sparkles', // Corrigido para o nome Lucide correto
    category: 'UI',
    isNew: true,
    propertiesSchema: [
      { key: 'duration', label: 'Duração (ms)', type: 'number-input', defaultValue: 3000, min: 500, description: 'Tempo que o confete fica visível.' },

  {
    type: 'marquee',
    name: 'Marquise (Texto Rolante)', // Mais descritivo
    description: 'Texto rolando horizontalmente.',
    icon: 'ArrowRightLeft', // Corrigido para o nome Lucide correto
    category: 'UI',
    isNew: true,
    propertiesSchema: [
      { key: 'text', label: 'Texto da Marquise', type: 'text-input', placeholder: 'Texto que rola...' },

  {
    type: 'options-grid',
    name: 'Grid de Opções',
    description: 'Exibe opções em um formato de grade, ideal para seleção visual com imagens grandes.',
    icon: 'Rows3',
    category: 'UI',
    propertiesSchema: [
      { key: 'title', label: 'Título da Seção', type: 'text-input', placeholder: 'Escolha sua opção:', defaultValue: '' },

  { key: 'selectedOptions', label: 'Opções Selecionadas', type: 'array-editor', itemSchema: [
        { key: 'value', label: 'ID da Opção', type: 'text-input', placeholder: 'opcao-1', defaultValue: '' }
      ], defaultValue: [] },
    ],
  },

  // Categoria: Gráficos
  {
    type: 'chart-area',
    name: 'Gráfico de Área',
    description: 'Gráfico de área para visualizar dados.',
    icon: 'ChartArea', // Corrigido para o nome Lucide correto
    category: 'Gráficos',
    propertiesSchema: [
      { key: 'title', label: 'Título do Gráfico', type: 'text-input', placeholder: 'Gráfico de Área' },

  {
    type: 'chart-compare',
    name: 'Gráfico de Comparação', // Mais descritivo
    description: 'Gráfico de comparação de dois valores.',
    icon: 'AlignHorizontalDistributeEnd', // Corrigido para o nome Lucide correto
    category: 'Gráficos',
    isNew: true,
    propertiesSchema: [
      { key: 'title', label: 'Título da Comparação', type: 'text-input', placeholder: 'Antes vs Depois' },

  {
    type: 'chart-level',
    name: 'Indicador de Nível', // Mais descritivo
    description: 'Indicador circular de nível ou progresso.',
    icon: 'SlidersHorizontal', // Corrigido para o nome Lucide correto
    category: 'Gráficos',
    propertiesSchema: [
      { key: 'value', label: 'Valor (%)', type: 'number-input', defaultValue: 75, min: 0, max: 100 },

  { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color-picker', defaultValue: '#e0e7ff' },
    ],
  },

  // Categoria: Social
  {
    type: 'arguments',
    name: 'Argumentos/Benefícios', // Mais descritivo
    description: 'Lista de argumentos ou benefícios com ícones.',
    icon: 'Book', // Corrigido para o nome Lucide correto
    category: 'Social',
    propertiesSchema: [
      { key: 'title', label: 'Título', type: 'text-input', placeholder: 'Por que escolher nosso produto?' },

  {
    type: 'quote',
    name: 'Citação',
    description: 'Um bloco de citação com autor.',
    icon: 'Quote', // Corrigido para o nome Lucide correto
    category: 'Social',
    propertiesSchema: [
      { key: 'text', label: 'Texto da Citação', type: 'textarea', placeholder: 'A vida é o que acontece enquanto você está ocupado fazendo outros planos.', rows: 3 },

  { key: 'author', label: 'Autor', type: 'text-input', placeholder: 'John Lennon' },
    ],
  },

  // Categoria: Credibilidade
  {
    type: 'testimonials-grid',
    name: 'Grade de Depoimentos',
    description: 'Seção com múltiplos depoimentos de clientes.',
    icon: 'Users', // Corrigido para o nome Lucide correto
    category: 'Credibilidade',
    propertiesSchema: [
      { key: 'title', label: 'Título da Seção', type: 'text-input', placeholder: 'O que nossos clientes dizem', defaultValue: 'Depoimentos' },

  {
        key: 'testimonials',
        label: 'Depoimentos',
        type: 'array-editor',
        defaultValue: [
          { name: 'Maria Silva', text: 'A consultoria mudou completamente minha relação com a moda!', rating: 5, image: 'https://placehold.co/100x100/cccccc/333333?text=Avatar', occupation: 'Empresária' }
        ],
        itemSchema: [
          { key: 'name', label: 'Nome', type: 'text-input' },

  {
    type: 'faq-section',
    name: 'Perguntas Frequentes',
    description: 'Seção de FAQ com perguntas e respostas.',
    icon: 'HelpCircle', // Corrigido para o nome Lucide correto
    category: 'Credibilidade',
    propertiesSchema: [
      { key: 'title', label: 'Título da Seção', type: 'text-input', placeholder: 'Perguntas Frequentes', defaultValue: 'Dúvidas Frequentes' },

  {
    type: 'guarantee-section', // Renomeado para consistência
    name: 'Seção de Garantia',
    description: 'Selo de garantia para transmitir confiança.',
    icon: 'Shield', // Corrigido para o nome Lucide correto
    category: 'Credibilidade',
    propertiesSchema: [
      { key: 'title', label: 'Título', type: 'text-input', defaultValue: 'Garantia Incondicional' },

  { key: 'showMoneyBackBadge', label: 'Mostrar Selo "Dinheiro de Volta"', type: 'boolean-switch', defaultValue: true }, // Corrigido o nome da chave
      { key: 'additionalInfo', label: 'Informações Adicionais', type: 'textarea', rows: 2, placeholder: 'Termos e condições adicionais' }
    ],
  },

  // Categoria: Vendas
  {
    type: 'product-carousel',
    name: 'Carrossel de Produtos',
    description: 'Carrossel responsivo com produtos e CTAs.',
    icon: 'ShoppingCart',
    category: 'Vendas',
    propertiesSchema: [
      { key: 'title', label: 'Título', type: 'text-input', defaultValue: 'Nossos Produtos' },

  {
        key: 'products',
        label: 'Produtos',
        type: 'array-editor',
        defaultValue: [
          { id: '1', name: 'Produto 1', description: 'Descrição do produto', price: 'R$ 97,00', image: 'https://placehold.co/400x300', ctaText: 'Comprar Agora' }
        ],
        itemSchema: [
          { key: 'id', label: 'ID', type: 'text-input' },

  {
    type: 'before-after',
    name: 'Antes e Depois',
    description: 'Comparação interativa antes e depois.',
    icon: 'ArrowRightLeft',
    category: 'Vendas',
    propertiesSchema: [
      { key: 'title', label: 'Título', type: 'text-input', defaultValue: 'Transformação' },

  {
    type: 'two-columns',
    name: 'Duas Colunas',
    description: 'Layout responsivo de duas colunas com depoimentos ou conteúdo personalizado.',
    icon: 'Rows3',
    category: 'Inline',
    propertiesSchema: [
      { key: 'title', label: 'Título da Seção', type: 'text-input', defaultValue: 'Depoimentos dos Clientes' },

  {
    type: 'pros-cons',
    name: 'Prós e Contras',
    description: 'Lista de vantagens e desvantagens.',
    icon: 'Scale',
    category: 'Vendas',
    propertiesSchema: [
      { key: 'title', label: 'Título', type: 'text-input', defaultValue: 'Prós e Contras' },

  {
    type: 'dynamic-pricing',
    name: 'Preços Dinâmicos',
    description: 'Tabela de preços flexível e responsiva.',
    icon: 'CircleDollarSign',
    category: 'Vendas',
    propertiesSchema: [
      { key: 'title', label: 'Título', type: 'text-input', defaultValue: 'Escolha seu Plano' },

  {
        key: 'plans',
        label: 'Planos',
        type: 'array-editor',
        defaultValue: [
          { id: '1', name: 'Básico', price: '97', features: ['Recurso 1', 'Recurso 2'], ctaText: 'Escolher Plano' }
        ],
        itemSchema: [
          { key: 'id', label: 'ID', type: 'text-input' },

  {
    type: 'value-anchoring',
    name: 'Ancoragem de Valor',
    description: 'Demonstração de valor e ROI.',
    icon: 'Target',
    category: 'Vendas',
    propertiesSchema: [
      { key: 'title', label: 'Título', type: 'text-input', defaultValue: 'Valor Investido vs Retorno' },

  {
    type: 'sales-offer',
    name: 'Oferta de Vendas',
    description: 'Apresentação da oferta principal com preços.',
    icon: 'ShoppingCart', // Corrigido para o nome Lucide correto
    category: 'Vendas',
    propertiesSchema: [
      { key: 'productName', label: 'Nome do Produto/Serviço', type: 'text-input', defaultValue: 'Consultoria de Estilo Personalizada' },

  {
    type: 'urgency-timer',
    name: 'Timer de Urgência',
    description: 'Contador regressivo para criar urgência.',
    icon: 'Clock', // Corrigido para o nome Lucide correto
    category: 'Vendas',
    propertiesSchema: [
      { key: 'title', label: 'Título', type: 'text-input', defaultValue: 'Oferta expira em:' },

  {
    type: 'bonus-section',
    name: 'Seção de Bônus',
    description: 'Bônus adicionais para aumentar o valor percebido.',
    icon: 'Gift', // Corrigido para o nome Lucide correto
    category: 'Vendas',
    propertiesSchema: [
      { key: 'title', label: 'Título', type: 'text-input', defaultValue: 'Bônus Exclusivos' },

  {
        key: 'bonuses',
        label: 'Lista de Bônus',
        type: 'array-editor',
        defaultValue: [
          { name: 'Guia de Maquiagem', description: 'Técnicas para valorizar seu estilo', value: 97, image: 'https://placehold.co/100x100/cccccc/333333?text=Bonus' }
        ],
        itemSchema: [
          { key: 'name', label: 'Nome do Bônus', type: 'text-input' },

  { label: 'Grid', value: 'grid' }
        ]
      }
    ],
  },

  // Categoria: Outros (para blocos genéricos ou de integração)
  {
    type: 'script',
    name: 'Script Personalizado', // Mais descritivo
    description: 'Insere código JavaScript customizado na página.',
    icon: 'Code', // Corrigido para o nome Lucide correto
    category: 'Outros',
    propertiesSchema: [
      { key: 'code', label: 'Código JavaScript', type: 'textarea', rows: 10, placeholder: 'console.log("Olá mundo!");', description: 'Insira o código JS que será injetado na página.' },

  {
    type: 'terms',
    name: 'Termos e Condições', // Mais descritivo
    description: 'Bloco de termos e condições ou aviso legal.',
    icon: 'Scale', // Corrigido para o nome Lucide correto
    category: 'Outros',
    propertiesSchema: [
      { key: 'title', label: 'Título', type: 'text-input', defaultValue: 'Termos e Condições' },

  { key: 'content', label: 'Conteúdo', type: 'textarea', rows: 5, defaultValue: 'Leia nossos termos de uso...' }
    ],
  },

  // Outros blocos (mantidos e ajustados)
  {
    type: 'list',
    name: 'Lista de Itens', // Mais descritivo
    description: 'Lista de itens (ordenada ou não).',
    icon: 'List',
    category: 'Texto',
    isNew: true,
    propertiesSchema: [
      { key: 'listType', label: 'Tipo de Lista', type: 'select', options: [{ label: 'Não Ordenada', value: 'ul' },

  {
    type: 'chart-compare',
    name: 'Gráfico de Comparação',
    description: 'Gráfico de comparação de dois valores.',
    icon: 'AlignHorizontalDistributeEnd',
    category: 'Gráficos',
    isNew: true,
    propertiesSchema: [
      { key: 'title', label: 'Título da Comparação', type: 'text-input', placeholder: 'Antes vs Depois' },

  {
    type: 'confetti',
    name: 'Efeito Confetti',
    description: 'Efeito visual de confete.',
    icon: 'Sparkles',
    category: 'UI',
    isNew: true,
    propertiesSchema: [
      { key: 'duration', label: 'Duração (ms)', type: 'number-input', defaultValue: 3000, min: 500, description: 'Tempo que o confete fica visível.' },

  {
    type: 'marquee',
    name: 'Marquise (Texto Rolante)',
    description: 'Texto rolando horizontalmente.',
    icon: 'ArrowRightLeft',
    category: 'UI',
    isNew: true,
    propertiesSchema: [
      { key: 'text', label: 'Texto da Marquise', type: 'text-input', placeholder: 'Texto que rola...' },

  {
    type: 'options-grid',
    name: 'Grid de Opções',
    description: 'Exibe opções em um formato de grade, ideal para seleção visual.',
    icon: 'Rows3',
    category: 'UI',
    propertiesSchema: [
      { key: 'title', label: 'Título da Seção', type: 'text-input', placeholder: 'Escolha sua opção:' },

  {
    type: 'script',
    name: 'Script Personalizado',
    description: 'Insere código JavaScript customizado na página.',
    icon: 'Code',
    category: 'Outros',
    propertiesSchema: [
      { key: 'code', label: 'Código JavaScript', type: 'textarea', rows: 10, placeholder: 'console.log("Olá mundo!");', description: 'Insira o código JS que será injetado na página.' },

  {
    type: 'terms',
    name: 'Termos e Condições',
    description: 'Bloco de termos e condições ou aviso legal.',
    icon: 'Scale',
    category: 'Outros',
    propertiesSchema: [
      { key: 'title', label: 'Título', type: 'text-input', defaultValue: 'Termos e Condições' },

  { key: 'content', label: 'Conteúdo', type: 'textarea', rows: 5, defaultValue: 'Leia nossos termos de uso...' }
    ],
  },

  // NOVOS COMPONENTES MODULARES INLINE - ETAPAS 20 E 21
  {
    type: 'result-header-inline',
    name: 'Cabeçalho de Resultado (Modular)',
    description: 'Cabeçalho modular para página de resultado',
    icon: 'Award',
    category: 'Resultado',
    propertiesSchema: [
      { key: 'logoUrl', label: 'URL do Logo', type: 'image-url', defaultValue: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp' }
    ]
  },

  {
    type: 'quiz-offer-pricing',
    name: 'Preços da Oferta (Modular)',
    description: 'Seção modular de preços para página de oferta',
    icon: 'ShoppingCart',
    category: 'Oferta',
    propertiesSchema: [
      { key: 'originalPrice', label: 'Preço Original', type: 'text-input', defaultValue: 'R$ 175,00' },

  {
    type: 'countdown-timer',
    name: 'Timer de Contagem Regressiva (Modular)',
    description: 'Timer modular de urgência para ofertas',
    icon: 'Clock',
    category: 'Oferta',
    propertiesSchema: [
      { key: 'initialMinutes', label: 'Minutos Iniciais', type: 'number-input', defaultValue: 15, min: 1, max: 60 },

  {
    type: 'bonus-boxflex-inline',
    name: '6. Lista de Bônus',
    description: 'Lista horizontal editável de bônus inclusos',
    icon: 'Gift',
    category: 'Resultado',
    propertiesSchema: [
      { 
        key: 'bonusList', 
        label: 'Lista de Bônus', 
        type: 'json-editor', 
        defaultValue: [
          'Peças-chave do guarda-roupa',
          'Visagismo facial personalizado'
        ]
      }
    ]
  },

  {
    type: 'testimonials-boxflex-inline',
    name: '7. Depoimentos',
    description: 'Lista horizontal editável de depoimentos',
    icon: 'MessageSquare',
    category: 'Resultado',
    propertiesSchema: [
      { 
        key: 'testimonials', 
        label: 'Lista de Depoimentos', 
        type: 'json-editor', 
        defaultValue: [
          'Adorei! Mudou completamente minha forma de me vestir',
          'Finalmente entendi meu estilo. Recomendo para todas!'
        ]
      }
    ]
  },

  {
    type: 'cta-green-boxflex-inline',
    name: '8. CTA Verde',
       description: 'Call-to-action verde com botão de compra inline',
    icon: 'ShoppingCart',
    category: 'Resultado',
    propertiesSchema: [
      { key: 'ctaText', label: 'Texto do CTA', type: 'text-input', defaultValue: 'Quero meu guia agora!' }
    ]
  },

  {
    type: 'guarantee-boxflex-inline',
    name: '9. Garantia',
    description: 'Seção de garantia editável inline',
    icon: 'Shield',
    category: 'Resultado',
    propertiesSchema: [
      { key: 'guaranteeText', label: 'Texto da Garantia', type: 'text-input', defaultValue: '7 dias de garantia incondicional' }
    ]
  },

  {
    type: 'mentor-boxflex-inline',
    name: '10. Mentora',
    description: 'Seção da mentora editável inline',
    icon: 'Users',
    category: 'Resultado',
    propertiesSchema: [
      { key: 'mentorText', label: 'Texto da Mentora', type: 'text-input', defaultValue: 'Gisele Galvão - Especialista em Imagem' }
    ]
  },

  {
    type: 'value-stack-boxflex-inline',
    name: '11. Value Stack',
    description: 'Pilha de valor com preços e oferta editáveis',
    icon: 'CircleDollarSign',
    category: 'Resultado',
    propertiesSchema: [
      { 
        key: 'stackList', 
        label: 'Lista de Itens', 
        type: 'json-editor', 
        defaultValue: [
          'Guia principal - R$67',
          'Peças-chave - R$79',
          'Visagismo facial - R$29'
        ]
      },

  {
    type: 'build-info-boxflex-inline',
    name: '12. Build Info',
    description: 'Informações do build do sistema',
    icon: 'Code',
    category: 'Resultado',
    propertiesSchema: [
      { key: 'buildInfo', label: 'Informações do Build', type: 'text-input', defaultValue: 'v1.0.0 - 2025-01-15' }
    ],
  },

  // ===== ETAPA 20 - COMPONENTES BOXFLEX MODULARES =====
  // Ordem correta do canvas da página de resultado
  
  {
    type: 'header-boxflex-inline',
    name: '1. Header BoxFlex',
    description: 'Cabeçalho com logo, nome do funil e status de publicação',
    icon: 'Award',
    category: 'Resultado',
    propertiesSchema: [
      { key: 'logo', label: 'URL do Logo', type: 'image-url', defaultValue: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp' },

  {
    type: 'result-main-boxflex-inline',
    name: '2. Resultado Principal',
    description: 'Card principal com estilo, porcentagem e descrição editáveis',
    icon: 'Target',
    category: 'Resultado',
    propertiesSchema: [
      { key: 'styleName', label: 'Nome do Estilo', type: 'text-input', defaultValue: 'Natural' },

  {
    type: 'secondary-styles-boxflex-inline',
    name: '3. Estilos Secundários',
    description: 'Lista horizontal editável dos estilos secundários',
    icon: 'Layers',
    category: 'Resultado',
    propertiesSchema: [
      { 
        key: 'secondaryStyles', 
        label: 'Estilos Secundários', 
        type: 'json-editor', 
        defaultValue: [
          { category: 'Moderno', percentage: 10 },

  {
    type: 'before-after-boxflex-inline',
    name: '4. Antes e Depois',
    description: 'Seção de transformação antes/depois com imagens',
    icon: 'ArrowRightLeft',
    category: 'Resultado',
    propertiesSchema: [
      { key: 'before', label: 'Texto Antes', type: 'text-input', defaultValue: 'Antes: insegurança' },

  {
    type: 'motivation-boxflex-inline',
    name: '5. Motivação',
    description: 'Seção motivacional editável inline',
    icon: 'Sparkles',
    category: 'Resultado',
    propertiesSchema: [
      { key: 'motivationText', label: 'Texto Motivacional', type: 'text-input', defaultValue: 'Vista-se de você — na prática' }
    ],
  },

  {
    type: 'bonus-boxflex-inline',
    name: '6. Lista de Bônus',
    description: 'Lista horizontal editável de bônus inclusos',
    icon: 'Gift',
    category: 'Resultado',
    propertiesSchema: [
      { 
        key: 'bonusList', 
        label: 'Lista de Bônus', 
        type: 'json-editor', 
        defaultValue: [
          'Peças-chave do guarda-roupa',
          'Visagismo facial personalizado'
        ]
      }
    ],
  },

  {
    type: 'testimonials-boxflex-inline',
    name: '7. Depoimentos',
    description: 'Lista horizontal editável de depoimentos',
    icon: 'MessageSquare',
    category: 'Resultado',
    propertiesSchema: [
      { 
        key: 'testimonials', 
        label: 'Lista de Depoimentos', 
        type: 'json-editor', 
        defaultValue: [
          'Adorei! Mudou completamente minha forma de me vestir',
          'Finalmente entendi meu estilo. Recomendo para todas!'
        ]
      }
    ],
  },

  {
    type: 'cta-green-boxflex-inline',
    name: '8. CTA Verde',
    description: 'Call-to-action verde com botão de compra inline',
    icon: 'ShoppingCart',
    category: 'Resultado',
    propertiesSchema: [
      { key: 'ctaText', label: 'Texto do CTA', type: 'text-input', defaultValue: 'Quero meu guia agora!' }
    ],
  },

  {
    type: 'guarantee-boxflex-inline',
    name: '9. Garantia',
    description: 'Seção de garantia editável inline',
    icon: 'Shield',
    category: 'Resultado',
    propertiesSchema: [
      { key: 'guaranteeText', label: 'Texto da Garantia', type: 'text-input', defaultValue: '7 dias de garantia incondicional' }
    ],
  },

  {
    type: 'mentor-boxflex-inline',
    name: '10. Mentora',
    description: 'Seção da mentora editável inline',
    icon: 'Users',
    category: 'Resultado',
    propertiesSchema: [
      { key: 'mentorText', label: 'Texto da Mentora', type: 'text-input', defaultValue: 'Gisele Galvão - Especialista em Imagem' }
    ],
  },

  {
    type: 'value-stack-boxflex-inline',
    name: '11. Value Stack',
    description: 'Pilha de valor com preços e oferta editáveis',
    icon: 'CircleDollarSign',
    category: 'Resultado',
    propertiesSchema: [
      { 
        key: 'stackList', 
        label: 'Lista de Itens', 
        type: 'json-editor', 
        defaultValue: [
          'Guia principal - R$67',
          'Peças-chave - R$79',
          'Visagismo facial - R$29'
        ]
      },

  {
    type: 'build-info-boxflex-inline',
    name: '12. Build Info',
    description: 'Informações do build do sistema',
    icon: 'Code',
    category: 'Resultado',
    propertiesSchema: [
      { key: 'buildInfo', label: 'Informações do Build', type: 'text-input', defaultValue: 'v1.0.0 - 2025-01-15' }
    ],
  },

  // =====================================================================
  // COMPONENTES INLINE ESPECÍFICOS DA ETAPA 20 (RESULT PAGE)
  // =====================================================================
  
  {
    type: 'result-header-inline',
    name: 'Cabeçalho de Resultado (Inline)',
    description: 'Card principal com estilo predominante, progresso e imagens',
    icon: 'Award',
    category: 'Result Page',
    propertiesSchema: [
      {
        key: 'title',
        label: 'Título',
        type: 'text-input',
        placeholder: 'Seu estilo predominante',
        defaultValue: 'Seu Estilo Predominante'
      },

  {
    type: 'value-stack-inline',
    name: 'Stack de Valor (Inline)',
    description: 'Seção com benefícios, itens de valor e preços',
    icon: 'CircleDollarSign',
    category: 'Result Page',
    propertiesSchema: [
      {
        key: 'title',
        label: 'Título',
        type: 'text-input',
        defaultValue: 'O Que Você Recebe Hoje'
      },

  {
            key: 'value',
            label: 'Valor',
            type: 'text-input',
            defaultValue: 'R$ 0,00'
          }
        ],
        defaultValue: [
          { name: 'Guia Principal', value: 'R$ 67,00' },

  {
    type: 'cta-section-inline',
    name: 'Seção CTA (Inline)',
    description: 'Seção de call-to-action com título e botão',
    icon: 'ShoppingCart',
    category: 'Result Page',
    propertiesSchema: [
      {
        key: 'title',
        label: 'Título',
        type: 'text-input',
        defaultValue: 'Descubra Como Aplicar Seu Estilo na Prática'
      },

  {
    type: 'guarantee-inline',
    name: 'Garantia (Inline)',
    description: 'Seção de garantia com ícone e características',
    icon: 'Shield',
    category: 'Result Page',
    propertiesSchema: [
      {
        key: 'title',
        label: 'Título',
        type: 'text-input',
        defaultValue: 'Garantia de 30 Dias'
      },

  {
    type: 'transformation-inline',
    name: 'Transformação (Inline)',
    description: 'Comparação antes/depois com imagens e descrições',
    icon: 'ArrowRightLeft',
    category: 'Result Page',
    propertiesSchema: [
      {
        key: 'title',
        label: 'Título Principal',
        type: 'text-input',
        defaultValue: 'Sua Transformação Começa Aqui'
      },

  {
    type: 'final-value-proposition-inline',
    name: 'Proposta de Valor Final (Inline)',
    description: 'Seção final com título, benefícios e CTA',
    icon: 'Crown',
    category: 'Result Page',
    propertiesSchema: [
      {
        key: 'title',
        label: 'Título Principal',
        type: 'text-input',
        defaultValue: 'Vista-se de Você — na Prática'
      },

  {
        key: 'benefits',
        label: 'Benefícios',
        type: 'array-editor',
        itemSchema: [
          {
            key: 'benefit',
            label: 'Benefício',
            type: 'text-input',
            defaultValue: 'Benefício'
          }
        ],
        defaultValue: [
          'Looks com intenção e identidade',
          'Cores, modelagens e tecidos a seu favor',
          'Imagem alinhada aos seus objetivos',
          'Guarda-roupa funcional, sem compras por impulso'
        ],
      }
    ],
  },

  // =====================================================================
  // NOVOS BLOCOS INLINE MODULARES ETAPAS 20 E 21 - ES7+ PADRÃO
  // =====================================================================
  
  {
    type: 'result-card-inline',
    name: 'Card de Resultado (Inline)',
    description: 'Card modular com o resultado do quiz personalizado',
    icon: 'Award',
    category: 'Inline',
    propertiesSchema: [
      {
        key: 'resultTitle',
        label: 'Título do Resultado',
        type: 'text-input',
        defaultValue: 'Seu Estilo Único'
      },

  {
    type: 'quiz-offer-pricing-inline',
    name: 'Preços da Oferta (Inline)',
    description: 'Seção modular de preços para a página de oferta',
    icon: 'CircleDollarSign',
    category: 'Inline',
    propertiesSchema: [
      {
        key: 'originalPrice',
        label: 'Preço Original',
        type: 'text-input',
        defaultValue: 'R$ 175,00'
      },

  {
    type: 'countdown-inline',
    name: 'Contador Regressivo (Inline)',
    description: 'Contador regressivo modular para urgência',
    icon: 'Clock',
    category: 'Inline',
    propertiesSchema: [
      {
        key: 'title',
        label: 'Título',
        type: 'text-input',
        defaultValue: 'Oferta expira em:'
      }
    ]
  },

  {
    type: 'button-inline',
    name: 'Botão (Inline)',
    description: 'Botão modular personalizável para CTAs',
    icon: 'RectangleHorizontal',
    category: 'Inline',
    propertiesSchema: [
      {
        key: 'text',
        label: 'Texto do Botão',
        type: 'text-input',
        defaultValue: 'Clique Aqui'
      }
    ]
  }
];


// =====================================================================
// 3. Funções utilitárias para trabalhar com as definições de blocos
// =====================================================================

/**
 * Encontra uma definição de bloco pelo tipo
 * @param type Tipo do bloco a ser encontrado
 * @returns A definição do bloco ou undefined se não encontrado
 */
export function findBlockDefinition(type: string): BlockDefinition | undefined {
  return blockDefinitions.find(def => def.type === type);
}

/**
 * Obtém todas as categorias únicas dos blocos
 * @returns Array com todas as categorias disponíveis
 */
export function getCategories(): string[] {
  const categories = new Set(blockDefinitions.map(def => def.category));
  return Array.from(categories).sort();
}

/**
 * Obtém todos os blocos de uma categoria específica
 * @param category Nome da categoria
 * @returns Array com todas as definições de blocos da categoria
 */
export function getBlocksByCategory(category: string): BlockDefinition[] {
  return blockDefinitions.filter(def => def.category === category);
}

/**
 * Obtém blocos marcados como novos
 * @returns Array com todas as definições de blocos novos
 */
export function getNewBlocks(): BlockDefinition[] {
  return blockDefinitions.filter(def => def.isNew === true);
}

/**
 * Busca blocos por texto (nome, descrição ou tags)
 * @param searchTerm Termo de busca
 * @returns Array com definições de blocos que correspondem à busca
 */
export function searchBlocks(searchTerm: string): BlockDefinition[] {
  const term = searchTerm.toLowerCase();
  return blockDefinitions.filter(def => 
    def.name.toLowerCase().includes(term) ||
    def.description.toLowerCase().includes(term) ||
    def.tags?.some(tag => tag.toLowerCase().includes(term))
  );
}

/**
 * Valida se um tipo de bloco existe
 * @param type Tipo do bloco
 * @returns true se o tipo existe, false caso contrário
 */
export function isValidBlockType(type: string): boolean {
  return blockDefinitions.some(def => def.type === type);
}

/**
 * Cria um bloco com propriedades padrão baseado na definição
 * @param type Tipo do bloco
 * @param id ID único para o bloco (se não fornecido, será gerado)
 * @returns Objeto Block com propriedades padrão ou null se tipo inválido
 */
export function createDefaultBlock(type: string, id?: string): Block | null {
  const definition = findBlockDefinition(type);
  if (!definition) return null;

  const defaultProperties: Record<string, any> = {};
  
  // Preencher propriedades padrão baseado no schema
  definition.propertiesSchema?.forEach(prop => {
    if (prop.defaultValue !== undefined) {
      defaultProperties[prop.key] = prop.defaultValue;
    }
  });

  return {
    id: id || `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    properties: defaultProperties
  };
}

/**
 * Obtém o schema de propriedades para um tipo de bloco
 * @param type Tipo do bloco
 * @returns Array com o schema de propriedades ou undefined se não encontrado
 */
export function getBlockPropertiesSchema(type: string): PropertySchema[] | undefined {
  const definition = findBlockDefinition(type);
  return definition?.propertiesSchema;
}

// Export default para compatibilidade
export default blockDefinitions;
