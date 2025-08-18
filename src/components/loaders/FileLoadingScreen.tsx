import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

interface FileLoadingScreenProps {
  fileUrl?: string;
  onFileLoaded?: () => void;
  onError?: (error: Error) => void;
}

const FileLoadingScreen: React.FC<FileLoadingScreenProps> = ({
  fileUrl = '',
  onFileLoaded = () => {},
  onError = () => {},
}) => {
  // Avoid unused warnings when props are optional
  void fileUrl;
  void onError;
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          setIsComplete(true);
          clearInterval(timer);
          setTimeout(() => {
            onFileLoaded();
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onFileLoaded]);

  return (
    <div className="min-h-screen bg-[#F9F7F4] flex items-center justify-center">
      <div className="max-w-md w-full px-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-playfair text-[#432818] mb-2">Carregando Sistema</h1>
          <p className="text-[#8F7A6A]">Preparando sua experiência personalizada...</p>
        </div>

        <div className="space-y-4">
          <Progress value={progress} className="h-2" />
          <div className="text-center">
            <span className="text-sm text-[#8F7A6A]">{Math.round(progress)}% concluído</span>
          </div>
        </div>

        {isComplete && (
          <div className="text-center mt-4">
            <p className="text-[#432818] font-medium">✓ Carregamento concluído!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileLoadingScreen;
