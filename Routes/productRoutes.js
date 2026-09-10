const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/order');

// 1. Paginated Infinite Scroll Gallery API
router.get('/api/gallery/cakes', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;
    const searchQuery = (req.query.q || '').trim();
    const category = (req.query.category || '').trim();

    const filter = { inStock: true };

    if (searchQuery) {
      filter.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { category: { $regex: searchQuery, $options: 'i' } },
        { tags: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } }
      ];
    }

    if (category && category.toLowerCase() !== 'all') {
      filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    const [cakes, totalCount] = await Promise.all([
      Product.find(filter).sort({ isBestSeller: -1, rating: -1, createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(filter)
    ]);

    const hasMore = skip + cakes.length < totalCount;

    res.json({
      success: true,
      page,
      limit,
      total: totalCount,
      hasMore,
      count: cakes.length,
      cakes
    });
  } catch (error) {
    console.error('Gallery API Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch gallery cakes' });
  }
});

// 2. Live Search API
router.get('/api/products/search', async (req, res) => {
  try {
    const searchQuery = (req.query.q || '').trim();
    if (!searchQuery) {
      const allProducts = await Product.find({ inStock: true }).limit(20);
      return res.json({ success: true, count: allProducts.length, products: allProducts });
    }

    const products = await Product.find({
      inStock: true,
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { category: { $regex: searchQuery, $options: 'i' } },
        { tags: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } }
      ]
    }).limit(30);

    res.json({ success: true, count: products.length, products });
  } catch (error) {
    console.error('Search API Error:', error);
    res.status(500).json({ success: false, message: 'Search failed' });
  }
});

// 3. Create Order & Payment API
router.post('/api/orders', async (req, res) => {
  try {
    const { customer, items, subtotal, discount, deliveryFee, totalAmount, paymentMethod } = req.body;

    if (!customer || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid order data' });
    }

    const newOrder = new Order({
      customer,
      items,
      subtotal: Number(subtotal),
      discount: Number(discount || 0),
      deliveryFee: Number(deliveryFee || 0),
      totalAmount: Number(totalAmount),
      paymentMethod: paymentMethod || 'UPI',
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
      orderStatus: 'Out for Delivery',
      deliveryAgent: {
        name: 'Vikram Singh',
        phone: '+91 98765 43210',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
        vehicle: 'WB-02-AK-4821 (Eco Chilled Electric Van)',
        rating: 4.95,
        totalDeliveries: 1420,
        boxTemperature: '4.2°C (Optimal Cake Chill)',
        etaMinutes: 18,
        currentStatus: 'Out for Delivery • On the way to delivery location',
        currentLocationName: 'Park Street Flyover (1.4 km away)'
      }
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully!',
      order: savedOrder
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ success: false, message: 'Could not process order: ' + error.message });
  }
});

// 4. Get Single Order by Order ID (for tracking / live agent / invoice)
router.get('/api/orders/:orderId', async (req, res) => {
  try {
    const rawId = (req.params.orderId || '').trim();
    const formattedId = rawId.startsWith('CK-') ? rawId : 'CK-' + rawId;

    const order = await Order.findOne({
      $or: [
        { orderId: rawId },
        { orderId: rawId.toUpperCase() },
        { orderId: formattedId },
        { orderId: formattedId.toUpperCase() }
      ]
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching order' });
  }
});

module.exports = router;