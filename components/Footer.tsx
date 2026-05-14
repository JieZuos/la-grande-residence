'use client';
import { useEffect, useRef } from 'react';
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin, Navigation, Contact } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current?.children || [],
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 95%',
          }
        }
      );
    });
    return () => ctx.revert();
  }, []);

  const brandColor = "#19682e";

  return (
    <footer ref={footerRef} className="bg-white border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-5 py-12">

        {/* Top Section */}
        <div ref={contentRef} className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="space-y-4">
            <img
              src="https://www.lagranderesidence.com/assets/logo.webp"
              alt="La Grande Residence Logo"
              className="h-9"
            />
            <p className="text-sm text-neutral-500">
              The place that connects us all.
            </p>

        <div className="flex gap-3">
          <a
            href="https://www.instagram.com/lagranderesidence/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 flex items-center justify-center rounded-full text-white transition hover:scale-105"
            style={{ backgroundColor: brandColor }}
          >
            <Instagram size={16} />
          </a>

          <a
            href="https://www.facebook.com/2016LGResidence/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 flex items-center justify-center rounded-full text-white transition hover:scale-105"
            style={{ backgroundColor: brandColor }}
          >
            <Facebook size={16} />
          </a>

          <a
            href="https://www.youtube.com/@lagranderesidence7727"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 flex items-center justify-center rounded-full text-white transition hover:scale-105"
            style={{ backgroundColor: brandColor }}
          >
            <Youtube size={16} />
          </a>
        </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-800 mb-3">Explore</h3>
            <ul className="space-y-2 text-sm text-neutral-500">
              {['Journal', 'Promos', 'Amenities', 'Sky Lounge', 'Spa'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-[#19682e] transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-neutral-800">Contact</h3>

            <div className="space-y-2 text-sm text-neutral-500">
              <div className="flex items-center gap-2">
                <Phone size={15} style={{ color: brandColor }} />
                <span>+63 922 375 8679</span>

              </div>
              <div className="flex items-center gap-2 break-all">
                <Contact size={15} style={{ color: brandColor }} />
                <span>045-4972572</span>
              </div>
              <div className="flex items-center gap-2 break-all">
                <Mail size={15} style={{ color: brandColor }} />
                <span>reservations@lagranderesidence.com</span>
              </div>
            </div>
              <hr />
            <div className="space-y-2 text-sm text-neutral-500">
              <div className="flex items-center gap-2">
                <Phone size={15} style={{ color: brandColor }} />
                <span>+63 939 936 3647</span>
              </div>

              <div className="flex items-center gap-2 break-all">
                <Mail size={15} style={{ color: brandColor }} />
                <span>marketing@lagranderesidence.com</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-neutral-800">Location</h3>

            <div className="flex gap-2 text-sm text-neutral-500">
              <MapPin size={16} style={{ color: brandColor }} />
              <p className="text-sm leading-relaxed">
                46 Sarmiento Street, Plaridel 1, Malabanias,<br /> Angeles City, Pampanga, Philippines
              </p>
            </div>

            <a
              href="https://www.google.com/maps/dir//La+Grande+Residence,+46+Sarmiento+Street,+Plaridel+1,+Malabanias,+Angeles+City,+Pampanga,+Philippines"
              target="_blank"
              className="inline-flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-md bg-[#19682e] text-white hover:bg-[#19682e] transition"
            >
              <Navigation size={14} />
              Directions
            </a>
            
          </div>
        </div>

        {/* Map */}
        <div className="mt-10 rounded-xl overflow-hidden border border-neutral-200 h-52 sm:h-64">
            <iframe
              title="La Grande Residence Map"
              width="100%"
              height="100%"                
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3850.9208610149676!2d120.57157437511718!3d15.162690285393015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396f34cc2fc9479%3A0xaccbe6fd82b9dbf3!2sLa%20Grande%20Residence!5e0!3m2!1sen!2sph!4v1776070427688!5m2!1sen!2sph"
            />
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t text-center text-xs text-neutral-400">
          © {new Date().getFullYear()} La Grande Residence
        </div>
      </div>
    </footer>
  );
}