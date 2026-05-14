// app/amenities/[slug]/page.tsx
import { AmenityDetail } from "@/components/amenities/AmenityDetail";
import { amenitiesData } from "@/components/amenities/data/amenities";

// 1. Tell Next.js which paths to pre-render for 'output: export'
export async function generateStaticParams() {
  return amenitiesData.map((amenity) => ({
    slug: amenity.slug,
  }));
}

// 2. Set this to false to ensure only the pre-rendered slugs work
export const dynamicParams = false;

export default async function AmenityDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  return <AmenityDetail slug={slug} />;
}