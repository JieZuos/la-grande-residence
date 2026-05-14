import { notFound } from 'next/navigation';
import products from '@/components/products/data/products.json';
import ProductCanvas from '@/components/products/ProductCanvas';
import BackButton from '@/components/BackButton';

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductDetail({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 lg:py-24">
      <div className="mb-10">
        <BackButton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
        
        {/* Left Side: Interactive 3D Viewer with Background */}
        <section className="lg:sticky lg:top-12">
          <div className="relative aspect-square rounded-3xl bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 overflow-hidden shadow-sm group">
            <div className="absolute inset-0 flex items-center justify-center">
               <ProductCanvas url={product.file} scale={product.scale} />
            </div>
            
            {/* Control Hints */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <span className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-medium uppercase tracking-widest text-gray-500 shadow-sm border border-gray-100">
                 360° Interaction Enabled
               </span>
            </div>
          </div>
          <p className="text-center text-[10px] text-gray-400 mt-6 uppercase tracking-[0.2em]">
            Drag to Rotate • Scroll to Zoom
          </p>
        </section>

        {/* Right Side: Product Info */}
        <section className="flex flex-col">
          <div className="space-y-6">
            <header className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 bg-[#19682e] text-white rounded">
                  New Arrival
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                  {product.category || "Premium Collection"}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
                {product.title}
              </h1>
              
              <p className="text-3xl font-medium text-zinc-900">
                ₱{product.price.toLocaleString()}
              </p>
            </header>
            
            <div className="h-px bg-gray-200 w-full" />

            {/* Description Section */}
            <article className="prose prose-zinc prose-lg">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                The Detail
              </h3>
              <div 
                className="text-gray-600 leading-relaxed font-light" 
                dangerouslySetInnerHTML={{ __html: product.details ?? "" }} 
              />
            </article>

            {/* Feature Tags / Specs */}
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                 <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">Material</p>
                 <p className="text-sm font-medium">Premium Grade Paper</p>
              </div>
              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                 <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">Validity</p>
                 <p className="text-sm font-medium">{product.validity}</p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="pt-8 space-y-4">
              <button className="w-full py-5 bg-[#19682e] text-white rounded-2xl font-semibold hover:bg-[#19682e] transition-all hover:shadow-xl hover:-translate-y-1 active:scale-95 text-lg">
                Inquire Now
              </button>
              <p className="text-center text-xs text-gray-400">
                Available for worldwide shipping. Terms apply.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}