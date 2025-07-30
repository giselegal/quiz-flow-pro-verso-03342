
import React from 'react';
import { QuizComponentData } from '@/types/quizBuilder';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface VideoPropertyEditorProps {
  component: QuizComponentData;
  onDataUpdate: (updates: any) => void;
  onStyleUpdate: (updates: any) => void;
}

export const VideoPropertyEditor: React.FC<VideoPropertyEditorProps> = ({
  component,
  onDataUpdate,
  onStyleUpdate
}) => {
  const data = component.data || {};

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="video-url">URL do Vídeo</Label>
        <Input
          id="video-url"
          value={data.videoUrl || ''}
          onChange={(e) => onDataUpdate({ videoUrl: e.target.value })}
          placeholder="https://youtube.com/watch?v=..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="video-title">Título do Vídeo</Label>
        <Input
          id="video-title"
          value={data.title || ''}
          onChange={(e) => onDataUpdate({ title: e.target.value })}
          placeholder="Título do vídeo"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="autoplay"
          checked={data.autoplay || false}
          onCheckedChange={(checked) => onDataUpdate({ autoplay: checked })}
        />
        <Label htmlFor="autoplay">Reproduzir automaticamente</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="controls"
          checked={data.controls !== false}
          onCheckedChange={(checked) => onDataUpdate({ controls: checked })}
        />
        <Label htmlFor="controls">Mostrar controles</Label>
      </div>
    </div>
  );
};
