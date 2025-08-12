import { Card } from '@/components/ui/card';
import { QuoteIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface TestimonialItem {
  name: string;
  role?: string;
  text: string;
}

interface TestimonialsProps {
  items?: TestimonialItem[];
}

const Testimonials: React.FC<TestimonialsProps> = ({
  items = [
    {
      name: 'Mariangela',
      role: 'Engenheira',
      text: 'Antes, a roupa me vestia. Hoje, eu me visto com intenção. Essa jornada me reconectou com a mulher que sempre fui.',
    },
    {
      name: 'Patrícia Paranhos',
      role: 'Advogada',
      text: 'Aprendi a reconhecer meu valor e refletir isso na forma como me apresento. As pessoas começaram a me enxergar diferente — porque eu estava diferente.',
    },
    {
      name: 'Sônia Spier',
      role: 'Terapeuta',
      text: 'Com a Gisele, entendi o poder da linguagem visual. Hoje eu escolho minhas roupas com consciência, propósito e leveza.',
    },
  ],
}) => {
  // Animações para container e itens
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <div className="py-10">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center mb-10"
      >
        <h3 className="text-2xl md:text-3xl font-playfair text-center text-[#B89B7A] mb-3">
          Transformações Reais
        </h3>
        <p className="text-center text-[#8F7A6A] mb-4 max-w-2xl mx-auto">
          O que mulheres como você estão dizendo sobre esta jornada de transformação
        </p>
        <motion.div
          className="h-0.5 w-32 mx-auto bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d]"
          initial={{ width: 0 }}
          whileInView={{ width: '8rem' }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
        />
      </motion.div>

      <motion.div
        className="grid md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.3 } }}
          >
            <Card className="p-8 relative overflow-hidden rounded-xl border border-[#B89B7A]/20 shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
              {/* Elementos decorativos animados */}
              <motion.div
                className="absolute top-0 left-0 w-12 h-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 + index * 0.2 }}
              >
                <div className="absolute top-2 left-2 w-10 h-10 border-t-2 border-l-2 border-[#B89B7A]/40 rounded-tl-md" />
              </motion.div>

              <motion.div
                className="absolute bottom-0 right-0 w-12 h-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 + index * 0.2 }}
              >
                <div className="absolute bottom-2 right-2 w-10 h-10 border-b-2 border-r-2 border-[#B89B7A]/40 rounded-br-md" />
              </motion.div>

              <div className="mb-5 text-[#B89B7A]">
                <motion.div
                  initial={{ rotate: -10, scale: 0.9 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.2 }}
                >
                  <QuoteIcon size={32} strokeWidth={1.5} />
                </motion.div>
              </div>

              <p className="text-[#8F7A6A] italic mb-6 leading-relaxed flex-grow">"{item.text}"</p>

              <div className="mt-auto pt-4 border-t border-[#B89B7A]/20">
                <p className="font-medium text-[#432818]">{item.name}</p>
                {item.role && <p className="text-sm text-[#8F7A6A]/70">{item.role}</p>}
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Testimonials;
