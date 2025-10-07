import React from 'react';

interface SharedProgressHeaderProps {
    progress: number; // 0-100
    logoUrl?: string;
    logoAlt?: string;
    show?: boolean;
}

/**
 * Header compartilhado (passos 1-19): logo + barra de progresso + percentual
 * - Mobile: compacto
 * - Desktop: maior espaçamento e barra larga
 */
export const SharedProgressHeader: React.FC<SharedProgressHeaderProps> = ({
    progress,
    logoUrl = 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_70,w_120,h_50,c_fit/v1752430327/LOGO_DA_MARCA_GISELE_l78gin.png',
    logoAlt = 'Logo',
    show = true,
}) => {
    if (!show) return null;

    const safeProgress = Math.min(100, Math.max(0, Math.round(progress)));

    return (
        <div data-testid="shared-progress-header" className="w-full max-w-6xl mx-auto px-4 pt-3 pb-2 flex flex-col items-center">
            {/* Logo sem barra decorativa */}
            {logoUrl && (
                <img
                    src={logoUrl}
                    alt={logoAlt}
                    className="h-auto w-[110px] md:w-[130px] lg:w-[150px] object-contain mb-1"
                    style={{ aspectRatio: '120 / 50' }}
                    width={150}
                    height={50}
                />
            )}

            {/* Barra de progresso ultra-fina */}
            <div className="w-full max-w-xl -mb-1">
                <div className="w-full bg-gray-200 rounded-full h-[4px] sm:h-[5px] overflow-hidden">
                    <div
                        className="bg-[#deac6d] h-full rounded-full transition-all duration-500"
                        style={{ width: `${safeProgress}%` }}
                    />
                </div>
                <p className="text-[10px] sm:text-xs text-center mt-1 text-[#5b4135] font-medium tracking-tight">
                    {safeProgress}%
                </p>
            </div>
        </div>
    );
};

export default SharedProgressHeader;
