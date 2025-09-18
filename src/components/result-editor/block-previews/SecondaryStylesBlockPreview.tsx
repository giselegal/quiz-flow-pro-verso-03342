interface SecondaryStylesBlockPreviewProps {
  content: {
    title?: string;
    style?: any;
  };
}

const SecondaryStylesBlockPreview: React.FC<SecondaryStylesBlockPreviewProps> = ({ content }) => {
  return (
    <div style={content.style}>
      <h3 className="text-xl font-bold mb-4 text-[#aa6b5d] text-center">
        {content.title || 'Seus Estilos Complementares'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#fff7f3] p-4 rounded-lg">
          <h4 className="font-medium text-[#aa6b5d] mb-2">Natural</h4>
          <p className="text-[#1A1818]/80 text-sm">
            Você valoriza o conforto e a praticidade. Seu estilo é descontraído e casual, com peças
            fáceis de usar no dia a dia.
          </p>
        </div>

        <div className="bg-[#fff7f3] p-4 rounded-lg">
          <h4 className="font-medium text-[#aa6b5d] mb-2">Contemporâneo</h4>
          <p className="text-[#1A1818]/80 text-sm">
            Você gosta de estar atualizado e seguir as tendências. Seu estilo é moderno e versátil,
            combinando o clássico com o atual.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecondaryStylesBlockPreview;
