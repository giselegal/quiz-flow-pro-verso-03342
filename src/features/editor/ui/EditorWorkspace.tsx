/**
 * 🎯 FASE 2: EditorWorkspace - Área de trabalho com colunas
 * 
 * Responsabilidade única: Layout de colunas redimensionáveis
 */

import React from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

interface EditorWorkspaceProps {
    children: React.ReactNode;
    defaultLayout?: number[];
    onLayoutChange?: (sizes: number[]) => void;
}

export function EditorWorkspace({
    children,
    defaultLayout = [20, 35, 30, 15],
    onLayoutChange
}: EditorWorkspaceProps) {
    return (
        <ResizablePanelGroup
            direction="horizontal"
            className="flex-1 overflow-hidden"
            onLayout={onLayoutChange}
        >
            {React.Children.map(children, (child, index) => (
                <>
                    <ResizablePanel
                        defaultSize={defaultLayout[index]}
                        minSize={15}
                        maxSize={50}
                    >
                        {child}
                    </ResizablePanel>
                    {index < React.Children.count(children) - 1 && (
                        <ResizableHandle withHandle />
                    )}
                </>
            ))}
        </ResizablePanelGroup>
    );
}
