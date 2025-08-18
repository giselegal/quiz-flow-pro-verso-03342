import { useLocation } from 'wouter';
import { useEffect } from 'react';

const NotFound = () => {
  const [location] = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location);
  }, [location]);

  return (
    <div style={{ backgroundColor: '#E5DDD5' }}>
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p style={{ color: '#6B4F43' }}>Oops! Page not found</p>
        <a href="/" className="text-[#B89B7A] hover:text-[#A38A69] underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
