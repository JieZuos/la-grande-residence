// components/gallery/data/gallery.ts

export interface GalleryImage {
  id: number;
  url: string;
  title: string;
}

export interface Category {
  id: string;
  name: string;
  thumbnail: string;
  images: GalleryImage[];
}

export const categories: Category[] = [
  {
    id: 'facilities',
    name: 'Facilities',
    thumbnail: '/assets/Gallery/Facilities/img1.webp',
    images: [
      { id: 1, url: '/assets/Gallery/Facilities/img1.webp', title: 'Forest Path' },
      { id: 2, url: '/assets/Gallery/Facilities/img2.webp', title: 'Sunset Valley' },
      { id: 3, url: '/assets/Gallery/Facilities/img3.webp', title: 'Mountain Peak' },
      { id: 4, url: '/assets/Gallery/Facilities/img4.webp', title: 'Sunset Valley' },
      { id: 5, url: '/assets/Gallery/Facilities/img5.webp', title: 'Forest Path' },
      { id: 6, url: '/assets/Gallery/Facilities/img6.webp', title: 'Mountain Peak' },
      { id: 7, url: '/assets/Gallery/Facilities/img7.webp', title: 'Sunset Valley' },
      { id: 8, url: '/assets/Gallery/Facilities/img8.webp', title: 'Forest Path' },
      { id: 9, url: '/assets/Gallery/Facilities/img9.webp', title: 'Mountain Peak' },
      { id: 10, url: '/assets/Gallery/Facilities/img10.webp', title: 'Sunset Valley' },
    ]
  },
  {
    id: 'rooms',
    name: 'Rooms',
    thumbnail: '/assets/Gallery/Rooms/img1.webp',
    images: [
      { id: 1, url: '/assets/Gallery/Rooms/img1.webp', title: 'Sunset Valley' },
      { id: 2, url: '/assets/Gallery/Rooms/img2.webp', title: 'Forest Path' },
      { id: 3, url: '/assets/Gallery/Rooms/img3.webp', title: 'Mountain Peak' },
      { id: 4, url: '/assets/Gallery/Rooms/img4.webp', title: 'Sunset Valley' },
      { id: 5, url: '/assets/Gallery/Rooms/img5.webp', title: 'Forest Path' },
      { id: 6, url: '/assets/Gallery/Rooms/img6.webp', title: 'Mountain Peak' },
      { id: 7, url: '/assets/Gallery/Rooms/img7.webp', title: 'Sunset Valley' },
      { id: 8, url: '/assets/Gallery/Rooms/img8.webp', title: 'Forest Path' },
      { id: 9, url: '/assets/Gallery/Rooms/img9.webp', title: 'Mountain Peak' },
    ]
  },
  {
    id: 'community',
    name: 'Community',
    thumbnail: '/assets/Gallery/Community/img1.webp',
    images: [
      { id: 1, url: '/assets/Gallery/Community/img1.webp', title: 'Forest Path' },
      { id: 2, url: '/assets/Gallery/Community/img2.webp', title: 'Sunset Valley' },
      { id: 3, url: '/assets/Gallery/Community/img3.webp', title: 'Mountain Peak' },
      { id: 4, url: '/assets/Gallery/Community/img4.webp', title: 'Sunset Valley' },
      { id: 5, url: '/assets/Gallery/Community/img6.webp', title: 'Forest Path' },
      { id: 6, url: '/assets/Gallery/Community/img6.webp', title: 'Mountain Peak' },
      { id: 7, url: '/assets/Gallery/Community/img7.webp', title: 'Sunset Valley' },
      { id: 8, url: '/assets/Gallery/Community/img8.webp', title: 'Forest Path' },
      { id: 9, url: '/assets/Gallery/Community/img9.webp', title: 'Mountain Peak' },
      { id: 10, url: '/assets/Gallery/Community/img10.webp', title: 'Sunset Valley' },
      { id: 11, url: '/assets/Gallery/Community/img11.webp', title: 'Forest Path' },
      { id: 12, url: '/assets/Gallery/Community/img12.webp', title: 'Mountain Peak' },
      { id: 13, url: '/assets/Gallery/Community/img13.webp', title: 'Mountain Peak' },
      { id: 14, url: '/assets/Gallery/Community/img14.webp', title: 'Mountain Peak' },
      { id: 15, url: '/assets/Gallery/Community/img15.webp', title: 'Mountain Peak' },
      { id: 16, url: '/assets/Gallery/Community/img16.webp', title: 'Mountain Peak' },
    ]
  },
  {
    id: 'events',
    name: 'Events',
    thumbnail: '/assets/Gallery/Events/img1.webp',
    images: [
      { id: 1, url: '/assets/Gallery/Events/img1.webp', title: 'Forest Path' },
      { id: 2, url: '/assets/Gallery/Events/img2.webp', title: 'Sunset Valley' },
      { id: 3, url: '/assets/Gallery/Events/img3.webp', title: 'Mountain Peak' },
      { id: 4, url: '/assets/Gallery/Events/img4.webp', title: 'Sunset Valley' },
      { id: 5, url: '/assets/Gallery/Events/img5.webp', title: 'Forest Path' },
      { id: 6, url: '/assets/Gallery/Events/img6.webp', title: 'Mountain Peak' },
      { id: 7, url: '/assets/Gallery/Events/img7.webp', title: 'Sunset Valley' },
      { id: 8, url: '/assets/Gallery/Events/img8.webp', title: 'Forest Path' },
      { id: 9, url: '/assets/Gallery/Events/img9.webp', title: 'Mountain Peak' },
      { id: 10, url: '/assets/Gallery/Events/img10.webp', title: 'Sunset Valley' },
      { id: 11, url: '/assets/Gallery/Events/img11.webp', title: 'Forest Path' },
      { id: 12, url: '/assets/Gallery/Events/img12.webp', title: 'Mountain Peak' },
      { id: 13, url: '/assets/Gallery/Events/img13.webp', title: 'Sunset Valley' },
      { id: 14, url: '/assets/Gallery/Events/img14.webp', title: 'Forest Path' },
      { id: 15, url: '/assets/Gallery/Events/img15.webp', title: 'Mountain Peak' },
      { id: 16, url: '/assets/Gallery/Events/img16.webp', title: 'Sunset Valley' },
      { id: 17, url: '/assets/Gallery/Events/img17.webp', title: 'Forest Path' },
      { id: 18, url: '/assets/Gallery/Events/img18.webp', title: 'Mountain Peak' },
      { id: 19, url: '/assets/Gallery/Events/img19.webp', title: 'Sunset Valley' },
      { id: 20, url: '/assets/Gallery/Events/img20.webp', title: 'Forest Path' },
    ]
  },


  {
    id: 'team',
    name: 'Our Team',
    thumbnail: '/assets/Gallery/Our%20Team/img1.webp',
    images: [
      { id: 1, url: '/assets/Gallery/Our%20Team/img1.webp', title: 'Forest Path' },
      { id: 2, url: '/assets/Gallery/Our%20Team/img2.webp', title: 'Sunset Valley' },
      { id: 3, url: '/assets/Gallery/Our%20Team/img3.webp', title: 'Mountain Peak' },
      { id: 4, url: '/assets/Gallery/Our%20Team/img4.webp', title: 'Sunset Valley' },
      { id: 5, url: '/assets/Gallery/Our%20Team/img5.webp', title: 'Forest Path' },
      { id: 6, url: '/assets/Gallery/Our%20Team/img6.webp', title: 'Mountain Peak' },
      { id: 7, url: '/assets/Gallery/Our%20Team/img7.webp', title: 'Sunset Valley' },
      { id: 8, url: '/assets/Gallery/Our%20Team/img8.webp', title: 'Forest Path' },
      { id: 9, url: '/assets/Gallery/Our%20Team/img9.webp', title: 'Mountain Peak' },
      { id: 10, url: '/assets/Gallery/Our%20Team/img10.webp', title: 'Sunset Valley' },
    ]
  }
];