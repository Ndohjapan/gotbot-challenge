const createException = require('../errors/create-exception');
const en = require('../../locale/en');
const ItemRepository = require('../database/repositories/item-repository');
const notFoundException = require('../errors/not-found-exception');
const CategoryRepository = require('../database/repositories/category-repository');
const MenuRepository = require('../database/repositories/menu-repository');
const updateException = require('../errors/update-exception');

class ItemService {
  constructor() {
    this.repository = new ItemRepository();
    this.categoryrepository = new CategoryRepository();
    this.menurepository = new MenuRepository();
  }

  async CreateItem(itemData, business) {
    try {
      const { name, currency, price, quantity, category, menu, images } =
        itemData;

      const categoryExist = await this.categoryrepository.FindById(
        business,
        menu,
        category,
      );

      if (!categoryExist) {
        throw Error(en['category-not-found']);
      }

      const item = await this.repository.CreateItem({
        name,
        currency,
        price,
        quantity,
        category,
        business,
        menu,
        images,
      });
      item.active = undefined;
      item.__v = undefined;

      await this.categoryrepository.UpdateCategory(category, business, menu, {}, {items: 1});
      await this.menurepository.UpdateMenu(menu, business, {}, {items: 1});

      return item;
    } catch (error) {
      console.log(error);
      throw new createException(error.message);
    }
  }

  async FindItems(business, menu) {
    try {
      const items = await this.repository.FindAll(business, menu);
      return items;
    } catch (error) {
      throw new notFoundException(en['items-not-found']);
    }
  }

  async FindItemById(business, id) {
    try {
      const item = await this.repository.FindById(id, business);
      return item;
    } catch (error) {
      throw new notFoundException(en['items-not-found']);
    }
  }

  async FindItemByCategory(business, menu, category) {
    try {
      const items = await this.repository.FindByCategory(category, menu, business);
      return items;
    } catch (error) {
      throw new notFoundException(en['items-not-found']);
    }
  }

  async UpdateItem(data, business, menu, id) {
    let updateData = {};

    data.business = '';
    data._id = '';
    data.menu = '';

    Object.entries(data).forEach(([key, value]) => {
      if (value != '') {
        updateData[key] = value;
      }
    });

    try {
      const item = await this.repository.UpdateItem(id, business, menu, updateData);

      return item;
    } catch (error) {
      throw new updateException(error.message);
    }
  }

  async DeleteItem(business, id) {
    try {
      const item = await this.repository.DeleteItem(id, business);

      await this.categoryrepository.UpdateCategory(item.category, business, item.menu, {}, {items: -1});

      await this.menurepository.UpdateMenu(item.menu, business, {}, {items: -1});

      return item;
    } catch (error) {
      throw new updateException(error.message);
    }
  }
}

module.exports = { ItemService };
