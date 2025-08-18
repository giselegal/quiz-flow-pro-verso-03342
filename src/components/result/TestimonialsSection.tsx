import { Quote } from 'lucide-react';

interface Testimonial {
  text: string;
  author: string;
  image?: string;
}

interface TestimonialsSectionProps {
  title: string;
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  title,
  testimonials,
}) => {
  return (
    <section className="py-12 px-4 bg-[#FAF9F7]">
      <div className="container mx-auto">
        <h2 className="text-3xl font-playfair text-[#432818] text-center mb-8">{title}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
              <Quote className="h-8 w-8 text-[#B89B7A]" />
              <p className="text-[#432818]">{testimonial.text}</p>
              <div className="flex items-center gap-3">
                {testimonial.image && (
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <p className="font-medium text-[#8F7A6A]">{testimonial.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
