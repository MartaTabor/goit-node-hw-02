const fs = require("fs").promises;
const path = require("path");
const contactsPath = path.join(__dirname, "..", "models", "contacts.json");

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath);
    return JSON.parse(data);
  } catch (error) {
    console.error("Error fetching contacts: ", error);
    throw error;
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    return contacts.find((contact) => contact.id === String(contactId)) || null;
  } catch (error) {
    console.error("Error finding contact: ", error);
    throw error;
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === contactId);
    if (index === -1) return null;

    const [removedContact] = contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return removedContact;
  } catch (error) {
    console.error("Error removing contact: ", error);
    throw error;
  }
};

const addContact = async (body) => {};

const updateContact = async (contactId, body) => {};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
