// components/BackButton.tsx
"use client";

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
  onClick?: () => void;
  label?: string;
  className?: string;
}

export function BackButton({ onClick, label = "Back", className = "" }: BackButtonProps) {
  const router = useRouter();

  // If no onClick is provided, it defaults to standard router navigation
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.back();
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`fixed top-4 left-4 md:top-8 md:left-8 z-50 flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-white/90 backdrop-blur-md text-gray-900 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}
      whileHover={{ scale: 1.05, x: -5 }}
      whileTap={{ scale: 0.95 }}
    >
      <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
      <span className="font-medium text-sm md:text-base">{label}</span>
    </motion.button>
  );
}