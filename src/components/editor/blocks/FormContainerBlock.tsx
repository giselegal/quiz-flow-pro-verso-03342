import type { BlockComponentProps, BlockData } from '@/types/blocks';
import { getBlockComponent } from '@/config/enhancedBlockRegistry';

/**
 * FormContainerBlock
 * Renderiza um container de formulário e seus filhos definidos via JSON (properties.children).
 */
const FormContainerBlock: React.FC<BlockComponentProps> = ({ block }) => {
  const { properties = {} } = block || {};
  const {
    elementId,
    className,
    marginTop,
    marginBottom,
  } = (properties as any) || {};

  // Fonte única de verdade para children: prioriza block.children e faz fallback para properties.children
  const childrenList = (block as any)?.children || (properties as any)?.children || [];

  const containerStyle: React.CSSProperties = {
    marginTop,
    marginBottom,
    // Suporta tanto backgroundColor quanto containerBackgroundColor (padrão do design system universal)
    backgroundColor: (properties as any)?.backgroundColor ?? (properties as any)?.containerBackgroundColor,
  };

  const combinedClassName = className ? `w-full ${className}` : 'w-full';

  return (
    <div id={elementId} className={combinedClassName} style={containerStyle}>
      {Array.isArray(childrenList) &&
        childrenList.map((child: any, index: number) => {
          const Component = getBlockComponent(child.type);
          if (!Component) return null;

          const childBlock: BlockData = {
            id: child.id || `${block.id}-child-${index}`,
            type: child.type,
            properties: child.properties || {},
            content: child.content || {},
            order: index,
          };

          // Renderizamos o componente filho passando o bloco completo
          return <Component key={childBlock.id} block={childBlock} properties={childBlock.properties} />;
        })}
    </div>
  );
};


export default FormContainerBlock;
