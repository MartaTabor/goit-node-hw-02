const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Name field is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email",
    "string.empty": "Email field is required",
  }),
  phone: Joi.string().optional(),
  favorite: Joi.boolean().optional(),
});

const favoriteSchema = Joi.object({
  favorite: Joi.boolean().required().messages({
    "any.required": "Missing field favorite",
  }),
});

module.exports = {
  contactSchema,
  favoriteSchema,
};
