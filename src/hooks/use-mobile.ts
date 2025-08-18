import { useState, useEffect } from 'react';

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return isMobile;
};

export const useIsLowPerformanceDevice = () => {
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  useEffect(() => {
    // Check device memory (if available)
    const memory = (navigator as any).deviceMemory;
    if (memory && memory < 4) {
      setIsLowPerformance(true);
      return;
    }

    // Check CPU cores
    const cpuCores = navigator.hardwareConcurrency;
    if (cpuCores && cpuCores < 4) {
      setIsLowPerformance(true);
      return;
    }

    // Check if device is mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      // Additional check for older mobile devices
      const isOlderDevice =
        /Android\s[0-6]/i.test(navigator.userAgent) || /OS\s[0-9]_/i.test(navigator.userAgent);
      if (isOlderDevice) {
        setIsLowPerformance(true);
        return;
      }
    }

    setIsLowPerformance(false);
  }, []);

  return isLowPerformance;
};
