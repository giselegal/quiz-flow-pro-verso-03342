import { StyleResult } from '@/types/quiz';
import { motion } from 'framer-motion';

interface SecondaryStylesSectionProps {
  secondaryStyles: StyleResult[];
}

const SecondaryStylesSection: React.FC<SecondaryStylesSectionProps> = ({ secondaryStyles }) => {
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

  return (
    <motion.div
      className="space-y-3 p-5 bg-[#fffaf7] rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="flex items-center justify-between mb-2">
        <motion.h3
          className="text-sm font-medium text-[#432818] relative inline-block"
          whileHover={{ x: 3 }}
        >
          <motion.span
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-[#B89B7A] to-transparent rounded-full"
          />
          Estilos Complementares
        </motion.h3>
      </motion.div>

      <motion.div className="grid grid-cols-1 gap-3" variants={containerVariants}>
        {secondaryStyles.slice(0, 2).map((style, index) => (
          <motion.div
            key={style.category}
            className="p-3 bg-white rounded-lg hover:shadow-md transition-all duration-300"
            variants={itemVariants}
            whileHover={{
              y: -2,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            }}
          >
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1.5">
                <motion.h4 className="text-sm font-medium text-[#432818]" whileHover={{ x: 2 }}>
                  {style.category}
                </motion.h4>
                <motion.span
                  className="text-xs font-semibold text-[#aa6b5d] bg-[#fffaf7] px-2 py-0.5 rounded-full"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {style.percentage}%
                </motion.span>
              </div>

              <div className="w-full bg-[#FAF9F7] rounded-full h-2 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] h-2 rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${style.percentage}%` }}
                  transition={{
                    delay: 0.8 + index * 0.2,
                    duration: 1,
                    ease: 'easeOut',
                  }}
                >
                  <motion.div
                    className="absolute top-0 right-0 h-full w-4 bg-white/30"
                    animate={{
                      x: [30, -10, 30],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'loop',
                    }}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default SecondaryStylesSection;
