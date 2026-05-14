// components/gallery/ImagePanel.tsx
"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Image {
  id: number;
  url: string;
  title: string;
}

interface Category {
  id: string;
  name: string;
  thumbnail: string;
  images: Image[];
}

interface ImagePanelProps {
  category: Category;
  onClose: () => void;
}

export function ImagePanel({ category, onClose }: ImagePanelProps) {
  const [selectedImage, setSelectedImage] = useState<Image>(category.images[0]);
  const panelRef = useRef<HTMLDivElement>(null);
  
  // Ref removed from image to avoid conflict between GSAP and Framer Motion transitions
  // We'll use Framer Motion for the main image transitions now for better consistency

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.thumbnail-item', {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        delay: 0.3
      });
    }, panelRef);
    return () => ctx.revert();
  }, []);

  const currentIndex = category.images.findIndex(img => img.id === selectedImage.id);

  const handlePrevious = () => {
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : category.images.length - 1;
    setSelectedImage(category.images[prevIndex]);
  };

  const handleNext = () => {
    const nextIndex = currentIndex < category.images.length - 1 ? currentIndex + 1 : 0;
    setSelectedImage(category.images[nextIndex]);
  };

  // Logic for drag end
  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50; // pixels
    if (info.offset.x < -swipeThreshold) {
      handleNext();
    } else if (info.offset.x > swipeThreshold) {
      handlePrevious();
    }
  };

  return (
    <motion.div
      ref={panelRef}
      className="fixed inset-0 z-50 flex flex-col bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="flex flex-col h-full w-full max-w-[1800px] mx-auto p-4 md:p-8" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-start justify-between mb-4 flex-none">
          <div>
            <h2 className="text-3xl md:text-5xl font-light text-gray-900">{category.name}</h2>
            <p className="text-gray-500">{selectedImage.title}</p>
          </div>
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
            onClick={onClose}
          >
            <X className="w-8 h-8 text-gray-400" />
          </button>
        </div>

        {/* Main Image Area with Drag capabilities */}
        <div className="flex-1 relative min-h-0 flex items-center justify-center group overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={selectedImage.id}
              src={selectedImage.url}
              alt={selectedImage.title}
              // Drag Props
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={handleDragEnd}
              // Animation Props
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              // Styling
              className="max-w-full max-h-full object-contain cursor-grab active:cursor-grabbing rounded-2xl select-none touch-none"
              style={{ filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.1))' }}
            />
          </AnimatePresence>
          
          {/* Navigation Controls (Hidden on mobile via 'hidden md:flex') */}
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 p-4 bg-white/50 hover:bg-white rounded-full shadow-sm transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
            onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 p-4 bg-white/50 hover:bg-white rounded-full shadow-sm transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>

        {/* Thumbnails Area */}
        <div className="flex-none pt-8 pb-4">
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 justify-start md:justify-center">
            {category.images.map((image) => (
              <motion.div
                key={image.id}
                className={`thumbnail-item relative flex-shrink-0 w-20 h-20 md:w-32 md:h-32 cursor-pointer rounded-sm overflow-hidden border-2 transition-colors ${
                  selectedImage.id === image.id ? 'border-gray-900' : 'border-transparent'
                }`}
                onClick={() => setSelectedImage(image)}
                whileHover={{ y: -5 }}
              >
                <img
                  src={image.url}
                  alt=""
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    selectedImage.id === image.id ? 'opacity-100' : 'opacity-40 hover:opacity-100'
                  }`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}