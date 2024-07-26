const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
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
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

contactSchema.index({ owner: 1, email: 1 }, { unique: true });

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
