import { BlockDefinition } from '@/types/editor';
import { 
  AlignLeft, 
  BarChart,
  Clock,
  DollarSign,
  FileText,
  Grid,
  HelpCircle,
  Image,
  Layout,
  MessageCircle,
  MousePointer,
  Square,
  Target,
  Type,
  Users,
  Activity
} from 'lucide-react';

// ========== COMPONENT IMPORTS ==========
import AdvancedCTABlock from '@/components/editor/blocks/AdvancedCTABlock';
import AdvancedCTAInlineBlock from '@/components/editor/blocks/AdvancedCTAInlineBlock';
import AdvancedGalleryBlock from '@/components/editor/blocks/AdvancedGalleryBlock';
import AdvancedPricingTableBlock from '@/components/editor/blocks/AdvancedPricingTableBlock';
import AlertBlock from '@/components/editor/blocks/AlertBlock';
import AnimatedChartsBlock from '@/components/editor/blocks/AnimatedChartsBlock';
import AnimatedStatCounterBlock from '@/components/editor/blocks/AnimatedStatCounterBlock';
import ArgumentsBlock from '@/components/editor/blocks/ArgumentsBlock';
import AudioBlock from '@/components/editor/blocks/AudioBlock';
import AudioPlayerInlineBlock from '@/components/editor/blocks/AudioPlayerInlineBlock';
import BadgeInlineBlock from '@/components/editor/blocks/BadgeInlineBlock';
import BasicTextBlock from '@/components/editor/blocks/BasicTextBlock';
import BeforeAfterBlock from '@/components/editor/blocks/BeforeAfterBlock';
import BeforeAfterInlineBlock from '@/components/editor/blocks/BeforeAfterInlineBlock';
import BenefitsBlockEditor from '@/components/editor/blocks/BenefitsBlockEditor';
import BenefitsListBlock from '@/components/editor/blocks/BenefitsListBlock';
import BLOCK_CATEGORIES from '@/components/editor/blocks/BLOCK_CATEGORIES';
import BlockLoadingSkeleton from '@/components/editor/blocks/BlockLoadingSkeleton';
import BonusBlock from '@/components/editor/blocks/BonusBlock';
import BonusCarouselBlockEditor from '@/components/editor/blocks/BonusCarouselBlockEditor';
import BonusInlineBlock from '@/components/editor/blocks/BonusInlineBlock';
import ButtonBlock from '@/components/editor/blocks/ButtonBlock';
import ButtonInlineBlock from '@/components/editor/blocks/ButtonInlineBlock';
import ButtonInlineBlock from '@/components/editor/blocks/ButtonInlineBlock';
import CaktoQuizIntro from '@/components/editor/blocks/CaktoQuizIntro';
import CaktoQuizOffer from '@/components/editor/blocks/CaktoQuizOffer';
import CaktoQuizQuestion from '@/components/editor/blocks/CaktoQuizQuestion';
import CaktoQuizResult from '@/components/editor/blocks/CaktoQuizResult';
import CaktoQuizTransition from '@/components/editor/blocks/CaktoQuizTransition';
import CarouselBlock from '@/components/editor/blocks/CarouselBlock';
import ChartAreaBlock from '@/components/editor/blocks/ChartAreaBlock';
import ChartLevelBlock from '@/components/editor/blocks/ChartLevelBlock';
import CompareBlock from '@/components/editor/blocks/CompareBlock';
import ComparisonInlineBlock from '@/components/editor/blocks/ComparisonInlineBlock';
import ComparisonTableBlock from '@/components/editor/blocks/ComparisonTableBlock';
import ComparisonTableInlineBlock from '@/components/editor/blocks/ComparisonTableInlineBlock';
import ConfettiBlock from '@/components/editor/blocks/ConfettiBlock';
import CountdownTimerBlock from '@/components/editor/blocks/CountdownTimerBlock';
import CTABlockEditor from '@/components/editor/blocks/CTABlockEditor';
import CTAInlineBlock from '@/components/editor/blocks/CTAInlineBlock';
import CTASectionInlineBlock from '@/components/editor/blocks/CTASectionInlineBlock';
import DecorativeBarInlineBlock from '@/components/editor/blocks/DecorativeBarInlineBlock';
import DynamicPricingBlock from '@/components/editor/blocks/DynamicPricingBlock';
import EnhancedFallbackBlock from '@/components/editor/blocks/EnhancedFallbackBlock';
import ExampleInlineBlock from '@/components/editor/blocks/ExampleInlineBlock';
import FallbackBlock from '@/components/editor/blocks/FallbackBlock';
import FAQBlock from '@/components/editor/blocks/FAQBlock';
import FAQSectionBlock from '@/components/editor/blocks/FAQSectionBlock';
import FAQSectionInlineBlock from '@/components/editor/blocks/FAQSectionInlineBlock';
import FinalCTABlock from '@/components/editor/blocks/FinalCTABlock';
import FinalStepEditor from '@/components/editor/blocks/FinalStepEditor';
import FinalValuePropositionInlineBlock from '@/components/editor/blocks/FinalValuePropositionInlineBlock';
import FormContainerBlock from '@/components/editor/blocks/FormContainerBlock';
import FormInputBlock from '@/components/editor/blocks/FormInputBlock';
import GuaranteeBlock from '@/components/editor/blocks/GuaranteeBlock';
import GuaranteeBlockEditor from '@/components/editor/blocks/GuaranteeBlockEditor';
import GuaranteeInlineBlock from '@/components/editor/blocks/GuaranteeInlineBlock';
import HeaderBlock from '@/components/editor/blocks/HeaderBlock';
import HeaderBlockEditor from '@/components/editor/blocks/HeaderBlockEditor';
import HeadingInlineBlock from '@/components/editor/blocks/HeadingInlineBlock';
import HeadlineBlockEditor from '@/components/editor/blocks/HeadlineBlockEditor';
import HeroOfferBlock from '@/components/editor/blocks/HeroOfferBlock';
import HeroSectionBlockEditor from '@/components/editor/blocks/HeroSectionBlockEditor';
import ImageBlock from '@/components/editor/blocks/ImageBlock';
import ImageBlockEditor from '@/components/editor/blocks/ImageBlockEditor';
import ImageDisplayInline from '@/components/editor/blocks/ImageDisplayInline';
import ImageInlineBlock from '@/components/editor/blocks/ImageInlineBlock';
import InlineDemoLayoutBlock from '@/components/editor/blocks/InlineDemoLayoutBlock';
import InlineEditableText from '@/components/editor/blocks/InlineEditableText';
import InlineEditText from '@/components/editor/blocks/InlineEditText';
import InteractiveQuizBlock from '@/components/editor/blocks/InteractiveQuizBlock';
import InteractiveStatisticsBlock from '@/components/editor/blocks/InteractiveStatisticsBlock';
import LegalNoticeInlineBlock from '@/components/editor/blocks/LegalNoticeInlineBlock';
import ListBlock from '@/components/editor/blocks/ListBlock';
import LoaderBlock from '@/components/editor/blocks/LoaderBlock';
import LoaderInlineBlock from '@/components/editor/blocks/LoaderInlineBlock';
import MarqueeBlock from '@/components/editor/blocks/MarqueeBlock';
import MentorBlock from '@/components/editor/blocks/MentorBlock';
import MentorSectionInlineBlock from '@/components/editor/blocks/MentorSectionInlineBlock';
import ModernResultPageBlock from '@/components/editor/blocks/ModernResultPageBlock';
import ModernResultPageBlock from '@/components/editor/blocks/ModernResultPageBlock';
import NotificationInlineBlock from '@/components/editor/blocks/NotificationInlineBlock';
import OptionsGridBlock from '@/components/editor/blocks/OptionsGridBlock';
import PainPointsGridBlock from '@/components/editor/blocks/PainPointsGridBlock';
import PriceComparisonBlock from '@/components/editor/blocks/PriceComparisonBlock';
import PricingBlockEditor from '@/components/editor/blocks/PricingBlockEditor';
import PricingInlineBlock from '@/components/editor/blocks/PricingInlineBlock';
import PricingSectionBlock from '@/components/editor/blocks/PricingSectionBlock';
import ProductCarouselBlock from '@/components/editor/blocks/ProductCarouselBlock';
import ProductFeaturesGridBlock from '@/components/editor/blocks/ProductFeaturesGridBlock';
import ProductOfferBlock from '@/components/editor/blocks/ProductOfferBlock';
import ProgressBarStepBlock from '@/components/editor/blocks/ProgressBarStepBlock';
import ProgressInlineBlock from '@/components/editor/blocks/ProgressInlineBlock';
import ProsConsBlock from '@/components/editor/blocks/ProsConsBlock';
import QuizContentIntegration from '@/components/editor/blocks/QuizContentIntegration';
import QuizFunnelStep1Block from '@/components/editor/blocks/QuizFunnelStep1Block';
import QuizHeaderBlock from '@/components/editor/blocks/QuizHeaderBlock';
import QuizIntroHeaderBlock from '@/components/editor/blocks/QuizIntroHeaderBlock';
import QuizNavigationIntegration from '@/components/editor/blocks/QuizNavigationIntegration';
import QuizOfferCountdownBlock from '@/components/editor/blocks/QuizOfferCountdownBlock';
import QuizOfferFAQBlock from '@/components/editor/blocks/QuizOfferFAQBlock';
import QuizOfferFinalCTABlock from '@/components/editor/blocks/QuizOfferFinalCTABlock';
import QuizOfferHeroBlock from '@/components/editor/blocks/QuizOfferHeroBlock';
import QuizOfferPricingBlock from '@/components/editor/blocks/QuizOfferPricingBlock';
import QuizOfferTestimonialsBlock from '@/components/editor/blocks/QuizOfferTestimonialsBlock';
import QuizOptionBlock from '@/components/editor/blocks/QuizOptionBlock';
import QuizProgressBlock from '@/components/editor/blocks/QuizProgressBlock';
import QuizQuestionBlock from '@/components/editor/blocks/QuizQuestionBlock';
import QuizQuestionBlockConfigurable from '@/components/editor/blocks/QuizQuestionBlockConfigurable';
import QuizResultCalculatedBlock from '@/components/editor/blocks/QuizResultCalculatedBlock';
import QuizResultHeaderBlock from '@/components/editor/blocks/QuizResultHeaderBlock';
import QuizResultMainCardBlock from '@/components/editor/blocks/QuizResultMainCardBlock';
import QuizResultSecondaryStylesBlock from '@/components/editor/blocks/QuizResultSecondaryStylesBlock';
import QuizResultsEditor from '@/components/editor/blocks/QuizResultsEditor';
import QuizStartPageBlock from '@/components/editor/blocks/QuizStartPageBlock';
import QuizStepBlock from '@/components/editor/blocks/QuizStepBlock';
import QuizTitleBlock from '@/components/editor/blocks/QuizTitleBlock';
import QuizTransitionBlock from '@/components/editor/blocks/QuizTransitionBlock';
import QuizTransitionBlock from '@/components/editor/blocks/QuizTransitionBlock';
import QuoteBlock from '@/components/editor/blocks/QuoteBlock';
import ResultDescriptionBlock from '@/components/editor/blocks/ResultDescriptionBlock';
import ResultHeaderBlock from '@/components/editor/blocks/ResultHeaderBlock';
import ResultHeaderInlineBlock from '@/components/editor/blocks/ResultHeaderInlineBlock';
import ResultPageHeaderBlock from '@/components/editor/blocks/ResultPageHeaderBlock';
import RichTextBlock from '@/components/editor/blocks/RichTextBlock';
import ScriptBlock from '@/components/editor/blocks/ScriptBlock';
import SecondaryStylesBlockEditor from '@/components/editor/blocks/SecondaryStylesBlockEditor';
import SectionDividerBlock from '@/components/editor/blocks/SectionDividerBlock';
import SecurePurchaseBlock from '@/components/editor/blocks/SecurePurchaseBlock';
import SocialProofBlock from '@/components/editor/blocks/SocialProofBlock';
import SpacerBlock from '@/components/editor/blocks/SpacerBlock';
import SpacerInlineBlock from '@/components/editor/blocks/SpacerInlineBlock';
import StatInlineBlock from '@/components/editor/blocks/StatInlineBlock';
import StatsMetricsBlock from '@/components/editor/blocks/StatsMetricsBlock';
import StrategicQuestionBlock from '@/components/editor/blocks/StrategicQuestionBlock';
import StyleCardBlock from '@/components/editor/blocks/StyleCardBlock';
import StyleCardInlineBlock from '@/components/editor/blocks/StyleCardInlineBlock';
import StyleCharacteristicsBlock from '@/components/editor/blocks/StyleCharacteristicsBlock';
import StyleResultsEditor from '@/components/editor/blocks/StyleResultsEditor';
import TermsBlock from '@/components/editor/blocks/TermsBlock';
import TestimonialInlineBlock from '@/components/editor/blocks/TestimonialInlineBlock';
import TestimonialsBlock from '@/components/editor/blocks/TestimonialsBlock';
import TestimonialsCarouselBlock from '@/components/editor/blocks/TestimonialsCarouselBlock';
import TestimonialsGridBlock from '@/components/editor/blocks/TestimonialsGridBlock';
import TestimonialsRealBlock from '@/components/editor/blocks/TestimonialsRealBlock';
import TestimonialsRealInlineBlock from '@/components/editor/blocks/TestimonialsRealInlineBlock';
import TEXT_SIZES from '@/components/editor/blocks/TEXT_SIZES';
import TEXT_SIZES from '@/components/editor/blocks/TEXT_SIZES';
import TextBlock from '@/components/editor/blocks/TextBlock';
import TextBlockEditor from '@/components/editor/blocks/TextBlockEditor';
import TransformationInlineBlock from '@/components/editor/blocks/TransformationInlineBlock';
import UnifiedFunnelBlock from '@/components/editor/blocks/UnifiedFunnelBlock';
import UnifiedFunnelPainBlock from '@/components/editor/blocks/UnifiedFunnelPainBlock';
import UniversalBlockRenderer from '@/components/editor/blocks/UniversalBlockRenderer';
import UrgencyTimerBlock from '@/components/editor/blocks/UrgencyTimerBlock';
import UrgencyTimerInlineBlock from '@/components/editor/blocks/UrgencyTimerInlineBlock';
import ValueAnchoringBlock from '@/components/editor/blocks/ValueAnchoringBlock';
import ValueStackBlock from '@/components/editor/blocks/ValueStackBlock';
import ValueStackInlineBlock from '@/components/editor/blocks/ValueStackInlineBlock';
import VerticalCanvasHeaderBlock from '@/components/editor/blocks/VerticalCanvasHeaderBlock';
import VideoBlock from '@/components/editor/blocks/VideoBlock';
import VideoPlayerBlock from '@/components/editor/blocks/VideoPlayerBlock';
import VideoPlayerInlineBlock from '@/components/editor/blocks/VideoPlayerInlineBlock';

// ========== BLOCK DEFINITIONS ==========
export const blockDefinitions: BlockDefinition[] = [
  // ========== ACTION COMPONENTS ==========
  {
    type: 'advanced-c-t-a-',
    name: 'Advanced C T A',
    description: 'Componente Advanced C T A para chamadas para ação',
    category: 'action',
    icon: MousePointer,
    component: AdvancedCTABlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'advancedctablock-1755114765372',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'text': {
            'type': 'string',
            'default': 'Clique aqui',
            'label': 'Texto do Botão',
            'description': 'Texto exibido no botão'
      },
      'url': {
            'type': 'string',
            'default': '#',
            'label': 'URL',
            'description': 'Link de destino'
      },
      'style': {
            'type': 'select',
            'default': 'primary',
            'label': 'Estilo',
            'options': [
                  {
                        'value': 'primary',
                        'label': 'Primário'
                  },
                  {
                        'value': 'secondary',
                        'label': 'Secundário'
                  },
                  {
                        'value': 'outline',
                        'label': 'Contorno'
                  }
            ]
      }
},
    label: 'Advanced C T A',
    defaultProps: {
      'id': 'advancedctablock-1755114765372',
      'text': 'Clique aqui',
      'url': '#',
      'style': 'primary'
},
  },

  {
    type: 'advanced-c-t-a-inline-',
    name: 'Advanced C T A',
    description: 'Componente Advanced C T A para chamadas para ação',
    category: 'action',
    icon: MousePointer,
    component: AdvancedCTAInlineBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'advancedctainlineblock-1755114765372',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'text': {
            'type': 'string',
            'default': 'Clique aqui',
            'label': 'Texto do Botão',
            'description': 'Texto exibido no botão'
      },
      'url': {
            'type': 'string',
            'default': '#',
            'label': 'URL',
            'description': 'Link de destino'
      },
      'style': {
            'type': 'select',
            'default': 'primary',
            'label': 'Estilo',
            'options': [
                  {
                        'value': 'primary',
                        'label': 'Primário'
                  },
                  {
                        'value': 'secondary',
                        'label': 'Secundário'
                  },
                  {
                        'value': 'outline',
                        'label': 'Contorno'
                  }
            ]
      }
},
    label: 'Advanced C T A',
    defaultProps: {
      'id': 'advancedctainlineblock-1755114765372',
      'text': 'Clique aqui',
      'url': '#',
      'style': 'primary'
},
  },

  {
    type: 'button-',
    name: 'Button',
    description: 'Componente Button para chamadas para ação',
    category: 'action',
    icon: MousePointer,
    component: ButtonBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'buttonblock-1755114765372',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'text': {
            'type': 'string',
            'default': 'Clique aqui',
            'label': 'Texto do Botão',
            'description': 'Texto exibido no botão'
      },
      'url': {
            'type': 'string',
            'default': '#',
            'label': 'URL',
            'description': 'Link de destino'
      },
      'style': {
            'type': 'select',
            'default': 'primary',
            'label': 'Estilo',
            'options': [
                  {
                        'value': 'primary',
                        'label': 'Primário'
                  },
                  {
                        'value': 'secondary',
                        'label': 'Secundário'
                  },
                  {
                        'value': 'outline',
                        'label': 'Contorno'
                  }
            ]
      }
},
    label: 'Button',
    defaultProps: {
      'id': 'buttonblock-1755114765372',
      'text': 'Clique aqui',
      'url': '#',
      'style': 'primary'
},
  },

  {
    type: 'button-inline-',
    name: 'Button',
    description: 'Componente Button para chamadas para ação',
    category: 'action',
    icon: MousePointer,
    component: ButtonInlineBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'buttoninlineblock-1755114765372',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'text': {
            'type': 'string',
            'default': 'Clique aqui',
            'label': 'Texto do Botão',
            'description': 'Texto exibido no botão'
      },
      'url': {
            'type': 'string',
            'default': '#',
            'label': 'URL',
            'description': 'Link de destino'
      },
      'style': {
            'type': 'select',
            'default': 'primary',
            'label': 'Estilo',
            'options': [
                  {
                        'value': 'primary',
                        'label': 'Primário'
                  },
                  {
                        'value': 'secondary',
                        'label': 'Secundário'
                  },
                  {
                        'value': 'outline',
                        'label': 'Contorno'
                  }
            ]
      }
},
    label: 'Button',
    defaultProps: {
      'id': 'buttoninlineblock-1755114765372',
      'text': 'Clique aqui',
      'url': '#',
      'style': 'primary'
},
  },

  {
    type: 'button-inline-',
    name: 'Button',
    description: 'Componente Button para chamadas para ação',
    category: 'action',
    icon: MousePointer,
    component: ButtonInlineBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'buttoninlineblock-1755114765372',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'text': {
            'type': 'string',
            'default': 'Clique aqui',
            'label': 'Texto do Botão',
            'description': 'Texto exibido no botão'
      },
      'url': {
            'type': 'string',
            'default': '#',
            'label': 'URL',
            'description': 'Link de destino'
      },
      'style': {
            'type': 'select',
            'default': 'primary',
            'label': 'Estilo',
            'options': [
                  {
                        'value': 'primary',
                        'label': 'Primário'
                  },
                  {
                        'value': 'secondary',
                        'label': 'Secundário'
                  },
                  {
                        'value': 'outline',
                        'label': 'Contorno'
                  }
            ]
      }
},
    label: 'Button',
    defaultProps: {
      'id': 'buttoninlineblock-1755114765372',
      'text': 'Clique aqui',
      'url': '#',
      'style': 'primary'
},
  },

  {
    type: 'c-t-a-block-',
    name: 'C T A',
    description: 'Componente C T A para chamadas para ação',
    category: 'action',
    icon: MousePointer,
    component: CTABlockEditor,
    properties: {
      'id': {
            'type': 'string',
            'default': 'ctablockeditor-1755114765373',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'text': {
            'type': 'string',
            'default': 'Clique aqui',
            'label': 'Texto do Botão',
            'description': 'Texto exibido no botão'
      },
      'url': {
            'type': 'string',
            'default': '#',
            'label': 'URL',
            'description': 'Link de destino'
      },
      'style': {
            'type': 'select',
            'default': 'primary',
            'label': 'Estilo',
            'options': [
                  {
                        'value': 'primary',
                        'label': 'Primário'
                  },
                  {
                        'value': 'secondary',
                        'label': 'Secundário'
                  },
                  {
                        'value': 'outline',
                        'label': 'Contorno'
                  }
            ]
      }
},
    label: 'C T A',
    defaultProps: {
      'id': 'ctablockeditor-1755114765373',
      'text': 'Clique aqui',
      'url': '#',
      'style': 'primary'
},
  },

  {
    type: 'c-t-a-inline-',
    name: 'C T A',
    description: 'Componente C T A para chamadas para ação',
    category: 'action',
    icon: MousePointer,
    component: CTAInlineBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'ctainlineblock-1755114765373',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'text': {
            'type': 'string',
            'default': 'Clique aqui',
            'label': 'Texto do Botão',
            'description': 'Texto exibido no botão'
      },
      'url': {
            'type': 'string',
            'default': '#',
            'label': 'URL',
            'description': 'Link de destino'
      },
      'style': {
            'type': 'select',
            'default': 'primary',
            'label': 'Estilo',
            'options': [
                  {
                        'value': 'primary',
                        'label': 'Primário'
                  },
                  {
                        'value': 'secondary',
                        'label': 'Secundário'
                  },
                  {
                        'value': 'outline',
                        'label': 'Contorno'
                  }
            ]
      }
},
    label: 'C T A',
    defaultProps: {
      'id': 'ctainlineblock-1755114765373',
      'text': 'Clique aqui',
      'url': '#',
      'style': 'primary'
},
  },

  {
    type: 'c-t-a-section-inline-',
    name: 'C T A Section',
    description: 'Componente C T A Section para chamadas para ação',
    category: 'action',
    icon: MousePointer,
    component: CTASectionInlineBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'ctasectioninlineblock-1755114765373',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'text': {
            'type': 'string',
            'default': 'Clique aqui',
            'label': 'Texto do Botão',
            'description': 'Texto exibido no botão'
      },
      'url': {
            'type': 'string',
            'default': '#',
            'label': 'URL',
            'description': 'Link de destino'
      },
      'style': {
            'type': 'select',
            'default': 'primary',
            'label': 'Estilo',
            'options': [
                  {
                        'value': 'primary',
                        'label': 'Primário'
                  },
                  {
                        'value': 'secondary',
                        'label': 'Secundário'
                  },
                  {
                        'value': 'outline',
                        'label': 'Contorno'
                  }
            ]
      }
},
    label: 'C T A Section',
    defaultProps: {
      'id': 'ctasectioninlineblock-1755114765373',
      'text': 'Clique aqui',
      'url': '#',
      'style': 'primary'
},
  },

  {
    type: 'final-c-t-a-',
    name: 'Final C T A',
    description: 'Componente Final C T A para chamadas para ação',
    category: 'action',
    icon: MousePointer,
    component: FinalCTABlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'finalctablock-1755114765373',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'text': {
            'type': 'string',
            'default': 'Clique aqui',
            'label': 'Texto do Botão',
            'description': 'Texto exibido no botão'
      },
      'url': {
            'type': 'string',
            'default': '#',
            'label': 'URL',
            'description': 'Link de destino'
      },
      'style': {
            'type': 'select',
            'default': 'primary',
            'label': 'Estilo',
            'options': [
                  {
                        'value': 'primary',
                        'label': 'Primário'
                  },
                  {
                        'value': 'secondary',
                        'label': 'Secundário'
                  },
                  {
                        'value': 'outline',
                        'label': 'Contorno'
                  }
            ]
      }
},
    label: 'Final C T A',
    defaultProps: {
      'id': 'finalctablock-1755114765373',
      'text': 'Clique aqui',
      'url': '#',
      'style': 'primary'
},
  },

  // ========== GALLERY COMPONENTS ==========
  {
    type: 'advanced-gallery-',
    name: 'Advanced Gallery',
    description: 'Componente Advanced Gallery para galerias de imagem',
    category: 'gallery',
    icon: Grid,
    component: AdvancedGalleryBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'advancedgalleryblock-1755114765373',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Advanced Gallery',
    defaultProps: {
      'id': 'advancedgalleryblock-1755114765373',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'bonus-carousel-block-',
    name: 'Bonus Carousel',
    description: 'Componente Bonus Carousel para galerias de imagem',
    category: 'gallery',
    icon: Grid,
    component: BonusCarouselBlockEditor,
    properties: {
      'id': {
            'type': 'string',
            'default': 'bonuscarouselblockeditor-1755114765373',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Bonus Carousel',
    defaultProps: {
      'id': 'bonuscarouselblockeditor-1755114765373',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'carousel-',
    name: 'Carousel',
    description: 'Componente Carousel para galerias de imagem',
    category: 'gallery',
    icon: Grid,
    component: CarouselBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'carouselblock-1755114765373',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Carousel',
    defaultProps: {
      'id': 'carouselblock-1755114765373',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'product-carousel-',
    name: 'Product Carousel',
    description: 'Componente Product Carousel para galerias de imagem',
    category: 'gallery',
    icon: Grid,
    component: ProductCarouselBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'productcarouselblock-1755114765373',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Product Carousel',
    defaultProps: {
      'id': 'productcarouselblock-1755114765373',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  // ========== PRICING COMPONENTS ==========
  {
    type: 'advanced-pricing-table-',
    name: 'Advanced Pricing Table',
    description: 'Componente Advanced Pricing Table para tabelas de preços',
    category: 'pricing',
    icon: DollarSign,
    component: AdvancedPricingTableBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'advancedpricingtableblock-1755114765373',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Advanced Pricing Table',
    defaultProps: {
      'id': 'advancedpricingtableblock-1755114765373',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'dynamic-pricing-',
    name: 'Dynamic Pricing',
    description: 'Componente Dynamic Pricing para tabelas de preços',
    category: 'pricing',
    icon: DollarSign,
    component: DynamicPricingBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'dynamicpricingblock-1755114765373',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Dynamic Pricing',
    defaultProps: {
      'id': 'dynamicpricingblock-1755114765373',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'price-comparison-',
    name: 'Price Comparison',
    description: 'Componente Price Comparison para tabelas de preços',
    category: 'pricing',
    icon: DollarSign,
    component: PriceComparisonBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'pricecomparisonblock-1755114765373',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Price Comparison',
    defaultProps: {
      'id': 'pricecomparisonblock-1755114765373',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'pricing-block-',
    name: 'Pricing',
    description: 'Componente Pricing para tabelas de preços',
    category: 'pricing',
    icon: DollarSign,
    component: PricingBlockEditor,
    properties: {
      'id': {
            'type': 'string',
            'default': 'pricingblockeditor-1755114765373',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Pricing',
    defaultProps: {
      'id': 'pricingblockeditor-1755114765373',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'pricing-inline-',
    name: 'Pricing',
    description: 'Componente Pricing para tabelas de preços',
    category: 'pricing',
    icon: DollarSign,
    component: PricingInlineBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'pricinginlineblock-1755114765373',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Pricing',
    defaultProps: {
      'id': 'pricinginlineblock-1755114765373',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'pricing-section-',
    name: 'Pricing Section',
    description: 'Componente Pricing Section para tabelas de preços',
    category: 'pricing',
    icon: DollarSign,
    component: PricingSectionBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'pricingsectionblock-1755114765373',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Pricing Section',
    defaultProps: {
      'id': 'pricingsectionblock-1755114765373',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  // ========== MISC COMPONENTS ==========
  {
    type: 'alert-',
    name: 'Alert',
    description: 'Componente Alert de uso geral',
    category: 'misc',
    icon: Square,
    component: AlertBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'alertblock-1755114765373',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Alert',
    defaultProps: {
      'id': 'alertblock-1755114765373',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'animated-stat-counter-',
    name: 'Animated Stat Counter',
    description: 'Componente Animated Stat Counter de uso geral',
    category: 'misc',
    icon: Square,
    component: AnimatedStatCounterBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'animatedstatcounterblock-1755114765373',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Animated Stat Counter',
    defaultProps: {
      'id': 'animatedstatcounterblock-1755114765373',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'arguments-',
    name: 'Arguments',
    description: 'Componente Arguments de uso geral',
    category: 'misc',
    icon: Square,
    component: ArgumentsBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'argumentsblock-1755114765373',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Arguments',
    defaultProps: {
      'id': 'argumentsblock-1755114765373',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'audio-',
    name: 'Audio',
    description: 'Componente Audio de uso geral',
    category: 'misc',
    icon: Square,
    component: AudioBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'audioblock-1755114765373',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Audio',
    defaultProps: {
      'id': 'audioblock-1755114765373',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'audio-player-inline-',
    name: 'Audio Player',
    description: 'Componente Audio Player de uso geral',
    category: 'misc',
    icon: Square,
    component: AudioPlayerInlineBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'audioplayerinlineblock-1755114765373',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Audio Player',
    defaultProps: {
      'id': 'audioplayerinlineblock-1755114765373',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'badge-inline-',
    name: 'Badge',
    description: 'Componente Badge de uso geral',
    category: 'misc',
    icon: Square,
    component: BadgeInlineBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'badgeinlineblock-1755114765373',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Badge',
    defaultProps: {
      'id': 'badgeinlineblock-1755114765373',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'before-after-',
    name: 'Before After',
    description: 'Componente Before After de uso geral',
    category: 'misc',
    icon: Square,
    component: BeforeAfterBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'beforeafterblock-1755114765373',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Before After',
    defaultProps: {
      'id': 'beforeafterblock-1755114765373',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'before-after-inline-',
    name: 'Before After',
    description: 'Componente Before After de uso geral',
    category: 'misc',
    icon: Square,
    component: BeforeAfterInlineBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'beforeafterinlineblock-1755114765373',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Before After',
    defaultProps: {
      'id': 'beforeafterinlineblock-1755114765373',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'benefits-block-',
    name: 'Benefits',
    description: 'Componente Benefits de uso geral',
    category: 'misc',
    icon: Square,
    component: BenefitsBlockEditor,
    properties: {
      'id': {
            'type': 'string',
            'default': 'benefitsblockeditor-1755114765373',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Benefits',
    defaultProps: {
      'id': 'benefitsblockeditor-1755114765373',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'benefits-list-',
    name: 'Benefits List',
    description: 'Componente Benefits List de uso geral',
    category: 'misc',
    icon: Square,
    component: BenefitsListBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'benefitslistblock-1755114765373',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Benefits List',
    defaultProps: {
      'id': 'benefitslistblock-1755114765373',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'b-l-o-c-k_-c-a-t-e-g-o-r-i-e-s',
    name: 'B L O C K_ C A T E G O R I E S',
    description: 'Componente B L O C K_ C A T E G O R I E S de uso geral',
    category: 'misc',
    icon: Square,
    component: BLOCK_CATEGORIES,
    properties: {
      'id': {
            'type': 'string',
            'default': 'block_categories-1755114765374',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'B L O C K_ C A T E G O R I E S',
    defaultProps: {
      'id': 'block_categories-1755114765374',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'block-loading-skeleton',
    name: 'Loading Skeleton',
    description: 'Componente Loading Skeleton de uso geral',
    category: 'misc',
    icon: Square,
    component: BlockLoadingSkeleton,
    properties: {
      'id': {
            'type': 'string',
            'default': 'blockloadingskeleton-1755114765374',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Loading Skeleton',
    defaultProps: {
      'id': 'blockloadingskeleton-1755114765374',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'bonus-',
    name: 'Bonus',
    description: 'Componente Bonus de uso geral',
    category: 'misc',
    icon: Square,
    component: BonusBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'bonusblock-1755114765374',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Bonus',
    defaultProps: {
      'id': 'bonusblock-1755114765374',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'bonus-inline-',
    name: 'Bonus',
    description: 'Componente Bonus de uso geral',
    category: 'misc',
    icon: Square,
    component: BonusInlineBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'bonusinlineblock-1755114765374',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Bonus',
    defaultProps: {
      'id': 'bonusinlineblock-1755114765374',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'compare-',
    name: 'Compare',
    description: 'Componente Compare de uso geral',
    category: 'misc',
    icon: Square,
    component: CompareBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'compareblock-1755114765374',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Compare',
    defaultProps: {
      'id': 'compareblock-1755114765374',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'comparison-inline-',
    name: 'Comparison',
    description: 'Componente Comparison de uso geral',
    category: 'misc',
    icon: Square,
    component: ComparisonInlineBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'comparisoninlineblock-1755114765374',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Comparison',
    defaultProps: {
      'id': 'comparisoninlineblock-1755114765374',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'comparison-table-',
    name: 'Comparison Table',
    description: 'Componente Comparison Table de uso geral',
    category: 'misc',
    icon: Square,
    component: ComparisonTableBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'comparisontableblock-1755114765374',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Comparison Table',
    defaultProps: {
      'id': 'comparisontableblock-1755114765374',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'comparison-table-inline-',
    name: 'Comparison Table',
    description: 'Componente Comparison Table de uso geral',
    category: 'misc',
    icon: Square,
    component: ComparisonTableInlineBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'comparisontableinlineblock-1755114765374',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Comparison Table',
    defaultProps: {
      'id': 'comparisontableinlineblock-1755114765374',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'confetti-',
    name: 'Confetti',
    description: 'Componente Confetti de uso geral',
    category: 'misc',
    icon: Square,
    component: ConfettiBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'confettiblock-1755114765374',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Confetti',
    defaultProps: {
      'id': 'confettiblock-1755114765374',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'decorative-bar-inline-',
    name: 'Decorative Bar',
    description: 'Componente Decorative Bar de uso geral',
    category: 'misc',
    icon: Square,
    component: DecorativeBarInlineBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'decorativebarinlineblock-1755114765374',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Decorative Bar',
    defaultProps: {
      'id': 'decorativebarinlineblock-1755114765374',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'enhanced-fallback-',
    name: 'Enhanced Fallback',
    description: 'Componente Enhanced Fallback de uso geral',
    category: 'misc',
    icon: Square,
    component: EnhancedFallbackBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'enhancedfallbackblock-1755114765374',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Enhanced Fallback',
    defaultProps: {
      'id': 'enhancedfallbackblock-1755114765374',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'example-inline-',
    name: 'Example',
    description: 'Componente Example de uso geral',
    category: 'misc',
    icon: Square,
    component: ExampleInlineBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'exampleinlineblock-1755114765374',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Example',
    defaultProps: {
      'id': 'exampleinlineblock-1755114765374',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'fallback-',
    name: 'Fallback',
    description: 'Componente Fallback de uso geral',
    category: 'misc',
    icon: Square,
    component: FallbackBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'fallbackblock-1755114765374',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Fallback',
    defaultProps: {
      'id': 'fallbackblock-1755114765374',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'final-step-',
    name: 'Final Step',
    description: 'Componente Final Step de uso geral',
    category: 'misc',
    icon: Square,
    component: FinalStepEditor,
    properties: {
      'id': {
            'type': 'string',
            'default': 'finalstepeditor-1755114765374',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Final Step',
    defaultProps: {
      'id': 'finalstepeditor-1755114765374',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'final-value-proposition-inline-',
    name: 'Final Value Proposition',
    description: 'Componente Final Value Proposition de uso geral',
    category: 'misc',
    icon: Square,
    component: FinalValuePropositionInlineBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'finalvaluepropositioninlineblock-1755114765374',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Final Value Proposition',
    defaultProps: {
      'id': 'finalvaluepropositioninlineblock-1755114765374',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'guarantee-',
    name: 'Guarantee',
    description: 'Componente Guarantee de uso geral',
    category: 'misc',
    icon: Square,
    component: GuaranteeBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'guaranteeblock-1755114765374',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Guarantee',
    defaultProps: {
      'id': 'guaranteeblock-1755114765374',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'guarantee-block-',
    name: 'Guarantee',
    description: 'Componente Guarantee de uso geral',
    category: 'misc',
    icon: Square,
    component: GuaranteeBlockEditor,
    properties: {
      'id': {
            'type': 'string',
            'default': 'guaranteeblockeditor-1755114765374',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Guarantee',
    defaultProps: {
      'id': 'guaranteeblockeditor-1755114765374',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'guarantee-inline-',
    name: 'Guarantee',
    description: 'Componente Guarantee de uso geral',
    category: 'misc',
    icon: Square,
    component: GuaranteeInlineBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'guaranteeinlineblock-1755114765374',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Guarantee',
    defaultProps: {
      'id': 'guaranteeinlineblock-1755114765374',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'header-',
    name: 'Header',
    description: 'Componente Header de uso geral',
    category: 'misc',
    icon: Square,
    component: HeaderBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'headerblock-1755114765374',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Header',
    defaultProps: {
      'id': 'headerblock-1755114765374',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'header-block-',
    name: 'Header',
    description: 'Componente Header de uso geral',
    category: 'misc',
    icon: Square,
    component: HeaderBlockEditor,
    properties: {
      'id': {
            'type': 'string',
            'default': 'headerblockeditor-1755114765374',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Header',
    defaultProps: {
      'id': 'headerblockeditor-1755114765374',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'headline-block-',
    name: 'Headline',
    description: 'Componente Headline de uso geral',
    category: 'misc',
    icon: Square,
    component: HeadlineBlockEditor,
    properties: {
      'id': {
            'type': 'string',
            'default': 'headlineblockeditor-1755114765374',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Headline',
    defaultProps: {
      'id': 'headlineblockeditor-1755114765374',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'inline-demo-layout-',
    name: 'Demo Layout',
    description: 'Componente Demo Layout de uso geral',
    category: 'misc',
    icon: Square,
    component: InlineDemoLayoutBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'inlinedemolayoutblock-1755114765374',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Demo Layout',
    defaultProps: {
      'id': 'inlinedemolayoutblock-1755114765374',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'interactive-statistics-',
    name: 'Interactive Statistics',
    description: 'Componente Interactive Statistics de uso geral',
    category: 'misc',
    icon: Square,
    component: InteractiveStatisticsBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'interactivestatisticsblock-1755114765374',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Interactive Statistics',
    defaultProps: {
      'id': 'interactivestatisticsblock-1755114765374',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'legal-notice-inline-',
    name: 'Legal Notice',
    description: 'Componente Legal Notice de uso geral',
    category: 'misc',
    icon: Square,
    component: LegalNoticeInlineBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'legalnoticeinlineblock-1755114765374',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Legal Notice',
    defaultProps: {
      'id': 'legalnoticeinlineblock-1755114765374',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'list-',
    name: 'List',
    description: 'Componente List de uso geral',
    category: 'misc',
    icon: Square,
    component: ListBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'listblock-1755114765374',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'List',
    defaultProps: {
      'id': 'listblock-1755114765374',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'marquee-',
    name: 'Marquee',
    description: 'Componente Marquee de uso geral',
    category: 'misc',
    icon: Square,
    component: MarqueeBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'marqueeblock-1755114765374',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Marquee',
    defaultProps: {
      'id': 'marqueeblock-1755114765374',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'mentor-',
    name: 'Mentor',
    description: 'Componente Mentor de uso geral',
    category: 'misc',
    icon: Square,
    component: MentorBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'mentorblock-1755114765375',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Mentor',
    defaultProps: {
      'id': 'mentorblock-1755114765375',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'options-grid-',
    name: 'Options Grid',
    description: 'Componente Options Grid de uso geral',
    category: 'misc',
    icon: Square,
    component: OptionsGridBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'optionsgridblock-1755114765375',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Options Grid',
    defaultProps: {
      'id': 'optionsgridblock-1755114765375',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'pain-points-grid-',
    name: 'Pain Points Grid',
    description: 'Componente Pain Points Grid de uso geral',
    category: 'misc',
    icon: Square,
    component: PainPointsGridBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'painpointsgridblock-1755114765375',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Pain Points Grid',
    defaultProps: {
      'id': 'painpointsgridblock-1755114765375',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'product-features-grid-',
    name: 'Product Features Grid',
    description: 'Componente Product Features Grid de uso geral',
    category: 'misc',
    icon: Square,
    component: ProductFeaturesGridBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'productfeaturesgridblock-1755114765375',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Product Features Grid',
    defaultProps: {
      'id': 'productfeaturesgridblock-1755114765375',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'pros-cons-',
    name: 'Pros Cons',
    description: 'Componente Pros Cons de uso geral',
    category: 'misc',
    icon: Square,
    component: ProsConsBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'prosconsblock-1755114765375',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Pros Cons',
    defaultProps: {
      'id': 'prosconsblock-1755114765375',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'quote-',
    name: 'Quote',
    description: 'Componente Quote de uso geral',
    category: 'misc',
    icon: Square,
    component: QuoteBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'quoteblock-1755114765375',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Quote',
    defaultProps: {
      'id': 'quoteblock-1755114765375',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'script-',
    name: 'Script',
    description: 'Componente Script de uso geral',
    category: 'misc',
    icon: Square,
    component: ScriptBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'scriptblock-1755114765375',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Script',
    defaultProps: {
      'id': 'scriptblock-1755114765375',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'secondary-styles-block-',
    name: 'Secondary Styles',
    description: 'Componente Secondary Styles de uso geral',
    category: 'misc',
    icon: Square,
    component: SecondaryStylesBlockEditor,
    properties: {
      'id': {
            'type': 'string',
            'default': 'secondarystylesblockeditor-1755114765375',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Secondary Styles',
    defaultProps: {
      'id': 'secondarystylesblockeditor-1755114765375',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'secure-purchase-',
    name: 'Secure Purchase',
    description: 'Componente Secure Purchase de uso geral',
    category: 'misc',
    icon: Square,
    component: SecurePurchaseBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'securepurchaseblock-1755114765375',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Secure Purchase',
    defaultProps: {
      'id': 'securepurchaseblock-1755114765375',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'social-proof-',
    name: 'Social Proof',
    description: 'Componente Social Proof de uso geral',
    category: 'misc',
    icon: Square,
    component: SocialProofBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'socialproofblock-1755114765375',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Social Proof',
    defaultProps: {
      'id': 'socialproofblock-1755114765375',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'stat-inline-',
    name: 'Stat',
    description: 'Componente Stat de uso geral',
    category: 'misc',
    icon: Square,
    component: StatInlineBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'statinlineblock-1755114765375',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Stat',
    defaultProps: {
      'id': 'statinlineblock-1755114765375',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'style-card-',
    name: 'Style Card',
    description: 'Componente Style Card de uso geral',
    category: 'misc',
    icon: Square,
    component: StyleCardBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'stylecardblock-1755114765375',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Style Card',
    defaultProps: {
      'id': 'stylecardblock-1755114765375',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'style-card-inline-',
    name: 'Style Card',
    description: 'Componente Style Card de uso geral',
    category: 'misc',
    icon: Square,
    component: StyleCardInlineBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'stylecardinlineblock-1755114765375',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Style Card',
    defaultProps: {
      'id': 'stylecardinlineblock-1755114765375',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'style-characteristics-',
    name: 'Style Characteristics',
    description: 'Componente Style Characteristics de uso geral',
    category: 'misc',
    icon: Square,
    component: StyleCharacteristicsBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'stylecharacteristicsblock-1755114765375',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Style Characteristics',
    defaultProps: {
      'id': 'stylecharacteristicsblock-1755114765375',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'terms-',
    name: 'Terms',
    description: 'Componente Terms de uso geral',
    category: 'misc',
    icon: Square,
    component: TermsBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'termsblock-1755114765375',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Terms',
    defaultProps: {
      'id': 'termsblock-1755114765375',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'unified-funnel-',
    name: 'Unified Funnel',
    description: 'Componente Unified Funnel de uso geral',
    category: 'misc',
    icon: Square,
    component: UnifiedFunnelBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'unifiedfunnelblock-1755114765375',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Unified Funnel',
    defaultProps: {
      'id': 'unifiedfunnelblock-1755114765375',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'unified-funnel-pain-',
    name: 'Unified Funnel Pain',
    description: 'Componente Unified Funnel Pain de uso geral',
    category: 'misc',
    icon: Square,
    component: UnifiedFunnelPainBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'unifiedfunnelpainblock-1755114765375',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Unified Funnel Pain',
    defaultProps: {
      'id': 'unifiedfunnelpainblock-1755114765375',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'universal-block-renderer',
    name: 'Universal  Renderer',
    description: 'Componente Universal  Renderer de uso geral',
    category: 'misc',
    icon: Square,
    component: UniversalBlockRenderer,
    properties: {
      'id': {
            'type': 'string',
            'default': 'universalblockrenderer-1755114765375',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Universal  Renderer',
    defaultProps: {
      'id': 'universalblockrenderer-1755114765375',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'value-anchoring-',
    name: 'Value Anchoring',
    description: 'Componente Value Anchoring de uso geral',
    category: 'misc',
    icon: Square,
    component: ValueAnchoringBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'valueanchoringblock-1755114765375',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Value Anchoring',
    defaultProps: {
      'id': 'valueanchoringblock-1755114765375',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'value-stack-',
    name: 'Value Stack',
    description: 'Componente Value Stack de uso geral',
    category: 'misc',
    icon: Square,
    component: ValueStackBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'valuestackblock-1755114765376',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Value Stack',
    defaultProps: {
      'id': 'valuestackblock-1755114765376',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'value-stack-inline-',
    name: 'Value Stack',
    description: 'Componente Value Stack de uso geral',
    category: 'misc',
    icon: Square,
    component: ValueStackInlineBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'valuestackinlineblock-1755114765376',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Value Stack',
    defaultProps: {
      'id': 'valuestackinlineblock-1755114765376',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'vertical-canvas-header-',
    name: 'Vertical Canvas Header',
    description: 'Componente Vertical Canvas Header de uso geral',
    category: 'misc',
    icon: Square,
    component: VerticalCanvasHeaderBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'verticalcanvasheaderblock-1755114765376',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Vertical Canvas Header',
    defaultProps: {
      'id': 'verticalcanvasheaderblock-1755114765376',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  // ========== ANALYTICS COMPONENTS ==========
  {
    type: 'animated-charts-',
    name: 'Animated Charts',
    description: 'Componente Animated Charts para dados e métricas',
    category: 'analytics',
    icon: BarChart,
    component: AnimatedChartsBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'animatedchartsblock-1755114765376',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Animated Charts',
    defaultProps: {
      'id': 'animatedchartsblock-1755114765376',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'chart-area-',
    name: 'Chart Area',
    description: 'Componente Chart Area para dados e métricas',
    category: 'analytics',
    icon: BarChart,
    component: ChartAreaBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'chartareablock-1755114765376',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Chart Area',
    defaultProps: {
      'id': 'chartareablock-1755114765376',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'chart-level-',
    name: 'Chart Level',
    description: 'Componente Chart Level para dados e métricas',
    category: 'analytics',
    icon: BarChart,
    component: ChartLevelBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'chartlevelblock-1755114765376',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Chart Level',
    defaultProps: {
      'id': 'chartlevelblock-1755114765376',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'stats-metrics-',
    name: 'Stats Metrics',
    description: 'Componente Stats Metrics para dados e métricas',
    category: 'analytics',
    icon: BarChart,
    component: StatsMetricsBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'statsmetricsblock-1755114765376',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Stats Metrics',
    defaultProps: {
      'id': 'statsmetricsblock-1755114765376',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  // ========== TEXT COMPONENTS ==========
  {
    type: 'basic-text-',
    name: 'Basic Text',
    description: 'Componente Basic Text para conteúdo textual',
    category: 'text',
    icon: Type,
    component: BasicTextBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'basictextblock-1755114765376',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'content': {
            'type': 'textarea',
            'default': 'Texto de exemplo',
            'label': 'Conteúdo',
            'description': 'Conteúdo do texto'
      },
      'textAlign': {
            'type': 'select',
            'default': 'left',
            'label': 'Alinhamento',
            'options': [
                  {
                        'value': 'left',
                        'label': 'Esquerda'
                  },
                  {
                        'value': 'center',
                        'label': 'Centro'
                  },
                  {
                        'value': 'right',
                        'label': 'Direita'
                  }
            ]
      }
},
    label: 'Basic Text',
    defaultProps: {
      'id': 'basictextblock-1755114765376',
      'content': 'Texto de exemplo',
      'textAlign': 'left'
},
  },

  {
    type: 'heading-inline-',
    name: 'Heading',
    description: 'Componente Heading para conteúdo textual',
    category: 'text',
    icon: Type,
    component: HeadingInlineBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'headinginlineblock-1755114765377',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'content': {
            'type': 'textarea',
            'default': 'Texto de exemplo',
            'label': 'Conteúdo',
            'description': 'Conteúdo do texto'
      },
      'textAlign': {
            'type': 'select',
            'default': 'left',
            'label': 'Alinhamento',
            'options': [
                  {
                        'value': 'left',
                        'label': 'Esquerda'
                  },
                  {
                        'value': 'center',
                        'label': 'Centro'
                  },
                  {
                        'value': 'right',
                        'label': 'Direita'
                  }
            ]
      }
},
    label: 'Heading',
    defaultProps: {
      'id': 'headinginlineblock-1755114765377',
      'content': 'Texto de exemplo',
      'textAlign': 'left'
},
  },

  {
    type: 'inline-editable-text',
    name: 'Editable Text',
    description: 'Componente Editable Text para conteúdo textual',
    category: 'text',
    icon: Type,
    component: InlineEditableText,
    properties: {
      'id': {
            'type': 'string',
            'default': 'inlineeditabletext-1755114765377',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'content': {
            'type': 'textarea',
            'default': 'Texto de exemplo',
            'label': 'Conteúdo',
            'description': 'Conteúdo do texto'
      },
      'textAlign': {
            'type': 'select',
            'default': 'left',
            'label': 'Alinhamento',
            'options': [
                  {
                        'value': 'left',
                        'label': 'Esquerda'
                  },
                  {
                        'value': 'center',
                        'label': 'Centro'
                  },
                  {
                        'value': 'right',
                        'label': 'Direita'
                  }
            ]
      }
},
    label: 'Editable Text',
    defaultProps: {
      'id': 'inlineeditabletext-1755114765377',
      'content': 'Texto de exemplo',
      'textAlign': 'left'
},
  },

  {
    type: 'inline-edit-text',
    name: 'Edit Text',
    description: 'Componente Edit Text para conteúdo textual',
    category: 'text',
    icon: Type,
    component: InlineEditText,
    properties: {
      'id': {
            'type': 'string',
            'default': 'inlineedittext-1755114765377',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'content': {
            'type': 'textarea',
            'default': 'Texto de exemplo',
            'label': 'Conteúdo',
            'description': 'Conteúdo do texto'
      },
      'textAlign': {
            'type': 'select',
            'default': 'left',
            'label': 'Alinhamento',
            'options': [
                  {
                        'value': 'left',
                        'label': 'Esquerda'
                  },
                  {
                        'value': 'center',
                        'label': 'Centro'
                  },
                  {
                        'value': 'right',
                        'label': 'Direita'
                  }
            ]
      }
},
    label: 'Edit Text',
    defaultProps: {
      'id': 'inlineedittext-1755114765377',
      'content': 'Texto de exemplo',
      'textAlign': 'left'
},
  },

  {
    type: 'rich-text-',
    name: 'Rich Text',
    description: 'Componente Rich Text para conteúdo textual',
    category: 'text',
    icon: Type,
    component: RichTextBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'richtextblock-1755114765377',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'content': {
            'type': 'textarea',
            'default': 'Texto de exemplo',
            'label': 'Conteúdo',
            'description': 'Conteúdo do texto'
      },
      'textAlign': {
            'type': 'select',
            'default': 'left',
            'label': 'Alinhamento',
            'options': [
                  {
                        'value': 'left',
                        'label': 'Esquerda'
                  },
                  {
                        'value': 'center',
                        'label': 'Centro'
                  },
                  {
                        'value': 'right',
                        'label': 'Direita'
                  }
            ]
      }
},
    label: 'Rich Text',
    defaultProps: {
      'id': 'richtextblock-1755114765377',
      'content': 'Texto de exemplo',
      'textAlign': 'left'
},
  },

  {
    type: 't-e-x-t_-s-i-z-e-s',
    name: 'T E X T_ S I Z E S',
    description: 'Componente T E X T_ S I Z E S para conteúdo textual',
    category: 'text',
    icon: Type,
    component: TEXT_SIZES,
    properties: {
      'id': {
            'type': 'string',
            'default': 'text_sizes-1755114765377',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'content': {
            'type': 'textarea',
            'default': 'Texto de exemplo',
            'label': 'Conteúdo',
            'description': 'Conteúdo do texto'
      },
      'textAlign': {
            'type': 'select',
            'default': 'left',
            'label': 'Alinhamento',
            'options': [
                  {
                        'value': 'left',
                        'label': 'Esquerda'
                  },
                  {
                        'value': 'center',
                        'label': 'Centro'
                  },
                  {
                        'value': 'right',
                        'label': 'Direita'
                  }
            ]
      }
},
    label: 'T E X T_ S I Z E S',
    defaultProps: {
      'id': 'text_sizes-1755114765377',
      'content': 'Texto de exemplo',
      'textAlign': 'left'
},
  },

  {
    type: 't-e-x-t_-s-i-z-e-s',
    name: 'T E X T_ S I Z E S',
    description: 'Componente T E X T_ S I Z E S para conteúdo textual',
    category: 'text',
    icon: Type,
    component: TEXT_SIZES,
    properties: {
      'id': {
            'type': 'string',
            'default': 'text_sizes-1755114765377',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'content': {
            'type': 'textarea',
            'default': 'Texto de exemplo',
            'label': 'Conteúdo',
            'description': 'Conteúdo do texto'
      },
      'textAlign': {
            'type': 'select',
            'default': 'left',
            'label': 'Alinhamento',
            'options': [
                  {
                        'value': 'left',
                        'label': 'Esquerda'
                  },
                  {
                        'value': 'center',
                        'label': 'Centro'
                  },
                  {
                        'value': 'right',
                        'label': 'Direita'
                  }
            ]
      }
},
    label: 'T E X T_ S I Z E S',
    defaultProps: {
      'id': 'text_sizes-1755114765377',
      'content': 'Texto de exemplo',
      'textAlign': 'left'
},
  },

  {
    type: 'text-',
    name: 'Text',
    description: 'Componente Text para conteúdo textual',
    category: 'text',
    icon: Type,
    component: TextBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'textblock-1755114765377',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'content': {
            'type': 'textarea',
            'default': 'Texto de exemplo',
            'label': 'Conteúdo',
            'description': 'Conteúdo do texto'
      },
      'textAlign': {
            'type': 'select',
            'default': 'left',
            'label': 'Alinhamento',
            'options': [
                  {
                        'value': 'left',
                        'label': 'Esquerda'
                  },
                  {
                        'value': 'center',
                        'label': 'Centro'
                  },
                  {
                        'value': 'right',
                        'label': 'Direita'
                  }
            ]
      }
},
    label: 'Text',
    defaultProps: {
      'id': 'textblock-1755114765377',
      'content': 'Texto de exemplo',
      'textAlign': 'left'
},
  },

  {
    type: 'text-block-',
    name: 'Text',
    description: 'Componente Text para conteúdo textual',
    category: 'text',
    icon: Type,
    component: TextBlockEditor,
    properties: {
      'id': {
            'type': 'string',
            'default': 'textblockeditor-1755114765377',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'content': {
            'type': 'textarea',
            'default': 'Texto de exemplo',
            'label': 'Conteúdo',
            'description': 'Conteúdo do texto'
      },
      'textAlign': {
            'type': 'select',
            'default': 'left',
            'label': 'Alinhamento',
            'options': [
                  {
                        'value': 'left',
                        'label': 'Esquerda'
                  },
                  {
                        'value': 'center',
                        'label': 'Centro'
                  },
                  {
                        'value': 'right',
                        'label': 'Direita'
                  }
            ]
      }
},
    label: 'Text',
    defaultProps: {
      'id': 'textblockeditor-1755114765377',
      'content': 'Texto de exemplo',
      'textAlign': 'left'
},
  },

  // ========== QUIZ COMPONENTS ==========
  {
    type: 'cakto-quiz-intro',
    name: 'Cakto Quiz Intro',
    description: 'Componente Cakto Quiz Intro para questionários e interação',
    category: 'quiz',
    icon: HelpCircle,
    component: CaktoQuizIntro,
    properties: {
      'id': {
            'type': 'string',
            'default': 'caktoquizintro-1755114765377',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Cakto Quiz Intro',
    defaultProps: {
      'id': 'caktoquizintro-1755114765377',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'cakto-quiz-offer',
    name: 'Cakto Quiz Offer',
    description: 'Componente Cakto Quiz Offer para questionários e interação',
    category: 'quiz',
    icon: HelpCircle,
    component: CaktoQuizOffer,
    properties: {
      'id': {
            'type': 'string',
            'default': 'caktoquizoffer-1755114765377',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Cakto Quiz Offer',
    defaultProps: {
      'id': 'caktoquizoffer-1755114765377',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'cakto-quiz-question',
    name: 'Cakto Quiz Question',
    description: 'Componente Cakto Quiz Question para questionários e interação',
    category: 'quiz',
    icon: HelpCircle,
    component: CaktoQuizQuestion,
    properties: {
      'id': {
            'type': 'string',
            'default': 'caktoquizquestion-1755114765377',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Cakto Quiz Question',
    defaultProps: {
      'id': 'caktoquizquestion-1755114765377',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'cakto-quiz-result',
    name: 'Cakto Quiz Result',
    description: 'Componente Cakto Quiz Result para questionários e interação',
    category: 'quiz',
    icon: HelpCircle,
    component: CaktoQuizResult,
    properties: {
      'id': {
            'type': 'string',
            'default': 'caktoquizresult-1755114765377',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Cakto Quiz Result',
    defaultProps: {
      'id': 'caktoquizresult-1755114765377',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'cakto-quiz-transition',
    name: 'Cakto Quiz Transition',
    description: 'Componente Cakto Quiz Transition para questionários e interação',
    category: 'quiz',
    icon: HelpCircle,
    component: CaktoQuizTransition,
    properties: {
      'id': {
            'type': 'string',
            'default': 'caktoquiztransition-1755114765377',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Cakto Quiz Transition',
    defaultProps: {
      'id': 'caktoquiztransition-1755114765377',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'interactive-quiz-',
    name: 'Interactive Quiz',
    description: 'Componente Interactive Quiz para questionários e interação',
    category: 'quiz',
    icon: HelpCircle,
    component: InteractiveQuizBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'interactivequizblock-1755114765377',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Interactive Quiz',
    defaultProps: {
      'id': 'interactivequizblock-1755114765377',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'quiz-content-integration',
    name: 'Quiz Content Integration',
    description: 'Componente Quiz Content Integration para questionários e interação',
    category: 'quiz',
    icon: HelpCircle,
    component: QuizContentIntegration,
    properties: {
      'id': {
            'type': 'string',
            'default': 'quizcontentintegration-1755114765377',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Quiz Content Integration',
    defaultProps: {
      'id': 'quizcontentintegration-1755114765377',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'quiz-funnel-step1-',
    name: 'Quiz Funnel Step1',
    description: 'Componente Quiz Funnel Step1 para questionários e interação',
    category: 'quiz',
    icon: HelpCircle,
    component: QuizFunnelStep1Block,
    properties: {
      'id': {
            'type': 'string',
            'default': 'quizfunnelstep1block-1755114765377',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Quiz Funnel Step1',
    defaultProps: {
      'id': 'quizfunnelstep1block-1755114765377',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'quiz-header-',
    name: 'Quiz Header',
    description: 'Componente Quiz Header para questionários e interação',
    category: 'quiz',
    icon: HelpCircle,
    component: QuizHeaderBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'quizheaderblock-1755114765377',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Quiz Header',
    defaultProps: {
      'id': 'quizheaderblock-1755114765377',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'quiz-intro-header-',
    name: 'Quiz Intro Header',
    description: 'Componente Quiz Intro Header para questionários e interação',
    category: 'quiz',
    icon: HelpCircle,
    component: QuizIntroHeaderBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'quizintroheaderblock-1755114765377',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Quiz Intro Header',
    defaultProps: {
      'id': 'quizintroheaderblock-1755114765377',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'quiz-navigation-integration',
    name: 'Quiz Navigation Integration',
    description: 'Componente Quiz Navigation Integration para questionários e interação',
    category: 'quiz',
    icon: HelpCircle,
    component: QuizNavigationIntegration,
    properties: {
      'id': {
            'type': 'string',
            'default': 'quiznavigationintegration-1755114765377',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Quiz Navigation Integration',
    defaultProps: {
      'id': 'quiznavigationintegration-1755114765377',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'quiz-offer-countdown-',
    name: 'Quiz Offer Countdown',
    description: 'Componente Quiz Offer Countdown para questionários e interação',
    category: 'quiz',
    icon: HelpCircle,
    component: QuizOfferCountdownBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'quizoffercountdownblock-1755114765377',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Quiz Offer Countdown',
    defaultProps: {
      'id': 'quizoffercountdownblock-1755114765377',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'quiz-offer-f-a-q-',
    name: 'Quiz Offer F A Q',
    description: 'Componente Quiz Offer F A Q para questionários e interação',
    category: 'quiz',
    icon: HelpCircle,
    component: QuizOfferFAQBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'quizofferfaqblock-1755114765377',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Quiz Offer F A Q',
    defaultProps: {
      'id': 'quizofferfaqblock-1755114765377',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'quiz-offer-final-c-t-a-',
    name: 'Quiz Offer Final C T A',
    description: 'Componente Quiz Offer Final C T A para questionários e interação',
    category: 'quiz',
    icon: HelpCircle,
    component: QuizOfferFinalCTABlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'quizofferfinalctablock-1755114765378',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Quiz Offer Final C T A',
    defaultProps: {
      'id': 'quizofferfinalctablock-1755114765378',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'quiz-offer-hero-',
    name: 'Quiz Offer Hero',
    description: 'Componente Quiz Offer Hero para questionários e interação',
    category: 'quiz',
    icon: HelpCircle,
    component: QuizOfferHeroBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'quizofferheroblock-1755114765378',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Quiz Offer Hero',
    defaultProps: {
      'id': 'quizofferheroblock-1755114765378',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'quiz-offer-pricing-',
    name: 'Quiz Offer Pricing',
    description: 'Componente Quiz Offer Pricing para questionários e interação',
    category: 'quiz',
    icon: HelpCircle,
    component: QuizOfferPricingBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'quizofferpricingblock-1755114765378',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Quiz Offer Pricing',
    defaultProps: {
      'id': 'quizofferpricingblock-1755114765378',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'quiz-offer-testimonials-',
    name: 'Quiz Offer Testimonials',
    description: 'Componente Quiz Offer Testimonials para questionários e interação',
    category: 'quiz',
    icon: HelpCircle,
    component: QuizOfferTestimonialsBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'quizoffertestimonialsblock-1755114765378',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Quiz Offer Testimonials',
    defaultProps: {
      'id': 'quizoffertestimonialsblock-1755114765378',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'quiz-option-',
    name: 'Quiz Option',
    description: 'Componente Quiz Option para questionários e interação',
    category: 'quiz',
    icon: HelpCircle,
    component: QuizOptionBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'quizoptionblock-1755114765378',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Quiz Option',
    defaultProps: {
      'id': 'quizoptionblock-1755114765378',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'quiz-progress-',
    name: 'Quiz Progress',
    description: 'Componente Quiz Progress para questionários e interação',
    category: 'quiz',
    icon: HelpCircle,
    component: QuizProgressBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'quizprogressblock-1755114765378',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Quiz Progress',
    defaultProps: {
      'id': 'quizprogressblock-1755114765378',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'quiz-question-',
    name: 'Quiz Question',
    description: 'Componente Quiz Question para questionários e interação',
    category: 'quiz',
    icon: HelpCircle,
    component: QuizQuestionBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'quizquestionblock-1755114765378',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Quiz Question',
    defaultProps: {
      'id': 'quizquestionblock-1755114765378',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'quiz-question-block-configurable',
    name: 'Quiz Question  Configurable',
    description: 'Componente Quiz Question  Configurable para questionários e interação',
    category: 'quiz',
    icon: HelpCircle,
    component: QuizQuestionBlockConfigurable,
    properties: {
      'id': {
            'type': 'string',
            'default': 'quizquestionblockconfigurable-1755114765378',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Quiz Question  Configurable',
    defaultProps: {
      'id': 'quizquestionblockconfigurable-1755114765378',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'quiz-result-calculated-',
    name: 'Quiz Result Calculated',
    description: 'Componente Quiz Result Calculated para questionários e interação',
    category: 'quiz',
    icon: HelpCircle,
    component: QuizResultCalculatedBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'quizresultcalculatedblock-1755114765378',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Quiz Result Calculated',
    defaultProps: {
      'id': 'quizresultcalculatedblock-1755114765378',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'quiz-result-header-',
    name: 'Quiz Result Header',
    description: 'Componente Quiz Result Header para questionários e interação',
    category: 'quiz',
    icon: HelpCircle,
    component: QuizResultHeaderBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'quizresultheaderblock-1755114765378',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Quiz Result Header',
    defaultProps: {
      'id': 'quizresultheaderblock-1755114765378',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'quiz-result-main-card-',
    name: 'Quiz Result Main Card',
    description: 'Componente Quiz Result Main Card para questionários e interação',
    category: 'quiz',
    icon: HelpCircle,
    component: QuizResultMainCardBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'quizresultmaincardblock-1755114765378',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Quiz Result Main Card',
    defaultProps: {
      'id': 'quizresultmaincardblock-1755114765378',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'quiz-result-secondary-styles-',
    name: 'Quiz Result Secondary Styles',
    description: 'Componente Quiz Result Secondary Styles para questionários e interação',
    category: 'quiz',
    icon: HelpCircle,
    component: QuizResultSecondaryStylesBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'quizresultsecondarystylesblock-1755114765378',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Quiz Result Secondary Styles',
    defaultProps: {
      'id': 'quizresultsecondarystylesblock-1755114765378',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'quiz-results-',
    name: 'Quiz Results',
    description: 'Componente Quiz Results para questionários e interação',
    category: 'quiz',
    icon: HelpCircle,
    component: QuizResultsEditor,
    properties: {
      'id': {
            'type': 'string',
            'default': 'quizresultseditor-1755114765378',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Quiz Results',
    defaultProps: {
      'id': 'quizresultseditor-1755114765378',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'quiz-start-page-',
    name: 'Quiz Start Page',
    description: 'Componente Quiz Start Page para questionários e interação',
    category: 'quiz',
    icon: HelpCircle,
    component: QuizStartPageBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'quizstartpageblock-1755114765378',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Quiz Start Page',
    defaultProps: {
      'id': 'quizstartpageblock-1755114765378',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'quiz-step-',
    name: 'Quiz Step',
    description: 'Componente Quiz Step para questionários e interação',
    category: 'quiz',
    icon: HelpCircle,
    component: QuizStepBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'quizstepblock-1755114765378',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Quiz Step',
    defaultProps: {
      'id': 'quizstepblock-1755114765378',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'quiz-title-',
    name: 'Quiz Title',
    description: 'Componente Quiz Title para questionários e interação',
    category: 'quiz',
    icon: HelpCircle,
    component: QuizTitleBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'quiztitleblock-1755114765378',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Quiz Title',
    defaultProps: {
      'id': 'quiztitleblock-1755114765378',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'quiz-transition-',
    name: 'Quiz Transition',
    description: 'Componente Quiz Transition para questionários e interação',
    category: 'quiz',
    icon: HelpCircle,
    component: QuizTransitionBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'quiztransitionblock-1755114765378',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Quiz Transition',
    defaultProps: {
      'id': 'quiztransitionblock-1755114765378',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'quiz-transition-',
    name: 'Quiz Transition',
    description: 'Componente Quiz Transition para questionários e interação',
    category: 'quiz',
    icon: HelpCircle,
    component: QuizTransitionBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'quiztransitionblock-1755114765378',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Quiz Transition',
    defaultProps: {
      'id': 'quiztransitionblock-1755114765378',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'strategic-question-',
    name: 'Strategic Question',
    description: 'Componente Strategic Question para questionários e interação',
    category: 'quiz',
    icon: HelpCircle,
    component: StrategicQuestionBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'strategicquestionblock-1755114765378',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Strategic Question',
    defaultProps: {
      'id': 'strategicquestionblock-1755114765378',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  // ========== URGENCY COMPONENTS ==========
  {
    type: 'countdown-timer-',
    name: 'Countdown Timer',
    description: 'Componente Countdown Timer para criar urgência',
    category: 'urgency',
    icon: Clock,
    component: CountdownTimerBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'countdowntimerblock-1755114765378',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Countdown Timer',
    defaultProps: {
      'id': 'countdowntimerblock-1755114765378',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'urgency-timer-',
    name: 'Urgency Timer',
    description: 'Componente Urgency Timer para criar urgência',
    category: 'urgency',
    icon: Clock,
    component: UrgencyTimerBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'urgencytimerblock-1755114765379',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Urgency Timer',
    defaultProps: {
      'id': 'urgencytimerblock-1755114765379',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'urgency-timer-inline-',
    name: 'Urgency Timer',
    description: 'Componente Urgency Timer para criar urgência',
    category: 'urgency',
    icon: Clock,
    component: UrgencyTimerInlineBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'urgencytimerinlineblock-1755114765379',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Urgency Timer',
    defaultProps: {
      'id': 'urgencytimerinlineblock-1755114765379',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  // ========== FAQ COMPONENTS ==========
  {
    type: 'f-a-q-',
    name: 'F A Q',
    description: 'Componente F A Q para perguntas frequentes',
    category: 'faq',
    icon: MessageCircle,
    component: FAQBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'faqblock-1755114765379',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'F A Q',
    defaultProps: {
      'id': 'faqblock-1755114765379',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'f-a-q-section-',
    name: 'F A Q Section',
    description: 'Componente F A Q Section para perguntas frequentes',
    category: 'faq',
    icon: MessageCircle,
    component: FAQSectionBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'faqsectionblock-1755114765379',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'F A Q Section',
    defaultProps: {
      'id': 'faqsectionblock-1755114765379',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'f-a-q-section-inline-',
    name: 'F A Q Section',
    description: 'Componente F A Q Section para perguntas frequentes',
    category: 'faq',
    icon: MessageCircle,
    component: FAQSectionInlineBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'faqsectioninlineblock-1755114765379',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'F A Q Section',
    defaultProps: {
      'id': 'faqsectioninlineblock-1755114765379',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  // ========== FORMS COMPONENTS ==========
  {
    type: 'form-container-',
    name: 'Form Container',
    description: 'Componente Form Container para formulários',
    category: 'forms',
    icon: FileText,
    component: FormContainerBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'formcontainerblock-1755114765379',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Form Container',
    defaultProps: {
      'id': 'formcontainerblock-1755114765379',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'form-input-',
    name: 'Form Input',
    description: 'Componente Form Input para formulários',
    category: 'forms',
    icon: FileText,
    component: FormInputBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'forminputblock-1755114765379',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Form Input',
    defaultProps: {
      'id': 'forminputblock-1755114765379',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'transformation-inline-',
    name: 'Transformation',
    description: 'Componente Transformation para formulários',
    category: 'forms',
    icon: FileText,
    component: TransformationInlineBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'transformationinlineblock-1755114765379',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Transformation',
    defaultProps: {
      'id': 'transformationinlineblock-1755114765379',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  // ========== CONVERSION COMPONENTS ==========
  {
    type: 'hero-offer-',
    name: 'Hero Offer',
    description: 'Componente Hero Offer para conversão',
    category: 'conversion',
    icon: Target,
    component: HeroOfferBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'heroofferblock-1755114765379',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Hero Offer',
    defaultProps: {
      'id': 'heroofferblock-1755114765379',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'modern-result-page-',
    name: 'Modern Result Page',
    description: 'Componente Modern Result Page para conversão',
    category: 'conversion',
    icon: Target,
    component: ModernResultPageBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'modernresultpageblock-1755114765379',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Modern Result Page',
    defaultProps: {
      'id': 'modernresultpageblock-1755114765379',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'modern-result-page-',
    name: 'Modern Result Page',
    description: 'Componente Modern Result Page para conversão',
    category: 'conversion',
    icon: Target,
    component: ModernResultPageBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'modernresultpageblock-1755114765379',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Modern Result Page',
    defaultProps: {
      'id': 'modernresultpageblock-1755114765379',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'product-offer-',
    name: 'Product Offer',
    description: 'Componente Product Offer para conversão',
    category: 'conversion',
    icon: Target,
    component: ProductOfferBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'productofferblock-1755114765379',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Product Offer',
    defaultProps: {
      'id': 'productofferblock-1755114765379',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'result-description-',
    name: 'Result Description',
    description: 'Componente Result Description para conversão',
    category: 'conversion',
    icon: Target,
    component: ResultDescriptionBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'resultdescriptionblock-1755114765379',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Result Description',
    defaultProps: {
      'id': 'resultdescriptionblock-1755114765379',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'result-header-',
    name: 'Result Header',
    description: 'Componente Result Header para conversão',
    category: 'conversion',
    icon: Target,
    component: ResultHeaderBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'resultheaderblock-1755114765379',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Result Header',
    defaultProps: {
      'id': 'resultheaderblock-1755114765379',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'result-header-inline-',
    name: 'Result Header',
    description: 'Componente Result Header para conversão',
    category: 'conversion',
    icon: Target,
    component: ResultHeaderInlineBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'resultheaderinlineblock-1755114765380',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Result Header',
    defaultProps: {
      'id': 'resultheaderinlineblock-1755114765380',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'result-page-header-',
    name: 'Result Page Header',
    description: 'Componente Result Page Header para conversão',
    category: 'conversion',
    icon: Target,
    component: ResultPageHeaderBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'resultpageheaderblock-1755114765380',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Result Page Header',
    defaultProps: {
      'id': 'resultpageheaderblock-1755114765380',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'style-results-',
    name: 'Style Results',
    description: 'Componente Style Results para conversão',
    category: 'conversion',
    icon: Target,
    component: StyleResultsEditor,
    properties: {
      'id': {
            'type': 'string',
            'default': 'styleresultseditor-1755114765380',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Style Results',
    defaultProps: {
      'id': 'styleresultseditor-1755114765380',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  // ========== LAYOUT COMPONENTS ==========
  {
    type: 'hero-section-block-',
    name: 'Hero Section',
    description: 'Componente Hero Section para estrutura e layout',
    category: 'layout',
    icon: Layout,
    component: HeroSectionBlockEditor,
    properties: {
      'id': {
            'type': 'string',
            'default': 'herosectionblockeditor-1755114765380',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Hero Section',
    defaultProps: {
      'id': 'herosectionblockeditor-1755114765380',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'mentor-section-inline-',
    name: 'Mentor Section',
    description: 'Componente Mentor Section para estrutura e layout',
    category: 'layout',
    icon: Layout,
    component: MentorSectionInlineBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'mentorsectioninlineblock-1755114765380',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Mentor Section',
    defaultProps: {
      'id': 'mentorsectioninlineblock-1755114765380',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'section-divider-',
    name: 'Section Divider',
    description: 'Componente Section Divider para estrutura e layout',
    category: 'layout',
    icon: Layout,
    component: SectionDividerBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'sectiondividerblock-1755114765380',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Section Divider',
    defaultProps: {
      'id': 'sectiondividerblock-1755114765380',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'spacer-',
    name: 'Spacer',
    description: 'Componente Spacer para estrutura e layout',
    category: 'layout',
    icon: Layout,
    component: SpacerBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'spacerblock-1755114765380',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Spacer',
    defaultProps: {
      'id': 'spacerblock-1755114765380',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'spacer-inline-',
    name: 'Spacer',
    description: 'Componente Spacer para estrutura e layout',
    category: 'layout',
    icon: Layout,
    component: SpacerInlineBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'spacerinlineblock-1755114765380',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Spacer',
    defaultProps: {
      'id': 'spacerinlineblock-1755114765380',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  // ========== MEDIA COMPONENTS ==========
  {
    type: 'image-',
    name: 'Image',
    description: 'Componente Image para conteúdo multimídia',
    category: 'media',
    icon: Image,
    component: ImageBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'imageblock-1755114765380',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'src': {
            'type': 'string',
            'default': 'https://via.placeholder.com/400x300',
            'label': 'URL da Imagem',
            'description': 'URL da imagem ou vídeo'
      },
      'alt': {
            'type': 'string',
            'default': 'Descrição da imagem',
            'label': 'Texto Alternativo',
            'description': 'Descrição para acessibilidade'
      }
},
    label: 'Image',
    defaultProps: {
      'id': 'imageblock-1755114765380',
      'src': 'https://via.placeholder.com/400x300',
      'alt': 'Descrição da imagem'
},
  },

  {
    type: 'image-block-',
    name: 'Image',
    description: 'Componente Image para conteúdo multimídia',
    category: 'media',
    icon: Image,
    component: ImageBlockEditor,
    properties: {
      'id': {
            'type': 'string',
            'default': 'imageblockeditor-1755114765380',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'src': {
            'type': 'string',
            'default': 'https://via.placeholder.com/400x300',
            'label': 'URL da Imagem',
            'description': 'URL da imagem ou vídeo'
      },
      'alt': {
            'type': 'string',
            'default': 'Descrição da imagem',
            'label': 'Texto Alternativo',
            'description': 'Descrição para acessibilidade'
      }
},
    label: 'Image',
    defaultProps: {
      'id': 'imageblockeditor-1755114765380',
      'src': 'https://via.placeholder.com/400x300',
      'alt': 'Descrição da imagem'
},
  },

  {
    type: 'image-display-',
    name: 'Image Display',
    description: 'Componente Image Display para conteúdo multimídia',
    category: 'media',
    icon: Image,
    component: ImageDisplayInline,
    properties: {
      'id': {
            'type': 'string',
            'default': 'imagedisplayinline-1755114765380',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'src': {
            'type': 'string',
            'default': 'https://via.placeholder.com/400x300',
            'label': 'URL da Imagem',
            'description': 'URL da imagem ou vídeo'
      },
      'alt': {
            'type': 'string',
            'default': 'Descrição da imagem',
            'label': 'Texto Alternativo',
            'description': 'Descrição para acessibilidade'
      }
},
    label: 'Image Display',
    defaultProps: {
      'id': 'imagedisplayinline-1755114765380',
      'src': 'https://via.placeholder.com/400x300',
      'alt': 'Descrição da imagem'
},
  },

  {
    type: 'image-inline-',
    name: 'Image',
    description: 'Componente Image para conteúdo multimídia',
    category: 'media',
    icon: Image,
    component: ImageInlineBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'imageinlineblock-1755114765380',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'src': {
            'type': 'string',
            'default': 'https://via.placeholder.com/400x300',
            'label': 'URL da Imagem',
            'description': 'URL da imagem ou vídeo'
      },
      'alt': {
            'type': 'string',
            'default': 'Descrição da imagem',
            'label': 'Texto Alternativo',
            'description': 'Descrição para acessibilidade'
      }
},
    label: 'Image',
    defaultProps: {
      'id': 'imageinlineblock-1755114765380',
      'src': 'https://via.placeholder.com/400x300',
      'alt': 'Descrição da imagem'
},
  },

  {
    type: 'video-',
    name: 'Video',
    description: 'Componente Video para conteúdo multimídia',
    category: 'media',
    icon: Image,
    component: VideoBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'videoblock-1755114765380',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'src': {
            'type': 'string',
            'default': 'https://via.placeholder.com/400x300',
            'label': 'URL da Imagem',
            'description': 'URL da imagem ou vídeo'
      },
      'alt': {
            'type': 'string',
            'default': 'Descrição da imagem',
            'label': 'Texto Alternativo',
            'description': 'Descrição para acessibilidade'
      }
},
    label: 'Video',
    defaultProps: {
      'id': 'videoblock-1755114765380',
      'src': 'https://via.placeholder.com/400x300',
      'alt': 'Descrição da imagem'
},
  },

  {
    type: 'video-player-',
    name: 'Video Player',
    description: 'Componente Video Player para conteúdo multimídia',
    category: 'media',
    icon: Image,
    component: VideoPlayerBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'videoplayerblock-1755114765380',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'src': {
            'type': 'string',
            'default': 'https://via.placeholder.com/400x300',
            'label': 'URL da Imagem',
            'description': 'URL da imagem ou vídeo'
      },
      'alt': {
            'type': 'string',
            'default': 'Descrição da imagem',
            'label': 'Texto Alternativo',
            'description': 'Descrição para acessibilidade'
      }
},
    label: 'Video Player',
    defaultProps: {
      'id': 'videoplayerblock-1755114765380',
      'src': 'https://via.placeholder.com/400x300',
      'alt': 'Descrição da imagem'
},
  },

  {
    type: 'video-player-inline-',
    name: 'Video Player',
    description: 'Componente Video Player para conteúdo multimídia',
    category: 'media',
    icon: Image,
    component: VideoPlayerInlineBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'videoplayerinlineblock-1755114765380',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'src': {
            'type': 'string',
            'default': 'https://via.placeholder.com/400x300',
            'label': 'URL da Imagem',
            'description': 'URL da imagem ou vídeo'
      },
      'alt': {
            'type': 'string',
            'default': 'Descrição da imagem',
            'label': 'Texto Alternativo',
            'description': 'Descrição para acessibilidade'
      }
},
    label: 'Video Player',
    defaultProps: {
      'id': 'videoplayerinlineblock-1755114765380',
      'src': 'https://via.placeholder.com/400x300',
      'alt': 'Descrição da imagem'
},
  },

  // ========== FEEDBACK COMPONENTS ==========
  {
    type: 'loader-',
    name: 'Loader',
    description: 'Componente Loader para feedback visual',
    category: 'feedback',
    icon: Activity,
    component: LoaderBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'loaderblock-1755114765380',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Loader',
    defaultProps: {
      'id': 'loaderblock-1755114765380',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'loader-inline-',
    name: 'Loader',
    description: 'Componente Loader para feedback visual',
    category: 'feedback',
    icon: Activity,
    component: LoaderInlineBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'loaderinlineblock-1755114765380',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Loader',
    defaultProps: {
      'id': 'loaderinlineblock-1755114765380',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'notification-inline-',
    name: 'Notification',
    description: 'Componente Notification para feedback visual',
    category: 'feedback',
    icon: Activity,
    component: NotificationInlineBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'notificationinlineblock-1755114765380',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Notification',
    defaultProps: {
      'id': 'notificationinlineblock-1755114765380',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'progress-bar-step-',
    name: 'Progress Bar Step',
    description: 'Componente Progress Bar Step para feedback visual',
    category: 'feedback',
    icon: Activity,
    component: ProgressBarStepBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'progressbarstepblock-1755114765380',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Progress Bar Step',
    defaultProps: {
      'id': 'progressbarstepblock-1755114765380',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'progress-inline-',
    name: 'Progress',
    description: 'Componente Progress para feedback visual',
    category: 'feedback',
    icon: Activity,
    component: ProgressInlineBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'progressinlineblock-1755114765380',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Progress',
    defaultProps: {
      'id': 'progressinlineblock-1755114765380',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  // ========== SOCIAL-PROOF COMPONENTS ==========
  {
    type: 'testimonial-inline-',
    name: 'Testimonial',
    description: 'Componente Testimonial para prova social',
    category: 'social-proof',
    icon: Users,
    component: TestimonialInlineBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'testimonialinlineblock-1755114765380',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Testimonial',
    defaultProps: {
      'id': 'testimonialinlineblock-1755114765380',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'testimonials-',
    name: 'Testimonials',
    description: 'Componente Testimonials para prova social',
    category: 'social-proof',
    icon: Users,
    component: TestimonialsBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'testimonialsblock-1755114765380',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Testimonials',
    defaultProps: {
      'id': 'testimonialsblock-1755114765380',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'testimonials-carousel-',
    name: 'Testimonials Carousel',
    description: 'Componente Testimonials Carousel para prova social',
    category: 'social-proof',
    icon: Users,
    component: TestimonialsCarouselBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'testimonialscarouselblock-1755114765380',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Testimonials Carousel',
    defaultProps: {
      'id': 'testimonialscarouselblock-1755114765380',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'testimonials-grid-',
    name: 'Testimonials Grid',
    description: 'Componente Testimonials Grid para prova social',
    category: 'social-proof',
    icon: Users,
    component: TestimonialsGridBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'testimonialsgridblock-1755114765380',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Testimonials Grid',
    defaultProps: {
      'id': 'testimonialsgridblock-1755114765380',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'testimonials-real-',
    name: 'Testimonials Real',
    description: 'Componente Testimonials Real para prova social',
    category: 'social-proof',
    icon: Users,
    component: TestimonialsRealBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'testimonialsrealblock-1755114765380',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Testimonials Real',
    defaultProps: {
      'id': 'testimonialsrealblock-1755114765380',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  },

  {
    type: 'testimonials-real-inline-',
    name: 'Testimonials Real',
    description: 'Componente Testimonials Real para prova social',
    category: 'social-proof',
    icon: Users,
    component: TestimonialsRealInlineBlock,
    properties: {
      'id': {
            'type': 'string',
            'default': 'testimonialsrealinlineblock-1755114765380',
            'label': 'ID',
            'description': 'Identificador único do componente'
      },
      'title': {
            'type': 'string',
            'default': 'Título do Componente',
            'label': 'Título',
            'description': 'Título do componente'
      },
      'description': {
            'type': 'textarea',
            'default': 'Descrição do componente',
            'label': 'Descrição',
            'description': 'Descrição detalhada'
      }
},
    label: 'Testimonials Real',
    defaultProps: {
      'id': 'testimonialsrealinlineblock-1755114765380',
      'title': 'Título do Componente',
      'description': 'Descrição do componente'
},
  }
];

// ========== STATISTICS ==========
// Total Components: 163
// Categories: 15
// Generated: 8/13/2025, 7:52:45 PM