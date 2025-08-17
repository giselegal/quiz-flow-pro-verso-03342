import React, { useState } from 'react';
import { quizTemplates, QuizTemplate } from '@/data/quizTemplates';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, Plus } from 'lucide-react';

interface TemplateSelectorProps {
  onSelectTemplate: (template: QuizTemplate) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelectTemplate }) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSelectTemplate = (template: QuizTemplate) => {
    setSelectedTemplateId(template.id);
  };

  const handleConfirmSelection = () => {
    const selectedTemplate = quizTemplates.find(template => template.id === selectedTemplateId);
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
      setDialogOpen(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Plus className="mr-2 h-4 w-4" />
          Usar Template Pré-definido
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Escolha um Template</DialogTitle>
          <DialogDescription>
            Selecione um template pré-definido para começar seu quiz rapidamente.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-grow pr-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
            {quizTemplates.map(template => (
              <Card
                key={template.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${selectedTemplateId === template.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => handleSelectTemplate(template)}
              >
                <div className="relative">
                  {selectedTemplateId === template.id && (
                    <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-32 object-cover rounded-md mb-3"
                  />
                </div>
                <h3 className="font-medium text-lg">{template.name}</h3>
                <p className="text-sm text-muted-foreground">{template.description}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {template.stages.length} etapas
                </p>
              </Card>
            ))}
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 mt-4 pt-2 border-t">
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmSelection} disabled={!selectedTemplateId}>
            Usar Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateSelector;
