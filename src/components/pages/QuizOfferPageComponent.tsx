import { Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const QuizOfferPageComponent: React.FC = () => {
  const benefits = [
    {
      title: 'Consultoria de Estilo Personalizada',
      description:
        'Receba orientações exclusivas para realçar sua beleza natural e expressar sua individualidade.',
    },
    {
      title: 'Guia de Cores Ideal',
      description:
        'Descubra as cores que harmonizam com seu tom de pele e cabelo, criando looks radiantes.',
    },
    {
      title: 'Análise de Biotipo',
      description:
        'Aprenda a valorizar suas curvas e proporções, escolhendo peças que modelam sua silhueta.',
    },
  ];

  const testimonials = [
    {
      name: 'Maria Silva',
      text: 'A consultoria transformou minha autoestima! Agora me sinto confiante e elegante em todas as ocasiões.',
      rating: 5,
    },
    {
      name: 'Ana Oliveira',
      text: 'O guia de cores foi um divisor de águas no meu guarda-roupa. As combinações ficaram mais fáceis e assertivas.',
      rating: 5,
    },
  ];

  const guaranteeItems = [
    {
      icon: '🔒',
      title: 'Compra Segura',
      description: 'Seus dados protegidos com criptografia de ponta a ponta.',
    },
    {
      icon: '⏱️',
      title: 'Entrega Rápida',
      description: 'Acesso imediato ao conteúdo após a confirmação do pagamento.',
    },
    {
      icon: '💯',
      title: 'Satisfação Garantida',
      description: 'Se não estiver satisfeita, devolvemos seu dinheiro em até 7 dias.',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 style={{ color: '#432818' }}>Sua Jornada de Estilo Começa Agora!</h1>
        <p style={{ color: '#6B4F43' }}>
          Aproveite nossa oferta exclusiva e transforme seu visual com a ajuda de especialistas.
        </p>
      </div>

      {/* Benefits Section */}
      <div className="mb-12">
        <h3 style={{ color: '#432818' }}>O que você vai receber:</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {benefits.map((benefit: { title: string; description: string }, index: number) => (
            <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Check className="w-3 h-3" />
              </div>
              <div>
                <h4 style={{ color: '#432818' }}>{benefit.title}</h4>
                <p style={{ color: '#6B4F43' }}>{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="text-center mb-12">
        <h3 style={{ color: '#432818' }}>Não perca essa oportunidade!</h3>
        <p style={{ color: '#6B4F43' }}>Clique no botão abaixo e garanta seu acesso imediato.</p>
        <Button className="bg-[#B89B7A] hover:bg-[#A68B6A] text-white text-lg font-semibold py-3 px-8 rounded-full">
          Quero Transformar Meu Estilo!
        </Button>
      </div>

      {/* Testimonials */}
      <div className="mb-12">
        <h3 style={{ color: '#432818' }}>O que nossas clientes dizem:</h3>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map(
            (testimonial: { name: string; text: string; rating: number }, index: number) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p style={{ color: '#6B4F43' }}>"{testimonial.text}"</p>
                <p style={{ color: '#432818' }}>- {testimonial.name}</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Guarantee Section */}
      <div style={{ backgroundColor: '#E5DDD5' }}>
        <h3 style={{ color: '#432818' }}>Nossa Garantia Incondicional</h3>
        <p style={{ color: '#6B4F43' }}>
          Estamos tão confiantes de que você vai amar nossos serviços, que oferecemos uma garantia
          de 7 dias. Se por qualquer motivo você não estiver satisfeita, devolvemos seu dinheiro sem
          perguntas.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {guaranteeItems.map(
            (item: { icon: string; title: string; description: string }, index: number) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-2">{item.icon}</div>
                <h4 style={{ color: '#432818' }}>{item.title}</h4>
                <p style={{ color: '#6B4F43' }}>{item.description}</p>
              </div>
            )
          )}
        </div>

        <p style={{ color: '#8B7355' }}>
          Sua satisfação é nossa prioridade. Invista em você sem riscos!
        </p>
      </div>

      {/* Final Call to Action Section */}
      <div className="text-center">
        <h3 style={{ color: '#432818' }}>Dê o primeiro passo rumo ao seu novo estilo!</h3>
        <Button className="bg-[#B89B7A] hover:bg-[#A68B6A] text-white text-lg font-semibold py-3 px-8 rounded-full">
          Quero Começar Agora!
        </Button>
      </div>
    </div>
  );
};

export default QuizOfferPageComponent;
