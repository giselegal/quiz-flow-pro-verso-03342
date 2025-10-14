import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, X, ExternalLink, Crop, Image as ImageIcon } from 'lucide-react';
import { openCloudinaryWidget, CloudinaryUploadProgress, CloudinaryUploadResult } from '@/utils/cloudinary';
import { CLOUDINARY_CONFIG } from '@/config/cloudinaryImages';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export interface ImageUploadFieldProps {
    value: string;
    onChange: (url: string) => void;
    placeholder?: string;
    className?: string;
    /** Permitir crop antes do upload */
    enableCrop?: boolean;
    /** Proporção de aspecto para crop (ex: 16/9, 1, 4/3) */
    cropAspectRatio?: number;
    /** Largura máxima da imagem */
    maxWidth?: number;
    /** Altura máxima da imagem */
    maxHeight?: number;
    /** Tamanho máximo do arquivo em MB */
    maxFileSizeMB?: number;
}

/**
 * 🖼️ Campo de Upload de Imagem Avançado com Preview
 * 
 * Funcionalidades:
 * ✅ Upload via Cloudinary Widget
 * ✅ Validação de tipo de arquivo (apenas imagens)
 * ✅ Compressão automática (f_auto, q_auto)
 * ✅ Crop/edição antes do upload
 * ✅ Progress bar durante upload
 * ✅ Inserir URL manualmente
 * ✅ Preview em miniatura
 * ✅ Remover imagem
 */
export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
    value,
    onChange,
    placeholder = 'URL da imagem',
    className = '',
    enableCrop = true,
    cropAspectRatio,
    maxWidth = 2000,
    maxHeight = 2000,
    maxFileSizeMB = 10
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [uploadInfo, setUploadInfo] = useState<CloudinaryUploadResult | null>(null);

    const handleUpload = async () => {
        try {
            setIsUploading(true);
            setUploadError(null);
            setUploadProgress(0);
            setUploadInfo(null);

            // Configurar opções do Cloudinary
            const result = await openCloudinaryWidget(
                {
                    cloudName: CLOUDINARY_CONFIG.MAIN_CLOUD,
                    uploadPreset: 'ml_default',
                    // ✅ Validação de tipo (apenas imagens)
                    clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
                    // ✅ Crop habilitado
                    cropping: enableCrop,
                    croppingAspectRatio: cropAspectRatio,
                    // ✅ Limites de tamanho
                    maxImageWidth: maxWidth,
                    maxImageHeight: maxHeight,
                    maxFileSize: maxFileSizeMB * 1024 * 1024, // converter MB para bytes
                    // ✅ Pasta organizada
                    folder: 'quiz-images',
                    // Apenas imagens
                    resourceType: 'image'
                },
                // ✅ Callback de progresso
                (progress: CloudinaryUploadProgress) => {
                    setUploadProgress(progress.percentage);
                }
            );

            // Sucesso! Armazenar informações e URL otimizada
            setUploadInfo(result);
            onChange(result.secureUrl);
            setShowUrlInput(false);
            setUploadProgress(100);

            // Limpar progresso após 2 segundos
            setTimeout(() => setUploadProgress(0), 2000);

        } catch (error: any) {
            console.error('Erro ao fazer upload:', error);

            // Mensagens de erro amigáveis
            let errorMessage = 'Erro ao fazer upload. Tente novamente.';

            if (error.message?.includes('cancelado')) {
                errorMessage = 'Upload cancelado.';
            } else if (error.message?.includes('indisponível')) {
                errorMessage = 'Serviço de upload indisponível. Recarregue a página.';
            } else if (error.message?.includes('size')) {
                errorMessage = `Arquivo muito grande. Máximo: ${maxFileSizeMB}MB`;
            }

            setUploadError(errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = () => {
        onChange('');
        setUploadError(null);
        setUploadInfo(null);
        setUploadProgress(0);
    };

    const handleUrlChange = (newUrl: string) => {
        onChange(newUrl);
        setUploadError(null);
        setUploadInfo(null);
    };

    return (
        <div className={cn('space-y-2', className)}>
            {/* Preview da imagem */}
            {value && (
                <div className="relative inline-block group">
                    <img
                        src={value}
                        alt="Preview"
                        className="h-24 w-24 rounded-lg object-cover border-2 border-slate-200 shadow-sm transition-all group-hover:border-slate-400"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            setUploadError('Erro ao carregar imagem');
                        }}
                    />
                    {/* Badge com informações da imagem */}
                    {uploadInfo && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[8px] px-1 py-0.5 rounded-b-lg">
                            {uploadInfo.width}x{uploadInfo.height}px · {(uploadInfo.bytes / 1024).toFixed(0)}KB
                        </div>
                    )}
                    {/* Botão remover */}
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md transition-colors opacity-0 group-hover:opacity-100"
                        title="Remover imagem"
                    >
                        <X className="w-3 h-3" />
                    </button>
                    {/* Indicador de crop habilitado */}
                    {enableCrop && (
                        <div className="absolute top-1 left-1 bg-green-500/80 text-white rounded-full p-0.5" title="Crop habilitado">
                            <Crop className="w-3 h-3" />
                        </div>
                    )}
                </div>
            )}

            {/* Progress Bar durante upload */}
            {isUploading && uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-1">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-xs text-center text-muted-foreground">
                        Enviando... {uploadProgress}%
                    </p>
                </div>
            )}

            {/* Botões de ação */}
            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="flex-1"
                >
                    {isUploading ? (
                        <>
                            <Upload className="w-4 h-4 mr-2 animate-pulse" />
                            Enviando...
                        </>
                    ) : (
                        <>
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Upload{enableCrop && ' + Crop'}
                        </>
                    )}
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    title="Inserir URL manualmente"
                    disabled={isUploading}
                >
                    <ExternalLink className="w-4 h-4" />
                </Button>
            </div>

            {/* Campo de URL manual (opcional) */}
            {showUrlInput && (
                <Input
                    type="url"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    className="text-xs"
                    disabled={isUploading}
                />
            )}

            {/* Mensagem de erro */}
            {uploadError && (
                <div className="flex items-start gap-1 text-xs text-red-500 bg-red-50 p-2 rounded">
                    <span>⚠️</span>
                    <span>{uploadError}</span>
                </div>
            )}

            {/* Informações técnicas (compactas) */}
            {value && !showUrlInput && (
                <div className="text-[9px] text-muted-foreground space-y-0.5">
                    <p className="truncate" title={value}>{value}</p>
                    {uploadInfo && (
                        <p className="text-green-600">
                            ✓ Otimizado · {uploadInfo.format.toUpperCase()} · Compressão automática
                        </p>
                    )}
                </div>
            )}

            {/* Dica de uso */}
            {!value && !isUploading && (
                <p className="text-[10px] text-muted-foreground italic">
                    {enableCrop && cropAspectRatio
                        ? `💡 Proporção: ${cropAspectRatio.toFixed(2)} · Máx: ${maxFileSizeMB}MB`
                        : `💡 Formatos: JPG, PNG, GIF, WebP · Máx: ${maxFileSizeMB}MB`
                    }
                </p>
            )}
        </div>
    );
};

export default ImageUploadField;
