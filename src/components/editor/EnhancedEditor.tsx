
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Save, Settings, Users, Globe, Shield } from 'lucide-react';
import { StyleResult } from '@/types/quiz';
import { ComponentsSidebar } from './sidebar/ComponentsSidebar';
import { EditorToolbar } from './toolbar/EditorToolbar';
import { PreviewPanel } from './preview/PreviewPanel';
import PropertiesPanel from './properties/PropertiesPanel';
import { SEOOptimizer } from './seo/SEOOptimizer';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

interface EnhancedEditorProps {
  primaryStyle?: StyleResult;
  onSave?: () => void;
  onPublish?: () => void;
}

const EnhancedEditor: React.FC<EnhancedEditorProps> = ({ 
  primaryStyle, 
  onSave, 
  onPublish 
}) => {
  const [activeTab, setActiveTab] = useState('design');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [data, setData] = useState<any>({});

  // Ensure we have a valid StyleResult (string)
  const validPrimaryStyle: StyleResult = primaryStyle || 'natural';

  const handleSave = useCallback(() => {
    setData((prev: any) => ({ ...prev, lastSaved: new Date() }));
    onSave?.();
  }, [onSave]);

  const handlePublish = useCallback(() => {
    onPublish?.();
  }, [onPublish]);

  const handleComponentSelect = (componentId: string) => {
    setSelectedComponent(componentId);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      <EditorToolbar
        onSave={handleSave}
        canSave={true}
        canPublish={true}
        isPreviewMode={isPreviewMode}
        onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
      />

      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <div className="border-b bg-white px-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="design" className="flex-1 m-0">
            <ResizablePanelGroup direction="horizontal" className="h-full">
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                <div className="h-full border-r bg-white">
                  <ComponentsSidebar onComponentSelect={handleComponentSelect} />
                </div>
              </ResizablePanel>
              
              <ResizableHandle withHandle />
              
              <ResizablePanel defaultSize={60}>
                <PreviewPanel
                  isPreviewMode={isPreviewMode}
                  onComponentSelect={handleComponentSelect}
                  data={data}
                />
              </ResizablePanel>
              
              <ResizableHandle withHandle />
              
              <ResizablePanel defaultSize={20} minSize={15} maxSize={35}>
                <div className="h-full border-l bg-white">
                  <PropertiesPanel
                    selectedComponentId={selectedComponent}
                    onClose={() => setSelectedComponent(null)}
                  />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </TabsContent>

          <TabsContent value="content" className="flex-1 m-0">
            <div className="h-full p-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Content Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Content editing interface will be implemented here.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="seo" className="flex-1 m-0">
            <div className="h-full p-4">
              <SEOOptimizer funnelId="default" />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="flex-1 m-0">
            <div className="h-full p-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Analytics Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Analytics dashboard will be implemented here.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 m-0">
            <div className="h-full p-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Editor Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Settings panel will be implemented here.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedEditor;
