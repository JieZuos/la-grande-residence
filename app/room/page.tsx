// app/room/page.tsx
"use client";

import { RoomsList } from '@/components/room/RoomsList';
import { useRouter } from 'next/navigation';
import LoadingProvider from '@/components/providers/onload';

// app/room/page.tsx

// Add the 'export' keyword here
export interface Room {
  id: number;
  slug?: string;
  title?: string;
  description?: string;
  pax?: number;
  child?: number;
  daily_price?: number | string;
  monthly_price?: number | string;
  phase?: number;
  type?: string;
  images?: string[];
  booking_platform?: string; // JSON string array from DB
  stat?: number;
}

// ... rest of your file
export default function RoomListPage() {
  const router = useRouter();

  const handleRoomClick = (slug: string) => {
    // Navigate to the physical dynamic route
    router.push(`/room/${slug}`);
  };

  return (<>
    <LoadingProvider>
    <div className="min-h-screen bg-white pt-12">
      <RoomsList onRoomClick={handleRoomClick} />
    </div></LoadingProvider></>
  );
}