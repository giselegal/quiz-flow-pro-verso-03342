import React from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useDraggable, useDroppable } from '@dnd-kit/core';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Edit, Settings, Eye, Smartphone, Monitor } from 'lucide-react';

interface ComponentProps {
  id: string;
  type: string;
  props?: any;
  children?: ComponentProps[];
}

const initialComponents: ComponentProps[] = [
  { id: '1', type: 'heading', props: { text: 'Título Principal', level: 1 } },
  { id: '2', type: 'paragraph', props: { text: 'Este é um parágrafo de exemplo.' } },
  { id: '3', type: 'button', props: { text: 'Clique Aqui', variant: 'primary' } },
  { id: '4', type: 'image', props: { src: 'https://via.placeholder.com/150', alt: 'Imagem de Exemplo' } },
];

const SchemaDrivenEditorResponsive: React.FC = () => {
  const [components, setComponents] = React.useState<ComponentProps[]>(initialComponents);
  const [selectedComponent, setSelectedComponent] = React.useState<ComponentProps | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [draggedComponent, setDraggedComponent] = React.useState<ComponentProps | null>(null);
  const [previewMode, setPreviewMode] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
    const draggedId = event.active.id.toString();
    const component = components.find(c => c.id === draggedId);
    setDraggedComponent(component || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
    const { over } = event;

    if (over) {
      const overId = over.id.toString();
      if (draggedComponent) {
        setComponents(prevComponents => {
          const newComponents = [...prevComponents];
          const overIndex = newComponents.findIndex(c => c.id === overId);
          if (overIndex !== -1) {
            newComponents.splice(overIndex, 0, draggedComponent);
            return newComponents;
          }
          return prevComponents;
        });
      }
    }
    setDraggedComponent(null);
  };

  const addComponent = (type: string) => {
    const newId = Math.random().toString(36).substring(7);
    const newComponent: ComponentProps = { id: newId, type: type };
    setComponents([...components, newComponent]);
  };

  const updateComponent = (updatedComponent: ComponentProps) => {
    setComponents(components.map(c => c.id === updatedComponent.id ? updatedComponent : c));
    setSelectedComponent(updatedComponent);
  };

  const deleteComponent = (id: string) => {
    setComponents(components.filter(c => c.id !== id));
    setSelectedComponent(null);
  };

  const handleSelect = (component: ComponentProps) => {
    setSelectedComponent(component);
  };

  const renderComponent = (component: ComponentProps) => {
    switch (component.type) {
      case 'heading':
        return <h2 key={component.id} className="text-2xl">{component.props?.text || 'Título'}</h2>;
      case 'paragraph':
        return <p key={component.id}>{component.props?.text || 'Parágrafo'}</p>;
      case 'button':
        return <Button key={component.id}>{component.props?.text || 'Botão'}</Button>;
      case 'image':
        return <img key={component.id} src={component.props?.src || 'https://via.placeholder.com/150'} alt={component.props?.alt || 'Imagem'} />;
      default:
        return <div key={component.id}>Componente Desconhecido</div>;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar de Componentes */}
      <aside className="w-64 bg-gray-100 p-4 border-r">
        <h3 className="font-medium mb-4">Componentes</h3>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('heading')}>
            <Plus className="mr-2 h-4 w-4" /> Título
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('paragraph')}>
            <Plus className="mr-2 h-4 w-4" /> Parágrafo
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('button')}>
            <Plus className="mr-2 h-4 w-4" /> Botão
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('image')}>
            <Plus className="mr-2 h-4 w-4" /> Imagem
          </Button>
        </div>
      </aside>

      {/* Editor */}
      <div className="flex-1 p-4">
        <Tabs defaultValue="design" className="mb-4">
          <TabsList>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="design" className="space-y-4">
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setPreviewMode('desktop')}>
                <Monitor className="mr-2 h-4 w-4" />
                Desktop
              </Button>
              <Button variant="outline" onClick={() => setPreviewMode('tablet')}>
                <Edit className="mr-2 h-4 w-4" />
                Tablet
              </Button>
              <Button variant="outline" onClick={() => setPreviewMode('mobile')}>
                <Smartphone className="mr-2 h-4 w-4" />
                Mobile
              </Button>
            </div>

            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
              <Card>
                <CardHeader>
                  <CardTitle>Área de Design</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {components.map(component => (
                    <div
                      key={component.id}
                      className={`p-4 rounded border ${selectedComponent?.id === component.id ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-gray-300'} cursor-move`}
                      onClick={() => handleSelect(component)}
                    >
                      {renderComponent(component)}
                      <div className="flex justify-end mt-2">
                        <Button variant="ghost" size="sm" onClick={() => deleteComponent(component.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <DragOverlay>
                {draggedComponent ? renderComponent(draggedComponent) : null}
              </DragOverlay>
            </DndContext>
          </TabsContent>
          <TabsContent value="preview">
            <div className="p-4">
              <h3 className="font-medium">Preview</h3>
              <div className="border rounded p-4">
                {components.map(component => renderComponent(component))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Sidebar de Propriedades */}
      <aside className="w-80 bg-gray-50 p-4 border-l">
        <h3 className="font-medium mb-4">Propriedades</h3>
        {selectedComponent ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo</label>
              <div className="mt-1 rounded border bg-gray-100 p-2 text-sm">
                {selectedComponent.type}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ID</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                value={selectedComponent.id}
                onChange={(e) => updateComponent({ ...selectedComponent, id: e.target.value })}
              />
            </div>
            {selectedComponent.type === 'heading' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Texto do Título</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  value={selectedComponent.props?.text || ''}
                  onChange={(e) => updateComponent({
                    ...selectedComponent,
                    props: { ...selectedComponent.props, text: e.target.value }
                  })}
                />
              </div>
            )}
            {selectedComponent.type === 'paragraph' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Texto do Parágrafo</label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  value={selectedComponent.props?.text || ''}
                  onChange={(e) => updateComponent({
                    ...selectedComponent,
                    props: { ...selectedComponent.props, text: e.target.value }
                  })}
                />
              </div>
            )}
            {selectedComponent.type === 'button' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Texto do Botão</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  value={selectedComponent.props?.text || ''}
                  onChange={(e) => updateComponent({
                    ...selectedComponent,
                    props: { ...selectedComponent.props, text: e.target.value }
                  })}
                />
              </div>
            )}
            {selectedComponent.type === 'image' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">URL da Imagem</label>
                  <input
                    type="url"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    value={selectedComponent.props?.src || ''}
                    onChange={(e) => updateComponent({
                      ...selectedComponent,
                      props: { ...selectedComponent.props, src: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Texto Alternativo</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    value={selectedComponent.props?.alt || ''}
                    onChange={(e) => updateComponent({
                      ...selectedComponent,
                      props: { ...selectedComponent.props, alt: e.target.value }
                    })}
                  />
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <Settings className="mx-auto h-6 w-6 mb-2" />
            Selecione um componente para editar
          </div>
        )}
      </aside>
    </div>
  );
};

export default SchemaDrivenEditorResponsive;
