"use client";

import React, { useState, useEffect, useRef, RefObject, useCallback } from "react";
import { gsap } from "gsap";
import { Home, DoorOpen, Bookmark, Ticket, Menu, X } from "lucide-react";
import TransitionLink from '@/components/animations/TransitionLink';

interface NavbarProps {
  heroRef?: RefObject<HTMLDivElement | null>;
}

const Navbar = ({ heroRef }: NavbarProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const extraMenuRef = useRef<HTMLUListElement>(null);
  const tabRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Memoized indicator logic
  const moveIndicator = useCallback((index: number, animate = true) => {
    const el = tabRefs.current[index];
    const indicator = indicatorRef.current;
    if (el && indicator) {
      const { offsetLeft, offsetWidth } = el;
      const x = offsetLeft + offsetWidth / 2 - indicator.offsetWidth / 2;
      gsap.to(indicator, {
        x,
        duration: animate ? 0.3 : 0,
        ease: "power2.out",
      });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 20;
      const heroBottom = heroRef?.current?.getBoundingClientRect().bottom || 0;
      setIsVisible(window.scrollY > scrollThreshold || heroBottom < 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [heroRef]);

  // Handle Visibility Animation
  useEffect(() => {
    gsap.to(navRef.current, {
      y: isVisible ? 0 : 100,
      opacity: isVisible ? 1 : 0,
      duration: 0.4,
      ease: "power3.out",
      xPercent: -50,
    });
  }, [isVisible]);

  // Handle Resize and Escape Key
  useEffect(() => {
    const handleResize = () => moveIndicator(activeTab, false);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeTab, moveIndicator]);

  useEffect(() => {
    moveIndicator(activeTab);
  }, [activeTab, moveIndicator]);

  const toggleExtraMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isMenuOpen) {
      setIsMenuOpen(true);
      gsap.fromTo(
        extraMenuRef.current,
        { opacity: 0, scale: 0.9, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "back.out(1.7)" }
      );
    } else {
      gsap.to(extraMenuRef.current, {
        opacity: 0,
        scale: 0.9,
        y: 10,
        duration: 0.2,
        onComplete: () => setIsMenuOpen(false),
      });
    }
  };

  const handleNavClick = (href: string, idx: number) => {
    setActiveTab(idx);
    // Refresh the page after animation completes
    setTimeout(() => {
      window.location.href = href;
    }, 1850);
  };

  const menuItems = [
    { icon: <Home size={18} />, label: "Home", href: "/" },
    { icon: <DoorOpen size={18} />, label: "Amenities", href: "/amenities" },
    { icon: <Bookmark size={20} />, label: "Book", href: "/room", special: true },
    { icon: <Ticket size={18} />, label: "Promo", href: "/promos" },
    { icon: <Menu size={18} />, label: "Menu", isToggle: true },
  ];

  const extraLinks = [
    { label: "About Us", href: "/about" },
    { label: "Journal", href: "/journal" },
    { label: "Blog", href: "/blogs" },
    { label: "Gallery", href: "/gallery" },
    { label: "Products", href: "/products" },
    { label: "360 Tour", href: "/360" },
  ];

  return (
    <nav
      ref={navRef}
      aria-label="Mobile Navigation"
      className="fixed bottom-6 left-1/2 z-[9999] 
                 w-[92%] max-w-[420px] 
                 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/50 
                 px-2 py-2 shadow-2xl 
                 pointer-events-auto opacity-0"
    >
      <span
        ref={indicatorRef}
        aria-hidden="true"
        className="absolute bottom-1 h-1 w-6 rounded-full bg-[#19682e]"
      />

      <ul className="relative flex justify-around items-center h-12">
        {menuItems.map((item, idx) => {
          if (item.special) {
            return (
              <li key={idx} className="relative -top-5 flex flex-col items-center">
                <TransitionLink
                  href={item.href!}
                  aria-label="Book a Room"
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-[#19682e] shadow-lg shadow-[#19682e]/30 text-white hover:scale-105 transition-transform active:scale-95 outline-none focus:ring-4 focus:ring-[#19682e]/20"
                  onClick={() => handleNavClick(item.href!, idx)}
                >
                  {item.icon}
                </TransitionLink>
                <span className="mt-1 text-[10px] font-bold text-[#19682e] tracking-wide uppercase">
                  {item.label}
                </span>
              </li>
            );
          }

          return (
            <li
              key={idx}
              ref={(el) => { tabRefs.current[idx] = el; }}
              className="flex-1 flex flex-col items-center justify-center"
            >
              {item.isToggle ? (
                <div className="relative">
                  <button
                    onClick={toggleExtraMenu}
                    aria-expanded={isMenuOpen}
                    aria-haspopup="true"
                    aria-label="Toggle extra menu"
                    className={`flex flex-col items-center gap-0.5 transition-colors ${isMenuOpen ? 'text-[#19682e]' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {isMenuOpen ? <X size={18} /> : item.icon}
                    <span className="text-[9px] font-semibold">{item.label}</span>
                  </button>

                  {isMenuOpen && (
                    <ul
                      ref={extraMenuRef}
                      className="absolute bottom-16 right-[-10px] flex flex-col overflow-hidden bg-white rounded-xl shadow-2xl w-40 border border-slate-100 py-1"
                    >
                      {extraLinks.map((link) => (
                        <li key={link.href}>
                          <TransitionLink
                            href={link.href}
                            className="block px-4 py-3 text-left text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-[#19682e] transition-colors"
                            onClick={() => handleNavClick(link.href, idx)}
                          >
                            {link.label}
                          </TransitionLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <TransitionLink
                  href={item.href!}
                  onClick={() => handleNavClick(item.href!, idx)}
                  className="flex flex-col items-center gap-0.5 outline-none group"
                >
                  <div className={`transition-colors ${activeTab === idx ? "text-[#19682e]" : "text-slate-400 group-hover:text-slate-600"}`}>
                    {item.icon}
                  </div>
                  <span className={`text-[9px] font-semibold transition-colors ${activeTab === idx ? "text-[#19682e]" : "text-slate-500 group-hover:text-slate-700"}`}>
                    {item.label}
                  </span>
                </TransitionLink>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navbar;