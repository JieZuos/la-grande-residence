'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TransitionLink from '@/components/animations/TransitionLink';
import { Room } from '@/app/room/page';
import { RoomCard } from '@/components/room/RoomCard';

gsap.registerPlugin(ScrollTrigger);

export function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const fetchTopRooms = async () => {
    try {
      const response = await fetch('https://lagranderesidence.com/api/api.php?endpoint=rooms');
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      let roomsData: Room[] = Array.isArray(data) ? data : (data.rooms || data.data || []);
      
      // SHUFFLE LOGIC START
      const shuffled = [...roomsData].sort(() => 0.5 - Math.random());
      // SHUFFLE LOGIC END

      // Slice the first 3 from the shuffled array
      setRooms(shuffled.slice(0, 3));
    } catch (err) {
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchTopRooms();
}, []);

  useEffect(() => {
    // Initial animation for the title (always present, so we can animate it immediately)
    gsap.fromTo(titleRef.current,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
        },
      }
    );

    // Only animate cards once they are loaded
    if (!loading && rooms.length > 0) {
      const ctx = gsap.context(() => {
        gsap.fromTo(cardsRef.current?.children || [],
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.15,
            duration: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 100%',
            },
          }
        );

        gsap.fromTo(buttonRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1, scrollTrigger: { trigger: buttonRef.current, start: 'top 90%' } }
        );
      });
      
      // Refresh ScrollTrigger because the height of the page just changed
      ScrollTrigger.refresh();
      return () => ctx.revert();
    }
  }, [loading, rooms]);

  return (
    <section id="rooms" ref={sectionRef} className="py-24 px-6 lg:px-8 bg-neutral-50 min-h-[700px]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16" ref={titleRef}>
          <div className="inline-block px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm mb-4 border border-neutral-100">
            Our Rooms
          </div>
          <h2 className="text-4xl md:text-5xl text-neutral-900 mb-4">
            Choose Your Perfect Stay
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Elegantly designed rooms tailored to your comfort and style
          </p>
        </div>

        {/* FIX: We remove the 'loading ? Loader : Content' logic. 
            We keep the grid container and the Button visible to maintain page "flow".
        */}
        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 transition-all duration-500">
          {loading ? (
            // Skeleton State: Maintains the height and look while fetching
            [...Array(3)].map((_, i) => (
              <div key={i} className="h-96 rounded-2xl bg-neutral-200 animate-pulse" />
            ))
          ) : (
            rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onClick={() => window.location.href = `/room/${room.slug || room.id}`}
              />
            ))
          )}
        </div>

        <div ref={buttonRef} className={`flex justify-center mt-12 transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}>
          <TransitionLink
            href="/room"
            className="group px-8 py-3 rounded-full border border-neutral-300 bg-white text-neutral-900 text-sm font-medium flex items-center gap-2 hover:bg-neutral-900 hover:text-white transition-all shadow-sm"
          >
            View All Rooms
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}