/**
 * 🔀 Editor Mode Toggle - Switch between Visual and JSON modes
 */

import { memo } from 'react';
import { useEditorStore } from '../store/editorStore';
import { Code2, LayoutGrid } from 'lucide-react';

export const EditorModeToggle = memo(() => {
  const editorMode = useEditorStore((s) => s.editorMode);
  const setEditorMode = useEditorStore((s) => s.setEditorMode);

  return (
    <div className="flex items-center bg-muted rounded-lg p-1">
      <button
        onClick={() => setEditorMode('visual')}
        className={`
          flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium
          transition-all duration-200
          ${editorMode === 'visual' 
            ? 'bg-background text-foreground shadow-sm' 
            : 'text-muted-foreground hover:text-foreground'}
        `}
        title="Editor Visual"
      >
        <LayoutGrid className="w-4 h-4" />
        Visual
      </button>
      
      <button
        onClick={() => setEditorMode('json')}
        className={`
          flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium
          transition-all duration-200
          ${editorMode === 'json' 
            ? 'bg-background text-foreground shadow-sm' 
            : 'text-muted-foreground hover:text-foreground'}
        `}
        title="Editor JSON"
      >
        <Code2 className="w-4 h-4" />
        JSON
      </button>
    </div>
  );
});

EditorModeToggle.displayName = 'EditorModeToggle';
