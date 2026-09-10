const mongoose = require('mongoose');
const connectDB = require('./db');
const Product = require('./models/Product');
const Review = require('./models/Review');
const Order = require('./models/order');

const initialCakes = [
  {
    name: "Classic Chocolate Truffle",
    category: "Chocolate",
    price: 550,
    discountPrice: 499,
    image: "/images/cake1.jpg",
    description: "Rich dark chocolate ganache layered with moist sponge and coated in glossy Belgian truffle glaze.",
    weight: "1 kg",
    isEggless: true,
    isFeatured: true,
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 34,
    amazonUrl: "https://www.amazon.in/s?k=chocolate+truffle+cake",
    tags: ["Bestseller", "Eggless", "Dark Chocolate", "Birthday Special"]
  },
  {
    name: "Wild Blueberry Cream Delight",
    category: "Berry & Fruit",
    price: 650,
    discountPrice: 599,
    image: "/images/Blueberry1.jpg",
    description: "Infused with imported wild blueberry compote and light mascarpone vanilla cream.",
    weight: "1 kg",
    isEggless: true,
    isFeatured: true,
    isBestSeller: true,
    rating: 4.8,
    reviewsCount: 22,
    amazonUrl: "https://www.amazon.in/s?k=blueberry+cake",
    tags: ["Fruit Delight", "Eggless", "Trending"]
  },
  {
    name: "Blueberry Bliss Tier Cake",
    category: "Berry & Fruit",
    price: 850,
    discountPrice: 799,
    image: "/images/Blueberry2.jpg",
    description: "Double tier artisanal celebration cake packed with real blueberry swirl and white chocolate flakes.",
    weight: "1.5 kg",
    isEggless: true,
    isFeatured: false,
    isBestSeller: false,
    rating: 4.7,
    reviewsCount: 16,
    amazonUrl: "https://www.amazon.in/s?k=blueberry+tier+cake",
    tags: ["Celebration", "Party Favorite"]
  },
  {
    name: "Blueberry Cheesecake Fantasy",
    category: "Berry & Fruit",
    price: 750,
    discountPrice: null,
    image: "/images/Blueberry3.jpg",
    description: "Baked New York style blueberry cheesecake with buttery graham crust and tart berry drizzle.",
    weight: "1 kg",
    isEggless: true,
    isFeatured: true,
    isBestSeller: false,
    rating: 4.9,
    reviewsCount: 19,
    amazonUrl: "https://www.amazon.in/s?k=blueberry+cheesecake",
    tags: ["Cheesecake", "Gourmet"]
  },
  {
    name: "Royal Velvet Blueberry Special",
    category: "Berry & Fruit",
    price: 720,
    discountPrice: 660,
    image: "/images/Blueberry4.jpg",
    description: "Sensational fusion of purple sponge layered with fresh blueberries and Swiss buttercream.",
    weight: "1 kg",
    isEggless: true,
    isFeatured: false,
    isBestSeller: false,
    rating: 4.7,
    reviewsCount: 11,
    amazonUrl: "https://www.amazon.in/s?k=blueberry+swiss+cake",
    tags: ["Royal", "Eggless"]
  },
  {
    name: "Hazelnut Praline Truffle",
    category: "Chocolate",
    price: 680,
    discountPrice: 620,
    image: "/images/Hazelnut_Chocolate.jpg",
    description: "Roasted crushed Piedmont hazelnuts folded into silk chocolate cream with crunchy wafer bottom.",
    weight: "1 kg",
    isEggless: true,
    isFeatured: true,
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 42,
    amazonUrl: "https://www.amazon.in/s?k=hazelnut+chocolate+cake",
    tags: ["Crunchy", "Premium Nut", "Bestseller"]
  },
  {
    name: "Heart Felt Chocolate Romance",
    category: "Chocolate",
    price: 620,
    discountPrice: 550,
    image: "/images/Heart_Felt_Chocolate.jpg",
    description: "Heart-shaped artisanal chocolate cake decorated with handcrafted edible red rosettes.",
    weight: "1 kg",
    isEggless: true,
    isFeatured: true,
    isBestSeller: true,
    rating: 5.0,
    reviewsCount: 51,
    amazonUrl: "https://www.amazon.in/s?k=heart+shaped+chocolate+cake",
    tags: ["Anniversary", "Valentine", "Romance"]
  },
  {
    name: "Heavenly Eggless Special",
    category: "Vanilla",
    price: 480,
    discountPrice: 430,
    image: "/images/Heavenly_Eggless_Cake.jpg",
    description: "Ultra-fluffy 100% pure vegetarian vanilla sponge whipped with fresh cream and white chocolate.",
    weight: "1 kg",
    isEggless: true,
    isFeatured: false,
    isBestSeller: true,
    rating: 4.8,
    reviewsCount: 29,
    amazonUrl: "https://www.amazon.in/s?k=pure+eggless+vanilla+cake",
    tags: ["100% Veg", "Soft Sponge", "Family Choice"]
  },
  {
    name: "High Altitude Dark Fudge",
    category: "Chocolate",
    price: 700,
    discountPrice: 649,
    image: "/images/High_attitude_chocolate.jpg",
    description: "70% single-origin Ecuadorian dark chocolate layered with chocolate fudge frosting.",
    weight: "1 kg",
    isEggless: true,
    isFeatured: false,
    isBestSeller: false,
    rating: 4.8,
    reviewsCount: 18,
    amazonUrl: "https://www.amazon.in/s?k=dark+fudge+cake",
    tags: ["Intense Cocoa", "Chef Recommendation"]
  },
  {
    name: "Royal Rasmalai Fusion Cake",
    category: "Fusion & Rasmalai",
    price: 799,
    discountPrice: 720,
    image: "/images/Rasmalai.jpg",
    description: "Cardamom-scented sponge soaked in saffron anglo-Indian milk topped with real cottage cheese dumplings and pistachios.",
    weight: "1 kg",
    isEggless: true,
    isFeatured: true,
    isBestSeller: true,
    rating: 5.0,
    reviewsCount: 65,
    amazonUrl: "https://www.amazon.in/s?k=rasmalai+cake",
    tags: ["Indian Fusion", "Festive", "Bestseller", "Signature"]
  },
  {
    name: "Kesar Pista Rasmalai Treat",
    category: "Fusion & Rasmalai",
    price: 820,
    discountPrice: 760,
    image: "/images/Rasmalai2.jpg",
    description: "Exquisite royal saffron pistachio cream crowned with gold leaf and whole mini rasmalais.",
    weight: "1 kg",
    isEggless: true,
    isFeatured: false,
    isBestSeller: false,
    rating: 4.9,
    reviewsCount: 24,
    amazonUrl: "https://www.amazon.in/s?k=kesar+pista+cake",
    tags: ["Kesar Pista", "Royal Mithai"]
  },
  {
    name: "Shahi Rasmalai Celebration",
    category: "Fusion & Rasmalai",
    price: 880,
    discountPrice: 799,
    image: "/images/Rasmalai3.jpg",
    description: "Deluxe two-pound celebration fusion cake with fresh rose petals, almonds, and saffron glaze.",
    weight: "1.5 kg",
    isEggless: true,
    isFeatured: false,
    isBestSeller: false,
    rating: 4.8,
    reviewsCount: 15,
    amazonUrl: "https://www.amazon.in/s?k=shahi+rasmalai+cake",
    tags: ["Grand Celebration", "Saffron"]
  },
  {
    name: "Almond Saffron Rasmalai",
    category: "Fusion & Rasmalai",
    price: 750,
    discountPrice: 699,
    image: "/images/Rasmalai4.jpg",
    description: "Roasted Californian slivered almonds paired with creamy rabdi infusion.",
    weight: "1 kg",
    isEggless: true,
    isFeatured: false,
    isBestSeller: false,
    rating: 4.7,
    reviewsCount: 12,
    amazonUrl: "https://www.amazon.in/s?k=almond+rasmalai+cake",
    tags: ["Nutty", "Subtle Sweetness"]
  },
  {
    name: "Rose Petal Rasmalai Supreme",
    category: "Fusion & Rasmalai",
    price: 780,
    discountPrice: 710,
    image: "/images/Rasmalai5.jpg",
    description: "Fragrant Kannauj organic rose essence blended with silky saffron cream.",
    weight: "1 kg",
    isEggless: true,
    isFeatured: false,
    isBestSeller: false,
    rating: 4.8,
    reviewsCount: 20,
    amazonUrl: "https://www.amazon.in/s?k=rose+rasmalai+cake",
    tags: ["Floral", "Eggless"]
  },
  {
    name: "Royal Red Velvet Cream Cheese",
    category: "Red Velvet",
    price: 680,
    discountPrice: 610,
    image: "/images/Red_Velvet.jpg",
    description: "Classic scarlet cocoa sponge layered with Philadelphia cream cheese frosting and velvet crumb dust.",
    weight: "1 kg",
    isEggless: true,
    isFeatured: true,
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 48,
    amazonUrl: "https://www.amazon.in/s?k=red+velvet+cake",
    tags: ["Cream Cheese", "Romantic", "Bestseller"]
  },
  {
    name: "Red Velvet Truffle Swirl",
    category: "Red Velvet",
    price: 710,
    discountPrice: 650,
    image: "/images/Red_velvet2.jpg",
    description: "Combination of rich red velvet sponge with white chocolate truffle ribbons.",
    weight: "1 kg",
    isEggless: true,
    isFeatured: false,
    isBestSeller: false,
    rating: 4.7,
    reviewsCount: 19,
    amazonUrl: "https://www.amazon.in/s?k=red+velvet+truffle",
    tags: ["White Truffle", "Silky"]
  },
  {
    name: "Red Velvet Heart Anniversary",
    category: "Red Velvet",
    price: 740,
    discountPrice: 680,
    image: "/images/Red_velvet3.jpg",
    description: "Hand-sculpted heart shape with piped vanilla buttercream rosettes and personalized message plaque.",
    weight: "1 kg",
    isEggless: true,
    isFeatured: true,
    isBestSeller: true,
    rating: 5.0,
    reviewsCount: 38,
    amazonUrl: "https://www.amazon.in/s?k=red+velvet+heart+cake",
    tags: ["Heart Shaped", "Anniversary Special"]
  },
  {
    name: "Strawberry Chocolate Duet",
    category: "Berry & Fruit",
    price: 520,
    discountPrice: 470,
    image: "/images/StrawberryChocolateCake.jpg",
    description: "Fresh farm strawberries nestled between velvety layers of milk chocolate cream.",
    weight: "1 kg",
    isEggless: true,
    isFeatured: true,
    isBestSeller: true,
    rating: 4.8,
    reviewsCount: 31,
    amazonUrl: "https://www.amazon.in/s?k=strawberry+chocolate+cake",
    tags: ["Berry Choco", "Fresh Fruits"]
  },
  {
    name: "Madagascar Vanilla Bean Delight",
    category: "Vanilla",
    price: 450,
    discountPrice: 399,
    image: "/images/Vanila.jpg",
    description: "Real Madagascar vanilla bean infused sponge with whipped buttercream and caramel drops.",
    weight: "1 kg",
    isEggless: true,
    isFeatured: true,
    isBestSeller: false,
    rating: 4.7,
    reviewsCount: 25,
    amazonUrl: "https://www.amazon.in/s?k=madagascar+vanilla+cake",
    tags: ["Real Vanilla", "Timeless Classic"]
  },
  {
    name: "French Vanilla Buttercream",
    category: "Vanilla",
    price: 480,
    discountPrice: 420,
    image: "/images/Vanila2.jpg",
    description: "Smooth French buttercream layered between golden vanilla sponge cakes.",
    weight: "1 kg",
    isEggless: true,
    isFeatured: false,
    isBestSeller: false,
    rating: 4.6,
    reviewsCount: 14,
    amazonUrl: "https://www.amazon.in/s?k=french+vanilla+cake",
    tags: ["Buttercream", "Delicate"]
  },
  {
    name: "Vanilla Caramel Ripple",
    category: "Vanilla",
    price: 510,
    discountPrice: 460,
    image: "/images/Vanila3.jpg",
    description: "Vanilla sponge swirled with salted butter caramel and roasted cashew crunch.",
    weight: "1 kg",
    isEggless: true,
    isFeatured: false,
    isBestSeller: false,
    rating: 4.7,
    reviewsCount: 18,
    amazonUrl: "https://www.amazon.in/s?k=vanilla+caramel+cake",
    tags: ["Salted Caramel", "Crunchy"]
  },
  {
    name: "Golden Vanilla Confetti",
    category: "Vanilla",
    price: 460,
    discountPrice: null,
    image: "/images/Vanilla1.jpg",
    description: "Playful celebration cake with rainbow sprinkles baked right inside the tender sponge.",
    weight: "1 kg",
    isEggless: true,
    isFeatured: false,
    isBestSeller: false,
    rating: 4.8,
    reviewsCount: 21,
    amazonUrl: "https://www.amazon.in/s?k=confetti+vanilla+cake",
    tags: ["Kids Birthday", "Rainbow"]
  },
  {
    name: "Grand Floral Wedding Cake",
    category: "Designer & Custom",
    price: 1450,
    discountPrice: 1299,
    image: "/images/Cake2.jpg",
    description: "Multitiered designer wedding masterpiece with handcrafted sugar flowers and gold leaf accents.",
    weight: "2.5 kg",
    isEggless: true,
    isFeatured: true,
    isBestSeller: false,
    rating: 5.0,
    reviewsCount: 28,
    amazonUrl: "https://www.amazon.in/s?k=wedding+designer+cake",
    tags: ["Wedding", "Custom Designer", "Luxury"]
  },
  {
    name: "Opulent Rose Gold Tier",
    category: "Designer & Custom",
    price: 1650,
    discountPrice: 1499,
    image: "/images/Cake3.jpg",
    description: "Custom sculpted tiered celebration cake with edible luster dust and pearl beadings.",
    weight: "3 kg",
    isEggless: true,
    isFeatured: true,
    isBestSeller: false,
    rating: 4.9,
    reviewsCount: 17,
    amazonUrl: "https://www.amazon.in/s?k=tier+birthday+cake",
    tags: ["Masterpiece", "Reception"]
  },
  {
    name: "Dark Belgian Chocolate Mousse",
    category: "Chocolate",
    price: 590,
    discountPrice: 530,
    image: "/images/chocolate2.jpg",
    description: "Silky 64% Belgian dark chocolate mousse whipped to airy perfection over flourless sponge.",
    weight: "1 kg",
    isEggless: true,
    isFeatured: false,
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 37,
    amazonUrl: "https://www.amazon.in/s?k=belgian+chocolate+mousse+cake",
    tags: ["Mousse", "Rich Cocoa"]
  },
  {
    name: "Triple Chocolate Explosion",
    category: "Chocolate",
    price: 640,
    discountPrice: 570,
    image: "/images/Chocolate3.jpg",
    description: "Three layers of bliss: dark chocolate sponge, milk chocolate buttercream, and white chocolate ganache.",
    weight: "1 kg",
    isEggless: true,
    isFeatured: true,
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 44,
    amazonUrl: "https://www.amazon.in/s?k=triple+chocolate+cake",
    tags: ["Triple Layer", "Chocoholic"]
  }
];

const initialReviews = [
  {
    name: "Rahul Banerjee",
    role: "Verified Buyer",
    rating: 5,
    comment: "The Classic Chocolate Truffle for my birthday was unbelievably fresh and moist. Arrived within 2 hours!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop",
    cakeName: "Classic Chocolate Truffle"
  },
  {
    name: "Pooja Das",
    role: "Regular Customer",
    rating: 5,
    comment: "Ordered the eggless Strawberry Chocolate cake. The texture was super soft and taste was balanced perfectly.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop",
    cakeName: "Strawberry Chocolate Duet"
  },
  {
    name: "Anirban Sharma",
    role: "Wedding Order",
    rating: 5,
    comment: "Best custom-designed wedding cake in town! Everyone at the reception was stunned by the elegance and flavor.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop",
    cakeName: "Grand Floral Wedding Cake"
  },
  {
    name: "Sneha Roy",
    role: "Cake Enthusiast",
    rating: 5,
    comment: "Royal Rasmalai Fusion Cake is an absolute revelation. Real rasmalai taste with light fluffy sponge!",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop",
    cakeName: "Royal Rasmalai Fusion Cake"
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding products into MongoDB...');
      await Product.insertMany(initialCakes);
      console.log(`✅ ${initialCakes.length} products inserted into MongoDB!`);
    } else {
      console.log(`ℹ️  Database already has ${count} products. Skipping product seed.`);
    }

    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0) {
      await Review.insertMany(initialReviews);
      console.log(`✅ ${initialReviews.length} customer reviews inserted into MongoDB!`);
    }

    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      await Order.create({
        orderId: 'CK-10189',
        customer: {
          name: 'Rahul Roy',
          email: 'rahul.roy@example.com',
          phone: '+91 98765 43210',
          address: '42 Park Street, Flat 3B',
          city: 'Kolkata',
          pincode: '700016',
          cakeMessage: 'Happy Birthday Rahul!',
          deliveryDate: 'Today'
        },
        items: [{
          name: 'Classic Chocolate Truffle',
          price: 499,
          quantity: 1,
          image: '/images/cake1.jpg',
          weight: '1 kg'
        }],
        subtotal: 499,
        discount: 0,
        deliveryFee: 0,
        totalAmount: 499,
        paymentMethod: 'UPI',
        paymentStatus: 'Paid',
        orderStatus: 'Baking'
      });
      console.log('✅ Initial demo order created.');
    }
  } catch (error) {
    console.error('❌ Error during seeding:', error.message);
  }
};

// If run directly via node seed.js
if (require.main === module) {
  seedDatabase().then(() => {
    console.log('✨ Seeding finished.');
    process.exit(0);
  });
}

module.exports = seedDatabase;
