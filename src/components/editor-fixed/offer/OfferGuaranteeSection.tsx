import FixedIntroImage from '@/components/ui/FixedIntroImage';

interface OfferGuaranteeSectionProps {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  layout: 'centered' | 'side-by-side';
}

/**
 * 🎯 COMPONENTE: OfferGuaranteeSection
 *
 * Seção de garantia com imagem e texto
 * Layout centralizado ou side-by-side
 */
export const OfferGuaranteeSection: React.FC<OfferGuaranteeSectionProps> = ({
  title,
  description,
  imageUrl,
  imageAlt,
  imageWidth,
  imageHeight,
  layout = 'centered',
}) => {
  // Renderizar texto com markdown básico (negrito)
  const renderText = (text: string) => {
    return text.split('**').map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index}>{part}</strong>;
      }
      return part;
    });
  };

  if (layout === 'centered') {
    return (
      <section className="section-gap">
        <div className="container-main">
          <div className="card-clean text-center">
            <FixedIntroImage
              src={imageUrl}
              alt={imageAlt}
              width={imageWidth}
              height={imageHeight}
              className="mx-auto mb-6"
            />
            <h2
              className="text-hierarchy-2 text-[var(--text-dark)] mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {title}
            </h2>
            <p className="text-body text-[var(--text-medium)] max-w-2xl mx-auto">
              {renderText(description)}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-gap">
      <div className="container-main">
        <div className="card-clean">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <FixedIntroImage
                src={imageUrl}
                alt={imageAlt}
                width={imageWidth}
                height={imageHeight}
                className="w-full h-auto rounded-lg"
              />
            </div>
            <div>
              <h2
                className="text-hierarchy-2 text-[var(--text-dark)] mb-4"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {title}
              </h2>
              <p className="text-body text-[var(--text-medium)]">{renderText(description)}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferGuaranteeSection;
