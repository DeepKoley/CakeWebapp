const Product = require('../models/Product');
const Order = require('../models/order');

// 1. Dashboard Overview
exports.getDashboard = async (req, res) => {
  try {
    const [totalCakes, totalOrders, recentOrders] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      Order.find().sort({ createdAt: -1 }).limit(6)
    ]);

    // Calculate total sales
    const allOrders = await Order.find({ paymentStatus: 'Paid' });
    const totalSales = allOrders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

    const pendingOrdersCount = await Order.countDocuments({
      orderStatus: { $in: ['Pending', 'Baking', 'Out for Delivery'] }
    });

    res.render('admin/Dashboard', {
      totalCakes,
      totalOrders,
      totalSales,
      pendingOrdersCount,
      recentOrders,
      pageTitle: 'Admin Dashboard | CakerMaker'
    });
  } catch (error) {
    console.error('Admin Dashboard Error:', error);
    res.status(500).send('Error loading dashboard');
  }
};

// 2. Add New Cake Form
exports.getAddCake = (req, res) => {
  res.render('admin/add_cake', {
    pageTitle: 'Add New Cake | Admin'
  });
};

// 3. Process Add Cake POST
exports.postAddCake = async (req, res) => {
  try {
    const { name, category, price, discountPrice, image, description, isEggless, isFeatured, isBestSeller, amazonUrl, tags } = req.body;

    const cake = new Product({
      name,
      category,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : null,
      image: image || '/images/cake1.jpg',
      description: description || 'Artisan handcrafted cake baked fresh with love.',
      isEggless: isEggless === 'on' || isEggless === true,
      isFeatured: isFeatured === 'on' || isFeatured === true,
      isBestSeller: isBestSeller === 'on' || isBestSeller === true,
      amazonUrl: amazonUrl || `https://www.amazon.in/s?k=${encodeURIComponent(name)}`,
      tags: tags ? tags.split(',').map(t => t.trim()) : ['Artisan', 'Fresh']
    });

    await cake.save();
    console.log(`✅ Cake added to DB: ${cake.name}`);
    res.redirect('/admin/manage-cake?added=true');
  } catch (error) {
    console.error('Add Cake Error:', error);
    res.status(500).send('Error saving cake: ' + error.message);
  }
};

// 4. Manage All Cakes
exports.getManageCake = async (req, res) => {
  try {
    const cakes = await Product.find().sort({ createdAt: -1 });
    res.render('admin/manage_cake', {
      cakes,
      pageTitle: 'Manage Cakes | Admin'
    });
  } catch (error) {
    res.status(500).send('Error loading cakes');
  }
};

// 5. Delete Cake
exports.postDeleteCake = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/admin/manage-cake?deleted=true');
  } catch (error) {
    res.status(500).send('Error deleting cake');
  }
};

// 6. View All Orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.render('admin/orders', {
      orders,
      pageTitle: 'Customer Orders | Admin'
    });
  } catch (error) {
    res.status(500).send('Error loading orders');
  }
};

// 7. Update Order Status
exports.postUpdateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await Order.findByIdAndUpdate(req.params.id, { orderStatus: status });
    res.redirect('/admin/orders?updated=true');
  } catch (error) {
    res.status(500).send('Error updating order');
  }
};

// 8. Admin Login
exports.getLogin = (req, res) => {
  res.render('admin/login', {
    pageTitle: 'Admin Login | CakerMaker'
  });
};

exports.postLogin = (req, res) => {
  // Simple administrative entry for demonstration
  res.redirect('/admin/dashboard');
};
