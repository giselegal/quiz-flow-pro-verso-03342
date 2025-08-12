/**
 * BankImage - Interface para imagens no banco de imagens
 * Define a estrutura das imagens que podem ser pré-carregadas e otimizadas
 */
export interface BankImage {
  /**
   * Identificador único da imagem
   */
  id: string;

  /**
   * URL da imagem
   */
  src: string;

  /**
   * Texto alternativo para acessibilidade
   */
  alt: string;

  /**
   * Categoria principal da imagem (intro, quiz, result, etc)
   */
  category: string;

  /**
   * Categorias adicionais da imagem
   * Permite que uma imagem pertença a múltiplas categorias
   */
  categories?: string[];

  /**
   * Seção específica da aplicação
   */
  section?: string;

  /**
   * Prioridade de carregamento
   */
  priority?: "high" | "medium" | "low";

  /**
   * Largura original da imagem em pixels
   */
  width?: number;

  /**
   * Altura original da imagem em pixels
   */
  height?: number;

  /**
   * Meta-informações adicionais
   */
  metadata?: Record<string, any>;

  /**
   * Se esta imagem é uma imagem crítica (LCP)
   */
  isLCP?: boolean;

  /**
   * Indicador de pré-carregamento
   */
  preload?: boolean;

  /**
   * Tags para classificação de imagens
   */
  tags?: string[];

  /**
   * Prioridade de pré-carregamento (numérica)
   */
  preloadPriority?: number;
}

/**
 * ImageBank - Interface para o banco de imagens
 */
export interface ImageBank {
  /**
   * Obtém todas as imagens no banco
   */
  getAllImages: () => BankImage[];

  /**
   * Obtém uma imagem por seu ID
   */
  getImageById: (id: string) => BankImage | undefined;

  /**
   * Obtém imagens por categoria
   */
  getImagesByCategory: (category: string) => BankImage[];

  /**
   * Pré-carrega imagens por categoria
   */
  preloadCategory: (category: string) => Promise<boolean>;
}
