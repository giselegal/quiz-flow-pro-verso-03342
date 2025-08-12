interface TestimonialsBlockPreviewProps {
  content: {
    title?: string;
    testimonialsImage?: string;
    style?: any;
  };
}

const TestimonialsBlockPreview: React.FC<TestimonialsBlockPreviewProps> = ({ content }) => {
  return (
    <div style={content.style}>
      <h3 className="text-xl font-bold mb-6 text-[#aa6b5d] text-center">
        {content.title || 'O que estão dizendo'}
      </h3>

      {content.testimonialsImage ? (
        <img
          src={content.testimonialsImage}
          alt="Depoimentos"
          className="w-full h-auto rounded-lg mx-auto"
        />
      ) : (
        <div style={{ backgroundColor: '#E5DDD5' }}>
          <p className="text-gray-400">Adicione uma imagem de depoimentos</p>
        </div>
      )}
    </div>
  );
};

export default TestimonialsBlockPreview;
