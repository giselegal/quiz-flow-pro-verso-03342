import Logo from "./logo";

interface BrandHeaderProps {
  className?: string;
}

const BrandHeader: React.FC<BrandHeaderProps> = ({ className }) => {
  return (
    <div className={`flex justify-center items-center py-4 ${className}`}>
      <Logo />
    </div>
  );
};

export default BrandHeader;
