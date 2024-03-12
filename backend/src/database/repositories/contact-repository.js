const en = require('../../../locale/en');
const internalException = require('../../errors/internal-exception');
const notFoundException = require('../../errors/not-found-exception');
const { Contact } = require('../models');

class ContactRepository {
  async CreateContact({ name, number, role, business }) {
    try {
      const contact = await Contact.create({
        name,
        number,
        role,
        business
      });
      return contact;
    } catch (error) {
      console.log(error);
      throw new internalException(error.errors);
    }
  }

  async FindByFilter(filter, select = []) {
    try {
      const contact = await Contact.find({
        ...filter,
        active: true,
      }).select(select);
      return contact;
    } catch (error) {
      throw notFoundException(en['contact-not-found']);
    }
  }

  async UpdateContact(id, updateData) {
    try {
      const contact = await Contact.findOneAndUpdate(
        { _id: id, active: true },
        { $set: updateData },
        { new: true },
      ).lean();
      if (contact) {
        contact.active = undefined;
        return contact;
      }

      throw new notFoundException(en['contact-not-found']);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = ContactRepository;
