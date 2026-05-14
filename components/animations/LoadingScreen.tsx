import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(onComplete, 300);
      },
    });

    // Reset initial state to ensure GSAP takes control immediately
    gsap.set(logoRef.current, { opacity: 0, y: 20, scale: 0.95 });

    tl.to(logoRef.current, { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 1.2, 
        ease: 'power4.out' 
      })
      .fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1, ease: 'power2.inOut' },
        '-=0.8'
      )
      .to(
        containerRef.current,
        { opacity: 0, duration: 0.8, ease: 'power3.inOut' },
        '+=1' // Gives the user a moment to actually see the logo
      );

    return () => {
      tl.kill();
    };
  }, [onComplete]);

return (
    <div
      ref={containerRef}
      // Use fixed inset-0 and h-[100dvh] to prevent mobile browser jumping
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-white w-full h-[100dvh] overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg, #ffffff)' }}
    >
      {/* This inner wrapper ensures that everything inside is 
         stacked vertically and centered relative to the screen width 
      */}
      <div className="flex flex-col items-center justify-center text-center">
        
        <div className="mb-6 flex justify-center items-center"> 
          <img
            ref={logoRef}
            src="/assets/logo.webp"
            alt="La Grande Residence"
            // Adding mx-auto to be safe, and removed w-full to prevent stretching
            className="h-10 md:h-12 w-auto object-contain will-change-transform mx-auto"
            style={{ display: 'block' }} // Removes inline-block whitespace
            draggable={false}
          />
        </div>

        {/* Minimalist Progress Line */}
        <div
          ref={lineRef}
          className="h-[1.5px] w-12 md:w-16 mx-auto"
          style={{
            backgroundColor: 'var(--color-accent, #91c83d)',
            transformOrigin: 'center center',
          }}
        />
      </div>
    </div>
  );
}