const { validationResult, check, param } = require('express-validator');
const en = require('../../../locale/en');
const ValidationException = require('../../errors/validation-exception');
const mongoose = require('mongoose');

const validateCategoryInput = [
  check('name')
    .notEmpty()
    .withMessage(en['category-name-required'])
    .bail()
    .isString()
    .withMessage(en['category-format']),
  check('menu')
    .notEmpty()
    .withMessage(en['category-menu-required'])
    .bail()
    .isString()
    .withMessage(en['category-menu-format'])
    .bail()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage(en['menu-id-format']),
  check('image')
    .notEmpty()
    .withMessage(en['category-image-required'])
    .bail()
    .isObject()
    .withMessage(en['category-image-format']),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationException(errors.array()));
    }
    next();
  },
];

const validateCategoryUpdateInput = [
  check('name')
    .optional()
    .isString()
    .withMessage(en['category-format']),
  check('image')
    .optional()
    .isObject()
    .withMessage(en['category-image-format']),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationException(errors.array()));
    }
    next();
  },
];

const validateCategoryId = [
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

const validateCategoryQueryMenu = [
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

module.exports = { validateCategoryInput, validateCategoryId, validateCategoryQueryMenu, validateCategoryUpdateInput };
