import { useState } from 'react';
import { X, Palette, Image as ImageIcon, Save, RefreshCw, Eye, Copy, Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useBrandKit } from '@/hooks/useBrandKit';
import { useAnalytics } from '@/hooks/useAnalytics';

interface BrandKitAdvancedSidebarProps {
    onClose: () => void;
}

export function BrandKitAdvancedSidebar({ onClose }: BrandKitAdvancedSidebarProps) {
    const {
        brandKit,
        updateColors,
        updateFonts,
        updateAssets,
        resetBrandKit,
        exportBrandKit
    } = useBrandKit();

    const { trackEvent } = useAnalytics();

    const [activeTab, setActiveTab] = useState('colors');
    const [previewMode, setPreviewMode] = useState(false);
    const [isApplying, setIsApplying] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Paletas pré-definidas
    const colorPresets = [
        {
            name: 'Elegante',
            colors: {
                primary: '#B89B7A',
                secondary: '#432818',
                accent: '#E6DDD4',
                background: '#FAF9F7',
                text: '#432818'
            }
        },
        {
            name: 'Moderno',
            colors: {
                primary: '#6366F1',
                secondary: '#8B5CF6',
                accent: '#EC4899',
                background: '#F8FAFC',
                text: '#1E293B'
            }
        },
        {
            name: 'Natural',
            colors: {
                primary: '#059669',
                secondary: '#10B981',
                accent: '#34D399',
                background: '#ECFDF5',
                text: '#064E3B'
            }
        },
        {
            name: 'Sunset',
            colors: {
                primary: '#EA580C',
                secondary: '#DC2626',
                accent: '#F59E0B',
                background: '#FFF7ED',
                text: '#9A3412'
            }
        }
    ];

    const fontPresets = [
        { name: 'Clássico', heading: 'Playfair Display, serif', body: 'Inter, sans-serif' },
        { name: 'Moderno', heading: 'Poppins, sans-serif', body: 'Inter, sans-serif' },
        { name: 'Minimalista', heading: 'Inter, sans-serif', body: 'Inter, sans-serif' },
        { name: 'Elegante', heading: 'Crimson Pro, serif', body: 'Source Sans Pro, sans-serif' }
    ];

    const handleColorChange = (colorKey: string, value: string) => {
        updateColors({ [colorKey]: value });
        setHasUnsavedChanges(true);
        trackEvent('brand_color_changed', { colorKey, value });
    };

    const handlePresetApply = (preset: typeof colorPresets[0]) => {
        updateColors(preset.colors);
        setHasUnsavedChanges(true);
        trackEvent('brand_preset_applied', { presetName: preset.name });
    };

    const handleFontPresetApply = (preset: typeof fontPresets[0]) => {
        updateFonts({ heading: preset.heading, body: preset.body });
        setHasUnsavedChanges(true);
        trackEvent('font_preset_applied', { presetName: preset.name });
    };

    const handleApplyToBrowser = async () => {
        setIsApplying(true);
        try {
            // Simular aplicação ao browser
            await new Promise(resolve => setTimeout(resolve, 1000));
            setHasUnsavedChanges(false);
            trackEvent('brand_applied_to_browser', { brandName: brandKit.name });
        } catch (error) {
            console.error('Erro ao aplicar brand kit:', error);
        } finally {
            setIsApplying(false);
        }
    };

    const handleExport = () => {
        const exported = exportBrandKit();
        const blob = new Blob([JSON.stringify(exported, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `brand-kit-${brandKit.name.toLowerCase().replace(/\s+/g, '-')}.json`;
        a.click();
        URL.revokeObjectURL(url);
        trackEvent('brand_kit_exported', { brandName: brandKit.name });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Palette className="w-6 h-6 text-pink-600" />
                            <h2 className="text-xl font-semibold">Brand Kit Manager</h2>
                            <Badge variant="outline" className="bg-pink-50 text-pink-700">
                                <ImageIcon className="w-3 h-3 mr-1" />
                                Sistema Avançado
                            </Badge>
                            {hasUnsavedChanges && (
                                <Badge className="bg-yellow-600 text-white">
                                    Alterações não salvas
                                </Badge>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPreviewMode(!previewMode)}
                                className={previewMode ? 'bg-pink-100 text-pink-700' : ''}
                            >
                                <Eye className="w-4 h-4 mr-1" />
                                Preview
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleApplyToBrowser}
                                disabled={isApplying || !hasUnsavedChanges}
                            >
                                {isApplying ? (
                                    <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4 mr-1" />
                                )}
                                Aplicar
                            </Button>

                            <Button variant="ghost" onClick={onClose}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="mt-2 text-sm text-gray-600">
                        <strong>{brandKit.name}</strong> - {brandKit.description}
                    </div>
                </div>

                {/* Aplicando Preview */}
                {isApplying && (
                    <div className="px-6 py-2 bg-blue-50 border-b">
                        <div className="flex items-center gap-2 text-sm text-blue-700">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Aplicando brand kit ao editor...
                        </div>
                        <Progress value={75} className="mt-1 h-1" />
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-hidden">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                        <TabsList className="grid w-full grid-cols-3 mx-6 mt-4 mb-0">
                            <TabsTrigger value="colors">Cores & Paletas</TabsTrigger>
                            <TabsTrigger value="fonts">Tipografia</TabsTrigger>
                            <TabsTrigger value="assets">Assets & Mídia</TabsTrigger>
                        </TabsList>

                        {/* CORES TAB */}
                        <TabsContent value="colors" className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Paletas Pré-definidas */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Paletas Pré-definidas</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {colorPresets.map((preset) => (
                                            <div
                                                key={preset.name}
                                                className="cursor-pointer group"
                                                onClick={() => handlePresetApply(preset)}
                                            >
                                                <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                                                    <div className="flex gap-1 mb-2">
                                                        {Object.values(preset.colors).slice(0, 4).map((color, i) => (
                                                            <div
                                                                key={i}
                                                                className="w-4 h-4 rounded-sm"
                                                                style={{ backgroundColor: color }}
                                                            />
                                                        ))}
                                                    </div>
                                                    <div className="text-xs font-medium text-center">
                                                        {preset.name}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Cores Personalizadas */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Cores Personalizadas</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {Object.entries(brandKit.colors).map(([key, value]) => (
                                        <div key={key} className="flex items-center gap-4">
                                            <div className="w-20">
                                                <Label className="text-sm font-medium capitalize">
                                                    {key.replace(/([A-Z])/g, ' $1')}
                                                </Label>
                                            </div>
                                            <input
                                                type="color"
                                                value={value}
                                                onChange={(e) => handleColorChange(key, e.target.value)}
                                                className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                                            />
                                            <Input
                                                value={value}
                                                onChange={(e) => handleColorChange(key, e.target.value)}
                                                className="flex-1 text-sm font-mono"
                                                placeholder="#000000"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => navigator.clipboard.writeText(value)}
                                            >
                                                <Copy className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* FONTES TAB */}
                        <TabsContent value="fonts" className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Presets de Fonte */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Combinações de Fonte</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {fontPresets.map((preset) => (
                                            <div
                                                key={preset.name}
                                                className="p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                                                onClick={() => handleFontPresetApply(preset)}
                                            >
                                                <div className="mb-2">
                                                    <div className="text-sm font-semibold">{preset.name}</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div
                                                        className="text-lg font-bold"
                                                        style={{ fontFamily: preset.heading }}
                                                    >
                                                        Título Principal
                                                    </div>
                                                    <div
                                                        className="text-sm text-gray-600"
                                                        style={{ fontFamily: preset.body }}
                                                    >
                                                        Texto do corpo do conteúdo
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Fontes Personalizadas */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Fontes Personalizadas</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label className="text-sm font-medium">Fonte dos Títulos</Label>
                                        <Input
                                            value={brandKit.fonts.heading}
                                            onChange={(e) => updateFonts({ heading: e.target.value })}
                                            className="mt-1"
                                            placeholder="Inter, sans-serif"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium">Fonte do Corpo</Label>
                                        <Input
                                            value={brandKit.fonts.body}
                                            onChange={(e) => updateFonts({ body: e.target.value })}
                                            className="mt-1"
                                            placeholder="Inter, sans-serif"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* ASSETS TAB */}
                        <TabsContent value="assets" className="flex-1 overflow-y-auto p-6 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Logos e Assets</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label className="text-sm font-medium">Logo Principal</Label>
                                        <div className="mt-1 flex items-center gap-2">
                                            <Input
                                                value={brandKit.assets.logo}
                                                onChange={(e) => updateAssets({ logo: e.target.value })}
                                                placeholder="https://example.com/logo.png"
                                                className="flex-1"
                                            />
                                            <Button variant="outline" size="sm">
                                                <Upload className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium">Favicon</Label>
                                        <div className="mt-1 flex items-center gap-2">
                                            <Input
                                                value={brandKit.assets.favicon}
                                                onChange={(e) => updateAssets({ favicon: e.target.value })}
                                                placeholder="https://example.com/favicon.ico"
                                                className="flex-1"
                                            />
                                            <Button variant="outline" size="sm">
                                                <Upload className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Footer */}
                <div className="p-6 border-t bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            <Palette className="w-4 h-4 inline mr-1" />
                            Brand Kit avançado com aplicação em tempo real
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleExport}>
                                <Download className="w-4 h-4 mr-2" />
                                Exportar
                            </Button>
                            <Button variant="outline" onClick={resetBrandKit}>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Reset
                            </Button>
                            <Button variant="outline" onClick={onClose}>
                                Fechar
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}