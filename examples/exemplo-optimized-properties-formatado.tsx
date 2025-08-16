// Exemplo de como o Prettier formata OptimizedPropertiesPanel

/* ANTES:
<OptimizedPropertiesPanel block={{id:'btn-1',type:'button',content:{text:'Save',color:'#3b82f6',disabled:false}}} blockDefinition={buttonBlockDef} onUpdateBlock={(blockId,updates)=>{updateBlock(blockId,{content:updates});}} onClose={()=>setSelectedBlockId(null)}/>
*/

/* DEPOIS:
<OptimizedPropertiesPanel
  block={{
    id: 'btn-1',
    type: 'button',
    content: {
      text: 'Save',
      color: '#3b82f6',
      disabled: false,
    },
  }}
  blockDefinition={buttonBlockDef}
  onUpdateBlock={(blockId, updates) => {
    updateBlock(blockId, { content: updates });
  }}
  onClose={() => setSelectedBlockId(null)}
/>
*/

/* Com configuração avançada (singleAttributePerLine: true):
<OptimizedPropertiesPanel
  block={{
    id: 'btn-1',
    type: 'button',
    content: {
      text: 'Save',
      color: '#3b82f6',
      disabled: false,
    },
  }}
  blockDefinition={buttonBlockDef}
  onUpdateBlock={(blockId, updates) => {
    updateBlock(blockId, { content: updates });
  }}
  onClose={() => setSelectedBlockId(null)}
/>
*/
