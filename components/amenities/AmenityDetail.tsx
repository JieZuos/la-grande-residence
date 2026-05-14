// src/components/AmenityDetail.tsx

"use client"; // Required for Next.js client-side hooks and animations

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation"; // Changed from react-router
import { motion, AnimatePresence } from "framer-motion"; // Matches your setup
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Star,
  X
} from "lucide-react";
import { amenitiesData } from "@/components/amenities/data/amenities"; // Updated path
import Navbar from "../Navbar";
import { Footer } from "../Footer";
import TransitionLink from '@/components/animations/TransitionLink';
import { BackButton } from '@/components/providers/backbutton'; // Adjust path as needed

gsap.registerPlugin(ScrollTrigger);

// Added interface to fix: Type '{ slug: string; }' is not assignable to type 'IntrinsicAttributes'
interface AmenityDetailProps {
  slug: string;
}

export function AmenityDetail({ slug }: AmenityDetailProps) {
  const router = useRouter(); // Next.js router for navigation
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedMenuIndex, setSelectedMenuIndex] = useState<number | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  // Use the slug passed from the Next.js page prop
  const amenity = amenitiesData.find(a => a.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Only keep GSAP for the details scroll trigger if you like it, 
    // but remove the headerRef part entirely to prevent conflicts.
    if (detailsRef.current) {
      gsap.from(detailsRef.current.children, {
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: detailsRef.current,
          start: "top 85%",
        }
      });
    }
  }, [slug]);

  if (!amenity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenity not found</h2>
          <button
            onClick={() => router.push("/amenities")} // Changed to router.push
            className="text-[#19682e] hover:underline"
          >
            Return to amenities
          </button>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % amenity.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? amenity.images.length - 1 : prev - 1
    );
  };

  const nextMenuImage = () => {
    if (selectedMenuIndex !== null && amenity.menu) {
      setSelectedMenuIndex((prev) =>
        prev !== null ? (prev + 1) % amenity.menu!.length : 0
      );
    }
  };

  const prevMenuImage = () => {
    if (selectedMenuIndex !== null && amenity.menu) {
      setSelectedMenuIndex((prev) =>
        prev !== null ? (prev === 0 ? amenity.menu!.length - 1 : prev - 1) : 0
      );
    }
  };

  const closeMenuModal = () => {
    setSelectedMenuIndex(null);
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenuModal();
      }
    };

    if (selectedMenuIndex !== null) {
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedMenuIndex]);

  return (<>
  <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      {/* Back Button */}
<BackButton onClick={() => router.push('/amenities')} />


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-25">
        {/* Header Section */}
        <div ref={headerRef} className="mb-12 will-change-transform">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-12"
          >
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <motion.span
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="bg-[#19682e] text-white px-6 py-2 rounded-full text-sm font-semibold tracking-wide"
              >
                {amenity.category.toUpperCase()}
              </motion.span>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-1 bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-100 shadow-sm"
              >
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#19682e] text-[#19682e]" />
                ))}
              </motion.div>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
              {amenity.title}
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
              {amenity.description}
            </p>
          </motion.div>
        </div>

        {/* Image Gallery */}
        <div className="mb-12">
          <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl bg-gray-200 group">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={amenity.images[currentImageIndex]}
                alt={`${amenity.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
              />
            </AnimatePresence>

            {/* Navigation Buttons */}
            {amenity.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-900" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <ChevronRight className="w-6 h-6 text-gray-900" />
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
              {currentImageIndex + 1} / {amenity.images.length}
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
            {amenity.images.map((image, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-4 transition-all duration-300 ${currentImageIndex === index
                    ? "border-[#19682e] shadow-lg"
                    : "border-transparent opacity-60 hover:opacity-100"
                  }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Details Grid */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
  {[
    { 
      icon: Clock, 
      title: "Hours", 
      val: amenity.operatingHours, 
      sub: amenity.operatingDays 
    },
    { 
      icon: Calendar, 
      title: "Availability", 
      val: amenity.operatingDays, 
      sub: "Open all year round" 
    },
    { 
      icon: MapPin, 
      title: "Location", 
      val: amenity.location, 
      sub: "Easy access from main lobby" 
    }
  ].map((item, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.15, // This recreates the GSAP stagger
        ease: "easeOut" 
      }}
      whileHover={{ y: -5 }}
      className="bg-white p-8 rounded-2xl shadow-lg border border-gray-50"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-[#19682e]/10 p-3 rounded-xl">
          <item.icon className="w-6 h-6 text-[#19682e]" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
      </div>
      <p className="text-gray-700 font-medium mb-1">{item.val}</p>
      <p className="text-gray-500 text-sm">{item.sub}</p>
    </motion.div>
  ))}
</div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 rounded-2xl shadow-lg mb-12"
        >
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Features & Facilities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {amenity.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-[#19682e]/5 to-[#19682e]/10 p-4 rounded-xl text-center"
              >
                <p className="text-gray-800 font-medium text-sm">{feature}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Menu (if available) */}
        {amenity.menu && amenity.menu.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 rounded-2xl shadow-lg"
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              {amenity.category.includes("Dining") ? "Menu Highlights" : "Services Offered"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {amenity.menu.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8 }}
                  onClick={() => setSelectedMenuIndex(index)}
                  className="group cursor-pointer"
                >
                  <div className="relative h-56 rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition-shadow duration-300">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-semibold text-lg">{item.title}</p>
                    </div>
                    {/* Click hint */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-xs font-medium text-gray-700">Click to view</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA Section */}
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
  className="mt-12 bg-gradient-to-r from-[#19682e] to-[#1f7a37] p-12 rounded-3xl shadow-2xl text-center text-white"
>
  <h3 className="text-3xl font-bold mb-4">Ready to Experience {amenity.title}?</h3>
  <p className="text-lg mb-8 opacity-90">Contact our concierge team to make a reservation</p>

  {/* Wrap the motion button with the TransitionLink */}
<TransitionLink 
  href="/room"
  className="bg-white text-[#19682e] px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
>
  <motion.span
    initial={{ opacity: 1 }}
    whileHover={{ scale: 1.05 }}
    className="block"
  >
    Book Now
  </motion.span>
</TransitionLink>
</motion.div>
      </div>

      {/* Menu Modal */}
      <AnimatePresence>
        {selectedMenuIndex !== null && amenity.menu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={closeMenuModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeMenuModal}
                className="absolute -top-12 right-0 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full transition-colors duration-200 z-10"
              >
                <X className="w-6 h-6 text-white" />
              </motion.button>

              {/* Image */}
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedMenuIndex}
                    src={amenity.menu[selectedMenuIndex].image}
                    alt={amenity.menu[selectedMenuIndex].title}
                    className="w-full h-auto max-h-[80vh] object-contain"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <h4 className="text-white text-2xl font-bold">
                    {amenity.menu[selectedMenuIndex].title}
                  </h4>
                </div>

                {/* Navigation Arrows */}
                {amenity.menu.length > 1 && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.1, x: -5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={prevMenuImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-4 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-900" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1, x: 5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={nextMenuImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-4 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-900" />
                    </motion.button>
                  </>
                )}

                {/* Counter */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedMenuIndex + 1} / {amenity.menu.length}
                  </p>
                </div>
              </div>

              {/* Thumbnail Navigation */}
              {amenity.menu.length > 1 && (
                <div className="flex gap-3 mt-6 overflow-x-auto pb-2 justify-center">
                  {amenity.menu.map((item, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedMenuIndex(index)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-4 transition-all duration-300 ${selectedMenuIndex === index
                          ? "border-[#19682e] shadow-lg"
                          : "border-white/30 opacity-60 hover:opacity-100"
                        }`}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Instructions */}
              <p className="text-center text-white/70 text-sm mt-4">
                Press <kbd className="px-2 py-1 bg-white/10 rounded">ESC</kbd> to close or click outside
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
      <Footer />
    </>
  );
}