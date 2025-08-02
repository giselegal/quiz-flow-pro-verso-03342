
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';

interface EditSectionOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  section: string;
  content: Record<string, any>;
  onSave: (content: Record<string, any>) => void;
}

const EditSectionOverlay: React.FC<EditSectionOverlayProps> = ({
  isOpen,
  onClose,
  section,
  content,
  onSave
}) => {
  const [editedContent, setEditedContent] = useState<Record<string, any>>(content || {});

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(editedContent);
    onClose();
  };

  const handleFieldChange = (field: string, value: any) => {
    setEditedContent((prev: Record<string, any>) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#432818]">
            Editar {section}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Dynamic form fields based on section */}
          {Object.keys(editedContent).map((key) => {
            const value = editedContent[key];
            
            if (typeof value === 'string') {
              if (value.length > 100) {
                return (
                  <div key={key}>
                    <label className="block text-sm font-medium mb-1 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <Textarea
                      value={value}
                      onChange={(e) => handleFieldChange(key, e.target.value)}
                      rows={3}
                    />
                  </div>
                );
              } else {
                return (
                  <div key={key}>
                    <label className="block text-sm font-medium mb-1 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <Input
                      value={value}
                      onChange={(e) => handleFieldChange(key, e.target.value)}
                    />
                  </div>
                );
              }
            }
            
            return null;
          })}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-[#B89B7A] hover:bg-[#A38A69] text-white">
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditSectionOverlay;
