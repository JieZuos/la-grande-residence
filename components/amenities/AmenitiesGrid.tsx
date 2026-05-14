"use client"; // Required for client-side hooks and animations

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; // Changed from react-router
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AmenityCard } from "./AmenityCard";
import { amenitiesData } from "@/components/amenities/data/amenities";
import { ContentHeader } from "../ContentHeader";
import Navbar from "../Navbar";
import { Footer } from "../Footer";
import LoadingProvider from '@/components/providers/onload';

gsap.registerPlugin(ScrollTrigger);

export function AmenitiesGrid() {
  const router = useRouter(); // Use Next.js router
  const headerRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (headerRef.current && subtitleRef.current) {
      const tl = gsap.timeline();

      tl.from(headerRef.current, {
        opacity: 0,
        y: -50,
        duration: 1,
        ease: "power3.out"
      })
        .from(subtitleRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power2.out"
        }, "-=0.5");
    }
  }, []);

  const handleCardClick = (slug: string) => {
    // Navigate using Next.js router
    router.push(`/amenities/${slug}`);
  };

  return (<>
  <LoadingProvider>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <ContentHeader
          badge="Premium Experience"
          title="Amenities"
          description="Discover our collection of premium facilities designed to provide you with the ultimate comfort and luxury."
        />

        {/* Amenities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {amenitiesData.map((amenity, index) => (
            <AmenityCard
              key={amenity.id}
              amenity={amenity}
              index={index}
              onClick={() => handleCardClick(amenity.slug)}
            />
          ))}
        </div>
      </div>
    </div>
    <Footer /></LoadingProvider>
  </>
  );
}