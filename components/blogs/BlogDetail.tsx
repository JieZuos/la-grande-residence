// app/blogs/[id]/page.tsx
"use client";

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BlogItem } from './types/blog';
import { Calendar, Clock } from 'lucide-react';
import { BackButton } from '@/components/providers/backbutton'; // Adjust path as needed
import { useRouter } from 'next/navigation';

gsap.registerPlugin(ScrollTrigger);

interface BlogDetailProps {
  blog: BlogItem;
}

export function BlogDetail({ blog }: BlogDetailProps) {
      const router = useRouter();

  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imageRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(imageRef.current, {
        scrollTrigger: {
          trigger: imageRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        },
        y: 200,
        scale: 1.2
      });

      const paragraphs = contentRef.current?.querySelectorAll('p');
      if (paragraphs && paragraphs.length > 0) {
        gsap.from(paragraphs, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1
        });
      }
    });

    return () => ctx.revert();
  }, [blog]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });
  };

  const calculateReadTime = (text: string) => {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    return `${Math.ceil(wordCount / wordsPerMinute)} min read`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white"
    >
      {/* REUSABLE COMPONENT: 
         If you want to customize the click, do: 
         <BackButton onClick={() => console.log('Custom Action!')} /> 
      */}
      <BackButton onClick={() => router.push('/blogs')} />

      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <div ref={imageRef} className="absolute inset-0">
          <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              className="flex flex-wrap items-center gap-4 md:gap-6 text-white/90 mb-4 md:mb-6"
            >
              <div className="flex items-center gap-2 text-sm md:text-base">
                <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                <time>{formatDate(blog.created_at)}</time>
              </div>
              <div className="flex items-center gap-2 text-sm md:text-base">
                <Clock className="w-4 h-4 md:w-5 md:h-5" />
                <span>{calculateReadTime(blog.body)}</span>
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              className="text-3xl sm:text-4xl md:text-6xl font-bold text-white leading-tight"
            >
              {blog.title}
            </motion.h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-10 md:py-16">
        <motion.div
          ref={contentRef}
          className="prose prose-sm sm:prose-base md:prose-xl max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-img:rounded-2xl"
          dangerouslySetInnerHTML={{ __html: blog.body }}
        />
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-12 md:mt-16 flex justify-center">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full" />
        </motion.div>
      </div>
    </motion.div>
  );
}