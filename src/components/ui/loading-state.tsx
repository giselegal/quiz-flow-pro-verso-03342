interface LoadingStateProps {
  message?: string;
  showLogo?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Carregando...",
  showLogo = true,
}) => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#FEFEFE]">
      {showLogo && (
        <div className="w-28 h-auto mb-8">
          <img
            src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp"
            alt="Logo Gisele Galvão"
            width={112}
            height={56}
          />
        </div>
      )}

      <div className="relative w-40 h-[4px] bg-[#f1e8db] rounded-full overflow-hidden mb-4">
        <div className="absolute inset-0 w-1/3 bg-[#b29670] animate-loading-bar rounded-full"></div>
      </div>

      <p className="text-[#432818] font-medium">{message}</p>
    </div>
  );
};
