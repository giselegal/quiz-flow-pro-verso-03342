export interface QuizBlockProps {
  id: string;
  type: string;
  properties: Record<string, any>;
  isSelected?: boolean;
  isEditing?: boolean;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
  className?: string;
}
