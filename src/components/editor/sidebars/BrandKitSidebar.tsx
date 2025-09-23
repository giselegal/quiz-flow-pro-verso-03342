import React, { useState } from 'react';
import { X, Palette, Eye, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// 🎨 Brand Kit hook
import { useBrandKit } from '@/hooks/useBrandKit';

/**
 * 🎨 BRAND KIT SIDEBAR
 * 
 * Integra BrandKitManager.tsx (513 linhas) como sidebar
 * Permite aplicação automática de cores/fontes/assets
 */

interface BrandKitSidebarProps {
    onClose: () => void;
}

export const BrandKitSidebar: React.FC<BrandKitSidebarProps> = ({ onClose }) => {
    const {
        brandKit,
        updateColors,
        updateFonts,
        updateAssets,
        resetBrandKit,
        exportBrandKit,
        importBrandKit
    } = useBrandKit();

    // Analytics tracking fallback for compatibility
    const trackEvent = (event: string, data?: any) => {
        console.log('📊 Brand Kit Event:', event, data);
    };

    const [activeTab, setActiveTab] = useState('colors');
    const [previewMode, setPreviewMode] = useState(false);

    const handleColorChange = (colorKey: string, value: string) => {
        updateColors({ [colorKey]: value });
        trackEvent('brand_color_changed', { colorKey, value });
    };

    const handleFontChange = (fontKey: string, value: string) => {
        updateFonts({ [fontKey]: value });
        trackEvent('brand_font_changed', { fontKey, value });
    };

    const handleReset = () => {
        resetBrandKit();
        trackEvent('brand_kit_reset');
    };

    const handleExport = () => {
        const exported = exportBrandKit();
        navigator.clipboard.writeText(exported);
        trackEvent('brand_kit_exported');
        // TODO: Show toast notification
    };

    const handleImport = () => {
        navigator.clipboard.readText().then((text) => {
            const success = importBrandKit(text);
            trackEvent('brand_kit_imported', { success });
            // TODO: Show toast notification
        });
    };

    const fontOptions = [
        'Inter',
        'Poppins',
        'Roboto',
        'Open Sans',
        'Lato',
        'Montserrat',
        'Source Sans Pro',
        'Raleway',
        'Ubuntu',
        'Nunito'
    ];

    return (
        <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200">
            {/* 🎯 Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-pink-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Brand Kit</h2>
                    <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                        🎨 LIVE
                    </Badge>
                </div>

                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewMode(!previewMode)}
                        className={previewMode ? 'bg-pink-100 text-pink-700' : ''}
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="hover:bg-gray-100"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* 🎯 Brand Kit Info */}
            <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="text-sm">
                    <div className="font-medium text-gray-900">{brandKit.name}</div>
                    <div className="text-gray-600 text-xs">{brandKit.description}</div>
                </div>
            </div>

            {/* 🎯 Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-3 m-4 mb-0">
                    <TabsTrigger value="colors">Cores</TabsTrigger>
                    <TabsTrigger value="fonts">Fontes</TabsTrigger>
                    <TabsTrigger value="assets">Assets</TabsTrigger>
                </TabsList>

                {/* 🎨 CORES TAB */}
                <TabsContent value="colors" className="flex-1 overflow-y-auto p-4 space-y-4">
                    {Object.entries(brandKit.colors).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                            <Label className="text-sm font-medium capitalize">
                                {key.replace(/([A-Z])/g, ' $1')}
                            </Label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={value}
                                    onChange={(e) => handleColorChange(key, e.target.value)}
                                    className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                                />
                                <Input
                                    value={value}
                                    onChange={(e) => handleColorChange(key, e.target.value)}
                                    className="flex-1 text-sm"
                                    placeholder="#000000"
                                />
                            </div>

                            {/* 🎨 Preview */}
                            {previewMode && (
                                <div
                                    className="w-full h-8 rounded border border-gray-300"
                                    style={{ backgroundColor: value }}
                                />
                            )}
                        </div>
                    ))}

                    {/* 🎨 Paleta de cores populares */}
                    <div className="pt-4 border-t border-gray-200">
                        <Label className="text-sm font-medium mb-2 block">
                            Paletas Populares
                        </Label>
                        <div className="grid grid-cols-4 gap-2">
                            {[
                                ['#3B82F6', '#1E40AF', '#F59E0B'], // Blue
                                ['#EF4444', '#DC2626', '#F97316'], // Red
                                ['#10B981', '#059669', '#84CC16'], // Green
                                ['#8B5CF6', '#7C3AED', '#EC4899'], // Purple
                            ].map((palette, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        updateColors({
                                            primary: palette[0],
                                            secondary: palette[1],
                                            accent: palette[2]
                                        });
                                    }}
                                    className="flex h-8 rounded border border-gray-300 overflow-hidden hover:border-gray-400 transition-colors"
                                >
                                    {palette.map((color, i) => (
                                        <div
                                            key={i}
                                            className="flex-1"
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </button>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* 🔤 FONTES TAB */}
                <TabsContent value="fonts" className="flex-1 overflow-y-auto p-4 space-y-4">
                    {Object.entries(brandKit.fonts).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                            <Label className="text-sm font-medium capitalize">
                                {key.replace(/([A-Z])/g, ' $1')}
                            </Label>
                            <select
                                value={value}
                                onChange={(e) => handleFontChange(key, e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded text-sm bg-white"
                            >
                                {fontOptions.map((font) => (
                                    <option key={font} value={font} style={{ fontFamily: font }}>
                                        {font}
                                    </option>
                                ))}
                            </select>

                            {/* 🔤 Preview */}
                            {previewMode && (
                                <div
                                    className="p-3 border border-gray-300 rounded text-sm"
                                    style={{ fontFamily: value }}
                                >
                                    The quick brown fox jumps over the lazy dog
                                </div>
                            )}
                        </div>
                    ))}
                </TabsContent>

                {/* 🖼️ ASSETS TAB */}
                <TabsContent value="assets" className="flex-1 overflow-y-auto p-4 space-y-4">
                    {Object.entries(brandKit.assets).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                            <Label className="text-sm font-medium capitalize">
                                {key.replace(/([A-Z])/g, ' $1')}
                            </Label>
                            <Input
                                value={value}
                                onChange={(e) => updateAssets({ [key]: e.target.value })}
                                placeholder="URL do asset..."
                                className="text-sm"
                            />

                            {/* 🖼️ Preview */}
                            {previewMode && value && (
                                <div className="border border-gray-300 rounded p-2">
                                    <img
                                        src={value}
                                        alt={key}
                                        className="max-w-full h-auto max-h-20 object-contain"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </TabsContent>
            </Tabs>

            {/* 🎯 Footer Actions */}
            <div className="p-4 border-t border-gray-200 space-y-2">
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleReset}
                        className="flex-1"
                    >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Reset
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExport}
                        className="flex-1"
                    >
                        Exportar
                    </Button>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleImport}
                    className="w-full"
                >
                    Importar do Clipboard
                </Button>
            </div>
        </div>
    );
};