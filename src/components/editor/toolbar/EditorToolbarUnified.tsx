import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/logo';
import { useEditor } from '@/components/editor/ConsolidatedEditorProvider';
import { cn } from '@/lib/utils';
import { useMemo, useState } from 'react';
import { makeStepKey } from '@/utils/stepKey';
import { motion } from 'framer-motion';
import { LayoutGrid, Monitor, Save, Smartphone, Tablet } from 'lucide-react';

interface EditorToolbarUnifiedProps {
    className?: string;
    useLegacyFallback?: boolean;
}

export const EditorToolbarUnified: React.FC<EditorToolbarUnifiedProps> = ({
    className = ''
}) => {
    const { state } = useEditor();
    const [viewportSize, setViewportSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');

    const totalBlocks = useMemo(() => {
        const stepKey = makeStepKey(state.currentStep || 1);
        const blocks = state.stepBlocks?.[stepKey] || [];
        return Array.isArray(blocks) ? blocks.length : 0;
    }, [state.stepBlocks, state.currentStep]);

    const handleSave = async () => {
        try {
            console.log('✅ Salvando projeto...');
        } catch (error) {
            console.error('❌ Erro ao salvar:', error);
        }
    };

    const viewportOptions = [
        { id: 'sm', icon: Smartphone, label: 'Mobile', size: '375px' },
        { id: 'md', icon: Tablet, label: 'Tablet', size: '768px' },
        { id: 'lg', icon: Monitor, label: 'Desktop', size: '1024px' },
        { id: 'xl', icon: LayoutGrid, label: 'Desktop XL', size: '1920px' },
    ];

    return (
        <div className={cn(
            'flex items-center justify-between h-16 px-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700/50',
            className
        )}>
            <div className="flex items-center space-x-6">
                <motion.div
                    className="relative group cursor-pointer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.05 }}
                >
                    <Logo className="h-10 w-auto" />
                </motion.div>

                <div className="flex items-center gap-3 text-sm">
                    <Badge variant="outline" className="text-xs bg-brand-brightBlue/20 text-brand-brightBlue border-brand-brightBlue/30">
                        Editor Unified
                    </Badge>
                    <div className="h-4 w-px bg-gray-600"></div>
                    <span className="text-gray-300">{totalBlocks} blocos</span>
                    <div className="h-4 w-px bg-gray-600"></div>
                    <span className="text-gray-300">
                        Etapa <span className="text-brand-brightPink font-semibold">{state.currentStep || 1}</span> de <span className="text-brand-brightBlue">21</span>
                    </span>
                </div>
            </div>

            <div className="flex items-center space-x-2 bg-gray-800/50 p-2 rounded-xl border border-gray-700/50">
                {viewportOptions.map(option => {
                    const IconComponent = option.icon;
                    const isActive = viewportSize === option.id;
                    return (
                        <Button
                            key={option.id}
                            variant="ghost"
                            size="sm"
                            className={cn(
                                'h-9 w-9 p-0 transition-all duration-200',
                                isActive
                                    ? 'bg-gradient-to-r from-brand-brightBlue to-brand-brightPink text-white shadow-lg scale-105'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                            )}
                            onClick={() => setViewportSize(option.id as any)}
                            title={`${option.label} (${option.size})`}
                        >
                            <IconComponent className="h-4 w-4" />
                        </Button>
                    );
                })}
            </div>

            <div className="flex items-center space-x-3">
                <Button
                    onClick={handleSave}
                    size="sm"
                    className="bg-gradient-to-r from-brand-brightBlue to-brand-brightPink hover:from-brand-brightPink hover:to-brand-brightBlue text-white shadow-lg font-medium px-6"
                >
                    <Save className="mr-2 h-4 w-4" />
                    Salvar
                </Button>
            </div>
        </div>
    );
};
