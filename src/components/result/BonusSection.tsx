// @ts-nocheck
import { Card } from '@/components/ui/card';
import { Gift, Star } from 'lucide-react';
import { optimizeCloudinaryUrl } from '@/utils/imageUtils';
import { motion } from 'framer-motion';
import ProgressiveImage from '@/components/ui/progressive-image';

const BonusSection: React.FC = () => {
  // Criar imagem otimizada de alta qualidade
  const bonus1ImageUrl = optimizeCloudinaryUrl(
    'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911668/C%C3%B3pia_de_Passo_5_Pe%C3%A7as_chaves_Documento_A4_lxmekf.webp',
    { quality: 95, format: 'webp' }
  );

  // Criar imagem otimizada para o segundo bônus
  const bonus2ImageUrl = optimizeCloudinaryUrl(
    'https://res.cloudinary.com/dqljyf76t/image/upload/v1745515076/C%C3%B3pia_de_MOCKUPS_10_-_Copia_bvoccn.webp',
    { quality: 95, format: 'webp' }
  );

  return (
    <div className="py-10">
      <h2 className="text-2xl md:text-3xl font-playfair text-[#aa6b5d] text-center mb-2">
        Bônus Exclusivos para Você
      </h2>
      <p className="text-center text-[#3a3a3a] mb-6 max-w-md mx-auto">
        Além do guia principal, você receberá estas ferramentas complementares para potencializar
        sua jornada de transformação:
      </p>
      <div className="elegant-divider w-32 mx-auto mt-0 mb-6"></div>

      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Animated cards entrada */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
              delay: 0.2,
            }}
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow transform-3d hover:scale-[1.01] border-0"
          >
            <div className="flex justify-center mb-4">
              <picture>
                <source
                  srcSet={`
                    ${optimizeCloudinaryUrl('https://res.cloudinary.com/dqljyf76t/image/upload/v1744911668/C%C3%B3pia_de_Passo_5_Pe%C3%A7as_chaves_Documento_A4_lxmekf.webp', { width: 200, quality: 95, format: 'webp' })} 200w,
                    ${optimizeCloudinaryUrl('https://res.cloudinary.com/dqljyf76t/image/upload/v1744911668/C%C3%B3pia_de_Passo_5_Pe%C3%A7as_chaves_Documento_A4_lxmekf.webp', { width: 300, quality: 95, format: 'webp' })} 300w,
                    ${optimizeCloudinaryUrl('https://res.cloudinary.com/dqljyf76t/image/upload/v1744911668/C%C3%B3pia_de_Passo_5_Pe%C3%A7as_chaves_Documento_A4_lxmekf.webp', { width: 400, quality: 95, format: 'webp' })} 400w,
                    ${optimizeCloudinaryUrl('https://res.cloudinary.com/dqljyf76t/image/upload/v1744911668/C%C3%B3pia_de_Passo_5_Pe%C3%A7as_chaves_Documento_A4_lxmekf.webp', { width: 600, quality: 95, format: 'webp' })} 600w
                  `}
                  sizes="(max-width: 768px) 45vw, 300px"
                  type="image/webp"
                />
                <ProgressiveImage
                  src={bonus1ImageUrl}
                  alt="Bônus: Peças-chave do Guarda-roupa"
                  className="w-full max-w-[300px] h-auto rounded-lg shadow-sm hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  width={300}
                  height={420}
                  sizes="(max-width: 768px) 45vw, 300px"
                />
              </picture>
            </div>
            <h3 className="text-lg font-medium text-[#aa6b5d] mb-2 flex items-center">
              <Gift className="w-5 h-5 mr-2 text-[#B89B7A]" />
              Peças-chave do Guarda-roupa
            </h3>
            <p className="text-[#432818] text-sm">
              Descubra as peças essenciais para seu estilo que maximizam suas combinações com
              investimento inteligente.
            </p>

            <div className="mt-3 flex items-center">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} className="w-4 h-4 fill-[#B89B7A] text-[#B89B7A]" />
                ))}
              </div>
              <span className="ml-2 text-xs text-[#3a3a3a]">Edição Premium</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
              delay: 0.4,
            }}
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow transform-3d hover:scale-[1.01] border-0"
          >
            <div className="flex justify-center mb-4">
              <picture>
                <source
                  srcSet={`
                    ${optimizeCloudinaryUrl('https://res.cloudinary.com/dqljyf76t/image/upload/v1745515076/C%C3%B3pia_de_MOCKUPS_10_-_Copia_bvoccn.webp', { width: 200, quality: 95, format: 'webp' })} 200w,
                    ${optimizeCloudinaryUrl('https://res.cloudinary.com/dqljyf76t/image/upload/v1745515076/C%C3%B3pia_de_MOCKUPS_10_-_Copia_bvoccn.webp', { width: 300, quality: 95, format: 'webp' })} 300w,
                    ${optimizeCloudinaryUrl('https://res.cloudinary.com/dqljyf76t/image/upload/v1745515076/C%C3%B3pia_de_MOCKUPS_10_-_Copia_bvoccn.webp', { width: 400, quality: 95, format: 'webp' })} 400w,
                    ${optimizeCloudinaryUrl('https://res.cloudinary.com/dqljyf76t/image/upload/v1745515076/C%C3%B3pia_de_MOCKUPS_10_-_Copia_bvoccn.webp', { width: 600, quality: 95, format: 'webp' })} 600w
                  `}
                  sizes="(max-width: 768px) 45vw, 300px"
                  type="image/webp"
                />
                <ProgressiveImage
                  src={bonus2ImageUrl}
                  alt="Bônus: Visagismo Facial"
                  className="w-full max-w-[80vw] sm:max-w-[60vw] md:max-w-[450px] h-auto rounded-lg shadow-sm hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  width={350}
                  height={490}
                  sizes="(max-width: 768px) 80vw, (max-width: 1024px) 60vw, 450px"
                />
              </picture>
            </div>
            <h3 className="text-lg font-medium text-[#aa6b5d] mb-2 flex items-center">
              <Gift className="w-5 h-5 mr-2 text-[#B89B7A]" />
              Visagismo Facial
            </h3>
            <p className="text-[#432818] text-sm">
              Aprenda a valorizar seus traços faciais, cortes de cabelo e acessórios que harmonizam
              com seu rosto.
            </p>

            <div className="mt-3 flex items-center">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} className="w-4 h-4 fill-[#B89B7A] text-[#B89B7A]" />
                ))}
              </div>
              <span className="ml-2 text-xs text-[#3a3a3a]">Edição Premium</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BonusSection;
