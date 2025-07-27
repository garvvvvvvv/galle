const products = [
  {
    slug: 'day-dream',
    title: 'GALLE DAY DREAM',
    image: 'https://ik.imagekit.io/garvchaudhary/WhatsApp%20Image%202025-06-22%20at%2017.14.26_3ce2c1a8.jpg?updatedAt=1751363008373',
    gallery: [
      "https://ik.imagekit.io/garvchaudhary/WhatsApp%20Image%202025-06-22%20at%2017.14.26_3ce2c1a8.jpg?updatedAt=1751363008373",
      "https://ik.imagekit.io/garvchaudhary/WhatsApp%20Image%202025-06-22%20at%2017.14.26_2a9069f2.jpg?updatedAt=1751363008436",
      "https://ik.imagekit.io/garvchaudhary/WhatsApp%20Image%202025-06-22%20at%2017.14.26_ac278abd.jpg?updatedAt=1751363008376",
    ],
    description: 'A dreamy floral blend perfect for daytime elegance. Galle Day Dream Eau De Parfum, Women, Floral Fragrance, 30 ml',
    notes: 'Top: Jasmine, Middle: Peony, Base: Sandalwood',
    price: 399,
    // Add this for correct navigation
    getPageUrl: function() { return `/shop/${this.slug}`; }
  },
  {
    slug: 'white-oud',
    title: 'WHITE OUD',
    image: 'https://ik.imagekit.io/yourimg.jpg',
    description: 'An exotic and rich oud experience with subtle spice.',
    notes: 'Top: Rose, Middle: Oud, Base: Amber',
    price: 399,
    getPageUrl: function() { return `/shop/${this.slug}`; }
  }
  // Add more...
];

export default products;
