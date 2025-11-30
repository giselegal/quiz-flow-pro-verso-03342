/**
 * 📐 Editor Layout - Layout de 4 colunas
 * 
 * Estrutura:
 * [StepPanel | BlockLibrary | Canvas | PropertiesPanel]
 *    200px       250px        flex-1      300px
 */

import { StepPanel } from './StepPanel';
import { BlockLibrary } from './BlockLibrary';
import { Canvas } from './Canvas';
import { PropertiesPanel } from './PropertiesPanel';

export function EditorLayout() {
    return (
        <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
            {/* Coluna 1: Steps (200px) */}
            <StepPanel />

            {/* Coluna 2: Block Library (250px) */}
            <BlockLibrary />

            {/* Coluna 3: Canvas (flex-1) */}
            <Canvas />

            {/* Coluna 4: Properties (300px) */}
            <PropertiesPanel />
        </div>
    );
}
