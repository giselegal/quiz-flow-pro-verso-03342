
export const getDefaultContentForType = (type: string) => {
  switch (type) {
    case 'header':
      return {
        title: 'Título do Cabeçalho',
        subtitle: 'Subtítulo opcional',
        textColor: '#432818',
        backgroundColor: '#faf8f5'
      };
    case 'text':
      return {
        text: 'Adicione seu texto aqui...',
        textColor: '#432818',
        fontSize: '16px'
      };
    case 'image':
      return {
        src: 'https://via.placeholder.com/600x400',
        alt: 'Imagem de exemplo',
        width: '100%',
        height: 'auto'
      };
    case 'button':
      return {
        buttonText: 'Clique aqui',
        buttonUrl: '#',
        backgroundColor: '#B89B7A',
        textColor: '#ffffff'
      };
    case 'spacer':
      return {
        height: '50px'
      };
    default:
      return {};
  }
};
