// app/room/[slug]/RoomDetailWrapper.tsx
"use client";

import { RoomDetail } from '@/components/room/RoomDetail';
import { useRouter } from 'next/navigation';
import LoadingProvider from '@/components/providers/onload';

export function RoomDetailWrapper({ slug }: { slug: string }) {
  const router = useRouter();

  return (<>
    <LoadingProvider>

    <div className="min-h-screen bg-white">
      <RoomDetail 
        slug={slug} 
        onBack={() => router.push('/room')} 
      />
    </div></LoadingProvider>
  </>
  );
}