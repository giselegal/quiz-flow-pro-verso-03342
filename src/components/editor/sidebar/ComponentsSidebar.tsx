import React from "react";
import { Button } from "@/components/ui/button";

interface ComponentsSidebarProps {
  onComponentSelect: (type: string) => void;
}

export const ComponentsSidebar: React.FC<ComponentsSidebarProps> = ({
  onComponentSelect,
}) => {
  const components = [
    { type: "header", label: "Header" },
    { type: "text", label: "Text" },
    { type: "image", label: "Image" },
    { type: "cta", label: "Call to Action" },
    { type: "question", label: "Question" },
    { type: "choice-single", label: "Single Choice" },
    { type: "choice-multiple", label: "Multiple Choice" },
    { type: "input-text", label: "Text Input" },
    { type: "input-email", label: "Email Input" },
    { type: "input-phone", label: "Phone Input" },
    { type: "progress-bar", label: "Progress Bar" },
    { type: "navigation", label: "Navigation" },
  ];

  return (
    <div className="h-full bg-gray-50 p-4">
      <h3 className="text-lg font-semibold mb-4">Components</h3>
      <div className="space-y-2">
        {components.map((component) => (
          <Button
            key={component.type}
            variant="outline"
            className="w-full justify-start"
            onClick={() => onComponentSelect(component.type)}
          >
            {component.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
