import { ResultPageConfig } from '@/types/resultPageConfig';

export const createDefaultConfig = (styleType: string): ResultPageConfig => {
  return {
    styleType: styleType,
    header: {
      visible: true,
      content: {
        title: 'Seu Resultado de Estilo Pessoal',
        logo: '',
      },
      style: {
        backgroundColor: '#FAF9F7',
        padding: '1rem',
        textAlign: 'center',
      },
    },
    mainContent: {
      visible: true,
      content: {
        introText: `Parabéns por descobrir seu estilo ${styleType}! Este estilo reflete sua personalidade única e oferece uma base para criar looks autênticos que expressam quem você realmente é.`,
        benefits: [
          'Entenda como escolher roupas que valorizam sua personalidade',
          'Aprenda a montar looks que expressam quem você é',
          'Elimine as compras por impulso e crie um guarda-roupa funcional',
        ],
      },
      style: {
        padding: '2rem 1rem',
        backgroundColor: '#FFFFFF',
      },
    },
    secondaryStyles: {
      visible: true,
      content: {
        title: 'Seus Estilos Complementares',
        description:
          'Estes estilos secundários ajudam a complementar seu estilo predominante, criando uma expressão visual única e personalizada.',
      },
      style: {
        padding: '2rem 1rem',
        backgroundColor: '#FAF9F7',
      },
    },
    offer: {
      hero: {
        visible: true,
        content: {
          title: 'Transforme seu Guarda-Roupa',
          subtitle: 'Aprenda a vestir-se de acordo com sua personalidade',
          description:
            'Com o Guia Completo de Estilo, você vai descobrir como criar looks incríveis e autênticos todos os dias, sem gastar fortunas.',
          heroImage:
            'https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp',
        },
        style: {
          padding: '2rem 1rem',
          backgroundColor: '#FFFFFF',
        },
      },
      benefits: {
        visible: true,
        content: {
          title: 'O que você vai aprender',
          items: [
            {
              title: 'Autoconhecimento',
              description: 'Entenda profundamente seu estilo e personalidade',
            },
            {
              title: 'Técnicas práticas',
              description: 'Aprenda métodos simples para criar looks incríveis',
            },
            {
              title: 'Economia',
              description: 'Elimine compras por impulso e desperdício de dinheiro',
            },
          ],
        },
        style: {
          padding: '2rem 1rem',
          backgroundColor: '#FAF9F7',
        },
      },
      products: {
        visible: true,
        content: {
          title: 'O que está incluído',
          items: [
            {
              title: 'Guia Digital',
              description: 'Manual completo com todas as técnicas e exemplos',
            },
            {
              title: 'Vídeos Tutoriais',
              description: 'Aulas em vídeo para aplicação prática',
            },
            {
              title: 'Planilhas',
              description: 'Ferramentas para organizar seu guarda-roupa',
            },
          ],
        },
        style: {
          padding: '2rem 1rem',
          backgroundColor: '#FFFFFF',
        },
      },
      pricing: {
        visible: true,
        content: {
          title: 'Invista em seu estilo pessoal',
          price: 'R$ 97,00',
          regularPrice: 'R$ 197,00',
          installments: 'ou 10x de R$ 9,70',
          ctaText: 'Quero Transformar Meu Estilo',
          ctaUrl: '#comprar-agora',
          urgencyText: 'Promoção por tempo limitado',
        },
        style: {
          padding: '2rem 1rem',
          backgroundColor: '#FAF9F7',
          textAlign: 'center',
        },
      },
      testimonials: {
        visible: true,
        content: {
          title: 'O que dizem nossos clientes',
          testimonials: [
            {
              name: 'Maria Silva',
              role: 'Professora',
              text: 'O guia mudou completamente minha relação com as roupas. Agora sei exatamente o que combina comigo e me sinto muito mais confiante.',
            },
            {
              name: 'Ana Santos',
              role: 'Empresária',
              text: 'Economizei tanto dinheiro depois de entender meu estilo! Não compro mais roupas que vão ficar paradas no armário.',
            },
          ],
        },
        style: {
          padding: '2rem 1rem',
          backgroundColor: '#FFFFFF',
        },
      },
      guarantee: {
        visible: true,
        content: {
          title: 'Garantia de 7 dias',
          description:
            'Se você não ficar satisfeito com o material, devolvemos seu dinheiro integralmente em até 7 dias após a compra.',
          image: 'https://placehold.co/200x200/png',
        },
        style: {
          padding: '2rem 1rem',
          backgroundColor: '#FAF9F7',
          textAlign: 'center',
        },
      },
    },
    mentor: {
      visible: true,
      content: {
        title: 'Conheça sua mentora',
        name: 'Gisele Galvão',
        image:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744921536/Sem_nome_1080_x_1000_px_z0chuv.webp',
        bio: [
          'Consultora de imagem há mais de 10 anos',
          'Especialista em estilo pessoal e autoconhecimento',
          'Já ajudou mais de 1.000 pessoas a transformarem seu visual',
        ],
      },
      style: {
        padding: '2rem 1rem',
        backgroundColor: '#FFFFFF',
      },
    },
    globalStyles: {
      primaryColor: '#B89B7A',
      secondaryColor: '#432818',
      textColor: '#3A3A3A',
      backgroundColor: '#FAF9F7',
      fontFamily: 'Playfair Display, serif',
    },
    blocks: [],
  };
};
