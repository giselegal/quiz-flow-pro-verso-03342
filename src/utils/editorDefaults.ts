
import { EditableContent, BlockType } from '@/types/editor';

export const getDefaultContentForType = (type: BlockType): EditableContent => {
  switch (type) {
    case 'header':
    case 'headline':
    case 'heading':
      return {
        title: 'Título Principal',
        subtitle: 'Subtítulo opcional',
        alignment: 'left',
        textColor: '#432818'
      };
    
    case 'text':
    case 'paragraph':
      return {
        text: 'Digite seu texto aqui...',
        alignment: 'left'
      };
    
    case 'image':
      return {
        imageUrl: '',
        imageAlt: 'Imagem',
        caption: ''
      };
    
    case 'button':
    case 'cta':
      return {
        buttonText: 'Clique aqui',
        buttonUrl: '#',
        style: {
          backgroundColor: '#B89B7A',
          color: '#FFFFFF',
          padding: '12px 24px',
          borderRadius: '8px'
        }
      };
    
    case 'spacer':
      return {
        height: '40px'
      };
    
    case 'benefits':
      return {
        title: 'Benefícios',
        items: [
          'Benefício 1',
          'Benefício 2',
          'Benefício 3'
        ]
      };
    
    case 'pricing':
      return {
        regularPrice: '199',
        salePrice: '97',
        buttonText: 'Comprar agora',
        buttonUrl: '#'
      };
    
    case 'testimonials':
      return {
        testimonials: [
          {
            id: '1',
            name: 'Cliente satisfeito',
            text: 'Excelente produto!',
            image: ''
          }
        ]
      };
    
    case 'quiz-question':
      return {
        question: 'Qual é a sua pergunta?',
        options: [
          { id: '1', text: 'Opção 1' },
          { id: '2', text: 'Opção 2' }
        ],
        multipleSelection: false,
        showImages: false,
        optionLayout: 'vertical'
      };
    
    default:
      return {
        title: 'Novo Bloco',
        text: 'Conteúdo do bloco'
      };
  }
};
