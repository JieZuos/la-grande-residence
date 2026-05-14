'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ContentHeader } from '@/components/ContentHeader';
import { Bus, Clock, Phone } from 'lucide-react';

type TabData = {
  travelTime: string;
  mapSrc: string;
};

const tabsData: Record<string, TabData> = {
  'SM Clark': {
    travelTime: '10–15 minutes',
    mapSrc: "https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d7701.712409982439!2d120.56675914551518!3d15.16623969674559!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x3396ed80b6c4427d%3A0x173307b53e8d34b1!2sSM%20Clark%2C%20Angeles%2C%20Pampanga!3m2!1d15.1699129!2d120.5792407!4m5!1s0x3396f34cc2fc9479%3A0xaccbe6fd82b9dbf3!2sLa%20Grande%20Residence%2C%20Plaridel%20Subdivision%201%2C%2046B%20Sarmiento%20St%2C%20Malaba%C3%B1as%2C%20Angeles%2C%202009%20Pampanga!3m2!1d15.1626716!2d120.57416119999999!5e0!3m2!1sen!2sph!4v1776239922710!5m2!1sen!2sph",
  },
  'Clark Airport': {
    travelTime: '5–10 minutes',
    mapSrc: "https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d30802.307988148063!2d120.55190702370182!3d15.197370228160363!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x3396ed13cba67567%3A0xd15c3712fc2ca42b!2sClark%20International%20Airport%20Arrival%2C%20Balibago%2C%20Angeles%2C%20Pampanga!3m2!1d15.1971384!2d120.5588403!4m5!1s0x3396f34cc2fc9479%3A0xaccbe6fd82b9dbf3!2sLa%20Grande%20Residence%2C%20Plaridel%20Subdivision%201%2C%2046B%20Sarmiento%20St%2C%20Malaba%C3%B1as%2C%20Angeles%2C%202009%20Pampanga!3m2!1d15.1626716!2d120.57416119999999!5e0!3m2!1sen!2sph!4v1776314438367!5m2!1sen!2sph",
  },
  'Manila Airport': {
    travelTime: '2–3 hours',
    mapSrc: "https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d61618.28900109617!2d120.61020058691454!3d15.150485931663138!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x3397cec5d2bb4d77%3A0x8a24fa628a114411!2sNinoy%20Aquino%20International%20Airport%2C%20Pasay%20City%2C%201300%20Metro%20Manila!3m2!1d14.512273899999999!2d121.01650799999999!4m5!1s0x3396f34cc2fc9479%3A0xaccbe6fd82b9dbf3!2sLa%20Grande%20Residence%2C%20Plaridel%20Subdivision%201%2C%2046B%20Sarmiento%20St%2C%20Malaba%C3%B1as%2C%20Angeles%2C%202009%20Pampanga!3m2!1d15.1626716!2d120.57416119999999!5e0!3m2!1sen!2sph!4v1776245043958!5m2!1sen!2sph",
  },
  'SM San Fernando': {
    travelTime: '1.5-2 hours total',
    mapSrc: "https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d61630.79174074076!2d120.59727847358332!3d15.107490138766863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x3396f743778649db%3A0xd2c03478cd8d3ad6!2sS.M.%20San%20Fernando%20Gate%2C%20San%20Jose%2C%20San%20Fernando%2C%20Pampanga!3m2!1d15.0515549!2d120.6978058!4m5!1s0x3396f34cc2fc9479%3A0xaccbe6fd82b9dbf3!2sLa%20Grande%20Residence%2C%20Plaridel%20Subdivision%201%2C%2046B%20Sarmiento%20St%2C%20Malaba%C3%B1as%2C%20Angeles%2C%202009%20Pampanga!3m2!1d15.1626716!2d120.57416119999999!5e0!3m2!1sen!2sph!4v1776321911409!5m2!1sen!2sph",
  },
  'Commute': {
    travelTime: 'Depends on user location',
    mapSrc: "https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d3850.874027779301!2d120.5767928260523!3d15.16526136300107!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e2!4m5!1s0x3396f27ed3afbe8d%3A0x6ae26c077df1397!2sSM%20City%20Clark%2C%20Manuel%20A.%20Roxas%20Hwy%2C%20Clark%20Freeport%2C%20Angeles%2C%20Pampanga!3m2!1d15.167270799999999!2d120.58011339999999!4m5!1s0x3396f34cc2fc9479%3A0xaccbe6fd82b9dbf3!2sLa%20Grande%20Residence%2C%20Plaridel%20Subdivision%201%2C%2046B%20Sarmiento%20St%2C%20Malaba%C3%B1as%2C%20Angeles%2C%202009%20Pampanga!3m2!1d15.1626716!2d120.57416119999999!5e0!3m2!1sen!2sph!4v1776318822947!5m2!1sen!2sph",
  },
};

const tabs = Object.keys(tabsData);

export function Directions() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.fade-up',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.1,
        }
      );
    }, contentRef);

    return () => ctx.revert();
  }, [activeTab]);

  const currentData = tabsData[activeTab];

  return (
    <section className="py-20 px-6 lg:px-8 bg-neutral-50">
      <ContentHeader
        badge="Direction"
        title="How To Go At La Grande Residence"
        description="Explore our curated collection of high-quality imagery showcasing our work, projects, and visual stories."
      />
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${activeTab === tab
                  ? 'bg-green-600 text-white shadow-md scale-105'
                  : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300 hover:scale-102'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div ref={contentRef} className="grid lg:grid-cols-2 gap-6 items-stretch">
          {/* Left Side */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Travel Time */}
              <div className="bg-green-600 text-white rounded-2xl p-6 shadow-md fade-up relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Clock className="w-24 h-24" />
                </div>
                <div className="flex items-center gap-3 mb-2 relative z-10">
                  <Clock className="w-5 h-5 opacity-80" />
                  <p className="text-lg font-medium">Estimated Travel Time</p>
                </div>
                <p className="text-sm opacity-90 ml-8 relative z-10">
                  {currentData.travelTime}
                </p>
              </div>

              {/* Shuttle Service Promotion */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-200 fade-up relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-10 -mt-10 opacity-50" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Bus className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-800">
                        La Grande Shuttle Service
                      </h3>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 mt-0.5">
                        Available
                      </span>
                    </div>
                  </div>
                  
<p className="text-neutral-600 leading-relaxed mb-4 ml-13">
  Skip the hassle of public transport. Our shuttle service offers 
  comfortable, direct transfers to La Grande Residence for a minimal fee. 
  Contact us in advance for rates and reservations.
</p>

                  <a 
                    href="tel:+639XXXXXXXXX" 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-full transition-colors duration-200"
                  >
                    <Phone className="w-4 h-4" />
                    Book a Shuttle
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Map Container */}
          <div className="fade-up min-h-[400px] lg:h-full">
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-sm bg-neutral-200 border border-neutral-100">
              <iframe
                key={activeTab}
                src={currentData.mapSrc}
                className="w-full h-full min-h-[400px]"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Map showing directions from ${activeTab}`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}