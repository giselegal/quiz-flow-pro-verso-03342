const BonusSection = () => (
  <div className="bg-gradient-to-r from-[#fff8f4] to-[#faf5f0] p-8 rounded-xl border border-[#B89B7A]/20 shadow-md">
    <h3 className="text-xl md:text-2xl font-medium text-[#aa6b5d] mb-6 text-center">
      🎁 Bônus Exclusivos Inclusos
    </h3>
    <div className="grid md:grid-cols-2 gap-6">
      <div className="text-center">
        <div className="bg-white p-4 rounded-lg shadow-sm mb-3">
          <h4 className="font-semibold text-[#432818] mb-2">Peças-Chave do Seu Estilo</h4>
          <p className="text-sm text-[#8F7A6A]">Guia completo das peças essenciais</p>
        </div>
      </div>
      <div className="text-center">
        <div className="bg-white p-4 rounded-lg shadow-sm mb-3">
          <h4 className="font-semibold text-[#432818] mb-2">Visagismo Facial</h4>
          <p className="text-sm text-[#8F7A6A]">Maquiagem ideal para seu rosto</p>
        </div>
      </div>
    </div>
  </div>
);

export default BonusSection;
