import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import type { BlockComponentProps } from '@/types/blocks';
import { useQuizResult } from '@/hooks/useQuizResult';
import { getBestUserName } from '@/core/user/name';
import { mapToFriendlyStyle } from '@/core/style/naming';
import { computeEffectivePrimaryPercentage } from '@/core/result/percentage';

export const ModularResultHeaderBlock: React.FC<BlockComponentProps> = ({
    block,
    isSelected = false,
    onPropertyChange,
    className = '',
}) => {
    const { primaryStyle, secondaryStyles, isLoading, error, retry, hasResult } = useQuizResult();

    if (isLoading) {
        return (
            <div className={cn('text-center p-8', className)}>
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                    <div className="h-32 bg-gray-200 rounded mx-auto w-64"></div>
                </div>
                <p className="text-sm text-gray-500 mt-4">Calculando seu resultado...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={cn('text-center p-8', className)}>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <div className="text-yellow-800 mb-2">⚠️ Problema no resultado</div>
                    <p className="text-sm text-yellow-700 mb-4">{error}</p>
                    <button
                        onClick={retry}
                        className="border border-yellow-300 text-yellow-800 hover:bg-yellow-100 px-4 py-2 rounded"
                    >
                        🔄 Tentar Novamente
                    </button>
                </div>
            </div>
        );
    }

    if (!hasResult || !primaryStyle) {
        return (
            <div className={cn('text-center p-8', className)}>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <div className="text-gray-800 mb-2">📋 Resultado não disponível</div>
                    <p className="text-sm text-gray-600 mb-4">Nenhum resultado foi calculado ainda.</p>
                    <button
                        onClick={retry}
                        className="border border-gray-300 text-gray-800 hover:bg-gray-100 px-4 py-2 rounded"
                    >
                        🔄 Calcular Resultado
                    </button>
                </div>
            </div>
        );
    }

    const userName = (block?.properties as any)?.userName || getBestUserName(block);
    const styleLabel = (block?.properties as any)?.styleName || mapToFriendlyStyle((primaryStyle as any)?.category || 'Natural');
    const percentageOverride = (block?.properties as any)?.percentage;
    const percentage = percentageOverride ?? computeEffectivePrimaryPercentage(
        primaryStyle as any,
        secondaryStyles as any[],
        (primaryStyle as any)?.percentage || 0
    );

    const {
        backgroundColor,
        containerLayout = 'two-column',
        mobileLayout = 'stack',
        padding = 'lg',
        borderRadius = 'lg',
    } = (block?.properties as any) || {};

    const paddingClasses: Record<string, string> = { sm: 'p-4', md: 'p-6', lg: 'p-8' };
    const borderRadiusClasses: Record<string, string> = { sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl' };

    return (
        <div
            className={cn(
                'w-full transition-all duration-200',
                isSelected
                    ? 'border-2 border-[#B89B7A] bg-[#B89B7A]/10'
                    : 'border-2 border-dashed border-transparent hover:border-[#B89B7A]/40 hover:bg-[#B89B7A]/10/30',
                className
            )}
            style={{ backgroundColor }}
        >
            <Card className={cn('w-full border border-[#B89B7A]/20', paddingClasses[padding] || 'p-6', borderRadiusClasses[borderRadius] || 'rounded-lg')}>
                <div className="mb-6 text-center">
                    <h2 className="text-xl font-bold text-[#432818]">Parabéns! Descobrimos o seu Estilo Pessoal</h2>
                    <p className="text-sm text-[#6B4F43]">Seu resultado personalizado está pronto</p>
                </div>

                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2">
                        <span className="text-[#432818] font-semibold">{userName}</span>
                        <span className="text-[#6B4F43]">•</span>
                        <span className="text-[#6B4F43]">{styleLabel}</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-[#6B4F43]">
                        <span>Compatibilidade</span>
                        <span>{Math.round(percentage)}%</span>
                    </div>
                    <div className="h-3 w-full bg-[#B89B7A]/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ModularResultHeaderBlock;
