'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

// Logic Component
import LoadingProvider from '@/components/providers/onload';
import { Directions as Location } from '../components/Location';
// UI Components
import Navbar from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Details } from '../components/Details';
import Amenities from '../components/Amenities';
import { Rooms } from '../components/Rooms';
import { Testimonials } from '../components/Testimonials';
import { Gallery } from '../components/Gallery';
import { Footer } from '../components/Footer';
import Popup from '../components/Popup';

export default function Page() {
  const heroRef = useRef<HTMLDivElement>(null);
  const smootherRef = useRef<ScrollSmoother | null>(null);
  const pathname = usePathname();

  /* ---------------- REGISTER GSAP ---------------- */
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
  }, []);

  /* ---------------- SCROLL SMOOTHER ---------------- */
// Inside your page.tsx useEffect for ScrollSmoother
useEffect(() => {
  const timer = setTimeout(() => {
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

    if (isDesktop) {
      if (smootherRef.current) {
        smootherRef.current.kill();
      }

      smootherRef.current = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.2,
        effects: true,
        normalizeScroll: false,
      });

      // Crucial: Refresh after a slight delay to ensure 
      // all child components (like Details) have rendered
      ScrollTrigger.refresh();
    }
  }, 200); // Increased slightly to 200ms

  return () => {
    clearTimeout(timer);
    // ... rest of your cleanup
  };
}, [pathname]);// Fires on route change; LoadingProvider handles initial state

  return (
    <LoadingProvider>
      {/* 1. Global Overlays */}
      <Popup />
      
      {/* 2. Navigation */}
      <Navbar heroRef={heroRef} />
      
      {/* 3. Smooth Scroll Structure */}
      <div id="smooth-wrapper">
        <div id="smooth-content" className="bg-neutral-50 min-h-screen">
          <main>
            <Hero ref={heroRef} />
            <Details />
            <Amenities />
            <Rooms />
            <Testimonials />
            <Gallery />
              <Location />

          </main>
          <Footer />
        </div>
      </div>
    </LoadingProvider>
  );
}