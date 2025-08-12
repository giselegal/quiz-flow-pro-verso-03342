import { StyleResult } from '@/types/quiz';
import { useLocation } from 'wouter';
import { useEffect } from 'react';

export const ResultPagePrototype: React.FC = () => {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Prevent any navigation issues
    console.log('ResultPagePrototype loaded');
  }, []);

  const mockPrimaryStyle = 'Elegante';
  const mockSecondaryStyles = ['Clássico', 'Contemporâneo', 'Natural'];

  const primaryStyle: StyleResult = mockPrimaryStyle
    ? {
        category: mockPrimaryStyle,
        score: 100,
        percentage: 85,
        style: mockPrimaryStyle.toLowerCase(),
        points: 100,
        rank: 1,
      }
    : {
        category: 'Natural',
        score: 100,
        percentage: 85,
        style: 'natural',
        points: 100,
        rank: 1,
      };

  const secondaryStyles: StyleResult[] = mockSecondaryStyles.map((style, index) => ({
    category: style,
    score: 80 - index * 10,
    percentage: 75 - index * 10,
    style: style.toLowerCase(),
    points: 80 - index * 10,
    rank: index + 2,
  }));

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
