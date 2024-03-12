const en = require('../../../locale/en');
const notFoundException = require('../../errors/not-found-exception');
const { Item } = require('../models');
const mongoose = require('mongoose');

class ItemRepository {
  async CreateItem({
    name,
    business,
    category,
    price,
    currency,
    quantity,
    menu,
    images,
  }) {
    try {
      const item = await Item.create({
        name,
        price,
        currency,
        category,
        quantity,
        business,
        menu,
        images,
      });
      return item;
    } catch (error) {
      console.log(error);
      if (error.name === 'ValidationError') {
        throw new Error(en['item-name-unique']);
      }

      if (error.code === 11000) {
        throw new Error(en['item-name-unique']);
      }
      throw new Error(en['item-creation-error']);
    }
  }

  async FindAll(business, menu) {
    try {
      const aggregate = [
        {
          '$match': {
            'business': new mongoose.Types.ObjectId(business), 
            'menu': new mongoose.Types.ObjectId(menu),
            'active': true
          }
        }, {
          '$lookup': {
            'from': 'categories', 
            'localField': 'category', 
            'foreignField': '_id', 
            'as': 'category'
          }
        }, {
          '$unwind': {
            'path': '$category'
          }
        }, {
          '$group': {
            '_id': '$category.name', 
            'items': {
              '$push': {
                'name': '$name', 
                'price': '$price', 
                'currency': '$currency', 
                'quantity': '$quantity', 
                'images': '$images', 
                'id': '$_id'
              }
            }
          }
        }, {
          '$project': {
            '_id': 0, 
            'category': '$_id', 
            'items': 1
          }
        }
      ];

      const items = await Item.aggregate(aggregate);
      return items;
    } catch (error) {
      console.log(error);
      throw new notFoundException(en['items-not-found']);
    }
  }

  async FindById(id, business) {
    try {
      const item = await Item.findOne({ _id: id, business, active: true })
        .populate(['category', 'menu'])
        .lean();
      if (item) {
        item.active = undefined;
        item.category.active = undefined;
        item.__v = undefined;
        item.category.__v = undefined;
        return item;
      }
      throw new notFoundException(en['items-not-found']);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async FindByCategory(category, menu, business) {
    try {
      const items = await Item.find({ business, category, menu, active: true }).lean();
      return items;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async UpdateItem(id, business, menu, updateData) {
    try {
      const item = await Item.findOneAndUpdate(
        { _id: id, business, menu, active: true },
        { $set: updateData },
        { new: true },
      ).lean();
      if (item) {
        item.active = undefined;
        item.__v = undefined;
        return item;
      }
      throw new notFoundException(en['items-not-found']);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async DeleteItem(id, business) {
    try {
      const item = await Item.findOneAndUpdate(
        { _id: id, business, active: true },
        { $set: { active: false } },
        { new: true },
      );
      return item;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = ItemRepository;
