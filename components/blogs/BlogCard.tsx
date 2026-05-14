// src/components/BlogCard.tsx
import { motion } from 'framer-motion';
import { BlogItem } from '@/components/blogs/types/blog';
import { Calendar, ArrowRight } from 'lucide-react';
import TransitionLink from '@/components/animations/TransitionLink';

interface BlogCardProps {
  blog: BlogItem;
  index: number;
}

export function BlogCard({ blog, index }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className="group"
    >
      {/* Use Link instead of onClick for URI-based routing */}
                   <TransitionLink href={`/blogs/${blog.id}`}>

        <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-2xl transition-shadow duration-500">
          <div className="relative h-64 overflow-hidden">
            <motion.img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <div className="p-6">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <Calendar className="w-4 h-4" />
              <time dateTime={blog.created_at}>{formatDate(blog.created_at)}</time>
            </div>

            <h3 className="text-2xl font-semibold mb-3 text-gray-900 group-hover:text-[#19682e] transition-colors duration-300">
              {blog.title}
            </h3>

            <div 
              className="text-gray-600 mb-4 line-clamp-3"
              dangerouslySetInnerHTML={{ 
                __html: blog.body.length > 250 
                  ? blog.body.substring(0, 250) + "..." 
                  : blog.body 
              }} 
            />

            <div className="flex items-center gap-2 text-[#19682e] font-medium">
              <span>Read more</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </TransitionLink>
    </motion.article>
  );
}