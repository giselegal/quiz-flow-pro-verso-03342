/**
 * 🎨 BRAND KIT MANAGER
 * 
 * Centraliza configurações de marca/identidade visual separadas das propriedades visuais
 * Implementa separação GESTÃO (painel) vs CRIAÇÃO (editor)
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Palette,
    Type,
    Image as ImageIcon,
    Upload,
    Download,
    Save,
    RefreshCw,
    Eye,
    Copy
} from 'lucide-react';

interface BrandColors {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    muted: string;
}

interface BrandFonts {
    heading: string;
    body: string;
    accent?: string;
}

interface BrandAssets {
    logo: string;
    favicon: string;
    backgroundImage?: string;
    watermark?: string;
}

interface BrandKitConfig {
    colors: BrandColors;
    fonts: BrandFonts;
    assets: BrandAssets;
    name: string;
    description: string;
    lastModified: string;
}

interface BrandKitManagerProps {
    className?: string;
    onBrandUpdate?: (brandKit: BrandKitConfig) => void;
}

const DEFAULT_BRAND_KIT: BrandKitConfig = {
    colors: {
        primary: '#B89B7A',
        secondary: '#432818',
        accent: '#E6DDD4',
        background: '#FAF9F7',
        text: '#432818',
        muted: '#8F7A6A'
    },
    fonts: {
        heading: 'Playfair Display, serif',
        body: 'Inter, sans-serif'
    },
    assets: {
        logo: '/logo.png',
        favicon: '/favicon.ico'
    },
    name: 'Brand Kit Padrão',
    description: 'Configurações de marca padrão do sistema',
    lastModified: new Date().toISOString()
};

const BrandKitManager: React.FC<BrandKitManagerProps> = ({
    className = '',
    onBrandUpdate
}) => {
    const [brandKit, setBrandKit] = useState<BrandKitConfig>(DEFAULT_BRAND_KIT);
    const [activeTab, setActiveTab] = useState('colors');
    const [isLoading, setIsLoading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Carregar brand kit salvo
    useEffect(() => {
        const saved = localStorage.getItem('brand-kit-config');
        if (saved) {
            try {
                setBrandKit(JSON.parse(saved));
            } catch (error) {
                console.warn('Erro ao carregar brand kit:', error);
            }
        }
    }, []);

    const handleColorChange = (colorKey: keyof BrandColors, value: string) => {
        setBrandKit(prev => ({
            ...prev,
            colors: {
                ...prev.colors,
                [colorKey]: value
            },
            lastModified: new Date().toISOString()
        }));
        setHasChanges(true);
    };

    const handleFontChange = (fontKey: keyof BrandFonts, value: string) => {
        setBrandKit(prev => ({
            ...prev,
            fonts: {
                ...prev.fonts,
                [fontKey]: value
            },
            lastModified: new Date().toISOString()
        }));
        setHasChanges(true);
    };

    const handleAssetChange = (assetKey: keyof BrandAssets, value: string) => {
        setBrandKit(prev => ({
            ...prev,
            assets: {
                ...prev.assets,
                [assetKey]: value
            },
            lastModified: new Date().toISOString()
        }));
        setHasChanges(true);
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            localStorage.setItem('brand-kit-config', JSON.stringify(brandKit));
            onBrandUpdate?.(brandKit);
            setHasChanges(false);

            // Aplicar CSS variables globalmente
            const root = document.documentElement;
            root.style.setProperty('--brand-primary', brandKit.colors.primary);
            root.style.setProperty('--brand-secondary', brandKit.colors.secondary);
            root.style.setProperty('--brand-accent', brandKit.colors.accent);
            root.style.setProperty('--brand-background', brandKit.colors.background);
            root.style.setProperty('--brand-text', brandKit.colors.text);
            root.style.setProperty('--brand-muted', brandKit.colors.muted);

        } catch (error) {
            console.error('Erro ao salvar brand kit:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setBrandKit(DEFAULT_BRAND_KIT);
        setHasChanges(true);
    };

    const exportBrandKit = () => {
        const dataStr = JSON.stringify(brandKit, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `brand-kit-${Date.now()}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const importBrandKit = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target?.result as string);
                setBrandKit({
                    ...imported,
                    lastModified: new Date().toISOString()
                });
                setHasChanges(true);
            } catch (error) {
                console.error('Erro ao importar brand kit:', error);
                alert('Erro ao importar arquivo. Verifique se é um JSON válido.');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Palette className="w-5 h-5 text-purple-600" />
                            <span>Brand Kit Manager</span>
                            {hasChanges && (
                                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                                    Não salvo
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={handleReset}
                                variant="outline"
                                size="sm"
                                className="text-gray-600"
                            >
                                <RefreshCw className="w-4 h-4 mr-1" />
                                Reset
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={isLoading || !hasChanges}
                                className="bg-purple-600 hover:bg-purple-700"
                                size="sm"
                            >
                                {isLoading ? (
                                    <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4 mr-1" />
                                )}
                                Salvar Brand Kit
                            </Button>
                        </div>
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                        Configure a identidade visual global dos seus funis: cores, fontes e assets.
                    </p>
                </CardHeader>
            </Card>

            {/* Brand Kit Content */}
            <Card>
                <CardContent className="p-0">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <div className="border-b px-6 pt-6">
                            <TabsList className="grid grid-cols-4 w-full max-w-2xl">
                                <TabsTrigger value="colors" className="flex items-center gap-2">
                                    <Palette className="w-4 h-4" />
                                    Cores
                                </TabsTrigger>
                                <TabsTrigger value="fonts" className="flex items-center gap-2">
                                    <Type className="w-4 h-4" />
                                    Fontes
                                </TabsTrigger>
                                <TabsTrigger value="assets" className="flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4" />
                                    Assets
                                </TabsTrigger>
                                <TabsTrigger value="preview" className="flex items-center gap-2">
                                    <Eye className="w-4 h-4" />
                                    Preview
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="p-6">
                            {/* Aba de Cores */}
                            <TabsContent value="colors" className="mt-0 space-y-6">
                                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                                    <h3 className="font-semibold text-purple-900 mb-2">🎨 Paleta de Cores Global</h3>
                                    <p className="text-sm text-purple-700">
                                        Defina as cores principais que serão aplicadas automaticamente em todos os funis.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {Object.entries(brandKit.colors).map(([key, value]) => (
                                        <div key={key} className="space-y-2">
                                            <Label className="text-sm font-medium capitalize">
                                                {key === 'primary' && '🔸 Cor Primária'}
                                                {key === 'secondary' && '🔹 Cor Secundária'}
                                                {key === 'accent' && '✨ Cor de Destaque'}
                                                {key === 'background' && '🖼️ Fundo'}
                                                {key === 'text' && '📝 Texto'}
                                                {key === 'muted' && '🔇 Texto Suave'}
                                            </Label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="color"
                                                    value={value}
                                                    onChange={(e) => handleColorChange(key as keyof BrandColors, e.target.value)}
                                                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                                                />
                                                <Input
                                                    value={value}
                                                    onChange={(e) => handleColorChange(key as keyof BrandColors, e.target.value)}
                                                    placeholder="#000000"
                                                    className="flex-1"
                                                />
                                                <Button
                                                    onClick={() => navigator.clipboard.writeText(value)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="px-2"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                            {/* Aba de Fontes */}
                            <TabsContent value="fonts" className="mt-0 space-y-6">
                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                    <h3 className="font-semibold text-blue-900 mb-2">🔤 Tipografia Global</h3>
                                    <p className="text-sm text-blue-700">
                                        Configure as fontes que serão aplicadas automaticamente nos títulos e textos.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>📰 Fonte para Títulos</Label>
                                        <Input
                                            value={brandKit.fonts.heading}
                                            onChange={(e) => handleFontChange('heading', e.target.value)}
                                            placeholder="Ex: Playfair Display, serif"
                                        />
                                        <p className="text-xs text-gray-500">
                                            Usada em títulos, headings e elementos de destaque
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>📝 Fonte para Corpo do Texto</Label>
                                        <Input
                                            value={brandKit.fonts.body}
                                            onChange={(e) => handleFontChange('body', e.target.value)}
                                            placeholder="Ex: Inter, sans-serif"
                                        />
                                        <p className="text-xs text-gray-500">
                                            Usada em parágrafos, descrições e textos gerais
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>✨ Fonte de Destaque (Opcional)</Label>
                                        <Input
                                            value={brandKit.fonts.accent || ''}
                                            onChange={(e) => handleFontChange('accent', e.target.value)}
                                            placeholder="Ex: Dancing Script, cursive"
                                        />
                                        <p className="text-xs text-gray-500">
                                            Usada em elementos especiais e destaques criativos
                                        </p>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Aba de Assets */}
                            <TabsContent value="assets" className="mt-0 space-y-6">
                                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                    <h3 className="font-semibold text-green-900 mb-2">🖼️ Assets de Marca</h3>
                                    <p className="text-sm text-green-700">
                                        Configure logos, favicons e imagens que representam sua marca.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>🏷️ Logo Principal</Label>
                                        <Input
                                            value={brandKit.assets.logo}
                                            onChange={(e) => handleAssetChange('logo', e.target.value)}
                                            placeholder="/logo.png"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>⭐ Favicon</Label>
                                        <Input
                                            value={brandKit.assets.favicon}
                                            onChange={(e) => handleAssetChange('favicon', e.target.value)}
                                            placeholder="/favicon.ico"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>🌄 Imagem de Fundo (Opcional)</Label>
                                        <Input
                                            value={brandKit.assets.backgroundImage || ''}
                                            onChange={(e) => handleAssetChange('backgroundImage', e.target.value)}
                                            placeholder="/background.jpg"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>💧 Marca D'água (Opcional)</Label>
                                        <Input
                                            value={brandKit.assets.watermark || ''}
                                            onChange={(e) => handleAssetChange('watermark', e.target.value)}
                                            placeholder="/watermark.png"
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Aba de Preview */}
                            <TabsContent value="preview" className="mt-0 space-y-6">
                                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                                    <h3 className="font-semibold text-yellow-900 mb-2">👁️ Preview do Brand Kit</h3>
                                    <p className="text-sm text-yellow-700">
                                        Visualize como suas configurações ficam aplicadas.
                                    </p>
                                </div>

                                <div
                                    className="border rounded-lg p-6 space-y-4"
                                    style={{
                                        backgroundColor: brandKit.colors.background,
                                        color: brandKit.colors.text,
                                        fontFamily: brandKit.fonts.body
                                    }}
                                >
                                    <h1
                                        style={{
                                            color: brandKit.colors.primary,
                                            fontFamily: brandKit.fonts.heading,
                                            fontSize: '2rem',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Seu Brand Kit
                                    </h1>

                                    <div
                                        className="p-4 rounded"
                                        style={{ backgroundColor: brandKit.colors.accent }}
                                    >
                                        <h2
                                            style={{
                                                color: brandKit.colors.secondary,
                                                fontSize: '1.5rem',
                                                fontWeight: '600',
                                                marginBottom: '0.5rem'
                                            }}
                                        >
                                            Título Secundário
                                        </h2>
                                        <p style={{ color: brandKit.colors.muted }}>
                                            Este é um exemplo de como o texto ficará com suas configurações de brand kit aplicadas.
                                        </p>
                                    </div>

                                    <Button
                                        style={{
                                            backgroundColor: brandKit.colors.primary,
                                            color: brandKit.colors.background
                                        }}
                                    >
                                        Botão de Exemplo
                                    </Button>
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Footer com Import/Export */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Última modificação: {new Date(brandKit.lastModified).toLocaleString()}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button onClick={exportBrandKit} variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-1" />
                                Exportar
                            </Button>
                            <label className="cursor-pointer">
                                <Button variant="outline" size="sm" asChild>
                                    <span>
                                        <Upload className="w-4 h-4 mr-1" />
                                        Importar
                                    </span>
                                </Button>
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={importBrandKit}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default BrandKitManager;