import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';

interface PricingSectionProps {
  regularPrice: number;
  salePrice: number;
  installments?: {
    number: number;
    value: number;
  };
  ctaText: string;
  ctaUrl: string;
  guaranteeText?: string;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  regularPrice,
  salePrice,
  installments,
  ctaText,
  ctaUrl,
  guaranteeText,
}) => {
  return (
    <section className="py-12 px-4 bg-white">
      <div className="container max-w-3xl mx-auto text-center">
        <div className="bg-[#FAF9F7] p-8 rounded-lg shadow-sm">
          <div className="space-y-4 mb-6">
            <p className="text-[#8F7A6A] line-through">De R$ {regularPrice.toFixed(2)}</p>
            <h3 className="text-4xl font-bold text-[#432818]">Por R$ {salePrice.toFixed(2)}</h3>
            {installments && (
              <p className="text-[#8F7A6A]">
                ou {installments.number}x de R$ {installments.value.toFixed(2)}
              </p>
            )}
          </div>

          <Button
            size="lg"
            className="w-full max-w-md bg-[#B89B7A] hover:bg-[#8F7A6A] text-white text-lg py-6"
            onClick={() => (window.location.href = ctaUrl)}
          >
            {ctaText}
          </Button>

          {guaranteeText && (
            <div className="mt-6 flex items-center justify-center gap-2 text-[#8F7A6A]">
              <ShieldCheck className="h-5 w-5" />
              <p>{guaranteeText}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
