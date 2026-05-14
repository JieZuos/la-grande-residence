"use client";

import { useEffect, useRef } from 'react';
import { BlogItem } from '@/components/blogs/types/blog';
import { BlogCard } from './BlogCard';
import { ContentHeader } from '../ContentHeader';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface BlogListProps {
  blogs: BlogItem[];
}

// REMOVED: onSelectBlog from the arguments below
export function BlogList({ blogs }: BlogListProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!titleRef.current || !subtitleRef.current) return;

    const tl = gsap.timeline();
    
    tl.from(titleRef.current, {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    }).from(subtitleRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.5');

    gsap.to(headerRef.current, {
      scrollTrigger: {
        trigger: headerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      },
      y: 150,
      opacity: 0.3
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen py-12">
      <ContentHeader 
        badge="Our Blogs"
        title="Articles & Updates"
        description="Discover insights, stories, and ideas that inspire innovation and creativity"
      />
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <BlogCard 
              key={blog.id} 
              blog={blog} 
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}