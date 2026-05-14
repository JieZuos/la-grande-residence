import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ImageWithFallback } from '@/components/err/ImageWithFallback';

gsap.registerPlugin(ScrollTrigger);

export function CompanyHistory() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!timelineRef.current) return;
    const items = timelineRef.current.querySelectorAll('.timeline-item');

    gsap.fromTo(
      items,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: timelineRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, []);

  const milestones = [
    {
      "year": "2016",
      "title": "The Beginning",
      "description": "Official commencement of Phase 1 construction."
    },
    {
      "year": "2018",
      "title": "First Occupancy",
      "description": "Welcomed the first residents and the arrival of La Rose Noire."
    },
    {
      "year": "2019",
      "title": "Expansion",
      "description": "Launch of Phase 2, featuring basement and ground parking, residential units from floors 2 to 14, and premium amenities on the 15th floor including an infinity pool, sky lounge, cabanas, tennis court, and function hall."
    },
    {
      "year": "2023",
      "title": "Grand Opening",
      "description": "The official completion and unveiling of the development's major facilities."
    }
  ];

  return (
    <section ref={sectionRef} className="py-12 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <ImageWithFallback
              src="/assets/building.webp"
              alt="Company building"
              className="rounded-2xl w-full h-[300px] md:h-[500px] object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-4 md:space-y-6"
          >
            <h3 className="text-2xl md:text-3xl font-bold">La Grande Residence</h3>
            <p className="text-green-700 font-medium italic">The Place That Connects Us All!</p>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              La Grande Residence is a family-friendly apartment hotel offering fully furnished studio, one-bedroom, and two-bedroom units—perfect for both short getaways and extended stays. Each space is thoughtfully designed for comfort and convenience, featuring kitchen essentials, fresh towels, and quality bed linens to make you feel truly at home.
              <br /> <br />
              Whether you're visiting for leisure, business, or a special occasion, La Grande Residence provides the space, warmth, and personalized service that bring people together. Experience a stay where comfort meets convenience, and every moment feels welcoming and relaxed.
            </p>
          </motion.div>
        </div>

        <div ref={timelineRef} className="relative">
          {/* Timeline Line: Adjusted for mobile (left-aligned) */}
          <div className="absolute left-2 lg:left-1/2 transform lg:-translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-green-700 to-green-800"></div>

          <div className="space-y-8 md:space-y-12">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.year}
                className={`timeline-item relative flex items-center pl-8 lg:pl-0 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
              >
                <div className={`w-full lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12'}`}>
                  <div className="bg-white p-5 md:p-6 rounded-xl shadow-md border border-gray-100">
                    <span className="text-green-600 text-xs md:text-sm font-bold uppercase tracking-wider">
                      {milestone.year}
                    </span>
                    <h4 className="text-xl md:text-2xl mt-1 mb-2 font-bold">{milestone.title}</h4>
                    <p className="text-gray-600 text-sm md:text-base">{milestone.description}</p>
                  </div>
                </div>
                {/* Timeline Dot: Adjusted for mobile (left-aligned) */}
                <div className="absolute left-0 lg:left-1/2 transform lg:-translate-x-1/2 w-4 h-4 bg-green-600 rounded-full border-4 border-white shadow-md"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}