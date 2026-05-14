// app/room/[slug]/page.tsx
import { RoomDetailWrapper } from './RoomDetailWrapper';

export async function generateStaticParams() {
  try {
    const res = await fetch('https://lagranderesidence.com/api/api.php?endpoint=rooms');
    const rooms = await res.json();

    // Ensure we handle different possible API response structures
    const roomsArray = Array.isArray(rooms) ? rooms : (rooms.rooms || rooms.data || []);

    return roomsArray.map((room: any) => ({
      slug: room.slug || room.id.toString(),
    }));
  } catch (error) {
    console.error("Failed to generate static params:", error);
    return [];
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  // In Next.js 15, params is a Promise. We await it to be safe.
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  return <RoomDetailWrapper slug={slug} />;
}