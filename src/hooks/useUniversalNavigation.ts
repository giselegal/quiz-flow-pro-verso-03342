
import { useLocation } from 'wouter';

export const useUniversalNavigation = () => {
  const [, setLocation] = useLocation();

  const navigate = (path: string) => {
    setLocation(path);
  };

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/');
    }
  };

  const replace = (path: string) => {
    setLocation(path, { replace: true });
  };

  return {
    navigate,
    goBack,
    replace
  };
};
