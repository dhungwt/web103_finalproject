// Temporary stand-in for the API while the database is being set up.
// Shaped to match the JSON the server returns, so swapping api.js over
// to real fetch calls requires no changes in the components.
// Source of truth for the real seed: server/database/seeddata.js

export const tags = [
  { id: 1, name: "Gluten-Free" },
  { id: 2, name: "Vegan Options" },
  { id: 3, name: "Good for Kids" },
  { id: 4, name: "Coffee" },
  { id: 5, name: "Late Night" },
  { id: 6, name: "Good for Dates" },
  { id: 7, name: "Cozy Seating" },
];

export const locations = [
  {
    id: 1,
    name: "Levain Bakery",
    address: "167 W 74th St, New York, NY 10023",
    notes: "Famous for their massive cookies. Always a line but worth it!",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Levain_Bakery.jpg/1200px-Levain_Bakery.jpg",
    visited: true,
  },
  {
    id: 2,
    name: "Breads Bakery",
    address: "18 E 16th St, New York, NY 10003",
    notes: "Best babka in the city. Great coffee too.",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/2/2e/Breads_Bakery_babka.jpg",
    visited: false,
  },
  {
    id: 3,
    name: "Mah-Ze-Dahr Bakery",
    address: "28 Greenwich Ave, New York, NY 10011",
    notes: "Cozy spot in the West Village. Try the brioche!",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Mah-Ze-Dahr.jpg/800px-Mah-Ze-Dahr.jpg",
    visited: false,
  },
];

export const items = [
  {
    id: 1,
    location_id: 1,
    name: "Dark Chocolate Chip Cookie",
    category: "Cookie",
    rating: 5,
    notes: "Crispy outside, gooey inside. Absolutely incredible.",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/b/b9/Above_Chocolate_Chip_Cookie_Lede.jpg",
  },
  {
    id: 2,
    location_id: 2,
    name: "Chocolate Babka",
    category: "Pastry",
    rating: 5,
    notes: "Rich, swirly, and perfectly sweet. A must try.",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/2/2e/Breads_Bakery_babka.jpg",
  },
  {
    id: 3,
    location_id: 2,
    name: "Almond Croissant",
    category: "Croissant",
    rating: 4,
    notes: "Flaky and nutty. Great with their coffee.",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Croissant_Basque.jpg/800px-Croissant_Basque.jpg",
  },
  {
    id: 4,
    location_id: 3,
    name: "Brioche",
    category: "Bread",
    rating: 4,
    notes: "Buttery and soft. Perfect with their jam.",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Brioche_Nanterre_1.jpg/800px-Brioche_Nanterre_1.jpg",
  },
];

// Mirrors the location_tags join table.
export const locationTags = [
  { location_id: 1, tag_id: 4 },
  { location_id: 1, tag_id: 7 },
  { location_id: 1, tag_id: 3 },
  { location_id: 2, tag_id: 1 },
  { location_id: 2, tag_id: 2 },
  { location_id: 3, tag_id: 5 },
  { location_id: 3, tag_id: 7 },
];
