import FixedIntroImage from '@/components/ui/FixedIntroImage';
import { trackButtonClick } from '@/utils/analytics';
import { LucideIcon, ShoppingCart } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
}

interface Pricing {
  installments: {
    quantity: number;
    amount: string;
  };
  fullPrice: string;
  discount: string;
  savings: string;
  limitedOffer: boolean;
}

interface OfferProductShowcaseProps {
  title: string;
  subtitle: string;
  products: Product[];
  pricing: Pricing;
  finalCtaText: string;
  finalCtaIcon: string;
  finalCtaUrl: string;
}

// Mapeamento de ícones
const iconMap: Record<string, LucideIcon> = {
  ShoppingCart,
};

/**
 * 🎯 COMPONENTE: OfferProductShowcase
 *
 * Showcase dos produtos com pricing e CTA final
 * Layout em grid responsivo para os produtos
 */
export const OfferProductShowcase: React.FC<OfferProductShowcaseProps> = ({
  title,
  subtitle,
  products,
  pricing,
  finalCtaText,
  finalCtaIcon,
  finalCtaUrl,
}) => {
  const FinalCtaIcon = iconMap[finalCtaIcon] || ShoppingCart;

  const handleFinalCtaClick = () => {
    trackButtonClick('final_cta', finalCtaText, 'offer_product_showcase');
    window.open(finalCtaUrl, '_blank');
  };

  return (
    <section className="section-gap">
      <div className="container-main">
        <div className="card-clean">
          {/* Título da seção */}
          <div className="text-center mb-8">
            <h2
              className="text-hierarchy-2 text-[var(--text-dark)] mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {title}
            </h2>
            <p className="text-body text-[var(--text-medium)]">{subtitle}</p>
          </div>

          {/* Grid de produtos */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {products.map(product => (
              <div key={product.id} className="text-center">
                <div className="aspect-[4/5] bg-white rounded-lg mb-3 flex items-center justify-center overflow-hidden shadow-sm border border-gray-100">
                  <FixedIntroImage
                    src={product.imageUrl}
                    alt={product.imageAlt}
                    width={product.imageWidth}
                    height={product.imageHeight}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-hierarchy-3 text-[var(--text-dark)] mb-2">{product.title}</h3>
                <p className="text-sm text-[var(--text-medium)]">{product.description}</p>
              </div>
            ))}
          </div>

          {/* Seção de preço */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-8 text-white text-center mb-8">
            {pricing.limitedOffer && (
              <p className="text-sm opacity-90 mb-2">Oferta por tempo limitado</p>
            )}
            <div className="mb-4">
              <span className="text-sm">{pricing.installments.quantity}x de</span>
              <span className="text-4xl font-bold mx-2">R$ {pricing.installments.amount}</span>
            </div>
            <p className="text-lg">
              ou à vista <strong>R$ {pricing.fullPrice}</strong>
            </p>
            <p className="text-sm mt-2 opacity-75">
              {pricing.discount} - Economia de {pricing.savings}
            </p>
          </div>

          {/* CTA Final */}
          <div className="text-center">
            <button onClick={handleFinalCtaClick} className="btn-primary-clean">
              <FinalCtaIcon size={20} />
              {finalCtaText}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferProductShowcase;
