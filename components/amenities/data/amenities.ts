// components/amenities/data/amenities.ts
export interface Amenity {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  shortDescription: string;
  images: string[];
  operatingDays: string;
  operatingHours: string;
  location: string;
  menu?: {
    title: string;
    image: string;
  }[];
  features: string[];
}

export const amenitiesData: Amenity[] = [
  {
    id: "1",
    slug: "ground-floor-pool",
    title: "Ground Floor Pool",
    category: "Facilities",
    shortDescription: "With Heated Jacuzzi",
    description: "A family-friendly aquatic area featuring a main swimming pool, a heated jacuzzi for relaxation, and a kiddie pool designed for younger guests, offering a refreshing escape in ",
    images: [
      "/assets/Amenities/ground-floor-pool/1.webp",
    ],
    operatingDays: "Monday - Sunday",
    operatingHours: "9:00 AM - 10:00 PM",
    location: "Ground Floor, Near Lobby",
    features: ["Poolside Bar", "Towel Service", "Shower Place", "Jacuzzi", "Kiddy Pool"],
  },
  {
    id: "2",
    slug: "11th-floor-pool",
    title: "11th-Floor Pool ",
    category: "Facilities",
    shortDescription: "Mt. Arayat View",
    description: "Elevated above the city, this roof deck pool and Jacuzzi provide a tranquil atmosphere where guests can unwind while enjoying scenic surroundings.",
    images: [
      "/assets/Amenities/11th-floor-pool/1.webp",
      "/assets/Amenities/11th-floor-pool/2.webp",
    ],
    operatingDays: "Monday - Sunday",
    operatingHours: "8:00 AM - 10:00 PM",
    location: "11th Floor, Near Gym",
    features: ["Towel Service", "Shower Place", "Sun Bathing Area"],
  },
  {
    id: "3",
    slug: "15th-infinity-pool",
    title: "15th-Floor Rooftop Pool ",
    category: "Facilities",
    shortDescription: "Overlooking the Cityscape",
    description: "Perfect for early morning swims or sunset relaxation, this rooftop pool and Jacuzzi offer a serene ambiance complemented by panoramic views.",
    images: [
      "/assets/Amenities/15th-floor-pool/1.webp",
      "/assets/Amenities/15th-floor-pool/2.webp",
    ],
    operatingDays: "Monday - Sunday",
    operatingHours: "6:00 AM - 10:00 PM",
    location: "15th Floor, Near Sky Lounge Bar",
    features: ["Poolside Bar", "Towel Service", "Shower Place", "Sun Bathing Area"],
  },
  {
    id: "4",
    slug: "spa-wellness",
    title: "Spa & Wellness",
    category: "Services",
    shortDescription: "Luxurious spa offering rejuvenating treatments",
    description: "A peaceful sanctuary dedicated to relaxation and rejuvenation, offering a range of wellness and spa treatments in a calming environment. Features include massage rooms, sauna, steam room, Japanese head massage, manicure, pedicure, and more.",
    images: [
      "/assets/Amenities/spa/1.webp",
      "/assets/Amenities/spa/2.webp",
      "/assets/Amenities/spa/3.webp",
      "/assets/Amenities/spa/4.webp",
      "/assets/Amenities/spa/5.webp",
      "/assets/Amenities/spa/6.webp",
      "/assets/Amenities/spa/7.webp",
    ],
    operatingDays: "Monday - Sunday",
    operatingHours: "2:00 PM - 11:00 PM",
    location: "2nd Floor",
    menu: [
      {
        title: "Menu",
        image:
          "/assets/Amenities/spa/menu/1.webp",
      },
      {
        title: "Menu",
        image:
          "/assets/Amenities/spa/menu/2.webp",
      },
    ],
    features: ["Cold & Hot Bathe", "Sauna", "Steam Room", "Massage", "Hair & Nail Salon", "Japanese Head Spa"],
  },
  {
    id: "5",
    slug: "gaming-room",
    title: "Gaming Room",
    category: "Services",
    shortDescription: "Get out of the moment",
    description: "An ideal venue for entertainment and social gatherings, available at PHP 350 per hour (maximum of 4 persons per session). Also open for small gatherings with advanced booking, accommodating up to 15 pax. Food arrangements can be provided upon request. The area is equipped with a pool table, foosball table, and television.",
    images: [
      "/assets/Amenities/gaming-room/1.webp",
      "/assets/Amenities/gaming-room/2.webp",

    ],
    operatingDays: "Monday - Sunday",
    operatingHours: "6:00 AM - 10:00 PM",
    location: "11th Floor, Near Elevator",
    features: ["Billiard", "Foosball", "Smart Tv", "Meeting Room"],
  },
  {
    id: "6",
    slug: "gym",
    title: "Fitness Gym",
    category: "Facilities",
    shortDescription: "State-of-the-art fitness facility with modern equipment",
    description: "Our fully equipped gym offers a motivating workout experience complemented by beautiful views, creating an inspiring setting to stay active and energized during your stay.",
    images: [
      "/assets/Amenities/gym/1.webp",
      "/assets/Amenities/gym/2.webp",

    ],
    operatingDays: "Monday - Sunday",
    operatingHours: "6:00 AM - 10:00 PM",
    location: "11th Floor, Near Pool",
    features: ["Cardio Equipment", "Free Weights", "Yoga Mats"],
  },
  {
    id: "7",
    slug: "sky-lounge-bar",
    title: "Sky Lounge Bar",
    category: "Restaurant",
    shortDescription: "Rooftop bar with panoramic city views",
    description: "An elegant rooftop bar where guests can unwind with crafted beverages while enjoying stunning city views and a refined atmosphere.",
    images: [
      "/assets/Amenities/sky-lounge-bar/1.webp",
    ],
    operatingDays: "Monday - Sunday",
    operatingHours: "7:00 AM - 12:00 AM",
    location: "!5th Floor, Near Sky Lounge Dining",
    menu: [
      {
        title: "Menu",
        image:
          "/assets/Amenities/sky-lounge-bar/menu/1.webp",
      },
      {
        title: "Menu",
        image:
          "/assets/Amenities/sky-lounge-bar/menu/2.webp",
      },
      {
        title: "Menu",
        image:
          "/assets/Amenities/sky-lounge-bar/menu/3.webp",
      },
      {
        title: "Menu",
        image:
          "/assets/Amenities/sky-lounge-bar/menu/4.webp",
      },
      {
        title: "Menu",
        image:
          "/assets/Amenities/sky-lounge-bar/menu/5.webp",
      },
      {
        title: "Menu",
        image:
          "/assets/Amenities/sky-lounge-bar/menu/6.webp",
      },
      {
        title: "Menu",
        image:
          "/assets/Amenities/sky-lounge-bar/menu/7.webp",
      },
      {
        title: "Menu",
        image:
          "/assets/Amenities/sky-lounge-bar/menu/8.webp",
      },
      {
        title: "Menu",
        image:
          "/assets/Amenities/sky-lounge-bar/menu/9.webp",
      },
      {
        title: "Menu",
        image:
          "/assets/Amenities/sky-lounge-bar/menu/10.webp",
      },
      {
        title: "Menu",
        image:
          "/assets/Amenities/sky-lounge-bar/menu/11.webp",
      },
      {
        title: "Menu",
        image:
          "/assets/Amenities/sky-lounge-bar/menu/12.webp",
      },
      {
        title: "Menu",
        image:
          "/assets/Amenities/sky-lounge-bar/menu/13.webp",
      },
      {
        title: "Menu",
        image:
          "/assets/Amenities/sky-lounge-bar/menu/14.webp",
      },
      {
        title: "Menu",
        image:
          "/assets/Amenities/sky-lounge-bar/menu/15.webp",
      },
    ],
    features: ["Outdoor Terrace", "Live DJ (Events)", "City Views", 'Food & Beverages', "Free WiFi", "Takeaway Available"],
  },
  {
    id: "8",
    slug: "sky-italian",
    title: "Sky Italian",
    category: "Restaurant",
    shortDescription: "Elevated Cuisine",
    description: "An unforgettable dining experience where exquisite flavors meet artful presentation. Immerse yourself in a world of refined elegance and culinary mastery, where each dish tells a story and every bite is a celebration of the senses.",
    images: [
      "/assets/Amenities/sky-lounge-dining/1.webp",
      "/assets/Amenities/sky-lounge-dining/2.webp",
      "/assets/Amenities/sky-lounge-dining/3.webp",
      "/assets/Amenities/sky-lounge-dining/4.webp",
      "/assets/Amenities/sky-lounge-dining/5.webp",
      "/assets/Amenities/sky-lounge-dining/6.webp",
      "/assets/Amenities/sky-lounge-dining/7.webp",
    ],
    operatingDays: "Monday - Sunday",
    operatingHours: "7:00 AM - 12:00 AM",
    location: "!5th Floor, Near Sky Lounge Bar",
    menu: [
      {
        title: "Menu",
        image:
          "/assets/Amenities/sky-lounge-bar/menu/1.webp",
      },
      {
        title: "Menu",
        image:
          "/assets/Amenities/sky-lounge-bar/menu/2.webp",
      },
      {
        title: "Menu",
        image:
          "/assets/Amenities/sky-lounge-bar/menu/3.webp",
      },
      {
        title: "Menu",
        image:
          "/assets/Amenities/sky-lounge-bar/menu/4.webp",
      },
      {
        title: "Menu",
        image:
          "/assets/Amenities/sky-lounge-bar/menu/5.webp",
      },
      {
        title: "Menu",
        image:
          "/assets/Amenities/sky-lounge-bar/menu/6.webp",
      },
      {
        title: "Menu",
        image:
          "/assets/Amenities/sky-lounge-bar/menu/7.webp",
      },
      {
        title: "Menu",
        image:
          "/assets/Amenities/sky-lounge-bar/menu/8.webp",
      },
      {
        title: "Menu",
        image:
          "/assets/Amenities/sky-lounge-bar/menu/9.webp",
      },
      {
        title: "Menu",
        image:
          "/assets/Amenities/sky-lounge-bar/menu/10.webp",
      },
      {
        title: "Menu",
        image:
          "/assets/Amenities/sky-lounge-bar/menu/11.webp",
      },
      {
        title: "Menu",
        image:
          "/assets/Amenities/sky-lounge-bar/menu/12.webp",
      },
      {
        title: "Menu",
        image:
          "/assets/Amenities/sky-lounge-bar/menu/13.webp",
      },
      {
        title: "Menu",
        image:
          "/assets/Amenities/sky-lounge-bar/menu/14.webp",
      },
      {
        title: "Menu",
        image:
          "/assets/Amenities/sky-lounge-bar/menu/15.webp",
      },
    ],
    features: ["International Cuisines", "Food & Beverages", "Free WiFi", "Takeaway Available"],
  },
  {
    id: "9",
    slug: "coffee-lounge",
    title: "Coffee Lounge",
    category: "Restaurant",
    shortDescription: "Artisan coffee and fresh pastries all day",
    description: "A welcoming space open day and night, offering freshly brewed coffee, light refreshments, and a relaxed setting for casual meetings or quiet moments. A variety of options are available, from quick snacks to full meals.",
    images: [
      "/assets/Amenities/coffee-lounge/1.webp",
      "/assets/Amenities/coffee-lounge/2.webp",
      "/assets/Amenities/coffee-lounge/3.webp",
      "/assets/Amenities/coffee-lounge/4.webp",
      "/assets/Amenities/coffee-lounge/5.webp",
      "/assets/Amenities/coffee-lounge/6.webp",
    ],
    operatingDays: "Monday - Sunday",
    operatingHours: "24/7",
    location: "Ground Floor, Near Lobby",
    menu: [
      {
        title: "Menu",
        image:
          "/assets/Amenities/coffee-lounge/menu/1.webp",
      },
      {
        title: "Menu",
        image:
          "/assets/Amenities/coffee-lounge/menu/2.webp",
      },
      {
        title: "Menu",
        image:
          "/assets/Amenities/coffee-lounge/menu/3.webp",
      },
      {
        title: "Menu",
        image:
          "/assets/Amenities/coffee-lounge/menu/4.webp",
      },
      {
        title: "Menu",
        image:
          "/assets/Amenities/coffee-lounge/menu/5.webp",
      },
    ],
    features: ["Free WiFi", "Takeaway Available", "Reading Area", "Food & Beverages",],
  },
  {
    id: "10",
    slug: "gentlemens-club",
    title: "Gentlemen's Club",
    category: "Entertainment",
    shortDescription: "VIP Membership",
    description: "Good food for a good place is a combination of a good stay. Our Zermatt Restaurant offers tasteful choices of food. Experience a quality and international cuisine that could satisfy you.",
    images: [
      "/assets/Amenities/gentlemens-club/1.webp",
      "/assets/Amenities/gentlemens-club/2.webp",
      "/assets/Amenities/gentlemens-club/3.webp",
      "/assets/Amenities/gentlemens-club/4.webp",
      "/assets/Amenities/gentlemens-club/5.webp",
      "/assets/Amenities/gentlemens-club/6.webp",
      "/assets/Amenities/gentlemens-club/7.webp",
      "/assets/Amenities/gentlemens-club/8.webp",
      "/assets/Amenities/gentlemens-club/9.webp",
      "/assets/Amenities/gentlemens-club/10.webp",
    ],
    operatingDays: "Monday - Sunday",
    operatingHours: "-",
    location: "15th Floor, Near Elevator",
    features: ["VIP Membership"],
  },
  {
    id: "11",
    slug: "tennis-court",
    title: "Tennis Court",
    category: "Services",
    shortDescription: "Professional-grade outdoor tennis court",
    description: "On our top floor with stunning view (sunset and sunrise), our tennis courts is available for recreational and competitive play. Prices starting from PHP 400 per hour. Rental of tennis racket and tennis ball are available (minimal fee). Tennis coach can be arranged.",
    images: [
      "/assets/Amenities/tennis-court/1.webp",
    ],
    operatingDays: "Monday - Sunday",
    operatingHours: "7:00 AM - 10:00 PM",
    location: "16th Floor, Near Cabana",
    features: ["Standard Court Dimensions", "High-Quality Playing Surface", "Well-Lit Area", "Protected Cage"],
  },
];