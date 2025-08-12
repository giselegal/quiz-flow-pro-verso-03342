import { StyleResult } from "@/types/quiz";
import { useEffect } from "react";

export default function ResultPagePrototype() {

  useEffect(() => {
    // Prevent any navigation issues
    console.log("ResultPagePrototype loaded");
  }, []);

  const mockPrimaryStyle = "Elegante";
  const mockSecondaryStyles = ["Clássico", "Contemporâneo", "Natural"];

  // Mock data for prototype - variables intentionally unused for now
  const _primaryStyle: StyleResult = mockPrimaryStyle
    ? {
        category: mockPrimaryStyle,
        score: 100,
        percentage: 85,
        style: mockPrimaryStyle.toLowerCase(),
        points: 100,
        rank: 1,
      }
    : {
        category: "Natural",
        score: 100,
        percentage: 85,
        style: "natural",
        points: 100,
        rank: 1,
      };

  const _secondaryStyles: StyleResult[] = mockSecondaryStyles.map((style, index) => ({
    category: style,
    score: 80 - index * 10,
    percentage: 75 - index * 10,
    style: style.toLowerCase(),
    points: 80 - index * 10,
    rank: index + 2,
  }));

  void _primaryStyle;
  void _secondaryStyles;

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <img
        src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp"
        alt="Logo Gisele Galvão"
        className="mx-auto w-36 mb-6"
        loading="eager"
        fetchPriority="high"
        width="144"
        height="auto"
      />
    </div>
  );
};
