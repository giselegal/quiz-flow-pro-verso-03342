import FileLoadingScreen from '@/components/loaders/FileLoadingScreen';

const AccessLoaderPage: React.FC = () => {
  const handleFileLoaded = () => {
    console.log('File loading completed');
  };

  const handleError = (error: Error) => {
    console.error('File loading error:', error);
  };

  return (
    <div className="min-h-screen">
      <FileLoadingScreen fileUrl="/admin" onFileLoaded={handleFileLoaded} onError={handleError} />
    </div>
  );
};

export default AccessLoaderPage;
