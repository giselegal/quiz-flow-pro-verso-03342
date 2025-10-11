import { QuizComponentType } from '@/types/quizBuilder';
import { Card } from '@/components/ui/card';

export interface ComponentsSidebarProps {
  onComponentSelect: (type: QuizComponentType) => void;
}

const componentTypes: {
  type: QuizComponentType;
  label: string;
  icon: string;
}[] = [
  { type: 'header', label: 'Cabeçalho', icon: '📝' },
  { type: 'headline', label: 'Título', icon: '🏷️' },
  { type: 'text', label: 'Texto', icon: '📄' },
  { type: 'image', label: 'Imagem', icon: '🖼️' },
  { type: 'multipleChoice', label: 'Múltipla Escolha', icon: '☑️' },
  { type: 'singleChoice', label: 'Escolha Única', icon: '⚪' },
  { type: 'scale', label: 'Escala', icon: '📊' },
  { type: 'openEnded', label: 'Resposta Aberta', icon: '💬' },
  { type: 'date', label: 'Data', icon: '📅' },
  { type: 'button', label: 'Botão', icon: '🔘' },
  { type: 'divider', label: 'Divisor', icon: '➖' },
  { type: 'spacer', label: 'Espaçador', icon: '⬜' },
  { type: 'video', label: 'Vídeo', icon: '📹' },
  { type: 'cta', label: 'Call to Action', icon: '📢' },
];

export const ComponentsSidebar: React.FC<ComponentsSidebarProps> = ({ onComponentSelect }) => {
  return (
    <div className="h-full bg-white border-r border-[#B89B7A]/20 p-4">
      <h3 className="text-lg font-medium text-[#432818] mb-4">Componentes</h3>

      <div className="space-y-2">
        {componentTypes.map(({ type, label, icon }) => (
          <Card
            key={type}
            className="p-3 cursor-pointer hover:bg-[#FFFAF0] transition-colors border-[#B89B7A]/10"
            onClick={() => onComponentSelect(type)}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{icon}</span>
              <span className="text-sm text-[#432818]">{label}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
