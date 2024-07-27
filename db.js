const mongoose = require("mongoose");
require("dotenv").config();

const { MAIN_PORT: mongoURI } = process.env;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Database connection successful");
  } catch (e) {
    console.error(e);
  }
};

const Schema = mongoose.Schema;

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

const ContactDB = mongoose.model("Contact", contactSchema);

module.exports = { connectDB, ContactDB };
