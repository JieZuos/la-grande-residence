"use client"; // This is the magic line

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function BackButton() {
  const router = useRouter();

  return (
    <motion.button
      onClick={() => router.back()}
      className="fixed top-4 left-4 md:top-8 md:left-8 z-50 flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-white/90 backdrop-blur-md text-gray-900 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
      whileHover={{ scale: 1.05, x: -5 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" height="20" 
        viewBox="0 0 24 24" fill="none" 
        stroke="currentColor" strokeWidth="2" 
        strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="m15 18-6-6 6-6"/>
      </svg>
      Back
    </motion.button>
  );
}