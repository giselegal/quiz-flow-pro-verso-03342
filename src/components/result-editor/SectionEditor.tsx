import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Section } from '@/types/resultPageConfig';

interface SectionEditorProps {
  section: Section;
  onUpdate: (section: Section) => void;
  sectionName: string;
}

const SectionEditor: React.FC<SectionEditorProps> = ({ section, onUpdate, sectionName }) => {
  const handleVisibilityChange = (checked: boolean) => {
    onUpdate({ ...section, visible: checked });
  };

  const handleContentChange = (fieldName: string, value: string) => {
    onUpdate({
      ...section,
      content: {
        ...section.content,
        [fieldName]: value,
      },
    });
  };

  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span>{sectionName}</span>
          <div className="flex items-center gap-2">
            <Label htmlFor={`visible-${sectionName}`} className="text-sm font-normal">
              Visível
            </Label>
            <Switch
              id={`visible-${sectionName}`}
              checked={section.visible}
              onCheckedChange={handleVisibilityChange}
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        {section.visible && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="content">
              <AccordionTrigger className="text-sm">Conteúdo</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {Object.entries(section.content).map(([key, value]) => {
                    // Skip rendering arrays and objects directly
                    if (Array.isArray(value) || typeof value === 'object') {
                      return null;
                    }

                    if (typeof value === 'string' && value.length > 100) {
                      return (
                        <div key={key} className="space-y-2">
                          <Label htmlFor={key} className="text-xs capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </Label>
                          <Textarea
                            id={key}
                            value={value}
                            onChange={e => handleContentChange(key, e.target.value)}
                            rows={3}
                          />
                        </div>
                      );
                    }

                    return (
                      <div key={key} className="space-y-2">
                        <Label htmlFor={key} className="text-xs capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                        <Input
                          id={key}
                          value={value}
                          onChange={e => handleContentChange(key, e.target.value)}
                        />
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="appearance">
              <AccordionTrigger className="text-sm">Aparência</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {section.appearance &&
                    Object.entries(section.appearance).map(([key, value]) => {
                      if (typeof value === 'boolean') {
                        return (
                          <div key={key} className="flex items-center justify-between">
                            <Label htmlFor={`${key}-appearance`} className="text-xs capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </Label>
                            <Switch
                              id={`${key}-appearance`}
                              checked={value}
                              onCheckedChange={checked => {
                                onUpdate({
                                  ...section,
                                  appearance: {
                                    ...section.appearance,
                                    [key]: checked,
                                  },
                                });
                              }}
                            />
                          </div>
                        );
                      }

                      return (
                        <div key={key} className="space-y-2">
                          <Label htmlFor={`${key}-appearance`} className="text-xs capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </Label>
                          <Input
                            id={`${key}-appearance`}
                            value={value}
                            onChange={e => {
                              onUpdate({
                                ...section,
                                appearance: {
                                  ...section.appearance,
                                  [key]: e.target.value,
                                },
                              });
                            }}
                          />
                        </div>
                      );
                    })}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
};

export default SectionEditor;
