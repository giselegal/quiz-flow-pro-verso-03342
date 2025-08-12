import { useState, useEffect } from 'react';
import { getAllImages } from '@/data/imageBank';
import { preloadCriticalImages } from '@/utils/imageManager';

export const useImageBank = () => {
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [preloadProgress, setPreloadProgress] = useState(0);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const imageData = getAllImages();
        setImages(imageData);

        // Preload critical images without onComplete callback
        await preloadCriticalImages('strategic', {
          quality: 75,
          batchSize: 3,
          format: 'webp',
        });

        setPreloadProgress(100);
      } catch (error) {
        console.error('Error loading images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, []);

  const preloadImagesByCategory = async (category: string) => {
    try {
      await preloadCriticalImages(category as any, {
        quality: 80,
        batchSize: 5,
        format: 'webp',
      });
    } catch (error) {
      console.error(`Error preloading images for category ${category}:`, error);
    }
  };

  return {
    images,
    isLoading,
    preloadProgress,
    preloadImagesByCategory,
  };
};
