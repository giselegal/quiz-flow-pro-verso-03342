interface ProductsBlockPreviewProps {
  content: {
    title?: string;
    images?: Array<{ url: string; alt: string }>;
    style?: any;
  };
}

const ProductsBlockPreview: React.FC<ProductsBlockPreviewProps> = ({ content }) => {
  const defaultImages = [
    {
      url: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911682/C%C3%B3pia_de_MOCKUPS_14_oxegnd.webp',
      alt: 'Guia de Estilo - 3 Revistas',
    },
    {
      url: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911682/C%C3%B3pia_de_MOCKUPS_13_znzbks.webp',
      alt: 'Todos os produtos e bônus',
    },
  ];

  const images = content.images || defaultImages;

  return (
    <div style={content.style}>
      <h3 className="text-xl font-bold mb-6 text-[#aa6b5d] text-center">
        {content.title || 'O que você vai receber:'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((image, index) => (
          <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
            <img src={image.url} alt={image.alt} className="w-full h-auto object-cover" />
            <div className="p-4 text-center">
              <p className="text-[#1A1818]/80">{image.alt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsBlockPreview;
