var mongoose = require('mongoose');
const en = require('../../../locale/en');
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
  name: {
    type: String,
    required: [true, en['category-name-required']],
  },
  price: {
    type: Number
  },
  currency: {
    type: String,
    enum: ['NGN', 'USD', 'EUR', 'CAD', 'GBP']
  },
  quantity: {
    type: String
  },
  business: {
    type: mongoose.Schema.ObjectId,
    ref: 'business',
    required: true
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'category',
    required: true
  },
  menu: {
    type: mongoose.Schema.ObjectId,
    ref: 'menu',
    required: true
  },
  images: [{
    type: Object
  }],
  active: {
    type: Boolean,
    select: false,
    default: true
  }
});

ItemSchema.index({ name: 1, business: 1, category: 1, menu: 1 }, { unique: true });

module.exports = mongoose.model('item', ItemSchema);