import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface EditSectionOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  sectionTitle: string;
  currentContent: any;
}

const EditSectionOverlay: React.FC<EditSectionOverlayProps> = ({
  isVisible,
  onClose,
  onSave,
  sectionTitle,
  currentContent
}) => {
  const [content, setContent] = useState(currentContent || {});

  const handleSave = () => {
    onSave(content);
    onClose();
  };

  const handleContentChange = (field: string, value: any) => {
    setContent((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{sectionTitle}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Content editing form goes here */}
        <div className="space-y-4">
          {/* Add form fields based on section type */}
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
};

// Export as both named and default export
export { EditSectionOverlay };
export default EditSectionOverlay;
