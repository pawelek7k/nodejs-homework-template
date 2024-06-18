const fs = require("fs/promises");
const contactsPath = (__dirname, "contacts.js");
const { v4: uuidv4 } = require("uuid");

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading contacts file", error);
    throw error;
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    const contact = contacts.find((c) => c.id === contactId);
    return contact || null;
  } catch (error) {
    console.error("Error getting contact by ID:", error);
    throw error;
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();
    const updatedContacts = contacts.filter((c) => c.id !== contactId);
    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));
    return updatedContacts;
  } catch (error) {
    console.error("Error removing contact:", error);
    throw error;
  }
};

const addContact = async (body) => {
  try {
    const data = fs.readFileSync("contacts.json", "utf-8");
    const contacts = JSON.parse(data);

    const newId = uuidv4();
    const newContact = { id: newId, ...body };

    contacts.push(newContact);

    fs.writeFileSync("contacts.json", JSON.stringify(contacts, null, 4));

    return newContact;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const updateContact = async (contactId, body) => {
  try {
    const data = fs.readFileSync("contacts.json", "utf-8");
    const contacts = JSON.parse(data);

    const contact = contacts.find((contact) => contact.id === contactId);
    if (!contact) {
      return null;
    }

    Object.assign(contact, body);

    fs.writeFileSync("contacts.json", JSON.stringify(contacts, null, 4));

    return contact;
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
