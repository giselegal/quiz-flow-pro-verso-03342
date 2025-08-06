import { useLocation } from "wouter";
import { useCallback } from "react";

interface NavigationOptions {
  replace?: boolean;
  preserveQuery?: boolean;
}

export const useUniversalNavigation = (options: NavigationOptions = {}) => {
  const [location, setLocation] = useLocation();

  const navigate = useCallback(
    (path: string, navOptions?: NavigationOptions) => {
      const finalOptions = { ...options, ...navOptions };

      if (finalOptions.replace) {
        // For wouter, we use setLocation to navigate
        setLocation(path);
      } else {
        setLocation(path);
      }
    },
    [setLocation, options]
  );

  const goBack = useCallback(() => {
    window.history.back();
  }, []);

  const goForward = useCallback(() => {
    window.history.forward();
  }, []);

  const reload = useCallback(() => {
    window.location.reload();
  }, []);

  return {
    location,
    navigate,
    goBack,
    goForward,
    reload,
    currentPath: location,
  };
};
