const Contact = require("./schemas/contact");

const getAllContacts = (filter, skip, limit) => {
  return Contact.find(filter).skip(skip).limit(Number(limit));
};

const getContactById = (userId, contactId) => {
  return Contact.findOne({ _id: contactId, owner: userId });
};

const createContact = async (userId, contactData) => {
  try {
    const contact = new Contact({
      ...contactData,
      owner: userId,
    });
    return await contact.save();
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("Contact with this email already exists for this user");
    }
    throw error;
  }
};

const updateContact = (userId, contactId, fields) => {
  return Contact.findOneAndUpdate({ _id: contactId, owner: userId }, fields, {
    new: true,
    runValidators: true,
  });
};

const removeContact = (userId, contactId) => {
  return Contact.findOneAndDelete({ _id: contactId, owner: userId });
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  removeContact,
};
