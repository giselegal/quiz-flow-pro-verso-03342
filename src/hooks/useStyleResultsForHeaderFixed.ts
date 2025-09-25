/**
 * 🎯 STYLE RESULTS FOR HEADER - Fixed version
 */

import { useState, useEffect } from 'react';
import { StyleResult } from '@/types/quiz';

interface StyleResultsForHeader {
  primaryStyle: StyleResult | null;
  secondaryStyles: StyleResult[];
  isLoading: boolean;
  styleNames: {
    primary: string;
    secondary: string[];
    all: string[];
  };
  percentages: {
    primary: number;
    secondary: number[];
  };
}

export const useStyleResultsForHeader = (
  results?: { primaryStyle?: StyleResult; secondaryStyles?: StyleResult[] }
): StyleResultsForHeader => {
  const [data, setData] = useState<StyleResultsForHeader>({
    primaryStyle: null,
    secondaryStyles: [],
    isLoading: true,
    styleNames: {
      primary: '',
      secondary: [],
      all: [],
    },
    percentages: {
      primary: 0,
      secondary: [],
    },
  });

  useEffect(() => {
    if (!results) {
      setData(prev => ({ ...prev, isLoading: false }));
      return;
    }

    const { primaryStyle, secondaryStyles = [] } = results;

    if (!primaryStyle) {
      setData(prev => ({ ...prev, isLoading: false }));
      return;
    }

    const safePercentage = (value: number | undefined): number => value || 0;
    const safeName = (value: string | undefined): string => value || 'Desconhecido';

    const styleNames = {
      primary: safeName(primaryStyle.name || primaryStyle.category),
      secondary: secondaryStyles.map(style => safeName(style.name || style.category)),
      all: [
        safeName(primaryStyle.name || primaryStyle.category),
        ...secondaryStyles.map(style => safeName(style.name || style.category))
      ],
    };

    const percentages = {
      primary: safePercentage(primaryStyle.percentage),
      secondary: secondaryStyles.map(style => safePercentage(style.percentage)),
    };

    setData({
      primaryStyle,
      secondaryStyles,
      isLoading: false,
      styleNames,
      percentages,
    });
  }, [results]);

  return data;
};

export default useStyleResultsForHeader;