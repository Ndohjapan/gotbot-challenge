const { validationResult, check } = require('express-validator');
const en = require('../../../locale/en');
const ValidationException = require('../../errors/validation-exception');

const validateSignUpInput = [
  check('name')
    .notEmpty()
    .withMessage(en['business-name-required'])
    .bail()
    .isString()
    .withMessage(en['business-name-format']),
  check('email')
    .notEmpty()
    .withMessage(en['email-required'])
    .bail()
    .isEmail()
    .withMessage(en['email-format']),
  check('password')
    .notEmpty()
    .withMessage(en['password-required'])
    .bail()
    .isString()
    .withMessage(en['password-format'])
    .bail()
    .custom((value) => {
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
      if (!passwordRegex.test(value)) {
        throw new Error(en['password-format']);
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationException(errors.array()));
    }
    next();
  },
];

const validateUpdateProfileInput = [
  check('details')
    .optional()
    .isString()
    .withMessage(en['business-details-format']),
  check('country')
    .notEmpty()
    .withMessage(en['country-required'])
    .bail()
    .isString()
    .withMessage(en['country-format']),
  check('state')
    .notEmpty()
    .withMessage(en['state-required'])
    .bail()
    .isString()
    .withMessage(en['country-format']),
  check('logo')
    .notEmpty()
    .withMessage(en['logo-required'])
    .bail()
    .isObject()
    .withMessage(en['logo-format']),
  check('contactName')
    .notEmpty()
    .withMessage(en['contact-name-required'])
    .bail()
    .isString()
    .withMessage(en['contact-name-format']),
  check('contactRole')
    .notEmpty()
    .withMessage(en['contact-role-required'])
    .bail()
    .isString()
    .withMessage(en['contact-role-format'])
    .bail()
    .custom((value) => {
      if (!['employee', 'owner', 'manager'].includes(value)) {
        throw new Error(en['contact-role-format']);
      }

      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationException(errors.array()));
    }
    next();
  },
];

const validateLoginInput = [
  check('email')
    .notEmpty()
    .withMessage(en['email-required'])
    .bail()
    .isEmail()
    .withMessage(en['email-format']),
  check('password')
    .notEmpty()
    .withMessage(en['password-required'])
    .bail()
    .isString()
    .withMessage(en['password-format'])
    .bail()
    .custom((value) => {
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
      if (!passwordRegex.test(value)) {
        throw new Error(en['password-format']);
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationException(errors.array()));
    }
    next();
  },
];

const validateVerifyInput = [
  check('token')
    .notEmpty()
    .withMessage(en['verify-code-required'])
    .bail()
    .isString()
    .withMessage(en['verify-code-format']),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationException(errors.array()));
    }
    next();
  },
];

module.exports = { validateSignUpInput, validateVerifyInput, validateLoginInput, validateUpdateProfileInput };
