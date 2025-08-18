const TransformationsBlock = () => (
  <div className="bg-white p-8 rounded-xl shadow-md border border-[#B89B7A]/20 mb-12">
    <h3 className="text-2xl font-medium text-[#aa6b5d] mb-8 text-center">
      Transformação Antes e Depois
    </h3>

    <div className="grid md:grid-cols-2 gap-8">
      <div className="text-center">
        <div className="bg-[#f9f6f3] p-6 rounded-lg mb-4">
          <h4 className="font-semibold text-[#432818] mb-3">Antes</h4>
          <ul className="text-sm text-[#8F7A6A] space-y-2 text-left">
            <li>• Guarda-roupa cheio, mas nada para vestir</li>
            <li>• Dúvidas sobre o que combina</li>
            <li>• Compras impulsivas que não fazem sentido</li>
            <li>• Autoestima afetada pela insegurança</li>
          </ul>
        </div>
      </div>

      <div className="text-center">
        <div className="bg-[#B89B7A]/10 p-6 rounded-lg mb-4">
          <h4 className="font-semibold text-[#432818] mb-3">Depois</h4>
          <ul className="text-sm text-[#432818] space-y-2 text-left">
            <li>• Clareza total sobre seu estilo pessoal</li>
            <li>• Compras assertivas e conscientes</li>
            <li>• Looks harmoniosos todos os dias</li>
            <li>• Confiança e autoestima elevadas</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default TransformationsBlock;
