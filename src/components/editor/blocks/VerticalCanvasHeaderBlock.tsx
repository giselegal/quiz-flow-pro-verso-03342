import React from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface VerticalCanvasHeaderProps {
  logoSrc?: string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
  progressValue?: number;
  progressMax?: number;
  showProgress?: boolean;
  showBackButton?: boolean;
  onBackClick?: () => void;
  containerWidth?: string;
  gap?: string;
  className?: string;
}

const VerticalCanvasHeaderBlock: React.FC<VerticalCanvasHeaderProps> = ({
  logoSrc = "",
  logoAlt = "Logo",
  logoWidth = 120,
  logoHeight = 40,
  progressValue = 0,
  progressMax = 100,
  showProgress = true,
  showBackButton = false,
  onBackClick = () => {},
  containerWidth = "100%",
  gap = "1rem",
  className = "",
}) => {
  const progressPercentage =
    progressMax > 0 ? (progressValue / progressMax) * 100 : 0;

  return (
    <header
      className={`bg-white border-b border-gray-200 px-4 py-3 ${className}`}
      style={{ width: containerWidth }}
    >
      <div className="flex items-center justify-between" style={{ gap }}>
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackClick}
              className="p-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}

          {logoSrc ? (
            <img
              src={logoSrc}
              alt={logoAlt}
              width={logoWidth}
              height={logoHeight}
              className="object-contain"
            />
          ) : (
            <div
              className="bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm"
              style={{ width: logoWidth, height: logoHeight }}
            >
              Logo
            </div>
          )}
        </div>

        {/* Progress Section */}
        {showProgress && (
          <div className="flex-1 max-w-md mx-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
              <span>Progresso</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}
      </div>
    </header>
  );
};

export default VerticalCanvasHeaderBlock;
