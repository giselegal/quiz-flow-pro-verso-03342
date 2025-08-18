import { ComponentCategories, ComponentType } from '@/interfaces/editor';
import {
  Award,
  BarChart,
  Check,
  DollarSign,
  FileText,
  Gift,
  HelpCircle,
  Image as ImageIcon,
  Layers,
  MessageSquare,
  MousePointer,
  Shield,
  Star,
  Clock as Timer,
  Type,
  Users,
  Video,
} from 'lucide-react';

export const COMPONENT_CATEGORIES: ComponentCategories = {
  basic: {
    title: '📝 BÁSICOS',
    color: 'blue',
    components: [
      {
        type: 'logo',
        name: 'Logo',
        icon: Award,
        description: 'Logo da marca',
        defaultData: {
          src: 'https://placehold.co/200x80?text=Logo',
          alt: 'Logo da marca',
          style: {
            width: '180px',
            margin: '0 auto',
          },
        },
      },
      {
        type: 'title',
        name: 'Título',
        icon: Type,
        description: 'Título principal',
        defaultData: {
          text: 'Título Principal',
          style: {
            fontSize: '2rem',
            fontWeight: '700',
            textAlign: 'center',
            color: '#432818',
          },
        },
      },
      {
        type: 'subtitle',
        name: 'Subtítulo',
        icon: Type,
        description: 'Texto secundário',
        defaultData: {
          text: 'Subtítulo da página',
          style: {
            fontSize: '1.5rem',
            fontWeight: '600',
            textAlign: 'center',
            color: '#432818',
          },
        },
      },
      {
        type: 'text',
        name: 'Texto',
        icon: FileText,
        description: 'Parágrafo normal',
        defaultData: {
          text: 'Texto do parágrafo. Edite este conteúdo.',
          style: {
            fontSize: '1rem',
            fontWeight: 'normal',
            textAlign: 'left',
            color: '#432818',
          },
        },
      },
      {
        type: 'image',
        name: 'Imagem',
        icon: ImageIcon,
        description: 'Imagem responsiva',
      },
      {
        type: 'button',
        name: 'Botão',
        icon: MousePointer,
        description: 'Botão de ação',
      },
      {
        type: 'spacer',
        name: 'Espaço',
        icon: Layers,
        description: 'Espaçamento vertical',
        defaultData: {
          height: 40,
          style: {},
        },
      },
    ],
  },
  inline: {
    title: '⚡ INLINE',
    color: 'purple',
    components: [
      {
        type: 'text-inline',
        name: 'Texto Inline',
        icon: FileText,
        description: 'Texto modular e responsivo',
        defaultData: {
          text: 'Texto inline responsivo',
          gridSize: 'auto',
          style: {
            fontSize: '1rem',
            color: '#432818',
          },
        },
      },
      {
        type: 'badge-inline',
        name: 'Badge',
        icon: Award,
        description: 'Badge/etiqueta inline',
        defaultData: {
          text: 'Badge',
          variant: 'default',
          gridSize: 'auto',
        },
      },
      {
        type: 'stat-inline',
        name: 'Estatística',
        icon: BarChart,
        description: 'Estatística destacada',
        defaultData: {
          value: '95%',
          label: 'Satisfação',
          gridSize: 'auto',
        },
      },
      {
        type: 'progress-inline',
        name: 'Progresso',
        icon: BarChart,
        description: 'Barra de progresso inline',
        defaultData: {
          value: 75,
          showPercentage: true,
          gridSize: 'auto',
        },
      },
      {
        type: 'image-display',
        name: 'Imagem Display',
        icon: ImageIcon,
        description: 'Imagem com carregamento otimizado',
        defaultData: {
          src: 'https://placehold.co/400x300?text=Imagem',
          alt: 'Imagem responsiva',
          gridSize: 'auto',
        },
      },
      {
        type: 'style-card',
        name: 'Card de Estilo',
        icon: Layers,
        description: 'Card de estilo personalizado',
        defaultData: {
          title: 'Estilo Elegante',
          percentage: '85%',
          gridSize: 'half',
        },
      },
      {
        type: 'pricing-card',
        name: 'Card de Preço',
        icon: DollarSign,
        description: 'Card de preço/produto',
        defaultData: {
          title: 'Produto Premium',
          price: 'R$ 97',
          originalPrice: 'R$ 197',
          gridSize: 'half',
        },
      },
      {
        type: 'testimonial-card',
        name: 'Card Depoimento',
        icon: MessageSquare,
        description: 'Card de depoimento',
        defaultData: {
          name: 'Cliente Satisfeito',
          text: 'Excelente resultado!',
          rating: 5,
          gridSize: 'auto',
        },
      },
      {
        type: 'result-card',
        name: 'Card Resultado',
        icon: Star,
        description: 'Card de resultado personalizado',
        defaultData: {
          title: 'Seu Estilo',
          percentage: '85%',
          description: 'Baseado em suas respostas',
          gridSize: 'half',
        },
      },
      {
        type: 'countdown',
        name: 'Countdown Timer',
        icon: Timer,
        description: 'Timer de urgência',
        defaultData: {
          title: 'Oferta especial',
          minutes: 15,
          gridSize: 'auto',
        },
      },
    ],
  },
  interactive: {
    title: '🔘 INTERATIVOS',
    color: 'green',
    components: [
      {
        type: 'progress',
        name: 'Progresso',
        icon: BarChart,
        description: 'Barra de progresso',
        defaultData: {
          progressValue: 50,
          showPercentage: true,
          style: {
            width: '100%',
            maxWidth: '600px',
            margin: '0 auto',
          },
        },
      },
      {
        type: 'input',
        name: 'Campo',
        icon: Type,
        description: 'Campo de entrada',
        defaultData: {
          label: 'Nome Completo',
          placeholder: 'Digite seu nome completo',
          required: true,
          type: 'text',
          style: {
            width: '100%',
            maxWidth: '500px',
            margin: '0 auto',
          },
        },
      },
      {
        type: 'options',
        name: 'Opções',
        icon: Check,
        description: 'Lista de opções',
        defaultData: {
          hasImages: false,
          multiSelect: true,
          normalSelectionLimit: 3,
          options: [
            {
              id: 'opt1',
              text: 'Opção 1',
              value: 'option1',
              category: 'Categoria A',
            },
            {
              id: 'opt2',
              text: 'Opção 2',
              value: 'option2',
              category: 'Categoria B',
            },
            {
              id: 'opt3',
              text: 'Opção 3',
              value: 'option3',
              category: 'Categoria A',
            },
            {
              id: 'opt4',
              text: 'Opção 4',
              value: 'option4',
              category: 'Categoria C',
            },
          ],
        },
      },
    ],
  },
  sales: {
    title: '💰 VENDAS',
    color: 'orange',
    components: [
      {
        type: 'video',
        name: 'Vídeo',
        icon: Video,
        description: 'Player de vídeo',
      },
      {
        type: 'testimonial',
        name: 'Depoimento',
        icon: Star,
        description: 'Depoimento de cliente',
      },
      {
        type: 'price',
        name: 'Preço',
        icon: DollarSign,
        description: 'Exibição de preço',
      },
      {
        type: 'countdown',
        name: 'Countdown',
        icon: Timer,
        description: 'Timer de urgência',
        defaultData: {
          title: 'Oferta por tempo limitado',
          endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h from now
          style: {
            textAlign: 'center',
            color: '#DC2626',
          },
        },
      },
      {
        type: 'guarantee',
        name: 'Garantia',
        icon: Shield,
        description: 'Selo de garantia',
      },
      {
        type: 'bonus',
        name: 'Bônus',
        icon: Gift,
        description: 'Lista de bônus',
      },
      {
        type: 'faq',
        name: 'FAQ',
        icon: HelpCircle,
        description: 'Perguntas frequentes',
      },
      {
        type: 'social-proof',
        name: 'Prova Social',
        icon: Users,
        description: 'Contador de vendas',
      },
    ],
  },
};

export const ALL_COMPONENTS: ComponentType[] = Object.values(COMPONENT_CATEGORIES).flatMap(
  category => category.components
);
