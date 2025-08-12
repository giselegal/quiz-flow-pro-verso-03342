import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface Bonus {
  title: string;
  description: string;
  image: string;
  order: number;
}

interface BonusCarouselProps {
  bonuses: Bonus[];
}

export const BonusCarousel: React.FC<BonusCarouselProps> = ({ bonuses }) => {
  return (
    <section className="py-12 px-4 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-playfair text-[#432818] text-center mb-8">Bônus Exclusivos</h2>

        <Carousel className="max-w-5xl mx-auto">
          <CarouselContent>
            {bonuses.map(bonus => (
              <CarouselItem key={bonus.order} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-4">
                  <div className="bg-[#FAF9F7] rounded-lg p-4 space-y-4">
                    <img
                      src={bonus.image}
                      alt={bonus.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold text-[#432818]">
                        Bônus {bonus.order}: {bonus.title}
                      </h3>
                      <p className="text-[#8F7A6A] mt-2">{bonus.description}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};
