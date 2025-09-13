import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause } from 'lucide-react';
import type { PropertyEditorProps } from './types';

const AnimationPreviewEditor: React.FC<PropertyEditorProps> = ({ property }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{property.key}</CardTitle>
                    <Button
                        onClick={handlePlayPause}
                        variant="outline"
                        size="sm"
                        className="h-6 px-2 text-xs"
                    >
                        {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">Controles de animação</p>
            </CardHeader>
            <CardContent>
                <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center min-h-[80px]">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg" />
                </div>
            </CardContent>
        </Card>
    );
};

export default AnimationPreviewEditor;