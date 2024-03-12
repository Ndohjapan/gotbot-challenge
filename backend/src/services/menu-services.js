const createException = require('../errors/create-exception');
const en = require('../../locale/en');
const MenuRepository = require('../database/repositories/menu-repository');
const notFoundException = require('../errors/not-found-exception');
const updateException = require('../errors/update-exception');

class MenuService {
  constructor() {
    this.repository = new MenuRepository();
  }

  async CreateMenu(category_data, business) {
    const { name, description } = category_data;

    try {
      const menu_exists = await this.repository.FindByFilter({
        name,
        business,
      });

      if (menu_exists[0]) {
        throw new createException(en['menu-name-unique']);
      }

      const menu = await this.repository.CreateMenu({
        name,
        business,
        description,
      });
      menu.active = undefined;
      menu.__v = undefined;
      return menu;
    } catch (error) {
      throw new createException(error.message);
    }
  }

  async FindMenues(business) {
    try {
      const menues = await this.repository.FindAll(business);
      return menues;
    } catch (error) {
      throw new notFoundException(en['menu-not-found']);
    }
  }

  async FindMenuById(business, id) {
    try {
      const menu = await this.repository.FindById(business, id);
      if (!menu) {
        throw Error(en['menu-not-found']);
      }
      return menu;
    } catch (error) {
      throw new notFoundException(en['menu-not-found']);
    }
  }

  async UpdateMenu(data, business, id) {
    let updateData = {};

    data.business = '';
    data._id = '';

    Object.entries(data).forEach(([key, value]) => {
      if (value != '') {
        updateData[key] = value;
      }
    });

    try {
      const menu = await this.repository.UpdateMenu(id, business, updateData);

      return menu;
    } catch (error) {
      throw new updateException(error.message);
    }
  }

  async DeleteMenu(business, id) {
    try {
      const category = await this.repository.DeleteMenu(id, business);

      return category;
    } catch (error) {
      throw new updateException(error.message);
    }
  }
}

module.exports = { MenuService };
