import { EditableContent } from '@/types/editor';

export const getDefaultContentForType = (type: string): EditableContent => {
  switch (type) {
    case 'header':
      return {
        title: 'Novo Cabeçalho',
        subtitle: 'Subtítulo opcional',
        logo: '',
        logoAlt: 'Logo',
        logoWidth: 'auto',
        logoHeight: 'auto',
        style: {
          textAlign: 'center',
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#432818',
        },
      };
    case 'headline':
      return {
        title: 'Título do Bloco',
        subtitle: 'Um subtítulo opcional para seu bloco',
        style: {
          textAlign: 'center',
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#432818',
        },
      };
    case 'text':
      return {
        text: 'Este é um bloco de texto que você pode editar. Personalize o conteúdo conforme necessário.',
        style: {
          fontSize: '1rem',
          lineHeight: '1.5',
          color: '#3A3A3A',
        },
      };
    case 'image':
      return {
        imageUrl: 'https://placehold.co/600x400/png',
        imageAlt: 'Imagem de exemplo',
        caption: '',
        style: {
          width: '100%',
          borderRadius: '8px',
        },
      };
    case 'button':
      return {
        buttonText: 'Clique Aqui',
        buttonUrl: '#',
        action: 'link',
        style: {
          backgroundColor: '#B89B7A',
          color: '#FFFFFF',
          padding: '0.75rem 2rem',
          borderRadius: '8px',
          textAlign: 'center',
        },
      };
    case 'style-result':
      return {
        title: 'Seu Estilo Principal',
        description: 'Descrição personalizada do seu estilo predominante.',
        customImage: '',
        style: {
          backgroundColor: '#FAF9F7',
          padding: '1.5rem',
          borderRadius: '8px',
        },
      };
    case 'secondary-styles':
      return {
        title: 'Seus Estilos Secundários',
        description:
          'Estes estilos complementam seu estilo principal e ajudam a criar seu visual único.',
        style: {
          backgroundColor: '#FFFFFF',
          padding: '1.5rem',
          borderRadius: '8px',
        },
      };
    case 'benefits':
      return {
        title: 'Benefícios',
        items: [
          {
            id: '1',
            question: 'Pergunta 1',
            answer: 'Descrição do primeiro benefício',
          },
          {
            id: '2',
            question: 'Pergunta 2',
            answer: 'Descrição do segundo benefício',
          },
          {
            id: '3',
            question: 'Pergunta 3',
            answer: 'Descrição do terceiro benefício',
          },
        ],
        style: {
          padding: '1rem',
        },
      };
    case 'cta':
      return {
        title: 'Aproveite Essa Oportunidade',
        buttonText: 'Comprar Agora',
        buttonUrl: '#comprar',
        style: {
          backgroundColor: '#B89B7A',
          color: '#FFFFFF',
          textAlign: 'center',
          padding: '2rem',
          borderRadius: '8px',
        },
      };
    case 'spacer':
      return {
        height: '2rem',
      };
    default:
      return {
        title: 'Novo Bloco',
        text: 'Conteúdo do bloco',
        style: {},
      };
  }
};
