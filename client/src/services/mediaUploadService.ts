// =============================================================================
// SERVIÇO DE UPLOAD DE MÍDIA - SUPABASE STORAGE
// Sistema de Quiz Quest Challenge Verse
// =============================================================================

import { supabase, STORAGE_BUCKETS } from '@shared/lib/supabase';

// =============================================================================
// TIPOS
// =============================================================================

export interface UploadResult {
  url: string;
  path: string;
  size: number;
  type: string;
}

export interface UploadOptions {
  bucket?: string;
  folder?: string;
  maxSize?: number; // em bytes
  allowedTypes?: string[];
  generateThumbnail?: boolean;
  quality?: number; // 0-100 para compressão de imagem
}

export interface MediaFile {
  file: File;
  preview?: string;
  progress?: number;
  error?: string;
  result?: UploadResult;
}

// =============================================================================
// CONFIGURAÇÕES PADRÃO
// =============================================================================

const DEFAULT_OPTIONS: UploadOptions = {
  bucket: STORAGE_BUCKETS.QUIZ_IMAGES,
  folder: 'uploads',
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  generateThumbnail: false,
  quality: 80,
};

// =============================================================================
// UTILITÁRIOS
// =============================================================================

const generateFileName = (originalName: string, userId: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop() || 'jpg';
  return `${userId}/${timestamp}_${random}.${extension}`;
};

const validateFile = (file: File, options: UploadOptions): string | null => {
  // Verificar tamanho
  if (options.maxSize && file.size > options.maxSize) {
    const sizeMB = (options.maxSize / (1024 * 1024)).toFixed(1);
    return `Arquivo muito grande. Máximo: ${sizeMB}MB`;
  }

  // Verificar tipo
  if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
    return `Tipo de arquivo não permitido. Tipos aceitos: ${options.allowedTypes.join(', ')}`;
  }

  return null;
};

const compressImage = async (file: File, quality: number): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calcular dimensões mantendo proporção
      const maxWidth = 1920;
      const maxHeight = 1080;
      
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      // Desenhar imagem comprimida
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        },
        file.type,
        quality / 100
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

const generateThumbnail = async (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const thumbnailSize = 200;
      canvas.width = thumbnailSize;
      canvas.height = thumbnailSize;

      // Calcular crop para manter proporção quadrada
      const { width, height } = img;
      const size = Math.min(width, height);
      const x = (width - size) / 2;
      const y = (height - size) / 2;

      ctx?.drawImage(img, x, y, size, size, 0, 0, thumbnailSize, thumbnailSize);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const thumbnailFile = new File([blob], `thumb_${file.name}`, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(thumbnailFile);
          } else {
            resolve(file);
          }
        },
        file.type,
        0.8
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

// =============================================================================
// SERVIÇO PRINCIPAL
// =============================================================================

export class MediaUploadService {
  private static instance: MediaUploadService;

  static getInstance(): MediaUploadService {
    if (!MediaUploadService.instance) {
      MediaUploadService.instance = new MediaUploadService();
    }
    return MediaUploadService.instance;
  }

  /**
   * Upload de arquivo único
   */
  async uploadFile(
    file: File, 
    options: UploadOptions = {},
    onProgress?: (progress: number) => void
  ): Promise<UploadResult> {
    const config = { ...DEFAULT_OPTIONS, ...options };
    
    // Validar arquivo
    const validationError = validateFile(file, config);
    if (validationError) {
      throw new Error(validationError);
    }

    // Obter usuário atual
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('Usuário não autenticado');
    }

    // Processar arquivo
    let processedFile = file;
    
    if (file.type.startsWith('image/') && config.quality && config.quality < 100) {
      onProgress?.(10);
      processedFile = await compressImage(file, config.quality);
    }

    // Gerar caminho do arquivo
    const fileName = generateFileName(file.name, user.id);
    const filePath = config.folder ? `${config.folder}/${fileName}` : fileName;

    onProgress?.(30);

    // Upload principal
    const { data, error } = await supabase.storage
      .from(config.bucket!)
      .upload(filePath, processedFile, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(`Erro no upload: ${error.message}`);
    }

    onProgress?.(70);

    // Obter URL pública
    const { data: { publicUrl } } = supabase.storage
      .from(config.bucket!)
      .getPublicUrl(data.path);

    onProgress?.(90);

    // Upload de thumbnail se solicitado
    if (config.generateThumbnail && file.type.startsWith('image/')) {
      try {
        const thumbnail = await generateThumbnail(processedFile);
        const thumbPath = filePath.replace(/(\.[^.]+)$/, '_thumb$1');
        
        await supabase.storage
          .from(config.bucket!)
          .upload(thumbPath, thumbnail);
      } catch (error) {
        console.warn('Erro ao gerar thumbnail:', error);
      }
    }

    onProgress?.(100);

    return {
      url: publicUrl,
      path: data.path,
      size: processedFile.size,
      type: processedFile.type,
    };
  }

  /**
   * Upload múltiplo com progresso
   */
  async uploadMultipleFiles(
    files: File[],
    options: UploadOptions = {},
    onProgress?: (fileIndex: number, progress: number) => void,
    onFileComplete?: (fileIndex: number, result: UploadResult) => void,
    onError?: (fileIndex: number, error: string) => void
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const result = await this.uploadFile(
          files[i],
          options,
          (progress) => onProgress?.(i, progress)
        );
        
        results.push(result);
        onFileComplete?.(i, result);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        onError?.(i, errorMessage);
        throw error;
      }
    }

    return results;
  }

  /**
   * Deletar arquivo
   */
  async deleteFile(filePath: string, bucket: string = STORAGE_BUCKETS.QUIZ_IMAGES): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) {
        console.error('Erro ao deletar arquivo:', error);
        return false;
      }

      // Tentar deletar thumbnail também
      const thumbPath = filePath.replace(/(\.[^.]+)$/, '_thumb$1');
      await supabase.storage.from(bucket).remove([thumbPath]);

      return true;
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
      return false;
    }
  }

  /**
   * Obter URL assinada (para arquivos privados)
   */
  async getSignedUrl(
    filePath: string, 
    expiresIn: number = 3600, 
    bucket: string = STORAGE_BUCKETS.QUIZ_IMAGES
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, expiresIn);

      if (error) {
        console.error('Erro ao obter URL assinada:', error);
        return null;
      }

      return data.signedUrl;
    } catch (error) {
      console.error('Erro ao obter URL assinada:', error);
      return null;
    }
  }

  /**
   * Listar arquivos do usuário
   */
  async listUserFiles(
    userId: string,
    bucket: string = STORAGE_BUCKETS.QUIZ_IMAGES,
    folder: string = 'uploads'
  ): Promise<any[]> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(`${folder}/${userId}`, {
          limit: 100,
          offset: 0,
        });

      if (error) {
        console.error('Erro ao listar arquivos:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao listar arquivos:', error);
      return [];
    }
  }
}

// =============================================================================
// HOOK PARA USO EM COMPONENTES
// =============================================================================

export const useMediaUpload = () => {
  const service = MediaUploadService.getInstance();

  return {
    uploadFile: service.uploadFile.bind(service),
    uploadMultipleFiles: service.uploadMultipleFiles.bind(service),
    deleteFile: service.deleteFile.bind(service),
    getSignedUrl: service.getSignedUrl.bind(service),
    listUserFiles: service.listUserFiles.bind(service),
  };
};

// =============================================================================
// EXPORT DEFAULT
// =============================================================================

export default MediaUploadService;
