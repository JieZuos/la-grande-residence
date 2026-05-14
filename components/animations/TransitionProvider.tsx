'use client';

import { createContext, useContext, useRef, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';

interface TransitionContextProps {
  startTransition: (url: string) => void;
}

const TransitionContext = createContext<TransitionContextProps | null>(null);

export const usePageTransition = () => useContext(TransitionContext)!;

export default function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const stairsRef = useRef<HTMLDivElement[]>([]);
  const logoRef = useRef<HTMLDivElement>(null);

  const NB_STEPS = 5;

const startTransition = (url: string) => {
  const tl = gsap.timeline({
    onComplete: () => {
      window.scrollTo(0, 0);
    },
  });

  // 1. Reset logo and stairs
  tl.set(logoRef.current, { opacity: 0, y: 20 })
    .set(stairsRef.current, { transformOrigin: 'top', scaleY: 0 })

    // 2. STAIRS COVER THE SCREEN (previous page still visible under it)
    .to(stairsRef.current, {
      scaleY: 1,
      duration: 0.5,
      stagger: 0.05,
      ease: 'power4.in', // use 'in' for faster cover
    })

    // 3. LOGO APPEARS while screen covered
    .to(logoRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out',
    }, '-=0.1')
    .to(logoRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      ease: 'power2.in',
    }, '+=0.6')

    // 4. PUSH ROUTE **after full cover**
    .call(() => {
      router.push(url);
    })

    // 5. REVEAL NEW PAGE
    .to(stairsRef.current, {
      transformOrigin: 'bottom',
      scaleY: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: 'power4.out', // use 'out' for smooth reveal
    }, '+=0.1'); // optional small delay for polish
};


  return (
    <TransitionContext.Provider value={{ startTransition }}>
      <div className="relative overflow-hidden min-h-screen">
        {children}

        <div className="fixed inset-0 flex pointer-events-none z-[9999]">
          {[...Array(NB_STEPS)].map((_, i) => (
            <div
              key={i}
              ref={(el: HTMLDivElement | null) => {
  stairsRef.current[i] = el!;
}}

              className="h-full w-full bg-white origin-top scale-y-0"
              style={{ marginLeft: i === 0 ? 0 : '-1px' }}
            />
          ))}

          <div
            ref={logoRef}
            className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none"
          >
            <img
              src="/assets/logo.webp"
              className="w-48 h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
