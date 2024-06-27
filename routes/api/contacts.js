const express = require("express");
const router = express.Router();
const ctrlContact = require("../../controllers/contacts");

router.get("/", ctrlContact.get);

router.get("/:id", ctrlContact.getById);

router.post("/", ctrlContact.create);

router.put("/:id", ctrlContact.update);

router.patch("/:id/status", ctrlContact.updateStatus);

router.delete("/:id", ctrlContact.remove);

module.exports = router;
