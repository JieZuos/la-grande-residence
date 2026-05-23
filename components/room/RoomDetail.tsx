"use client";
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Room } from '@/app/room/page';
import {
  ArrowLeft, Users, Baby, Loader2, ChevronLeft, ChevronRight,
  Minus, Plus, Calendar, CreditCard, CheckCircle2, Phone, X, Utensils, Bed, Zap, Wifi, CalendarCheck, Receipt,
  Dog, Ban, Search, Home, Clock, Coffee, Droplet,
  AirVent, Tv, Lightbulb, ShowerHead, Mail, User, Hash, Building2, CalendarDays, Banknote, Tag, Check, Globe, ExternalLink
} from 'lucide-react';
import { ImageWithFallback } from '@/components/err/ImageWithFallback';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { format, addDays, isAfter, differenceInDays, parseISO } from 'date-fns';
import toast, { Toaster } from 'react-hot-toast';
import { BackButton } from '@/components/providers/backbutton';
import { useRouter } from 'next/navigation';
import { Footer } from '@/components/Footer';

// Map the old FontAwesome icons to new Lucide icons
const Icon = ({ name, className }: { name: keyof typeof IconMapping; className?: string }) => {
  const Component = IconMapping[name]?.icon || X;
  const defaultClass = IconMapping[name]?.className || 'text-gray-500';
  return <Component className={className || defaultClass} />;
};

const IconMapping = {
  faBroom: { icon: Utensils, className: 'text-green-700' },
  faWater: { icon: Droplet, className: 'text-green-700' },
  faTv: { icon: Tv, className: 'text-green-700' },
  faMugHot: { icon: Coffee, className: 'text-green-700' },
  faBed: { icon: Bed, className: 'text-green-700' },
  faPlug: { icon: Lightbulb, className: 'text-green-700' },
  faWifi: { icon: Wifi, className: 'text-green-700' },
  faDog: { icon: Dog, className: 'text-green-700' },
  faBan: { icon: Ban, className: 'text-red-500' },
  faCalendarCheck: { icon: CalendarCheck, className: 'text-green-700' },
  faReceipt: { icon: Receipt, className: 'text-green-700' },
  faXmark: { icon: X, className: 'text-white' },
  faPhone: { icon: Phone, className: 'text-gray-400' },
} as const;

interface RoomDetailProps {
  slug: string;
  onBack: () => void;
}

interface Promo {
  id: number;
  code: string;
  value: number;
  type: "percent" | "price";
  start_date: string;
  end_date: string;
  stat: number;
}

type BookingMode = "daily" | "monthly";

const PROMO_URL = "https://lagranderesidence.com/api/api.php?endpoint=promos";

export function RoomDetail({ slug, onBack }: RoomDetailProps) {
  const router = useRouter();

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Booking States
  const [bookingMode, setBookingMode] = useState<BookingMode>("daily");
  const [startDateString, setStartDateString] = useState<string>('');
  const [endDateString, setEndDateString] = useState<string>('');
  const [monthlyNights, setMonthlyNights] = useState(1);
  const [roomsQuantity, setRoomsQuantity] = useState(1);
  const [voucher, setVoucher] = useState("");
  const [phone, setPhone] = useState<string>('');
  const [promos, setPromos] = useState<Promo[]>([]);

  // Guest Info States
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');

  // Calculation States
  const [total, setTotal] = useState(0);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [voucherType, setVoucherType] = useState<"percent" | "price" | null>(null);
  const [matchedVoucherId, setMatchedVoucherId] = useState<number | null>(null);

  // Modal States
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const detailsRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);

  const formatPrice = useCallback((price: string | number | undefined) => {
    const num = Number(price);
    return isNaN(num) ? "0" : num.toLocaleString();
  }, []);

  const getMinDate = () => format(new Date(), 'yyyy-MM-dd');

  const dateRange: [Date, Date] | null = useMemo(() => {
    const start = startDateString ? parseISO(startDateString) : null;
    const end = endDateString ? parseISO(endDateString) : null;
    if (start && end) return [start, end];
    return null;
  }, [startDateString, endDateString]);

  const fetchRoomDetail = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`https://lagranderesidence.com/api/api.php?endpoint=rooms`);
      const allRooms: Room[] = await res.json();
      const foundRoom = allRooms.find(r => r.slug === slug || r.id.toString() === slug);
      if (foundRoom) {
        setRoom(foundRoom);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const fetchPromos = async () => {
    try {
      const res = await fetch(PROMO_URL, { cache: "no-store" });
      const data = await res.json();
      setPromos(data);
    } catch (err) { console.error("Failed to fetch promos", err); }
  };

  useEffect(() => {
    fetchRoomDetail();
    fetchPromos();
  }, [fetchRoomDetail]);

  useEffect(() => {
    if (!startDateString) { setEndDateString(''); return; }
    const start = parseISO(startDateString);
    let calculatedEnd: Date;

    if (bookingMode === "monthly") {
      calculatedEnd = addDays(start, monthlyNights * 30);
    } else {
      const currentEnd = endDateString ? parseISO(endDateString) : null;
      calculatedEnd = addDays(start, 1);
      if (currentEnd && isAfter(currentEnd, calculatedEnd)) {
        calculatedEnd = currentEnd;
      }
    }
    setEndDateString(format(calculatedEnd, 'yyyy-MM-dd'));
  }, [startDateString, bookingMode, monthlyNights]);

  useEffect(() => {
    if (!room) return;

    const pricePerUnit = bookingMode === "daily" ? Number(room.daily_price) || 0 : Number(room.monthly_price) || 0;
    let unitCount = 0;

    if (bookingMode === "daily") {
      unitCount = dateRange ? Math.max(1, differenceInDays(dateRange[1], dateRange[0])) : 0;
    } else {
      unitCount = monthlyNights;
    }

    const subTotal = pricePerUnit * roomsQuantity * unitCount;

    let discVal = 0;
    let discType: "percent" | "price" | null = null;
    let vId: number | null = null;

    const enteredCode = voucher.trim().toUpperCase();
    if (enteredCode && promos.length > 0) {
      const promo = promos.find(p => p.code.toUpperCase() === enteredCode);

      if (promo) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startDate = parseISO(promo.start_date);
        const endDate = parseISO(promo.end_date);
        endDate.setHours(23, 59, 59, 999);

        if (today >= startDate && today <= endDate) {
          discVal = Number(promo.value);
          discType = promo.type as "percent" | "price";
          vId = promo.id;
        }
      }
    }

    setVoucherType(discType);
    setMatchedVoucherId(vId);
    setVoucherDiscount(discVal);

    let finalTotal = subTotal;
    if (discType === "percent") {
      finalTotal = subTotal - (subTotal * (discVal / 100));
    } else if (discType === "price") {
      finalTotal = subTotal - discVal;
    }

    setTotal(Math.max(0, finalTotal));
  }, [dateRange, voucher, room, promos, bookingMode, monthlyNights, roomsQuantity]);

  useEffect(() => {
    if (room && detailsRef.current && pricingRef.current) {
      gsap.fromTo(detailsRef.current.children, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out', delay: 0.2 });
      gsap.fromTo(pricingRef.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out', delay: 0.4 });
    }
  }, [room]);

  const isUnavailable = useMemo(() => {
    if (!room) return false;
    const dPrice = Number(room.daily_price);
    const mPrice = Number(room.monthly_price);
    return (!dPrice || dPrice === 0) && (!mPrice || mPrice === 0);
  }, [room]);

  const isonline = useMemo(() => {
    if (!room) return false;

    const stat = Number(room.stat);

    return !stat || stat === 2;
  }, [room]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateRange) { toast.error("Please select dates"); return; }
    if (!phone.trim()) { toast.error("Phone number is required"); return; }
    if (!fname.trim() || !lname.trim() || !email.trim()) {
      toast.error("Please fill in all guest information"); return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setConfirmModalOpen(true);
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);

    const payload = {
      fname: fname.trim(),
      lname: lname.trim(),
      email: email.trim(),
      phone: phone.trim(),
      check_in: dateRange![0],
      check_out: dateRange![1],
      booking_mode: bookingMode,
      count: bookingMode === 'daily' ? differenceInDays(dateRange![1], dateRange![0]) : monthlyNights,
      room_count: roomsQuantity,
      total: total,
      voucher_id: matchedVoucherId,
      voucher_code: voucher.trim() || null,
      room_id: room!.id,
      room_title: room!.title,
      room_slug: room!.slug,
      submitted_at: new Date().toISOString()
    };

    try {
      const response = await fetch("https://lagranderesidence.com/api/api.php?endpoint=booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Booking request sent successfully! Check your email for confirmation.");
        setConfirmModalOpen(false);
        // Reset form
        setFname('');
        setLname('');
        setEmail('');
        setPhone('');
        setVoucher('');
        setStartDateString('');
        setEndDateString('');
        setRoomsQuantity(1);
        setMonthlyNights(1);
      } else {
        throw new Error(result.message || 'Failed to process booking');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to process booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const images = room?.images ?? [];

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-neutral-400" /></div>;
  if (error || !room) return <div className="min-h-screen flex items-center justify-center text-center"><div><p className="mb-4">{error || 'Room not found'}</p><button onClick={onBack} className="px-4 py-2 bg-neutral-900 text-white rounded-md">Back</button></div></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-neutral-50/50">
      <Toaster position="top-center" />

      <BackButton onClick={() => router.push('/room')} />

      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left Side: Gallery & Info */}
          <div ref={detailsRef} className="lg:col-span-2">
            <div className="relative aspect-[16/9] bg-neutral-100 rounded-2xl overflow-hidden mb-8 group">
              <AnimatePresence mode="wait">
                <motion.div key={currentImageIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
                  <ImageWithFallback src={images[currentImageIndex]} alt={room.title || 'Room'} className="w-full h-full object-cover" />
                </motion.div>
              </AnimatePresence>
              {images.length > 1 && (
                <>
                  <button onClick={() => setCurrentImageIndex((p) => (p - 1 + images.length) % images.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><ChevronLeft className="w-5 h-5" /></button>
                  <button onClick={() => setCurrentImageIndex((p) => (p + 1) % images.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRight className="w-5 h-5" /></button>
                </>
              )}
            </div>

            <h1 className="text-4xl font-bold text-neutral-900 mb-2">{room.title}</h1>
            <p className="text-neutral-500 mb-6">Phase {room.phase} • {room.type}</p>

            <div className="flex gap-8 mb-8 pb-8 border-b border-neutral-200">
              <div className="flex items-center gap-2 text-neutral-700 font-medium"><Users className="w-5 h-5 text-neutral-400" /> {room.pax} Adults</div>
              {room.child! > 0 && <div className="flex items-center gap-2 text-neutral-700 font-medium"><Baby className="w-5 h-5 text-neutral-400" /> {room.child} Children</div>}
            </div>
            <section>
              <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
                About the Room
              </h2>
              <div
                className="blog-content text-justify leading-relaxed text-gray-700"
                dangerouslySetInnerHTML={{ __html: room.description || "" }}
              />

              {/* Amenities */}
<div className="grid sm:grid-cols-2 gap-6 mt-8">
  {/* Daily Rate */}
  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
    <h3 className="font-semibold text-lg flex items-center justify-between">
      <span className="flex items-center gap-2">
        <Icon name="faBed" className="w-5 h-5 text-green-700" />
        Daily Rate
      </span>

      <span className="text-green-700 font-bold text-xl">
        {formatPrice(room.daily_price)}
      </span>
    </h3>

    <p className="text-sm text-gray-500 mt-1 mb-4">
      Inclusive of the following:
    </p>

    <ul className="text-gray-700 text-sm space-y-2">
      <li className="flex items-center gap-2">
        <Icon name="faBroom" className="w-4 h-4 text-green-700" />
        Room Cleaning
      </li>

      <li className="flex items-center gap-2">
        <Icon name="faWater" className="w-4 h-4 text-green-700" />
        Water & Electricity
      </li>

      <li className="flex items-center gap-2">
        <Icon name="faTv" className="w-4 h-4 text-green-700" />
        TV Cable & Internet
      </li>

      <li className="flex items-center gap-2">
        <Icon name="faMugHot" className="w-4 h-4 text-green-700" />
        Coffee Setup
      </li>

      <li className="flex items-center gap-2">
        <Icon name="faBed" className="w-4 h-4 text-green-700" />
        Linen & Towels
      </li>
    </ul>
  </div>

  {/* Monthly Rate */}
  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
    <h3 className="font-semibold text-lg flex items-center justify-between">
      <span className="flex items-center gap-2">
        <Icon name="faBed" className="w-5 h-5 text-green-700" />
        Monthly Rate
      </span>

      <div className="text-right">
        <div className="text-green-700 font-bold text-xl">
          {formatPrice(room.monthly_price)}
        </div>

        <div className="text-xs text-gray-500">
          per 30 nights
        </div>
      </div>
    </h3>

    <p className="text-sm text-gray-500 mt-1 mb-4">
      Monthly inclusions & utilities:
    </p>

    <ul className="text-gray-700 text-sm space-y-2">
      <li className="flex items-center gap-2">
        <Icon name="faPlug" className="w-4 h-4 text-green-700" />
        Electricity – Meter Reading
      </li>

      <li className="flex items-start gap-2">
        <Icon name="faWifi" className="w-4 h-4 mt-1 text-green-700" />

        <span>
          Service Package from ₱7,800 includes cleaning, linen,
          towels, cable & internet, and up to 3 cubic meters of water.
        </span>
      </li>
    </ul>
  </div>
</div>

              {/* Policies */}
              <div className="mt-10 space-y-5 text-gray-700 text-sm">
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Icon name="faDog" className="w-5 h-5 text-green-700" />
                    Pets
                  </h3>
                  <p className="flex items-center gap-2 text-gray-600">
                    <Icon name="faBan" className="w-4 h-4 text-red-500" /> Pets not allowed
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Icon
                      name="faCalendarCheck"
                      className="w-5 h-5 text-green-700"
                    />
                    Booking Policy
                  </h3>
                  <p>
                    One valid ID shall be presented upon check-in. Rates,
                    housekeeping, and laundry services are subject to change
                    without notice. Check-in time is 3:00 PM, check-out before
                    11:00 AM.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Icon
                      name="faReceipt"
                      className="w-5 h-5 text-green-700"
                    />
                    Cancellation Policy
                  </h3>
                  <p>
                    Cancellation within 48 hours prior to arrival will result in
                    forfeiture of the total room charges.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Side: Booking Form or Unavailable Notice */}
          <aside className="lg:col-span-1">
            <div ref={pricingRef} className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm sticky top-24">

              {isUnavailable ? (
                /* --- UNAVAILABLE STATE --- */
                <div className="py-4 space-y-6">
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <X className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">Room Unavailable</h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      This room is currently not available for online booking. Please reach out to our team for the latest availability.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[11px] font-bold uppercase text-neutral-400 tracking-widest border-b border-neutral-50 pb-2">
                      Contact Reservations
                    </h4>

                    <a
                      href="mailto:reservations@lagranderesidence.com"
                      className="flex items-center gap-3 p-4 rounded-xl border border-neutral-100 hover:bg-neutral-50 transition-colors"
                    >
                      <div className="p-2 bg-neutral-100 rounded-lg">
                        <Calendar className="w-4 h-4 text-neutral-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase text-neutral-400">Email Us</p>
                        <p className="text-sm font-semibold text-neutral-900">reservations@lagranderesidence.com</p>
                      </div>
                    </a>

                    <a
                      href="tel:+639223758679"
                      className="flex items-center gap-3 p-4 rounded-xl border border-neutral-100 hover:bg-neutral-50 transition-colors"
                    >
                      <div className="p-2 bg-neutral-100 rounded-lg">
                        <Phone className="w-4 h-4 text-neutral-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase text-neutral-400">Call Us</p>
                        <p className="text-sm font-semibold text-neutral-900">+63 922 375 8679</p>
                      </div>
                    </a>
                  </div>
                </div>
              ) : isonline ? (
                /* --- ONLINE BOOKING PLATFORMS (DYNAMIC) --- */
                <div className="py-4 space-y-6">
                  {/* Header */}
                  <div className="bg-green-50 border border-green-100 rounded-2xl p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Globe className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">Book Online</h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      Check availability and book this room through our trusted partner platforms.
                    </p>
                  </div>

                  {/* Platform Links - Dynamic from booking_platform column */}
                  <div className="space-y-3">
                    <h4 className="text-[11px] font-bold uppercase text-neutral-400 tracking-widest border-b border-neutral-50 pb-2">
                      Available On
                    </h4>

                    {(() => {
                      // STEP 1: Get the raw string from database
                      const rawData = room.booking_platform;

                      // DEBUG: Check browser console (F12) to see this
                      console.log("Raw booking_platform:", rawData);

                      // STEP 2: Parse the string into an array of URLs
                      let platforms: string[] = [];

                      if (rawData && typeof rawData === "string") {
                        const cleaned = rawData.trim();

                        // Case A: JSON array string -> "[\"url1\",\"url2\"]"
                        if (cleaned.startsWith("[") && cleaned.endsWith("]")) {
                          try {
                            platforms = JSON.parse(cleaned);
                          } catch (e) {
                            console.error("JSON parse failed:", e);
                          }
                        }
                        // Case B: Plain comma-separated string -> "url1,url2,url3"
                        else if (cleaned.includes(",")) {
                          platforms = cleaned
                            .split(",")
                            .map(url => url.trim().replace(/^["']|["']$/g, ""))
                            .filter(url => url.length > 0);
                        }
                        // Case C: Single URL string
                        else {
                          platforms = [cleaned.replace(/^["']|["']$/g, "")];
                        }
                      }

                      console.log("Parsed platforms:", platforms);

                      // STEP 3: Match URL to platform info
                      const getPlatformInfo = (url: string) => {
                        const lowerUrl = url.toLowerCase();
                        if (lowerUrl.includes("airbnb")) {
                          return { name: "Airbnb", color: "#FF5A5F", logo: "https://www.vectorlogo.zone/logos/airbnb/airbnb-tile.svg", desc: "Check availability & rates" };
                        }
                        if (lowerUrl.includes("booking.com")) {
                          return { name: "Booking.com", color: "#003580", logo: "https://www.vectorlogo.zone/logos/booking/booking-icon.svg", desc: "Reserve with free cancellation" };
                        }
                        if (lowerUrl.includes("trip.com")) {
                          return { name: "Trip.com", color: "#287DFA", logo: "https://cdn.brandfetch.io/id84Kz4mXP/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B", desc: "Read reviews & book direct" };
                        }
                        if (lowerUrl.includes("agoda")) {
                          return { name: "Agoda", color: "#7B1FA2", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Agoda_Logo_2022.svg/250px-Agoda_Logo_2022.svg.png", desc: "Best price guarantee" };
                        }
                        return { name: "Book Now", color: "#19682e", logo: "https://cdn-icons-png.flaticon.com/512/747/747310.png", desc: "Book your stay" };
                      };

                      // STEP 4: Show error if no platforms found
                      if (platforms.length === 0) {
                        return (
                          <div className="text-center py-8 text-neutral-400 bg-neutral-50 rounded-xl">
                            <p className="text-sm font-medium">No booking platforms available</p>
                            <p className="text-xs mt-1 text-neutral-300">Data: {rawData || "empty"}</p>
                          </div>
                        );
                      }

                      // STEP 5: Render each platform link
                      return platforms.map((url, idx) => {
                        const info = getPlatformInfo(url);
                        
                        return (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 rounded-xl border border-neutral-100 transition-all group"
                            onMouseEnter={(e) => {
                              const target = e.currentTarget;
                              target.style.backgroundColor = `${info.color}0D`; // 5% opacity
                              target.style.borderColor = `${info.color}33`;      // 20% opacity
                            }}
                            onMouseLeave={(e) => {
                              const target = e.currentTarget;
                              target.style.backgroundColor = '';
                              target.style.borderColor = '';
                            }}
                          >
                            {/* Icon container */}
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                              style={{ backgroundColor: `${info.color}15` }} // 10% opacity base
                              onMouseEnter={(e) => {
                                (e.currentTarget as HTMLDivElement).style.backgroundColor = `${info.color}33`; // 20% opacity on hover
                              }}
                              onMouseLeave={(e) => {
                                (e.currentTarget as HTMLDivElement).style.backgroundColor = `${info.color}15`; // back to 10%
                              }}
                            >
                              <img
                                src={info.logo}
                                alt={info.name}
                                className="w-5 h-5 object-contain"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://cdn-icons-png.flaticon.com/512/747/747310.png";
                                }}
                              />
                            </div>

                            {/* Text content */}
                            <div className="flex-1">
                              <p
                                className="text-sm font-bold text-neutral-900 transition-colors"
                                onMouseEnter={(e) => {
                                  (e.currentTarget as HTMLParagraphElement).style.color = info.color;
                                }}
                                onMouseLeave={(e) => {
                                  (e.currentTarget as HTMLParagraphElement).style.color = '';
                                }}
                              >
                                {info.name}
                              </p>
                              <p className="text-xs text-neutral-500">{info.desc}</p>
                            </div>

                            {/* External link icon */}
                            <ExternalLink
                              className="w-4 h-4 text-neutral-400 transition-colors"
                              onMouseEnter={(e) => {
                                (e.currentTarget as SVGElement).style.color = info.color;
                              }}
                              onMouseLeave={(e) => {
                                (e.currentTarget as SVGElement).style.color = '';
                              }}
                            />
                          </a>
                        );
                      });
                    })()}
                    <a
                      href="https://www.swiftbook.io/inst/#home?propertyId=381MfGmNUi0wtjtI1IwyizdjYzMzM=&JDRN=Y"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-xl border border-neutral-100 hover:bg-[#1e3a8a]/5 hover:border-[#1e3a8a]/20 transition-all group"
                    >
                      <div className="w-10 h-10 bg-[#1e3a8a]/10 rounded-xl flex items-center justify-center group-hover:bg-[#1e3a8a]/20 transition-colors">
                        <img
                          src="https://lagranderesidence.com/assets/logo.webp"
                          alt="Airbnb"
                          className="w-5 h-5 object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-neutral-900 group-hover:text-[#1e3a8a] transition-colors">SwiftBook</p>
                        <p className="text-xs text-neutral-500">Check availability & rates</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-[#1e3a8a] transition-colors" />
                    </a>
                  </div>

                  {/* Footer Note */}
                  <div className="bg-neutral-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-neutral-500">
                      Prices may vary across platforms. Compare rates to find the best deal for your stay.
                    </p>
                  </div>
                </div>
              ) : (
                /* --- BOOKING FORM --- */
                <>
                  {/* Pricing Mode Toggle */}
                  <div className="flex p-1 bg-neutral-100 rounded-xl mb-8">
                    <button
                      onClick={() => setBookingMode("daily")}
                      className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${bookingMode === 'daily' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
                    >
                      Daily <span className="block text-xs font-normal opacity-70">₱{formatPrice(room.daily_price)}</span>
                    </button>
                    <button
                      onClick={() => setBookingMode("monthly")}
                      className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${bookingMode === 'monthly' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
                    >
                      Monthly <span className="block text-xs font-normal opacity-70">₱{formatPrice(room.monthly_price)}</span>
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* SECTION: Stay Details */}
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-bold uppercase text-neutral-400 tracking-widest border-b border-neutral-50 pb-2">Stay Details</h4>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 sm:col-span-1">
                          <label className="text-[10px] font-bold uppercase text-neutral-500 ml-1">Check-in</label>
                          <input
                            type="date"
                            value={startDateString}
                            min={getMinDate()}
                            onChange={(e) => setStartDateString(e.target.value)}
                            className="w-full mt-1.5 py-3 px-4 border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all"
                            required
                          />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                          {bookingMode === 'daily' ? (
                            <>
                              <label className="text-[10px] font-bold uppercase text-neutral-500 ml-1">Check-out</label>
                              <input
                                type="date"
                                value={endDateString}
                                min={startDateString}
                                onChange={(e) => setEndDateString(e.target.value)}
                                className="w-full mt-1.5 py-3 px-4 border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all"
                                required
                              />
                            </>
                          ) : (
                            <>
                              <label className="text-[10px] font-bold uppercase text-neutral-500 ml-1">Duration</label>
                              <div className="flex items-center justify-between border border-neutral-200 rounded-xl px-2 py-1.5 mt-1.5 bg-white">
                                <button type="button" onClick={() => setMonthlyNights(m => Math.max(1, m - 1))} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"><Minus className="w-4 h-4" /></button>
                                <span className="font-bold text-sm">{monthlyNights} Mo</span>
                                <button type="button" onClick={() => setMonthlyNights(m => m + 1)} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"><Plus className="w-4 h-4" /></button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase text-neutral-500 ml-1">Number of Rooms</label>
                        <div className="flex items-center justify-between border border-neutral-200 rounded-xl px-2 py-1.5 mt-1.5 bg-white">
                          <button type="button" onClick={() => setRoomsQuantity(q => Math.max(1, q - 1))} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"><Minus className="w-4 h-4" /></button>
                          <span className="font-bold text-sm">{roomsQuantity} {roomsQuantity > 1 ? 'Rooms' : 'Room'}</span>
                          <button type="button" onClick={() => setRoomsQuantity(q => q + 1)} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"><Plus className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>

                    {/* SECTION: Guest Info */}
                    <div className="space-y-4 pt-2">
                      <h4 className="text-[11px] font-bold uppercase text-neutral-400 tracking-widest border-b border-neutral-50 pb-2">Guest Information</h4>

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          name="fname"
                          placeholder="First Name"
                          value={fname}
                          onChange={(e) => setFname(e.target.value)}
                          className="py-3 px-4 border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900"
                          required
                        />
                        <input
                          name="lname"
                          placeholder="Last Name"
                          value={lname}
                          onChange={(e) => setLname(e.target.value)}
                          className="py-3 px-4 border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900"
                          required
                        />
                      </div>

                      <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full py-3 px-4 border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900"
                        required
                      />

                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-500 font-semibold border-r border-neutral-200 pr-3">🇵🇭 +63</span>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="917 123 4567" className="w-full pl-24 py-3 border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-neutral-900" required />
                      </div>

                      <input placeholder="Voucher Code (Optional)" value={voucher} onChange={(e) => setVoucher(e.target.value)} className="w-full py-3 px-4 border-neutral-200 rounded-xl text-sm border-dashed bg-neutral-50/50" />
                    </div>

                    {/* Pricing Summary */}
                    <div className="pt-6 border-t border-neutral-100 space-y-3">
                      <div className="flex justify-between text-sm text-neutral-500">
                        <span>Subtotal</span>
                        <span className="font-medium">
                          ₱{formatPrice(bookingMode === 'daily'
                            ? (Number(room.daily_price) * roomsQuantity * (dateRange ? Math.max(1, differenceInDays(dateRange[1], dateRange[0])) : 0))
                            : (Number(room.monthly_price) * roomsQuantity * monthlyNights)
                          )}
                        </span>
                      </div>

                      {voucherType && (
                        <div className="flex justify-between text-sm text-green-600 font-medium bg-green-50 p-2 rounded-lg">
                          <span>Discount ({voucher.toUpperCase()})</span>
                          <span>-{voucherType === 'percent' ? `${voucherDiscount}%` : `₱${formatPrice(voucherDiscount)}`}</span>
                        </div>
                      )}

                      <div className="flex justify-between items-baseline pt-2">
                        <span className="text-sm font-bold text-[#19682e]">Total Price</span>
                        <span className="text-2xl font-black text-[#19682e]">₱{formatPrice(total)}</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full py-4 bg-[#19682e] text-white rounded-2xl font-bold shadow-xl shadow-neutral-200 hover:bg-[#19682e] transition-all"
                    >
                      Reserve This Room
                    </motion.button>
                  </form>
                </>
              )}
            </div>
          </aside>
        </div>
        
      </div>
              <Footer />

      {/* ============================================
          NEW CONFIRMATION MODAL - REPLACEMENT
          ============================================ */}
      <AnimatePresence>
        {confirmModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-neutral-100 p-6 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#19682e] rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-neutral-900">Review Your Booking</h3>
                    <p className="text-xs text-neutral-500">Please verify all details before confirming</p>
                  </div>
                </div>
                <button
                  onClick={() => setConfirmModalOpen(false)}
                  className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Room Summary Card */}
                <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl p-5 border border-neutral-200">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-xl bg-neutral-200 overflow-hidden flex-shrink-0">
                      {images[0] && (
                        <img src={images[0]} alt={room.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-neutral-900">{room.title}</h4>
                      <p className="text-sm text-neutral-500 mb-2">Phase {room.phase} • {room.type}</p>
                      <div className="flex items-center gap-4 text-xs text-neutral-600">
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {room.pax} Adults</span>
                        {room.child! > 0 && <span className="flex items-center gap-1"><Baby className="w-3 h-3" /> {room.child} Children</span>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarDays className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-bold uppercase text-blue-600">Check-in</span>
                    </div>
                    <p className="font-semibold text-neutral-900">
                      {dateRange ? format(dateRange[0], 'MMMM dd, yyyy') : '-'}
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarDays className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-bold uppercase text-blue-600">Check-out</span>
                    </div>
                    <p className="font-semibold text-neutral-900">
                      {dateRange ? format(dateRange[1], 'MMMM dd, yyyy') : '-'}
                    </p>
                  </div>

                  <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-neutral-600" />
                      <span className="text-xs font-bold uppercase text-neutral-500">Duration</span>
                    </div>
                    <p className="font-semibold text-neutral-900">
                      {bookingMode === 'daily'
                        ? `${differenceInDays(dateRange![1], dateRange![0])} Nights`
                        : `${monthlyNights} Month${monthlyNights > 1 ? 's' : ''}`
                      }
                    </p>
                  </div>

                  <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-4 h-4 text-neutral-600" />
                      <span className="text-xs font-bold uppercase text-neutral-500">Rooms</span>
                    </div>
                    <p className="font-semibold text-neutral-900">{roomsQuantity} Room{roomsQuantity > 1 ? 's' : ''}</p>
                  </div>
                </div>

                {/* Guest Information */}
                <div className="border border-neutral-200 rounded-2xl overflow-hidden">
                  <div className="bg-neutral-50 px-5 py-3 border-b border-neutral-200">
                    <h4 className="text-xs font-bold uppercase text-neutral-500 tracking-wider flex items-center gap-2">
                      <User className="w-4 h-4" /> Guest Information
                    </h4>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-500">Full Name</span>
                      <span className="font-medium text-neutral-900">{fname} {lname}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-500">Email</span>
                      <span className="font-medium text-neutral-900">{email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-500">Phone</span>
                      <span className="font-medium text-neutral-900">+63 {phone}</span>
                    </div>
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div className="border border-neutral-200 rounded-2xl overflow-hidden">
                  <div className="bg-neutral-50 px-5 py-3 border-b border-neutral-200">
                    <h4 className="text-xs font-bold uppercase text-neutral-500 tracking-wider flex items-center gap-2">
                      <Banknote className="w-4 h-4" /> Pricing Details
                    </h4>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-neutral-500">
                        {bookingMode === 'daily' ? 'Daily Rate' : 'Monthly Rate'} × {roomsQuantity} room{roomsQuantity > 1 ? 's' : ''} × {
                          bookingMode === 'daily'
                            ? `${differenceInDays(dateRange![1], dateRange![0])} nights`
                            : `${monthlyNights} months`
                        }
                      </span>
                      <span className="font-medium text-neutral-900">
                        ₱{formatPrice(bookingMode === 'daily'
                          ? (Number(room.daily_price) * roomsQuantity * (dateRange ? Math.max(1, differenceInDays(dateRange[1], dateRange[0])) : 0))
                          : (Number(room.monthly_price) * roomsQuantity * monthlyNights)
                        )}
                      </span>
                    </div>

                    {voucherType && (
                      <div className="flex justify-between items-center text-sm text-green-600">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          Discount ({voucher.toUpperCase()})
                        </span>
                        <span className="font-medium">
                          -{voucherType === 'percent' ? `${voucherDiscount}%` : `₱${formatPrice(voucherDiscount)}`}
                        </span>
                      </div>
                    )}

                    <div className="border-t border-neutral-200 pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-neutral-900">Total Amount</span>
                        <span className="text-2xl font-black text-neutral-900">₱{formatPrice(total)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Notice */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-amber-900 text-sm mb-1">Payment Instructions</h5>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      After confirming, you'll receive an email with payment details.
                      A deposit amount is required to secure your reservation .
                      Our team will contact you within 24 hours.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setConfirmModalOpen(false)}
                    className="flex-1 py-4 px-6 border-2 border-neutral-200 text-neutral-700 rounded-2xl font-bold hover:bg-neutral-50 transition-all"
                  >
                    Edit Details
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    disabled={isSubmitting}
                    className="flex-[2] py-4 px-6 bg-[#19682e] text-white rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Confirm Booking Request
                      </>
                    )}
                  </button>
                </div>
              </div>
              <Footer />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

          </motion.div>
  );
}