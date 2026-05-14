// src/app/blogs/[id]/page.tsx
import { BlogDetail } from '@/components/blogs/BlogDetail';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { notFound } from 'next/navigation';
import { BlogItem } from '@/components/blogs/types/blog';
import LoadingProvider from '@/components/providers/onload';

const API_BASE = "https://lagranderesidence.com/api/api.php";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { id } = await params;

  // 1. Fetch all blogs (or a single blog if your API supports ?endpoint=blog&id=X)
  const response = await fetch(`${API_BASE}?endpoint=blogs`, {
    next: { revalidate: 3600 } // Optional: Cache for 1 hour
  });
  
  if (!response.ok) return notFound();

  const blogs: BlogItem[] = await response.json();
  
  // 2. Find the specific blog by ID
  const blog = blogs.find((b) => b.id.toString() === id);

  // 3. If no blog is found, trigger Next.js 404 page
  if (!blog) {
    notFound();
  }

  return (<>
  <LoadingProvider>
    <div className="min-h-screen">
      <Navbar />
      <main>
        <BlogDetail blog={blog} />
      </main>
      <Footer />
    </div></LoadingProvider></>
  );
}

// Optional: Generates static paths for better performance (SSG)
export async function generateStaticParams() {
  const response = await fetch(`${API_BASE}?endpoint=blogs`);
  const blogs: BlogItem[] = await response.json();

  return blogs.map((blog) => ({
    id: blog.id.toString(),
  }));
}