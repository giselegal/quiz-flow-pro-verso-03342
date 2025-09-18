import { useState, useEffect } from 'react';
import { VERSION } from '../utils/version';

export const BuildInfo: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development mode or when triggered
    const isDev = process.env.NODE_ENV === 'development';
    const hasDebugParam = new URLSearchParams(window.location.search).has('debug');
    setIsVisible(isDev || hasDebugParam);
  }, []);

  if (!isVisible) return null;

  return (
    <div style={{ color: '#8B7355' }}>
      v{VERSION.buildNumber} • {new Date(VERSION.lastUpdated).toLocaleDateString()}
    </div>
  );
};

export default BuildInfo;
