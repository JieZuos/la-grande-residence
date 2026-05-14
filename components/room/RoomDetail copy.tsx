"use client";
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Room } from '@/app/room/page';
import {
  ArrowLeft, Users, Baby, Loader2, ChevronLeft, ChevronRight,
  Minus, Plus, Calendar, CreditCard, CheckCircle2, Phone, X, Utensils, Bed, Zap, Wifi, CalendarCheck, Receipt,
  Dog, Ban, Search, Home, Clock, Coffee, Droplet,
  AirVent, Tv, Lightbulb, ShowerHead
} from 'lucide-react';
import { ImageWithFallback } from '@/components/err/ImageWithFallback';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { format, addDays, isAfter, differenceInDays, parseISO } from 'date-fns';
import toast, { Toaster } from 'react-hot-toast';
import { BackButton } from '@/components/providers/backbutton'; // Adjust path as needed
import { useRouter } from 'next/navigation';
// Using Lucide icons as a substitute

// Define the shape of a single icon mapping for easy use
interface IconMap {
  icon: React.ElementType;
  className: string;
}

// Map the old FontAwesome icons to new Lucide icons
const Icon = ({ name, className }: { name: keyof typeof IconMapping; className?: string }) => {
  const Component = IconMapping[name]?.icon || X;
  const defaultClass = IconMapping[name]?.className || 'text-gray-500';
  return <Component className={className || defaultClass} />;
};

const IconMapping = {
  faBroom: { icon: Utensils, className: 'text-green-700' }, // Substitute for cleaning
  faWater: { icon: Droplet, className: 'text-green-700' }, // Water
  faTv: { icon: Tv, className: 'text-green-700' }, // TV Cable
  faMugHot: { icon: Coffee, className: 'text-green-700' }, // Coffee
  faBed: { icon: Bed, className: 'text-green-700' }, // Bed/Inclusive
  faPlug: { icon: Lightbulb, className: 'text-green-700' }, // Electricity/Meter
  faWifi: { icon: Wifi, className: 'text-green-700' }, // WiFi
  faDog: { icon: Dog, className: 'text-green-700' }, // Pets
  faBan: { icon: Ban, className: 'text-red-500' }, // Ban
  faCalendarCheck: { icon: CalendarCheck, className: 'text-green-700' }, // Calendar
  faReceipt: { icon: Receipt, className: 'text-green-700' }, // Receipt/Policy
  faXmark: { icon: X, className: 'text-white' }, // Close button
  faPhone: { icon: Phone, className: 'text-gray-400' }, // Phone
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
  // --- Core State ---
  const router = useRouter();

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // --- Booking States (from RoomLiveUpdater) ---
  const [bookingMode, setBookingMode] = useState<BookingMode>("daily");
  const [startDateString, setStartDateString] = useState<string>('');
  const [endDateString, setEndDateString] = useState<string>('');
  const [monthlyNights, setMonthlyNights] = useState(1);
  const [roomsQuantity, setRoomsQuantity] = useState(1);
  const [voucher, setVoucher] = useState("");
  const [phone, setPhone] = useState<string>('');
  const [promos, setPromos] = useState<Promo[]>([]);

  // Calculation States
  const [total, setTotal] = useState(0);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [voucherType, setVoucherType] = useState<"percent" | "price" | null>(null);
  const [matchedVoucherId, setMatchedVoucherId] = useState<number | null>(null);

  // Modal States
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [formPayload, setFormPayload] = useState<any>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  const detailsRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);

  // --- Helpers ---
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

  // --- Data Fetching ---
  // --- Data Fetching ---
  const fetchRoomDetail = useCallback(async () => {
    try {
      setLoading(true);

      // 1. First check the API for live data
      const res = await fetch(`https://lagranderesidence.com/api/api.php?endpoint=rooms`);
      const allRooms: Room[] = await res.json();

      // 2. Find the specific room by slug or ID
      const foundRoom = allRooms.find(r => r.slug === slug || r.id.toString() === slug);

      if (foundRoom) {
        setRoom(foundRoom);
      } else {
        // Fallback to mock data if API fails or room isn't found

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

  // --- Booking Logic Effects ---
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

    // 1. Base Prices
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

    // 2. Logic fix for Voucher validation
    const enteredCode = voucher.trim().toUpperCase();
    if (enteredCode && promos.length > 0) {
      const promo = promos.find(p => p.code.toUpperCase() === enteredCode);

      if (promo) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison

        const startDate = parseISO(promo.start_date);
        const endDate = parseISO(promo.end_date);
        endDate.setHours(23, 59, 59, 999); // Allow use until the end of the last day

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

    // 3. Final Calculation
    let finalTotal = subTotal;
    if (discType === "percent") {
      finalTotal = subTotal - (subTotal * (discVal / 100));
    } else if (discType === "price") {
      finalTotal = subTotal - discVal;
    }

    setTotal(Math.max(0, finalTotal));
  }, [dateRange, voucher, room, promos, bookingMode, monthlyNights, roomsQuantity]);

  // --- Animation ---
  useEffect(() => {
    if (room && detailsRef.current && pricingRef.current) {
      gsap.fromTo(detailsRef.current.children, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out', delay: 0.2 });
      gsap.fromTo(pricingRef.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out', delay: 0.4 });
    }
  }, [room]);
  // Place this inside RoomDetail component after room state is confirmed
  const isUnavailable = useMemo(() => {
    if (!room) return false;
    const dPrice = Number(room.daily_price);
    const mPrice = Number(room.monthly_price);
    return (!dPrice || dPrice === 0) && (!mPrice || mPrice === 0);
  }, [room]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateRange) { toast.error("Please select dates"); return; }
    if (!phone.trim()) { toast.error("Phone number is required"); return; }

    const form = e.target as HTMLFormElement;
    const fname = (form.querySelector('input[name="fname"]') as HTMLInputElement).value;
    const lname = (form.querySelector('input[name="lname"]') as HTMLInputElement).value;
    const email = (form.querySelector('input[type="email"]') as HTMLInputElement).value;

    setFormPayload({
      fname, lname, email, phone,
      check_in: dateRange[0],
      check_out: dateRange[1],
      booking_mode: bookingMode,
      count: bookingMode === 'daily' ? differenceInDays(dateRange[1], dateRange[0]) : monthlyNights,
      room_count: roomsQuantity,
      total: total,
      voucher_id: matchedVoucherId,
    });
    setConfirmModalOpen(true);
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
                <div>
                  <h3 className="font-semibold mb-2 text-lg flex items-center gap-2">
                    <Icon name="faBed" className="w-5 h-5 text-green-700" />
                    Inclusive (Daily Rate)
                  </h3>
                  <ul className="text-gray-700 text-sm space-y-2">
                    <li className="flex items-center gap-2">
                      <Icon name="faBroom" className="w-4 h-4 text-green-700" /> Room Cleaning
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="faWater" className="w-4 h-4 text-green-700" /> Water & Electricity
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="faTv" className="w-4 h-4 text-green-700" /> TV Cable & Internet
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="faMugHot" className="w-4 h-4 text-green-700" /> Coffee Setup
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="faBed" className="w-4 h-4 text-green-700" /> Linen & Towels
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 text-lg flex items-center gap-2">
                    <Icon name="faBed" className="w-5 h-5 text-green-700" />
                    Monthly <span className="text-sm text-gray-700">(per 30 nights)</span>
                  </h3>
                  <ul className="text-gray-700 text-sm space-y-2">
                    <li className="flex items-center gap-2">
                      <Icon name="faPlug" className="w-4 h-4 text-green-700" /> Electricity – Meter
                      reading
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="faWifi" className="w-4 h-4 mt-1 text-green-700" />
                      <span>
                        Service Package from ₱7800 includes cleaning, linen,
                        towels, cable & internet, and up to 3 cubic meters water.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Policies (Content Omitted) */}
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

          {/* Right Side: Booking Form */}
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
              ) : (
                /* --- EXISTING BOOKING FORM --- */
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
                        <input name="fname" placeholder="First Name" className="py-3 px-4 border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900" required />
                        <input name="lname" placeholder="Last Name" className="py-3 px-4 border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900" required />
                      </div>

                      <input type="email" placeholder="Email Address" className="w-full py-3 px-4 border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900" required />

                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-500 font-semibold border-r border-neutral-200 pr-3">🇵🇭 +63</span>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="917 123 4567" className="w-full pl-24 py-3 border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-neutral-900" required />
                      </div>

                      <input placeholder="Voucher Code (Optional)" value={voucher} onChange={(e) => setVoucher(e.target.value)} className="w-full py-3 px-4 border-neutral-200 rounded-xl text-sm border-dashed bg-neutral-50/50" />
                    </div>

                    {/* Pricing Summary */}
                    {/* Pricing Summary */}
                    <div className="pt-6 border-t border-neutral-100 space-y-3">
                      <div className="flex justify-between text-sm text-neutral-500">
                        <span>Subtotal</span>
                        {/* Use logic to show the subtotal before discount */}
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
                        <span className="text-sm font-bold text-neutral-900">Total Price</span>
                        <span className="text-2xl font-black text-neutral-900">₱{formatPrice(total)}</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full py-4 bg-[#19682e] text-white rounded-2xl font-bold shadow-xl shadow-[#19682e] hover:bg-[#19682e] transition-all"
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

      {/* Confirmation & Payment Modal */}
      <AnimatePresence>
        {confirmModalOpen && formPayload && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
              <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
                <h3 className="font-black text-xl text-neutral-900">Confirm Booking</h3>
                <button onClick={() => setConfirmModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors"><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-neutral-50 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-neutral-500">Stay Duration:</span><span className="font-bold text-neutral-900">{formPayload.count} {bookingMode === 'daily' ? 'Nights' : 'Months'}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-neutral-500">Check-in:</span><span className="font-bold text-neutral-900">{format(formPayload.check_in, 'MMMM dd, yyyy')}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-neutral-500">Room Count:</span><span className="font-bold text-neutral-900">{formPayload.room_count} Room(s)</span></div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-neutral-400 mb-3 block tracking-widest">Select Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setSelectedPayment("gcash")} className={`p-4 border-2 rounded-2xl flex flex-col items-center gap-3 transition-all ${selectedPayment === 'gcash' ? 'border-blue-500 bg-blue-50/50' : 'border-neutral-100 hover:border-neutral-200'}`}>
                      <div className="h-8 w-12 bg-contain bg-no-center bg-center" style={{ backgroundImage: 'url(https://images.seeklogo.com/logo-png/52/2/gcash-logo-png_seeklogo-522261.png)' }} />
                      <span className="text-xs font-bold text-neutral-700">GCash</span>
                    </button>
                    <button onClick={() => setSelectedPayment("metrobank")} className={`p-4 border-2 rounded-2xl flex flex-col items-center gap-3 transition-all ${selectedPayment === 'metrobank' ? 'border-blue-900 bg-blue-50/50' : 'border-neutral-100 hover:border-neutral-200'}`}>
                      <div className="h-8 w-12 bg-contain bg-no-center bg-center" style={{ backgroundImage: 'url(https://companieslogo.com/img/orig/MTPOY-1a51b472.png?t=1720244493)' }} />
                      <span className="text-xs font-bold text-neutral-700">Metrobank</span>
                    </button>
                  </div>
                </div>

                <div className="bg-neutral-900 rounded-2xl p-5 text-white shadow-xl shadow-neutral-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium opacity-70">Final Amount</span>
                    <span className="text-2xl font-black">₱{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  disabled={!selectedPayment}
                  onClick={() => {
                    const submitPromise = fetch("https://lagranderesidence.com/api/api.php?endpoint=booking", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ ...formPayload, payment_method: selectedPayment, room_id: room.id })
                    }).then(res => res.json());

                    toast.promise(submitPromise, {
                      loading: 'Processing booking...',
                      success: 'Booking Request Sent!',
                      error: 'Failed to process booking.'
                    });
                    setConfirmModalOpen(false);
                  }}
                  className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-neutral-200 disabled:text-neutral-400 text-white rounded-2xl font-black text-lg transition-all shadow-lg shadow-green-100"
                >
                  {selectedPayment ? `Pay with ${selectedPayment.toUpperCase()}` : 'Select Payment'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}