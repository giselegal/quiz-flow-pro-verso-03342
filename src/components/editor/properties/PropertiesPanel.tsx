
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings2, X } from 'lucide-react';

interface PropertiesPanelProps {
  selectedComponentId: string | null;
  onClose: () => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedComponentId,
  onClose
}) => {
  if (!selectedComponentId) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center text-gray-500">
          <Settings2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Select a component to edit its properties</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold text-gray-900">Properties</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Component Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Component ID
                </label>
                <input
                  type="text"
                  value={selectedComponentId}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter content..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Style
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Default</option>
                  <option>Primary</option>
                  <option>Secondary</option>
                </select>
              </div>
              
              <div className="pt-4 border-t">
                <Button className="w-full">
                  Apply Changes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PropertiesPanel;
