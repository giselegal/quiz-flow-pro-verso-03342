import { Shield } from 'lucide-react';

const GuaranteeSection = () => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-[#B89B7A]/20 h-full">
    <div className="text-center">
      <Shield className="w-12 h-12 text-[#4CAF50] mx-auto mb-4" />
      <h3 className="text-lg font-medium text-[#aa6b5d] mb-4">Garantia de 7 Dias</h3>
      <p className="text-[#432818] text-sm leading-relaxed">
        Se não ficar satisfeita, devolvemos 100% do seu dinheiro. Sem perguntas, sem complicação.
      </p>
    </div>
  </div>
);

export default GuaranteeSection;
