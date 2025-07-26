/**
 * Utilitários para gerar URLs de placeholder que funcionem
 * Substitui via.placeholder.com por alternativas funcionais
 */

export class PlaceholderUtils {
  /**
   * Gera URL de placeholder usando placehold.co (mais confiável)
   */
  static generatePlaceholderUrl(
    width: number = 400,
    height: number = 300,
    backgroundColor: string = 'cccccc',
    textColor: string = '333333',
    text: string = 'Imagem'
  ): string {
    const encodedText = encodeURIComponent(text);
    return `https://placehold.co/${width}x${height}/${backgroundColor}/${textColor}?text=${encodedText}`;
  }

  /**
   * Gera URL de placeholder para imagens de perfil/avatar
   */
  static generateAvatarPlaceholder(
    size: number = 64,
    text: string = '👤'
  ): string {
    return this.generatePlaceholderUrl(size, size, 'B89B7A', 'FFFFFF', text);
  }

  /**
   * Gera URL de placeholder para imagens de produtos/conteúdo
   */
  static generateContentPlaceholder(
    width: number = 400,
    height: number = 300,
    text: string = 'Imagem'
  ): string {
    return this.generatePlaceholderUrl(width, height, 'B89B7A', 'FFFFFF', text);
  }

  /**
   * Gera URL de placeholder para thumbnails de vídeo
   */
  static generateVideoThumbnail(
    width: number = 640,
    height: number = 360,
    text: string = 'Video Thumbnail'
  ): string {
    return this.generatePlaceholderUrl(width, height, '1a1a1a', 'ffffff', text);
  }

  /**
   * Gera URL de placeholder para logos
   */
  static generateLogoPlaceholder(
    size: number = 96,
    text: string = 'Logo'
  ): string {
    return this.generatePlaceholderUrl(size, size, 'f8f9fa', '495057', text);
  }

  /**
   * Substitui URLs do via.placeholder.com por alternativas funcionais
   */
  static replaceViaPlaceholder(url: string): string {
    if (!url.includes('via.placeholder.com')) {
      return url;
    }

    // Extrair dimensões da URL original
    const dimensionMatch = url.match(/(\d+)x(\d+)/);
    const width = dimensionMatch ? parseInt(dimensionMatch[1]) : 400;
    const height = dimensionMatch ? parseInt(dimensionMatch[2]) : 300;

    // Extrair texto se houver
    const textMatch = url.match(/text=([^&]+)/);
    const text = textMatch ? decodeURIComponent(textMatch[1].replace(/\+/g, ' ')) : 'Imagem';

    // Extrair cores se houver
    const colorMatch = url.match(/\/([a-fA-F0-9]{6})\/([a-fA-F0-9]{6})/);
    const backgroundColor = colorMatch ? colorMatch[1] : 'B89B7A';
    const textColor = colorMatch ? colorMatch[2] : 'FFFFFF';

    return this.generatePlaceholderUrl(width, height, backgroundColor, textColor, text);
  }
}

export default PlaceholderUtils;