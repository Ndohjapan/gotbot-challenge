const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catch-async');
const { rateLimiter } = require('../middlewares/rate-limiter');
const { CategoryService } = require('../services/category-service');
const { validateCategoryInput, validateCategoryId, validateCategoryQueryMenu, validateCategoryUpdateInput } = require('../middlewares/input-validator/category-validator');
const { businessAuth } = require('../middlewares/protect');
const en = require('../../locale/en');

const service = new CategoryService();

router.post(
  '/',
  rateLimiter({ secondsWindow: 60, allowedHits: 30 }),
  businessAuth,
  validateCategoryInput,
  catchAsync(async (req, res) => {
    const category_data = req.body;
    const id = req.user._id;
    const category = await service.CreateCategory(category_data, id);
    res.send(category);
  }),
);

router.get(
  '/',
  rateLimiter({ secondsWindow: 60, allowedHits: 60 }),
  businessAuth,
  validateCategoryQueryMenu,
  catchAsync(async (req, res) => {
    const id = req.user._id;
    const {menu}  = req.query;
    const categories = await service.FindCategories(id, menu);
    res.send(categories);
  }),
);

router.get(
  '/:id',
  rateLimiter({ secondsWindow: 60, allowedHits: 60 }),
  businessAuth,
  validateCategoryId,
  validateCategoryQueryMenu,
  catchAsync(async (req, res) => {
    const business = req.user._id;
    const id = req.params.id;
    const {menu}  = req.query;
    const category = await service.FindCategoryById(business, menu, id);
    res.send(category);
  }),
);

router.put(
  '/:id',
  rateLimiter({ secondsWindow: 60, allowedHits: 30 }),
  businessAuth,
  validateCategoryId,
  validateCategoryQueryMenu,
  validateCategoryUpdateInput,
  catchAsync(async (req, res) => {
    const business = req.user._id;
    const data = req.body;
    const id = req.params.id;
    const {menu}  = req.query;
    const item = await service.UpdateCategory(data, business, menu, id);
    res.send(item);
  }),
);

router.delete(
  '/:menu/:id',
  rateLimiter({ secondsWindow: 60, allowedHits: 30 }),
  businessAuth,
  validateCategoryId,
  catchAsync(async (req, res) => {
    const business = req.user._id;
    const id = req.params.id;
    const menu = req.params.menu;
    await service.DeleteCategory(business, id, menu);
    res.status(204).send();
  }),
);

module.exports = router;