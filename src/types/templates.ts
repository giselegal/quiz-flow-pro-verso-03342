/**
 * 🎯 TEMPLATE TYPES - Type Safety para Templates
 */

export interface TemplateCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category?: string;
  tags?: string[];
  thumbnail?: string;
  isAIGenerated?: boolean;
  createdAt: string;
  updatedAt?: string;
  blocks: TemplateBlock[];
  // Legacy compatibility
  version?: string;
  author?: string;
}

export interface TemplateBlock {
  id: string;
  type: string;
  properties: Record<string, any>;
  children?: TemplateBlock[];
  order: number;
}

export interface ImageAsset {
  id: string;
  url: string;
  alt: string;
  category: string;
  tags: string[];
  dimensions?: {
    width: number;
    height: number;
  };
  fileSize?: number;
}