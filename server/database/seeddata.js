export const tags = [
  { name: "Gluten-Free" },
  { name: "Vegan Options" },
  { name: "Good for Kids" },
  { name: "Coffee" },
  { name: "Late Night" },
  { name: "Good for Dates" },
  { name: "Cozy Seating" },
];

export const locations = [
  {
    name: "Levain Bakery",
    address: "167 W 74th St, New York, NY 10023",
    notes: "Famous for their massive cookies. Always a line but worth it!",
    image_url: "https://levainbakery.com/cdn/shop/files/Homepage_angledcard_baking.png?v=1746959193",
    visited: true,
  },
  {
    name: "Breads Bakery",
    address: "18 E 16th St, New York, NY 10003",
    notes: "Best babka in the city. Great coffee too.",
    image_url: "https://bakefromscratch.com/wp-content/uploads/2017/02/IMG_0123.jpg",
    visited: false,
  },
  {
    name: "Mah-Ze-Dahr Bakery",
    address: "28 Greenwich Ave, New York, NY 10011",
    notes: "Cozy spot in the West Village. Try the brioche!",
    image_url: "https://www.arlnow.com/wp-content/uploads/2023/07/MZD_NinaPalazzolo-8-e1690223664550.jpg",
    visited: false,
  },
];

export const items = [
  {
    locationIndex: 0,
    name: "Dark Chocolate Chip Cookie",
    category: "Cookie",
    rating: 5,
    notes: "Crispy outside, gooey inside. Absolutely incredible.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Above_Chocolate_Chip_Cookie_Lede.jpg",
  },
  {
    locationIndex: 1,
    name: "Chocolate Babka",
    category: "Pastry",
    rating: 5,
    notes: "Rich, swirly, and perfectly sweet. A must try.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Breads_Bakery_babka.jpg",
  },
  {
    locationIndex: 1,
    name: "Almond Croissant",
    category: "Croissant",
    rating: 4,
    notes: "Flaky and nutty. Great with their coffee.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Croissant_Basque.jpg/800px-Croissant_Basque.jpg",
  },
  {
    locationIndex: 2,
    name: "Brioche",
    category: "Bread",
    rating: 4,
    notes: "Buttery and soft. Perfect with their jam.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Brioche_Nanterre_1.jpg/800px-Brioche_Nanterre_1.jpg",
  },
];

export const locationTags = [
  [0, "Coffee"],
  [0, "Cozy Seating"],
  [0, "Good for Kids"],
  [1, "Gluten-Free"],
  [1, "Vegan Options"],
  [2, "Late Night"],
  [2, "Cozy Seating"],
];