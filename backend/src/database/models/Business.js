var mongoose = require('mongoose');
const en = require('../../../locale/en');
var Schema = mongoose.Schema;

var BusinessSchema = new Schema({
  name: {
    type: String,
    required: [true, en['business-name-required']],
    unique: true
  },
  email: {
    type: String,
    required: [true, en['email-required']],
    unique: true
  },
  password: {
    type: String,
    required: [true, en['password-required']],
  },
  country: {
    type: String,
  },
  state: {
    type: String,
  },
  number: {
    type: String,
  },
  logo: {
    type: Object,
  },
  backgroundImage: {
    type: Object,
  },
  instagram: {
    type: String
  },
  whatsapp: {
    type: String
  },
  tiktok: {
    type: String
  },
  expiryTime:{
    type: Date
  },
  verified: {
    type: Boolean,
    default: false 
  },
  profileComplete: {
    type: Boolean,
    default: false,
    required: true
  },
  active: {
    type: Boolean,
    select: false,
    default: true
  },
});

module.exports = mongoose.model('business', BusinessSchema);