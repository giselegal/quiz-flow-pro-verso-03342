/**
 * 🖼️ BANCO DE IMAGENS OTIMIZADAS
 * 
 * Gerado automaticamente em 26/09/2025, 02:12:52
 * Total de imagens: 9
 * Categorias: guias, mockups
 */

import optimizedImages from './optimized-images.json';

export interface ImageEntry {
    id: string;
    name: string;
    url: string;
    optimizedUrl: string;
    category: string;
    tags: string[];
    dimensions: {
        width: number;
        height: number;
    };
    size: number;
    uploadDate: string;
    description?: string;
}

export interface ImageDatabase {
    version: string;
    lastUpdated: string;
    totalImages: number;
    categories: string[];
    images: ImageEntry[];
}

export const imageDatabase = optimizedImages as ImageDatabase;

export const getImagesByCategory = (category: string): ImageEntry[] => {
    return imageDatabase.images.filter(img => img.category === category);
};

export const getImagesByTag = (tag: string): ImageEntry[] => {
    return imageDatabase.images.filter(img => img.tags.includes(tag));
};

export const searchImages = (query: string): ImageEntry[] => {
    const queryLower = query.toLowerCase();
    return imageDatabase.images.filter(img => 
        img.name.toLowerCase().includes(queryLower) ||
        img.description?.toLowerCase().includes(queryLower) ||
        img.tags.some(tag => tag.toLowerCase().includes(queryLower))
    );
};

export default imageDatabase;
