// src/app/page.tsx
import { BlogList } from '@/components/blogs/BlogList';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import LoadingProvider from '@/components/providers/onload';

const API_BASE = "https://lagranderesidence.com/api/api.php";

export default async function Page() {
    // We use Next.js built-in fetch cache. 
    // revalidate: 3600 means it will only hit your PHP API once per hour.
    const response = await fetch(`${API_BASE}?endpoint=blogs`, {
        next: { revalidate: 3600 } 
    });

    if (!response.ok) {
        // Handle potential server errors gracefully
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Failed to load blogs. Please try again later.</p>
            </div>
        );
    }

    const blogs = await response.json();

    return (
        <LoadingProvider>
            <div className="min-h-screen bg-white">
                <Navbar />
                {/* The 'blogs' data now contains the image URLs. 
                    Since the server fetches this, there is no CORS error for the JSON.
                    The browser will then render the images via standard <img> tags.
                */}
                <BlogList blogs={blogs} />
                <Footer />
            </div>
        </LoadingProvider>
    );
}