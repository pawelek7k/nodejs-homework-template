const express = require("express");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
} = require("../../models/contacts");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (e) {
    next(e);
  }
});

router.get("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
  try {
    const { contactId } = req.params;
    const getById = getContactById(contactId);
    if (getById) {
      return res.status(200).json(getById);
    } else {
      return res.status(404).json({ message: "Not found" });
    }
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const contact = { ...req.body };
    const createContact = addContact(contact);
    if () {
      return res.status(201).json({id, name, email, phone})
    } else {
      return res.status(400).json({"message": "missing required name - field"})
    }
  } catch (e) {
    next(e);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const getById = removeContact(contactId);
    if (getById) {
      return res.status(200).json({ message: "contact deleted" });
    } else {
      return res.status(404).json({ message: "Not found" });
    }
  } catch (e) {
    next(e);
  }
});

router.put("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

module.exports = router;
