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
        <div data-testid="shared-progress-header" className="w-full max-w-6xl mx-auto px-4 pt-6 pb-4 flex flex-col items-center">
            {/* Logo + barra dourada */}
            <div className="flex flex-col items-center mb-4">
                {logoUrl && (
                    <div className="relative flex flex-col items-center">
                        <img
                            src={logoUrl}
                            alt={logoAlt}
                            className="h-auto w-[120px] md:w-[140px] lg:w-[160px] object-contain"
                            style={{ aspectRatio: '120 / 50' }}
                            width={160}
                            height={50}
                        />
                        <div
                            className="h-[3px] bg-[#B89B7A] rounded-full mt-1.5"
                            style={{ width: '300px', maxWidth: '75%' }}
                        />
                    </div>
                )}
            </div>

            {/* Barra de progresso */}
            <div className="w-full max-w-2xl">
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                        className="bg-[#deac6d] h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${safeProgress}%` }}
                    />
                </div>
                <p className="text-xs sm:text-sm text-center mt-2 text-[#5b4135] font-medium">
                    Progresso: {safeProgress}%
                </p>
            </div>
        </div>
    );
};

export default SharedProgressHeader;
