const createException = require('../errors/create-exception');
const en = require('../../locale/en');
const CategoryRepository = require('../database/repositories/category-repository');
const notFoundException = require('../errors/not-found-exception');
const updateException = require('../errors/update-exception');
const MenuRepository = require('../database/repositories/menu-repository');
const { Menu } = require('../database/models');
const ItemRepository = require('../database/repositories/item-repository');

class CategoryService {
  constructor() {
    this.repository = new CategoryRepository();
    this.menu_repository = new MenuRepository();
    this.item_repository = new ItemRepository();
  }


  async CreateCategory(category_data, business) {
    const {name, image, menu} = category_data;

    try {
      const category = await this.repository.CreateCategory({name, business, image, menu});
      category.active = undefined;
      category.__v = undefined;
      await this.menu_repository.UpdateMenu(menu, business.toString(), {}, {categories:1});
      return category;
    } catch (error) {
      throw new createException(error.message);
    }
  }

  async FindCategories(business, menu){
    try {
      const categories = await this.repository.FindAll(business, menu);
      return categories;
    } catch (error) {
      throw new notFoundException(en['category-not-found']);
    }
  }

  async FindCategoryById(business, menu, id){
    try {
      const category = await this.repository.FindById(business, menu, id);
      if(!category){
        throw Error(en['category-not-found']);
      }
      return category;
    } catch (error) {
      throw new notFoundException(en['category-not-found']);
    }
  }

  async UpdateCategory(data, business, menu, id){

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
      const category = await this.repository.UpdateCategory(id, business, menu, updateData);
    
      return category;
        
    } catch (error) {
      throw new updateException(error.message);        
    } 
  }

  async DeleteCategory(business, id, menu){
    try {
      const category = await this.repository.DeleteCategory(id, business, menu);
      const items = await this.item_repository.FindByCategory(id);
      await this.menu_repository.UpdateMenu(menu, business.toString(), {}, {categories:-1, items: -(items.length)});
      return category;
          
    } catch (error) {
      throw new updateException(error.message);        
    } 
  }

}

module.exports = { CategoryService };
