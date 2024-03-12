const { validationResult, check, param } = require('express-validator');
const en = require('../../../locale/en');
const ValidationException = require('../../errors/validation-exception');
const mongoose = require('mongoose');

const validateItemInput = [
  check('name')
    .notEmpty()
    .withMessage(en['item-name-required'])
    .bail()
    .isString()
    .withMessage(en['item-name-format']),
  check('price')
    .notEmpty()
    .withMessage(en['item-price-required'])
    .bail()
    .isNumeric()
    .withMessage(en['item-price-format']),
  check('currency')
    .notEmpty()
    .withMessage(en['item-currency-required'])
    .bail()
    .custom((value) => {
      if (!['NGN', 'USD', 'GBP', 'EUR', 'CAD'].includes(value)) {
        throw new Error(en['item-currency-format']);
      }
      return true;
    }),
  check('quantity')
    .notEmpty()
    .withMessage(en['item-quantity-required'])
    .bail()
    .isString()
    .withMessage(en['item-quantity-format']),
  check('category')
    .notEmpty()
    .withMessage(en['item-category-required'])
    .bail()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage(en['item-category-format']),
  check('menu')
    .notEmpty()
    .withMessage(en['menu-id-required'])
    .bail()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage(en['menu-id-format']),
  check('images')
    .notEmpty()
    .withMessage(en['category-image-required'])
    .bail()
    .isArray()
    .withMessage(en['category-image-format'])
    .bail()
    .custom((value) => {
      return Array.isArray(value) && value.every((item) => typeof item === 'object');
    })
    .withMessage(en['category-image-format']),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationException(errors.array()));
    }
    next();
  },
];

const validateItemUpdateInput = [
  check('name')
    .optional()
    .isString()
    .withMessage(en['item-name-format']),
  check('price')
    .optional()
    .isNumeric()
    .withMessage(en['item-price-format']),
  check('currency')
    .optional()
    .custom((value) => {
      if (!['NGN', 'USD', 'GBP', 'EUR', 'CAD'].includes(value)) {
        throw new Error(en['item-currency-format']);
      }
      return true;
    }),
  check('quantity')
    .optional()
    .isString()
    .withMessage(en['item-quantity-format']),
  check('category')
    .optional()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage(en['item-category-format']),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationException(errors.array()));
    }
    next();
  },
];

const validateItemId = [
  check('id')
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

const validateItemQueryMenu = [
  check('menu')
    .not()
    .isEmpty()
    .withMessage(en['menu-id-required'])
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

const validateItemQueryCategory = [
  check('category')
    .optional()
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

module.exports = { validateItemInput, validateItemQueryCategory, validateItemUpdateInput, validateItemId, validateItemQueryMenu };
