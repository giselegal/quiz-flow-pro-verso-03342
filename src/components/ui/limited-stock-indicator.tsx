import React, { useEffect, useState } from "react";

interface LimitedStockIndicatorProps {
  initialStock?: number;
  className?: string;
}

export const LimitedStockIndicator: React.FC<LimitedStockIndicatorProps> = ({
  initialStock = 12,
  className = "",
}) => {
  const [stockLeft, setStockLeft] = useState(initialStock);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Randomly decrease stock occasionally to create urgency
    const stockInterval = setInterval(() => {
      const shouldDecrease = Math.random() < 0.05; // 5% chance to decrease stock

      if (shouldDecrease && stockLeft > 1) {
        setStockLeft(prev => prev - 1);
        setIsActive(true);

        setTimeout(() => {
          setIsActive(false);
        }, 2000);
      }
    }, 20000); // Check every 20 seconds

    return () => clearInterval(stockInterval);
  }, [stockLeft]);

  const percentLeft = Math.round((stockLeft / initialStock) * 100);

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="font-medium text-[#D68047]">Estoque limitado</span>
        <span
          className={`transition-all duration-700 ${isActive ? "text-red-500 font-bold" : "text-[#8F7A6A]"}`}
        >
          Restam apenas {stockLeft} unidades
        </span>
      </div>
      <div style={{ backgroundColor: "#E5DDD5" }}>
        <div
          className="h-full bg-gradient-to-r from-red-500 to-[#D68047] transition-all duration-500"
          style={{ width: `${percentLeft}%` }}
        ></div>
      </div>
    </div>
  );
};

export default LimitedStockIndicator;
