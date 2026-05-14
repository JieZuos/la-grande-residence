"use client"; // <--- Add this line
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PromoGallery } from '@/components/promo/gallery';
import LoadingProvider from '@/components/providers/onload';

export default function Contact() {
  return (
    <>
      <LoadingProvider>
        <Navbar />
        <PromoGallery />
        <Footer /></LoadingProvider>
    </>
  );
}
