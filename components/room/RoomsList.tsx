"use client";
import { useState, useEffect, useRef } from 'react';
import { Room } from '@/app/room/page';
import { RoomCard } from './RoomCard';
import { FilterBar } from './FilterBar';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ContentHeader } from '../ContentHeader';
import Navbar from '../Navbar';
import { Footer } from '../Footer';
interface RoomsListProps {
  onRoomClick: (slug: string) => void;
}

export function RoomsList({ onRoomClick }: RoomsListProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedType, setSelectedType] = useState<string>('all');

  const headerRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    // Animate header on mount
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, []);

  useEffect(() => {
    // Animate count change
    if (countRef.current) {
      gsap.fromTo(
        countRef.current,
        { scale: 1.1, opacity: 0.5 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
      );
    }
  }, [filteredRooms.length]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      
      // Using static data temporarily
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const response = await fetch('https://lagranderesidence.com/api/api.php?endpoint=rooms');
      
      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }
      
      const data = await response.json();
      
      // Handle different response formats
      let roomsData: Room[] = [];
      if (Array.isArray(data)) {
        roomsData = data;
      } else if (data && Array.isArray(data.rooms)) {
        roomsData = data.rooms;
      } else if (data && Array.isArray(data.data)) {
        roomsData = data.data;
      } else {
        console.error('Unexpected API response format:', data);
        roomsData = [];
      }
      
      setRooms(roomsData);
      setFilteredRooms(roomsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setRooms([]);
      setFilteredRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedPhase, priceRange, selectedType, rooms]);

  const applyFilters = () => {
    let filtered = [...rooms];

    // Text search
    if (searchQuery) {
      filtered = filtered.filter(room =>
        room.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Phase filter
    if (selectedPhase !== 'all') {
      filtered = filtered.filter(room =>
        room.phase?.toString() === selectedPhase
      );
    }

    // Price range filter
    filtered = filtered.filter(room => {
      const price = parseFloat(room.daily_price?.toString() || '0');
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(room =>
        room.type?.toLowerCase() === selectedType.toLowerCase()
      );
    }

    setFilteredRooms(filtered);
  };

  // Extract unique values for filters
const phases = Array.from(
  new Set(
    rooms
      .map((r): string | undefined => r.phase?.toString())
      .filter((p): p is string => Boolean(p))
  )
);
  const types = Array.from(
  new Set(
    rooms
      .map((r): string | undefined => r.type)
      .filter((t): t is string => Boolean(t))
  )
);

  
  // Calculate max price
  const maxPrice = Math.max(...rooms.map(r => parseFloat(r.daily_price?.toString() || '0')), 10000);

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center"
      >
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </motion.div>
    );
  }

  if (error) {
    return (

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="text-center">
          <p className="text-neutral-600">Failed to load rooms</p>
          <button
            onClick={fetchRooms}
            className="mt-4 px-4 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-800"
          >
            Retry
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <>
    <Navbar />
                <ContentHeader 
                    badge="Our Rooms"
                    title="Experience the Beauty"
                    description="Take a closer look into the rooms we offer and pick the one for you."
                />
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div ref={headerRef} className="mb-8">
        <p ref={countRef} className="text-neutral-600">
          {filteredRooms.length} {filteredRooms.length === 1 ? 'room' : 'rooms'} available
        </p>
      </div>

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedPhase={selectedPhase}
        onPhaseChange={setSelectedPhase}
        phases={phases}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        maxPrice={maxPrice}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        types={types}
      />

      <AnimatePresence mode="wait">
        {filteredRooms.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-16"
          >
            <p className="text-neutral-500">No rooms match your criteria</p>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredRooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                  ease: 'easeOut'
                }}
              >
                <RoomCard
                  room={room}
                  onClick={() => onRoomClick(room.slug || room.id.toString())}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
    <Footer />
    </>
  );
}
