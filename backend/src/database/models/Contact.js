var mongoose = require('mongoose');
const en = require('../../../locale/en');
var Schema = mongoose.Schema;

var ContactSchema = new Schema({
  name: {
    type: String,
    required: [true, en['contact-name-required']],
  },
  number: {
    type: String,
    required: [true, en['contact-number-required']]
  },
  role: {
    type: String,
    enum: ['owner', 'manager', 'employee'],
    required: [true, en['contact-role-format']]
  },
  business: {
    type: mongoose.Schema.ObjectId,
    ref: 'business'
  },
  active: {
    type: Boolean,
    select: false,
    default: true
  }
});

module.exports = mongoose.model('contact', ContactSchema);