import { Star } from 'lucide-react';

const TestimonialsBlock = () => (
  <div className="bg-white p-8 rounded-xl shadow-md border border-[#B89B7A]/20 mb-12">
    <h3 className="text-2xl font-medium text-[#aa6b5d] mb-8 text-center">
      O que dizem nossas clientes
    </h3>

    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-[#f9f6f3] p-6 rounded-lg">
        <div className="flex mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <p className="text-[#432818] text-sm mb-3 italic">
          "Incrível como descobrir meu estilo mudou minha autoestima. Agora sei exatamente o que
          comprar!"
        </p>
        <p className="text-xs text-[#8F7A6A] font-medium">- Maria S.</p>
      </div>

      <div className="bg-[#f9f6f3] p-6 rounded-lg">
        <div className="flex mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <p className="text-[#432818] text-sm mb-3 italic">
          "O guia é muito completo! Finalmente entendi como valorizar meu corpo e personalidade."
        </p>
        <p className="text-xs text-[#8F7A6A] font-medium">- Ana P.</p>
      </div>
    </div>
  </div>
);

export default TestimonialsBlock;
