'use client';
import { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// Importing categories from your gallery data file
import { ArrowRight } from 'lucide-react';
import { categories } from '@/components/gallery/data/gallery';
import TransitionLink from '@/components/animations/TransitionLink';

gsap.registerPlugin(ScrollTrigger);

export function Gallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Combine and Randomize images from all categories
  const allImages = useMemo(() => {
    // 1. Flatten all images into one array and attach category names
    const combined = categories.flatMap(category => 
      category.images.map(img => ({
        ...img,
        categoryName: category.name 
      }))
    );

    // 2. Shuffle the array to ensure randomness across folders
    const shuffled = [...combined].sort(() => Math.random() - 0.5);

    // 3. Take only the first 6 for the "featured" look
    return shuffled.slice(0, 6); 
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title fade-up animation
      gsap.fromTo(
        titleRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Grid items stagger animation
      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current.children,
          { y: 100, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    });
        gsap.fromTo(buttonRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.1, scrollTrigger: { trigger: buttonRef.current, start: 'top 100%' } }
        );
    return () => ctx.revert();
  }, []);

  return (
    <section id="gallery" ref={sectionRef} className="py-24 px-6 lg:px-8 bg-neutral-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16" ref={titleRef}>
          <div className="inline-block px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm mb-4 shadow-sm border border-neutral-100">
            Our Gallery
          </div>
          <h2 className="text-4xl md:text-5xl text-neutral-900 mb-4">
            Experience & Memories
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            A curated selection of moments from our community, events, and dedicated team.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {allImages.map((image, index) => (
            <div
              key={`${image.id}-${index}`}
              className="relative aspect-square overflow-hidden rounded-2xl group cursor-pointer shadow-sm"
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              {/* Overlay showing the Category and Title on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100">
                <span className="text-white/70 text-xs uppercase tracking-widest mb-1">
                  {image.categoryName}
                </span>
                {/* <span className="text-white text-lg font-medium">
                  {image.title}
                </span> */}
              </div>
            </div>
          ))}
        </div>
<div ref={buttonRef} className="flex justify-center mt-12 transition-opacity duration-500">          <TransitionLink
            href="/gallery"
            className="group px-8 py-3 rounded-full border border-neutral-300 bg-white text-neutral-900 text-sm font-medium flex items-center gap-2 hover:bg-neutral-900 hover:text-white transition-all shadow-sm"
          >
            View All Gallery
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}