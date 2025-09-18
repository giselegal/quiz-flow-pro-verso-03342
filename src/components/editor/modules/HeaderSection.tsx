import React from 'react';

import { cn } from '@/lib/utils';
import { BaseModuleProps, withCraftjsComponent } from './types';

export interface HeaderSectionProps extends BaseModuleProps {
    logoUrl?: string;
    logoAlt?: string;
    title?: string;
    subtitle?: string;
    showLogo?: boolean;
    showTitle?: boolean;
    showSubtitle?: boolean;
    [key: string]: any;
}

const HeaderSectionComponent: React.FC<HeaderSectionProps> = ({
    logoUrl = '/logo.png',
    logoAlt = 'Logo',
    title = 'Título',
    subtitle = 'Subtítulo',
    showLogo = true,
    showTitle = true,
    className = '',
}) => {
    return (
        <div className={cn('header-section flex items-center justify-center p-4', className)}>
            {showLogo && (
                <img src={logoUrl} alt={logoAlt} className="w-12 h-12 mr-4" />
            )}
            {(showTitle || typeof subtitle !== 'undefined') && (
                <div>
                    {showTitle && <h1 className="text-xl font-bold">{title}</h1>}
                    {typeof subtitle !== 'undefined' && <h2 className="text-sm opacity-80">{subtitle}</h2>}
                </div>
            )}
        </div>
    );
};

export const HeaderSection = withCraftjsComponent(HeaderSectionComponent);
export default HeaderSection;