// @ts-nocheck
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { cn } from '@/lib/utils';

interface BeforeAfterTransformationProps {
  beforeImage?: string;
  afterImage?: string;
  title?: string;
  description?: string;
  className?: string;
}

const BeforeAfterTransformation: React.FC<BeforeAfterTransformationProps> = ({
  beforeImage = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744920677/Espanhol_Portugu%C3%AAs_6_jxqlxx.webp',
  afterImage = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745459978/20250423_1704_Transforma%C3%A7%C3%A3o_no_Closet_Moderno_simple_compose_01jsj3xvy6fpfb6pyd5shg5eak_1_appany.webp',
  title = 'Transformação Real',
  description = 'Veja como o guia pode transformar seu estilo',
  className,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card className={cn('p-6 mb-6 bg-white shadow-sm', className)}>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-[#432818] mb-2">{title}</h3>
        <p className="text-[#8F7A6A]">{description}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="text-center">
          <h4 className="text-lg font-semibold text-[#432818] mb-3">Antes</h4>
          <OptimizedImage
            src={beforeImage}
            alt="Antes da transformação"
            width={300}
            height={400}
            className="rounded-lg shadow-md mx-auto"
            onLoad={() => setImageLoaded(true)}
            priority={true}
            quality={90}
          />
        </div>

        <div className="text-center">
          <h4 className="text-lg font-semibold text-[#432818] mb-3">Depois</h4>
          <OptimizedImage
            src={afterImage}
            alt="Depois da transformação"
            width={300}
            height={400}
            className="rounded-lg shadow-md mx-auto"
            onLoad={() => setImageLoaded(true)}
            priority={true}
            quality={90}
          />
        </div>
      </div>
    </Card>
  );
};

export default BeforeAfterTransformation;
