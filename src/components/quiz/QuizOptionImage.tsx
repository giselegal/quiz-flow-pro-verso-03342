// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { AspectRatio } from '../ui/aspect-ratio';
import { getFallbackStyle } from '@/utils/styleUtils';
import { isImagePreloaded, getOptimizedImage, getImageMetadata } from '@/utils/imageManager';
import OptimizedImage from '../ui/OptimizedImage';

interface QuizOptionImageProps {
  imageUrl: string;
  altText: string;
  styleCategory: string;
  isSelected: boolean;
  is3DQuestion: boolean;
  questionId: string;
}

export const QuizOptionImage: React.FC<QuizOptionImageProps> = ({
  imageUrl,
  altText,
  styleCategory,
  isSelected,
  is3DQuestion,
  questionId,
}) => {
  const isMobile = useIsMobile();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Get image metadata from our bank if available
  const imageMetadata = useMemo(() => getImageMetadata(imageUrl), [imageUrl]);

  // Use memoization to avoid recalculating the URL on each render
  const optimizedImageUrl = useMemo(
    () =>
      getOptimizedImage(imageUrl, {
        quality: 95,
        format: 'auto',
        width: imageUrl.includes('sapatos') ? 400 : 500,
      }),
    [imageUrl]
  );

  // Check if image is already preloaded on mount
  useEffect(() => {
    if (isImagePreloaded(imageUrl)) {
      setImageLoaded(true);
    }
  }, [imageUrl]);

  if (imageError) {
    return (
      <div className="w-full h-full" style={getFallbackStyle(styleCategory)}>
        <span>{styleCategory}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'w-full relative flex-grow overflow-hidden',
        'md:mx-auto', // Center on desktop
        !isMobile && 'md:max-w-[40%]' // Reduced from 50% to 40% on desktop
      )}
    >
      <AspectRatio ratio={imageUrl.includes('sapatos') ? 1 : 3 / 4} className="w-full h-full">
        <div
          className={cn(
            'w-full h-full flex items-center justify-center overflow-hidden transform-gpu',
            'transition-all duration-300',
            isSelected && 'scale-[1.03]',
            // Efeito de zoom para opções com imagem ao fazer hover
            !isSelected && 'hover:scale-110'
          )}
        >
          {/* Use OptimizedImage component instead of img tag */}
          <OptimizedImage
            src={optimizedImageUrl}
            alt={imageMetadata?.alt || altText}
            className={cn(
              'object-cover w-full h-full transition-all duration-300',
              isSelected ? 'shadow-3d' : 'shadow-sm hover:shadow-md',
              // Enhanced 3D effect
              isSelected && is3DQuestion && 'transform-3d rotate-y-12'
            )}
            onLoad={() => setImageLoaded(true)}
            priority={true}
          />
        </div>
      </AspectRatio>
    </div>
  );
};
