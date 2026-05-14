"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { JournalGrid } from '@/components/journal/JournalGrid';
import { LoadingScreen } from '@/components/animations/LoadingScreen';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { X, Loader2 } from 'lucide-react';
import LoadingProvider from '@/components/providers/onload';

interface Journal {
  id: number;
  name: string;
  href: string;
  image_url: string;
  timestamp: string;
}

export default function App() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // State for the Iframe Modal (stores the URL)
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const [iframeLoading, setIframeLoading] = useState(true);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (activeUrl) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [activeUrl]);

  useEffect(() => {
    fetch('https://lagranderesidence.com/api/api.php?endpoint=journals')
      .then(res => res.json())
      .then(data => {
        setJournals(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem('hasVisited')) setIsLoading(false);
  }, []);

  const handleLoadingComplete = () => {
    sessionStorage.setItem('hasVisited', 'true');
    setIsLoading(false);
  };

  if (isLoading) return <LoadingScreen onComplete={handleLoadingComplete} />;

  return (
    <>
      <LoadingProvider>
        <Navbar />
        <div className="min-h-screen bg-white">
          {/* No more featured section - just render all journals in the grid */}
          <JournalGrid
            journals={journals}
            onOpenJournal={(url) => { setActiveUrl(url); setIframeLoading(true); }}
          />
        </div>
        <Footer />

        <AnimatePresence>
          {activeUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 md:p-8"
            >
              {/* Iframe Container */}
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative w-full h-full max-w-6xl bg-white rounded-xl overflow-hidden shadow-2xl"
              >
                {/* 🔘 Close button INSIDE frame */}
                <button
                  onClick={() => setActiveUrl(null)}
                  className="absolute top-3 left-3 z-[120] rounded-full bg-black/60 hover:bg-black/80 text-white p-2 backdrop-blur-sm transition-transform duration-300 hover:rotate-90"
                >
                  <X size={28} />
                </button>

                {iframeLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                    <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
                  </div>
                )}

                <iframe
                  src={activeUrl}
                  className="w-full h-full border-none"
                  onLoad={() => setIframeLoading(false)}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </LoadingProvider>
    </>
  );
}