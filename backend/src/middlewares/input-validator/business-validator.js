const { validationResult, param } = require('express-validator');
const en = require('../../../locale/en');
const ValidationException = require('../../errors/validation-exception');
const mongoose = require('mongoose');

const validateBusinessId = [
  param('id')
    .not()
    .isEmpty()
    .withMessage(en['id-required'])
    .bail()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage(en['id-format']),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationException(errors.array()));
    }
    next();
  },
];


module.exports = { validateBusinessId };
