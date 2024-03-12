const { validationResult, check, param } = require('express-validator');
const en = require('../../../locale/en');
const ValidationException = require('../../errors/validation-exception');
const mongoose = require('mongoose');

const validateMenuInput = [
  check('name')
    .notEmpty()
    .withMessage(en['menu-name-required'])
    .bail()
    .isString()
    .withMessage(en['menu-name-format']),
  check('description')
    .optional()
    .isString()
    .withMessage(en['menu-description-format']),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationException(errors.array()));
    }
    next();
  },
];

const validateMenuUpdateInput = [
  check('name')
    .optional()
    .isString()
    .withMessage(en['menu-name-format']),
  check('description')
    .optional()
    .isString()
    .withMessage(en['menu-description-format']),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationException(errors.array()));
    }
    next();
  },
];

const validateMenuId = [
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

module.exports = { validateMenuInput, validateMenuId, validateMenuUpdateInput };
