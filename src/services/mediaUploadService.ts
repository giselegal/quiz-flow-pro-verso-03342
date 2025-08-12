// @ts-nocheck
// =============================================================================
// SERVIÇO DE UPLOAD DE MÍDIA
// Upload de imagens, vídeos e outros arquivos para Supabase Storage
// =============================================================================

import { supabase } from '../lib/supabase';

// =============================================================================
// TIPOS
// =============================================================================

export interface UploadResult {
  success: boolean;
  url?: string;
  publicUrl?: string;
  path?: string;
  error?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export type FileType = 'image' | 'video' | 'audio' | 'document' | 'other';

// =============================================================================
// CONFIGURAÇÕES
// =============================================================================

const STORAGE_BUCKET = 'media-uploads';
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/mov'];
const ALLOWED_AUDIO_TYPES = ['audio/mp3', 'audio/wav', 'audio/ogg'];
const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'text/plain', 'application/msword'];

// =============================================================================
// SERVIÇO DE UPLOAD
// =============================================================================

export class MediaUploadService {
  // =============================================================================
  // VALIDAÇÃO DE ARQUIVOS
  // =============================================================================

  static validateFile(file: File): { valid: boolean; error?: string } {
    // Verificar tamanho
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `Arquivo muito grande. Máximo permitido: ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
      };
    }

    // Verificar tipo
    const allowedTypes = [
      ...ALLOWED_IMAGE_TYPES,
      ...ALLOWED_VIDEO_TYPES,
      ...ALLOWED_AUDIO_TYPES,
      ...ALLOWED_DOCUMENT_TYPES,
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Tipo de arquivo não permitido: ${file.type}`,
      };
    }

    return { valid: true };
  }

  static getFileType(file: File): FileType {
    if (ALLOWED_IMAGE_TYPES.includes(file.type)) return 'image';
    if (ALLOWED_VIDEO_TYPES.includes(file.type)) return 'video';
    if (ALLOWED_AUDIO_TYPES.includes(file.type)) return 'audio';
    if (ALLOWED_DOCUMENT_TYPES.includes(file.type)) return 'document';
    return 'other';
  }

  // =============================================================================
  // GERAÇÃO DE NOMES DE ARQUIVO
  // =============================================================================

  static generateFileName(file: File, prefix: string = ''): string {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');

    return `${prefix}${prefix ? '_' : ''}${timestamp}_${randomId}_${sanitizedName}`;
  }

  static getStoragePath(fileType: FileType, fileName: string): string {
    return `${fileType}s/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${fileName}`;
  }

  // =============================================================================
  // UPLOAD DE ARQUIVO ÚNICO
  // =============================================================================

  static async uploadFile(
    file: File,
    options: {
      folder?: string;
      prefix?: string;
      onProgress?: (progress: UploadProgress) => void;
    } = {}
  ): Promise<UploadResult> {
    try {
      // Validar arquivo
      const validation = this.validateFile(file);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error,
        };
      }

      // Gerar nome e caminho do arquivo
      const fileName = this.generateFileName(file, options.prefix);
      const fileType = this.getFileType(file);
      const storagePath = options.folder
        ? `${options.folder}/${fileName}`
        : this.getStoragePath(fileType, fileName);

      console.log('📤 [Upload] Starting upload:', {
        fileName,
        fileType,
        storagePath,
        fileSize: file.size,
      });

      // Simular progresso (Supabase não tem callback de progresso nativo)
      if (options.onProgress) {
        options.onProgress({ loaded: 0, total: file.size, percentage: 0 });
      }

      // Upload para Supabase Storage
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('❌ [Upload] Supabase upload failed:', error);
        return {
          success: false,
          error: error.message,
        };
      }

      // Simular progresso completo
      if (options.onProgress) {
        options.onProgress({
          loaded: file.size,
          total: file.size,
          percentage: 100,
        });
      }

      // Obter URL pública
      const { data: publicUrlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(storagePath);

      console.log('✅ [Upload] Upload successful:', {
        path: data.path,
        publicUrl: publicUrlData.publicUrl,
      });

      return {
        success: true,
        path: data.path,
        publicUrl: publicUrlData.publicUrl,
        url: publicUrlData.publicUrl,
        fileName,
        fileSize: file.size,
        fileType: file.type,
      };
    } catch (error) {
      console.error('❌ [Upload] Upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido no upload',
      };
    }
  }

  // =============================================================================
  // UPLOAD MÚLTIPLO
  // =============================================================================

  static async uploadMultipleFiles(
    files: FileList | File[],
    options: {
      folder?: string;
      prefix?: string;
      onProgress?: (fileIndex: number, progress: UploadProgress) => void;
      onFileComplete?: (fileIndex: number, result: UploadResult) => void;
    } = {}
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = [];
    const fileArray = Array.from(files);

    console.log(`📤 [Upload] Starting batch upload of ${fileArray.length} files`);

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];

      const result = await this.uploadFile(file, {
        folder: options.folder,
        prefix: options.prefix,
        onProgress: progress => options.onProgress?.(i, progress),
      });

      results.push(result);
      options.onFileComplete?.(i, result);
    }

    console.log(
      `✅ [Upload] Batch upload complete. Success: ${results.filter(r => r.success).length}/${results.length}`
    );
    return results;
  }

  // =============================================================================
  // UPLOAD DE IMAGEM COM OTIMIZAÇÃO
  // =============================================================================

  static async uploadImage(
    file: File,
    options: {
      folder?: string;
      prefix?: string;
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
      onProgress?: (progress: UploadProgress) => void;
    } = {}
  ): Promise<UploadResult> {
    try {
      // Verificar se é imagem
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return {
          success: false,
          error: 'Arquivo não é uma imagem válida',
        };
      }

      let processedFile = file;

      // Otimizar imagem se parâmetros fornecidos
      if (options.maxWidth || options.maxHeight || options.quality) {
        processedFile = await this.optimizeImage(file, {
          maxWidth: options.maxWidth || 1920,
          maxHeight: options.maxHeight || 1080,
          quality: options.quality || 0.8,
        });
      }

      return await this.uploadFile(processedFile, {
        folder: options.folder || 'images',
        prefix: options.prefix,
        onProgress: options.onProgress,
      });
    } catch (error) {
      console.error('❌ [Upload] Image upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro no upload da imagem',
      };
    }
  }

  // =============================================================================
  // OTIMIZAÇÃO DE IMAGEM
  // =============================================================================

  private static optimizeImage(
    file: File,
    options: {
      maxWidth: number;
      maxHeight: number;
      quality: number;
    }
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calcular dimensões mantendo proporção
        let { width, height } = img;

        if (width > options.maxWidth) {
          height = (height * options.maxWidth) / width;
          width = options.maxWidth;
        }

        if (height > options.maxHeight) {
          width = (width * options.maxHeight) / height;
          height = options.maxHeight;
        }

        // Redimensionar no canvas
        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);

        // Converter para blob
        canvas.toBlob(
          blob => {
            if (blob) {
              const optimizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(optimizedFile);
            } else {
              reject(new Error('Falha na otimização da imagem'));
            }
          },
          file.type,
          options.quality
        );
      };

      img.onerror = () => reject(new Error('Falha ao carregar imagem'));
      img.src = URL.createObjectURL(file);
    });
  }

  // =============================================================================
  // REMOÇÃO DE ARQUIVOS
  // =============================================================================

  static async deleteFile(path: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([path]);

      if (error) {
        console.error('❌ [Upload] Delete failed:', error);
        return { success: false, error: error.message };
      }

      console.log('🗑️ [Upload] File deleted successfully:', path);
      return { success: true };
    } catch (error) {
      console.error('❌ [Upload] Delete error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao deletar arquivo',
      };
    }
  }

  // =============================================================================
  // LISTAGEM DE ARQUIVOS
  // =============================================================================

  static async listFiles(
    folder: string = ''
  ): Promise<{ success: boolean; files?: any[]; error?: string }> {
    try {
      const { data, error } = await supabase.storage.from(STORAGE_BUCKET).list(folder);

      if (error) {
        console.error('❌ [Upload] List failed:', error);
        return { success: false, error: error.message };
      }

      return { success: true, files: data };
    } catch (error) {
      console.error('❌ [Upload] List error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao listar arquivos',
      };
    }
  }
}

// =============================================================================
// HOOK PARA REACT
// =============================================================================

export const useMediaUpload = () => {
  return {
    uploadFile: MediaUploadService.uploadFile,
    uploadMultipleFiles: MediaUploadService.uploadMultipleFiles,
    uploadImage: MediaUploadService.uploadImage,
    deleteFile: MediaUploadService.deleteFile,
    listFiles: MediaUploadService.listFiles,
    validateFile: MediaUploadService.validateFile,
    getFileType: MediaUploadService.getFileType,
  };
};
