import FixedIntroImage from '@/components/ui/FixedIntroImage';

interface OfferProblemSectionProps {
  title: string;
  problems: string[];
  highlightText: string;
  imageUrl: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  layout: 'side-by-side' | 'centered';
}

/**
 * 🎯 COMPONENTE: OfferProblemSection
 *
 * Seção que apresenta os problemas que o produto resolve
 * Layout side-by-side com texto e imagem
 */
export const OfferProblemSection: React.FC<OfferProblemSectionProps> = ({
  title,
  problems,
  highlightText,
  imageUrl,
  imageAlt,
  imageWidth,
  imageHeight,
  layout = 'side-by-side',
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

  return (
    <section className="section-gap">
      <div className="container-main">
        <div className="card-clean">
          <div
            className={
              layout === 'side-by-side' ? 'grid md:grid-cols-2 gap-8 items-center' : 'text-center'
            }
          >
            <div>
              <h2
                className="text-hierarchy-2 text-[var(--text-dark)] mb-6"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {title}
              </h2>
              <div className="space-y-4 text-body text-[var(--text-medium)]">
                {problems.map((problem, index) => (
                  <p key={index}>{renderText(problem)}</p>
                ))}
              </div>
              <div className="bg-[#B89B7A]/10 p-4 rounded-lg border-l-4 border-orange-400 mt-6">
                <p className="text-[var(--text-dark)] font-semibold">{renderText(highlightText)}</p>
              </div>
            </div>
            <div>
              <FixedIntroImage
                src={imageUrl}
                alt={imageAlt}
                width={imageWidth}
                height={imageHeight}
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferProblemSection;
