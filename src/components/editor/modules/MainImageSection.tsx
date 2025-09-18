import React from 'react';

import { cn } from '@/lib/utils';
import { BaseModuleProps, withCraftjsComponent } from './types';

export interface MainImageSectionProps extends BaseModuleProps {
    imageUrl?: string;
    alt?: string;
    title?: string;
    showTitle?: boolean;
    [key: string]: any;
}

const MainImageSectionComponent: React.FC<MainImageSectionProps> = ({
    imageUrl = '/placeholder-image.jpg',
    alt = 'Imagem',
    title = 'Título da Imagem',
    className = '',
}) => {
    // Removed useEditor for build compatibility

    return (
        <div className={cn('main-image-section p-4', className)}>
            <img src={imageUrl} alt={alt} className="w-full rounded-lg" />
            {title && <h3 className="mt-2 text-lg font-semibold">{title}</h3>}
        </div>
    );
};

export const MainImageSection = withCraftjsComponent(MainImageSectionComponent, {});
export default MainImageSection;