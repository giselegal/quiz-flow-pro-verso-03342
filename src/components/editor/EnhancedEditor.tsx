
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Users, Settings, Eye, Save, Download, Upload } from 'lucide-react';
import { StyleResult } from '@/types/quiz';

// Components from admin modules
import { AccessControlSystem, PermissionsProvider, ProtectedComponent, usePermissions } from '../admin/security/AccessControlSystem';
import { WorkflowManager, StatusBadge, useWorkflow } from '../admin/workflow/PublishingWorkflow';
import { AnalyticsDashboard } from '../admin/analytics/AdvancedAnalytics';

// Editor components
import { SEOOptimizer } from './seo/SEOOptimizer';
import { EditorToolbar } from './toolbar/EditorToolbar';
import { PreviewPanel } from './preview/PreviewPanel';
import PropertiesPanel from './properties/PropertiesPanel';

interface EnhancedEditorProps {
  initialData?: any;
  primaryStyle?: StyleResult;
  onSave?: (data: any) => void;
  onPublish?: (data: any) => void;
}

const EnhancedEditor: React.FC<EnhancedEditorProps> = ({
  initialData,
  primaryStyle,
  onSave,
  onPublish
}) => {
  const [activeTab, setActiveTab] = useState('editor');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [editorData, setEditorData] = useState(initialData || {});

  // Access control and workflow hooks
  const permissions = usePermissions();
  const workflow = useWorkflow();

  // Ensure we have a valid StyleResult
  const validPrimaryStyle: StyleResult = primaryStyle || {
    category: 'Natural',
    score: 0,
    percentage: 100
  };

  useEffect(() => {
    // Log user action
    if (permissions.hasPermission) {
      console.log('User accessed enhanced editor');
    }
    
    // Initialize workflow
    if (workflow.canEdit) {
      console.log('Workflow initialized');
    }
  }, [permissions, workflow]);

  const handleSave = () => {
    if (onSave) {
      onSave(editorData);
    }
  };

  const handlePublish = () => {
    if (onPublish && workflow.canPublish) {
      onPublish(editorData);
    }
  };

  const handleComponentSelect = (componentId: string) => {
    setSelectedComponent(componentId);
  };

  const handleDataUpdate = (updates: any) => {
    setEditorData(prev => ({ ...prev, ...updates }));
  };

  return (
    <PermissionsProvider>
      <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Enhanced Editor</h1>
              <StatusBadge status={workflow.status} />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {isPreviewMode ? 'Edit' : 'Preview'}
              </Button>
              
              <ProtectedComponent resource="editor" action="save">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </ProtectedComponent>
              
              <ProtectedComponent resource="editor" action="publish">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handlePublish}
                  disabled={!workflow.canPublish}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Publish
                </Button>
              </ProtectedComponent>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <div className="border-b bg-white">
              <TabsList className="ml-6">
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="workflow">Workflow</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="editor" className="h-full mt-0">
              <div className="h-full flex">
                {/* Components Sidebar */}
                <div className="w-64 bg-white border-r overflow-y-auto">
                  <div className="p-4">
                    <h2 className="font-semibold text-gray-900 mb-4">Components</h2>
                    <div className="space-y-2">
                      {/* Component library would go here */}
                      <Card className="cursor-pointer hover:bg-gray-50">
                        <CardContent className="p-3">
                          <div className="font-medium text-sm">Text Block</div>
                          <div className="text-xs text-gray-500">Add text content</div>
                        </CardContent>
                      </Card>
                      
                      <Card className="cursor-pointer hover:bg-gray-50">
                        <CardContent className="p-3">
                          <div className="font-medium text-sm">Image Block</div>
                          <div className="text-xs text-gray-500">Add images</div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>

                {/* Main Editor Area */}
                <div className="flex-1 flex">
                  {/* Canvas */}
                  <div className="flex-1 bg-gray-100 p-4">
                    <PreviewPanel
                      primaryStyle={validPrimaryStyle}
                      isPreviewMode={isPreviewMode}
                      onComponentSelect={handleComponentSelect}
                      data={editorData}
                    />
                  </div>

                  {/* Properties Panel */}
                  <div className="w-80 bg-white border-l overflow-y-auto">
                    <PropertiesPanel
                      selectedComponentId={selectedComponent}
                      onClose={() => setSelectedComponent(null)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="seo" className="h-full mt-0">
              <div className="p-6">
                <SEOOptimizer />
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="h-full mt-0">
              <div className="p-6">
                <ProtectedComponent 
                  resource="analytics" 
                  action="view"
                  fallback={<div>Access denied</div>}
                >
                  <AnalyticsDashboard />
                </ProtectedComponent>
              </div>
            </TabsContent>

            <TabsContent value="workflow" className="h-full mt-0">
              <div className="p-6">
                <WorkflowManager>
                  <div>Workflow management content</div>
                </WorkflowManager>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="h-full mt-0">
              <div className="p-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Editor Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Auto-save interval
                        </label>
                        <select className="w-full p-2 border rounded-md">
                          <option>30 seconds</option>
                          <option>1 minute</option>
                          <option>5 minutes</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm text-gray-700">Enable dark mode</span>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PermissionsProvider>
  );
};

export default EnhancedEditor;
