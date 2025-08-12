import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SecurePurchaseElement from '@/components/result/SecurePurchaseElement';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShoppingCart, Clock } from 'lucide-react';

interface PricingSectionProps {
  price?: string;
  regularPrice?: string;
  ctaText?: string;
  ctaUrl?: string;
}

const PricingSection: React.FC<PricingSectionProps> = ({
  price = '39,00',
  regularPrice = '175,00',
  ctaText = 'Transformar Meu Estilo Agora',
  ctaUrl = 'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handlePurchase = () => {
    setIsLoading(true);
    // Simulate loading for better UX
    setTimeout(() => {
      window.location.href = ctaUrl;
      setIsLoading(false);
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8 }}
    >
      <Card className="p-8 border-[#aa6b5d] border-2 bg-white relative overflow-hidden card-elegant">
        {/* Shimmer effect animation */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 pointer-events-none"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: 'linear',
            repeatDelay: 1.5,
          }}
        />

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Value Stack */}
          <motion.div
            className="bg-[#fff7f3] p-5 rounded-lg border border-[#B89B7A]/10 shadow-sm"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{
              y: -2,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            }}
          >
            <motion.h4
              className="text-[#432818] text-sm mb-3 text-center relative inline-block"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <motion.div
                className="absolute -left-5 top-0 text-amber-400"
                animate={{ rotate: [0, 15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
              >
                <Sparkles size={14} />
              </motion.div>
              Valor de cada componente:
            </motion.h4>

            <motion.div className="space-y-2.5">
              {[
                { label: 'Guia Principal', value: '67,00' },
                { label: 'Bônus 1 - Peças-chave', value: '79,00' },
                { label: 'Bônus 2 - Visagismo Facial', value: '29,00' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex justify-between items-center"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.6 + index * 0.1,
                  }}
                  whileHover={{ x: 3 }}
                >
                  <span className="text-[#432818]">{item.label}</span>
                  <span className="font-medium text-[#aa6b5d]">R$ {item.value}</span>
                </motion.div>
              ))}

              <motion.div
                className="border-t border-[#B89B7A]/20 pt-3 mt-3 flex justify-between items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                <span className="font-medium text-[#432818]">Valor Total</span>
                <motion.span className="font-medium relative" whileHover={{ scale: 1.05 }}>
                  R$ {regularPrice}
                  <motion.div
                    className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#ff5a5a] transform -translate-y-1/2 -rotate-3"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.4, delay: 1.2 }}
                  />
                </motion.span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Price Display */}
          <motion.div
            className="flex flex-col md:flex-row items-center justify-center gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <motion.div
              className="transform rotate-[-5deg] relative"
              whileHover={{ rotate: -8, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <p className="text-sm text-[#3a3a3a]/60 mb-1">De</p>
              <p className="text-2xl line-through text-[#3a3a3a]/60">R$ {regularPrice}</p>
              <motion.div
                className="absolute -top-1 -left-1 -right-1 -bottom-1 border-2 border-[#ff5a5a] transform rotate-[-8deg] rounded-sm"
                animate={{
                  rotate: [-8, -10, -8],
                  borderWidth: ['2px', '3px', '2px'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
            </motion.div>

            <motion.div
              className="text-center transform rotate-[2deg]"
              whileHover={{ rotate: 4, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <p className="text-sm text-[#aa6b5d] mb-1">Por apenas</p>
              <div className="flex items-baseline gap-1 justify-center relative">
                <span className="text-sm">R$</span>
                <motion.p
                  className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-amber-500 to-amber-700"
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                >
                  {price.split(',')[0]}
                </motion.p>
                <span className="text-lg">,{price.split(',')[1] || '00'}</span>
                <motion.div
                  className="absolute -top-2 -right-4 rotate-12 text-xs bg-[#aa6b5d] text-white px-2 py-0.5 rounded-full"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [12, 15, 12],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                >
                  HOJE
                </motion.div>
              </div>
              <p className="text-xs text-[#3a3a3a]/60 mt-1">Pagamento único ou em 4x de R$ 10,86</p>
            </motion.div>
          </motion.div>

          {/* Payment method images */}
          <motion.div
            className="mt-3 mb-4 text-center"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <img
              src="https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_auto:good,w_320/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp"
              alt="Métodos de pagamento"
              className="w-full max-w-xs mx-auto"
              width={320}
              height={48}
              loading="lazy"
            />
          </motion.div>

          {/* Security Badge */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            <SecurePurchaseElement />
          </motion.div>

          {/* CTA Button */}
          <motion.div
            className="relative"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <Button
              className="w-full bg-[#aa6b5d] hover:bg-[#8f574a] text-white py-6 px-8 rounded-md text-lg leading-none md:leading-normal transition-colors duration-300 shadow-lg"
              onClick={handlePurchase}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              disabled={isLoading}
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.span
                    className="flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key="loading"
                  >
                    <div className="inline-block">
                      <LoadingSpinner size="xs" color="#FFFFFF" />
                    </div>
                    <span>Processando...</span>
                  </motion.span>
                ) : (
                  <motion.span
                    className="flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key="cta"
                  >
                    <motion.div
                      animate={
                        isHovered
                          ? {
                              scale: 1.1,
                              x: [0, -2, 0, 2, 0],
                            }
                          : {}
                      }
                      transition={{ duration: 0.5 }}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                    </motion.div>
                    {ctaText}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>

            {/* Elegant shadow beneath button */}
            <motion.div
              className="h-2 bg-gradient-to-r from-transparent via-[#B89B7A]/30 to-transparent rounded-full mt-2 mx-auto"
              initial={{ width: '60%' }}
              animate={{ width: '80%' }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
          </motion.div>

          {/* Limited Time Offer */}
          <motion.p
            className="text-center text-sm flex items-center justify-center gap-1 text-[#aa6b5d]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.5 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <Clock className="w-3 h-3 text-[#aa6b5d]" />
            </motion.div>
            <span>Oferta por tempo limitado</span>
          </motion.p>

          {/* Payment Methods */}
          <motion.p
            className="text-center text-sm text-[#432818]/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.6 }}
          >
            Aceitamos PIX, cartão de crédito e boleto
          </motion.p>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default PricingSection;
