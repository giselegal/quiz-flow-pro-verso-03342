interface HeaderBlockPreviewProps {
  content: {
    title?: string;
    subtitle?: string;
    logo?: string;
    logoAlt?: string;
    logoWidth?: string | number;
    logoHeight?: string | number;
    style?: any;
  };
}

const HeaderBlockPreview: React.FC<HeaderBlockPreviewProps> = ({ content }) => {
  const logoStyle = {
    width: content.logoWidth || 'auto',
    height: content.logoHeight || 'auto',
    maxWidth: '100%',
    objectFit: 'contain' as 'contain', // Type assertion to ObjectFit
  };

  return (
    <div style={content.style} className="text-center">
      {content.logo && (
        <img
          src={content.logo}
          alt={content.logoAlt || 'Logo'}
          style={logoStyle}
          className="mx-auto mb-4"
        />
      )}

      {content.title && (
        <h1 className="text-xl md:text-2xl font-semibold text-[#432818] mb-2">{content.title}</h1>
      )}

      {content.subtitle && <p className="text-[#8F7A6A]">{content.subtitle}</p>}
    </div>
  );
};

export default HeaderBlockPreview;
