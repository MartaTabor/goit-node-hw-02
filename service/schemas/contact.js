const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contact = new Schema({
  name: {
    type: String,
    required: [true, "Name Field is required"],
    minLength: 2,
    maxLength: 25,
  },
  email: {
    type: String,
    required: [true, "E-mail Field is required"],
    unique: true,
    validate: {
      validator: function (v) {
        return /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
      },
      message: "Please enter a valid email",
    },
  },
  phone: {
    type: String,
    required: [true, "Phone Field is required"],
  },
});

const Contact = mongoose.model("contact", contact);

contact.index({ name: 1 });

module.export = Contact;
