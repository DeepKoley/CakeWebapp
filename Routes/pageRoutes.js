const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Review = require('../models/Review');
const Order = require('../models/order');

// 1. Home Page Route
router.get('/', async (req, res) => {
  try {
    const [featuredCakes, bestSellers, reviews] = await Promise.all([
      Product.find({ isFeatured: true, inStock: true }).limit(8),
      Product.find({ isBestSeller: true, inStock: true }).limit(8),
      Review.find({ isApproved: true }).limit(6)
    ]);

    res.render('pages/index', {
      featuredCakes,
      bestSellers,
      reviews,
      pageTitle: 'CakerMaker | Luxury Handcrafted Artisan Bakery'
    });
  } catch (error) {
    console.error('Home route error:', error);
    res.render('pages/index', {
      featuredCakes: [],
      bestSellers: [],
      reviews: [],
      pageTitle: 'CakerMaker | Handcrafted Cakes'
    });
  }
});

// 2. Menu Page Route
router.get('/menu', async (req, res) => {
  try {
    const products = await Product.find({ inStock: true }).sort({ isBestSeller: -1, rating: -1 });
    const categories = await Product.distinct('category');

    res.render('pages/menu', {
      products,
      categories,
      pageTitle: 'Our Artisanal Cake Menu | CakerMaker'
    });
  } catch (error) {
    console.error('Menu route error:', error);
    res.render('pages/menu', { products: [], categories: [], pageTitle: 'Cake Menu' });
  }
});

// 3. About Us Route
router.get(['/about', '/about_us'], async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: true });
    const signatureCakes = await Product.find({ isFeatured: true }).limit(4);

    res.render('pages/about_us', {
      reviews,
      signatureCakes,
      pageTitle: 'About Us | Our Story & Passion | CakerMaker'
    });
  } catch (error) {
    console.error('About route error:', error);
    res.render('pages/about_us', { reviews: [], signatureCakes: [], pageTitle: 'About Us' });
  }
});

// 4. Gallery Page Route (Infinite scroll page)
router.get('/gallery', async (req, res) => {
  try {
    const initialCakes = await Product.find({ inStock: true }).limit(8);
    const categories = await Product.distinct('category');

    res.render('pages/Gallery', {
      initialCakes,
      categories,
      pageTitle: 'Cake Gallery & Infinite Showcase | CakerMaker'
    });
  } catch (error) {
    console.error('Gallery route error:', error);
    res.render('pages/Gallery', { initialCakes: [], categories: [], pageTitle: 'Cake Gallery' });
  }
});

// 5. Cart Page Route
router.get('/cart', (req, res) => {
  res.render('pages/cart', {
    pageTitle: 'Your Sweet Shopping Cart | CakerMaker'
  });
});

// 6. Product Details Route
router.get('/product/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).render('pages/index', { error: 'Cake not found' });
    }
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(4);

    res.render('pages/product_Details', {
      product,
      relatedProducts,
      pageTitle: `${product.name} | CakerMaker`
    });
  } catch (error) {
    console.error('Product detail error:', error);
    res.redirect('/menu');
  }
});

// 7. Track Order & Live Delivery Agent Route
router.get(['/track', '/track/:orderId'], async (req, res) => {
  try {
    const rawId = (req.params.orderId || req.query.orderId || '').trim();
    let order = null;

    if (rawId) {
      const formattedId = rawId.startsWith('CK-') ? rawId : 'CK-' + rawId;
      order = await Order.findOne({
        $or: [
          { orderId: rawId },
          { orderId: rawId.toUpperCase() },
          { orderId: formattedId },
          { orderId: formattedId.toUpperCase() }
        ]
      });
    }

    // If no specific order found, find the most recent order
    if (!order) {
      order = await Order.findOne().sort({ createdAt: -1 });
    }

    // Fallback demo order for pristine live tracking experience if database has no orders yet
    if (!order) {
      order = {
        orderId: 'CK-882194',
        customer: {
          name: 'Deepak Kumar',
          phone: '+91 98765 43210',
          address: 'Flat 4B, Silver Oak Residency, Park Street',
          city: 'Kolkata',
          pincode: '700016',
          cakeMessage: 'Happy Birthday Deepak! 🎉',
          deliverySlot: 'Express Delivery (Within 2 Hours)'
        },
        items: [
          {
            name: 'Belgian Chocolate Truffle (1 kg)',
            price: 650,
            quantity: 1,
            image: '/images/cake1.jpg',
            weight: '1 kg'
          }
        ],
        subtotal: 650,
        discount: 130,
        deliveryFee: 0,
        totalAmount: 520,
        paymentMethod: 'UPI',
        paymentStatus: 'Paid',
        orderStatus: 'Out for Delivery',
        deliveryAgent: {
          name: 'Vikram Singh',
          phone: '+91 98765 43210',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
          vehicle: 'WB-02-AK-4821 (Eco Chilled Van)',
          rating: 4.95,
          totalDeliveries: 1420,
          boxTemperature: '4.2°C (Optimal Cake Chill)',
          etaMinutes: 18,
          currentStatus: 'Out for Delivery • On the way to delivery location',
          currentLocationName: 'Park Street Flyover (1.4 km away)'
        },
        createdAt: new Date()
      };
    } else if (!order.deliveryAgent || !order.deliveryAgent.name) {
      // Ensure existing order has agent info populated
      order.deliveryAgent = {
        name: 'Vikram Singh',
        phone: '+91 98765 43210',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
        vehicle: 'WB-02-AK-4821 (Eco Chilled Van)',
        rating: 4.95,
        totalDeliveries: 1420,
        boxTemperature: '4.2°C (Optimal Cake Chill)',
        etaMinutes: 18,
        currentStatus: 'Out for Delivery • On the way to delivery location',
        currentLocationName: 'Park Street Flyover (1.4 km away)'
      };
    }

    res.render('pages/track', {
      order,
      searchQuery: rawId,
      pageTitle: `Live Delivery Tracker & Helpline | CakerMaker`
    });
  } catch (error) {
    console.error('Track route error:', error);
    res.redirect('/');
  }
});

module.exports = router;