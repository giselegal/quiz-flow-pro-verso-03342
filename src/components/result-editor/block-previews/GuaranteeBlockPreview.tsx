interface GuaranteeBlockPreviewProps {
  content: {
    title?: string;
    text?: string;
    image?: string;
    style?: any;
  };
}

const GuaranteeBlockPreview: React.FC<GuaranteeBlockPreviewProps> = ({ content }) => {
  return (
    <div
      className="flex flex-col md:flex-row items-center gap-6 p-6 bg-[#fff7f3] rounded-lg"
      style={content.style}
    >
      {content.image && (
        <div className="w-24 h-24 flex-shrink-0">
          <img src={content.image} alt="Garantia" className="w-full h-full object-contain" />
        </div>
      )}

      <div className="flex-1">
        <h3 className="text-xl font-bold mb-2 text-[#aa6b5d]">
          {content.title || 'Garantia de 7 dias'}
        </h3>
        <p className="text-[#1A1818]/80">
          {content.text ||
            'Se você não ficar 100% satisfeita com o conteúdo nos primeiros 7 dias, devolvemos seu dinheiro integralmente, sem burocracia.'}
        </p>
      </div>
    </div>
  );
};

export default GuaranteeBlockPreview;
