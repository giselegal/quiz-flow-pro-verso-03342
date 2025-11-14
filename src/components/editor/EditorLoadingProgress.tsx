import React from 'react';

export const EditorLoadingProgress: React.FC<{ progress: number }> = ({ progress }) => {
  if (progress >= 1 || progress <= 0) return null;
  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-slate-200 z-50" data-testid="editor-loading-progress">
      <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${progress * 100}%` }} />
      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-sm text-slate-600">
        {Math.round(progress * 100)}%
      </div>
    </div>
  );
};
