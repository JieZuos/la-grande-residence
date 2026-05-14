'use client';

import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function NotFoundPage() {
  return (
    <>
      <Navbar />
      <div className="pt-24 pb-16 min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <p className="text-xl text-neutral-600">Page not found</p>
        </div>
      </div>
      <Footer />
    </>
  );
}

