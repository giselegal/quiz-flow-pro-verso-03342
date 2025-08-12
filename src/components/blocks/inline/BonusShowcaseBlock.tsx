// @ts-nocheck

const BonusShowcaseBlock = ({ block, isSelected, onClick, className = '' }) => {
  return (
    <div
      className={`p-4 border rounded ${isSelected ? 'border-primary' : 'border-gray-200'} ${className}`}
      onClick={onClick}
    >
      <h3 className="text-lg font-semibold">Bonus Showcase</h3>
      <p className="text-gray-600">Click to configure bonus showcase properties</p>
    </div>
  );
};

export default BonusShowcaseBlock;
