import React from 'react';

interface StyleSelectorProps {
    [key: string]: unknown;
}

export const StyleSelector: React.FC<StyleSelectorProps> = () => (
    <div>StyleSelector</div>
);

export default StyleSelector;