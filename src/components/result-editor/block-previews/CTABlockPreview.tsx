import { Button } from '@/components/ui/button';

interface CTABlockPreviewProps {
  content: {
    title?: string;
    buttonText?: string;
    url?: string;
    style?: any;
  };
}

const CTABlockPreview: React.FC<CTABlockPreviewProps> = ({ content }) => {
  return (
    <div className="text-center space-y-4" style={content.style}>
      {content.title && <h3 className="text-xl font-semibold text-[#aa6b5d]">{content.title}</h3>}

      <Button className="bg-[#aa6b5d] hover:bg-[#8f5a4c] text-white px-8 py-6 text-lg">
        {content.buttonText || 'Clique Aqui'}
      </Button>
    </div>
  );
};

export default CTABlockPreview;
