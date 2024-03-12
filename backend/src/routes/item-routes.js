const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catch-async');
const { rateLimiter } = require('../middlewares/rate-limiter');
const { ItemService } = require('../services/item-services');
const { businessAuth } = require('../middlewares/protect');
const {
  validateItemInput, validateItemUpdateInput, validateItemId, validateItemQueryMenu, validateItemQueryCategory,
} = require('../middlewares/input-validator/item-validator');
const en = require('../../locale/en');

const service = new ItemService();

router.post(
  '/',
  rateLimiter({ secondsWindow: 60, allowedHits: 30 }),
  businessAuth,
  validateItemInput,
  catchAsync(async (req, res) => {
    const itemData = req.body;
    const id = req.user._id;
    const item = await service.CreateItem(itemData, id);
    res.send(item);
  }),
);

router.get(
  '/',
  rateLimiter({ secondsWindow: 60, allowedHits: 60 }),
  businessAuth,
  validateItemQueryMenu,
  validateItemQueryCategory,
  catchAsync(async (req, res) => {
    const id = req.user._id;
    const {menu, category} = req.query;

    const items = category ? await service.FindItemByCategory(id, menu, category) : await service.FindItems(id, menu); 

    res.send(items);
  }),
);

router.get(
  '/all',
  validateItemQueryMenu,
  validateItemQueryCategory,
  catchAsync(async (req, res) => {
    const {menu, business} = req.query;

    const items = await service.FindItems(business, menu); 

    res.send(items);
  }),
);

router.get(
  '/:id',
  rateLimiter({ secondsWindow: 60, allowedHits: 60 }),
  businessAuth,
  validateItemId,
  catchAsync(async (req, res) => {
    const business = req.user._id;
    const id = req.params.id;
    const items = await service.FindItemById(business, id);
    res.send(items);
  }),
);

router.put(
  '/:id',
  rateLimiter({ secondsWindow: 60, allowedHits: 30 }),
  businessAuth,
  validateItemId,
  validateItemUpdateInput,
  validateItemQueryMenu,
  catchAsync(async (req, res) => {
    const business = req.user._id;
    const data = req.body;
    const id = req.params.id;
    const {menu} = req.query;
    const item = await service.UpdateItem(data, business, menu, id);
    res.send(item);
  }),
);

router.delete(
  '/:id',
  rateLimiter({ secondsWindow: 60, allowedHits: 30 }),
  businessAuth,
  catchAsync(async (req, res) => {
    const business = req.user._id;
    const id = req.params.id;
    await service.DeleteItem(business, id);
    res.status(204).send({message: en['item-deleted']});
  }),
);

module.exports = router;
