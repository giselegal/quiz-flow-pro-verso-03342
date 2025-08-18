interface HeroSectionProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  onCtaClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  imageUrl,
  ctaText,
  onCtaClick,
}) => {
  return (
    <div className="bg-gradient-to-b from-amber-50 to-white py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 style={{ color: '#432818' }}>{title}</h1>
            <p style={{ color: '#6B4F43' }}>{subtitle}</p>
            <button
              onClick={onCtaClick}
              className="px-8 py-4 bg-[#B89B7A] hover:bg-[#a38a6a] text-white font-medium rounded-lg shadow transition-colors"
            >
              {ctaText}
            </button>
          </div>
          <div className="md:w-1/2">
            <img src={imageUrl} alt="Hero image" className="rounded-lg shadow-lg w-full h-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
