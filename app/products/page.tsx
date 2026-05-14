import products from '@/components/products/data/products.json';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ContentHeader } from '@/components/ContentHeader';
import LoadingProvider from '@/components/providers/onload';
import TransitionLink from '@/components/animations/TransitionLink';
import ProductCanvas from '@/components/products/ProductCanvas';

export default function ProductsPage() {
  return (
    <LoadingProvider>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-24 mb-32">
        <ContentHeader 
          badge="Exquisite Collection"
          title="Masterpieces in 3D"
          description="Experience our curated selection of premium goods through interactive 3D visualization. Precision meets artistry."
        />

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
          {products.map((product) => (
            <TransitionLink 
              key={product.id} 
              href={`/products/${product.slug}`} 
              className="group flex flex-col"
            >
              {/* 3D Model Container */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-[#f8f8f8] border border-gray-100 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-zinc-200 group-hover:-translate-y-2">
                
                {/* 3D Canvas Integration */}
                <div className="absolute inset-0 z-10">
                  <ProductCanvas 
                    url={product.file} 
                    scale={product.scale * 0.8} // Slightly smaller for the list view
                  />
                </div>

                {/* Subtle Overlay Hint */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-900 shadow-sm">
                    View Details
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="mt-8 space-y-2 px-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-zinc-900 group-hover:text-[#19682e] transition-colors">
                      {product.title}
                    </h2>
                    <p className="text-xs font-medium uppercase tracking-[0.1em] text-gray-400 mt-1">
                      {product.category || "Series 01"}
                    </p>
                  </div>
                  <p className="text-lg font-light text-zinc-900">
                    ₱{product.price.toLocaleString()}
                  </p>
                </div>
                
                {/* Decorative underline that expands on hover */}
                <div className="h-[1px] w-full bg-gray-100 mt-4 overflow-hidden">
                  <div className="h-full w-0 bg-zinc-900 group-hover:w-full transition-all duration-500 ease-out" />
                </div>
              </div>
            </TransitionLink>
          ))}
        </div>
      </main>
      <Footer />
    </LoadingProvider>
  );
}