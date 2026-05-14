// app/confirm-booking/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  FileText, CheckCircle, XCircle, AlertCircle, Download,
  Loader2, Calendar, User, ShieldCheck,
  Maximize2, X, Send, Clock, AlertTriangle, Ban
} from 'lucide-react';

interface ApiResponse {
  success: boolean;
  stat: number;
  status: { label: string; title: string; description: string; };
  booking: {
    reference_number: string;
    payment_proof: string | null;
    guest: { first_name: string; last_name: string; email: string; phone: number; };
    room: { title: string; };
    dates: { check_in_formatted: string; check_out_formatted: string; duration: string; check_in: string; };
    pricing: { total: number; security_deposit: number; total_formatted: string; security_deposit_formatted: string; };
  };
}

// Component that uses useSearchParams - must be wrapped in Suspense
function ConfirmBookingContent() {
  const searchParams = useSearchParams();
  const bookingNumber = searchParams.get('bookingNumber');

  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [validationAction, setValidationAction] = useState<'approve' | 'reject' | null>(null);
  const [remarks, setRemarks] = useState('');
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const ASSET_BASE_URL = "https://lagranderesidence.com/app.lagranderesidence.com/public";
  const API_URL = "https://lagranderesidence.com/api/api.php";

  const fetchBookingData = async () => {
    try {
      const response = await fetch(`${API_URL}?endpoint=booking-status&ref=${bookingNumber}`);
      const result = await response.json();
      if (result.success) setData(result);
      else setError(result.message || 'Booking not found');
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!bookingNumber) {
      setError('No booking number provided');
      setLoading(false);
      return;
    }
    fetchBookingData();
  }, [bookingNumber]);

  const handleDownload = async (url: string, filename: string) => {
    setDownloading(true);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      window.open(url, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  const confirmValidation = async () => {
    if (validationAction === 'reject' && !remarks.trim()) {
      alert("Please provide remarks for the rejection.");
      return;
    }

    setProcessing(true);
    const newStat = validationAction === 'approve' ? 3 : 4;

    try {
      const response = await fetch(`${API_URL}?endpoint=update-booking-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ref: bookingNumber,
          stat: newStat,
          remarks: remarks
        }),
      });

      const result = await response.json();
      if (result.success) {
        setCompleted(true);
      } else {
        alert(result.message || "Failed to update status");
      }
    } catch (err) {
      alert("Network error occurred.");
    } finally {
      setProcessing(false);
      setShowValidationModal(false);
    }
  };

  const isWithinRefundPeriod = (checkInDate: string) => {
    const checkIn = new Date(checkInDate);
    const today = new Date();
    const diffTime = checkIn.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  if (loading) return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center text-[#19682e]">
      <Loader2 className="w-10 h-10 animate-spin" />
    </div>
  );

  if (error || !data) return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center border border-gray-100 shadow-sm">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    </div>
  );

  const { booking, status, stat } = data;
  const fullProofUrl = booking.payment_proof ? `${ASSET_BASE_URL}/${booking.payment_proof.replace(/\\/g, '/')}` : null;
  const withinRefundPeriod = isWithinRefundPeriod(booking.dates.check_in);

  // Determine if booking is already finalized
  const isApproved = stat === 3;
  const isRejected = stat === 4;
  const isFinalized = isApproved || isRejected;

  if (completed) return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-4 text-center">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full">
        <CheckCircle className={`w-16 h-16 mx-auto mb-4 ${validationAction === 'approve' ? 'text-[#19682e]' : 'text-red-500'}`} />
        <h2 className="text-2xl font-bold text-gray-800">Update Successful</h2>
        <p className="text-gray-600 mt-2">
          Booking {booking.reference_number} is now marked as {validationAction === 'approve' ? 'Approved' : 'Rejected'}.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-[#19682e] text-white rounded-lg font-bold text-sm"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#faf9f6] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#19682e] mb-1">La Grande Residence</h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">Management Review Portal</p>
        </div>

        {/* Finalized Status Banner - Show when already approved or rejected */}
        {isFinalized && (
          <div className={`rounded-2xl p-6 mb-6 border shadow-sm ${isApproved
              ? 'bg-[#19682e]/5 border-[#19682e]/20'
              : 'bg-red-50 border-red-200'
            }`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isApproved ? 'bg-[#19682e]/10 text-[#19682e]' : 'bg-red-100 text-red-500'
                }`}>
                {isApproved ? <CheckCircle className="w-6 h-6" /> : <Ban className="w-6 h-6" />}
              </div>
              <div>
                <h3 className={`text-lg font-bold ${isApproved ? 'text-[#19682e]' : 'text-red-700'}`}>
                  {isApproved ? 'Booking Confirmed' : 'Booking Rejected'}
                </h3>
                <p className={`text-sm ${isApproved ? 'text-[#19682e]/70' : 'text-red-600'}`}>
                  {isApproved
                    ? 'This booking has been approved and confirmed. No further action is required.'
                    : 'This booking has been rejected. No further action is required.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="bg-[#19682e] px-6 py-4 flex items-center justify-between">
            <span className="text-white font-bold text-sm">{booking.reference_number}</span>
            <span className="bg-white/20 text-white text-[10px] px-2 py-1 rounded uppercase font-black">{status.label}</span>
          </div>

          <div className="p-6 grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <User className="w-3.5 h-3.5" /> Guest Information
              </h3>
              <div>
                <p className="font-bold text-gray-800 text-lg capitalize">{booking.guest.first_name} {booking.guest.last_name}</p>
                <p className="text-sm text-gray-500">{booking.guest.email}</p>
                <p className="text-sm text-gray-500">+{booking.guest.phone}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" /> Stay Details
              </h3>
              <div>
                <p className="font-bold text-gray-800">{booking.room.title}</p>
                <p className="text-sm text-gray-500">{booking.dates.check_in_formatted} - {booking.dates.check_out_formatted}</p>
                <p className="text-xs font-bold text-[#19682e] mt-1">{booking.dates.duration}</p>
              </div>
            </div>

            <div className="md:col-span-2 bg-[#faf9f6] p-5 rounded-xl border border-gray-100 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Booking Total</p>
                <p className="text-2xl font-black text-[#19682e]">₱{booking.pricing.total_formatted}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center justify-end gap-1">
                  <ShieldCheck className="w-3 h-3" /> Security Deposit
                </p>
                <p className="text-lg font-bold text-gray-700">₱{booking.pricing.security_deposit_formatted}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Refund Policy Notice - Only show if not finalized */}
        {!isFinalized && (
          <div className={`rounded-xl p-4 mb-6 border ${withinRefundPeriod ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
            <div className="flex items-start gap-3">
              <AlertTriangle className={`w-5 h-5 mt-0.5 ${withinRefundPeriod ? 'text-red-500' : 'text-amber-600'}`} />
              <div>
                <h4 className={`text-sm font-bold ${withinRefundPeriod ? 'text-red-700' : 'text-amber-800'}`}>
                  Refund Policy Reminder
                </h4>
                <p className={`text-xs mt-1 ${withinRefundPeriod ? 'text-red-600' : 'text-amber-700'}`}>
                  {withinRefundPeriod
                    ? "⚠️ CRITICAL: Check-in is within 3 days. If rejecting this booking, the security deposit is already forfeited as per policy. Refunds are only allowed 3+ days before check-in."
                    : "Refunds are only allowed if cancelled 3 days before the actual booking date. Within the 3-day period, the security deposit is forfeited."
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Proof Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gray-800 px-6 py-3 text-white text-xs font-bold uppercase flex items-center gap-2">
            <FileText className="w-4 h-4 opacity-50" /> Payment Receipt
          </div>
          <div className="p-6">
            {fullProofUrl ? (
              <div className="bg-[#faf9f6] border border-gray-100 rounded-xl p-8 text-center">
                <FileText className="w-12 h-12 text-[#19682e] mx-auto mb-4 opacity-20" />
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setShowImageModal(true)}
                    className="flex items-center gap-2 px-8 py-2.5 bg-[#19682e] text-white rounded-lg text-sm font-bold shadow-sm"
                  >
                    <Maximize2 className="w-4 h-4" /> View Proof
                  </button>
                  <button
                    onClick={() => handleDownload(fullProofUrl, `LGR-${booking.reference_number}.png`)}
                    disabled={downloading}
                    className="flex items-center gap-2 px-8 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-bold disabled:opacity-50"
                  >
                    {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    Download
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center border-2 border-dashed border-gray-100 rounded-xl text-gray-400 italic">
                No proof uploaded.
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons - Only show if not finalized */}
        {!isFinalized && (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => { setValidationAction('reject'); setShowValidationModal(true); }}
              className="py-4 border border-red-100 text-red-500 rounded-xl hover:bg-red-50 font-bold text-xs uppercase tracking-widest transition-all"
            >
              Reject Booking
            </button>
            <button
              onClick={() => { setValidationAction('approve'); setShowValidationModal(true); }}
              className="py-4 bg-[#19682e] text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-md hover:opacity-95 transition-all"
            >
              Approve Booking
            </button>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {showImageModal && fullProofUrl && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 z-[60] animate-in fade-in duration-200">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-6 right-6 p-2 bg-white/10 text-white rounded-full hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={fullProofUrl}
            alt="Payment Proof"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
          />
        </div>
      )}

      {/* Status Update Modal */}
      {showValidationModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-150">
            <div className="text-center mb-6">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${validationAction === 'approve' ? 'bg-[#19682e]/10 text-[#19682e]' : 'bg-red-50 text-red-500'}`}>
                {validationAction === 'approve' ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
              </div>
              <h3 className="text-lg font-bold text-gray-800 capitalize">{validationAction} Booking?</h3>
              <p className="text-xs text-gray-500 mt-1">This will notify the guest immediately.</p>
            </div>

            {validationAction === 'reject' && (
              <div className="mb-4 animate-in slide-in-from-top-2">
                <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                    <p className="text-xs text-red-700">
                      <strong>Policy Notice:</strong> {withinRefundPeriod
                        ? "Check-in is within 3 days. Security deposit will be forfeited automatically."
                        : "Security deposit refund will be processed according to cancellation policy."
                      }
                    </p>
                  </div>
                </div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">
                  Reason for Rejection
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Invalid receipt, amount mismatch..."
                  className="w-full bg-[#faf9f6] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 h-24 resize-none"
                />
              </div>
            )}

            {validationAction === 'approve' && (
              <div className="mb-4 bg-[#19682e]/5 border border-[#19682e]/10 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-[#19682e] mt-0.5" />
                  <p className="text-xs text-[#19682e]">
                    <strong>Approval Notice:</strong> Guest will receive confirmation email. Security deposit is held until check-out.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setShowValidationModal(false); setRemarks(''); }}
                className="py-2.5 text-gray-400 font-bold text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmValidation}
                disabled={processing || (validationAction === 'reject' && !remarks.trim())}
                className={`py-2.5 rounded-lg text-white font-bold text-sm flex items-center justify-center gap-2 ${validationAction === 'approve' ? 'bg-[#19682e]' : 'bg-red-500'} disabled:opacity-50`}
              >
                {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Loading fallback for Suspense
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center text-[#19682e]">
      <Loader2 className="w-10 h-10 animate-spin" />
    </div>
  );
}

// Main page component with Suspense boundary
export default function ConfirmBookingPage() {
  return (

    <Suspense fallback={<LoadingFallback />}>
      <ConfirmBookingContent />
    </Suspense>
  );
}