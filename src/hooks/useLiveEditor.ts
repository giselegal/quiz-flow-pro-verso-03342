import { useState } from 'react';

interface Stage {
  id: string;
  name: string;
  type: string;
  order: number;
  components: any[];
  settings: any;
}

export const useLiveEditor = () => {
  const [stages, setStages] = useState<Stage[]>([]);

  const loadEditor = () => {
    // Load from localStorage or initialize
    const saved = localStorage.getItem('live_editor_stages');
    if (saved) {
      setStages(JSON.parse(saved));
    }
  };

  const addStage = (stage: Stage) => {
    setStages(prev => [...prev, stage]);
  };

  return {
    stages,
    loadEditor,
    addStage,
  };
};
