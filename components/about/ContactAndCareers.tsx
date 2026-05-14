import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MapPin, Phone, Mail, Briefcase,
  Heart, TrendingUp, Users
} from "lucide-react";
import { ImageWithFallback } from '@/components/err/ImageWithFallback';

gsap.registerPlugin(ScrollTrigger);

export function ContactAndCareers() {
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const allCards = containerRef.current.querySelectorAll(".info-card");

    gsap.fromTo(
      allCards,
      { opacity: 0, y: 30, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%", // Slightly later trigger for mobile scroll feel
          toggleActions: "play none none reverse",
        },
      },
    );

    if (formRef.current) {
      const formElements = formRef.current.querySelectorAll(".form-element");
      gsap.fromTo(
        formElements,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.08,
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 90%",
          },
        },
      );
    }
  }, []);

  const benefits = [
    { icon: Heart, title: "Health & Wellness", desc: "Comprehensive health and wellness programs" },
    { icon: TrendingUp, title: "Career Growth", desc: "Continuous learning and development" },
    { icon: Users, title: "Great Culture", desc: "Collaborative environment with amazing people" },
    { icon: Briefcase, title: "Work-Life Balance", desc: "Flexible hours and remote options" },
  ];

  const contactInfo = [
    { icon: MapPin, title: "Visit Us", details: ["46 Sarmiento Street", "Angeles City, Pampanga"] },
    { icon: Phone, title: "Call Us", details: ["+63 922 375 8679", "Mon-Fri 8AM-6PM"] },
    { icon: Mail, title: "Email Us", details: ["reservations@lagranderesidence.com"] },
  ];

  return (
    <div ref={containerRef} className="bg-white overflow-hidden">
      {/* Section 1: Join Our Team */}
      <section className="py-16 md:py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Join Our Team</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Be part of something amazing. Build the future with us.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 md:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 md:mb-6 text-center lg:text-left">Why Work With Us?</h3>
              <p className="text-gray-600 leading-relaxed mb-8 text-center lg:text-left text-sm sm:text-base">
                We're more than just a company—we're a community of passionate
                individuals working together to create meaningful impact.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit) => (
                  <div key={benefit.title} className="info-card bg-gray-50 p-5 rounded-xl border border-transparent hover:border-gray-200 transition-all">
                    <div className="w-10 h-10 bg-[#19682e] rounded-lg flex items-center justify-center mb-3">
                      <benefit.icon className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-bold mb-1 text-sm md:text-base">{benefit.title}</h4>
                    <p className="text-xs md:text-sm text-gray-600">{benefit.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative order-1 lg:order-2"
            >
              <ImageWithFallback
                src="/assets/lgr-team.webp"
                alt="Team collaboration"
                className="rounded-2xl shadow-xl w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2: Contact Info & Form */}
      <section className="py-16 md:py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16">
            {contactInfo.map((info) => (
              <div key={info.title} className="info-card bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center md:items-start text-center md:text-left">
                <div className="w-12 h-12 bg-[#19682e] rounded-lg flex items-center justify-center mb-4 md:mb-6">
                  <info.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">{info.title}</h3>
                {info.details.map((line) => (
                  <p key={line} className="text-sm md:text-base text-gray-600">{line}</p>
                ))}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-10 md:gap-16">
            <div className="text-center lg:text-left">
              <h3 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">Get In Touch</h3>
              <p className="text-gray-600 text-base md:text-lg mb-8">
                Whether you have a question about our services, need assistance,
                or want to join our team, we're ready to chat.
              </p>
              <div className="space-y-4 md:space-y-6 inline-block lg:block text-left">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-sm flex items-center justify-center">
                    <Phone className="w-5 h-5 text-[#19682e]" />
                  </div>
                  <div>
                    <p className="font-medium text-sm md:text-base">24/7 Support</p>
                    <p className="text-xs md:text-sm text-gray-500">Always here to help</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-sm flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[#19682e]" />
                  </div>
                  <div>
                    <p className="font-medium text-sm md:text-base">Quick Response</p>
                    <p className="text-xs md:text-sm text-gray-500">Usually within 2 hours</p>
                  </div>
                </div>
              </div>
            </div>

            <form ref={formRef} className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 space-y-4">
              <div className="form-element grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] md:text-xs font-bold uppercase text-gray-500 mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg text-base md:text-sm focus:ring-2 focus:ring-[#19682e]/20 outline-none"
                    placeholder="John Doe"
                  />                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-bold uppercase text-gray-500 mb-1">Email</label>
                  <input type="email" className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-[#19682e]/20 outline-none transition-all text-sm" placeholder="john@example.com" />
                </div>
              </div>
              <div className="form-element">
                <label className="block text-[10px] md:text-xs font-bold uppercase text-gray-500 mb-1">Message</label>
                <textarea rows={4} className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-[#19682e]/20 outline-none transition-all resize-none text-sm" placeholder="How can we help?" />
              </div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="form-element w-full bg-[#19682e] text-white py-3.5 md:py-4 rounded-lg font-bold shadow-lg shadow-green-900/20 text-sm md:text-base"
              >
                Send Message
              </motion.button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}