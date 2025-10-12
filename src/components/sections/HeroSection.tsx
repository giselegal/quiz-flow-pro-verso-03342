import { Button } from '@/components/ui/button';
import { HeroImage } from '@/components/ui/EnhancedOptimizedImage';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  image?: string;
  cta: {
    text: string;
    url: string;
  };
}

export const HeroSection: React.FC<HeroSectionProps> = ({ title, subtitle, image, cta }) => {
  return (
    <section className="py-12 px-4 bg-gradient-to-b from-[#FAF9F7] to-white">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-playfair text-[#432818]">{title}</h1>
            <p className="text-xl text-[#8F7A6A]">{subtitle}</p>
            <Button
              size="lg"
              className="bg-[#B89B7A] hover:bg-[#8F7A6A] text-white"
              onClick={() => (window.location.href = cta.url)}
            >
              {cta.text}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          {image && (
            <div className="relative">
              <HeroImage
                src={image}
                alt="Hero Image"
                width={600}
                height={400}
                aspectRatio={3 / 2}
                className="rounded-lg shadow-lg w-full h-auto object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
