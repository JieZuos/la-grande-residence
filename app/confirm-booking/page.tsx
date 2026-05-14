// app/confirm-booking/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface BookingStatus {
  stat: number;
  bookingDetails?: {
    guestName?: string;
    checkIn?: string;
    checkOut?: string;
  };
}

// Separate component that uses useSearchParams
function ConfirmBookingContent() {
  const searchParams = useSearchParams();
  const bookingNumber = searchParams.get('bookingNumber') || '';
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingData, setBookingData] = useState<BookingStatus | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // If no booking number provided, show the "no booking" state
    if (!bookingNumber) {
      setLoading(false);
      setBookingData(null);
      return;
    }

    const fetchBookingStatus = async () => {
      try {
        const response = await fetch(
          `https://lagranderesidence.com/api/api.php?endpoint=booking-status&ref=${bookingNumber}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch booking status');
        }
        
        const data = await response.json();
        setBookingData(data);
      } catch (err) {
        setError('Unable to retrieve booking information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingStatus();
  }, [bookingNumber]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

const handleUpload = async () => {
  if (!selectedFile || !bookingNumber) return;
  
  setUploading(true);
  const formData = new FormData();
  formData.append('paymentProof', selectedFile);
  formData.append('bookingNumber', bookingNumber);
  
  try {
    const response = await fetch('https://lagranderesidence.com/api/api.php?endpoint=upload-payment', {
      method: 'POST',
      body: formData,
    });
    
    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Upload failed');
    }
    
    alert('Payment proof uploaded successfully!');
    setSelectedFile(null);
    
    // Refresh booking data to show new status
    window.location.reload();
    
  } catch (err: any) {
    alert('Upload failed: ' + (err.message || 'Please try again.'));
  } finally {
    setUploading(false);
  }
};

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-[#19682e]/10 to-stone-100 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#19682e]/20 border-t-[#19682e] rounded-full animate-spin" />
          <p className="text-stone-500 font-medium">Loading your booking...</p>
        </div>
      </div>
    );
  }

  // No booking number provided - show "please book" message
  if (!bookingNumber) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-[#19682e]/10 to-stone-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-3xl shadow-xl shadow-stone-200/50 border border-white/60 p-10 text-center">
          <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-stone-800 mb-3">No Active Booking</h1>
          <p className="text-stone-600 mb-8">
            You don't currently have a booking to confirm. Please make a reservation on our main page first.
          </p>
          
          <a 
            href="/" 
            className="inline-flex items-center justify-center gap-2 w-full bg-[#19682e] text-white font-semibold py-4 rounded-xl shadow-lg shadow-[#19682e]/20 hover:shadow-xl hover:shadow-[#19682e]/30 hover:-translate-y-0.5 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Book Your Stay
          </a>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-[#19682e]/10 to-stone-100 flex items-center justify-center p-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-stone-200/50 p-8 max-w-md w-full text-center border border-white/50">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-stone-800 mb-2">Oops!</h2>
          <p className="text-stone-600">{error}</p>
        </div>
      </div>
    );
  }

  // Status 1: Payment Required
  if (bookingData?.stat === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-[#19682e]/10 to-stone-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#19682e]/10 to-[#19682e]/20 rounded-full mb-6 shadow-lg shadow-[#19682e]/10">
              <svg className="w-10 h-10 text-[#19682e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-stone-800 mb-2">Complete Your Payment</h1>
            <p className="text-stone-500">Booking #{bookingNumber}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl shadow-stone-200/50 border border-white/60 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-[#19682e] to-[#145a26] px-6 py-4">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Bank Transfer Details
              </h2>
            </div>
            
            <div className="p-6">
              <table className="w-full" role="presentation" cellSpacing="0" cellPadding="0">
                <tbody className="divide-y divide-stone-100">
                  <tr className="group">
                    <td className="py-4 pr-4 text-stone-500 font-medium text-sm w-1/3">Bank Name</td>
                    <td className="py-4 text-stone-800 font-semibold">Metropolitan Bank and Trust Company (METROBANK)</td>
                  </tr>
                  <tr className="group">
                    <td className="py-4 pr-4 text-stone-500 font-medium text-sm">Bank Address</td>
                    <td className="py-4 text-stone-800">Clark Freeport Zone</td>
                  </tr>
                  <tr className="group">
                    <td className="py-4 pr-4 text-stone-500 font-medium text-sm">Account Name</td>
                    <td className="py-4 text-stone-800 font-semibold">LGR Condominium Corporation</td>
                  </tr>
                  <tr className="group">
                    <td className="py-4 pr-4 text-stone-500 font-medium text-sm">Account Number</td>
                    <td className="py-4">
                      <span className="inline-flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-lg font-mono text-stone-800 font-semibold tracking-wide">
                        377-7-37701505-0
                        <button 
                          onClick={() => navigator.clipboard.writeText('377-7-37701505-0')}
                          className="text-stone-400 hover:text-[#19682e] transition-colors"
                          title="Copy to clipboard"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </span>
                    </td>
                  </tr>
                  <tr className="group">
                    <td className="py-4 pr-4 text-stone-500 font-medium text-sm">SWIFT / BIC Code</td>
                    <td className="py-4 font-mono text-stone-800 font-semibold tracking-wide">MBTCPHMM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl shadow-stone-200/50 border border-white/60 p-8">
            <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#19682e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload Payment Proof
            </h3>
            
            <div className="relative">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
                id="payment-proof"
              />
              <label
                htmlFor="payment-proof"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-stone-300 rounded-2xl cursor-pointer hover:border-[#19682e] hover:bg-[#19682e]/5 transition-all duration-300 group"
              >
                {selectedFile ? (
                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-[#19682e]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg className="w-6 h-6 text-[#19682e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-stone-800 font-medium">{selectedFile.name}</p>
                    <p className="text-stone-500 text-sm">Click to change file</p>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-[#19682e]/10 transition-colors">
                      <svg className="w-6 h-6 text-stone-400 group-hover:text-[#19682e] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <p className="text-stone-600 font-medium">Click to upload payment proof</p>
                    <p className="text-stone-400 text-sm mt-1">Supports JPG, PNG, PDF</p>
                  </div>
                )}
              </label>
            </div>

            {selectedFile && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full mt-6 bg-[#19682e] text-white font-semibold py-4 rounded-xl shadow-lg shadow-[#19682e]/20 hover:shadow-xl hover:shadow-[#19682e]/30 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Uploading...
                  </span>
                ) : (
                  'Submit Payment Proof'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Status 2: Verifying
  if (bookingData?.stat === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-[#19682e]/10 to-stone-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-3xl shadow-xl shadow-stone-200/50 border border-white/60 p-10 text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-[#19682e]/20 rounded-full animate-ping opacity-20" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-[#19682e]/10 to-[#19682e]/20 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <svg className="w-12 h-12 text-[#19682e] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-stone-800 mb-3">Verifying Your Booking</h1>
          <p className="text-stone-600 mb-6 leading-relaxed">
            Thank you for submitting your payment proof. Our team is currently reviewing your booking 
            <span className="font-semibold text-stone-800"> #{bookingNumber}</span>.
          </p>
          
          <div className="bg-[#19682e]/5 rounded-2xl p-4 border border-[#19682e]/10">
            <p className="text-[#19682e] text-sm font-medium">
              This usually takes 1-2 business hours. We'll notify you once confirmed.
            </p>
          </div>

          <div className="mt-8 flex justify-center gap-2">
            <span className="w-2 h-2 bg-[#19682e] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-[#19682e] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-[#19682e] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  // Status 3: Confirmed
  if (bookingData?.stat === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-[#19682e]/10 to-stone-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-3xl shadow-xl shadow-stone-200/50 border border-white/60 p-10 text-center overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#19682e] via-[#1a7a35] to-[#19682e]" />
          
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-[#19682e]/10 to-[#19682e]/20 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-[#19682e]/10">
              <svg className="w-12 h-12 text-[#19682e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-stone-800 mb-3">Booking Confirmed!</h1>
          <p className="text-stone-600 mb-6 leading-relaxed">
            Wonderful news! Your booking 
            <span className="font-semibold text-stone-800"> #{bookingNumber}</span> has been confirmed. 
            We're looking forward to welcoming you.
          </p>
          
          <div className="bg-[#19682e]/5 rounded-2xl p-6 border border-[#19682e]/10">
            <p className="text-[#19682e] font-medium mb-2">What's Next?</p>
            <ul className="text-[#145a26] text-sm space-y-2 text-left">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Check your email for detailed confirmation
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Present booking ID at check-in
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Enjoy your stay with us!
              </li>
            </ul>
          </div>

          <button className="mt-8 text-stone-500 hover:text-[#19682e] font-medium text-sm transition-colors">
            Download Confirmation PDF
          </button>
        </div>
      </div>
    );
  }

  // Default/no data state
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-[#19682e]/10 to-stone-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-3xl shadow-xl shadow-stone-200/50 border border-white/60 p-10 text-center">
        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-stone-800 mb-3">Booking Not Found</h1>
        <p className="text-stone-600">We couldn't find a booking with that reference number.</p>
      </div>
    </div>
  );
}

// Main export with Suspense boundary
export default function ConfirmBookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-[#19682e]/10 to-stone-100 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#19682e]/20 border-t-[#19682e] rounded-full animate-spin" />
          <p className="text-stone-500 font-medium">Loading...</p>
        </div>
      </div>
    }>
      <ConfirmBookingContent />
    </Suspense>
  );
}