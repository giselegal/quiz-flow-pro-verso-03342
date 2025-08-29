import { Card } from '@/components/ui/card';
import { QuoteIcon } from 'lucide-react';

interface TestimonialItem {
  name: string;
  role?: string;
  text: string;
}

interface TestimonialsProps {
  items?: TestimonialItem[];
}

const Testimonials: React.FC<TestimonialsProps> = ({
  items = [
    {
      name: 'Mariangela',
      role: 'Engenheira',
      text: 'Antes, a roupa me vestia. Hoje, eu me visto com intenção. Essa jornada me reconectou com a mulher que sempre fui.',
    },
    {
      name: 'Patrícia Paranhos',
      role: 'Advogada',
      text: 'Aprendi a reconhecer meu valor e refletir isso na forma como me apresento. As pessoas começaram a me enxergar diferente — porque eu estava diferente.',
    },
    {
      name: 'Sônia Spier',
      role: 'Terapeuta',
      text: 'Com a Gisele, entendi o poder da linguagem visual. Hoje eu escolho minhas roupas com consciência, propósito e leveza.',
    },
  ],
}) => {
  return (
    <div className="py-10">
      <div className="text-center mb-10">
        <h3 className="text-2xl md:text-3xl font-playfair text-center text-[#B89B7A] mb-3">
          Transformações Reais
        </h3>
        <p className="text-center text-[#8F7A6A] mb-4 max-w-2xl mx-auto">
          O que mulheres como você estão dizendo sobre esta jornada de transformação
        </p>
        <div className="h-0.5 w-32 mx-auto bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d]" />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <div key={index} className="transition-transform duration-300 hover:-translate-y-1.5">
            <Card className="p-8 relative overflow-hidden rounded-xl border border-[#B89B7A]/20 shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
              {/* Elementos decorativos animados */}
              <div className="absolute top-0 left-0 w-12 h-12">
                <div className="absolute top-2 left-2 w-10 h-10 border-t-2 border-l-2 border-[#B89B7A]/40 rounded-tl-md" />
              </div>

              <div className="absolute bottom-0 right-0 w-12 h-12">
                <div className="absolute bottom-2 right-2 w-10 h-10 border-b-2 border-r-2 border-[#B89B7A]/40 rounded-br-md" />
              </div>

              <div className="mb-5 text-[#B89B7A]">
                <div>
                  <QuoteIcon size={32} strokeWidth={1.5} />
                </div>
              </div>

              <p className="text-[#8F7A6A] italic mb-6 leading-relaxed flex-grow">"{item.text}"</p>

              <div className="mt-auto pt-4 border-t border-[#B89B7A]/20">
                <p className="font-medium text-[#432818]">{item.name}</p>
                {item.role && <p className="text-sm text-[#8F7A6A]/70">{item.role}</p>}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
