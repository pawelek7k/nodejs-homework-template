const fs = require("fs/promises");
const path = require("path");
const contactsPath = path.join(__dirname, "contacts.json");
const { v4: uuidv4 } = require("uuid");
const { ContactDB } = require("../db");

const listContacts = async () => {
  try {
    const contacts = await ContactDB.find({});
    return contacts;
  } catch (error) {
    console.error("Error reading contacts file", error);
    throw error;
  }
};

const getContactById = async (contactId) => {
  try {
    const contact = await ContactDB.findById(contactId);
    return contact || null;
  } catch (error) {
    console.error("Error getting contact by ID:", error);
    throw error;
  }
};

const removeContact = async (contactId) => {
  try {
    const deletedContact = await ContactDB.findByIdAndDelete(contactId);
    return deletedContact;
  } catch (error) {
    console.error("Error removing contact:", error);
    throw error;
  }
};

const addContact = async (body) => {
  try {
    const newContact = new ContactDB(body);
    await newContact.save();
    return newContact;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateContact = async (contactId, body) => {
  try {
    const updatedContact = await ContactDB.findByIdAndUpdate(contactId, body, {
      new: true,
    });
    if (!contact) {
      return null;
    }
    return updateContact;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
