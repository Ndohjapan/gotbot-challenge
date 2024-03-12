const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catch-async');
const { rateLimiter } = require('../middlewares/rate-limiter');
const { BusinessService } = require('../services/business-service');
const { businessAuth } = require('../middlewares/protect');
const { validateBusinessId } = require('../middlewares/input-validator/business-validator');

const service = new BusinessService();

router.get(
  '/:business',
  rateLimiter({ secondsWindow: 60, allowedHits: 30 }),
  catchAsync(async (req, res) => {
    const id = req.params.business;
    const business = await service.FindBusinessById(id);
    res.send(business);
  }),
);

router.put(
  '/:id',
  rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
  businessAuth,
  validateBusinessId,
  catchAsync(async (req, res) => {
    const data = req.body;
    const id = req.params.id;
    const business = await service.UpdateBusiness(data, id);
    res.send(business);
  }),
);

router.put(
  '/:id/contact/:contact',
  rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
  businessAuth,
  validateBusinessId,
  catchAsync(async (req, res) => {
    const data = req.body;
    const id = req.params.id;
    const contact_id = req.params.contact;
    const contact = await service.UpdateContact(data, id, contact_id);
    res.send(contact);
  }),
);

module.exports = router;