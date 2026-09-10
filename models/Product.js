const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Cake name is required'],
    trim: true,
  },
  slug: {
    type: String,
    lowercase: true,
    index: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
    enum: ['Chocolate', 'Vanilla', 'Red Velvet', 'Berry & Fruit', 'Fusion & Rasmalai', 'Designer & Custom'],
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'],
  },
  discountPrice: {
    type: Number,
    default: null,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: 'Artisan handcrafted cake made fresh to order with pure butter, rich cream, and premium chocolate.',
  },
  weight: {
    type: String,
    default: '1 kg',
  },
  isEggless: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isBestSeller: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 4.8,
    min: 1,
    max: 5,
  },
  reviewsCount: {
    type: Number,
    default: 18,
  },
  amazonUrl: {
    type: String,
    default: '',
  },
  tags: [{
    type: String,
  }],
  inStock: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Auto-generate slug before save if not present
productSchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  if (!this.amazonUrl && this.name) {
    this.amazonUrl = `https://www.amazon.in/s?k=${encodeURIComponent('fresh bakery ' + this.name)}`;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
