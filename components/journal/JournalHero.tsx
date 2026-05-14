"use client";
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Calendar } from 'lucide-react';

interface Journal {
  id: number;
  name: string;
  href: string;
  image_url: string;
  timestamp: string;
}

interface JournalHeroProps {
  journal: Journal;
  onOpenJournal: (url: string) => void;
}

export function JournalHero({ journal, onOpenJournal }: JournalHeroProps) {

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div ref={ref} className="relative h-[60vh] min-h-[450px] sm:h-[55vh] sm:min-h-[500px] md:h-[65vh] md:min-h-[550px] w-full overflow-hidden">
      
      {/* Logo - Smaller on mobile */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 z-30"
      >
        <img 
          src="/assets/logo.webp" 
          alt="Logo" 
          className="h-6 sm:h-8 w-auto"
        />
      </motion.div>

      {/* Background with parallax */}
      <motion.div 
        className="absolute inset-0"
        style={{ y, scale }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${journal.image_url})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/85" />
      </motion.div>

      {/* Content - Responsive padding and centering */}
      <motion.div 
        className="relative h-full flex flex-col justify-center px-4 sm:px-8 md:px-16 lg:px-24 pt-16 sm:pt-20"
        style={{ opacity }}
      >
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/90 text-xs sm:text-sm mb-3 sm:mb-4">
              Featured Journal
            </span>
          </motion.div>

          <motion.h1
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-3 sm:mb-4 font-medium tracking-tight leading-[1.1] sm:leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {journal.name}
          </motion.h1>

          <motion.div
            className="flex items-center gap-2 sm:gap-3 text-white/80 mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-lg">{formatDate(journal.timestamp)}</span>
          </motion.div>

          <motion.button
            onClick={() => onOpenJournal(journal.href)}
            className="inline-block px-6 py-3 sm:px-8 sm:py-4 bg-white text-black hover:bg-white/90 transition-colors rounded-full text-base sm:text-lg font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Read Journal
          </motion.button>
        </div>
      </motion.div>

      {/* Scroll Indicator - Hidden on small mobile, shown on sm+ */}
      <motion.div 
        style={{ opacity: scrollIndicatorOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="hidden sm:flex absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-light">
          Scroll
        </span>
        <div className="w-[20px] h-[32px] sm:w-[22px] sm:h-[36px] border-2 border-white/30 rounded-full flex justify-center p-1">
          <motion.div 
            animate={{ 
              y: [0, 10, 0],
              opacity: [1, 0.5, 1]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="w-1 h-2 bg-white rounded-full" 
          />
        </div>
      </motion.div>
    </div>
  );
}