import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

interface FileLoadingSimulatorProps {
  totalFiles?: number;
  initialLoaded?: number;
  onComplete?: () => void;
  redirectAfterComplete?: string;
  speed?: 'slow' | 'medium' | 'fast';
}

export const FileLoadingSimulator: React.FC<FileLoadingSimulatorProps> = ({
  totalFiles = 3700,
  initialLoaded = 2000,
  onComplete,
  redirectAfterComplete,
  speed = 'medium',
}) => {
  const [filesLoaded, setFilesLoaded] = useState(initialLoaded);
  const [isComplete, setIsComplete] = useState(false);
  const [randomFileName, setRandomFileName] = useState('');

  const fileNames = [
    'lovable-components.tsx',
    'editor-schema.json',
    'visual-styles.css',
    'template-renderer.ts',
    'unified-editor.tsx',
    'quiz-builder.tsx',
    'result-page-template.json',
    'sales-page-config.ts',
    'component-library.js',
    'theme-provider.tsx',
    'lovable-renderer.tsx',
    'studio-connector.ts',
  ];

  const fileExtensions = ['.js', '.ts', '.tsx', '.json', '.css', '.html'];

  useEffect(() => {
    if (filesLoaded >= totalFiles) {
      setIsComplete(true);
      if (onComplete) {
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
      if (redirectAfterComplete) {
        setTimeout(() => {
          window.location.href = redirectAfterComplete;
        }, 2000);
      }
      return;
    }

    const interval = setInterval(
      () => {
        const increment =
          speed === 'slow'
            ? Math.floor(Math.random() * 3) + 1
            : speed === 'medium'
              ? Math.floor(Math.random() * 10) + 5
              : Math.floor(Math.random() * 50) + 20;

        setFilesLoaded(prev => {
          const newValue = prev + increment;
          return newValue > totalFiles ? totalFiles : newValue;
        });

        // Gerar um nome de arquivo aleatório
        const randomBase = fileNames[Math.floor(Math.random() * fileNames.length)];
        const randomExt = fileExtensions[Math.floor(Math.random() * fileExtensions.length)];
        const fileName = randomBase.replace(/\.\w+$/, '') + randomExt;
        setRandomFileName(fileName);
      },
      speed === 'slow' ? 1000 : speed === 'medium' ? 300 : 100
    );

    return () => clearInterval(interval);
  }, [filesLoaded, totalFiles, onComplete, redirectAfterComplete, speed]);

  const progressPercentage = (filesLoaded / totalFiles) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9F6F3] p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-[#B89B7A] rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-medium text-[#432818]">Carregando Editor</h1>
              <p className="text-[#8F7A6A]">Preparando recursos para o editor visual</p>
            </div>
          </div>
          <div>
            <span className="text-sm font-semibold text-[#B89B7A]">Lovable Studio</span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-[#432818]">Progresso</span>
              <span className="text-sm font-medium text-[#432818]">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="bg-[#F9F6F3] rounded-md p-4 border border-[#B89B7A]/20">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-[#432818]">Arquivos</span>
              <span className="text-sm font-medium text-[#432818]">
                {filesLoaded} de {totalFiles}
              </span>
            </div>

            <div className="flex items-center text-xs text-[#8F7A6A] animate-pulse">
              <div className="w-4 h-4 mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-full w-full text-[#B89B7A]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <span>
                {isComplete
                  ? 'Carregamento concluído! Redirecionando...'
                  : `Carregando ${randomFileName}`}
              </span>
            </div>
          </div>

          <div className="text-sm text-center text-[#8F7A6A]">
            {isComplete
              ? 'Carregamento completo! Você será redirecionado para o editor.'
              : 'Por favor, aguarde enquanto carregamos os arquivos necessários.'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileLoadingSimulator;
