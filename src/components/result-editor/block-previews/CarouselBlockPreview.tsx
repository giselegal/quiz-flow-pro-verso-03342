import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';

interface CarouselBlockPreviewProps {
  content: {
    carouselImages?: {
      url: string;
      alt: string;
      caption?: string;
    }[];
    autoPlay?: boolean;
    interval?: number;
    showArrows?: boolean;
    showDots?: boolean;
    style?: any;
  };
}

const CarouselBlockPreview: React.FC<CarouselBlockPreviewProps> = ({ content }) => {
  const {
    carouselImages = [],
    autoPlay = false,
    interval = 5000,
    showArrows = true,
    showDots = true,
    style = {},
  } = content;

  // Referência para o API do carrossel para autoplay
  const [api, setApi] = useState<any>(null);

  // Configurar autoplay
  useEffect(() => {
    if (!api || !autoPlay) return;

    // Função para avançar para o próximo slide
    const autoPlayInterval = setInterval(() => {
      api.scrollNext();
    }, interval);

    // Limpar intervalo quando o componente é desmontado
    return () => clearInterval(autoPlayInterval);
  }, [api, autoPlay, interval]);

  return (
    <div style={style} className="w-full">
      {carouselImages.length === 0 ? (
        <div className="p-6 text-center text-gray-400 border border-dashed rounded-md">
          Adicione imagens ao seu carrossel
        </div>
      ) : (
        <Carousel setApi={setApi} className="w-full relative">
          <CarouselContent>
            {carouselImages.map((image, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={image.url || '/placeholder.svg'}
                      alt={image.alt}
                      className="w-full h-auto aspect-[16/9] object-cover"
                    />
                    {image.caption && (
                      <div className="p-2 text-center text-sm">{image.caption}</div>
                    )}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {showArrows && carouselImages.length > 1 && (
            <>
              <CarouselPrevious
                className={cn('absolute left-2 top-1/2 transform -translate-y-1/2')}
              />
              <CarouselNext className={cn('absolute right-2 top-1/2 transform -translate-y-1/2')} />
            </>
          )}

          {showDots && carouselImages.length > 1 && (
            <div className="flex justify-center gap-1 mt-2">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className="w-2 h-2 rounded-full bg-gray-300 focus:outline-none"
                />
              ))}
            </div>
          )}
        </Carousel>
      )}
    </div>
  );
};

export default CarouselBlockPreview;
