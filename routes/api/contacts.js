const express = require("express");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");
const { v4: uuidv4 } = require("uuid");

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
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      let missingField = "";
      if (!name) missingField = "name";
      else if (!email) missingField = "email";
      else if (!phone) missingField = "phone";

      return res
        .status(400)
        .json({ message: `missing required ${missingField} - field` });
    }
    const newContact = {
      id: uuidv4(),
      name,
      email,
      phone,
    };
    addContact(newContact);

    return res.status(201).json(newContact);
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
  try {
    const { id } = req.params;
    const body = req.body;

    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({ message: "missing fields" });
    }

    const updatedContact = updateContact(id, body);

    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(updatedContact);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
