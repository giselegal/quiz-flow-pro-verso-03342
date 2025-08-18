import { Card } from '@/components/ui/card';
import { Check, Sparkles, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const benefits = [
  {
    title: 'Guia de Estilo e Imagem',
    icon: <Sparkles className="w-5 h-5 text-amber-500" />,
    items: [
      'Descubra seu estilo com precisão',
      'Aprenda a criar looks autênticos',
      'Técnicas de composição visual',
    ],
  },
  {
    title: 'Bônus Exclusivos',
    icon: <Star className="w-5 h-5 text-amber-500" />,
    items: ['Visagismo Facial Estratégico', 'Peças-Chave do Guarda-Roupa', 'Consultoria em Grupo'],
  },
];

const ProductShowcase = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const checkItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      className="space-y-10 py-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={containerVariants}
    >
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          variants={itemVariants}
          className="relative group"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <motion.img
            src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911682/C%C3%B3pia_de_MOCKUPS_14_oxegnd.webp"
            alt="Guia de Estilo - 3 Revistas"
            className="w-full rounded-xl shadow-xl relative z-10"
          />
          <motion.div
            className="absolute -inset-1 bg-gradient-to-r from-amber-200 to-amber-400 rounded-xl blur opacity-30 
                      group-hover:opacity-50 transition duration-700 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
          <motion.div
            style={{ color: '#6B4F43' }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, duration: 0.4 }}
          >
            COMPLETO
          </motion.div>
        </motion.div>

        <motion.div className="space-y-7" variants={itemVariants}>
          <motion.div className="space-y-2">
            <motion.h2
              className="text-3xl font-playfair text-[#aa6b5d] relative inline-block"
              variants={itemVariants}
              whileHover={{ x: 3 }}
              transition={{ type: 'spring' }}
            >
              Transforme seu Estilo
              <motion.div
                className="absolute -bottom-2 left-0 h-[3px] bg-gradient-to-r from-amber-400 to-transparent rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.8 }}
              />
            </motion.h2>
            <motion.p className="text-[#8F7A6A] text-lg" variants={itemVariants}>
              Tudo o que você precisa para transformar seu visual
            </motion.p>
          </motion.div>

          {benefits.map((section, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Card className="p-6 bg-white border-[#aa6b5d]/20 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div style={{ backgroundColor: '#FAF9F7' }} whileHover={{ rotate: 10 }}>
                    {section.icon}
                  </motion.div>
                  <h3 className="text-xl font-playfair text-[#aa6b5d]">{section.title}</h3>
                </div>

                <motion.div className="space-y-3" variants={containerVariants}>
                  {section.items.map((item, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-start gap-3 group"
                      variants={checkItemVariants}
                      custom={idx}
                      whileHover={{ x: 3 }}
                      transition={{ type: 'spring' }}
                    >
                      <motion.div
                        className="mt-1 bg-gradient-to-br from-amber-100 to-amber-200 p-1 rounded-full flex-shrink-0"
                        whileHover={{ scale: 1.1, backgroundColor: '#fcd34d' }}
                      >
                        <Check className="w-4 h-4 text-amber-600" />
                      </motion.div>
                      <p className="text-[#3a3a3a] group-hover:text-[#aa6b5d] transition-colors">
                        {item}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProductShowcase;
