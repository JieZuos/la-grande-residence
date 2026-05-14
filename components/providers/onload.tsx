'use client';

import { useState, useEffect, ReactNode } from 'react';
import { LoadingScreen } from '../animations/LoadingScreen';

interface LoadingProviderProps {
  children: ReactNode;
}

export default function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisited');
    const hasReloaded = sessionStorage.getItem('hasReloaded');

    // If already visited and already reloaded, skip loading
    if (hasVisited && hasReloaded) {
      setIsLoading(false);
    }
  }, []);

  const handleLoadingComplete = () => {
    sessionStorage.setItem('hasVisited', 'true');

    const hasReloaded = sessionStorage.getItem('hasReloaded');

    // Refresh ONLY once
    if (!hasReloaded) {
      sessionStorage.setItem('hasReloaded', 'true');
      window.location.reload();
      return;
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return <>{children}</>;
}
