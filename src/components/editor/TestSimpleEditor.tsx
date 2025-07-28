import * as React from 'react';
import { useSimpleEditor } from '../../hooks/useSimpleEditor';

const TestSimpleEditor: React.FC = () => {
  const {
    funnel,
    currentPage,
    addBlock,
    deleteBlock,
    selectedBlockId,
    setSelectedBlock
  } = useSimpleEditor();

  const handleAddTestBlock = () => {
    addBlock({
      type: 'text',
      config: { content: 'Bloco de teste adicionado!' },
      styles: {},
      responsive: {
        mobile: {},
        tablet: {},
        desktop: {}
      }
    });
  };

  console.log('🔧 TestSimpleEditor Debug:', {
    funnel: !!funnel,
    currentPage: !!currentPage,
    blocksCount: currentPage?.blocks?.length || 0
  });

  return (
    <div style={{ padding: '20px', minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{ color: '#333', marginBottom: '20px' }}>Editor Simples - Teste</h1>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gap: '20px',
          minHeight: '500px'
        }}>
          {/* Sidebar */}
          <div style={{ 
            background: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '8px',
            border: '1px solid #dee2e6'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#495057' }}>Componentes</h3>
            <button 
              onClick={handleAddTestBlock}
              style={{ 
                background: '#007bff', 
                color: 'white', 
                padding: '10px 15px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%',
                marginBottom: '10px'
              }}
            >
              + Adicionar Bloco
            </button>
            
            <div style={{ 
              fontSize: '12px', 
              color: '#6c757d',
              marginTop: '20px'
            }}>
              <div>Funil: {funnel ? '✅' : '❌'}</div>
              <div>Página: {currentPage ? '✅' : '❌'}</div>
              <div>Blocos: {currentPage?.blocks?.length || 0}</div>
            </div>
          </div>

          {/* Canvas */}
          <div style={{ 
            background: 'white', 
            border: '2px dashed #dee2e6',
            borderRadius: '8px',
            padding: '20px',
            minHeight: '400px'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#495057' }}>Canvas</h3>
            
            {currentPage?.blocks?.length === 0 ? (
              <div style={{
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6c757d',
                fontSize: '14px',
                border: '1px dashed #ccc',
                borderRadius: '4px'
              }}>
                Nenhum bloco adicionado. Clique em "Adicionar Bloco" para começar.
              </div>
            ) : (
              <div>
                {currentPage?.blocks?.map((block: any, index: number) => (
                  <div 
                    key={block.id}
                    style={{
                      background: selectedBlockId === block.id ? '#e3f2fd' : '#f8f9fa',
                      border: selectedBlockId === block.id ? '2px solid #2196f3' : '1px solid #dee2e6',
                      borderRadius: '4px',
                      padding: '15px',
                      marginBottom: '10px',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedBlock(block.id)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>Bloco {index + 1}</strong> ({block.type})
                        <br />
                        <small style={{ color: '#6c757d' }}>{block.config?.content || 'Sem conteúdo'}</small>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteBlock(block.id);
                        }}
                        style={{
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '5px 10px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ 
          marginTop: '20px',
          fontSize: '12px',
          color: '#6c757d',
          textAlign: 'center'
        }}>
          Se você consegue adicionar e remover blocos, o sistema básico está funcionando.
        </div>
      </div>
    </div>
  );
};

export default TestSimpleEditor;
