import React, { useState,} from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface Template {
  id: string;
  name: string;
  image: string;
  category: string;
  description: string;
}

interface TemplateSelectorProps {
  onSelectTemplate: (template: Template) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const allTemplates: Template[] = [
  {
    id: "1",
    name: "Template A",
    image: "https://via.placeholder.com/300x200",
    category: "Negócios",
    description: "Template para negócios",
  },
  {
    id: "2",
    name: "Template B",
    image: "https://via.placeholder.com/300x200",
    category: "Pessoal",
    description: "Template para uso pessoal",
  },
  {
    id: "3",
    name: "Template C",
    image: "https://via.placeholder.com/300x200",
    category: "Saúde",
    description: "Template para área da saúde",
  },
  {
    id: "4",
    name: "Template D",
    image: "https://via.placeholder.com/300x200",
    category: "Negócios",
    description: "Template para negócios",
  },
  {
    id: "5",
    name: "Template E",
    image: "https://via.placeholder.com/300x200",
    category: "Pessoal",
    description: "Template para uso pessoal",
  },
  {
    id: "6",
    name: "Template F",
    image: "https://via.placeholder.com/300x200",
    category: "Saúde",
    description: "Template para área da saúde",
  },
];

const categories = new Set(allTemplates.map(template => template.category));

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  onSelectTemplate,
  selectedCategory,
  onCategoryChange,
}) => {
  const getFilteredTemplates = (): Template[] => {
    if (selectedCategory === "all") return allTemplates;
    return allTemplates.filter(template => template.category === selectedCategory);
  };

  const filteredTemplates = getFilteredTemplates();

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div style={{ borderColor: "#E5DDD5" }}>
        <h2 style={{ color: "#432818" }}>Selecionar Template</h2>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange("all")}
            className="text-xs"
          >
            Todos
          </Button>
          {Array.from(categories).map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category)}
              className="text-xs"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Templates grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredTemplates.length === 0 ? (
          <div style={{ color: "#8B7355" }}>
            <p>Nenhum template encontrado para esta categoria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map(template => (
              <TemplateCard key={template.id} template={template} onSelect={onSelectTemplate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface TemplateCardProps {
  template: Template;
  onSelect: (template: Template) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onSelect }) => {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => {
        setIsSelected(true);
        onSelect(template);
      }}
    >
      <CardHeader>
        <CardTitle className="text-sm font-medium">{template.name}</CardTitle>
        <CardDescription style={{ color: "#8B7355" }}>{template.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <img
          src={template.image}
          alt={template.name}
          className="w-full h-40 object-cover rounded-md"
        />
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span style={{ color: "#6B4F43" }}>{template.category}</span>
        {isSelected && <CheckCircle className="w-4 h-4 text-green-500" />}
      </CardFooter>
    </Card>
  );
};

export default TemplateSelector;
