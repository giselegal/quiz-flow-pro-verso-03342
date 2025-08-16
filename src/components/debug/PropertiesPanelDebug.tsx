
import { useEditor } from '@/context/EditorContext';

interface PropertiesPanelDebugProps {
  title?: string;
}

export const PropertiesPanelDebug: React.FC<PropertiesPanelDebugProps> = ({
  title = 'Painel Debug',
}) => {
  const {
    selectedBlockId,
    computed,
    uiState,
  } = useEditor();

  const selectedBlock = computed?.selectedBlock;
  const currentBlocks = computed?.currentBlocks || [];
  const isPreviewing = uiState?.isPreviewing || false;

  console.log('🔍 PropertiesPanelDebug - Estado atual:', {
    selectedBlockId,
    selectedBlock,
    currentBlocks: currentBlocks.length,
    isPreviewing,
    shouldShowPanel: !isPreviewing && selectedBlock,
    selectedBlockDetails: selectedBlock
      ? {
          id: selectedBlock.id,
          type: selectedBlock.type,
          hasProperties: !!selectedBlock.properties,
          hasContent: !!selectedBlock.content,
          propertiesKeys: selectedBlock.properties ? Object.keys(selectedBlock.properties) : [],
          contentKeys: selectedBlock.content ? Object.keys(selectedBlock.content) : [],
        }
      : null,
  });

  return (
    <div style={{ borderColor: '#E5DDD5' }}>
      <h3 style={{ color: '#432818' }}>🔍 {title}</h3>

      <div className="space-y-2 text-sm">
        <div>
          <strong>Selected Block ID:</strong> {selectedBlockId || 'null'}
        </div>

        <div>
          <strong>Selected Block:</strong> {selectedBlock ? 'Exists' : 'null'}
        </div>

        <div>
          <strong>Is Previewing:</strong> {isPreviewing ? 'true' : 'false'}
        </div>

        <div>
          <strong>Should Show Panel:</strong> {!isPreviewing && selectedBlock ? 'true' : 'false'}
        </div>

        <div>
          <strong>Current Blocks Count:</strong> {currentBlocks.length}
        </div>

        {selectedBlock && (
          <div className="bg-white p-2 rounded border">
            <strong>Selected Block Details:</strong>
            <pre className="text-xs mt-1">
              {JSON.stringify(
                {
                  id: selectedBlock.id,
                  type: selectedBlock.type,
                  properties: selectedBlock.properties,
                  content: selectedBlock.content,
                },
                null,
                2
              )}
            </pre>
          </div>
        )}

        {currentBlocks.length > 0 && (
          <div className="bg-white p-2 rounded border">
            <strong>Available Blocks:</strong>
            <ul className="text-xs mt-1">
              {currentBlocks.map((block: any) => (
                <li
                  key={block.id}
                  className={block.id === selectedBlockId ? 'font-bold text-blue-600' : ''}
                >
                  {block.id} - {block.type}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPanelDebug;
