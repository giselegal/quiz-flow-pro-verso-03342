
import React from 'react';
import { Block } from '@/types/editor';

interface BlockRendererProps {
  block: Block;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ block }) => {
  const content = block.content || {};
  
  const renderBlockContent = () => {
    switch (block.type) {
      case 'header':
        return (
          <header className="text-center py-8">
            <h1 className="text-3xl font-bold text-[#432818] mb-2">
              {content.title || 'Título'}
            </h1>
            <p className="text-[#8F7A6A]">
              {content.subtitle || 'Subtítulo'}
            </p>
          </header>
        );
        
      case 'hero':
        return (
          <section className="text-center py-12 bg-gradient-to-b from-[#FAF9F7] to-white">
            <h2 className="text-4xl font-bold text-[#432818] mb-4">
              {content.title || 'Título Hero'}
            </h2>
            <p className="text-xl text-[#8F7A6A] mb-6">
              {content.subtitle || 'Subtítulo Hero'}
            </p>
          </section>
        );
        
      case 'text':
        return (
          <div className="prose max-w-none">
            <p className="text-[#432818]">
              {content.text || 'Texto do bloco'}
            </p>
          </div>
        );
        
      case 'image':
        return (
          <div className="text-center">
            <img
              src={content.imageUrl || 'https://via.placeholder.com/400x300'}
              alt={content.imageAlt || 'Imagem'}
              className="mx-auto rounded-lg shadow-md"
              style={{
                width: content.width || 'auto',
                height: content.height || 'auto'
              }}
            />
          </div>
        );
        
      case 'benefitsList':
        return (
          <div className="bg-white rounded-lg p-6 border border-[#B89B7A]/20">
            <h3 className="text-xl font-semibold text-[#432818] mb-4">
              {content.title || 'Benefícios'}
            </h3>
            <ul className="space-y-2">
              {(content.items || ['Benefício 1', 'Benefício 2']).map((item: string, index: number) => (
                <li key={index} className="flex items-center text-[#432818]">
                  <span className="mr-2 text-[#B89B7A]">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        );
        
      case 'pricing':
        return (
          <div className="bg-gradient-to-r from-[#B89B7A] to-[#A38A69] text-white rounded-lg p-6 text-center">
            <div className="mb-4">
              <span className="text-sm line-through opacity-75">
                R$ {content.regularPrice || '97,00'}
              </span>
              <div className="text-3xl font-bold">
                R$ {content.salePrice || '37,00'}
              </div>
            </div>
            <button className="bg-white text-[#432818] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              {content.buttonText || 'Comprar Agora'}
            </button>
            <p className="text-sm mt-2 opacity-90">
              {content.urgencyText || 'Oferta por tempo limitado!'}
            </p>
          </div>
        );
        
      case 'testimonial':
        return (
          <div className="bg-white rounded-lg p-6 border border-[#B89B7A]/20">
            <h3 className="text-lg font-semibold text-[#432818] mb-3">
              {content.title || 'Depoimento'}
            </h3>
            <p className="text-[#8F7A6A] mb-4">
              "{content.text || 'Depoimento do cliente...'}"
            </p>
            {content.image && (
              <img
                src={content.image}
                alt="Cliente"
                className="w-12 h-12 rounded-full mx-auto"
              />
            )}
          </div>
        );
        
      case 'cta':
        return (
          <div className="text-center py-8">
            <h3 className="text-2xl font-bold text-[#432818] mb-4">
              {content.title || 'Chamada para Ação'}
            </h3>
            <button className="bg-[#B89B7A] hover:bg-[#A38A69] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
              {content.buttonText || 'Clique Aqui'}
            </button>
          </div>
        );
        
      case 'styleResult':
        return (
          <div className="bg-white rounded-lg p-6 border border-[#B89B7A]/20">
            <h3 className="text-xl font-semibold text-[#432818] mb-2">
              Seu estilo é: {content.styleCategory || 'Natural'}
            </h3>
            <p className="text-[#8F7A6A]">
              {content.description || 'Descrição do seu estilo pessoal...'}
            </p>
            {content.customImage && (
              <img
                src={content.customImage}
                alt="Estilo"
                className="mt-4 w-full rounded-lg"
              />
            )}
          </div>
        );
        
      case 'secondaryStylesTitle':
        return (
          <h3 className="text-lg font-semibold text-[#432818] mb-4">
            {content.title || 'Seus outros estilos'}
          </h3>
        );
        
      case 'offerHero':
        return (
          <section className="bg-gradient-to-b from-[#FAF9F7] to-white py-12 text-center">
            <h2 className="text-4xl font-bold text-[#432818] mb-4">
              {content.title || 'Oferta Especial'}
            </h2>
            <p className="text-xl text-[#8F7A6A] mb-6">
              {content.subtitle || 'Descubra seu estilo completo'}
            </p>
            {content.heroImage && (
              <img
                src={content.heroImage}
                alt="Oferta"
                className="mx-auto rounded-lg shadow-lg mb-4"
                style={{ maxWidth: '400px' }}
              />
            )}
          </section>
        );
        
      case 'carousel':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#432818]">
              {content.title || 'Galeria'}
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {(content.images || []).map((img: any, index: number) => (
                <img
                  key={index}
                  src={img.url || 'https://via.placeholder.com/200x200'}
                  alt={img.alt || `Imagem ${index + 1}`}
                  className="flex-shrink-0 w-48 h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        );
        
      case 'testimonialsSection':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[#432818] text-center">
              {content.title || 'Depoimentos'}
            </h3>
            {content.testimonialsImage && (
              <img
                src={content.testimonialsImage}
                alt="Depoimentos"
                className="w-full rounded-lg"
              />
            )}
          </div>
        );
        
      case 'spacer':
        return (
          <div style={{ height: content.height || '40px' }} />
        );
        
      default:
        return (
          <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center text-gray-500">
            Bloco não reconhecido: {block.type}
          </div>
        );
    }
  };

  return (
    <div className="mb-6">
      {renderBlockContent()}
    </div>
  );
};

export default BlockRenderer;
