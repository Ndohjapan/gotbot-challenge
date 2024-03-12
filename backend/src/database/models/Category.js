var mongoose = require('mongoose');
const en = require('../../../locale/en');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
  name: {
    type: String,
    required: [true, en['category-name-required']],
  },
  business: {
    type: mongoose.Schema.ObjectId,
    ref: 'business',
  },
  menu: {
    type: mongoose.Schema.ObjectId,
    ref: 'menu',
  },
  image: {
    type: Object,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  items: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('category', CategorySchema);
