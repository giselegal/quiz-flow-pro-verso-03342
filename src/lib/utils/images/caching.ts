import { ImageCacheEntry } from './types';
import { StorageService } from '@/services/core/StorageService';
import { appLogger } from '@/lib/utils/appLogger';

const IMAGE_CACHE_KEY = 'image_cache';

export const getImageCache = (): { [url: string]: ImageCacheEntry } => {
  try {
    const cache = localStorage.getItem(IMAGE_CACHE_KEY);
    return cache ? JSON.parse(cache) : {};
  } catch (error) {
    appLogger.warn('Could not load image cache from localStorage:', { data: [error] });
    return {};
  }
};

export const isImageInCache = (url: string): boolean => {
  const cache = getImageCache();
  return !!cache[url];
};

export const getImageFromCache = (url: string): ImageCacheEntry | undefined => {
  const cache = getImageCache();
  const entry = cache[url];
  if (entry) {
    // Update last accessed timestamp
    entry.lastAccessed = Date.now();
    try {
      localStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
      appLogger.warn('Could not update cache timestamp:', { data: [error] });
    }
  }
  return entry;
};

export const addToCache = (url: string, metadata: any): ImageCacheEntry => {
  const cacheEntry: ImageCacheEntry = {
    url,
    timestamp: Date.now(),
    metadata,
    lastAccessed: Date.now(),
    loadStatus: 'loaded',
  };

  try {
    const cache = getImageCache();
    cache[url] = cacheEntry;
    StorageService.safeSetJSON('image_cache', cache);
  } catch (error) {
    appLogger.warn('Could not save to cache:', { data: [error] });
  }

  return cacheEntry;
};

export const updateImageCache = (url: string, updates: Partial<ImageCacheEntry>): void => {
  try {
    const cache = getImageCache();
    cache[url] = { ...cache[url], ...updates };
    localStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    appLogger.warn('Could not update image cache:', { data: [error] });
  }
};

export const hasImageWithStatus = (
  url: string,
  status: 'loading' | 'loaded' | 'error',
): boolean => {
  const entry = getImageFromCache(url);
  return entry?.loadStatus === status || false;
};

export const clearImageCache = (): void => {
  try {
    localStorage.removeItem(IMAGE_CACHE_KEY);
  } catch (error) {
    appLogger.warn('Could not clear image cache:', { data: [error] });
  }
};

export const removeImageFromCache = (url: string): void => {
  try {
    const cache = getImageCache();
    delete cache[url];
    localStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    appLogger.warn('Could not remove image from cache:', { data: [error] });
  }
};
