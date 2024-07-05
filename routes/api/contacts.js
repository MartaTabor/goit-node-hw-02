const express = require("express");
const router = express.Router();
const ctrlContact = require("../../controllers/contacts");
const { validateBody } = require("../../validation/validation");
const {
  contactSchema,
  favoriteSchema,
} = require("../../validation/contactValidation");
const auth = require("../../middlewares/jwtMiddleware");

router.use(auth);

router.get("/", ctrlContact.get);

router.get("/:id", ctrlContact.getById);

router.post("/", validateBody(contactSchema), ctrlContact.create);

router.put("/:id", validateBody(contactSchema), ctrlContact.update);

router.patch(
  "/:id/favorite",
  validateBody(favoriteSchema),
  ctrlContact.updateStatus
);

router.delete("/:id", ctrlContact.remove);

module.exports = router;
