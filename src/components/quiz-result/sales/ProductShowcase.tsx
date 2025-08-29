import { Card } from '@/components/ui/card';
import { Check, Sparkles, Star } from 'lucide-react';

const benefits = [
  {
    title: 'Guia de Estilo e Imagem',
    icon: <Sparkles className="w-5 h-5 text-amber-500" />,
    items: [
      'Descubra seu estilo com precisão',
      'Aprenda a criar looks autênticos',
      'Técnicas de composição visual',
    ],
  },
  {
    title: 'Bônus Exclusivos',
    icon: <Star className="w-5 h-5 text-amber-500" />,
    items: ['Visagismo Facial Estratégico', 'Peças-Chave do Guarda-Roupa', 'Consultoria em Grupo'],
  },
];

const ProductShowcase = () => {
  return (
    <div className="space-y-10 py-4">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="relative group transition-transform duration-300 hover:scale-[1.02]">
          <img
            src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911682/C%C3%B3pia_de_MOCKUPS_14_oxegnd.webp"
            alt="Guia de Estilo - 3 Revistas"
            className="w-full rounded-xl shadow-xl relative z-10"
          />
          <div
            className="absolute -inset-1 bg-gradient-to-r from-amber-200 to-amber-400 rounded-xl blur opacity-30 
                      group-hover:opacity-50 transition duration-700 z-0"
          />
          <div style={{ color: '#6B4F43' }}>COMPLETO</div>
        </div>

        <div className="space-y-7">
          <div className="space-y-2">
            <h2 className="text-3xl font-playfair text-[#aa6b5d] relative inline-block">
              Transforme seu Estilo
              <div className="absolute -bottom-2 left-0 h-[3px] bg-gradient-to-r from-amber-400 to-transparent rounded-full w-full" />
            </h2>
            <p className="text-[#8F7A6A] text-lg">Tudo o que você precisa para transformar seu visual</p>
          </div>

          {benefits.map((section, index) => (
            <div key={index} className="transition-transform duration-300 hover:-translate-y-1.5">
              <Card className="p-6 bg-white border-[#aa6b5d]/20 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div style={{ backgroundColor: '#FAF9F7' }}>{section.icon}</div>
                  <h3 className="text-xl font-playfair text-[#aa6b5d]">{section.title}</h3>
                </div>

                <div className="space-y-3">
                  {section.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 group">
                      <div className="mt-1 bg-gradient-to-br from-amber-100 to-amber-200 p-1 rounded-full flex-shrink-0">
                        <Check className="w-4 h-4 text-amber-600" />
                      </div>
                      <p className="text-[#3a3a3a] group-hover:text-[#aa6b5d] transition-colors">{item}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductShowcase;
