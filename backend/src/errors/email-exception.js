const en = require('../../locale/en');

module.exports = function EmailException() {
  this.status = 202;
  this.message = en['email-not-sent'];
};
