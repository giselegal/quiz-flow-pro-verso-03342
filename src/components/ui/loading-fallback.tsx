interface LoadingFallbackProps {
  message?: string;
}

export const LoadingFallback: React.FC<LoadingFallbackProps> = ({ message = "Carregando..." }) => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#FAF9F7]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B89B7A] mx-auto mb-4"></div>
        <p className="text-[#432818] text-lg">{message}</p>
      </div>
    </div>
  );
};
