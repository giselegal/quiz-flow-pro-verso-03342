interface QuizImageProps {
  src?: string;
  alt: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  alignment?: 'left' | 'center' | 'right';
  className?: string;
}

const QuizImage: React.FC<QuizImageProps> = ({
  src = '',
  alt,
  width = '100%',
  height = 'auto',
  borderRadius = '8px',
  alignment = 'center',
  className = '',
}) => {
  const containerStyle: React.CSSProperties = {
    textAlign: alignment,
    margin: '1rem 0',
  };

  const imageStyle: React.CSSProperties = {
    width,
    height,
    borderRadius,
    maxWidth: '100%',
    objectFit: 'cover',
    display: 'inline-block',
  };

  return (
    <div style={containerStyle} className={className}>
      <img src={src} alt={alt} style={imageStyle} loading="lazy" />
    </div>
  );
};

export default QuizImage;
