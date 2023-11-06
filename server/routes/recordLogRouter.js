const express = require("express");
const LogSchema = require("../models/log.js");
const authenticateMiddleware = require("../auth/authenticateMiddleware.js");
const router = express.Router();

// Middleware to authenticate routes if needed
router.use(authenticateMiddleware);

// Create a new document
async function createLog(section, action, details, userId) {
  try {
    // Create a new document
    const document = new LogSchema({ section, action, details, userId});

    // Save the document to the database
    await document.save();
  } catch (error) {
    console.error("Error while creating a log:", error);
    throw error; // Re-throw the error for handling in the calling function
  }
};

module.exports = { createLog };