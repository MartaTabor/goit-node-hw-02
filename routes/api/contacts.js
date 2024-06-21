const express = require("express");
const {
  listContacts,
  getContactById,
  removeContact,
} = require("../../models/contacts");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (contact) {
      res.json(contact);
    } else {
      res.status(404).json({ message: "Not Found" });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const removedContact = await removeContact(contactId);

    if (removedContact) {
      res.status(200).json({ message: "Contact Deleted" });
    } else {
      res.status(404).json({ message: "Not Found" });
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

module.exports = router;
