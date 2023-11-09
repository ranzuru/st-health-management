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
    const userId = req.userData.userId;

    const userData = await UserSchema.findOne({ _id: userId }).select("_id role");

    let document;

switch (userData.role) {
  case "Administrator":
  case "Principal":
    document = await LogSchema.find();
    break;
  case "Office Staff":
    document = await LogSchema.find({
      section: {
        $in: [
          'Student Profile',
          'Faculty Profile',
          'Class Profile',
          'Academic Year',
          'Class Assignment',
          'Medicine Inventory - Item',
          'Medicine Inventory - In',
          'Medicine Inventory - Disposal',
          'Medicine Inventory - Adjustment',
          'Event'
        ]
      }
    });
    break;
  case "IT Staff":
    document = await LogSchema.find({
      section: {
        $in: [
          'User Approval',
          'User Management',
          'Student Profile',
          'Faculty Profile',
          'Class Profile',
          'Academic Year',
          'Medicine Inventory - Item',
          'Medicine Inventory - In',
          'Medicine Inventory - Disposal',
          'Medicine Inventory - Adjustment',
          'Event'
        ]
      }
    });
    break;
  case "Doctor":
    document = await LogSchema.find({
      section: {
        $in: [
          'Student Profile',
          'Faculty Profile',
          'Class Profile',
          'Academic Year',
          'Student Medical',
          'Faculty Medical',
          'Nutritional Status',
          'Dengue Monitoring',
          'Clinic Visit',
          'Medicine Inventory - Item',
          'Medicine Inventory - In',
          'Medicine Inventory - Disposal',
          'Medicine Inventory - Adjustment',
          'Event'
        ]
      }
    });
    break;
  case "District Nurse":
    document = await LogSchema.find({
      section: {
        $in: [
          'Student Profile',
          'Faculty Profile',
          'Class Profile',
          'Academic Year',
          'Student Medical',
          'Faculty Medical',
          'Nutritional Status',
          'Dengue Monitoring',
          'Clinic Visit',
          'Medicine Inventory - Item',
          'Medicine Inventory - In',
          'Medicine Inventory - Disposal',
          'Medicine Inventory - Adjustment',
          'Event'
        ]
      }
    });
    break;
  case "School Nurse":
    document = await LogSchema.find({
      section: {
        $in: [
          'Student Profile',
          'Faculty Profile',
          'Class Profile',
          'Academic Year',
          'Class Assignment',
          'Student Medical',
          'Faculty Medical',
          'Nutritional Status',
          'Dengue Monitoring',
          'Clinic Visit',
          'Medicine Inventory - Item',
          'Medicine Inventory - In',
          'Medicine Inventory - Disposal',
          'Medicine Inventory - Adjustment',
          'Event'
        ]
      }
    });
    break;
  case "Feeding Program Head":
    document = await LogSchema.find({
      section: {
        $in: [
          'Student Profile',
          'Faculty Profile',
          'Class Profile',
          'Academic Year',
          'Class Assignment',
          'Nutritional Status',
          'Clinic Visit',
          'Medicine Inventory - Item',
          'Medicine Inventory - In',
          'Medicine Inventory - Disposal',
          'Medicine Inventory - Adjustment',
          'Event'
        ]
      }
    });
    break;
  case "Medical Program Head":
    document = await LogSchema.find({
      section: {
        $in: [
          'Student Profile',
          'Faculty Profile',
          'Class Profile',
          'Academic Year',
          'Class Assignment',
          'Student Medical',
          'Faculty Medical',
          'Clinic Visit',
          'Medicine Inventory - Item',
          'Medicine Inventory - In',
          'Medicine Inventory - Disposal',
          'Medicine Inventory - Adjustment',
          'Event'
        ]
      }
    });
    break;
  case "Dengue Program Head":
    document = await LogSchema.find({
      section: {
        $in: [
          'Student Profile',
          'Faculty Profile',
          'Class Profile',
          'Academic Year',
          'Class Assignment',
          'Dengue Monitoring',
          'Clinic Visit',
          'Medicine Inventory - Item',
          'Medicine Inventory - In',
          'Medicine Inventory - Disposal',
          'Medicine Inventory - Adjustment',
          'Event'
        ]
      }
    });
    break;
  case "Deworming Program Head":
    document = await LogSchema.find({
      section: {
        $in: [
          'Student Profile',
          'Faculty Profile',
          'Class Profile',
          'Academic Year',
          'Class Assignment',
          'Student Medical',
          'Faculty Medical',
          'Clinic Visit',
          'Medicine Inventory - Item',
          'Medicine Inventory - In',
          'Medicine Inventory - Disposal',
          'Medicine Inventory - Adjustment',
          'Event'
        ]
      }
    });
    break;
  case "Intern":
    document = await LogSchema.find({
      section: {
        $in: [
          'Clinic Visit',
          'Medicine Inventory - Item',
          'Medicine Inventory - In',
          'Medicine Inventory - Disposal',
          'Medicine Inventory - Adjustment',
          'Event'
        ]
      }
    });
    break;
  
  default:
    break;
}

    
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