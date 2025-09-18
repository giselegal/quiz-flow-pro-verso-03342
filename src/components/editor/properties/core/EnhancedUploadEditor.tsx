import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Upload,
    X,
    Video,
    File,
    Link,
    CheckCircle,
    AlertCircle,
    RotateCcw,
    Eye,
    Download
} from 'lucide-react';
import ContextualTooltip, { tooltipLibrary } from './ContextualTooltip';
import type { PropertyEditorProps } from './types';

interface UploadConfig {
    maxSize: number; // em MB
    acceptedTypes: string[];
    multiple: boolean;
    storage: 'url' | 'local' | 'cloud';
}

interface FilePreview {
    name: string;
    size: number;
    type: string;
    url: string;
    status: 'uploading' | 'success' | 'error';
    progress?: number;
    error?: string;
}

/**
 * Editor avançado de upload com drag & drop, preview e validação
 * Features: Múltiplos files, preview de mídia, validação, storage flexível
 */
const EnhancedUploadEditor: React.FC<PropertyEditorProps> = ({
    property,
    onChange
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Configuração baseada na propriedade
    const config: UploadConfig = {
        maxSize: (property as any).maxSize || 10,
        acceptedTypes: (property as any).acceptedTypes || ['image/*', 'video/*', 'audio/*'],
        multiple: (property as any).multiple || false,
        storage: (property as any).storage || 'url',
        ...(property as any).uploadConfig
    };

    // Estado
    const [files, setFiles] = useState<FilePreview[]>([]);
    const [dragOver, setDragOver] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');

    // Inicializar com valor atual
    React.useEffect(() => {
        const currentValue = property.value;
        if (typeof currentValue === 'string' && currentValue.trim()) {
            setFiles([{
                name: 'Current Media',
                size: 0,
                type: getTypeFromUrl(currentValue),
                url: currentValue,
                status: 'success'
            }]);
        }
    }, [property.value]);

    const getTypeFromUrl = (url: string): string => {
        if (/\.(jpe?g|png|gif|webp|svg)(\?.*)?$/i.test(url)) return 'image';
        if (/\.(mp4|webm|ogg|avi|mov)(\?.*)?$/i.test(url)) return 'video';
        if (/\.(mp3|wav|ogg|aac)(\?.*)?$/i.test(url)) return 'audio';
        return 'file';
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const validateFile = (file: File): string | null => {
        // Verificar tamanho
        if (file.size > config.maxSize * 1024 * 1024) {
            return `Arquivo muito grande. Máximo: ${config.maxSize}MB`;
        }

        // Verificar tipo
        const isValidType = config.acceptedTypes.some(type => {
            if (type.endsWith('/*')) {
                const category = type.replace('/*', '');
                return file.type.startsWith(category);
            }
            return file.type === type;
        });

        if (!isValidType) {
            return `Tipo não suportado. Aceitos: ${config.acceptedTypes.join(', ')}`;
        }

        return null;
    };

    const handleFileSelect = (selectedFiles: File[]) => {
        const newFiles: FilePreview[] = [];

        for (const file of selectedFiles) {
            const validation = validateFile(file);

            if (validation) {
                newFiles.push({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    url: '',
                    status: 'error',
                    error: validation
                });
                continue;
            }

            // Criar preview URL
            const previewUrl = URL.createObjectURL(file);

            newFiles.push({
                name: file.name,
                size: file.size,
                type: file.type,
                url: previewUrl,
                status: 'uploading',
                progress: 0
            });

            // Simular upload (em produção, usar storage real)
            simulateUpload(file, previewUrl);
        }

        if (config.multiple) {
            setFiles(prev => [...prev, ...newFiles]);
        } else {
            setFiles(newFiles);
            if (newFiles.length > 0 && newFiles[0].status !== 'error') {
                onChange(property.key, newFiles[0].url);
            }
        }
    };

    const simulateUpload = async (_file: File, previewUrl: string) => {
        // Simular progresso de upload
        for (let progress = 0; progress <= 100; progress += 10) {
            await new Promise(resolve => setTimeout(resolve, 100));

            setFiles(prev => prev.map(f =>
                f.url === previewUrl
                    ? { ...f, progress, status: progress === 100 ? 'success' : 'uploading' }
                    : f
            ));
        }

        // Em produção: fazer upload real para storage
        const finalUrl = previewUrl; // Por enquanto usar preview URL

        setFiles(prev => prev.map(f =>
            f.url === previewUrl
                ? { ...f, url: finalUrl, status: 'success' }
                : f
        ));

        // Atualizar propriedade
        if (!config.multiple) {
            onChange(property.key, finalUrl);
        } else {
            const allUrls = files.filter(f => f.status === 'success').map(f => f.url);
            onChange(property.key, allUrls);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        handleFileSelect(droppedFiles);
    }, [config]);

    const handleUrlAdd = () => {
        if (!urlInput.trim()) return;

        const newFile: FilePreview = {
            name: 'URL Media',
            size: 0,
            type: getTypeFromUrl(urlInput),
            url: urlInput,
            status: 'success'
        };

        if (config.multiple) {
            setFiles(prev => [...prev, newFile]);
            const allUrls = [...files.filter(f => f.status === 'success').map(f => f.url), urlInput];
            onChange(property.key, allUrls);
        } else {
            setFiles([newFile]);
            onChange(property.key, urlInput);
        }

        setUrlInput('');
    };

    const removeFile = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);

        if (config.multiple) {
            const urls = newFiles.filter(f => f.status === 'success').map(f => f.url);
            onChange(property.key, urls);
        } else {
            onChange(property.key, newFiles[0]?.url || '');
        }
    };

    const clearAll = () => {
        setFiles([]);
        onChange(property.key, config.multiple ? [] : '');
    };

    const renderFilePreview = (file: FilePreview, index: number) => {
        const isImage = file.type.includes('image') || file.type === 'image';
        const isVideo = file.type.includes('video') || file.type === 'video';
        const isAudio = file.type.includes('audio') || file.type === 'audio';

        return (
            <div key={index} className="relative group border rounded-lg p-3 bg-white">
                <div className="flex items-start gap-3">
                    {/* Preview */}
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                        {isImage && file.url ? (
                            <img
                                src={file.url}
                                alt={file.name}
                                className="w-full h-full object-cover"
                                onError={(e: any) => e.currentTarget.style.display = 'none'}
                            />
                        ) : isVideo && file.url ? (
                            <video
                                src={file.url}
                                className="w-full h-full object-cover"
                                muted
                                controls={false}
                            />
                        ) : isAudio ? (
                            <div className="text-blue-500">
                                <Video className="w-6 h-6" />
                            </div>
                        ) : (
                            <File className="w-6 h-6 text-gray-400" />
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-medium truncate">{file.name}</h4>
                            <div className="flex items-center gap-1">
                                {file.status === 'success' && (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                )}
                                {file.status === 'error' && (
                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFile(index)}
                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                >
                                    <X className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            {file.size > 0 && <span>{formatFileSize(file.size)}</span>}
                            <Badge variant="outline" className="text-xs">
                                {file.type}
                            </Badge>
                        </div>

                        {file.status === 'uploading' && file.progress !== undefined && (
                            <Progress value={file.progress} className="h-1 mt-2" />
                        )}

                        {file.status === 'error' && file.error && (
                            <p className="text-xs text-red-500 mt-1">{file.error}</p>
                        )}

                        {file.url && file.status === 'success' && (
                            <div className="flex gap-1 mt-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-6 px-2 text-xs"
                                    onClick={() => window.open(file.url, '_blank')}
                                >
                                    <Eye className="w-3 h-3 mr-1" />
                                    View
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-6 px-2 text-xs"
                                    onClick={() => {
                                        const a = document.createElement('a');
                                        a.href = file.url;
                                        a.download = file.name;
                                        a.click();
                                    }}
                                >
                                    <Download className="w-3 h-3 mr-1" />
                                    Save
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Card className="w-full">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Upload className="w-4 h-4 text-blue-600" />
                        <CardTitle className="text-sm">{property.label}</CardTitle>
                        <ContextualTooltip info={tooltipLibrary.upload} compact />
                    </div>
                    <div className="flex items-center gap-2">
                        <Select value={uploadMode} onValueChange={(v: any) => setUploadMode(v)}>
                            <SelectTrigger className="w-20 h-6 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="url">URL</SelectItem>
                                <SelectItem value="file">File</SelectItem>
                            </SelectContent>
                        </Select>
                        {files.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearAll}
                                className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
                            >
                                <RotateCcw className="w-3 h-3 mr-1" />
                                Clear
                            </Button>
                        )}
                    </div>
                </div>
                {property.description && (
                    <p className="text-xs text-muted-foreground">{property.description}</p>
                )}
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Upload Area */}
                {uploadMode === 'url' ? (
                    <div className="space-y-2">
                        <Label className="text-xs">Media URL:</Label>
                        <div className="flex gap-2">
                            <Input
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                className="text-sm"
                                onKeyPress={(e) => e.key === 'Enter' && handleUrlAdd()}
                            />
                            <Button
                                onClick={handleUrlAdd}
                                disabled={!urlInput.trim()}
                                size="sm"
                                className="px-3"
                            >
                                <Link className="w-3 h-3 mr-1" />
                                Add
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div
                        className={`
              border-2 border-dashed rounded-lg p-6 text-center transition-colors
              ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
              hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer
            `}
                        onDrop={handleDrop}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setDragOver(true);
                        }}
                        onDragLeave={() => setDragOver(false)}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-700 mb-1">
                            Drop files here or click to select
                        </p>
                        <p className="text-xs text-gray-500">
                            Max {config.maxSize}MB • {config.acceptedTypes.join(', ')}
                            {config.multiple && ' • Multiple files allowed'}
                        </p>

                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple={config.multiple}
                            accept={config.acceptedTypes.join(',')}
                            onChange={(e) => {
                                if (e.target.files) {
                                    handleFileSelect(Array.from(e.target.files));
                                }
                            }}
                            className="hidden"
                        />
                    </div>
                )}

                {/* Files List */}
                {files.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium">
                                {config.multiple ? `Files (${files.length})` : 'Current File'}:
                            </Label>
                            <Badge variant="secondary" className="text-xs">
                                {files.filter(f => f.status === 'success').length} ready
                            </Badge>
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {files.map(renderFilePreview)}
                        </div>
                    </div>
                )}

                {/* Info */}
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                        <strong>Storage:</strong> {config.storage === 'url' ? 'URL Links' : 'File Upload'} •
                        <strong>Max Size:</strong> {config.maxSize}MB •
                        <strong>Types:</strong> {config.acceptedTypes.join(', ')}
                        {config.multiple && ' • Multiple files supported'}
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    );
};

export default EnhancedUploadEditor;
