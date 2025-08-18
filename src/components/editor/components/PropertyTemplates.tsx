// =====================================================================
// components/editor/components/PropertyTemplates.tsx - Templates de propriedades
// =====================================================================

import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Badge } from '../../ui/badge';
import {
  Palette,
  Layout,
  Target,
  Sparkles,
  FileText,
  PieChart,
  MessageSquare,
  Star,
} from 'lucide-react';

interface PropertyTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'layout' | 'styling' | 'content' | 'interaction';
  properties: Record<string, any>;
}

interface PropertyTemplatesProps {
  onApplyTemplate: (properties: Record<string, any>) => void;
}

const templates: PropertyTemplate[] = [
  {
    id: 'quiz-card',
    name: 'Card de Quiz',
    description: 'Layout moderno para questões de quiz',
    icon: Target,
    category: 'layout',
    properties: {
      layout: 'vertical',
      backgroundColor: '#ffffff',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#e5e7eb',
      shadow: 'md',
      spacing: 20,
      required: true,
    },
  },
  {
    id: 'minimal-clean',
    name: 'Minimalista',
    description: 'Design limpo e minimalista',
    icon: Layout,
    category: 'styling',
    properties: {
      backgroundColor: '#fafafa',
      textColor: '#374151',
      borderRadius: 8,
      borderWidth: 0,
      shadow: 'none',
      spacing: 16,
    },
  },
  {
    id: 'colorful-modern',
    name: 'Moderno Colorido',
    description: 'Visual vibrante e moderno',
    icon: Palette,
    category: 'styling',
    properties: {
      backgroundColor: '#3b82f6',
      textColor: '#ffffff',
      borderRadius: 16,
      borderWidth: 0,
      shadow: 'lg',
      spacing: 24,
      animation: 'fade',
      delay: 200,
    },
  },
  {
    id: 'grid-layout',
    name: 'Layout em Grade',
    description: 'Organização em grade responsiva',
    icon: Layout,
    category: 'layout',
    properties: {
      layout: 'grid',
      columns: 2,
      spacing: 16,
      alignment: 'center',
    },
  },
  {
    id: 'survey-style',
    name: 'Estilo Pesquisa',
    description: 'Formato tradicional de pesquisa',
    icon: FileText,
    category: 'content',
    properties: {
      layout: 'vertical',
      multipleChoice: false,
      required: true,
      autoAdvance: true,
      backgroundColor: '#f9fafb',
      borderRadius: 6,
      spacing: 12,
    },
  },
  {
    id: 'assessment-quiz',
    name: 'Quiz de Avaliação',
    description: 'Para avaliações e testes',
    icon: PieChart,
    category: 'interaction',
    properties: {
      multipleChoice: true,
      maxSelections: 1,
      required: true,
      autoAdvance: false,
      backgroundColor: '#ffffff',
      borderColor: '#d1d5db',
      borderWidth: 2,
      borderRadius: 8,
    },
  },
  {
    id: 'feedback-form',
    name: 'Formulário de Feedback',
    description: 'Para coletar opiniões',
    icon: MessageSquare,
    category: 'content',
    properties: {
      multipleChoice: true,
      maxSelections: 3,
      required: false,
      backgroundColor: '#fef3c7',
      textColor: '#92400e',
      borderRadius: 10,
      spacing: 18,
    },
  },
  {
    id: 'premium-style',
    name: 'Estilo Premium',
    description: 'Design sofisticado e elegante',
    icon: Star,
    category: 'styling',
    properties: {
      backgroundColor: '#1f2937',
      textColor: '#f9fafb',
      borderColor: '#6b7280',
      borderWidth: 1,
      borderRadius: 12,
      shadow: 'xl',
      spacing: 24,
      animation: 'slide',
      delay: 300,
    },
  },
];

const categoryColors = {
  layout: 'bg-[#B89B7A]/20 text-[#432818]',
  styling: 'bg-[#B89B7A]/20 text-purple-800',
  content: 'bg-green-100 text-green-800',
  interaction: 'bg-[#B89B7A]/20 text-orange-800',
};

const categoryIcons = {
  layout: Layout,
  styling: Palette,
  content: FileText,
  interaction: Target,
};

export const PropertyTemplates: React.FC<PropertyTemplatesProps> = ({ onApplyTemplate }) => {
  const categorizedTemplates = templates.reduce(
    (acc, template) => {
      if (!acc[template.category]) {
        acc[template.category] = [];
      }
      acc[template.category].push(template);
      return acc;
    },
    {} as Record<string, PropertyTemplate[]>
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Sparkles className="w-4 h-4 mr-1" />
          Templates
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4" align="start">
        <div className="space-y-4">
          <div>
            <h3 style={{ color: '#432818' }}>Templates de Propriedades</h3>
            <p style={{ color: '#6B4F43' }}>Aplique configurações predefinidas rapidamente</p>
          </div>

          {Object.entries(categorizedTemplates).map(([category, categoryTemplates]) => {
            const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons];

            return (
              <div key={category}>
                <div className="flex items-center space-x-2 mb-3">
                  <CategoryIcon className="w-4 h-4" />
                  <h4 className="font-medium text-sm capitalize">{category}</h4>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${categoryColors[category as keyof typeof categoryColors]}`}
                  >
                    {categoryTemplates.length}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-2 mb-4">
                  {categoryTemplates.map(template => {
                    const TemplateIcon = template.icon;

                    return (
                      <Card
                        key={template.id}
                        style={{ borderColor: '#E5DDD5' }}
                        onClick={() => onApplyTemplate(template.properties)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <TemplateIcon style={{ color: '#6B4F43' }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 style={{ color: '#432818' }}>{template.name}</h5>
                              <p style={{ color: '#6B4F43' }}>{template.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div style={{ borderColor: '#E5DDD5' }}>
            <p style={{ color: '#8B7355' }}>Clique em um template para aplicar as propriedades</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
