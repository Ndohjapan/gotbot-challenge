const en = require('../../../locale/en');
const notFoundException = require('../../errors/not-found-exception');
const { Category } = require('../models');

class CategoryRepository {
  async CreateCategory({ name, business, image, menu }) {
    try {
      const category = await Category.create({
        name,
        business,
        image,
        menu
      });
      return category;
    } catch (error) {
      console.log(error.code);
      if (error.name === 'ValidationError') {
        throw new Error(error.errors);
      }

      if (error.code === 11000) {
        throw new Error(en['category-name-unique']);
      }
      throw new Error(en['category-creation-error']);
    }
  }

  async FindAll(business, menu) {
    try {
      const categories = await Category.find(
        { business, menu, active: true },
        { __v: 0 },
      );
      return categories;
    } catch (error) {
      throw new notFoundException(en['category-not-found']);
    }
  }

  async FindById(business, menu, _id) {
    try {
      const category = await Category.findOne(
        { business, menu, _id, active: true },
      );
      return category;
    } catch (error) {
      throw new notFoundException(en['category-not-found']);
    }
  }

  async UpdateCategory(id, business, menu, updateData={}, incrementData={}) {
    try {
      const category = await Category.findOneAndUpdate(
        { _id: id, business, menu, active: true },
        { $set: updateData, $inc: incrementData },
        { new: true },
      );
      
      return category;

    } catch (error) {
      if (error.code === 11000) {
        throw new Error(en['category-name-unique']);
      }
      throw new Error(error.message);
    }
  }

  async DeleteCategory(id, business, menu) {
    try {
      await Category.findOneAndUpdate(
        { _id: id, business, menu, active: true },
        { $set: { active: false } },
        { new: true },
      );
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = CategoryRepository;
