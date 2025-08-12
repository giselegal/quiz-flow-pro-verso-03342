interface HeaderProps {
  logo?: string;
  logoAlt?: string;
  logoHeight?: number;
  logoWidth?: number;
  userName?: string;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  logo,
  logoAlt = 'Logo',
  logoHeight = 40,
  logoWidth = 'auto',
  userName,
  className = '',
}) => {
  return (
    <header className={`w-full py-4 px-6 bg-white border-b border-gray-200 ${className}`}>
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {logo && (
          <div className="flex items-center">
            <img
              src={logo}
              alt={logoAlt}
              style={{
                height: typeof logoHeight === 'number' ? `${logoHeight}px` : logoHeight,
                width: typeof logoWidth === 'number' ? `${logoWidth}px` : logoWidth,
              }}
              className="object-contain"
            />
          </div>
        )}

        {userName && (
          <div className="text-right">
            <p style={{ color: '#6B4F43' }}>Olá,</p>
            <p className="text-lg font-medium text-[#432818]">{userName}</p>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
