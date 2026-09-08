const products = [
  // ================= MEN =================

  {
    id: 1,
    name: "Classic Black T-Shirt",
    category: "Men",
    gender: "Men",
    price: 599,
    rating: 4.5,
    colors: ["Black", "White", "Grey"],
    sizes: ["S", "M", "L", "XL"],
    occasions: ["College", "Casual"],
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
  },

  {
    id: 2,
    name: "Oversized Streetwear T-Shirt",
    category: "Men",
    gender: "Men",
    price: 799,
    rating: 4.7,
    colors: ["Black", "White", "Beige"],
    sizes: ["S", "M", "L", "XL"],
    occasions: ["College", "Casual", "Party"],
    image:
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1",
  },

  {
    id: 3,
    name: "Slim Fit Blue Jeans",
    category: "Men",
    gender: "Men",
    price: 1299,
    rating: 4.6,
    colors: ["Blue", "Dark Blue"],
    sizes: ["28", "30", "32", "34", "36"],
    occasions: ["College", "Casual"],
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d",
  },

  {
    id: 4,
    name: "Casual Denim Jacket",
    category: "Men",
    gender: "Men",
    price: 1599,
    rating: 4.5,
    colors: ["Blue", "Black"],
    sizes: ["M", "L", "XL"],
    occasions: ["Casual", "Party"],
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5",
  },

  {
    id: 13,
    name: "Premium White Shirt",
    category: "Men",
    gender: "Men",
    price: 899,
    rating: 4.7,
    colors: ["White", "Blue"],
    sizes: ["S", "M", "L", "XL"],
    occasions: ["College", "Formal", "Casual"],
    image:
      "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab",
  },

  {
    id: 14,
    name: "Classic Formal Shirt",
    category: "Men",
    gender: "Men",
    price: 1099,
    rating: 4.6,
    colors: ["White", "Black", "Blue"],
    sizes: ["S", "M", "L", "XL"],
    occasions: ["Formal", "Office"],
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c",
  },

  {
    id: 15,
    name: "Beige Casual Trousers",
    category: "Men",
    gender: "Men",
    price: 1199,
    rating: 4.5,
    colors: ["Beige", "Black"],
    sizes: ["30", "32", "34", "36"],
    occasions: ["College", "Casual", "Formal"],
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80",
  },

  {
    id: 16,
    name: "Black Formal Trousers",
    category: "Men",
    gender: "Men",
    price: 1399,
    rating: 4.7,
    colors: ["Black", "Grey"],
    sizes: ["30", "32", "34", "36"],
    occasions: ["Formal", "Office", "Party"],
    image:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a",
  },

  {
    id: 17,
    name: "Men's Casual Polo",
    category: "Men",
    gender: "Men",
    price: 749,
    rating: 4.4,
    colors: ["Navy", "White", "Grey"],
    sizes: ["S", "M", "L", "XL"],
    occasions: ["College", "Casual", "Vacation"],
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
  },

  {
    id: 18,
    name: "Black Party Blazer",
    category: "Men",
    gender: "Men",
    price: 2499,
    rating: 4.8,
    colors: ["Black", "Navy"],
    sizes: ["M", "L", "XL"],
    occasions: ["Party", "Formal"],
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
  },

  // ================= WOMEN =================

  {
    id: 5,
    name: "Women's Floral Dress",
    category: "Women",
    gender: "Women",
    price: 1199,
    rating: 4.8,
    colors: ["Pink", "Blue", "White"],
    sizes: ["S", "M", "L", "XL"],
    occasions: ["Casual", "Vacation", "Party"],
    image:
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1",
  },

  {
    id: 6,
    name: "Elegant Party Dress",
    category: "Women",
    gender: "Women",
    price: 1999,
    rating: 4.9,
    colors: ["Black", "Red", "Wine"],
    sizes: ["S", "M", "L"],
    occasions: ["Party", "Formal"],
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae",
  },

  {
    id: 7,
    name: "Women's Casual Top",
    category: "Women",
    gender: "Women",
    price: 699,
    rating: 4.4,
    colors: ["White", "Pink", "Black"],
    sizes: ["S", "M", "L"],
    occasions: ["College", "Casual"],
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3",
  },

  {
    id: 8,
    name: "High Waist Jeans",
    category: "Women",
    gender: "Women",
    price: 1399,
    rating: 4.6,
    colors: ["Blue", "Black"],
    sizes: ["26", "28", "30", "32"],
    occasions: ["College", "Casual"],
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
  },

  {
    id: 19,
    name: "Women's White Blouse",
    category: "Women",
    gender: "Women",
    price: 899,
    rating: 4.6,
    colors: ["White", "Beige"],
    sizes: ["S", "M", "L", "XL"],
    occasions: ["Formal", "Office", "College"],
    image:
      "https://images.unsplash.com/photo-1564257577054-5e6c7d1e8f42",
  },

  {
    id: 20,
    name: "Women's Casual Jeans",
    category: "Women",
    gender: "Women",
    price: 1299,
    rating: 4.7,
    colors: ["Blue", "Black"],
    sizes: ["26", "28", "30", "32"],
    occasions: ["College", "Casual"],
    image:
      "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec",
  },

  {
    id: 21,
    name: "Elegant Black Skirt",
    category: "Women",
    gender: "Women",
    price: 999,
    rating: 4.5,
    colors: ["Black", "Grey"],
    sizes: ["S", "M", "L"],
    occasions: ["Party", "Formal", "Casual"],
    image:
      "https://images.unsplash.com/photo-1583496661160-fb5886a13d27",
  },

  {
    id: 22,
    name: "Summer Crop Top",
    category: "Women",
    gender: "Women",
    price: 599,
    rating: 4.4,
    colors: ["White", "Pink", "Yellow"],
    sizes: ["S", "M", "L"],
    occasions: ["Vacation", "Casual", "College"],
    image:
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3",
  },

  {
    id: 23,
    name: "Women's Casual Jacket",
    category: "Women",
    gender: "Women",
    price: 1699,
    rating: 4.7,
    colors: ["Beige", "Black", "Blue"],
    sizes: ["S", "M", "L"],
    occasions: ["Casual", "Party", "College"],
    image:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923",
  },

  {
    id: 24,
    name: "Women's Evening Gown",
    category: "Women",
    gender: "Women",
    price: 2499,
    rating: 4.9,
    colors: ["Black", "Red", "Blue"],
    sizes: ["S", "M", "L"],
    occasions: ["Party", "Formal"],
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae",
  },

  // ================= SHOES =================

  {
    id: 9,
    name: "White Casual Sneakers",
    category: "Shoes",
    price: 1499,
    rating: 4.7,
    colors: ["White", "Black"],
    sizes: ["6", "7", "8", "9", "10"],
    occasions: ["College", "Casual", "Vacation"],
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  },

  {
    id: 10,
    name: "Classic Running Shoes",
    category: "Shoes",
    price: 1799,
    rating: 4.5,
    colors: ["Black", "Grey", "Blue"],
    sizes: ["6", "7", "8", "9", "10"],
    occasions: ["Sports", "Casual", "College"],
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  },

  {
    id: 25,
    name: "Black Casual Sneakers",
    category: "Shoes",
    price: 1299,
    rating: 4.6,
    colors: ["Black", "White"],
    sizes: ["6", "7", "8", "9", "10"],
    occasions: ["College", "Casual"],
    image:
      "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3",
  },

  {
    id: 26,
    name: "Classic White Trainers",
    category: "Shoes",
    price: 1599,
    rating: 4.7,
    colors: ["White", "Grey"],
    sizes: ["6", "7", "8", "9", "10"],
    occasions: ["College", "Casual", "Vacation"],
    image:
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2",
  },

  {
    id: 27,
    name: "Sport Running Sneakers",
    category: "Shoes",
    price: 1899,
    rating: 4.8,
    colors: ["Black", "Blue", "Grey"],
    sizes: ["6", "7", "8", "9", "10"],
    occasions: ["Sports", "Casual"],
    image:
      "https://images.unsplash.com/photo-1552346154-21d32810aba3",
  },

  {
    id: 28,
    name: "Premium Black Sneakers",
    category: "Shoes",
    price: 2199,
    rating: 4.8,
    colors: ["Black", "White"],
    sizes: ["7", "8", "9", "10"],
    occasions: ["Party", "Casual", "College"],
    image:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77",
  },

  {
    id: 29,
    name: "Women's Casual Flats",
    category: "Shoes",
    price: 899,
    rating: 4.5,
    colors: ["Black", "Beige", "Brown"],
    sizes: ["5", "6", "7", "8"],
    occasions: ["College", "Casual", "Formal"],
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2",
  },

  {
    id: 30,
    name: "Women's Party Heels",
    category: "Shoes",
    price: 1599,
    rating: 4.7,
    colors: ["Black", "Red", "Gold"],
    sizes: ["5", "6", "7", "8"],
    occasions: ["Party", "Formal"],
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2",
  },

  {
    id: 31,
    name: "Summer Sandals",
    category: "Shoes",
    price: 799,
    rating: 4.4,
    colors: ["Brown", "Beige", "Black"],
    sizes: ["5", "6", "7", "8"],
    occasions: ["Vacation", "Casual"],
    image:
      "https://images.unsplash.com/photo-1603487742131-4160ec999306",
  },

  {
    id: 32,
    name: "Classic Formal Shoes",
    category: "Shoes",
    price: 1999,
    rating: 4.8,
    colors: ["Black", "Brown"],
    sizes: ["6", "7", "8", "9", "10"],
    occasions: ["Formal", "Office", "Party"],
    image:
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1",
  },

  // ================= ACCESSORIES =================

  {
    id: 11,
    name: "Leather Handbag",
    category: "Accessories",
    price: 1299,
    rating: 4.6,
    colors: ["Black", "Brown"],
    sizes: ["Standard"],
    occasions: ["Formal", "Casual", "Party"],
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
  },

  {
    id: 12,
    name: "Minimalist Backpack",
    category: "Accessories",
    price: 899,
    rating: 4.5,
    colors: ["Black", "Grey"],
    sizes: ["Standard"],
    occasions: ["College", "Casual", "Travel"],
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
  },

  {
    id: 33,
    name: "Classic Leather Wallet",
    category: "Accessories",
    price: 499,
    rating: 4.5,
    colors: ["Black", "Brown"],
    sizes: ["Standard"],
    occasions: ["Casual", "Formal"],
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93",
  },

  {
    id: 34,
    name: "Minimalist Wrist Watch",
    category: "Accessories",
    price: 1499,
    rating: 4.7,
    colors: ["Black", "Silver", "Brown"],
    sizes: ["Standard"],
    occasions: ["Formal", "Casual", "Party"],
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d",
  },

  {
    id: 35,
    name: "Classic Sunglasses",
    category: "Accessories",
    price: 699,
    rating: 4.5,
    colors: ["Black", "Brown"],
    sizes: ["Standard"],
    occasions: ["Vacation", "Casual"],
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
  },

  {
    id: 36,
    name: "Premium Leather Belt",
    category: "Accessories",
    price: 599,
    rating: 4.6,
    colors: ["Black", "Brown"],
    sizes: ["M", "L", "XL"],
    occasions: ["Formal", "Casual", "Office"],
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
  },

  {
    id: 37,
    name: "Travel Crossbody Bag",
    category: "Accessories",
    price: 999,
    rating: 4.6,
    colors: ["Black", "Beige", "Brown"],
    sizes: ["Standard"],
    occasions: ["Vacation", "Casual", "College"],
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7",
  },

  {
    id: 38,
    name: "Women's Shoulder Bag",
    category: "Accessories",
    price: 1599,
    rating: 4.8,
    colors: ["Black", "White", "Brown"],
    sizes: ["Standard"],
    occasions: ["Party", "Formal", "Casual"],
    image:
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d",
  },

  {
    id: 39,
    name: "Fashion Bracelet",
    category: "Accessories",
    price: 399,
    rating: 4.3,
    colors: ["Gold", "Silver"],
    sizes: ["Standard"],
    occasions: ["Party", "Casual"],
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a",
  },

  {
    id: 40,
    name: "Classic Cap",
    category: "Accessories",
    price: 449,
    rating: 4.4,
    colors: ["Black", "White", "Blue"],
    sizes: ["Standard"],
    occasions: ["College", "Casual", "Sports"],
    image:
      "https://images.unsplash.com/photo-1521369909029-2afed882baee",
  },
    // =====================================================
  // MORE MEN
  // =====================================================

  {
    id: 43,
    name: "Olive Casual Overshirt",
    category: "Men",
    gender: "Men",
    price: 999,
    rating: 4.5,
    colors: ["Olive", "Black", "Beige"],
    sizes: ["S", "M", "L", "XL"],
    occasions: ["Casual", "College"],
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3",
  },

  {
    id: 44,
    name: "Navy Casual Shirt",
    category: "Men",
    gender: "Men",
    price: 899,
    rating: 4.6,
    colors: ["Navy", "White"],
    sizes: ["S", "M", "L", "XL"],
    occasions: ["Casual", "Office"],
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",
  },

  {
    id: 45,
    name: "Grey Knit Sweater",
    category: "Men",
    gender: "Men",
    price: 1299,
    rating: 4.7,
    colors: ["Grey", "Black", "Cream"],
    sizes: ["M", "L", "XL"],
    occasions: ["Casual", "College", "Winter"],
    image:
      "https://images.unsplash.com/photo-1610652492500-ded49ceeb378",
  },

  {
    id: 46,
    name: "Men's Relaxed Hoodie",
    category: "Men",
    gender: "Men",
    price: 1199,
    rating: 4.6,
    colors: ["Black", "Grey", "Navy"],
    sizes: ["S", "M", "L", "XL"],
    occasions: ["College", "Casual"],
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
  },

  {
    id: 47,
    name: "Classic Denim Shirt",
    category: "Men",
    gender: "Men",
    price: 1099,
    rating: 4.5,
    colors: ["Blue", "Dark Blue"],
    sizes: ["S", "M", "L", "XL"],
    occasions: ["Casual", "College"],
    image:
      "https://images.unsplash.com/photo-1578932750294-f5075e85f44a",
  },

  // =====================================================
  // MORE WOMEN
  // =====================================================

  {
    id: 48,
    name: "Women’s Satin Blouse",
    category: "Women",
    gender: "Women",
    price: 999,
    rating: 4.7,
    colors: ["White", "Black", "Pink"],
    sizes: ["S", "M", "L"],
    occasions: ["Formal", "Party", "Office"],
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1",
  },

  {
    id: 49,
    name: "Pleated Midi Dress",
    category: "Women",
    gender: "Women",
    price: 1599,
    rating: 4.8,
    colors: ["Blue", "Green", "Black"],
    sizes: ["S", "M", "L"],
    occasions: ["Party", "Formal", "Vacation"],
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446",
  },

  {
    id: 50,
    name: "Women's Linen Shirt",
    category: "Women",
    gender: "Women",
    price: 899,
    rating: 4.5,
    colors: ["White", "Beige", "Blue"],
    sizes: ["S", "M", "L", "XL"],
    occasions: ["Casual", "Vacation", "College"],
    image:
      "https://images.unsplash.com/photo-1604322431548-8c3e1d9f1e58",
  },

  {
    id: 51,
    name: "High Neck Knit Top",
    category: "Women",
    gender: "Women",
    price: 799,
    rating: 4.6,
    colors: ["Black", "Cream", "Brown"],
    sizes: ["S", "M", "L"],
    occasions: ["Casual", "College"],
    image:
      "https://images.unsplash.com/photo-1548624313-0396c75ce0ca",
  },

  {
    id: 52,
    name: "Elegant Wrap Dress",
    category: "Women",
    gender: "Women",
    price: 1499,
    rating: 4.8,
    colors: ["Wine", "Black", "Green"],
    sizes: ["S", "M", "L"],
    occasions: ["Party", "Formal"],
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae",
  },

  {
    id: 53,
    name: "Women's Oversized Blazer",
    category: "Women",
    gender: "Women",
    price: 1799,
    rating: 4.8,
    colors: ["Black", "Beige", "Grey"],
    sizes: ["S", "M", "L"],
    occasions: ["Formal", "Office", "Party"],
    image:
      "https://images.unsplash.com/photo-1591369822096-ffd140ec948f",
  },

  // =====================================================
  // MORE SHOES
  // =====================================================

  {
    id: 54,
    name: "Retro Canvas Sneakers",
    category: "Shoes",
    price: 1199,
    rating: 4.5,
    colors: ["White", "Black", "Red"],
    sizes: ["6", "7", "8", "9", "10"],
    occasions: ["Casual", "College"],
    image:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77",
  },

  {
    id: 55,
    name: "Urban High Top Shoes",
    category: "Shoes",
    price: 1699,
    rating: 4.7,
    colors: ["Black", "White", "Grey"],
    sizes: ["6", "7", "8", "9", "10"],
    occasions: ["College", "Casual", "Party"],
    image:
      "https://images.unsplash.com/photo-1520256862855-398228c41684",
  },

  {
    id: 56,
    name: "Comfort Walking Shoes",
    category: "Shoes",
    price: 1399,
    rating: 4.6,
    colors: ["Grey", "Black", "Blue"],
    sizes: ["6", "7", "8", "9", "10"],
    occasions: ["Sports", "Casual", "Travel"],
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  },

  // =====================================================
  // MORE ACCESSORIES
  // =====================================================

  {
    id: 57,
    name: "Structured Tote Bag",
    category: "Accessories",
    price: 1399,
    rating: 4.7,
    colors: ["Black", "Brown", "Beige"],
    sizes: ["Standard"],
    occasions: ["Office", "Casual", "Formal"],
    image:
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c",
  },

  {
    id: 58,
    name: "Premium Travel Backpack",
    category: "Accessories",
    price: 1299,
    rating: 4.6,
    colors: ["Black", "Grey", "Navy"],
    sizes: ["Standard"],
    occasions: ["Travel", "College", "Casual"],
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa",
  },

  {
    id: 59,
    name: "Minimal Silver Earrings",
    category: "Accessories",
    price: 549,
    rating: 4.5,
    colors: ["Silver", "Gold"],
    sizes: ["Standard"],
    occasions: ["Party", "Casual", "Formal"],
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908",
  },

  {
    id: 60,
    name: "Modern Fashion Scarf",
    category: "Accessories",
    price: 499,
    rating: 4.4,
    colors: ["Black", "Beige", "Blue"],
    sizes: ["Standard"],
    occasions: ["Casual", "Vacation"],
    image:
      "https://images.unsplash.com/photo-1580651214613-f4692d6d0f1d",
  },
];

export default products;