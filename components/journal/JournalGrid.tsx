"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ContentHeader } from "../ContentHeader";

interface Journal {
  id: number;
  name: string;
  href: string;
  image_url: string;
  timestamp: string;
}
interface JournalGridProps {
  journals: Journal[];
  onOpenJournal: (url: string) => void; 
}

export function JournalGrid({ journals, onOpenJournal }: JournalGridProps) {
  return (
    <div className="py-20 px-8 md:px-16 bg-white max-w-7xl mx-auto">
                  <ContentHeader 
                      badge="Journals"
                      title="La Grande Insights"
                      description="Stay Updated with the latest news, stories, and insights from La Grande Residence"
                  />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {journals.map((journal, index) => (
          <motion.div
            key={journal.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="cursor-pointer group"
            onClick={() => onOpenJournal(journal.href)}
          >
            <motion.div className="relative overflow-hidden rounded-2xl" whileHover={{ y: -8 }}>
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
                <img src={journal.image_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                    <h3 className="text-white text-lg font-medium">{journal.name}</h3>
                    <div className="flex items-center gap-2 text-white/70 mt-1 text-sm">
                      <span>Read Journal</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}