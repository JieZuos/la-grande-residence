'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {Star, ConciergeBell, DoorOpen  } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function Details() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );
      
      gsap.fromTo(
        contentRef.current,
        { x: 100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <section id="details" ref={sectionRef} className="py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div ref={imageRef} className="relative h-[500px] rounded-2xl overflow-hidden">
            <img
              src="/assets/homepage-15th.webp"
              alt="Modern Hotel Interior"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div ref={contentRef} className="space-y-6">
            <div className="inline-block px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm mb-4 shadow-sm border border-neutral-100">
              La Grande Residence
            </div>
            <h2 className="text-4xl md:text-5xl text-neutral-900">
              Where Luxury Meets Comfort
            </h2>
            <p className="text-neutral-600 leading-relaxed">
              Whether you seek tranquility or a luxurious retreat, our pools provide the ideal setting for relaxation and leisure.
            </p>
            <br /><br /><br /><br />
            <div className="grid grid-cols-3 gap-6 pt-4">
              <div>
                <div className="text-3xl text-neutral-900 mb-2">200+ <DoorOpen className='inline'/></div>
                <div className="text-sm text-neutral-600">Luxury Rooms</div>
              </div>
              {/* <div>
                <div className="text-3xl text-neutral-900 mb-2">4.4 <Star className='inline'/></div>
                <div className="text-sm text-neutral-600">Guest Rating</div>
              </div> */}
              <div>
                <div className="text-3xl text-neutral-900 mb-2">24/7 <ConciergeBell className='inline' /></div>
                <div className="text-sm text-neutral-600">Concierge</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
