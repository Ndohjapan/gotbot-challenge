const en = require('../../locale/en');

module.exports = function ValueExpirationException(message, status) {
  this.status = status || 410;
  this.message = message || en['verify-token-expired'];
};
