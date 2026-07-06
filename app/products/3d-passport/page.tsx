'use client';

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Float, Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { ContentHeader } from '@/components/ContentHeader';
import {
  BedDouble,
  Dumbbell,
  Waves,
  Heater,
  Gamepad2,
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

// ─── CSS 3D Passport Card ─────────────────────────────────────────────────────

function PassportObject() {
  const { scene } = useGLTF("/assets/products/passport.glb");

  return (
    <Float
      speed={1}
      rotationIntensity={0.5}
      floatIntensity={0.1}
      floatingRange={[-0.2, 0.2]}
    >
      <primitive object={scene} scale={5.8} rotation={[0, 0, 0]} />
    </Float>
  );
}

function PassportModel() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full max-w-[500px] mx-auto h-[320px] sm:h-[400px] md:h-[480px] lg:h-[520px]" />
    );
  }

  return (
    <div className="w-full max-w-[500px] mx-auto h-[320px] sm:h-[400px] md:h-[480px] lg:h-[520px]">
      <Canvas camera={{ position: [0, 0, 3.5], fov: 22 }}>
        <ambientLight intensity={1.8} />
        <directionalLight position={[4, 5, 5]} intensity={2} />
        <directionalLight position={[-4, -2, -2]} intensity={0.8} />

        <Environment preset="city" />

        <PassportObject />

        <OrbitControls
          target={[0, 0.25, 0]}
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}

// useGLTF.preload("/assets/products/passport.glb");

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
      className="group relative rounded-2xl overflow-hidden p-6 sm:p-8"
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
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-xl sm:text-2xl mb-4 sm:mb-6"
          style={{
            background: BRAND_SOFT,
            border: "1px solid rgba(25,104,46,0.20)",
          }}
        >
          <Icon
            size={28}
            strokeWidth={2}
            color={BRAND}
            className="transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <h3
          className="text-base sm:text-lg font-semibold mb-2 leading-snug"
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
      className="group flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-2 sm:gap-0"
      style={{ borderBottom: "1px solid rgba(25,104,46,0.12)" }}
    >
      <span
        className="text-sm sm:text-base"
        style={{ fontFamily: "Arial, Helvetica, sans-serif", color: TEXT }}
      >
        {label}
      </span>
      <span
        className="text-xs sm:text-sm font-medium tracking-wider px-3 py-1 rounded-full self-start sm:self-auto"
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
  const { scrollYProgress } = useScroll();

  const heroOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.28], ["0%", "-12%"]);
  const passportY = useTransform(scrollYProgress, [0, 0.35], ["0px", "-60px"]);
  const passportScale = useTransform(scrollYProgress, [0, 0.35], [1, 0.88]);

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
{/* ── HERO ──────────────────────────────────────────────────────────────── */}
<section
  className="relative min-h-[100dvh] flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 px-6 sm:px-10 md:px-16 lg:px-20 pt-24 sm:pt-28 pb-16 sm:pb-24 overflow-hidden"
  style={{ zIndex: 1 }}
>
  {/* Text side */}
  <motion.div
    style={{ opacity: heroOpacity, y: heroY }}
    className="flex-[1.2] max-w-3xl flex flex-col justify-center text-center lg:text-left w-full"
  >
    <motion.span
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="inline-flex w-fit mx-auto lg:mx-0 items-center rounded-full px-4 py-2 mb-6 text-xs font-semibold tracking-[0.18em] uppercase"
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
      className="font-bold leading-[1.05] mb-5"
      style={{
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: "clamp(2.5rem, 6vw, 5.4rem)",
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
      className="text-sm sm:text-base md:text-lg leading-relaxed mb-8 mx-auto lg:mx-0 max-w-xl"
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
      className="flex flex-col sm:flex-row items-center lg:items-stretch justify-center lg:justify-start gap-4 mb-10"
    >
      <div
        className="rounded-3xl px-6 py-5 w-full max-w-sm text-center sm:text-left"
        style={{
          background: "#fff",
          border: "1px solid rgba(25,104,46,0.14)",
          boxShadow: "0 18px 50px rgba(0,0,0,0.07)",
        }}
      >
        <span
          className="block text-xs uppercase tracking-[0.22em] mb-2"
          style={{ color: SUBTEXT }}
        >
          Introductory Price
        </span>

        <strong
          className="block leading-none"
          style={{
            fontSize: "clamp(2.8rem, 5vw, 4rem)",
            color: BRAND,
          }}
        >
          ₱4,000
        </strong>

        <p className="text-xs sm:text-sm mt-3 leading-relaxed" style={{ color: SUBTEXT }}>
          Includes complimentary perks and exclusive vouchers.
        </p>
      </div>

      <button
        className="rounded-full px-8 py-4 font-semibold transition-transform hover:scale-105 h-fit sm:self-center"
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
      className="flex items-center justify-center lg:justify-start gap-3"
    >
      <motion.span
        animate={{ y: [0, 7, 0] }}
        transition={{ repeat: Infinity, duration: 1.9, ease: "easeInOut" }}
        style={{ color: BRAND }}
      >
        ↓
      </motion.span>

      <span
        className="text-xs tracking-[0.22em] uppercase"
        style={{ color: "#8a8a8a" }}
      >
        Scroll to explore
      </span>
    </motion.div>
  </motion.div>

  {/* Passport side */}
  <motion.div
    style={{ y: passportY, scale: passportScale }}
    className="flex-[0.8] flex items-center justify-center w-full max-w-sm lg:max-w-lg"
    initial={{ opacity: 0, y: 60 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
  >
    <PassportModel />
  </motion.div>

  {/* Bottom vignette */}
  <div
    className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 pointer-events-none"
    style={{
      background: "linear-gradient(to top, #ffffff, transparent)",
    }}
  />
</section>

      {/* ── INTRO BAND ────────────────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-24 px-6 sm:px-10 md:px-16 lg:px-20" style={{ zIndex: 1 }}>
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
            className="font-bold leading-tight mb-4 sm:mb-6"
            style={{
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: "clamp(1.75rem, 4.5vw, 3rem)",
            }}
          >
            Everything you get,{" "}
            <span style={{ color: BRAND }}>completely free.</span>
          </h2>
          <p
            className="text-sm sm:text-base md:text-lg leading-relaxed mx-auto"
            style={{ color: SUBTEXT, maxWidth: "480px" }}
          >
            Four handpicked experiences — no catches, no minimums. Simply
            show your passport and enjoy.
          </p>
        </motion.div>
      </section>

      {/* ── FREE PERKS ────────────────────────────────────────────────────────── */}
      <section className="pb-20 sm:pb-28 px-6 sm:px-10 md:px-16 lg:px-20" style={{ zIndex: 1 }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {FREE_PERKS.map((perk, i) => (
            <PerkCard key={perk.title} {...perk} index={i} />
          ))}
        </div>
      </section>

      {/* ── DIVIDER ───────────────────────────────────────────────────────────── */}
      <div className="px-6 sm:px-10 md:px-16 lg:px-20" style={{ zIndex: 1 }}>
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
      <section className="py-20 sm:py-28 px-6 sm:px-10 md:px-16 lg:px-20" style={{ zIndex: 1 }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20">
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
              className="font-bold leading-tight mb-4 sm:mb-6"
              style={{
                fontFamily: "Arial, Helvetica, sans-serif",
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              }}
            >
              More savings,
              <br />
              <span style={{ color: BRAND }}>more moments.</span>
            </h2>
            <p
              className="text-sm sm:text-base leading-relaxed mx-auto lg:mx-0"
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
        className="relative py-20 sm:py-32 px-6 sm:px-10 md:px-16 lg:px-20 overflow-hidden"
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
            className="font-bold leading-tight mb-4 sm:mb-6"
            style={{
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: "clamp(1.75rem, 4.5vw, 3rem)",
            }}
          >
            Unlock exclusive privileges
            <br />
            <span style={{ color: BRAND }}>with your LGR Passport.</span>
          </h2>

          <p
            className="text-sm sm:text-base md:text-lg mb-10 leading-relaxed mx-auto"
            style={{ color: SUBTEXT, maxWidth: "520px" }}
          >
            Enjoy complimentary stays, premium amenities, exclusive discounts, and
            member-only perks every time you visit La Grande Residence. Your next
            unforgettable experience starts here.
          </p>

          <div className="flex flex-col items-center gap-4">
            <div
              className="inline-flex items-center rounded-full px-6 py-3"
              style={{
                background: BRAND,
                color: "#fff",
              }}
            >
              <span
                className="font-bold tracking-wide"
                style={{
                  fontFamily: "Arial, Helvetica, sans-serif",
                  fontSize: "clamp(1rem,2vw,1.15rem)",
                }}
              >
                Get Yours Now for ₱4,000
              </span>
            </div>

            <div className="flex items-center justify-center gap-3">
              <div
                className="h-px w-10 sm:w-14"
                style={{ background: "rgba(25,104,46,0.28)" }}
              />
              <span
                className="text-xs tracking-[0.2em] uppercase"
                style={{
                  fontFamily: "Arial, Helvetica, sans-serif",
                  color: BRAND,
                }}
              >
                ✦ Limited Availability ✦
              </span>
              <div
                className="h-px w-10 sm:w-14"
                style={{ background: "rgba(25,104,46,0.28)" }}
              />
            </div>
          </div>
        </motion.div>

        <p
          className="relative z-10 text-center mt-12 sm:mt-16 text-xs"
          style={{
            fontFamily: "Arial, Helvetica, sans-serif",
            color: "#8a8a8a",
          }}
        >
          © La Grande Residence · Passport Perks valid for 6 months from date of issue
        </p>
      </section>
    </main>
  );
}