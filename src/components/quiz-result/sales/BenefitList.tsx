import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

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

  // Animações para os itens da lista
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <Card className="p-8 bg-[#fffaf7] border border-[#B89B7A]/20 shadow-md rounded-xl">
      <motion.h3
        className="text-xl font-playfair text-[#432818] mb-6 relative inline-block"
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        O que você vai <span className="text-[#aa6b5d] font-medium">transformar</span> com esse
        material:
        <motion.div
          className="h-0.5 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d]/70 mt-1"
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />
      </motion.h3>

      <motion.div
        className="space-y-5"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {benefitsToShow.map((benefit, index) => (
          <motion.div
            key={index}
            className="flex gap-4 group hover:bg-[#fffcfa] p-2 rounded-lg transition-colors duration-300"
            variants={itemVariants}
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
          </motion.div>
        ))}
      </motion.div>
    </Card>
  );
};

export default BenefitList;
