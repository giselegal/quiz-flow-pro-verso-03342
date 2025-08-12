import type { BlockComponentProps, BlockData } from '@/types/blocks';
import { getBlockComponent } from '@/config/enhancedBlockRegistry';

/**
 * FormContainerBlock
 * Renderiza um container de formulário e seus filhos definidos via JSON (properties.children).
 */
const FormContainerBlock: React.FC<BlockComponentProps> = ({ block }) => {
  const { properties = {} } = block || {};
  const { elementId, className, marginTop, marginBottom, backgroundColor, children = [] } = properties as any;

  return (
    <div id={elementId} className={className} style={{ marginTop, marginBottom, backgroundColor }}>
      {Array.isArray(children) &&
        children.map((child: any, index: number) => {
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
          return (
            <Component key={childBlock.id} block={childBlock} properties={childBlock.properties} />
          );
        })}
    </div>
  );
};

export default FormContainerBlock;
