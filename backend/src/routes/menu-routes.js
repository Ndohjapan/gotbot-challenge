const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catch-async');
const { rateLimiter } = require('../middlewares/rate-limiter');
const { MenuService } = require('../services/menu-services');
const { validateMenuId, validateMenuInput, validateMenuUpdateInput } = require('../middlewares/input-validator/menu-validator');
const { businessAuth } = require('../middlewares/protect');

const service = new MenuService();

router.post(
  '/',
  rateLimiter({ secondsWindow: 60, allowedHits: 30 }),
  businessAuth,
  validateMenuInput,
  catchAsync(async (req, res) => {
    const menu_data = req.body;
    const id = req.user._id;
    const menu = await service.CreateMenu(menu_data, id);
    res.send(menu);
  }),
);

router.get(
  '/',
  rateLimiter({ secondsWindow: 60, allowedHits: 30 }),
  businessAuth,
  catchAsync(async (req, res) => {
    const id = req.user._id;
    const menues = await service.FindMenues(id);
    res.send(menues);
  }),
);

router.get(
  '/:id',
  rateLimiter({ secondsWindow: 60, allowedHits: 30 }),
  businessAuth,
  validateMenuId,
  catchAsync(async (req, res) => {
    const business = req.user._id;
    const id = req.params.id;
    const menu = await service.FindMenuById(business, id);
    res.send(menu);
  }),
);

router.put(
  '/:id',
  rateLimiter({ secondsWindow: 60, allowedHits: 30 }),
  businessAuth,
  validateMenuId,
  validateMenuUpdateInput,
  catchAsync(async (req, res) => {
    const business = req.user._id;
    const data = req.body;
    const id = req.params.id;
    const menu = await service.UpdateMenu(data, business, id);
    res.send(menu);
  }),
);

router.delete(
  '/:id',
  rateLimiter({ secondsWindow: 60, allowedHits: 30 }),
  businessAuth,
  validateMenuId,
  catchAsync(async (req, res) => {
    const business = req.user._id;
    const id = req.params.id;
    await service.DeleteMenu(business, id);
    res.status(204).send();
  }),
);

module.exports = router;