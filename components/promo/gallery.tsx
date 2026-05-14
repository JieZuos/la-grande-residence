"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { ImageWithFallback } from '@/components/err/ImageWithFallback';
import { ContentHeader } from "../ContentHeader";

interface Promo {
    id: number;
    image: string;
    code: string;
    stat: number;
    popup: number;
    start_date: string;
    end_date: string;
}

const CACHE_KEY = "lgr_promo_gallery_cache";
const API_URL = "https://lagranderesidence.com/api/api.php?endpoint=promos";

export function PromoGallery() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [promos, setPromos] = useState<Promo[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const touchStartX = useRef<number | null>(null);

    // Initial Reveal Animation
    useEffect(() => {
        if (!isLoading && promos.length > 0) {
            const ctx = gsap.context(() => {
                const tl = gsap.timeline({
                    defaults: { ease: "power4.out" },
                    delay: 0.5, 
                });

                tl.from(".promo-slider-image-container", {
                    scale: 0.8,
                    opacity: 0,
                    duration: 1.2,
                    stagger: 0.1
                })
                .from(".promo-slide-text", {
                    x: 30,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.1
                }, "-=1");

            }, containerRef);

            return () => ctx.revert();
        }
    }, [isLoading, promos.length]);

    // Fetch & Caching Logic
    useEffect(() => {
        const fetchPromos = async () => {
            const now = new Date();
            now.setHours(0, 0, 0, 0);

            // 1. Try to load from LocalStorage first
            const cachedData = localStorage.getItem(CACHE_KEY);
            if (cachedData) {
                try {
                    const parsed: Promo[] = JSON.parse(cachedData);
                    // Filter based on dates even for cached items
                    const validCached = parsed.filter(item => {
                        const end = new Date(item.end_date);
                        return end >= now;
                    });

                    if (validCached.length > 0) {
                        setPromos(validCached);
                        setIsLoading(false);
                        // We still fetch in background to sync data (SWR pattern)
                    }
                } catch (e) {
                    localStorage.removeItem(CACHE_KEY);
                }
            }

            // 2. Fetch fresh data from API
            try {
                const res = await fetch(API_URL);
                const data: Promo[] = await res.json();

                const filteredPromos = data.filter((item) => {
                    const start = new Date(item.start_date);
                    const end = new Date(item.end_date);
                    return (
                        Number(item.stat) === 1 &&
                        Number(item.popup) === 1 &&
                        !isNaN(start.getTime()) &&
                        !isNaN(end.getTime()) &&
                        now >= start &&
                        now <= end
                    );
                });

                setPromos(filteredPromos);
                // Update cache with fresh data
                localStorage.setItem(CACHE_KEY, JSON.stringify(filteredPromos));
            } catch (error) {
                console.error("Failed to fetch promos:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPromos();
    }, []);

    const getSlideIndex = (offset: number) => {
        if (promos.length === 0) return 0;
        return (currentIndex + offset + promos.length) % promos.length;
    };

    const animateSlide = (direction: "next" | "prev") => {
        if (isAnimating || promos.length <= 1) return;
        setIsAnimating(true);

        const tl = gsap.timeline({
            onComplete: () => setIsAnimating(false),
        });

        tl.to(".promo-slide-text", {
            opacity: 0,
            y: direction === "next" ? -10 : 10,
            duration: 0.3,
            stagger: 0.05,
            ease: "power2.in",
        });

        tl.to(".promo-slider-image-container", {
            opacity: 0,
            scale: 0.9,
            duration: 0.4,
            ease: "power2.inOut",
            onComplete: () => {
                setCurrentIndex(direction === "next" ? getSlideIndex(1) : getSlideIndex(-1));
            },
        }, "-=0.2");

        tl.to(".promo-slider-image-container", {
            opacity: (i: number) => (i === 1 ? 1 : 0.4), // Center image full opacity, sides dim
            scale: 1,
            duration: 0.6,
            ease: "power3.out",
        });

        tl.to(".promo-slide-text", {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
        }, "-=0.4");
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX.current - touchEndX;
        if (Math.abs(diff) > 50) {
            animateSlide(diff > 0 ? "next" : "prev");
        }
        touchStartX.current = null;
    };

    if (isLoading && promos.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-green-700" size={40} />
            </div>
        );
    }

    if (promos.length === 0) return null;

    return (
        <div ref={containerRef} className="min-h-screen bg-white text-neutral-900 overflow-hidden relative flex flex-col font-sans py-12 md:py-24">
            <ContentHeader 
                badge="Exclusive Offers"
                title="Discover Our Offers"
                description="Explore our latest deal & special package designed to make your stay at La Grande Residence even more rewarding. Find the perfect offer for your next visit"
            />
            
            <div
                className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 md:px-16 lg:px-24 gap-8 md:gap-12 touch-pan-y"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {/* Image Slider Section */}
                <div className="relative w-full lg:flex-1 h-auto min-h-[400px] lg:h-full flex items-center justify-center overflow-hidden py-10">
                    {/* Left Shadow Image */}
                    <div className="absolute left-[-15%] md:left-0 top-1/2 -translate-y-1/2 w-[30%] h-[70%] opacity-20 md:opacity-40 promo-slider-image-container pointer-events-none">
                        <div className="w-full h-full rounded-xl bg-neutral-50 flex items-center justify-center overflow-hidden grayscale">
                            <ImageWithFallback src={promos[getSlideIndex(-1)].image} alt="prev" className="object-cover w-full h-full" />
                        </div>
                    </div>
                    
                    {/* Main Active Image */}
                    <div className="relative w-[70%] md:w-[50%] lg:w-[40%] z-10 promo-slider-image-container">
                        <div className="w-full h-full rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-neutral-100 bg-white flex items-center justify-center overflow-hidden">
                            <ImageWithFallback
                                src={promos[currentIndex].image}
                                alt={`Promo ${promos[currentIndex].id}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Right Shadow Image */}
                    <div className="absolute right-[-15%] md:right-0 top-1/2 -translate-y-1/2 w-[30%] h-[70%] opacity-20 md:opacity-40 promo-slider-image-container pointer-events-none">
                        <div className="w-full h-full rounded-xl bg-neutral-50 flex items-center justify-center overflow-hidden grayscale">
                            <ImageWithFallback src={promos[getSlideIndex(1)].image} alt="next" className="object-cover w-full h-full" />
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="w-full lg:w-[450px] flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
                    <div className="space-y-3 w-full">
                        <div className="flex items-center justify-center lg:justify-start gap-4 promo-slide-text">
                            <div className="hidden md:block h-px w-8 bg-neutral-300" />
                            <span className="text-xs font-bold tracking-widest uppercase text-neutral-400">
                                {String(currentIndex + 1).padStart(2, "0")} / {String(promos.length).padStart(2, "0")}
                            </span>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-neutral-900 promo-slide-text leading-tight uppercase">
                            #{promos[currentIndex].code}
                        </h2>

                        <div className="promo-slide-text">
                            <div className="inline-block px-3 py-1 bg-green-50 rounded-full mb-4">
                                <p className="text-xs md:text-sm font-bold text-green-700 uppercase tracking-wider">
                                    Valid until: {new Date(promos[currentIndex].end_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                            <p className="text-sm md:text-base text-neutral-500 leading-relaxed max-w-md mx-auto lg:mx-0 italic">
                                Use the code above during your booking process or present this upon check-in to avail of the discount.
                            </p>
                        </div>
                    </div>

                    <div className="promo-slide-text flex flex-col md:flex-row items-center gap-6 w-full pt-4">
                        <div className="flex gap-4">
                            <button
                                onClick={() => animateSlide("prev")}
                                disabled={isAnimating}
                                className="w-14 h-14 rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-900 hover:text-white active:scale-95 flex items-center justify-center transition-all disabled:opacity-30 shadow-sm"
                            >
                                <ChevronLeft size={28} />
                            </button>
                            <button
                                onClick={() => animateSlide("next")}
                                disabled={isAnimating}
                                className="w-14 h-14 rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-900 hover:text-white active:scale-95 flex items-center justify-center transition-all disabled:opacity-30 shadow-sm"
                            >
                                <ChevronRight size={28} />
                            </button>
                        </div>

                        <div className="hidden md:block flex-1 h-[2px] bg-neutral-100 relative overflow-hidden">
                            <div
                                className="absolute inset-y-0 left-0 bg-neutral-900 transition-all duration-700 ease-out"
                                style={{ width: `${((currentIndex + 1) / promos.length) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}