'use client';

import { useEffect, useRef, useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'; // Added missing icons
import gsap from 'gsap';

const testimonials = [
  {
    name: 'Aerel Amor Cabrales',
    role: 'Guest Review',
    content: 'Loved my stay, came back twice! Great price for awesome amenities and rooftop views. Just needs floor mats in the bathroom. Staff are amazing!',
    rating: 5,
    image: 'https://lh3.googleusercontent.com/a-/ALV-UjUHFjmYQb9DSSG8XlHyzyt3lM_wDEgQl-Qphnt4UBOGl-yBH1rz=s40-c-rp-mo-br100'
  },
  {
    name: 'Yern Belardo',
    role: 'Guest Review',
    content: 'Its a very different experience because the place is so elegant, you can really feel the beauty, especially the view',
    rating: 5,
    image: 'https://lh3.googleusercontent.com/a-/ALV-UjUxBu2z6QUbr9MhnDz8XpsKuLriD_Fo8fi6s-G6v8c7_N6U05OK=s40-c-rp-mo-ba4-br100'
  },
  {
    name: 'Anita Meier',
    role: 'Guest Review',
    content: 'great place,to stay the,Appartments are well equipped friendly helpful staff the 3 pools,are great the gym is a good size the massages are really good the roof top bar is wonderful for the sunset and the drinks are good',
    rating: 5,
    image: 'https://lh3.googleusercontent.com/a/ACg8ocJBEJdkPg3mya9JnFyNBr9MMm-UOkaN6V9UmqKPD7ay-y_0mQ=s40-c-rp-mo-ba5-br100'
  },
    {
    name: 'Leah Nucaza',
    role: 'Guest Review',
    content: 'Had a wonderful stay at La Grande Residence, everything was perfect! The view was amazing, the facilities and amenities were complete and well-maintained, and the staffs were very friendly and accommodating. Overall, it was an all-in great experience. Highly recommended!',
    rating: 5,
    image: 'https://lh3.googleusercontent.com/a-/ALV-UjVkxPXVasnHlbn4znx6sqKN3wpnU0AYLV9VAieon6HWz66IHyQ=s40-c-rp-mo-br100'
  },
      {
    name: 'Quinny Ann',
    role: 'Guest Review',
    content: 'We stayed here through an Airbnb and had a really nice experience. My favorite part was the rooftop on the 15th floor. The sunset view was stunning (sadly didn’t get a picture was busy appreciating it lol). There are also a few pools with a bar right beside them, which makes it such a relaxing spot together with the view. I also liked the coffee lounge at the lobby as soon as you walk in, you get that cozy coffee aroma which feels really welcoming. The location’s super convenient too since it’s just outside Clark and close to SM Clark where you can pretty much find everything you need.',
    rating: 5,
    image: 'https://lh3.googleusercontent.com/a/ACg8ocIwpgKmZCvinW6ox9hUcIYSSQ-CAl5K90Db7cFEux2dugaJlA=s40-c-rp-mo-br100'
  },
    {
    name: 'Robert Perez',
    role: 'Guest Review',
    content: 'They took care of me here. Beautiful place. Food is really good at the restaurant. Great customer service. Great view of Angeles, from my unit. Can’t thank you enough all of you thank you. #Respect.',
    rating: 5,
    image: 'https://lh3.googleusercontent.com/a-/ALV-UjV31tCFqJLGa6JsHg_l3zzlBbJXYFr1XwPcEuv5wMyEA4V6WEY=s40-c-rp-mo-br100'
  }
];

export function Testimonials() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Responsive items to show
  const getItemsInView = () => {
    if (typeof window === 'undefined') return 1;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  };

  const slideTo = (index: number) => {
    if (!sliderRef.current) return;
    
    const itemsInView = getItemsInView();
    const totalSlides = testimonials.length;
    
    // Prevent sliding too far on desktop
    const maxIndex = Math.max(0, totalSlides - itemsInView);
    const targetIndex = Math.min(index, maxIndex);

    // Calculate movement based on child width + gap
    const firstChild = sliderRef.current.children[0] as HTMLElement;
    const moveDistance = targetIndex * (firstChild.offsetWidth + 24); // 24 is gap-6

    gsap.to(sliderRef.current, {
      x: -moveDistance,
      duration: 0.8,
      ease: 'power3.out',
    });
    
    setCurrentIndex(targetIndex);
  };

  const next = () => {
    const itemsInView = getItemsInView();
    if (currentIndex < testimonials.length - itemsInView) {
      slideTo(currentIndex + 1);
    } else {
      slideTo(0); // Loop back to start
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      slideTo(currentIndex - 1);
    } else {
      const itemsInView = getItemsInView();
      slideTo(testimonials.length - itemsInView); // Loop to end
    }
  };

  return (
    <section id="testimonials" className="py-24 px-6 lg:px-8 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-block px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm mb-4 shadow-sm border border-neutral-100">
              Testimonials
            </div>
            <h2 className="text-4xl md:text-5xl font-medium text-neutral-900 mb-4">
              Trusted by Our Guests
            </h2>
            <p className="text-neutral-600">
              See what makes a stay at La Grande Residence so unforgettable
            </p>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={prev}
              className="p-4 rounded-full border border-neutral-200 hover:bg-neutral-900 hover:text-white transition-all disabled:opacity-30"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={next}
              className="p-4 rounded-full border border-neutral-200 hover:bg-neutral-900 hover:text-white transition-all disabled:opacity-30"
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div className="relative">
          <div 
            ref={sliderRef} 
            className="flex gap-6"
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="min-w-full md:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] p-8 rounded-3xl bg-neutral-50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-lg text-neutral-800 mb-8 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                </div>
                
                <div className="flex items-center gap-4 pt-6 border-t border-neutral-200">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full bg-neutral-200 object-cover"
                  />
                  <div>
                    <div className="font-semibold text-neutral-900">{testimonial.name}</div>
                    <div className="text-sm text-neutral-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}