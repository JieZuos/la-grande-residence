"use client";
import { useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedPhase: string;
  onPhaseChange: (phase: string) => void;
  phases: string[];
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  maxPrice: number;
  selectedType: string;
  onTypeChange: (type: string) => void;
  types: string[];
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedPhase,
  onPhaseChange,
  phases,
  priceRange,
  onPriceRangeChange,
  maxPrice,
  selectedType,
  onTypeChange,
  types,
}: FilterBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: -10 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out'
        }
      );
    }
  }, []);

  // Helper to handle input changes for min/max
  const handlePriceInputChange = (index: 0 | 1, value: string) => {
    const numValue = value === '' ? 0 : parseInt(value);
    const newRange: [number, number] = [...priceRange];
    newRange[index] = numValue;
    onPriceRangeChange(newRange);
  };

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-8 space-y-4"
    >
      {/* Search */}
      <motion.div className="relative" whileFocus={{ scale: 1.01 }}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search rooms..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
        />
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Phase Filter */}
        {phases.length > 0 && (
          <motion.select
            value={selectedPhase}
            onChange={(e) => onPhaseChange(e.target.value)}
            whileHover={{ scale: 1.02 }}
            className="px-4 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 cursor-pointer"
          >
            <option value="all">All Phases</option>
            {phases.map((phase) => (
              <option key={phase} value={phase}>Phase {phase}</option>
            ))}
          </motion.select>
        )}

        {/* Type Filter */}
        {types.length > 0 && (
          <motion.select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            whileHover={{ scale: 1.02 }}
            className="px-4 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 cursor-pointer"
          >
            <option value="all">All Types</option>
            {types.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </motion.select>
        )}

        {/* Dynamic Price Controls */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-4 py-3 bg-white border border-neutral-200 rounded-lg"
        >
          <span className="text-sm font-medium text-neutral-700">Price (₱)</span>
          
          <div className="flex items-center gap-2">
            {/* Min Input */}
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => handlePriceInputChange(0, e.target.value)}
              className="w-20 px-2 py-1 text-sm border border-neutral-200 rounded focus:ring-1 focus:ring-neutral-900 outline-none"
              placeholder="Min"
            />
            
            <span className="text-neutral-400">-</span>

            {/* Max Input */}
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => handlePriceInputChange(1, e.target.value)}
              className="w-20 px-2 py-1 text-sm border border-neutral-200 rounded focus:ring-1 focus:ring-neutral-900 outline-none"
              placeholder="Max"
            /> 
          </div>

          {/* Slider for quick Max adjustment */}
          <input
            type="range"
            min="0"
            max={maxPrice}
            value={priceRange[1]}
            onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value)])}
            className="w-32 accent-[#19682e] hidden md:block"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}