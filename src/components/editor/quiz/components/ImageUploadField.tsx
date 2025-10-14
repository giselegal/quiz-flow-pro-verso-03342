import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, X, ExternalLink } from 'lucide-react';
import { openCloudinaryWidget } from '@/utils/cloudinary';
import { CLOUDINARY_CONFIG } from '@/config/cloudinaryImages';

export interface ImageUploadFieldProps {
    value: string;
    onChange: (url: string) => void;
    placeholder?: string;
    className?: string;
}

/**
 * 🖼️ Campo de Upload de Imagem com Preview
 * 
 * Permite:
 * - Upload via Cloudinary Widget
 * - Inserir URL manualmente
 * - Preview da imagem em miniatura
 * - Remover imagem
 */
export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
    value,
    onChange,
    placeholder = 'URL da imagem',
    className = ''
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [showUrlInput, setShowUrlInput] = useState(false);

    const handleUpload = async () => {
        try {
            setIsUploading(true);
            setUploadError(null);

            // Abrir widget do Cloudinary
            const url = await openCloudinaryWidget({
                cloudName: CLOUDINARY_CONFIG.MAIN_CLOUD,
                uploadPreset: 'ml_default' // Você pode configurar um preset no Cloudinary
            });

            onChange(url);
            setShowUrlInput(false);
        } catch (error) {
            console.error('Erro ao fazer upload:', error);
            setUploadError('Erro ao fazer upload. Tente novamente.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = () => {
        onChange('');
        setUploadError(null);
    };

    const handleUrlChange = (newUrl: string) => {
        onChange(newUrl);
        setUploadError(null);
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {/* Preview da imagem */}
            {value && (
                <div className="relative inline-block">
                    <img
                        src={value}
                        alt="Preview"
                        className="h-24 w-24 rounded-lg object-cover border-2 border-slate-200 shadow-sm"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            setUploadError('Erro ao carregar imagem');
                        }}
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"
                        title="Remover imagem"
                    >
                        <X className="w-3 h-3" />
                    </button>
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
                    <Upload className="w-4 h-4 mr-2" />
                    {isUploading ? 'Enviando...' : 'Upload'}
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    title="Inserir URL manualmente"
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
                />
            )}

            {/* Mensagem de erro */}
            {uploadError && (
                <p className="text-xs text-red-500">{uploadError}</p>
            )}

            {/* URL atual (compacta) */}
            {value && !showUrlInput && (
                <p className="text-[10px] text-muted-foreground truncate" title={value}>
                    {value}
                </p>
            )}
        </div>
    );
};

export default ImageUploadField;
