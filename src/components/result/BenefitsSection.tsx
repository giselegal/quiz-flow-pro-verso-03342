import { Check } from 'lucide-react';

interface Benefit {
  icon?: React.ReactNode;
  text: string;
}

interface BenefitsSectionProps {
  title: string;
  benefits: Benefit[];
}

export const BenefitsSection: React.FC<BenefitsSectionProps> = ({ title, benefits }) => {
  return (
    <section className="py-12 px-4 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-playfair text-[#432818] text-center mb-8">{title}</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-[#FAF9F7]">
              <div className="mt-1">
                {benefit.icon || <Check className="h-5 w-5 text-[#B89B7A]" />}
              </div>
              <p className="text-[#432818]">{benefit.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
