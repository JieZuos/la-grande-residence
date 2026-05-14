"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
const LAST_SHOWN_KEY = "lgr_promo_last_shown"; // 👈 new: tracks last display date
const SHOW_DELAY = 5000;

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

/** Returns true if promos were already shown today */
function hasShownToday(): boolean {
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

/** Mark promos as shown for today */
function markShownToday(): void {
  localStorage.setItem(LAST_SHOWN_KEY, new Date().toISOString());
}

export default function PromoPopup() {
  const [activePromos, setActivePromos] = useState<Promo[]>([]);
  const [popupIndex, setPopupIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function loadPromos() {
      // 👉 If already shown today, bail immediately — no fetch, no delay
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
          return;
        }

        const hasChanged =
          cachedValidPromos.length === 0 ||
          !isPromoArrayEqual(cachedValidPromos, validPromos);

        if (hasChanged) {
          localStorage.setItem(CACHE_KEY, JSON.stringify(validPromos));
          setActivePromos(validPromos);
          setPopupIndex(0);
          setTimeout(() => {
            setIsVisible(true);
            markShownToday(); // 👈 mark as shown when popup actually appears
          }, SHOW_DELAY);
        } else {
          setActivePromos(cachedValidPromos);
          setTimeout(() => {
            setIsVisible(true);
            markShownToday(); // 👈 same here
          }, SHOW_DELAY);
        }
      } catch (error) {
        console.error("Promo fetch error:", error);
        if (cachedValidPromos.length > 0) {
          setActivePromos(cachedValidPromos);
          setTimeout(() => {
            setIsVisible(true);
            markShownToday(); // 👈 and here
          }, SHOW_DELAY);
        }
      }
    }

    loadPromos();
  }, []);

  useLayoutEffect(() => {
    if (!isVisible || !popupRef.current) return;

    gsap
      .timeline()
      .fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 })
      .fromTo(
        popupRef.current,
        { scale: 0.85, opacity: 0, y: 40 },
        { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.2"
      );
  }, [isVisible, popupIndex]);

  const nextPromo = () => {
    if (popupIndex < activePromos.length - 1) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          setPopupIndex((prev) => prev + 1);
          gsap.set(overlayRef.current, { opacity: 1 });
        },
      });
    } else {
      closeAll();
    }
  };

  const closeAll = () => {
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => setIsVisible(false),
    });
  };

  const currentPromo = activePromos[popupIndex];
  if (!isVisible || !currentPromo) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/50 backdrop-blur-md p-4"
      onClick={nextPromo}
    >
      <div
        ref={popupRef}
        className="relative pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={nextPromo}
          className="absolute -top-3 -right-3 z-10 w-10 h-10 bg-white text-black rounded-full shadow-xl flex items-center justify-center font-bold hover:scale-110 transition-transform"
        >
          →
        </button>

        <img
          src={currentPromo.image}
          alt="Promotion"
          className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl drop-shadow-2xl"
        />
      </div>

      <div
        onClick={(e) => {
          e.stopPropagation();
          closeAll();
        }}
        className="mt-6 text-white text-sm underline cursor-pointer hover:opacity-80"
      >
        Close all
      </div>
    </div>
  );
}