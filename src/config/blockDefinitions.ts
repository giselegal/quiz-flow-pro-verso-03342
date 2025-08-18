// @ts-nocheck
import { BlockDefinition } from '@/types/editor';
import {
  AlignLeft,
  Heading,
  Image,
  Minus,
  Square,
  Type,
  HelpCircle,
  FileText,
  Tag,
  Layout,
  Gift,
  Shield,
} from 'lucide-react';

// Imports dos componentes funcionais
import HeadingInlineBlock from '@/components/editor/blocks/HeadingInlineBlock';
import TextInlineBlock from '@/components/editor/blocks/TextInlineBlock';
import SpacerInlineBlock from '@/components/editor/blocks/SpacerInlineBlock';
import QuizIntroHeaderBlock from '@/components/editor/blocks/QuizIntroHeaderBlock';
import QuizProgressBlock from '@/components/editor/blocks/QuizProgressBlock';
import QuizResultsEditor from '@/components/editor/blocks/QuizResultsEditor';
import StyleResultsEditor from '@/components/editor/blocks/StyleResultsEditor';
import FinalStepEditor from '@/components/editor/blocks/FinalStepEditor';
import FormInputBlock from '@/components/editor/blocks/FormInputBlock';
import BadgeInlineBlock from '@/components/editor/blocks/BadgeInlineBlock';
import DecorativeBarInlineBlock from '@/components/editor/blocks/DecorativeBarInlineBlock';
import LegalNoticeInlineBlock from '@/components/editor/blocks/LegalNoticeInlineBlock';

// Result Components (Step 20)
import {
  ResultHeaderInlineBlock,
  PersonalizedHookInlineBlock,
  StyleGuidesVisualInlineBlock,
  UrgencyCountdownInlineBlock,
  BeforeAfterTransformationInlineBlock,
  FinalValuePropositionInlineBlock,
  MotivationSectionInlineBlock,
  BonusSectionInlineBlock,
  TestimonialsInlineBlock,
  GuaranteeSectionInlineBlock,
  MentorSectionInlineBlock,
} from '@/components/editor/blocks/result';

export const blockDefinitions: BlockDefinition[] = [
  {
    type: 'heading',
    name: 'Título',
    description: 'Título principal com diferentes níveis (H1-H6)',
    category: 'text',
    icon: Heading,
    component: HeadingInlineBlock,
    properties: {
      content: {
        type: 'string',
        default: 'Título Principal',
        label: 'Conteúdo',
        description: 'Texto do título',
      },
      level: {
        type: 'select',
        default: 'h2',
        label: 'Nível do Título',
        options: [
          { value: 'h1', label: 'Título 1 (H1)' },
          { value: 'h2', label: 'Título 2 (H2)' },
          { value: 'h3', label: 'Título 3 (H3)' },
          { value: 'h4', label: 'Título 4 (H4)' },
          { value: 'h5', label: 'Título 5 (H5)' },
          { value: 'h6', label: 'Título 6 (H6)' },
        ],
      },
      textAlign: {
        type: 'select',
        default: 'left',
        label: 'Alinhamento',
        options: [
          { value: 'left', label: 'Esquerda' },
          { value: 'center', label: 'Centro' },
          { value: 'right', label: 'Direita' },
        ],
      },
    },
    label: 'Título',
    defaultProps: {
      content: 'Título Principal',
      level: 'h2',
      textAlign: 'left',
    },
  },
  {
    type: 'text-inline',
    name: 'Texto Inline',
    description: 'Componente de texto com propriedades editáveis completas',
    category: 'text',
    icon: AlignLeft,
    component: TextInlineBlock,
    properties: {
      content: {
        type: 'textarea',
        default: 'Digite seu texto aqui...',
        label: 'Conteúdo',
        description: 'Texto do componente (suporte HTML)',
      },
      text: {
        type: 'textarea',
        default: 'Digite seu texto aqui...',
        label: 'Texto Simples',
        description: 'Versão em texto puro',
      },
      fontSize: {
        type: 'select',
        default: 'text-base',
        label: 'Tamanho da Fonte',
        options: [
          { value: 'text-xs', label: 'Extra Pequeno' },
          { value: 'text-sm', label: 'Pequeno' },
          { value: 'text-base', label: 'Normal' },
          { value: 'text-lg', label: 'Grande' },
          { value: 'text-xl', label: 'Extra Grande' },
          { value: 'text-2xl', label: 'Muito Grande' },
        ],
      },
      alignment: {
        type: 'select',
        default: 'left',
        label: 'Alinhamento',
        options: [
          { value: 'left', label: 'Esquerda' },
          { value: 'center', label: 'Centro' },
          { value: 'right', label: 'Direita' },
        ],
      },
    },
    label: 'Texto',
    defaultProps: {
      text: 'Digite seu texto aqui...',
      fontSize: '1rem',
      alignment: 'left',
    },
  },
  {
    type: 'spacer',
    name: 'Espaçador',
    description: 'Espaço em branco vertical',
    category: 'layout',
    icon: Minus,
    component: SpacerInlineBlock,
    properties: {
      height: {
        type: 'number',
        default: 40,
        label: 'Altura (px)',
        description: 'Altura do espaçamento em pixels',
      },
    },
    label: 'Espaçador',
    defaultProps: {
      height: 40,
    },
  },
  {
    type: 'quiz-intro-header',
    name: 'Cabeçalho do Quiz',
    description: 'Cabeçalho introdutório para início do quiz',
    category: 'quiz',
    icon: HelpCircle,
    component: QuizIntroHeaderBlock,
    properties: {
      title: {
        type: 'string',
        default: 'Bem-vindo ao Quiz',
        label: 'Título',
        description: 'Título principal do quiz',
      },
      subtitle: {
        type: 'string',
        default: 'Descubra qual é o melhor para você',
        label: 'Subtítulo',
        description: 'Subtítulo explicativo',
      },
    },
    label: 'Cabeçalho Quiz',
    defaultProps: {
      title: 'Bem-vindo ao Quiz',
      subtitle: 'Descubra qual é o melhor para você',
    },
  },
  {
    type: 'quiz-progress',
    name: 'Progresso do Quiz',
    description: 'Barra de progresso para acompanhar etapas do quiz',
    category: 'quiz',
    icon: Layout,
    component: QuizProgressBlock,
    properties: {
      currentStep: {
        type: 'number',
        default: 1,
        label: 'Etapa Atual',
        description: 'Número da etapa atual',
      },
      totalSteps: {
        type: 'number',
        default: 21,
        label: 'Total de Etapas',
        description: 'Número total de etapas',
      },
    },
    label: 'Progresso Quiz',
    defaultProps: {
      currentStep: 1,
      totalSteps: 21,
    },
  },
  {
    type: 'form-input',
    name: 'Campo de Formulário',
    description: 'Input de formulário configurável',
    category: 'forms',
    icon: FileText,
    component: FormInputBlock,
    properties: {
      label: {
        type: 'string',
        default: 'Seu Campo',
        label: 'Label',
        description: 'Texto do label',
      },
      placeholder: {
        type: 'string',
        default: 'Digite aqui...',
        label: 'Placeholder',
        description: 'Texto de exemplo',
      },
      required: {
        type: 'boolean',
        default: false,
        label: 'Obrigatório',
        description: 'Campo obrigatório',
      },
    },
    label: 'Campo Formulário',
    defaultProps: {
      label: 'Seu Campo',
      placeholder: 'Digite aqui...',
      required: false,
    },
  },
  {
    type: 'badge',
    name: 'Badge',
    description: 'Badge/etiqueta colorida',
    category: 'misc',
    icon: Tag,
    component: BadgeInlineBlock,
    properties: {
      text: {
        type: 'string',
        default: 'Badge',
        label: 'Texto',
        description: 'Texto do badge',
      },
      variant: {
        type: 'select',
        default: 'default',
        label: 'Variante',
        options: [
          { value: 'default', label: 'Padrão' },
          { value: 'secondary', label: 'Secundário' },
          { value: 'success', label: 'Sucesso' },
          { value: 'warning', label: 'Aviso' },
          { value: 'danger', label: 'Perigo' },
        ],
      },
    },
    label: 'Badge',
    defaultProps: {
      text: 'Badge',
      variant: 'default',
    },
  },

  // ========== RESULT COMPONENTS (STEP 20) ==========
  {
    type: 'result-header-inline',
    name: 'Header de Resultado',
    description: 'Cabeçalho para página de resultados com logo e usuário',
    category: 'result',
    icon: Layout,
    component: ResultHeaderInlineBlock,
    properties: {
      logoUrl: {
        type: 'string',
        default:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        label: 'URL do Logo',
        description: 'URL da imagem do logo',
      },
      logoAlt: {
        type: 'string',
        default: 'Logo Gisele Galvão',
        label: 'Texto Alternativo do Logo',
      },
      logoHeight: {
        type: 'number',
        default: 40,
        label: 'Altura do Logo (px)',
      },
      userName: {
        type: 'string',
        default: '',
        label: 'Nome do Usuário',
      },
      showUserName: {
        type: 'boolean',
        default: true,
        label: 'Mostrar Nome do Usuário',
      },
      backgroundColor: {
        type: 'color',
        default: '#ffffff',
        label: 'Cor de Fundo',
      },
      containerWidth: {
        type: 'select',
        default: 'full',
        label: 'Largura do Container',
        options: [
          { value: 'small', label: 'Pequeno' },
          { value: 'medium', label: 'Médio' },
          { value: 'large', label: 'Grande' },
          { value: 'full', label: 'Completo' },
        ],
      },
    },
    label: 'Header Resultado',
    defaultProps: {
      logoUrl:
        'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
      logoAlt: 'Logo Gisele Galvão',
      showUserName: true,
      containerWidth: 'full',
    },
  },

  {
    type: 'personalized-hook-inline',
    name: 'Hook Personalizado',
    description: 'Seção de hook personalizado com CTA baseado no estilo',
    category: 'result',
    icon: Type,
    component: PersonalizedHookInlineBlock,
    properties: {
      styleCategory: {
        type: 'string',
        default: 'Elegante',
        label: 'Categoria do Estilo',
      },
      userName: {
        type: 'string',
        default: '',
        label: 'Nome do Usuário',
      },
      title: {
        type: 'string',
        default: 'Seu Estilo {styleCategory} foi Revelado!',
        label: 'Título',
      },
      subtitle: {
        type: 'textarea',
        default:
          'Agora que descobrimos sua essência estilística, é hora de transformar isso em looks poderosos que comunicam exatamente quem você é.',
        label: 'Subtítulo',
      },
      ctaText: {
        type: 'string',
        default: 'Quero Transformar Minha Imagem',
        label: 'Texto do CTA',
      },
      ctaUrl: {
        type: 'string',
        default: 'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912',
        label: 'URL do CTA',
      },
      showCTA: {
        type: 'boolean',
        default: true,
        label: 'Mostrar CTA',
      },
      accentColor: {
        type: 'color',
        default: '#B89B7A',
        label: 'Cor de Destaque',
      },
    },
    label: 'Hook Personalizado',
    defaultProps: {
      styleCategory: 'Elegante',
      showCTA: true,
      accentColor: '#B89B7A',
    },
  },

  {
    type: 'style-guides-visual-inline',
    name: 'Guias de Estilo Visual',
    description: 'Exibição visual dos guias de estilo com progresso',
    category: 'result',
    icon: Image,
    component: StyleGuidesVisualInlineBlock,
    properties: {
      primaryStyleCategory: {
        type: 'string',
        default: 'Elegante',
        label: 'Categoria do Estilo Principal',
      },
      primaryGuideImage: {
        type: 'string',
        default:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911668/GUIA_ELEGANTE_bcksfq.webp',
        label: 'Imagem do Guia Principal',
      },
      primaryStylePercentage: {
        type: 'number',
        default: 75,
        label: 'Porcentagem do Estilo Principal',
      },
      showProgress: {
        type: 'boolean',
        default: true,
        label: 'Mostrar Barra de Progresso',
      },
      showExclusiveBadge: {
        type: 'boolean',
        default: true,
        label: 'Mostrar Badge Exclusivo',
      },
      badgeText: {
        type: 'string',
        default: 'Exclusivo',
        label: 'Texto do Badge',
      },
      description: {
        type: 'textarea',
        default: 'Seu guia de estilo personalizado baseado nas suas respostas',
        label: 'Descrição',
      },
      borderColor: {
        type: 'color',
        default: '#B89B7A',
        label: 'Cor da Borda',
      },
    },
    label: 'Guias Visuais',
    defaultProps: {
      primaryStyleCategory: 'Elegante',
      showProgress: true,
      showExclusiveBadge: true,
    },
  },

  {
    type: 'urgency-countdown-inline',
    name: 'Countdown de Urgência',
    description: 'Timer de countdown para criar urgência',
    category: 'result',
    icon: Square,
    component: UrgencyCountdownInlineBlock,
    properties: {
      title: {
        type: 'string',
        default: '⏰ Oferta por Tempo Limitado!',
        label: 'Título',
      },
      subtitle: {
        type: 'string',
        default: 'Esta página expira em:',
        label: 'Subtítulo',
      },
      countdownMinutes: {
        type: 'number',
        default: 30,
        label: 'Minutos para Countdown',
      },
      urgencyMessage: {
        type: 'string',
        default: 'Não perca esta oportunidade única de transformar sua imagem',
        label: 'Mensagem de Urgência',
      },
      backgroundColor: {
        type: 'color',
        default: '#fff3cd',
        label: 'Cor de Fundo',
      },
      accentColor: {
        type: 'color',
        default: '#dc3545',
        label: 'Cor de Destaque',
      },
      animated: {
        type: 'boolean',
        default: true,
        label: 'Animação',
      },
    },
    label: 'Countdown Urgência',
    defaultProps: {
      countdownMinutes: 30,
      animated: true,
    },
  },

  {
    type: 'before-after-transformation-inline',
    name: 'Transformação Antes/Depois',
    description: 'Seção de transformações com imagens antes/depois',
    category: 'result',
    icon: Image,
    component: BeforeAfterTransformationInlineBlock,
    properties: {
      title: {
        type: 'string',
        default: 'Veja as Transformações Reais',
        label: 'Título',
      },
      subtitle: {
        type: 'textarea',
        default:
          'Mulheres que aplicaram seu guia de estilo e transformaram completamente sua imagem',
        label: 'Subtítulo',
      },
      showTestimonials: {
        type: 'boolean',
        default: true,
        label: 'Mostrar Depoimentos',
      },
      accentColor: {
        type: 'color',
        default: '#B89B7A',
        label: 'Cor de Destaque',
      },
    },
    label: 'Antes/Depois',
    defaultProps: {
      showTestimonials: true,
      accentColor: '#B89B7A',
    },
  },

  {
    type: 'final-value-proposition-inline',
    name: 'Proposta de Valor Final',
    description: 'Seção final com preços, benefícios e CTA forte',
    category: 'result',
    icon: Tag,
    component: FinalValuePropositionInlineBlock,
    properties: {
      title: {
        type: 'string',
        default: 'Vista-se de Você — na Prática',
        label: 'Título',
      },
      originalPrice: {
        type: 'number',
        default: 175,
        label: 'Preço Original',
      },
      currentPrice: {
        type: 'number',
        default: 39,
        label: 'Preço Atual',
      },
      discount: {
        type: 'number',
        default: 78,
        label: 'Desconto (%)',
      },
      installments: {
        type: 'string',
        default: '5x de R$ 8,83',
        label: 'Parcelamento',
      },
      ctaText: {
        type: 'string',
        default: 'GARANTIR MEU GUIA AGORA',
        label: 'Texto do CTA',
      },
      ctaUrl: {
        type: 'string',
        default: 'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912',
        label: 'URL do CTA',
      },
      urgencyMessage: {
        type: 'string',
        default: '⚡ Esta oferta expira ao sair desta página',
        label: 'Mensagem de Urgência',
      },
      accentColor: {
        type: 'color',
        default: '#458B74',
        label: 'Cor do CTA',
      },
      primaryColor: {
        type: 'color',
        default: '#B89B7A',
        label: 'Cor Primária',
      },
    },
    label: 'Proposta Final',
    defaultProps: {
      originalPrice: 175,
      currentPrice: 39,
      discount: 78,
    },
  },

  {
    type: 'motivation-section-inline',
    name: 'Seção Motivacional',
    description: 'Seção motivacional com benefícios e inspiração',
    category: 'result',
    icon: Type,
    component: MotivationSectionInlineBlock,
    properties: {
      title: {
        type: 'string',
        default: 'Transforme Sua Imagem, Revele Sua Essência',
        label: 'Título',
      },
      subtitle: {
        type: 'textarea',
        default:
          'Seu estilo é uma ferramenta poderosa. Não se trata apenas de roupas, mas de comunicar quem você é e aspira ser.',
        label: 'Subtítulo',
      },
      motivationText: {
        type: 'textarea',
        default:
          'Com a orientação certa, você pode transformar completamente a forma como o mundo te vê e, mais importante, como você se vê.',
        label: 'Texto Motivacional',
      },
      showMotivationText: {
        type: 'boolean',
        default: true,
        label: 'Mostrar Texto Motivacional',
      },
      showIcons: {
        type: 'boolean',
        default: true,
        label: 'Mostrar Ícones',
      },
      accentColor: {
        type: 'color',
        default: '#B89B7A',
        label: 'Cor de Destaque',
      },
    },
    label: 'Motivação',
    defaultProps: {
      showMotivationText: true,
      showIcons: true,
    },
  },

  {
    type: 'bonus-section-inline',
    name: 'Seção de Bônus',
    description: 'Seção de bônus exclusivos com valores',
    category: 'result',
    icon: Gift,
    component: BonusSectionInlineBlock,
    properties: {
      title: {
        type: 'string',
        default: 'Bônus Exclusivos para Você',
        label: 'Título',
      },
      subtitle: {
        type: 'textarea',
        default:
          'Além do guia principal, você receberá estas ferramentas complementares para potencializar sua jornada de transformação:',
        label: 'Subtítulo',
      },
      showValues: {
        type: 'boolean',
        default: true,
        label: 'Mostrar Valores',
      },
      showHighlights: {
        type: 'boolean',
        default: true,
        label: 'Mostrar Destaques',
      },
      accentColor: {
        type: 'color',
        default: '#B89B7A',
        label: 'Cor de Destaque',
      },
    },
    label: 'Bônus',
    defaultProps: {
      showValues: true,
      showHighlights: true,
    },
  },

  {
    type: 'testimonials-inline',
    name: 'Depoimentos',
    description: 'Seção de depoimentos de clientes',
    category: 'result',
    icon: HelpCircle,
    component: TestimonialsInlineBlock,
    properties: {
      title: {
        type: 'string',
        default: 'O Que Nossas Clientes Dizem',
        label: 'Título',
      },
      subtitle: {
        type: 'textarea',
        default: 'Depoimentos reais de mulheres que transformaram sua imagem e autoestima',
        label: 'Subtítulo',
      },
      showRatings: {
        type: 'boolean',
        default: true,
        label: 'Mostrar Avaliações',
      },
      showProfession: {
        type: 'boolean',
        default: true,
        label: 'Mostrar Profissão',
      },
      showBeforeAfter: {
        type: 'boolean',
        default: true,
        label: 'Mostrar Antes/Depois',
      },
      layout: {
        type: 'select',
        default: 'grid',
        label: 'Layout',
        options: [
          { value: 'grid', label: 'Grade' },
          { value: 'carousel', label: 'Carrossel' },
        ],
      },
      accentColor: {
        type: 'color',
        default: '#B89B7A',
        label: 'Cor de Destaque',
      },
    },
    label: 'Depoimentos',
    defaultProps: {
      showRatings: true,
      showProfession: true,
      layout: 'grid',
    },
  },

  {
    type: 'guarantee-section-inline',
    name: 'Seção de Garantia',
    description: 'Seção de garantia com elementos de confiança',
    category: 'result',
    icon: Shield,
    component: GuaranteeSectionInlineBlock,
    properties: {
      title: {
        type: 'string',
        default: '100% Garantido ou Seu Dinheiro de Volta',
        label: 'Título',
      },
      subtitle: {
        type: 'textarea',
        default:
          'Experimente nosso guia por 7 dias. Se não ficar completamente satisfeita, devolvemos seu investimento.',
        label: 'Subtítulo',
      },
      guaranteeDays: {
        type: 'number',
        default: 7,
        label: 'Dias de Garantia',
      },
      showSealImage: {
        type: 'boolean',
        default: true,
        label: 'Mostrar Selo de Garantia',
      },
      showTrustBadges: {
        type: 'boolean',
        default: true,
        label: 'Mostrar Badges de Confiança',
      },
      accentColor: {
        type: 'color',
        default: '#10b981',
        label: 'Cor de Destaque',
      },
    },
    label: 'Garantia',
    defaultProps: {
      guaranteeDays: 7,
      showSealImage: true,
      showTrustBadges: true,
    },
  },

  {
    type: 'mentor-section-inline',
    name: 'Seção do Mentor',
    description: 'Seção do mentor com credenciais e conquistas',
    category: 'result',
    icon: FileText,
    component: MentorSectionInlineBlock,
    properties: {
      mentorName: {
        type: 'string',
        default: 'Gisele Galvão',
        label: 'Nome do Mentor',
      },
      mentorTitle: {
        type: 'string',
        default: 'Consultora de Imagem & Personal Stylist',
        label: 'Título do Mentor',
      },
      mentorImage: {
        type: 'string',
        default:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/GISELE_MENTOR_FOTO_PROFISSIONAL_r14oz2.webp',
        label: 'Imagem do Mentor',
      },
      mentorDescription: {
        type: 'textarea',
        default:
          'Com mais de 10 anos de experiência em consultoria de imagem, Gisele já transformou a vida de mais de 2.000 mulheres, ajudando-as a descobrir seu estilo único e elevar sua autoestima.',
        label: 'Descrição do Mentor',
      },
      showCredentials: {
        type: 'boolean',
        default: true,
        label: 'Mostrar Credenciais',
      },
      showAchievements: {
        type: 'boolean',
        default: true,
        label: 'Mostrar Conquistas',
      },
      showTestimonial: {
        type: 'boolean',
        default: true,
        label: 'Mostrar Depoimento',
      },
      accentColor: {
        type: 'color',
        default: '#B89B7A',
        label: 'Cor de Destaque',
      },
    },
    label: 'Mentor',
    defaultProps: {
      mentorName: 'Gisele Galvão',
      showCredentials: true,
      showAchievements: true,
    },
  },
];

// ========== STATISTICS ==========
// Total Components: 23 (12 original + 11 result components)
// Categories: 7 (text, layout, quiz, forms, misc, result)
// Generated: 8/13/2025, 8:07:23 PM + Complete Result Components Added
// Status: Safe Production Version + Complete Step 20 Modular Components
