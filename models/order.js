const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    default: () => 'CK-' + Math.floor(100000 + Math.random() * 900000),
  },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, default: 'Kolkata' },
    pincode: { type: String, default: '700001' },
    cakeMessage: { type: String, default: '' },
    deliveryDate: { type: String, default: '' },
    deliverySlot: { type: String, default: 'Standard (2-4 PM)' },
  },
  items: [{
    productId: { type: String },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    image: { type: String },
    weight: { type: String, default: '1 kg' },
  }],
  subtotal: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  deliveryFee: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['UPI', 'Card', 'NetBanking', 'COD', 'AmazonPay'],
    default: 'UPI',
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Pending', 'Failed'],
    default: 'Paid',
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Baking', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  transactionId: {
    type: String,
    default: () => 'TXN-' + Date.now().toString().slice(-8),
  },
  deliveryAgent: {
    name: { type: String, default: 'Vikram Singh' },
    phone: { type: String, default: '+91 98765 43210' },
    avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop' },
    vehicle: { type: String, default: 'WB-02-AK-4821 (Eco Chilled Van)' },
    rating: { type: Number, default: 4.95 },
    totalDeliveries: { type: Number, default: 1420 },
    boxTemperature: { type: String, default: '4.2°C (Optimal Cake Chill)' },
    etaMinutes: { type: Number, default: 18 },
    currentStatus: { type: String, default: 'Out for Delivery • On the way to doorstep' },
    currentLocationName: { type: String, default: 'Park Street Flyover (1.4 km away)' }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Order', orderSchema);
