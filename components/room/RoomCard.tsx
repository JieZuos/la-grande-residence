"use client";
import { useRef, useEffect } from 'react';
import { Room } from '@/app/room/page';
import { Users, Baby, ArrowRight, Home, MapPin } from 'lucide-react';
import { ImageWithFallback } from '@/components/err/ImageWithFallback';
import { motion } from 'framer-motion';
import gsap from 'gsap';

interface RoomCardProps {
  room: Room;
  onClick: () => void;
}

export function RoomCard({ room, onClick }: RoomCardProps) {
  const imageUrl = room.images?.[0] || '';
  const dailyPrice = room.daily_price ? parseFloat(room.daily_price.toString()) : null;
  const monthlyPrice = room.monthly_price ? parseFloat(room.monthly_price.toString()) : null;
  
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const image = imageRef.current;

    if (!card || !image) return;

    const ctx = gsap.context(() => {
      card.addEventListener('mouseenter', () => {
        gsap.to(image, { scale: 1.1, duration: 0.1, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(image, { scale: 1, duration: 0.1, ease: 'power2.inOut' });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <motion.div
      ref={cardRef}
      onClick={onClick}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-neutral-100 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-neutral-100">
        <div ref={imageRef} className="w-full h-full transition-transform duration-700">
          <ImageWithFallback
            src={imageUrl}
            alt={room.title || 'Room'}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Type Badge Overlay */}
        {room.type && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-neutral-800 shadow-sm border border-white/20">
            {room.type}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl text-neutral-900 group-hover:text-neutral-700 transition-colors leading-tight">
            {room.title || 'Untitled Room'}
          </h3>
        </div>

        {/* Capacity & Phase Info */}
        <div className="flex flex-wrap items-center gap-4 text-neutral-500 mb-4">
          <div className="flex items-center gap-1.5">
            <Users size={16} className="text-neutral-400" />
            <span className="text-sm">{room.pax || 0} Pax</span>
          </div>
          {room.child !== undefined && (
            <div className="flex items-center gap-1.5">
              <Baby size={16} className="text-neutral-400" />
              <span className="text-sm">{room.child} Child</span>
            </div>
          )}
          {room.phase && (
            <div className="flex items-center gap-1.5 ml-auto">
              <MapPin size={14} className="text-green-600" />
              <span className="text-xs font-medium text-neutral-600">Phase {room.phase}</span>
            </div>
          )}
        </div>

        {/* Pricing Section */}
        <div className="mt-auto pt-4 border-t border-neutral-100">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              {dailyPrice && (
                <div className="flex items-baseline gap-1">
                  <span className="text-sm text-neutral-500">Daily:</span>
                  <span className="text-xl font-medium text-neutral-900">₱{dailyPrice.toLocaleString()}</span>
                </div>
              )}
              {monthlyPrice && (
                <div className="flex items-baseline gap-1">
                  <span className="text-xs text-neutral-400">Monthly:</span>
                  <span className="text-sm font-medium text-neutral-600">₱{monthlyPrice.toLocaleString()}</span>
                </div>
              )}
            </div>
            
            <button className="flex items-center justify-center w-12 h-12 bg-[#19682e] text-white rounded-full group-hover:bg-green-700 transition-all active:scale-95 shadow-md">
              <ArrowRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}