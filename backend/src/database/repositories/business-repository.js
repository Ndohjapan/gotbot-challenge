const en = require('../../../locale/en');
const internalException = require('../../errors/internal-exception');
const notFoundException = require('../../errors/not-found-exception');
const { Businesses } = require('../models');

class BusinessRepository {
  async CreateBusiness({ name, email, password, expiryTime }) {
    try {
      const business = await Businesses.create({
        name,
        email,
        password,
        expiryTime,
      });
      business.code = undefined;
      business.password = undefined;
      return business;
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new internalException(error.errors);
      }
      throw new internalException(en['email-and-business-name-unique']);
    }
  }

  async FindById(id) {
    try {
      const business = await Businesses.findOne({
        _id: id,
        active: true,
      }).lean();
      if (business) {
        business.active = undefined;
      }
      return business;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async FindByEmail(email) {
    try {
      const business = await Businesses.findOne({ email, active: true }).lean();
      if (business) {
        business.active = undefined;
      }
      return business;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async FindByName(name) {
    try {
      const business = await Businesses.findOne({ name, active: true }).lean();
      if (business) {
        business.password = undefined;
        business.code = undefined;
        business.active = undefined;
        business.verified = undefined;
      }
      return business;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async FindByFilter(filter, select = []) {
    try {
      const api_key = await Businesses.findOne({
        ...filter,
        active: true,
      }).select(select);
      return api_key;
    } catch (error) {
      throw notFoundException(en['business-not-found']);
    }
  }

  async UpdateBusiness(id, updateData) {
    try {
      const business = await Businesses.findOneAndUpdate(
        { _id: id, active: true },
        { $set: updateData },
        { new: true },
      ).lean();
      if (business) {
        business.password = undefined;
        business.code = undefined;
        business.active = undefined;
        business.verified = undefined;
        return business;
      }
      throw new notFoundException(en['business-not-found']);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async DeleteBusiness(id) {
    try {
      const business = await Businesses.findOneAndUpdate(
        { _id: id, active: true },
        { $set: { active: false } },
        { new: true },
      ).lean();
      if (business) {
        business.code = undefined;
        business.password = undefined;
        business.active = undefined;
        business.verified = undefined;
        return business;
      }
      throw new notFoundException(en['business-not-found']);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = BusinessRepository;
