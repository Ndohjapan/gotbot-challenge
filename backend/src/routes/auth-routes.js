const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catch-async');
const { rateLimiter } = require('../middlewares/rate-limiter');
const { AuthService } = require('../services/auth-services');
const {
  validateSignUpInput,
  validateVerifyInput,
  validateLoginInput,
  validateUpdateProfileInput,
} = require('../middlewares/input-validator/auth-validator');
const { tempAuth, businessAuth } = require('../middlewares/protect');
const en = require('../../locale/en');

const service = new AuthService();

router.post(
  '/signup',
  rateLimiter({ secondsWindow: 60, allowedHits: 5 }),
  validateSignUpInput,
  catchAsync(async (req, res) => {
    const data = req.body;
    const response = await service.Signup(data);
    res.send(response);
  }),
);

router.put(
  '/profile',
  rateLimiter({ secondsWindow: 60, allowedHits: 30 }),
  businessAuth,
  validateUpdateProfileInput,
  catchAsync(async (req, res) => {
    const data = req.body;
    const id = req.user._id;
    const response = await service.CompleteProfile(id, data);
    res.send(response);
  }),
);

router.post(
  '/login',
  rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
  validateLoginInput,
  catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const response = await service.Login(email, password);
    res.send(response);
  }),
);

router.post(
  '/verify',
  rateLimiter({ secondsWindow: 60, allowedHits: 5 }),
  validateVerifyInput,
  catchAsync(async (req, res) => {
    const { token } = req.body;
    await service.VerifyToken(token);
    res.send({ message: en['verify-token-successful'] });
  }),
);

router.get(
  '/request',
  rateLimiter({ secondsWindow: 60, allowedHits: 5 }),
  tempAuth,
  catchAsync(async (req, res) => {
    const business = req.user;
    const response = await service.RequestToken(business);
    res.send(response);
  }),
);

module.exports = router;
