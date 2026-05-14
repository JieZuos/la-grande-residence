// app/gallery/page.tsx
"use client";

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { categories, Category } from '@/components/gallery/data/gallery'; // Update this path to where you saved the file
import { GalleryCategory } from '@/components/gallery/GalleryCategory';
import { ImagePanel } from '@/components/gallery/ImagePanel';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ContentHeader } from '@/components/ContentHeader';
import LoadingProvider from '@/components/providers/onload';

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  return (
    <>
    <LoadingProvider>
      <Navbar />

      <div className="min-h-screen bg-white text-neutral-900 overflow-hidden relative flex flex-col font-sans py-12 md:py-24">
        <ContentHeader 
          badge="Gallery"
          title="Experience the Beauty"
          description="Explore our curated collection of high-quality imagery showcasing our work, projects, and visual stories."
        />

        {/* Gallery Categories */}
        <main id="gallery-content" className="pb-20">
          <section
            aria-label="Gallery categories"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2 md:px-6"
          >
            {categories.map((cat) => (
              <GalleryCategory
                key={cat.id}
                category={cat}
                onClick={() => setSelectedCategory(cat)}
              />
            ))}
          </section>
        </main>

        {/* Image Panel Modal */}
        <AnimatePresence>
          {selectedCategory && (
            <ImagePanel
              category={selectedCategory}
              onClose={() => setSelectedCategory(null)}
            />
          )}
        </AnimatePresence>
      </div>

      <Footer />
      </LoadingProvider>
    </>
  );
}