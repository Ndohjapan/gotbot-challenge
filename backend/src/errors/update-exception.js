const en = require('../../locale/en');

module.exports = function UpdateException(message, status) {
  this.status = status || 422;
  this.message = message || en['business-update-error'];
};