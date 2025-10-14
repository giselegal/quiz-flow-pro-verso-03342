export interface CloudinaryOptions {
    cloudName: string;
    uploadPreset: string;
    // Novas opções avançadas
    cropping?: boolean;
    croppingAspectRatio?: number;
    maxFileSize?: number; // em bytes
    clientAllowedFormats?: string[];
    maxImageWidth?: number;
    maxImageHeight?: number;
    folder?: string;
    resourceType?: 'image' | 'video' | 'raw' | 'auto';
    multiple?: boolean;
}

export interface CloudinaryUploadProgress {
    loaded: number;
    total: number;
    percentage: number;
}

export interface CloudinaryUploadResult {
    url: string;
    secureUrl: string;
    publicId: string;
    format: string;
    width: number;
    height: number;
    bytes: number;
}

declare global {
    interface Window {
        cloudinary?: any;
        __USE_CLOUDINARY__?: boolean;
    }
}

/**
 * 🔧 Configurações padrão otimizadas para upload de imagens
 */
export const DEFAULT_UPLOAD_OPTIONS: Partial<CloudinaryOptions> = {
    cropping: true,
    croppingAspectRatio: null as any, // permite qualquer proporção
    maxFileSize: 10485760, // 10MB
    clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    maxImageWidth: 2000,
    maxImageHeight: 2000,
    resourceType: 'image',
    multiple: false
};

/**
 * Abre o widget do Cloudinary com opções avançadas
 * 
 * @param opts - Opções de configuração
 * @param onProgress - Callback para progresso do upload (opcional)
 * @returns Promise com a URL da imagem ou resultado completo
 */
export function openCloudinaryWidget(
    opts: CloudinaryOptions,
    onProgress?: (progress: CloudinaryUploadProgress) => void
): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
        try {
            if (!window.cloudinary) {
                return reject(new Error('Cloudinary widget indisponível. Verifique se o script foi carregado.'));
            }

            // Mesclar opções padrão com as fornecidas
            const options = {
                cloudName: opts.cloudName,
                uploadPreset: opts.uploadPreset,
                cropping: opts.cropping ?? DEFAULT_UPLOAD_OPTIONS.cropping,
                croppingAspectRatio: opts.croppingAspectRatio ?? DEFAULT_UPLOAD_OPTIONS.croppingAspectRatio,
                maxFileSize: opts.maxFileSize ?? DEFAULT_UPLOAD_OPTIONS.maxFileSize,
                clientAllowedFormats: opts.clientAllowedFormats ?? DEFAULT_UPLOAD_OPTIONS.clientAllowedFormats,
                maxImageWidth: opts.maxImageWidth ?? DEFAULT_UPLOAD_OPTIONS.maxImageWidth,
                maxImageHeight: opts.maxImageHeight ?? DEFAULT_UPLOAD_OPTIONS.maxImageHeight,
                folder: opts.folder ?? 'quiz-images',
                resourceType: opts.resourceType ?? DEFAULT_UPLOAD_OPTIONS.resourceType,
                multiple: opts.multiple ?? DEFAULT_UPLOAD_OPTIONS.multiple,
                // Configurações de UI
                showSkipCropButton: false,
                croppingShowDimensions: true,
                croppingValidateDimensions: true,
                // Transformações automáticas para otimização
                eager: 'f_auto,q_auto:good',
                // Textos em português
                text: {
                    'or': 'ou',
                    'back': 'Voltar',
                    'advanced': 'Avançado',
                    'close': 'Fechar',
                    'no_results': 'Nenhum resultado',
                    'search_placeholder': 'Buscar arquivos',
                    'about_uw': 'Sobre o Upload Widget',
                    'menu': {
                        'files': 'Meus Arquivos',
                        'web': 'Web',
                        'camera': 'Câmera',
                        'url': 'URL'
                    }
                }
            };

            const widget = window.cloudinary.createUploadWidget(
                options,
                (error: any, result: any) => {
                    if (error) {
                        console.error('❌ Erro no upload Cloudinary:', error);
                        return reject(error);
                    }

                    // Eventos do widget
                    if (result && result.event) {
                        switch (result.event) {
                            case 'upload-added':
                                console.log('📤 Upload iniciado');
                                break;

                            case 'upload-progress':
                                if (onProgress && result.info) {
                                    const progress: CloudinaryUploadProgress = {
                                        loaded: result.info.loaded || 0,
                                        total: result.info.total || 0,
                                        percentage: Math.round(((result.info.loaded || 0) / (result.info.total || 1)) * 100)
                                    };
                                    onProgress(progress);
                                }
                                break;

                            case 'success':
                                console.log('✅ Upload concluído com sucesso');
                                const uploadResult: CloudinaryUploadResult = {
                                    url: result.info.url,
                                    secureUrl: result.info.secure_url,
                                    publicId: result.info.public_id,
                                    format: result.info.format,
                                    width: result.info.width,
                                    height: result.info.height,
                                    bytes: result.info.bytes
                                };
                                widget.close();
                                resolve(uploadResult);
                                break;

                            case 'abort':
                                console.log('🚫 Upload cancelado');
                                reject(new Error('Upload cancelado pelo usuário'));
                                break;
                        }
                    }
                }
            );

            widget.open();
        } catch (e) {
            console.error('❌ Erro ao abrir widget:', e);
            reject(e);
        }
    });
}

/**
 * Função legada para compatibilidade (retorna apenas a URL)
 */
export function openCloudinaryWidgetSimple(opts: CloudinaryOptions): Promise<string> {
    return openCloudinaryWidget(opts).then(result => result.secureUrl);
}

