const express = require("express");
const LogSchema = require("../models/log.js");
const UserSchema = require('../models/User.js');
const authenticateMiddleware = require("../auth/authenticateMiddleware.js");
const router = express.Router();

// Middleware to authenticate routes if needed
router.use(authenticateMiddleware);

// Get all documents
router.get("/get", async (req, res) => {
  try {
    const document = await LogSchema.find();
    // Manually populate student_data using LRN
    const populatedDocuments = await Promise.all(
      document.map(async (doc) => {
        // Fetch student data using LRN
        const userData = await UserSchema.findOne({ _id: doc.userId }).select("_id lastName firstName role");

        return {
          ...doc.toObject(), 
          user_data: userData || null,
        };
      })
    );
    res.json(populatedDocuments);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;