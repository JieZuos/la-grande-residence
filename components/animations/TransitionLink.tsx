'use client';

import { ReactNode } from 'react';
import { usePageTransition } from './TransitionProvider';

interface Props {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

// TransitionLink.tsx
export default function TransitionLink({ href, children, className, onClick }: Props) {
  const { startTransition } = usePageTransition();

  return (
    <button
      className={className}
      onClick={(e) => {
        // e.preventDefault(); // Good practice for custom transitions
        onClick?.();
        startTransition(href);
      }}
    >
      {children}
    </button>
  );
}
