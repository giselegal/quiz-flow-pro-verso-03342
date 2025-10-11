import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';

interface BenefitItem {
  title: string;
  description: string;
}

interface BenefitListProps {
  items?: BenefitItem[];
}

const defaultBenefits = [
  {
    title: 'Peças que revelam sua essência',
    description:
      'Descobrir as roupas e acessórios que comunicam quem você realmente é, valorizando seu corpo e sua personalidade.',
  },
  {
    title: 'Compras com propósito',
    description:
      'Parar de acumular peças que não combinam e investir no que faz sentido para o seu momento.',
  },
  {
    title: 'Versatilidade sem esforço',
    description: 'Criar combinações que expressam quem você é com menos esforço e mais impacto.',
  },
  {
    title: 'Autoconfiança visível',
    description: 'Sentir segurança no que veste porque cada escolha tem harmonia com quem você é.',
  },
];

const BenefitList: React.FC<BenefitListProps> = ({ items }) => {
  const benefitsToShow = items || defaultBenefits;

  return (
    <Card className="p-8 bg-[#fffaf7] border border-[#B89B7A]/20 shadow-md rounded-xl">
      <h3 className="text-xl font-playfair text-[#432818] mb-6 relative inline-block">
        O que você vai <span className="text-[#aa6b5d] font-medium">transformar</span> com esse
        material:
        <div className="h-0.5 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d]/70 mt-1" />
      </h3>

      <div className="space-y-5">
        {benefitsToShow.map((benefit, index) => (
          <div
            key={index}
            className="flex gap-4 group hover:bg-[#fffcfa] p-2 rounded-lg transition-colors duration-300"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#B89B7A]/30 to-[#aa6b5d]/30 flex items-center justify-center group-hover:shadow-lg transition-shadow duration-300">
              <Check className="w-5 h-5 text-[#aa6b5d] group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div>
              <h4 className="font-medium text-[#432818] mb-1 group-hover:text-[#aa6b5d] transition-colors duration-300">
                {benefit.title}
              </h4>
              <p className="text-[#6b605a] text-sm leading-relaxed">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default BenefitList;
