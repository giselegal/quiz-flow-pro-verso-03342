import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaOptionsType } from 'embla-carousel';
import { cn } from '@/lib/utils';

export interface SimpleCarouselProps {
  slides: React.ReactNode[];
  options?: EmblaOptionsType;
  className?: string;
}

export const SimpleCarousel: React.FC<SimpleCarouselProps> = ({ slides, options, className }) => {
  const [emblaRef] = useEmblaCarousel(options);

  return (
    <div className={cn('overflow-hidden', className)} ref={emblaRef}>
      <div className="flex">
        {slides.map((slide, index) => (
          <div className="min-w-0 flex-[0_0_100%]" key={index}>
            {slide}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleCarousel;
