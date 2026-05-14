import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
// Import the data and interface from your file
import { amenitiesData, Amenity } from '@/components/amenities/data/amenities'; 
import TransitionLink from '@/components/animations/TransitionLink';

export default function Amenities() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const sliderImagesRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  // Use the imported data
  const slides = amenitiesData;

  const getSlideIndex = (offset: number) => {
    return (currentIndex + offset + slides.length) % slides.length;
  };

  const animateSlide = (direction: 'next' | 'prev') => {
    if (isAnimating) return;
    setIsAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false);
      }
    });

    tl.to(".slide-text", {
      opacity: 0,
      y: direction === 'next' ? -20 : 20,
      duration: 0.3,
      stagger: 0.05,
      ease: "power2.in"
    });

    tl.to(".slider-image-container", {
      x: direction === 'next' ? '-20%' : '20%',
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut',
      onComplete: () => {
        setCurrentIndex(direction === 'next' ? getSlideIndex(1) : getSlideIndex(-1));
      }
    }, "-=0.1");

    tl.set(".slider-image-container", { 
      x: direction === 'next' ? '20%' : '-20%',
    });
    tl.set(".slide-text", { 
      y: direction === 'next' ? 20 : -20 
    });

    tl.to(".slider-image-container", {
      x: 0,
      opacity: (i) => i === 1 ? 1 : 0.4,
      duration: 0.6,
      ease: 'power3.out'
    });

    tl.to(".slide-text", {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out"
    }, "-=0.4");
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    const swipeThreshold = 50;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) animateSlide('next');
      else animateSlide('prev');
    }
    touchStartX.current = null;
  };

  return (
    <div className="h-screen bg-white text-neutral-900 overflow-hidden relative flex flex-col ">
        <div className="text-center mb-16 pt-12" >
          <div className="inline-block px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm mb-4 border border-neutral-100">
            Amenities
          </div>
          <h2 className="text-4xl md:text-5xl text-neutral-900 mb-4">
            Everything You Need
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Explore Our Wide Varieties of Amenities base on your needs
          </p>
        </div>

      <div 
        className="flex-1 flex flex-col lg:flex-row items-center justify-center px-8 md:px-16 lg:px-24 gap-12 touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        
        {/* Left: Image Slider */}
        <div className="relative w-full lg:flex-1 h-[35vh] lg:h-[60vh]" ref={sliderImagesRef}>
          {/* Previous (Peek) */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[25%] h-[80%] opacity-40 slider-image-container pointer-events-none">
            {/* Showing first image from the array */}
            <img src={slides[getSlideIndex(-1)].images[0]} className="w-full h-full object-cover rounded-xl" alt="prev" />
          </div>

          {/* Current (With Redirection Link) */}
          <TransitionLink href={`/amenities/${slides[currentIndex].slug}`}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[65%] h-full z-10 slider-image-container cursor-pointer group">
        
            <img 
                src={slides[currentIndex].images[0]} 
                className="w-full h-full object-cover rounded-2xl shadow-xl border border-neutral-100 transition-transform duration-500 group-hover:scale-[1.02]" 
                alt={slides[currentIndex].title} 
            />
            {/* Optional Overlay hint */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 rounded-2xl">
                <span className="bg-white/90 px-4 py-2 rounded-full text-sm font-medium shadow-lg">View Details</span>
            </div>
          </TransitionLink>

          {/* Next (Peek) */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[25%] h-[80%] opacity-40 slider-image-container pointer-events-none">
            <img src={slides[getSlideIndex(1)].images[0]} className="w-full h-full object-cover rounded-xl" alt="next" />
          </div>
        </div>

        {/* Right: Content */}
        <div className="w-full lg:w-[450px] space-y-6 md:space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4 slide-text">
              <div className="h-px w-8 bg-neutral-300" />
              <span className="text-sm text-neutral-400">
                {String(currentIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900 slide-text leading-tight">
              {slides[currentIndex].title}
            </h1>

            <p className="text-base md:text-lg text-neutral-500 slide-text">
              {slides[currentIndex].description}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-6 pt-4">
            <div className="flex gap-2">
              <button
                onClick={() => animateSlide('prev')}
                disabled={isAnimating}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-50 flex items-center justify-center transition-colors disabled:opacity-30"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => animateSlide('next')}
                disabled={isAnimating}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-50 flex items-center justify-center transition-colors disabled:opacity-30"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            
            <div className="flex-1 h-[2px] bg-neutral-100 relative overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-neutral-900 transition-all duration-500 ease-out"
                style={{ width: `${((currentIndex + 1) / slides.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-1/4 h-1/4 bg-blue-50/50 blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-neutral-100 blur-[100px] -z-10" />
    </div>
  );
}