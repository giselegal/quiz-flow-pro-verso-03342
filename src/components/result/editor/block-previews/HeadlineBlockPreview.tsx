interface HeadlineBlockPreviewProps {
  content: {
    title?: string;
    subtitle?: string;
    style?: any;
  };
}

const HeadlineBlockPreview: React.FC<HeadlineBlockPreviewProps> = ({ content }) => {
  const { title, subtitle, style = {} } = content;

  // Aplicar estilos ou usar padrões
  const titleStyle = {
    fontSize: style.fontSize || '1.5rem',
    fontWeight: style.fontWeight || '600',
    color: style.color || '#432818',
    textAlign: style.textAlign || 'left',
    ...style,
  };

  const subtitleStyle = {
    fontSize: '1rem',
    color: '#8F7A6A',
    textAlign: style.textAlign || 'left',
  };

  return (
    <div className="mb-4">
      {title && (
        <h2 style={titleStyle} className="font-playfair">
          {title}
        </h2>
      )}
      {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
    </div>
  );
};

export default HeadlineBlockPreview;
