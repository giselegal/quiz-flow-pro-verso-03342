import { PageConfig } from '../services/pageConfigService';

export const defaultResultPageConfig: PageConfig = {
  pageId: 'result-page',
  pageName: 'Página de Resultado',
  blocks: [
    {
      id: 'result-header-inline',
      type: 'result-header-inline',
      order: 1,
      content: '',
      settings: {
        className: 'result-header-section',
        showProgress: true,
        progressValue: 100,
      },
      styles: {
        backgroundColor: '#fffaf7',
        padding: '2rem 1rem',
      },
      componentType: 'ResultHeader',
      props: {
        title: 'Seu Resultado Personalizado',
        subtitle: 'Descubra seu estilo único',
        showProgress: true,
        progressValue: 100,
      },
    },
    {
      id: 'before-after-component-real',
      type: 'before-after-component-real',
      order: 2,
      content: '',
      settings: {
        className: 'before-after-section',
      },
      styles: {
        padding: '2rem 1rem',
      },
      componentType: 'BeforeAfterTransformation',
      props: {
        title: 'Sua Transformação',
        beforeText: 'Antes',
        afterText: 'Depois',
      },
    },
    {
      id: 'motivation-component-real',
      type: 'motivation-component-real',
      order: 3,
      content: '',
      settings: {
        className: 'motivation-section',
      },
      styles: {
        padding: '2rem 1rem',
      },
      componentType: 'MotivationSection',
      props: {
        title: 'Sua Jornada de Estilo',
        content: 'Descubra como aplicar seu estilo único no dia a dia',
      },
    },
    {
      id: 'bonus-component-real',
      type: 'bonus-component-real',
      order: 4,
      content: '',
      settings: {
        className: 'bonus-section',
      },
      styles: {
        padding: '2rem 1rem',
      },
      componentType: 'BonusSection',
      props: {
        title: 'Bônus Exclusivos',
        content: 'Materiais complementares para sua transformação',
      },
    },
    {
      id: 'testimonials-component-real',
      type: 'testimonials-component-real',
      order: 5,
      content: '',
      settings: {
        className: 'testimonials-section',
      },
      styles: {
        padding: '2rem 1rem',
      },
      componentType: 'Testimonials',
      props: {
        title: 'Depoimentos',
        testimonials: [],
      },
    },
    {
      id: 'cta-section-inline',
      type: 'cta-section-inline',
      order: 6,
      content: '',
      settings: {
        className: 'cta-section',
      },
      styles: {
        padding: '2rem 1rem',
        textAlign: 'center',
      },
      componentType: 'CTASection',
      props: {
        title: 'Descubra Como Aplicar Seu Estilo na Prática',
        buttonText: 'Quero meu Guia de Estilo Agora',
        buttonStyle: 'primary',
      },
    },
    {
      id: 'guarantee-component-real',
      type: 'guarantee-component-real',
      order: 7,
      content: '',
      settings: {
        className: 'guarantee-section',
      },
      styles: {
        padding: '2rem 1rem',
      },
      componentType: 'GuaranteeSection',
      props: {
        title: 'Garantia de Satisfação',
        content: 'Sua satisfação é nossa prioridade',
      },
    },
    {
      id: 'mentor-component-real',
      type: 'mentor-component-real',
      order: 8,
      content: '',
      settings: {
        className: 'mentor-section',
      },
      styles: {
        padding: '2rem 1rem',
      },
      componentType: 'MentorSection',
      props: {
        title: 'Sobre a Mentora',
        content: 'Conheça quem vai te guiar nesta jornada',
      },
    },
    {
      id: 'value-stack-inline',
      type: 'value-stack-inline',
      order: 9,
      content: '',
      settings: {
        className: 'value-stack-section',
      },
      styles: {
        padding: '2rem 1rem',
        textAlign: 'center',
      },
      componentType: 'ValueStack',
      props: {
        title: 'Vista-se de Você — na Prática',
        subtitle: 'O Guia de Estilo e Imagem + Bônus Exclusivos',
        price: 'R$ 39,00',
        originalPrice: 'R$ 175,00',
        buttonText: 'Garantir Meu Guia + Bônus Especiais',
      },
    },
  ],
  styles: {
    backgroundColor: '#fffaf7',
    textColor: '#432818',
    fontFamily: 'Inter, sans-serif',
    customCSS: `
      .result-page {
        min-height: 100vh;
        background: linear-gradient(135deg, #fffaf7 0%, #f9f4ef 100%);
      }
      
      .elegant-divider {
        width: 60px;
        height: 2px;
        background: linear-gradient(to right, #B89B7A, #aa6b5d);
        margin: 1rem auto;
      }
      
      .gold-text {
        background: linear-gradient(135deg, #B89B7A 0%, #aa6b5d 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .glass-panel {
        backdrop-filter: blur(10px);
        background: rgba(255, 255, 255, 0.8);
        border: 1px solid rgba(184, 155, 122, 0.2);
      }
      
      .card-elegant {
        box-shadow: 0 8px 32px rgba(184, 155, 122, 0.1);
        border: 1px solid rgba(184, 155, 122, 0.1);
      }
      
      .btn-cta-green {
        background: linear-gradient(to right, #4CAF50, #45a049);
        box-shadow: 0 4px 14px rgba(76, 175, 80, 0.4);
        transition: all 0.3s ease;
      }
      
      .btn-cta-green:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(76, 175, 80, 0.5);
      }
      
      .btn-3d {
        transform: perspective(1px) translateZ(0);
        transition: all 0.3s ease;
      }
      
      .btn-3d:hover {
        transform: translateY(-3px);
      }
    `,
  },
  metadata: {
    title: 'Seu Resultado - Quiz de Estilo',
    description: 'Descubra seu estilo único e como aplicá-lo no dia a dia',
    keywords: ['estilo', 'moda', 'personalidade', 'quiz'],
    ogImage: '/og-result-page.jpg',
  },
  settings: {
    showProgress: true,
    progressValue: 100,
    abTestVariant: 'A',
    customScripts: [],
  },
  lastModified: new Date().toISOString(),
  version: 1,
};

export const getDefaultPageConfig = (pageId: string): PageConfig => {
  switch (pageId) {
    case 'result-page':
      return defaultResultPageConfig;
    default:
      return {
        pageId,
        pageName: 'Página',
        blocks: [],
        styles: {
          backgroundColor: '#ffffff',
          textColor: '#000000',
          fontFamily: 'Arial, sans-serif',
        },
        metadata: {
          title: '',
          description: '',
          keywords: [],
          ogImage: '',
        },
        settings: {
          showProgress: false,
          progressValue: 0,
          abTestVariant: 'A',
          customScripts: [],
        },
        lastModified: new Date().toISOString(),
        version: 1,
      };
  }
};
