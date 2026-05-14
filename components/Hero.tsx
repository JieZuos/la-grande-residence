'use client';

import { forwardRef, useEffect, useRef } from 'react';
import gsap from 'gsap';
import TransitionLink from '@/components/animations/TransitionLink';

export const Hero = forwardRef<HTMLDivElement>((_, ref) => {
  const bgImageRef = useRef<HTMLImageElement>(null);
  const bgOverlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null); // Target the wrapper
  const scrollIconRef = useRef<HTMLDivElement>(null);
  const magneticWrapRef = useRef<HTMLDivElement>(null);

  /* ---------------- HERO INTRO & SCROLL DOT ---------------- */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Main Entrance Timeline
      tl.fromTo(bgImageRef.current, { scale: 1.1, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4 })
        .fromTo(bgOverlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 }, '<')
        .fromTo(logoRef.current, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, '-=0.4')
        .from(titleRef.current, { y: 80, opacity: 0, duration: 1 }, '-=0.6')
        .from(subtitleRef.current, { y: 60, opacity: 0, duration: 1 }, '-=0.6')
        .from(buttonRef.current, { y: 40, opacity: 0, duration: 1 }, '-=0.6')
        .from(scrollIconRef.current, { y: 20, opacity: 0, duration: 1 }, '-=0.8');

      // Infinite Scroll Dot Animation
      gsap.to('.scroll-dot', {
        y: 12,
        opacity: 0,
        repeat: -1,
        duration: 1.5,
        ease: 'power2.inOut',
      });
    });

    return () => ctx.revert();
  }, []);

  /* ---------------- MAGNETIC BUTTON ---------------- */
  useEffect(() => {
    const wrap = magneticWrapRef.current;
    const btn = buttonRef.current; // Animating the div wrapper ensures smooth interaction
    if (!wrap || !btn) return;

    const move = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      gsap.to(btn, {
        x: (e.clientX - r.left - r.width / 2) * 0.5,
        y: (e.clientY - r.top - r.height / 2) * 0.5,
        duration: 0.3,
      });
    };

    const reset = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    };

    wrap.addEventListener('mousemove', move);
    wrap.addEventListener('mouseleave', reset);
    return () => {
      wrap.removeEventListener('mousemove', move);
      wrap.removeEventListener('mouseleave', reset);
    };
  }, []);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden flex flex-col items-center justify-center">
      
      {/* Background */}
      <div className="absolute inset-0">
        {/* <img ref={bgImageRef} src="/assets/background.webp" alt="Resort" className="w-full h-full object-cover" /> */}
                <img ref={bgImageRef} src="/assets/bg.webp" alt="Resort" className="w-full h-full object-cover" />

        <div ref={bgOverlayRef} className="absolute inset-0 bg-black/40" />
      </div>

      {/* Logo */}
      {/* <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20">
        <img ref={logoRef} src="/assets/logo.webp" alt="Logo" className="h-8 w-auto" />
      </div> */}

      {/* Hero Content */}
      <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
        <h1 ref={titleRef} className="text-4xl md:text-7xl leading-tight mb-6">
          The Place That <br /> Connects Us All!
        </h1>
        <p ref={subtitleRef} className="text-sm md:text-lg mb-10 text-neutral-200">
          Great place like home, great family environment, great memories to remember!
        </p>

        {/* Button Wrapper with Ref for Animation */}
        <div ref={magneticWrapRef} className="inline-block p-6">
          <div ref={buttonRef}>
             <TransitionLink href="/room" className="px-8 py-4 bg-white text-neutral-900 rounded-full font-medium inline-block">
                Book Now
             </TransitionLink>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div 
        ref={scrollIconRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-light">
          Scroll
        </span>
        <div className="w-[22px] h-[36px] border-2 border-white/30 rounded-full flex justify-center p-1">
          <div className="scroll-dot w-1 h-2 bg-white rounded-full" />
        </div>
      </div>

    </section>
  );
});

Hero.displayName = 'Hero';