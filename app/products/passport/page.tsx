'use client';

import { useRef, useEffect, useState, useCallback, Suspense, lazy, useMemo } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ContentHeader } from '@/components/ContentHeader';
import {
  BedDouble,
  Dumbbell,
  Heater,
  Gamepad2,
  X,
  Loader2,
  CheckCircle,
} from "lucide-react";

const BRAND = "#19682e";
const TEXT = "#0f0f0f";
const SUBTEXT = "#565656";
const BRAND_SOFT = "rgba(25,104,46,0.08)";

// ─── Data ─────────────────────────────────────────────────────────────────────

const FREE_PERKS = [
  {
    icon: BedDouble,
    title: "Grand Studio Stay",
    desc: "A complimentary night in our signature Grand Studio — yours to enjoy.",
  },
  {
    icon: Dumbbell,
    title: "Pool & Fitness Gym",
    desc: "Unlimited pool and fitness gym access throughout your entire stay.",
  },
  {
    icon: Heater,
    title: "Sauna for Two",
    desc: "A full hour of private sauna bliss, reserved for you and a guest.",
  },
  {
    icon: Gamepad2,
    title: "Gaming Room",
    desc: "One hour of exclusive gaming room access — play, unwind, repeat.",
  },
];

const VOUCHERS = [
  { label: "Room Discounts", value: "Up to 15% OFF" },
  { label: "Early Check-in & Late Check-out", value: "Complimentary, one-time" },
  { label: "Laundry Services", value: "Up to 10% OFF" },
  { label: "Japanese Head Spa", value: "10% OFF" },
  { label: "Spa Massage", value: "10% OFF" },
  { label: "Manicure & Pedicure", value: "10% OFF" },
  { label: "LGR Sauna", value: "10% OFF" },
  { label: "Shuttle Service", value: "Up to 10% OFF" },
  { label: "Gaming Room & Tennis Court", value: "10% OFF" },
  { label: "Sky Lounge & Coffee Lounge", value: "10% OFF" },
];

// ─── Responsive Hook ──────────────────────────────────────────────────────────

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

// ─── 3D Passport Card ─────────────────────────────────────────────────────────

const PASSPORT_MODEL = "/assets/products/passport.glb";

function ModelFallback() {
  return (
    <div className="w-full max-w-[500px] mx-auto h-[280px] sm:h-[360px] md:h-[420px] lg:h-[480px] flex items-center justify-center">
      <div className="relative flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-2 border-[#19682e] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-medium" style={{ color: SUBTEXT }}>
          Loading passport preview...
        </span>
      </div>
    </div>
  );
}

// Load all Three.js dependencies in one chunk instead of several lazy waterfalls.
const PassportScene = lazy(async () => {
  const [{ Canvas }, drei] = await Promise.all([
    import("@react-three/fiber"),
    import("@react-three/drei"),
  ]);

  const { Float, OrbitControls, useGLTF } = drei;

  function PassportObject({ scale }: { scale: number }) {
    const { scene } = useGLTF(PASSPORT_MODEL);

    const clonedScene = useMemo(() => scene.clone(), [scene]);

    return (
      <Float
        speed={0.9}
        rotationIntensity={0.35}
        floatIntensity={0.08}
        floatingRange={[-0.08, 0.08]}
      >
        <primitive object={clonedScene} scale={scale} rotation={[0, 0, 0.1]} />
      </Float>
    );
  }

  useGLTF.preload(PASSPORT_MODEL);

  function Scene({ scale }: { scale: number }) {
    return (
      <div className="w-full max-w-[500px] mx-auto h-[280px] sm:h-[360px] md:h-[420px] lg:h-[480px]">
        <Canvas
          camera={{ position: [0, 0.25, 3.8], fov: 24 }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          onCreated={({ gl }) => {
            gl.setClearAlpha(0);
          }}
        >
          <ambientLight intensity={2.2} />
          <directionalLight position={[3, 5, 4]} intensity={2.2} />
          <directionalLight position={[-3, -2, 2]} intensity={0.8} />

          <Suspense fallback={null}>
            <PassportObject scale={scale} />
          </Suspense>

          <OrbitControls
            target={[0, 0.35, 0]}
            enableZoom={false}
            enablePan={false}
            enableDamping
            dampingFactor={0.08}
            autoRotate
            autoRotateSpeed={5}
            makeDefault
          />
        </Canvas>
      </div>
    );
  }

  return { default: Scene };
});

function PassportModel() {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  // Keep desktop large, but reduce only on smaller screens for faster rendering.
  const modelScale = isMobile ? 4.6 : isTablet ? 5.8 : 7;

  return (
    <Suspense fallback={<ModelFallback />}>
      <PassportScene scale={modelScale} />
    </Suspense>
  );
}

// ─── Inquiry Form Modal ───────────────────────────────────────────────────────

interface FormData {
  name: string;
  phone: string;
  email: string;
  note: string;
}

function InquiryModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    note: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Please enter your name");
      return false;
    }
    if (!formData.phone.trim()) {
      setError("Please enter your phone number");
      return false;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError("");

try {
  const response = await fetch("https://lagranderesidence.com/api/api.php?endpoint=passport-inquiry", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const text = await response.text();
  console.log("Raw API response:", text);

  let result;
  try {
    result = JSON.parse(text);
  } catch {
    throw new Error("Invalid JSON response from server");
  }

  if (response.ok && result.success) {
    setIsSuccess(true);
    setFormData({ name: "", phone: "", email: "", note: "" });

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 3000);
  } else {
    setError(result.message || "Something went wrong. Please try again.");
    console.error(result);
  }
} catch (err) {
  console.error("Fetch error:", err);
  setError("Network error. Please check your connection and try again.");
}
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative px-6 pt-6 pb-4 border-b border-gray-100">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={18} color={SUBTEXT} />
              </button>
              <h3
                className="text-lg sm:text-xl font-bold pr-8"
                style={{ fontFamily: "Arial, Helvetica, sans-serif", color: TEXT }}
              >
                Get Your Passport
              </h3>
              <p className="text-xs sm:text-sm mt-1" style={{ color: SUBTEXT }}>
                Fill out the form below and we will contact you shortly.
              </p>
            </div>

            {/* Form */}
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-6 py-12 flex flex-col items-center text-center"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    style={{ background: BRAND_SOFT }}
                  >
                    <CheckCircle size={32} color={BRAND} />
                  </div>
                  <h4 className="text-lg font-bold mb-2" style={{ color: TEXT }}>
                    Inquiry Submitted!
                  </h4>
                  <p className="text-sm" style={{ color: SUBTEXT }}>
                    Thank you for your interest. Our team will reach out to you soon.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="px-6 py-5 space-y-4"
                >
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: TEXT }}>
                      Full Name <span style={{ color: BRAND }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl text-sm border border-gray-200 focus:border-[#19682e] focus:ring-2 focus:ring-[rgba(25,104,46,0.1)] outline-none transition-all"
                      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: TEXT }}>
                      Phone Number <span style={{ color: BRAND }}>*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+63 912 345 6789"
                      className="w-full px-4 py-3 rounded-xl text-sm border border-gray-200 focus:border-[#19682e] focus:ring-2 focus:ring-[rgba(25,104,46,0.1)] outline-none transition-all"
                      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: TEXT }}>
                      Email Address <span style={{ color: BRAND }}>*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl text-sm border border-gray-200 focus:border-[#19682e] focus:ring-2 focus:ring-[rgba(25,104,46,0.1)] outline-none transition-all"
                      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: TEXT }}>
                      Note <span style={{ color: SUBTEXT }}>(Optional)</span>
                    </label>
                    <textarea
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      placeholder="Any special requests or questions..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl text-sm border border-gray-200 focus:border-[#19682e] focus:ring-2 focus:ring-[rgba(25,104,46,0.1)] outline-none transition-all resize-none"
                      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
                    />
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-500 font-medium"
                    >
                      {error}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl py-3.5 font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{
                      background: BRAND,
                      color: "#fff",
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Inquiry"
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PerkCard({
  icon: Icon,
  title,
  desc,
  index,
}: (typeof FREE_PERKS)[0] & { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-2xl overflow-hidden p-5 sm:p-6 lg:p-8"
      style={{
        background: "#ffffff",
        border: "1px solid rgba(25,104,46,0.14)",
        boxShadow: "0 18px 50px rgba(15,15,15,0.06)",
      }}
      whileHover={{ borderColor: "rgba(25,104,46,0.34)", transition: { duration: 0.3 } }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top left, rgba(25,104,46,0.08) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10">
        <div
          className="w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center text-lg sm:text-xl lg:text-2xl mb-3 sm:mb-4 lg:mb-6"
          style={{
            background: BRAND_SOFT,
            border: "1px solid rgba(25,104,46,0.20)",
          }}
        >
          <Icon
            size={24}
            strokeWidth={2}
            color={BRAND}
            className="transition-transform duration-300 group-hover:scale-110 sm:w-7 sm:h-7 lg:w-8 lg:h-8"
          />
        </div>
        <h3
          className="text-sm sm:text-base lg:text-lg font-semibold mb-1.5 sm:mb-2 leading-snug"
          style={{ fontFamily: "Arial, Helvetica, sans-serif", color: TEXT }}
        >
          {title}
        </h3>
        <p
          className="text-xs sm:text-sm leading-relaxed"
          style={{ color: SUBTEXT, fontFamily: "Arial, Helvetica, sans-serif" }}
        >
          {desc}
        </p>
      </div>
    </motion.div>
  );
}

function VoucherRow({
  label,
  value,
  index,
}: (typeof VOUCHERS)[0] & { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -24 : 24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-4 gap-1.5 sm:gap-0"
      style={{ borderBottom: "1px solid rgba(25,104,46,0.12)" }}
    >
      <span
        className="text-xs sm:text-sm lg:text-base"
        style={{ fontFamily: "Arial, Helvetica, sans-serif", color: TEXT }}
      >
        {label}
      </span>
      <span
        className="text-xs sm:text-xs lg:text-sm font-medium tracking-wider px-2.5 sm:px-3 py-1 rounded-full self-start sm:self-auto"
        style={{
          fontFamily: "Arial, Helvetica, sans-serif",
          color: BRAND,
          border: "1px solid rgba(25,104,46,0.28)",
          background: BRAND_SOFT,
        }}
      >
        {value}
      </span>
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block text-xs tracking-[0.25em] uppercase mb-3"
      style={{ fontFamily: "Arial, Helvetica, sans-serif", color: BRAND }}
    >
      {children}
    </span>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.28], ["0%", "-12%"]);
  const passportY = useTransform(scrollYProgress, [0, 0.35], ["0px", "-60px"]);
  const passportScale = useTransform(scrollYProgress, [0, 0.35], [1, 0.88]);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <main
      className="overflow-x-hidden"
      style={{
        background: "#ffffff",
        color: TEXT,
        fontFamily: "Arial, Helvetica, sans-serif",
        minHeight: "100vh",
      }}
    >
      <ContentHeader
        badge=""
        title=""
        description=""
      />
      <Navbar />

      {/* Inquiry Modal */}
      <InquiryModal isOpen={isModalOpen} onClose={closeModal} />

      {/* Ambient background gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(25,104,46,0.10) 0%, transparent 62%)",
          zIndex: 0,
        }}
      />

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[100dvh] flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-10 lg:gap-16 px-5 sm:px-8 md:px-12 lg:px-20 pt-20 sm:pt-24 lg:pt-28 pb-12 sm:pb-16 lg:pb-24 overflow-hidden"
        style={{ zIndex: 1 }}
      >
        {/* Text side */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="flex-[1.2] max-w-3xl flex flex-col justify-center text-center lg:text-left w-full order-2 lg:order-1"
        >
          <motion.span
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex w-fit mx-auto lg:mx-0 items-center rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 text-[10px] sm:text-xs font-semibold tracking-[0.15em] sm:tracking-[0.18em] uppercase"
            style={{
              background: BRAND_SOFT,
              color: BRAND,
              border: "1px solid rgba(25,104,46,0.18)",
            }}
          >
            ✦ Limited Edition Member Passport
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-bold leading-[1.05] mb-3 sm:mb-5"
            style={{
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: "clamp(2rem, 7vw, 5.4rem)",
            }}
          >
            Passport Perks.
            <br />
            <span style={{ color: BRAND }}>Are Here.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8 mx-auto lg:mx-0 max-w-lg lg:max-w-xl"
            style={{ color: SUBTEXT }}
          >
            Enjoy complimentary experiences, exclusive discounts, and premium
            member-only perks throughout La Grande Residence.{" "}
            <span style={{ color: BRAND, fontWeight: 700 }}>
              Valid for 6 months.
            </span>
          </motion.p>

          {/* Price + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center lg:items-stretch justify-center lg:justify-start gap-3 sm:gap-4 mb-8 sm:mb-10"
          >
            <div
              className="rounded-2xl sm:rounded-3xl px-5 sm:px-6 py-4 sm:py-5 w-full max-w-sm text-center sm:text-left"
              style={{
                background: "#fff",
                border: "1px solid rgba(25,104,46,0.14)",
                boxShadow: "0 18px 50px rgba(0,0,0,0.07)",
              }}
            >
              <span
                className="block text-[10px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.22em] mb-1.5 sm:mb-2"
                style={{ color: SUBTEXT }}
              >
                Introductory Price
              </span>

              <strong
                className="block leading-none"
                style={{
                  fontSize: "clamp(2.2rem, 6vw, 4rem)",
                  color: BRAND,
                }}
              >
                ₱4,000
              </strong>

              <p className="text-[11px] sm:text-xs lg:text-sm mt-2 sm:mt-3 leading-relaxed" style={{ color: SUBTEXT }}>
                Includes complimentary perks and exclusive vouchers.
              </p>
            </div>

            <button
              onClick={openModal}
              className="rounded-full px-6 sm:px-8 py-3.5 sm:py-4 font-semibold text-sm transition-transform hover:scale-105 h-fit sm:self-center w-full sm:w-auto"
              style={{
                background: BRAND,
                color: "#fff",
              }}
            >
              Get Your Passport
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 1 }}
            className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3"
          >
            <motion.span
              animate={{ y: [0, 7, 0] }}
              transition={{ repeat: Infinity, duration: 1.9, ease: "easeInOut" }}
              style={{ color: BRAND }}
              className="text-sm sm:text-base"
            >
              ↓
            </motion.span>

            <span
              className="text-[10px] sm:text-xs tracking-[0.18em] sm:tracking-[0.22em] uppercase"
              style={{ color: "#8a8a8a" }}
            >
              Scroll to explore
            </span>
          </motion.div>
        </motion.div>

        {/* Passport side */}
        <motion.div
          style={{ y: passportY, scale: passportScale }}
          className="flex-[0.8] flex items-center justify-center w-full max-w-[280px] sm:max-w-sm lg:max-w-lg order-1 lg:order-2"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <PassportModel />
        </motion.div>

        {/* Bottom vignette */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 lg:h-32 pointer-events-none"
          style={{
            background: "linear-gradient(to top, #ffffff, transparent)",
          }}
        />
      </section>

      {/* ── INTRO BAND ────────────────────────────────────────────────────────── */}
      <section className="relative py-12 sm:py-16 lg:py-24 px-5 sm:px-8 md:px-12 lg:px-20" style={{ zIndex: 1 }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(25,104,46,0.055) 0%, transparent 70%)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <SectionLabel>Included perks</SectionLabel>
          <h2
            className="font-bold leading-tight mb-3 sm:mb-4 lg:mb-6"
            style={{
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: "clamp(1.5rem, 5vw, 3rem)",
            }}
          >
            Everything you get,{" "}
            <span style={{ color: BRAND }}>completely free.</span>
          </h2>
          <p
            className="text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed mx-auto px-4 sm:px-0"
            style={{ color: SUBTEXT, maxWidth: "480px" }}
          >
            Four handpicked experiences — no catches, no minimums. Simply
            show your passport and enjoy.
          </p>
        </motion.div>
      </section>

      {/* ── FREE PERKS ────────────────────────────────────────────────────────── */}
      <section className="pb-16 sm:pb-20 lg:pb-28 px-5 sm:px-8 md:px-12 lg:px-20" style={{ zIndex: 1 }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {FREE_PERKS.map((perk, i) => (
            <PerkCard key={perk.title} {...perk} index={i} />
          ))}
        </div>
      </section>

      {/* ── DIVIDER ───────────────────────────────────────────────────────────── */}
      <div className="px-5 sm:px-8 md:px-12 lg:px-20" style={{ zIndex: 1 }}>
        <div className="max-w-6xl mx-auto">
          <div
            className="w-full h-px"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(25,104,46,0.28), transparent)",
            }}
          />
        </div>
      </div>

      {/* ── VOUCHERS ──────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 lg:py-28 px-5 sm:px-8 md:px-12 lg:px-20" style={{ zIndex: 1 }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20">
          {/* Left sticky heading */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="lg:sticky lg:top-28 lg:self-start text-center lg:text-left"
          >
            <SectionLabel>Additional vouchers</SectionLabel>
            <h2
              className="font-bold leading-tight mb-3 sm:mb-4 lg:mb-6"
              style={{
                fontFamily: "Arial, Helvetica, sans-serif",
                fontSize: "clamp(1.5rem, 4.5vw, 2.75rem)",
              }}
            >
              More savings,
              <br />
              <span style={{ color: BRAND }}>more moments.</span>
            </h2>
            <p
              className="text-xs sm:text-sm md:text-base leading-relaxed mx-auto lg:mx-0 px-4 sm:px-0"
              style={{ color: SUBTEXT, maxWidth: "320px" }}
            >
              Redeemable across every corner of La Grande Residence — from the
              spa to the sky lounge.
            </p>
          </motion.div>

          {/* Right voucher list */}
          <div>
            {VOUCHERS.map((v, i) => (
              <VoucherRow key={v.label} {...v} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ────────────────────────────────────────────────────────── */}
      <section
        className="relative py-16 sm:py-24 lg:py-32 px-5 sm:px-8 md:px-12 lg:px-20 overflow-hidden"
        style={{ zIndex: 1 }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(25,104,46,0.08) 0%, transparent 70%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          <h2
            className="font-bold leading-tight mb-3 sm:mb-4 lg:mb-6"
            style={{
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: "clamp(1.5rem, 5vw, 3rem)",
            }}
          >
            Unlock exclusive privileges
            <br />
            <span style={{ color: BRAND }}>with your LGR Passport.</span>
          </h2>

          <p
            className="text-xs sm:text-sm md:text-base lg:text-lg mb-8 sm:mb-10 leading-relaxed mx-auto px-4 sm:px-0"
            style={{ color: SUBTEXT, maxWidth: "520px" }}
          >
            Enjoy complimentary stays, premium amenities, exclusive discounts, and
            member-only perks every time you visit La Grande Residence. Your next
            unforgettable experience starts here.
          </p>

          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <button
              onClick={openModal}
              className="inline-flex items-center rounded-full px-5 sm:px-6 py-2.5 sm:py-3 transition-transform hover:scale-105"
              style={{
                background: BRAND,
                color: "#fff",
              }}
            >
              <span
                className="font-bold tracking-wide text-sm sm:text-base"
                style={{
                  fontFamily: "Arial, Helvetica, sans-serif",
                }}
              >
                Get Yours Now for ₱4,000
              </span>
            </button>

            <div className="flex items-center justify-center gap-2 sm:gap-3 py-20">
              <div
                className="h-px w-8 sm:w-10 lg:w-14"
                style={{ background: "rgba(25,104,46,0.28)" }}
              />
              <span
                className="text-[10px] sm:text-xs tracking-[0.18em] sm:tracking-[0.2em] uppercase"
                style={{
                  fontFamily: "Arial, Helvetica, sans-serif",
                  color: BRAND,
                }}
              >
                ✦ Limited Availability ✦
              </span>
              <div
                className="h-px w-8 sm:w-10 lg:w-14"
                style={{ background: "rgba(25,104,46,0.28)" }}
              />
            </div>
          </div>
        </motion.div>

                <Footer />
      </section>
    </main>
  );
}