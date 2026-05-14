"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";

interface ContentHeaderProps {
  badge?: string;
  title: string;
  description: string;
}

export function ContentHeader({ badge, title, description }: ContentHeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // If the ref isn't bound yet, skip
    if (!headerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. "Set" initial state immediately to prevent the flash
      // This hides them before the timeline even begins playing
      gsap.set([logoRef.current, ".promo-header-content"], { 
        opacity: 0 
      });

      const tl = gsap.timeline({ 
        defaults: { ease: "power4.out" } 
      });

      tl.to(logoRef.current, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        startAt: { y: -30 } // Starts from -30 and moves to 0
      })
      .to(".promo-header-content", {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        startAt: { y: 40 } // Starts from 40 and moves to 0
      }, "-=0.8");

      // Floating effect
      gsap.to(logoRef.current, {
        y: 3,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2
      });
    }, headerRef);

    return () => ctx.revert();
  }, []);

  return (
    /* We add opacity-0 to the container to ensure it's hidden 
       until GSAP takes over. GSAP will override this inline. */
    <div ref={headerRef} className="w-full">
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
        <a href="/" aria-label="Go to homepage">
          <img
            ref={logoRef}
            src="/assets/logo.webp"
            alt="Company logo"
            className="h-8 w-auto opacity-0" 
          />
        </a>
      </div>

      <header className="px-6 text-center z-20 mb-10 md:mb-14 mt-10">
        {badge && (
          <span className="promo-header-content opacity-0 inline-block px-4 py-1 bg-green-50 rounded-full text-[10px] md:text-xs font-semibold uppercase tracking-widest text-green-700 mb-4 border border-green-100">
            {badge}
          </span>
        )}

        <h1 className="promo-header-content opacity-0 text-3xl md:text-4xl lg:text-5xl font-light text-neutral-900 mb-3">
          {title}
        </h1>

        <p className="promo-header-content opacity-0 text-sm md:text-base text-neutral-600 max-w-2xl mx-auto">
          {description}
        </p>
      </header>
    </div>
  );
}