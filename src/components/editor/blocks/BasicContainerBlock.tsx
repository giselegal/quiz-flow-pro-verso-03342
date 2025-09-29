import { getEnhancedBlockComponent } from '@/components/editor/blocks/enhancedBlockRegistry';
import type { BlockComponentProps, BlockData } from '@/types/blocks';
import React from 'react';

/**
 * BasicContainerBlock
 * Container minimalista e confiável que apenas aplica estilos e renderiza filhos.
 * Sem efeitos colaterais, sem listeners globais.
 */
const BasicContainerBlock: React.FC<BlockComponentProps> = ({ block }) => {
    if (!block) return null;

    const properties: any = (block as any)?.properties || {};
    const {
        elementId,
        className,
        marginTop,
        marginBottom,
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
        backgroundColor,
        containerBackgroundColor,
    } = properties;

    // Fonte única de verdade para children: prioriza block.children e faz fallback para properties.children
    const childrenList: any[] = (block as any)?.children || properties?.children || [];

    const containerStyle: React.CSSProperties = {
        marginTop,
        marginBottom,
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
        backgroundColor: backgroundColor ?? containerBackgroundColor,
    };

    const combinedClassName = className ? `w-full ${className}` : 'w-full';

    return (
        <div id={elementId} className={combinedClassName} style={containerStyle}>
            {Array.isArray(childrenList) &&
                childrenList.map((child: any, index: number) => {
                    const Component = getEnhancedBlockComponent(child.type);
                    if (!Component) return null;

                    const childBlock: BlockData = {
                        id: child.id || `${block.id}-child-${index}`,
                        type: child.type,
                        properties: child.properties || {},
                        content: child.content || {},
                        order: index,
                    };

                    return (
                        <Component
                            key={childBlock.id}
                            block={childBlock}
                            properties={childBlock.properties as any}
                            {...(childBlock.properties as any)}
                        />
                    );
                })}
        </div>
    );
};

export default BasicContainerBlock;
