const en = require('../../../locale/en');
const notFoundException = require('../../errors/not-found-exception');
const { Menu } = require('../models');

class MenuRepository {
  async CreateMenu({ name, description, business }) {
    try {
      const menu = await Menu.create({
        name, business, description
      });
      return menu;
    } catch (error) {
      console.log(error.code);
      if (error.name === 'ValidationError') {
        throw new Error(error.errors);
      }

      if (error.code === 11000) {
        throw new Error(en['menu-name-unique']);
      }
      throw new Error(en['menu-creation-error']);
    }
  }

  async FindAll(business) {
    try {
      const categories = await Menu.find(
        { business, active: true },
        { __v: 0, active: 0 },
      );
      return categories;
    } catch (error) {
      throw new notFoundException(en['menu-not-found']);
    }
  }

  async FindById(business, _id) {
    try {
      const menu = await Menu.findOne(
        { business, _id, active: true },
      );
      return menu;
    } catch (error) {
      throw new notFoundException(en['menu-not-found']);
    }
  }

  
  async FindByFilter(filter, select = []) {
    try {
      const menu = await Menu.find({
        ...filter,
        active: true,
      }).select(select);
      return menu;
    } catch (error) {
      throw notFoundException(en['menu-not-found']);
    }
  }

  async UpdateMenu(id, business, updateData={}, incrementData={}) {
    try {
      const menu = await Menu.findOneAndUpdate(
        { _id: id, business, active: true },
        { $set: updateData, $inc: incrementData },
        { new: true },
      ).lean();
      if (menu) {
        menu.active = undefined;
        menu.__v = undefined;
        return menu;
      }
      throw new notFoundException(en['menu-not-found']);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async DeleteMenu(id, business) {
    try {
      const menu = await Menu.findOneAndUpdate(
        { _id: id, business, active: true },
        { $set: { active: false } },
        { new: true },
      ).lean();
      if (menu) {
        menu.active = undefined;
        menu.__v = undefined;
        return menu;
      }
      throw new notFoundException(en['menu-not-found']);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = MenuRepository;
