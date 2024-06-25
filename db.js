const mangoose = require("mangoose");
const express = require("express");

const connectDB = async () => {
  try {
    await mangoose.connect("mongodb://localhost:27017/contactsDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connection succesful");
  } catch (e) {
    next(e);
  }
};

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

const contactDB = mongoose.model("Contact", contactSchema);

module.exports = { connectDB, ContactDB };
