import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface EditableSectionProps {
  title: string;
  content: any;
  onChange: (newContent: any) => void;
}

const EditableSection: React.FC<EditableSectionProps> = ({ title, content, onChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Seção editável: {title}</p>
          <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-32">
            {JSON.stringify(content, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditableSection;
