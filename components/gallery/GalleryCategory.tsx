// components/gallery/GalleryCategory.tsx

"use client";

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

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

interface GalleryCategoryProps {
  category: Category;
  onClick: () => void;
}

export function GalleryCategory({ category, onClick }: GalleryCategoryProps) {
  const [isHovered, setIsHovered] = useState(false);

  // We take the first 3 images to create the visual stack seen in the design
  const stackImages = category.images.slice(0, 3);

  return (
    <motion.div
      className="relative h-[450px] w-full flex flex-col items-center justify-center cursor-pointer group"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
    >
      {/* 3D Stacked Image Container */}
      <div className="relative w-full h-64 flex items-center justify-center perspective-1000">
        {stackImages.map((img, index) => {
          // Logic to mimic the reference image:
          // index 0: Left tilted
          // index 1: Center (Main)
          // index 2: Right tilted
          const isCenter = index === 1;
          const isLeft = index === 0;
          const isRight = index === 2;

          return (
            <motion.div
              key={img.id}
              className="absolute w-48 h-64 rounded-xl overflow-hidden shadow-xl border border-white/20"
              style={{
                zIndex: isCenter ? 20 : 10,
              }}
              animate={{
                scale: isCenter ? 1.1 : 0.85,
                x: isLeft ? -100 : isRight ? 100 : 0,
                rotateY: isLeft ? 25 : isRight ? -25 : 0,
                z: isCenter ? 50 : 0,
                opacity: isHovered ? 1 : isCenter ? 1 : 0.6,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          );
        })}
      </div>

      {/* Text Content Below the Stack */}
      <div className="mt-8 text-center">
        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
          Category
        </span>
        <h3 className="text-2xl font-semibold text-gray-900 mt-1">
          {category.name}
        </h3>
        
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm group-hover:text-black transition-colors">
            <span>Explore</span>
            <ArrowRight className="w-4 h-4" />
          </div>
          <span className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-500 uppercase font-medium">
            {category.images.length} Photos
          </span>
        </div>
      </div>

      {/* Background Soft Glow (matches the bokeh feel of the reference) */}
      <div className="absolute inset-0 -z-10 bg-radial-gradient from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}