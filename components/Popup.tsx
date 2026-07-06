"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

interface Promo {
  id: number;
  image: string;
  stat: number;
  popup: number;
  start_date: string;
  end_date: string;
}

const API_URL = "https://lagranderesidence.com/api/api.php?endpoint=promos";
const CACHE_KEY = "lgr_promo_logic_cache";
const DAILY_PROMOS_KEY = "lgr_daily_promos"; // stores the 2 random promos for today
const LAST_SHOWN_KEY = "lgr_promo_last_shown";
const SHOW_DELAY = 5000;
const PROMOS_PER_DAY = 2;

function isPromoEqual(cached: Promo, api: Promo): boolean {
  return (
    cached.id === api.id &&
    cached.image === api.image &&
    cached.stat === api.stat &&
    cached.popup === api.popup &&
    cached.start_date === api.start_date &&
    cached.end_date === api.end_date
  );
}

function isPromoArrayEqual(cached: Promo[], api: Promo[]): boolean {
  if (cached.length !== api.length) return false;
  const sortById = (a: Promo, b: Promo) => a.id - b.id;
  const sortedCached = [...cached].sort(sortById);
  const sortedApi = [...api].sort(sortById);
  return sortedCached.every((promo, index) => isPromoEqual(promo, sortedApi[index]));
}

function hasShownToday(): boolean {
  if (typeof window === "undefined") return false;
  const lastShown = localStorage.getItem(LAST_SHOWN_KEY);
  if (!lastShown) return false;

  const lastDate = new Date(lastShown);
  const now = new Date();

  return (
    lastDate.getFullYear() === now.getFullYear() &&
    lastDate.getMonth() === now.getMonth() &&
    lastDate.getDate() === now.getDate()
  );
}

function markShownToday(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LAST_SHOWN_KEY, new Date().toISOString());
}

function getDailyDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
}

/** Shuffle array in-place using Fisher-Yates */
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getDailyPromos(allValid: Promo[]): Promo[] {
  if (typeof window === "undefined") return allValid.slice(0, PROMOS_PER_DAY);

  const stored = localStorage.getItem(DAILY_PROMOS_KEY);
  const todayStr = getDailyDateString();

  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.date === todayStr && Array.isArray(parsed.promos)) {
        // Verify stored promos still exist in current valid set (in case one expired mid-day)
        const validIds = new Set(allValid.map((p) => p.id));
        const stillValid = parsed.promos.filter((p: Promo) => validIds.has(p.id));
        if (stillValid.length > 0) {
          return stillValid;
        }
      }
    } catch {
      // fall through to regenerate
    }
  }

  // Generate new random selection for today
  const shuffled = shuffleArray(allValid);
  const selected = shuffled.slice(0, PROMOS_PER_DAY);

  localStorage.setItem(
    DAILY_PROMOS_KEY,
    JSON.stringify({ date: todayStr, promos: selected })
  );

  return selected;
}

function clearDailyPromos(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DAILY_PROMOS_KEY);
}

export default function PromoPopup() {
  const [activePromos, setActivePromos] = useState<Promo[]>([]);
  const [popupIndex, setPopupIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const isAnimating = useRef(false);

  // Mount gate to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load promos
  useEffect(() => {
    if (!isMounted) return;

    async function loadPromos() {
      if (hasShownToday()) return;

      const now = new Date();
      const cached = localStorage.getItem(CACHE_KEY);
      let cachedValidPromos: Promo[] = [];

      if (cached) {
        try {
          const parsed: Promo[] = JSON.parse(cached);
          const valid = parsed.filter((p) => new Date(p.end_date) > now);
          if (valid.length > 0) {
            cachedValidPromos = valid;
          } else {
            localStorage.removeItem(CACHE_KEY);
          }
        } catch {
          localStorage.removeItem(CACHE_KEY);
        }
      }

      try {
        const res = await fetch(API_URL);
        const data: Promo[] = await res.json();

        const validPromos = data.filter((promo) => {
          const start = new Date(promo.start_date);
          const end = new Date(promo.end_date);
          return promo.stat === 1 && promo.popup === 1 && now >= start && now <= end;
        });

        if (validPromos.length === 0) {
          localStorage.removeItem(CACHE_KEY);
          clearDailyPromos();
          return;
        }

        const hasChanged =
          cachedValidPromos.length === 0 ||
          !isPromoArrayEqual(cachedValidPromos, validPromos);

        const promosToCache = hasChanged ? validPromos : cachedValidPromos;
        if (hasChanged) {
          localStorage.setItem(CACHE_KEY, JSON.stringify(validPromos));
          // Clear daily selection when promos change so we re-randomize
          clearDailyPromos();
        }

        // Pick 2 random promos for today
        const dailyPromos = getDailyPromos(promosToCache);

        if (dailyPromos.length === 0) return;

        setActivePromos(dailyPromos);
        setPopupIndex(0);

        setTimeout(() => {
          setIsVisible(true);
          markShownToday();
        }, SHOW_DELAY);
      } catch (error) {
        console.error("Promo fetch error:", error);
        if (cachedValidPromos.length > 0) {
          const dailyPromos = getDailyPromos(cachedValidPromos);
          if (dailyPromos.length === 0) return;

          setActivePromos(dailyPromos);
          setPopupIndex(0);
          setTimeout(() => {
            setIsVisible(true);
            markShownToday();
          }, SHOW_DELAY);
        }
      }
    }

    loadPromos();
  }, [isMounted]);

  // Entrance animation when popup becomes visible
  useEffect(() => {
    if (!isVisible || !popupRef.current || !overlayRef.current) return;

    const tl = gsap.timeline();
    tl.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4 }
    ).fromTo(
      popupRef.current,
      { scale: 0.85, opacity: 0, y: 40 },
      { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" },
      "-=0.2"
    );

    return () => {
      tl.kill();
    };
  }, [isVisible]);

  // Navigation with slide animation
  const goToPromo = useCallback(
    (direction: "next" | "prev") => {
      if (isAnimating.current || activePromos.length <= 1) return;

      const newIndex =
        direction === "next"
          ? Math.min(popupIndex + 1, activePromos.length - 1)
          : Math.max(popupIndex - 1, 0);

      if (newIndex === popupIndex) return;

      isAnimating.current = true;

      gsap.to(popupRef.current, {
        x: direction === "next" ? -60 : 60,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          setPopupIndex(newIndex);
          gsap.fromTo(
            popupRef.current,
            { x: direction === "next" ? 60 : -60, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.35,
              ease: "power2.out",
              onComplete: () => {
                isAnimating.current = false;
              },
            }
          );
        },
      });
    },
    [popupIndex, activePromos.length]
  );

  const goToIndex = useCallback(
    (index: number) => {
      if (isAnimating.current || index === popupIndex || activePromos.length <= 1) return;

      const direction = index > popupIndex ? "next" : "prev";
      isAnimating.current = true;

      gsap.to(popupRef.current, {
        x: direction === "next" ? -60 : 60,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          setPopupIndex(index);
          gsap.fromTo(
            popupRef.current,
            { x: direction === "next" ? 60 : -60, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.35,
              ease: "power2.out",
              onComplete: () => {
                isAnimating.current = false;
              },
            }
          );
        },
      });
    },
    [popupIndex, activePromos.length]
  );

  const closeAll = useCallback(() => {
    if (!overlayRef.current) return;
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => setIsVisible(false),
    });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goToPromo("next");
      if (e.key === "ArrowLeft") goToPromo("prev");
      if (e.key === "Escape") closeAll();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, goToPromo, closeAll]);

  const currentPromo = activePromos[popupIndex];
  if (!isMounted || !isVisible || !currentPromo) return null;

  const hasPrev = popupIndex > 0;
  const hasNext = popupIndex < activePromos.length - 1;
  const total = activePromos.length;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 backdrop-blur-md p-4"
      style={{ opacity: 0 }}
    >
      {/* Close All X Button */}
      <button
        onClick={closeAll}
        className="absolute top-4 right-4 z-20 w-11 h-11 bg-white text-gray-800 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 hover:bg-gray-100 active:scale-95 transition-all duration-200"
        aria-label="Close all promos"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Navigation: Previous */}
      {hasPrev && (
        <button
          onClick={() => goToPromo("prev")}
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 text-gray-800 rounded-full shadow-xl flex items-center justify-center hover:scale-110 hover:bg-white active:scale-95 transition-all duration-200"
          aria-label="Previous promo"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {/* Popup Content */}
      <div ref={popupRef} className="relative pointer-events-auto" style={{ opacity: 0 }}>
        <img
          src={currentPromo.image}
          alt="Promotion"
          className="max-h-[80vh] max-w-[85vw] md:max-w-[70vw] object-contain rounded-2xl shadow-2xl"
          draggable={false}
        />
      </div>

      {/* Navigation: Next */}
      {hasNext && (
        <button
          onClick={() => goToPromo("next")}
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 text-gray-800 rounded-full shadow-xl flex items-center justify-center hover:scale-110 hover:bg-white active:scale-95 transition-all duration-200"
          aria-label="Next promo"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {/* Pagination Dots + Counter */}
      {total > 1 && (
        <div className="mt-6 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            {activePromos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === popupIndex
                    ? "bg-white w-6"
                    : "bg-white/40 w-2 hover:bg-white/70"
                }`}
                aria-label={`Go to promo ${idx + 1}`}
              />
            ))}
          </div>
          <div className="text-white/60 text-xs font-medium tracking-wide">
            {popupIndex + 1} / {total}
          </div>
        </div>
      )}
    </div>
  );
}