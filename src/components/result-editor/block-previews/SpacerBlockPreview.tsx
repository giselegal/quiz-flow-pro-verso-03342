interface SpacerBlockPreviewProps {
  content: {
    height?: string;
    style?: any;
  };
}

const SpacerBlockPreview: React.FC<SpacerBlockPreviewProps> = ({ content }) => {
  const height = content.height || '40px';

  return (
    <div style={{ ...content.style, height }} className="relative">
      <div style={{ borderColor: '#E5DDD5' }}>Espaçamento: {height}</div>
    </div>
  );
};

export default SpacerBlockPreview;
