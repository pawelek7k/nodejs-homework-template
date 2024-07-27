const { ContactDB } = require("../db");

const listContacts = async (userId) => {
  try {
    const contacts = await ContactDB.find({ owner: userId });
    return contacts;
  } catch (error) {
    console.error("Error reading contacts file", error);
    throw error;
  }
};

const getContactById = async (contactId, userId) => {
  try {
    const contact = await ContactDB.findOne({
      _id: contactId,
      owner: userId,
    });
    return contact || null;
  } catch (error) {
    console.error("Error getting contact by ID:", error);
    throw error;
  }
};

const removeContact = async (contactId, userId) => {
  try {
    const deletedContact = await ContactDB.findOneAndDelete({
      _id: contactId,
      owner: userId,
    });
    return deletedContact;
  } catch (error) {
    console.error("Error removing contact:", error);
    throw error;
  }
};

const addContact = async (body, userId) => {
  try {
    const newContact = new ContactDB({ ...body, owner: userId });
    await newContact.save();
    return newContact;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateContact = async (contactId, body, userId) => {
  try {
    const updatedContact = await ContactDB.findOneAndUpdate(
      {
        _id: contactId,
        owner: userId,
      },
      body,
      { new: true }
    );
    if (!updatedContact) {
      return null;
    }
    return updatedContact;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateFavoriteStatus = async (contactId, favorite, userId) => {
  try {
    const updatedContact = await ContactDB.findOneAndUpdate(
      {
        _id: contactId,
        owner: userId,
      },
      { favorite },
      { new: true }
    );
    return updatedContact;
  } catch (error) {
    console.error("Error updating favorite status:", error);
    throw error;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateFavoriteStatus,
};
