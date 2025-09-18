import { Button } from '@/components/ui/button';

interface PricingBlockPreviewProps {
  content: {
    regularPrice?: string;
    salePrice?: string;
    buttonText?: string;
    ctaUrl?: string;
    urgencyText?: string;
    style?: any;
  };
}

const PricingBlockPreview: React.FC<PricingBlockPreviewProps> = ({ content }) => {
  return (
    <div className="text-center space-y-6 p-6 bg-[#fff7f3] rounded-lg" style={content.style}>
      <div className="space-y-2">
        {content.regularPrice && (
          <p className="text-[#666] line-through">De R$ {content.regularPrice}</p>
        )}
        {content.salePrice && (
          <p className="text-2xl font-bold text-[#aa6b5d]">Por R$ {content.salePrice}</p>
        )}
      </div>

      <Button className="w-full bg-[#aa6b5d] hover:bg-[#8f5a4c] text-white p-6 text-lg">
        {content.buttonText || 'Comprar Agora'}
      </Button>

      {content.urgencyText && <p className="text-sm text-[#aa6b5d]">{content.urgencyText}</p>}
    </div>
  );
};

export default PricingBlockPreview;
