// @ts-nocheck
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
          <p style={{ color: '#8B7355' }}>Seção editável: {title}</p>
          <pre style={{ backgroundColor: '#FAF9F7' }}>{JSON.stringify(content, null, 2)}</pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditableSection;
