var mongoose = require('mongoose');
const en = require('../../../locale/en');
var Schema = mongoose.Schema;

var MenuSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, en['menu-name-required']],
    },
    business: {
      type: mongoose.Schema.ObjectId,
      ref: 'business',
    },
    description: {
      type: String,
    },
    active: {
      type: Boolean,
      select: false,
      default: true,
    },
    categories: {
      type: Number,
      default: 0,
    },
    items: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

module.exports = mongoose.model('menu', MenuSchema);
