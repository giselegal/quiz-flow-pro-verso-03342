import { BankImage, ImageBank } from "./imageBank.d";

// Imagens do banco
const images: BankImage[] = [];

/**
 * Obtém todas as imagens no banco
 * @returns Array com todas as imagens
 */
export const getAllImages = (): BankImage[] => {
  return images;
};

/**
 * Obtém uma imagem pelo ID
 * @param id ID da imagem
 * @returns Imagem ou undefined se não encontrada
 */
export const getImageById = (id: string): BankImage | undefined => {
  return images.find(img => img.id === id);
};

/**
 * Obtém imagens por categoria
 * @param category Nome da categoria
 * @returns Array de imagens da categoria
 */
export const getImagesByCategory = (category: string): BankImage[] => {
  return images.filter(img => img.category === category || img.categories?.includes(category));
};

/**
 * Obtém imagens por categoria de estilo
 * Esta função é usada para recuperar imagens associadas a uma categoria de estilo específica
 * @param styleCategory Categoria de estilo para filtrar
 * @returns Array de imagens da categoria de estilo
 */
export const getImagesByStyleCategory = (styleCategory: string): BankImage[] => {
  return getImagesByCategory(styleCategory);
};

/**
 * Adiciona uma imagem ao banco
 * @param image Imagem a ser adicionada
 * @returns A imagem adicionada
 */
export const addImage = (image: BankImage): BankImage => {
  const exists = images.some(img => img.id === image.id);
  if (!exists) {
    images.push(image);
  }
  return image;
};

/**
 * Objeto do banco de imagens
 */
export const imageBank: ImageBank = {
  getAllImages,
  getImageById,
  getImagesByCategory,
  preloadCategory: async (_category: string) => {
    // Implementação simples de preload
    return Promise.resolve(true);
  },
};

// Re-export BankImage type so it can be imported from this file
export type { BankImage };

export default imageBank;
