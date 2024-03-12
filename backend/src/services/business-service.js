const en = require('../../locale/en');
const BusinessRepository = require('../database/repositories/business-repository');
const ContactRepository = require('../database/repositories/contact-repository');
const notFoundException = require('../errors/not-found-exception');
const updateException = require('../errors/update-exception');

class BusinessService {
  constructor() {
    this.repository = new BusinessRepository();
    this.contact_repository = new ContactRepository();
  }

  async FindBusinessById(id) {
    try {
      const business = await this.repository.FindById(id);
      if (!business) {
        throw Error(en['business-not-found']);
      }
      business.password = undefined;
      business.verified = undefined;
      business.expiryTime = undefined;

      const contact = await this.contact_repository.FindByFilter({business: id});

      return {business, contact};
    } catch (error) {
      throw new notFoundException(en['business-not-found']);
    }
  }

  async UpdateBusiness(data, id) {
    let updateData = {};

    data.email = '';
    data.password = '';
    data.verified = '';
    data.active = '';
    data.profileComplete = '';

    try {
      if (data.name) {
        const nameExists = await this.repository.FindByFilter({name: data.name});

        if (nameExists && nameExists.id != id) {
          throw new Error(en['business-name-unique']);
        }
      }

      Object.entries(data).forEach(([key, value]) => {
        if (value != '') {
          updateData[key] = value;
        }
      });

      const business = await this.repository.UpdateBusiness(id, updateData);

      return business;
    } catch (error) {
      throw new updateException(error.message);
    }
  }

  async UpdateContact(data, id, contact_id) {
    let updateData = {};

    data.email = '';
    data.password = '';
    data.verified = '';
    data.active = '';
    data.profileComplete = '';

    try {

      const business = await this.repository.FindById(id);
      if (!business) {
        throw Error(en['business-not-found']);
      }

      Object.entries(data).forEach(([key, value]) => {
        if (value != '') {
          updateData[key] = value;
        }
      });

      const contact = await this.contact_repository.UpdateContact(contact_id, updateData);

      return contact;
    } catch (error) {
      throw new updateException(error.message);
    }
  }
}

module.exports = { BusinessService };
