'use client';

import { CompanyHistory } from '@/components/about/CompanyHistory';
import { ManagementTeam } from '@/components/about/ManagementTeam';
import { ContactAndCareers } from '@/components/about/ContactAndCareers';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ContentHeader } from '@/components/ContentHeader';
import LoadingProvider from '@/components/providers/onload';

export default function AboutUsPage() {
  return (
    <>
      <LoadingProvider>
        <div className="min-h-screen bg-white text-neutral-900 overflow-hidden relative flex flex-col font-sans py-12 md:py-24">
          <Navbar />

          <ContentHeader
            badge=""
            title="About Us"
            description=""
          />
          <CompanyHistory />
          <ManagementTeam />
          <ContactAndCareers />
          <Footer />

        </div></LoadingProvider></>
  );
}
