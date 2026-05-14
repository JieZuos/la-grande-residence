// src/components/AmenityCard.tsx
import React from "react"; // Add this
import { motion } from "framer-motion";
import { MapPin, Clock } from "lucide-react";
import { Amenity } from "@/components/amenities/data/amenities";

interface AmenityCardProps {
  amenity: Amenity;
  index: number;
  onClick: () => void;
  key?: React.Key; // Adding this explicitly can sometimes clear the TS(2322) error
}

export function AmenityCard({ amenity, index, onClick }: AmenityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer group"
    >
      <div className="relative h-56 overflow-hidden">
        <motion.img
          src={amenity.images[0]}
          alt={amenity.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        <div className="absolute top-4 right-4">
          <span className="bg-[#19682e] text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-lg">
            {amenity.category}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2 group-hover:text-[#19682e] transition-colors duration-300">
          {amenity.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {amenity.shortDescription}
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center text-gray-700 text-sm">
            <Clock className="w-4 h-4 mr-2 text-[#19682e]" />
            <span>{amenity.operatingHours}</span>
          </div>
          
          <div className="flex items-center text-gray-700 text-sm">
            <MapPin className="w-4 h-4 mr-2 text-[#19682e]" />
            <span>{amenity.location}</span>
          </div>
        </div>
        
        <div className="mt-6 flex items-center text-[#19682e] font-medium group-hover:gap-2 gap-0 transition-all duration-300">
          <span>View Details</span>
          <motion.span
            initial={{ x: 0 }}
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            →
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}
