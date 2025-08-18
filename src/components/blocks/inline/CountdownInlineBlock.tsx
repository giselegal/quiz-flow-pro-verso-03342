// @ts-nocheck

const CountdownInlineBlock = ({ block, isSelected, onClick }) => {
  return (
    <div
      className={`p-4 border rounded ${isSelected ? 'border-primary' : 'border-gray-200'}`}
      onClick={onClick}
    >
      <h3 className="text-lg font-semibold">Countdown Timer</h3>
      <p className="text-gray-600">Click to configure countdown properties</p>
    </div>
  );
};

export default CountdownInlineBlock;
