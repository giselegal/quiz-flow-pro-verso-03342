/**
 * @deprecated - Este componente foi desabilitado pois FashionImageAI foi arquivado
 */

import React from 'react';

interface FashionImageGeneratorProps {
    onImageGenerated?: (imageUrl: string, prompt: string) => void;
    defaultPrompt?: string;
}

export function FashionImageGenerator({ onImageGenerated, defaultPrompt }: FashionImageGeneratorProps) {
    return (
        <div className="p-4 text-center text-gray-500">
            <p>Componente FashionImageGenerator foi desabilitado.</p>
            <p className="text-sm">Os serviços de AI foram arquivados.</p>
        </div>
    );
}

export default FashionImageGenerator;
